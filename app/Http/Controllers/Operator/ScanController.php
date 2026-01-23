<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScanController extends Controller
{
    public function index()
    {
        return Inertia::render('operator/scan/page');
    }
}
