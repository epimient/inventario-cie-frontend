import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as prestatariosService from '@/services/prestatarios';
import { Prestatario, PrestatarioCreate, PrestatarioUpdate } from '@/types';

export const usePrestatarios = () => {
    const queryClient = useQueryClient();

    const prestatariosQuery = useQuery({
        queryKey: ['prestatarios'],
        queryFn: () => prestatariosService.getAll(),
        retry: 2,
        refetchOnWindowFocus: false,
    });

    const createPrestatarioMutation = useMutation({
        mutationFn: (data: PrestatarioCreate) => prestatariosService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prestatarios'] });
        },
    });

    const updatePrestatarioMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: PrestatarioUpdate }) =>
            prestatariosService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prestatarios'] });
        },
    });

    const deletePrestatarioMutation = useMutation({
        mutationFn: (id: number) => prestatariosService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prestatarios'] });
        },
    });

    return {
        prestatarios: prestatariosQuery.data ?? [],
        isLoading: prestatariosQuery.isLoading,
        isError: prestatariosQuery.isError,
        error: prestatariosQuery.error,
        createPrestatario: createPrestatarioMutation.mutateAsync,
        updatePrestatario: updatePrestatarioMutation.mutateAsync,
        deletePrestatario: deletePrestatarioMutation.mutateAsync,
        isCreating: createPrestatarioMutation.isPending,
        isUpdating: updatePrestatarioMutation.isPending,
        isDeleting: deletePrestatarioMutation.isPending,
    };
};
