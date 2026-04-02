import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    loading?: boolean;
}

const variants = {
    primary:
        'bg-[#415A52] text-white hover:bg-[#344841] shadow-md shadow-[#415A52]/20',
    secondary:
        'bg-[#E8F3EE] text-[#415A52] hover:bg-[#d4e9df]',
    destructive:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline:
        'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
};

const sizes = {
    sm: 'h-8 px-4 text-xs rounded-full',
    md: 'h-11 px-6 text-sm rounded-full font-semibold',
    lg: 'h-12 px-8 text-base rounded-full font-semibold',
    icon: 'h-10 w-10 rounded-full',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', disabled, loading, ...props }, ref) => (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center gap-2 transition-all duration-300',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
                variants[variant],
                sizes[size],
                className,
            )}
            disabled={disabled || loading}
            aria-busy={loading}
            {...props}
        />
    ),
);

Button.displayName = 'Button';
