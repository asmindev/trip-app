<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'amount' => 'decimal:2',
        'expense_date' => 'date',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function category()
    {
        return $this->belongsTo(ExpenseCategory::class, 'expense_category_id');
    }

    // User yang input
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // User yang approve (Admin)
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
