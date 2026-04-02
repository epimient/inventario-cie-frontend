import { cn } from '@/utils/cn';
import { Spinner } from './spinner';
import type { Column } from '@/types';

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
}

export function Table<T extends { id: number | string }>({
    columns,
    data,
    loading,
    emptyMessage = 'No hay datos disponibles',
    onRowClick,
}: TableProps<T>) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-[#292a69]">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={cn(
                                    'px-6 py-4 font-semibold text-muted-foreground/80 tracking-wide text-xs uppercase dark:text-[#7b7b8b]',
                                    col.className,
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-[#292a69]">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-12 text-center text-muted-foreground bg-gray-50/50 dark:bg-[#292a69]/50 rounded-xl">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <span className="text-sm">{emptyMessage}</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr
                                key={item.id}
                                className={cn(
                                    'group bg-white dark:bg-[#22214d] hover:bg-gray-50 dark:hover:bg-[#292a69] transition-colors duration-200',
                                    onRowClick && 'cursor-pointer',
                                )}
                                onClick={() => onRowClick?.(item)}
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className={cn('px-6 py-4 whitespace-nowrap dark:text-[#dddeff]', col.className)}>
                                        {col.render
                                            ? col.render(item)
                                            : String((item as Record<string, unknown>)[col.key] ?? '-')}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
