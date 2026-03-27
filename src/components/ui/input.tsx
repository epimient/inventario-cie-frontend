import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-[#E8F3EE]">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        'flex h-11 w-full rounded-xl border border-[#2A3D32] bg-[#1A2620] px-4 py-2 text-sm text-[#E8F3EE] transition-colors',
                        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
                        'placeholder:text-[#9CA99D]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F645B] focus-visible:border-[#4F645B]',
                        'disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#252E2A]',
                        error && 'border-destructive focus-visible:ring-destructive/20',
                        className,
                    )}
                    {...props}
                />
                {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
        );
    },
);

Input.displayName = 'Input';
