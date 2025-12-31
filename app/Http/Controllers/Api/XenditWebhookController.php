<?php

namespace App\Http\Controllers\Api;

use App\Events\PaymentUpdated;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class XenditWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $token = $request->header('x-callback-token');
        $verificationToken = env('XENDIT_WEBHOOK_VERIFICATION_TOKEN');

        if ($token !== $verificationToken) {
            return response()->json(['message' => 'Invalid Verification Token'], 403);
        }

        $data = $request->all();
        // Log::info('Xendit Webhook:', $data);

        // We are interested in "invoice.paid" or "invoice.expired"
        // Adjust based on Xendit's actual payload structure (usually just the object for Invoice callback)
        // If it's the newer callback version, check documentation. Assuming Invoice Callback.

        $event = $data['event'] ?? null;
        $status = null;
        $externalId = null;

        // Handle Payment Request Events
        if ($event === 'payment.succeeded') {
            $status = 'PAID';
            $externalId = $data['data']['reference_id'] ?? null;
            $paymentMethod = $data['data']['payment_method']['type'] ?? null;
        } elseif ($event === 'payment.failed') {
            $status = 'FAILED';
            $externalId = $data['data']['reference_id'] ?? null;
        } elseif ($event === 'payment_method.expired') {
            $status = 'EXPIRED';
            $externalId = $data['data']['reference_id'] ?? null;
        } else {
            // Fallback for Invoice Legacy (if any) or unknown
            $externalId = $data['external_id'] ?? null;
            $status = $data['status'] ?? null;
        }

        if (!$externalId) {
            return response()->json(['message' => 'No External ID'], 400);
        }

        $payment = Payment::where('external_id', $externalId)->first();

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        // Avoid re-processing if already final
        if (in_array($payment->status, ['PAID', 'EXPIRED', 'FAILED'])) {
             return response()->json(['message' => 'Already processed']);
        }

        if ($status === 'PAID') {
            $payment->update([
                'status' => 'PAID',
                'paid_at' => now(),
                'gateway_response' => $data,
            ]);

            // Update Booking status too
             $payment->booking()->update(['payment_status' => 'PAID']);

        } elseif ($status === 'EXPIRED') {
            $payment->update([
                'status' => 'EXPIRED',
                'gateway_response' => $data,
            ]);
        } elseif ($status === 'FAILED') {
            $payment->update([
                'status' => 'FAILED',
                'gateway_response' => $data,
            ]);
        }

        // Broadcast Event
        broadcast(new PaymentUpdated($payment));

        return response()->json(['message' => 'Success']);
    }
}
