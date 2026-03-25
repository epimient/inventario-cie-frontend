import { cn } from '@/utils/cn';

const badgeVariants = {
    default: 'bg-[#E8F3EE] text-[#415A52]',
    success: 'bg-[#E8F3EE] text-[#415A52]', // Using main green for success
    warning: 'bg-amber-50 text-amber-700',
    destructive: 'bg-red-50 text-red-700',
    secondary: 'bg-gray-100 text-gray-700',
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
                'inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors',
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
