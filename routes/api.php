<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/webhooks/xendit', [\App\Http\Controllers\Api\XenditWebhookController::class, 'handle']);

Route::prefix('payment')->group(function () {
    Route::post('/pay', [\App\Http\Controllers\Api\PaymentController::class, 'pay']);
});
