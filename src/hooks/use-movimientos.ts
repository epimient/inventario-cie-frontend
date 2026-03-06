import { useQuery } from '@tanstack/react-query';
import * as movimientosService from '@/services/movimientos';

export const useMovimientos = () => {
    const movimientosQuery = useQuery({
        queryKey: ['movimientos'],
        queryFn: () => movimientosService.getAll(),
        retry: 2,
        refetchOnWindowFocus: false,
    });

    return {
        movimientos: movimientosQuery.data ?? [],
        isLoading: movimientosQuery.isLoading,
        isError: movimientosQuery.isError,
        error: movimientosQuery.error,
    };
};
