<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Payment;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;
use Xendit\PaymentMethod\QRCodeParameters;
use Xendit\PaymentRequest\PaymentRequestApi;
use Illuminate\Support\Facades\DB;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Logo\Logo;
use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;

class PaymentService
{
    protected $invoiceApi;
    protected $paymentRequestApi;

    public function __construct()
    {
        Configuration::setXenditKey(env('XENDIT_SECRET_KEY'));
        $this->invoiceApi = new InvoiceApi();
        $this->paymentRequestApi = new PaymentRequestApi();
    }

    public function createVirtualAccount(Booking $booking, string $bankCode)
    {
        return $this->createGenericPayment($booking, 'VIRTUAL_ACCOUNT', $bankCode);
    }

    public function createQrCode(Booking $booking)
    {
        return $this->createGenericPayment($booking, 'QR_CODE', 'QRIS');
    }

    protected function createGenericPayment(Booking $booking, string $type, string $channelInfo)
    {
        // 1. Check existing pending payment
        $existingPayment = $this->getExistingPayment($booking, $type);
        if ($existingPayment) {
            return $existingPayment;
        }

        $externalId = match ($type) {
            'VIRTUAL_ACCOUNT' => "VA-" . $booking->booking_code . "-" . time(),
            'QR_CODE' => "QR-" . $booking->booking_code . "-" . time(),
            default => "PAY-" . $booking->booking_code . "-" . time(),
        };

        // Construct Payment Method Parameters
        $paymentMethod = $this->buildPaymentMethod($type, $channelInfo, $booking);

        $paymentRequestParams = new \Xendit\PaymentRequest\PaymentRequestParameters([
            'reference_id' => $externalId,
            'amount' => $booking->total_amount,
            'currency' => \Xendit\PaymentRequest\PaymentRequestCurrency::IDR,
            'payment_method' => $paymentMethod
        ]);

        try {
            // Retrieve Payment Request Result from Xendit
            $resultObj = $this->paymentRequestApi->createPaymentRequest(null, null, null, $paymentRequestParams);
            $result = json_decode(json_encode($resultObj), true);

            // Extract Payment Code (VA Number or QR String)
            $paymentCode = $this->extractPaymentCode($result, $type);
            $rawExpirationDate = $result['payment_method']['virtual_account']['channel_properties']['expires_at']
                ?? $result['payment_method']['qr_code']['channel_properties']['expires_at']
                ?? now()->addMinutes(config('app.payment_timeout_minutes', 10));

            // Ensure MySQL DateTime Format (Y-m-d H:i:s)
            $expirationDate = $rawExpirationDate instanceof \Carbon\Carbon
                ? $rawExpirationDate->setTimezone(config('app.timezone'))->format('Y-m-d H:i:s')
                : \Carbon\Carbon::parse($rawExpirationDate)->setTimezone(config('app.timezone'))->format('Y-m-d H:i:s');

            // Store in Database
            return DB::transaction(function () use ($booking, $externalId, $result, $type, $channelInfo, $paymentCode, $expirationDate) {
                 return Payment::updateOrCreate(
                    ['booking_id' => $booking->id],
                    [
                        'external_id' => $externalId,
                        'xendit_id' => $result['id'],
                        'status' => 'PENDING',
                        'amount' => $booking->total_amount,
                        'payment_type' => $type,
                        'payment_channel' => $channelInfo,
                        'payment_code' => $paymentCode,
                        'expiration_date' => $expirationDate,
                        'gateway_response' => $result,
                    ]
                );
            });

        } catch (\Exception $e) {
            Log::error("Failed to create $type payment: " . $e->getMessage());
            throw $e;
        }
    }

