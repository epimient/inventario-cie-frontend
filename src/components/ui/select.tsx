import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, placeholder, id, ...props }, ref) => {
        const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={selectId} className="text-sm font-medium text-[#E8F3EE]">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={cn(
                        'flex h-11 w-full appearance-none rounded-xl border border-[#2A3D32] bg-[#1A2620] px-4 py-2 text-sm text-[#E8F3EE] transition-colors',
                        'placeholder:text-[#9CA99D] hover:bg-[#252E2A]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F645B] focus-visible:border-[#4F645B]',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-destructive focus-visible:ring-destructive/20',
                        className,
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled className="bg-[#1A2620] text-[#9CA99D]">
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#1A2620] text-[#E8F3EE]">
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
        );
    },
);

Select.displayName = 'Select';
