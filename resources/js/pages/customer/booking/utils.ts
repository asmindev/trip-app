// Booking Flow Utilities

/**
 * Format number as Indonesian Rupiah currency
 */
export function formatCurrency(amount: number | string): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numAmount);
}

/**
 * Format time string (HH:MM:SS) to display format (HH:MM)
 */
export function formatTime(timeString: string): string {
    return timeString.substring(0, 5);
}

/**
 * Format date string to Indonesian locale
 */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options || defaultOptions);
}

/**
 * Format date to short format (e.g., "12 Okt 2025")
 */
export function formatDateShort(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

/**
 * Calculate duration between two time strings or datetime strings
 */
export function calculateDuration(startTime: string, endTime: string): string {
    // Extract HH:MM from strings that might be datetimes (YYYY-MM-DD HH:MM:SS)
    const extractTime = (str: string) => {
        const timePart = str.includes(' ') ? str.split(' ')[1] : str;
        return timePart.substring(0, 5);
    };

    const start = extractTime(startTime);
    const end = extractTime(endTime);

    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    let totalMinutes = endH * 60 + endM - (startH * 60 + startM);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
        return `${hours}j ${minutes}m`;
    } else if (hours > 0) {
        return `${hours} jam`;
    }
    return `${minutes} menit`;
}

/**
 * Get time period label
 */
export function getTimePeriod(timeString: string): 'morning' | 'afternoon' | 'night' {
    const hour = parseInt(timeString.substring(0, 2), 10);
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'night';
}