    protected function buildPaymentMethod(string $type, string $channelInfo, Booking $booking)
    {
        if ($type === 'VIRTUAL_ACCOUNT') {
            $channelProperties = new \Xendit\PaymentRequest\VirtualAccountChannelProperties([
                'customer_name' => $booking->user->name ?? 'Guest User',
                'expires_at' => now()->addMinutes(config('app.payment_timeout_minutes', 10))->toIso8601String(),
            ]);

            $virtualAccount = new \Xendit\PaymentRequest\VirtualAccountParameters([
                'channel_code' => $channelInfo,
                'channel_properties' => $channelProperties,
            ]);

            return new \Xendit\PaymentRequest\PaymentMethodParameters([
                'type' => 'VIRTUAL_ACCOUNT',
                'reusability' => 'ONE_TIME_USE',
                'virtual_account' => $virtualAccount,
            ]);
        } elseif ($type === 'QR_CODE') {
             $qrCode = new QRCodeParameters([
                'channel_code' => 'QRIS',
            ]);

            return new \Xendit\PaymentRequest\PaymentMethodParameters([
                'type' => 'QR_CODE',
                'reusability' => 'ONE_TIME_USE',
                'qr_code' => $qrCode,
            ]);
        }

        throw new \InvalidArgumentException("Unsupported payment type: $type");
    }

    protected function extractPaymentCode(array $result, string $type)
    {
        if ($type === 'VIRTUAL_ACCOUNT') {
             return $result['payment_method']['virtual_account']['channel_properties']['virtual_account_number'] ?? null;
        } elseif ($type === 'QR_CODE') {
             return $result['payment_method']['qr_code']['channel_properties']['qr_string'] ?? null;
        }
        return null;
    }

    protected function getExistingPayment(Booking $booking, string $type = null)
    {
        $query = Payment::where('booking_id', $booking->id)
            ->where('status', 'PENDING')
            ->where('expiration_date', '>', now());

        if ($type) {
            $query->where('payment_type', $type);
        }

        return $query->first();
    }

