import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';

interface Step {
    id: number;
    name: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    return (
        <div className="relative">
            <div className="flex items-center justify-between">
                {steps.map((step, idx) => {
                    const isCompleted = step.id < currentStep;
                    const isActive = step.id === currentStep;

                    return (
                        <div key={step.id} className="relative flex flex-1 flex-col items-center">
                            {/* Connector Line */}
                            {idx !== 0 && (
                                <div className="absolute top-5 right-1/2 left-[-50%] z-0 h-[2px] -translate-y-1/2">
                                    <div className="h-full w-full bg-slate-200 dark:bg-slate-800" />
                                    <motion.div
                                        initial={{ width: '0%' }}
                                        animate={{ width: isCompleted || isActive ? '100%' : '0%' }}
                                        className="absolute top-0 left-0 h-full bg-primary"
                                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                                    />
                                </div>
                            )}

                            {/* Step Circle */}
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.1 : 1,
                                    backgroundColor: isCompleted || isActive ? 'var(--color-primary)' : 'var(--color-slate-200)',
                                }}
                                className={cn(
                                    'relative z-10 flex size-10 items-center justify-center rounded-full border-4 border-white shadow-lg transition-colors dark:border-slate-900',
                                    isCompleted || isActive
                                        ? 'bg-primary text-white'
                                        : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-600',
                                )}
                            >
                                {isCompleted ? <Check className="size-5" /> : <span className="text-sm font-black">{step.id}</span>}

                                {isActive && (
                                    <motion.div
                                        layoutId="step-glow"
                                        className="absolute -inset-2 -z-10 rounded-full bg-primary/20 blur-md"
                                        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                                    />
                                )}
                            </motion.div>

                            {/* Step Name */}
                            <motion.span
                                animate={{
                                    color: isActive ? 'var(--color-primary)' : isCompleted ? 'var(--color-slate-500)' : 'var(--color-slate-400)',
                                    fontWeight: isActive ? 900 : 700,
                                }}
                                className="mt-4 text-[10px] tracking-tight whitespace-nowrap uppercase md:text-xs md:tracking-normal dark:animate-none dark:text-slate-200"
                            >
                                {step.name}
                            </motion.span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
