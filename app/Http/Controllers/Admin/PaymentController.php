<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class PaymentController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Payment::class);

        $payments = QueryBuilder::for(Payment::class)
            ->with(['booking.user', 'booking.schedule.ship', 'booking.schedule.route'])
            ->allowedFilters([
                'external_id',
                AllowedFilter::callback('q', function ($query, $value) {
                    $query->where('external_id', 'like', "%{$value}%")
                          ->orWhere('xendit_id', 'like', "%{$value}%")
                          ->orWhereHas('booking', function ($q) use ($value) {
                              $q->where('booking_code', 'like', "%{$value}%")
                                ->orWhereHas('user', function ($u) use ($value) {
                                    $u->where('name', 'like', "%{$value}%");
                                });
                          });
                }),
                AllowedFilter::exact('status'),
                AllowedFilter::exact('payment_method'),
                AllowedFilter::scope('date_range'),
            ])
            ->allowedSorts([
                'amount',
                'paid_at',
                'created_at',
            ])
            ->defaultSort('-created_at')
            ->paginate(request('per_page', 15))
            ->withQueryString();

        $stats = [
            'total_payments' => Payment::count(),
            'pending' => Payment::where('status', 'PENDING')->count(),
            'paid' => Payment::where('status', 'PAID')->count(),
            'failed' => Payment::where('status', 'FAILED')->count(),
            'total_amount' => Payment::where('status', 'PAID')->sum('amount'),
        ];

        return Inertia::render('admin/payments/index/page', [
            'payments' => $payments,
            'stats' => $stats,
            'filters' => request()->input('filter', []),
        ]);
    }

    public function show(Payment $payment)
    {
        $this->authorize('view', $payment);

        $payment->load([
            'booking.user',
            'booking.schedule.ship',
            'booking.schedule.route',
            'booking.passengers',
        ]);

        return Inertia::render('admin/payments/show/page', [
            'payment' => $payment,
        ]);
    }
}