    public function simulatePayment(string $paymentRequestId)
    {
        Log::info('Payment simulation request: ' . $paymentRequestId);
        try {
            // Fetch payment to get amount
            $payment = Payment::where('xendit_id', $paymentRequestId)->firstOrFail();

            $client = new Client();
            $apiKey = env('XENDIT_SECRET_KEY');
            $base64Key = base64_encode($apiKey . ':');

            $response = $client->post("https://api.xendit.co/v3/payment_requests/{$paymentRequestId}/simulate", [
                'headers' => [
                    'Authorization' => 'Basic ' . $base64Key,
                    'Content-Type' => 'application/json',
                    'api-version' => '2024-11-11',
                ],
                'json' => ['amount' => (int)$payment->amount],
            ]);

            $result = json_decode($response->getBody(), true);
            Log::info('Payment simulation result: ' . json_encode($result));
            return $result;

        } catch (\Exception $e) {
            Log::error('Payment simulation failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getStatus(string $paymentRequestId)
    {
        Log::info('Payment status request: ' . $paymentRequestId);
        try {
            return $this->paymentRequestApi->getPaymentRequestByID($paymentRequestId);
        } catch (\Exception $e) {
             Log::error('Failed to get payment status: ' . $e->getMessage());
             throw $e;
        }
    }

    public function syncPaymentStatus(Payment $payment)
    {
        try {
            $xenditPayment = $this->getStatus($payment->xendit_id);
            Log::info('Syncing payment status: ' . json_encode($xenditPayment));

            $status = $xenditPayment['status'] ?? null;

            if ($status) {
                return DB::transaction(function () use ($payment, $status, $xenditPayment) {
                    // Lock payment row to prevent concurrent webhook processing
                    $payment = Payment::lockForUpdate()->find($payment->id);
                    $booking = Booking::lockForUpdate()->find($payment->booking_id);

                    // Idempotency Check: unnecessary if status matches
                    if ($payment->status === 'PAID' && $status === 'SUCCEEDED') {
                        return 'SUCCEEDED';
                    }

                    if ($status === 'SUCCEEDED') {
                        // CRITICAL: Check for overselling / late payment
                        // If booking is already EXPIRED or CANCELLED, we must check seat availability
                        // before reactivating it.
                        if (in_array($booking->payment_status, ['EXPIRED', 'CANCELLED', 'FAILED'])) {

                            $schedule = $booking->schedule()->lockForUpdate()->first();

                            if ($schedule->available_seats < $booking->total_passengers) {
                                // Overselling detected!
                                // Mark payment as PAID but booking as REFUND_NEEDED
                                $payment->update([
                                    'status' => 'PAID',
                                    'paid_at' => now(),
                                    'gateway_response' => $xenditPayment,
                                ]);

                                $booking->update([
                                    'payment_status' => 'REFUND_NEEDED', // New status needed in Enum/DB
                                    // Do NOT decrement seats
                                ]);

                                Log::alert("OVERSELLING PREVENTED: Booking {$booking->booking_code} received payment but no seats available. Marked for REFUND.");
                                return 'SUCCEEDED_NO_SEATS';
                            }

                            // If seats available, reclaim them
                            $schedule->decrement('available_seats', $booking->total_passengers);
                        }

                        $payment->update([
                            'status' => 'PAID',
                            'paid_at' => now(),
                            'gateway_response' => $xenditPayment,
                        ]);

                        $booking->update([
                            'payment_status' => 'PAID',
                            'expires_at' => null, // Clear expiration
                        ]);

                    } elseif ($status === 'EXPIRED') {
                        if ($payment->status !== 'EXPIRED') {
                            $payment->update([
                                'status' => 'EXPIRED',
                                'gateway_response' => $xenditPayment,
                            ]);

                            // Only expire booking if it's not already paid (race condition protection)
                            if ($booking->payment_status !== 'PAID') {
                                $booking->update(['payment_status' => 'EXPIRED']);
                                // Note: Seats are released by the Scheduler, or we can ensure they are released here if not already.
                                // But usually, expiration happens via Scheduler which releases seats.
                                // If Xendit says expired, it just means THIS payment link expired.
                                // The booking might still be valid if user generates a NEW payment link.
                                // So we should NOT necessarily expire the booking unless booking time is also up.
                                // However, simple flow: expire booking too.
                            }
                        }
                    } elseif ($status === 'FAILED') {
                         $payment->update([
                            'status' => 'FAILED',
                            'gateway_response' => $xenditPayment,
                         ]);

                         if ($booking->payment_status !== 'PAID') {
                             $booking->update(['payment_status' => 'FAILED']);
                         }
                    }

                    return $status;
                });
            }
        } catch (\Exception $e) {
            Log::error('Failed to sync payment status: ' . $e->getMessage());
            throw $e; // Re-throw to allow retry mechanism if called from Queue
        }

        return null;
    }

    public function generateQrCodeImage(string $qrString)
    {
        try {
            $logoPath = public_path('apple-touch-icon.png');

            // Check if logo exists
            if (!file_exists($logoPath)) {
                $logoPath = null;
            }

            $qrCode = new QrCode(
                data: $qrString,
                encoding: new Encoding('UTF-8'),
                errorCorrectionLevel: ErrorCorrectionLevel::High,
                size: 300,
                margin: 10,
                roundBlockSizeMode: RoundBlockSizeMode::Margin,
                foregroundColor: new Color(0, 0, 0),
                backgroundColor: new Color(255, 255, 255)
            );

            $logo = null;
            if ($logoPath) {
                $logo = new Logo(
                    path: $logoPath,
                    resizeToWidth: 50,
                    punchoutBackground: true
                );
            }

            $writer = new PngWriter();
            $result = $writer->write($qrCode, $logo);

            return $result->getDataUri();
        } catch (\Exception $e) {
            Log::error('QR Code generation failed: ' . $e->getMessage());
            return null;
        }
    }
}
