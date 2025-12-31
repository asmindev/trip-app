<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Services\PaymentService;
use Illuminate\Support\Facades\File;

class QrCodeTest extends TestCase
{
    public function test_qr_code_generation_returns_data_uri()
    {
        $service = new PaymentService();
        $qrString = 'https://example.com/pay/123';

        $dataUri = $service->generateQrCodeImage($qrString);

        $this->assertNotNull($dataUri);
        $this->assertStringStartsWith('data:image/png;base64,', $dataUri);
    }

    public function test_qr_code_generation_handles_missing_logo_gracefully()
    {
        // Rename logo temporarily if exists
        $logoPath = public_path('apple-touch-icon.png');
        $tempPath = public_path('apple-touch-icon.png.bak');

        if (File::exists($logoPath)) {
            File::move($logoPath, $tempPath);
        }

        try {
            $service = new PaymentService();
            $dataUri = $service->generateQrCodeImage('test');

            $this->assertNotNull($dataUri);
            $this->assertStringStartsWith('data:image/png;base64,', $dataUri);
        } finally {
            // Restore logo
            if (File::exists($tempPath)) {
                File::move($tempPath, $logoPath);
            }
        }
    }
}
