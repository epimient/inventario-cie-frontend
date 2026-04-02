import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as equiposService from '@/services/equipos';
import { Equipo, EquipoCreate, EquipoUpdate } from '@/types';

export const useEquipos = () => {
    const queryClient = useQueryClient();

    const equiposQuery = useQuery({
        queryKey: ['equipos'],
        queryFn: () => equiposService.getAll(),
        retry: 2,
        refetchOnWindowFocus: false,
    });

    const createEquipoMutation = useMutation({
        mutationFn: (data: EquipoCreate) => equiposService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['equipos'] });
        },
    });

    const updateEquipoMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: EquipoUpdate }) =>
            equiposService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['equipos'] });
        },
    });

    const deleteEquipoMutation = useMutation({
        mutationFn: (id: number) => equiposService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['equipos'] });
        },
    });

    return {
        equipos: equiposQuery.data ?? [],
        isLoading: equiposQuery.isLoading,
        isError: equiposQuery.isError,
        error: equiposQuery.error,
        createEquipo: createEquipoMutation.mutateAsync,
        updateEquipo: updateEquipoMutation.mutateAsync,
        deleteEquipo: deleteEquipoMutation.mutateAsync,
        isCreating: createEquipoMutation.isPending,
        isUpdating: updateEquipoMutation.isPending,
        isDeleting: deleteEquipoMutation.isPending,
    };
};
