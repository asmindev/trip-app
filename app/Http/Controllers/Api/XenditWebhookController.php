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
        // 1. Verify Token
        if ($request->header('x-callback-token') !== config('services.xendit.webhook_token')) {
            return response()->json(['message' => 'Invalid Verification Token'], 403);
        }

        $data = $request->all();
        Log::info('Xendit Webhook Received:', $data);

        // 2. Identify Test Events
        if (($data['business_id'] ?? '') === 'sample_business_id') {
            Log::info('Xendit Webhook: Test Event detected and ignored.');
            return response()->json(['message' => 'Test Event Processed']);
        }

        // 3. Robust External ID Extraction
        $externalId = $data['data']['reference_id']
                   ?? $data['external_id']
                   ?? $data['reference_id']
                   ?? null;

        if (!$externalId) {
            Log::warning('Xendit Webhook: No External ID found in payload');
            return response()->json(['message' => 'No External ID'], 400);
        }

        // 4. Find Payment (Primary: External ID, Fallback: Payment Method ID)
        $payment = Payment::where('external_id', $externalId)->first();

        if (!$payment) {
            $dataId = $data['data']['id'] ?? null;
            if ($dataId && str_starts_with($dataId, 'pm-')) {
                 Log::info("Xendit Webhook: Retrying lookup via Payment Method ID: $dataId");
                 $payment = Payment::whereJsonContains('gateway_response->payment_method->id', $dataId)->first();
            }
        }

        if (!$payment) {
            Log::warning("Xendit Webhook: Payment not found. ExtID: $externalId");
            return response()->json(['message' => 'Payment not found'], 404);
        }

        // 5. Process Payment Status
        try {
            $this->paymentService->syncPaymentStatus($payment);
        } catch (\Exception $e) {
            Log::error('Webhook processing failed: ' . $e->getMessage());
            return response()->json(['message' => 'Internal Server Error'], 500);
        }

        // 6. Broadcast Update
        $payment->refresh();
        broadcast(new PaymentUpdated($payment));

        return response()->json(['message' => 'Success']);
    }
}
