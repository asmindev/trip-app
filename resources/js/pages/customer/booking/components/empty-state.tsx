import { Anchor } from 'lucide-react';
import { motion } from 'motion/react';

interface EmptyStateProps {
    title?: string;
    description?: string;
}

export function EmptyState({
    title = 'Tidak ada jadwal ditemukan',
    description = 'Coba ubah filter pencarian atau pilih tanggal yang berbeda.',
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
        >
            {/* Illustration */}
            <div className="relative mb-8">
                {/* Water waves */}
                <div className="absolute -bottom-4 left-1/2 h-3 w-32 -translate-x-1/2 rounded-full bg-linear-to-r from-transparent via-orange-200 to-transparent opacity-60 dark:via-orange-800" />
                <div className="absolute -bottom-2 left-1/2 h-2 w-24 -translate-x-1/2 rounded-full bg-linear-to-r from-transparent via-orange-300 to-transparent opacity-40 dark:via-orange-700" />

                {/* Boat icon container */}
                <div className="flex size-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <Anchor className="size-12 text-slate-400 dark:text-slate-500" />
                </div>
            </div>

            {/* Text */}
            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </motion.div>
    );
}
