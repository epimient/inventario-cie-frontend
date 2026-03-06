import { cn } from '@/utils/cn';

const badgeVariants = {
    default: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
    secondary: 'bg-secondary text-secondary-foreground border-secondary',
};

interface BadgeProps {
    variant?: keyof typeof badgeVariants;
    children: React.ReactNode;
    className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
                badgeVariants[variant],
                className,
            )}
        >
            {children}
        </span>
    );
}

// Helper to map estados to badge variants
export function getEstadoBadgeVariant(estado: string) {
    const map: Record<string, keyof typeof badgeVariants> = {
        disponible: 'success',
        'en uso': 'default',
        prestado: 'warning',
        mantenimiento: 'secondary',
        dañado: 'destructive',
        activo: 'success',
        devuelto: 'secondary',
        vencido: 'warning',
        perdido: 'destructive',
    };
    return map[estado] || 'default';
}
