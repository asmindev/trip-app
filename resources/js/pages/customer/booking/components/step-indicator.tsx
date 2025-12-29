import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
    id: number;
    name: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
}

const defaultSteps: Step[] = [
    { id: 1, name: 'Data Pemesan' },
    { id: 2, name: 'Data Penumpang' },
    { id: 3, name: 'Review' },
    { id: 4, name: 'Bayar' },
];

export function StepIndicator({ steps = defaultSteps, currentStep }: StepIndicatorProps) {
    return (
        <nav aria-label="Progress" className="mb-8">
            <ol className="flex items-center">
                {steps.map((step, stepIdx) => (
                    <li key={step.id} className={cn('relative', stepIdx !== steps.length - 1 ? 'flex-1 pr-8' : '')}>
                        {step.id < currentStep ? (
                            // Completed step
                            <div className="group flex items-center">
                                <span className="flex items-center">
                                    <span className="flex size-9 items-center justify-center rounded-full bg-primary">
                                        <Check className="size-5 text-white" />
                                    </span>
                                </span>
                                <span className="ml-3 hidden text-sm font-medium text-primary md:block">{step.name}</span>
                            </div>
                        ) : step.id === currentStep ? (
                            // Current step
                            <div className="flex items-center" aria-current="step">
                                <span className="flex size-9 items-center justify-center rounded-full border-2 border-primary bg-white dark:bg-slate-900">
                                    <span className="text-sm font-bold text-primary">{step.id}</span>
                                </span>
                                <span className="ml-3 hidden text-sm font-medium text-primary md:block">{step.name}</span>
                            </div>
                        ) : (
                            // Upcoming step
                            <div className="group flex items-center">
                                <span className="flex size-9 items-center justify-center rounded-full border-2 border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{step.id}</span>
                                </span>
                                <span className="ml-3 hidden text-sm font-medium text-slate-500 md:block dark:text-slate-400">{step.name}</span>
                            </div>
                        )}

                        {/* Connector line */}
                        {stepIdx !== steps.length - 1 && (
                            <div className="absolute top-4 right-0 hidden w-full md:block" aria-hidden="true">
                                <div className="ml-16 h-0.5 w-full bg-slate-200 dark:bg-slate-700">
                                    {step.id < currentStep && <div className="h-0.5 w-full bg-primary" />}
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
