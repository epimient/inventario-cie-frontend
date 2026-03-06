import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    glass?: boolean;
}

export function Card({ children, className, glass }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-xl border transition-all duration-200',
                glass
                    ? 'glass-card'
                    : 'bg-card text-card-foreground shadow-sm',
                className,
            )}
        >
            {children}
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: string;
    className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
    return (
        <Card glass className={cn('p-5 hover:shadow-lg transition-shadow duration-300', className)}>
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold tracking-tight">{value}</p>
                    {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
                </div>
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">{icon}</div>
            </div>
        </Card>
    );
}
