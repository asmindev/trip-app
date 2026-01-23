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

    public function process(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        // Logic validasi tiket akan ditambahkan di sini
        // Mock response untuk sementara
        $valid = $request->code === 'VALID123';

        if ($valid) {
            return response()->json([
                'status' => 'success',
                'message' => 'Tiket valid! Silakan masuk.',
                'data' => [
                    'passenger' => 'John Doe',
                    'seat' => 'A1',
                    'ship' => 'Kapal Cepat 1',
                ]
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Tiket tidak valid atau sudah digunakan.',
        ], 422);
    }
}
