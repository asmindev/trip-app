<?php

namespace App\Http\Controllers\Api;

use App\Events\PaymentUpdated;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class XenditWebhookController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
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

        // Handle Xendit Test Webhook (Dashboard "Test" button)
        if (($data['business_id'] ?? '') === 'sample_business_id') {
            Log::info('Xendit Webhook: Test Event detected and ignored.');
            return response()->json(['message' => 'Test Event Processed']);
        }

        $payment = Payment::where('external_id', $externalId)->first();

        if (!$payment) {
            Log::info("Xendit Webhook: Payment not found by External ID: $externalId. Trying fallback via Payment Method ID...");

            // Fallback: Check if this is a Payment Method event (e.g., payment_method.expired)
            // The 'id' in data might match 'gateway_response->payment_method->id'
            $dataId = $data['data']['id'] ?? null;
            if ($dataId && str_starts_with($dataId, 'pm-')) {
                 $payment = Payment::whereJsonContains('gateway_response->payment_method->id', $dataId)->first();
            }
        }

        if (!$payment) {
            Log::warning("Xendit Webhook: Payment not found for External ID: $externalId OR Data ID: " . ($data['data']['id'] ?? 'N/A'));
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
