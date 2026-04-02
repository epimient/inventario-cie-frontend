import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, placeholder, id, ...props }, ref) => {
        const generatedId = useId();
        const selectId = id || generatedId;
        const errorId = `${selectId}-error`;

        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={selectId} className="text-sm font-medium text-[#2d3335] dark:text-[#E8F3EE]">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                    className={cn(
                        'flex h-11 w-full appearance-none rounded-xl border px-4 py-2 text-sm transition-colors',
                        // Modo claro
                        'bg-white border-gray-300 text-[#2d3335] placeholder:text-gray-400',
                        'hover:bg-gray-50',
                        'focus:outline-none focus:ring-2 focus:ring-[#4f645b]/40 focus:border-[#4f645b]',
                        // Modo oscuro
                        'dark:bg-[#1A2620] dark:border-[#2A3D32] dark:text-[#E8F3EE] dark:placeholder:text-[#9CA99D]',
                        'dark:hover:bg-[#252E2A]',
                        'dark:focus:ring-[#4F645B] dark:focus:border-[#4F645B]',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-destructive focus-visible:ring-destructive/20',
                        className,
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled className="bg-white dark:bg-[#1A2620] text-gray-400 dark:text-[#9CA99D]">
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#1A2620] text-[#2d3335] dark:text-[#E8F3EE]">
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && <p id={errorId} className="text-xs text-destructive" role="alert">{error}</p>}
            </div>
        );
    },
);

Select.displayName = 'Select';
