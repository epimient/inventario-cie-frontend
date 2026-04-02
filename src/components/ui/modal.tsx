import { useEffect, useId, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './button';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
    const titleId = useId();

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (open) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby={titleId}>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Panel */}
            <div
                className={cn(
                    'relative z-50 w-full max-w-lg rounded-xl border bg-white dark:bg-[#22214d] p-6 shadow-xl animate-scale-in',
                    'max-h-[90vh] overflow-y-auto',
                    className,
                )}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 id={titleId} className="text-lg font-semibold text-[#2d3335] dark:text-[#fdfdfd]">{title}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar modal" className="dark:text-[#dddeff] dark:hover:bg-[#292a69]">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                {children}
            </div>
        </div>
    );
}
