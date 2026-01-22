<?php

namespace App\Http\Controllers\Api;

use App\Events\PaymentUpdated;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class XenditWebhookController extends Controller
{
    protected $paymentService;

    public function __construct(\App\Services\PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function handle(Request $request)
    {
        $token = $request->header('x-callback-token');
        $verificationToken = env('XENDIT_WEBHOOK_VERIFICATION_TOKEN');

        if ($token !== $verificationToken) {
            return response()->json(['message' => 'Invalid Verification Token'], 403);
        }

        $data = $request->all();
        Log::info('Xendit Webhook Received:', $data);

        $event = $data['event'] ?? null;

        // Robust External ID Extraction
        // 1. Payment Request / V3 (data.reference_id)
        // 2. Legacy Invoice / FVA (external_id)
        // 3. Fallback (reference_id)
        $externalId = $data['data']['reference_id']
                   ?? $data['external_id']
                   ?? $data['reference_id']
                   ?? null;

        if (!$externalId) {
            Log::warning('Xendit Webhook: No External ID found in payload');
            return response()->json(['message' => 'No External ID'], 400);
        }

        $payment = Payment::where('external_id', $externalId)->first();

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        // Delegate to service to handle transaction, locking, and creating/updating booking status
        // This calculates the status from Xendit API directly (safest)
        try {
            $this->paymentService->syncPaymentStatus($payment);
        } catch (\Exception $e) {
            Log::error('Webhook processing failed: ' . $e->getMessage());
            return response()->json(['message' => 'Internal Server Error'], 500);
        }

        // Broadcast Event is done in Service or we can do it here if service doesn't?
        // Service updates DB. We might want to broadcast here.
        // Actually, let's keep it simple. If service updates, it's done.
        // Broadcasting should probably be inside the service too, or monitored via Observer.
        // For now, let's re-dispatch the event if needed, but since we don't know if it CHANGED,
        // we might spam events.
        // Better: The Service handles the business logic. We just return success.

        broadcast(new PaymentUpdated($payment));

        return response()->json(['message' => 'Success']);
    }
}
