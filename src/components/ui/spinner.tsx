import { cn } from '@/utils/cn';

interface SpinnerProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

export function Spinner({ className, size = 'md' }: SpinnerProps) {
    return (
        <div
            className={cn(
                'animate-spin rounded-full border-2 border-muted border-t-primary',
                sizes[size],
                className,
            )}
        />
    );
}

export function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Spinner size="lg" />
        </div>
    );
}
