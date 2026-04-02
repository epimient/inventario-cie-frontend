import { useState, useMemo } from 'react';

interface UsePaginationResult<T> {
    paginatedItems: T[];
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
    totalItems: number;
    startItem: number; // 1-indexed for display (e.g., "Showing 1-20")
    endItem: number;   // 1-indexed for display
}

/**
 * Hook personalizado para manejar paginación de listas
 * @param items - Array de elementos a paginar
 * @param itemsPerPage - Elementos por página (default: 20)
 */
export function usePagination<T>(
    items: T[],
    itemsPerPage: number = 20
): UsePaginationResult<T> {
    const [currentPage, setCurrentPage] = useState(1);

    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return items.slice(start, end);
    }, [items, currentPage, itemsPerPage]);

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return {
        paginatedItems,
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems,
        startItem,
        endItem,
    };
}