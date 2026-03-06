import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as prestamosService from '@/services/prestamos';
import { PrestamoCreate } from '@/types';

export const usePrestamos = () => {
    const queryClient = useQueryClient();

    const prestamosQuery = useQuery({
        queryKey: ['prestamos'],
        queryFn: async () => {
            const data = await prestamosService.getAll();
            console.log("Datos prestamos recibidos:", data);
            return data;
        },
        retry: 2,
        refetchOnWindowFocus: false,
    });

    const prestamosActivosQuery = useQuery({
        queryKey: ['prestamos', 'activos'],
        queryFn: async () => {
            const data = await prestamosService.getActivos();
            console.log("Datos préstamos activos recibidos:", data);
            return data;
        },
        retry: 2,
        refetchOnWindowFocus: false,
    });

    const createPrestamoMutation = useMutation({
        mutationFn: (data: PrestamoCreate) => prestamosService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prestamos'] });
            // Invalidate related items to reflect availability
            queryClient.invalidateQueries({ queryKey: ['equipos'] });
            queryClient.invalidateQueries({ queryKey: ['electronica'] });
            queryClient.invalidateQueries({ queryKey: ['robots'] });
            queryClient.invalidateQueries({ queryKey: ['materiales'] });
        },
    });

    const devolverPrestamoMutation = useMutation({
        mutationFn: (id: number) => prestamosService.devolver(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prestamos'] });
            queryClient.invalidateQueries({ queryKey: ['equipos'] });
            queryClient.invalidateQueries({ queryKey: ['electronica'] });
            queryClient.invalidateQueries({ queryKey: ['robots'] });
            queryClient.invalidateQueries({ queryKey: ['materiales'] });
        },
    });

    const deletePrestamoMutation = useMutation({
        mutationFn: (id: number) => prestamosService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prestamos'] });
        },
    });

    return {
        prestamos: prestamosQuery.data ?? [],
        prestamosActivos: prestamosActivosQuery.data ?? [],
        isLoading: prestamosQuery.isLoading || prestamosActivosQuery.isLoading,
        isError: prestamosQuery.isError || prestamosActivosQuery.isError,
        error: prestamosQuery.error || prestamosActivosQuery.error,
        createPrestamo: createPrestamoMutation.mutateAsync,
        devolverPrestamo: devolverPrestamoMutation.mutateAsync,
        deletePrestamo: deletePrestamoMutation.mutateAsync,
        isCreating: createPrestamoMutation.isPending,
        isReturning: devolverPrestamoMutation.isPending,
        isDeleting: deletePrestamoMutation.isPending,
    };
};
