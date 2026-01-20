<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>E-Ticket - {{ $booking->booking_code }}</title>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            color: #333;
            line-height: 1.6;
        }
        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #d97706; /* Amber-600 to match theme */
            text-transform: uppercase;
        }
        .header p {
            margin: 5px 0 0;
            font-size: 14px;
        }
        .booking-info {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }
        .info-group {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }
        .label {
            font-weight: bold;
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
        }
        .value {
            font-size: 16px;
            margin-bottom: 10px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .table th, .table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        .table th {
            background-color: #f3f4f6;
            font-weight: bold;
        }
        .qr-section {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px dashed #ddd;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #999;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        .badge-paid {
            background-color: #d1fae5;
            color: #065f46;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Kapal Trip</h1>
            <p>Tiket Kapal Wisata Nusantara</p>
        </div>

        <div class="booking-info">
            <div class="info-group">
                <div class="label">Kode Booking</div>
                <div class="value">{{ $booking->booking_code }}</div>

                <div class="label">Tanggal Pemesanan</div>
                <div class="value">{{ $booking->created_at->format('d M Y H:i') }}</div>

                <div class="label">Status</div>
                <div class="value">
                    <span class="badge badge-paid">LUNAS</span>
                </div>
            </div>
            <div class="info-group">
                <div class="label">Kapal</div>
                <div class="value">{{ $booking->schedule->ship->name }}</div>

                <div class="label">Rute</div>
                <div class="value">{{ $booking->schedule->route->name }}</div>

                <div class="label">Waktu Keberangkatan</div>
                <div class="value">{{ \Carbon\Carbon::parse($booking->schedule->departure_date)->format('d M Y') }} - {{ $booking->schedule->departure_time }}</div>
            </div>
        </div>

        <h3>Detail Penumpang</h3>
        <table class="table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Lengkap</th>
                    <th>Jenis Kelamin</th>
                    <th>Kategori</th>
                </tr>
            </thead>
            <tbody>
                @foreach($booking->passengers as $index => $passenger)
                <tr>
                    <td style="width: 40px; text-align: center;">{{ $index + 1 }}</td>
                    <td>{{ $passenger->name }}</td>
                    <td>{{ $passenger->gender == 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
                    <td>{{ $passenger->tripType?->name ?? 'Umum' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="qr-section">
            <p style="margin-bottom: 15px; font-weight: bold;">Scan QR Code ini saat boarding</p>
            <img src="{{ $qrCode }}" alt="QR Code" style="width: 150px; height: 150px;">
            <p style="margin-top: 10px; font-size: 12px; color: #666;">{{ $booking->booking_code }}</p>
        </div>

        <div class="footer">
            <p>Terima kasih telah menggunakan layanan Kapal Trip.</p>
            <p>Harap datang 30 menit sebelum keberangkatan.</p>
        </div>
    </div>
</body>
</html>
