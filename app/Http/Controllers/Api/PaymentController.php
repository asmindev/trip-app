<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Xendit\ApiException;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function pay(Request $request)
    {
        $request->validate([
            'booking_code' => 'required|exists:bookings,booking_code',
            'payment_method' => 'required|string',
        ]);

        $booking = Booking::where('booking_code', $request->booking_code)->firstOrFail();
        $method = strtoupper($request->payment_method);

        try {
            $payment = null;

            if ($method === 'QRIS') {
                $payment = $this->paymentService->createQrCode($booking);
            } elseif (in_array($method, ['BCA', 'BRI', 'MANDIRI', 'BNI', 'PERMATA', 'CIMB', 'SAHABAT_SAMPOERNA'])) {
                $payment = $this->paymentService->createVirtualAccount($booking, $method);
            } else {
                return response()->json(['message' => 'Payment method not supported'], 400);
            }

            return response()->json([
                'payment' => $payment,
                'message' => 'Payment initiated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Payment creation failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Payment creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function simulation()
    {
        return Inertia::render('dev/payment/simulation');
    }

    public function simulate(Request $request)
    {
        Log::info('simulate payment request: ' . $request->payment_request_id);
        $request->validate([
            'payment_request_id' => 'required|string',
        ]);

        try {
            $paymentRequestId = trim($request->payment_request_id);
            $result = $this->paymentService->simulatePayment($paymentRequestId);
            Log::info('simulate payment result: ' . json_encode($result));

            return redirect()->back()->with('success', 'Payment simulated successfully! Response: ' . json_encode($result));
        } catch (\Xendit\ApiException $e) {
            Log::error('simulate payment failed (API): ' . $e->getMessage());
            Log::error('Response Header: ' . json_encode($e->getResponseHeaders()));
            Log::error('Response Body: ' . $e->getResponseBody());
            return redirect()->back()->with('error', 'Simulation failed (API): ' . $e->getMessage() . ' - ' . $e->getResponseBody());
        } catch (\Exception $e) {
            Log::error('simulate payment failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Simulation failed: ' . $e->getMessage());
        }
    }
}
