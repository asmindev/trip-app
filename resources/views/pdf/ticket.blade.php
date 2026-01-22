<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Ticket - {{ $booking->booking_code }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        /* Luxury accents */
        .accent-line {
            height: 2px;
            background: linear-gradient(90deg, #18181b 0%, #71717a 100%);
        }

        /* Ensure layout is sharp in PDF */
        .ticket-container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
    </style>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        luxury: {
                            black: '#18181b', // Zinc 900
                            dark: '#27272a',  // Zinc 800
                            gray: '#71717a',  // Zinc 500
                            light: '#f4f4f5', // Zinc 100
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="p-8 lg:p-12 text-luxury-black">

    <!-- Ticket Container -->
    <div class="ticket-container rounded-none overflow-hidden pb-12">

        <!-- Header: Minimalist & Clean -->
        <div class="px-10 pt-10 pb-6 flex justify-between items-start">
            <div>
                <h1 class="text-3xl font-light tracking-tight text-luxury-black uppercase">Kapal Trip</h1>
                <p class="text-xs text-luxury-gray tracking-[0.2em] uppercase mt-1">Luxury Sea Transport</p>
            </div>
            <div class="text-right">
                <p class="text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Boarding Pass</p>
                <div class="text-xl font-bold font-mono tracking-wider">{{ $booking->booking_code }}</div>
            </div>
        </div>

        <div class="accent-line w-full"></div>

        <!-- Main Info Area -->
        <div class="p-10">

            <!-- Route Info: Big & Bold -->
            <div class="flex items-center justify-between mb-12">
                <div class="flex-1 overflow-hidden">
                    <p class="text-[10px] uppercase tracking-widest text-luxury-gray mb-2 whitespace-nowrap">Asal</p>
                    <h2 class="text-2xl font-semibold text-luxury-black whitespace-nowrap truncate">Kendari</h2>
                </div>
                <div class="flex-0 px-4 flex flex-col items-center">
                    <div class="w-16 h-px bg-luxury-gray/30 mb-2"></div>
                    <span class="text-luxury-gray text-xs tracking-wider whitespace-nowrap">{{ $booking->schedule->ship->name }}</span>
                </div>
                <div class="flex-1 text-right overflow-hidden">
                    <p class="text-[10px] uppercase tracking-widest text-luxury-gray mb-2 whitespace-nowrap">Tujuan</p>
                    <h2 class="text-2xl font-semibold text-luxury-black whitespace-nowrap truncate">{{ $booking->schedule->route->name }}</h2>
                </div>
            </div>

            <!-- Grid Details: Clear Hierarchy -->
            <div class="grid grid-cols-4 gap-8 mb-12 border-b border-gray-100 pb-12">

                <div class="col-span-1">
                    <p class="text-[10px] uppercase tracking-widest text-luxury-gray mb-1 whitespace-nowrap">Tanggal</p>
                    <p class="text-lg font-medium text-luxury-black whitespace-nowrap">
                        {{ \Carbon\Carbon::parse($booking->schedule->departure_date)->isoFormat('D MMMM Y') }}
                    </p>
                    <p class="text-xs text-luxury-gray whitespace-nowrap">{{ \Carbon\Carbon::parse($booking->schedule->departure_date)->format('Y') }}</p>
                </div>

                <div class="col-span-1">
                    <p class="text-[10px] uppercase tracking-widest text-luxury-gray mb-1 whitespace-nowrap">Jam</p>
                    <p class="text-lg font-medium text-luxury-black whitespace-nowrap">{{ $booking->schedule->departure_time }}</p>
                    <p class="text-xs text-luxury-gray whitespace-nowrap">WITA</p>
                </div>

                <div class="col-span-1">
                    <p class="text-[10px] uppercase tracking-widest text-luxury-gray mb-1 whitespace-nowrap">Status</p>
                    @if($booking->payment_status === 'PAID')
                        <span class="inline-flex items-center px-2 py-1 bg-black text-white text-[10px] font-bold tracking-widest uppercase whitespace-nowrap">
                            Lunas
                        </span>
                    @else
                        <span class="text-base font-medium text-luxury-black whitespace-nowrap">{{ $booking->payment_status }}</span>
                    @endif
                </div>

                <div class="col-span-1">
                    <p class="text-[10px] uppercase tracking-widest text-luxury-gray mb-1 whitespace-nowrap">Penumpang</p>
                    <p class="text-lg font-medium text-luxury-black whitespace-nowrap">{{ $booking->passengers->count() }} Orang</p>
                </div>
            </div>

            <!-- Passengers Table: Clean & Light -->
            <div class="mb-12">
                <div class="flex items-center gap-4 mb-6">
                    <h3 class="text-sm font-bold uppercase tracking-widest text-luxury-black whitespace-nowrap">Daftar Penumpang</h3>
                    <div class="flex-1 h-px bg-gray-100"></div>
                </div>

                <table class="w-full text-left">
                    <thead>
                        <tr>
                            <th class="pb-3 text-[10px] font-bold uppercase tracking-wider text-luxury-gray w-12 whitespace-nowrap">No</th>
                            <th class="pb-3 text-[10px] font-bold uppercase tracking-wider text-luxury-gray whitespace-nowrap">Nama Penumpang</th>
                            <th class="pb-3 text-[10px] font-bold uppercase tracking-wider text-luxury-gray whitespace-nowrap">L/P</th>
                            <th class="pb-3 text-[10px] font-bold uppercase tracking-wider text-luxury-gray text-right whitespace-nowrap">Kelas</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm">
                        @foreach($booking->passengers as $index => $passenger)
                        <tr class="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <td class="py-3 text-luxury-gray whitespace-nowrap">{{ $index + 1 }}</td>
                            <td class="py-3 font-medium text-luxury-black capitalize whitespace-nowrap truncate max-w-[200px]">{{ strtolower($passenger->name) }}</td>
                            <td class="py-3 text-luxury-gray whitespace-nowrap">{{ $passenger->gender == 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
                            <td class="py-3 text-right text-luxury-black font-medium whitespace-nowrap">{{ $passenger->tripType?->name ?? 'Reguler' }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Footer & QR: Split Layout -->
            <div class="flex items-end justify-between pt-6 border-t border-dashed border-gray-200">
                <div class="max-w-md">
                    <p class="text-[10px] text-luxury-gray uppercase tracking-wider mb-2 whitespace-nowrap">Informasi Penting</p>
                    <p class="text-xs text-gray-500 leading-relaxed">
                        Mohon tiba di pelabuhan setidaknya 30 menit sebelum keberangkatan.<br>
                        Tunjukkan e-ticket ini bersama kartu identitas (KTP/Passport) saat boarding.
                    </p>
                </div>

                <div class="text-center">
                    <div class="mb-2 p-1 bg-white border border-gray-100 inline-block">
                        <img src="{{ $qrCode }}" alt="QR" class="w-24 h-24 object-contain opacity-90 grayscale">
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div class="text-center mt-6">
        <p class="text-[10px] text-gray-400 font-mono whitespace-nowrap">Dicetak pada {{ now()->isoFormat('D MMMM Y H:mm:s') }} • REF: {{ $booking->booking_code }}</p>
    </div>

</body>
</html>
