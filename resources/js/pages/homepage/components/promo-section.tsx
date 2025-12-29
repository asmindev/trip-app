import { Button } from '@/components/ui/button';
import { Apple, Play, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

export function PromoSection() {
    return (
        <section className="relative overflow-hidden bg-slate-900 py-24 lg:py-32">
            {/* Background decorations */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[40px_40px]" />
                <div className="absolute top-0 right-0 size-96 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 size-96 rounded-full bg-teal-500/10 blur-3xl" />
            </div>

            <div className="relative container mx-auto px-6">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-center lg:text-left"
                    >
                        <h2 className="mb-6 text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
                            Siap <span className="bg-linear-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Berlayar?</span>
                        </h2>
                        <p className="mb-8 text-lg leading-relaxed text-slate-400">
                            Download aplikasi Kapal Trip dan nikmati kemudahan booking tiket kapal dimanapun dan kapanpun. Dapatkan notifikasi promo
                            eksklusif dan akses fitur premium.
                        </p>

                        {/* App Store Buttons */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                            <Button
                                size="lg"
                                className="group h-14 gap-3 rounded-xl bg-white px-6 text-slate-900 transition-all hover:scale-105 hover:bg-white hover:shadow-xl"
                            >
                                <Apple className="size-6" />
                                <div className="text-left">
                                    <div className="text-[10px] font-normal opacity-70">Download on</div>
                                    <div className="text-sm font-semibold">App Store</div>
                                </div>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="group h-14 gap-3 rounded-xl border-white/20 px-6 text-white transition-all hover:scale-105 hover:border-white/40 hover:bg-white/10"
                            >
                                <Play className="size-6 fill-current" />
                                <div className="text-left">
                                    <div className="text-[10px] font-normal opacity-70">Get it on</div>
                                    <div className="text-sm font-semibold">Google Play</div>
                                </div>
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="mt-10 flex items-center justify-center gap-8 lg:justify-start">
                            <div>
                                <div className="text-2xl font-bold text-white">100K+</div>
                                <div className="text-sm text-slate-400">Downloads</div>
                            </div>
                            <div className="h-10 w-px bg-slate-700" />
                            <div>
                                <div className="text-2xl font-bold text-white">4.8</div>
                                <div className="text-sm text-slate-400">Rating</div>
                            </div>
                            <div className="h-10 w-px bg-slate-700" />
                            <div>
                                <div className="text-2xl font-bold text-white">#1</div>
                                <div className="text-sm text-slate-400">Travel App</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Content - Phone Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative flex justify-center lg:justify-end"
                    >
                        {/* Phone Frame */}
                        <div className="relative">
                            {/* Glow effects */}
                            <div className="absolute -inset-10 rounded-full bg-linear-to-r from-cyan-500/30 to-teal-500/30 blur-3xl" />

                            {/* Phone */}
                            <div className="relative h-[500px] w-[250px] overflow-hidden rounded-[40px] border-8 border-slate-700 bg-slate-800 shadow-2xl">
                                {/* Notch */}
                                <div className="absolute top-2 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-slate-900" />

                                {/* Screen Content */}
                                <div className="h-full w-full bg-linear-to-b from-cyan-500/20 to-slate-900 p-4 pt-12">
                                    {/* App Header */}
                                    <div className="mb-6 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-teal-500">
                                                <Smartphone className="size-4 text-white" />
                                            </div>
                                            <span className="font-bold text-white">Kapal Trip</span>
                                        </div>
                                    </div>

                                    {/* Booking Card Preview */}
                                    <div className="space-y-3">
                                        <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                                            <div className="mb-2 text-xs text-slate-400">Pesanan Aktif</div>
                                            <div className="mb-1 font-semibold text-white">Kendari → Labengki</div>
                                            <div className="text-sm text-cyan-400">30 Des 2024 • 08:00</div>
                                        </div>

                                        <div className="rounded-2xl bg-linear-to-r from-cyan-500/20 to-teal-500/20 p-4">
                                            <div className="mb-2 text-xs text-slate-400">Promo Spesial</div>
                                            <div className="mb-1 font-bold text-white">Tahun Baru 2025</div>
                                            <div className="flex items-center gap-2">
                                                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-400">
                                                    20% OFF
                                                </span>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="grid grid-cols-3 gap-2 pt-2">
                                            {['🎫', '📍', '💰'].map((emoji, i) => (
                                                <div key={i} className="flex flex-col items-center rounded-xl bg-white/5 p-3">
                                                    <span className="text-xl">{emoji}</span>
                                                    <span className="mt-1 text-[10px] text-slate-400">{['Tiket', 'Rute', 'Promo'][i]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
