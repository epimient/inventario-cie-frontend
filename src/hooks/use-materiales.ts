import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as materialesService from '@/services/materiales';
import { Material, MaterialCreate, MaterialUpdate } from '@/types';

export const useMateriales = () => {
    const queryClient = useQueryClient();

    const materialesQuery = useQuery({
        queryKey: ['materiales'],
        queryFn: () => materialesService.getAll(),
        retry: 2,
        refetchOnWindowFocus: false,
    });

    const tiposMaterialesQuery = useQuery({
        queryKey: ['tipos-materiales'],
        queryFn: () => materialesService.getTipos(),
        retry: 1,
    });

    const createMaterialMutation = useMutation({
        mutationFn: (data: MaterialCreate) => materialesService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['materiales'] });
        },
    });

    const updateMaterialMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: MaterialUpdate }) =>
            materialesService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['materiales'] });
        },
    });

    const deleteMaterialMutation = useMutation({
        mutationFn: (id: number) => materialesService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['materiales'] });
        },
    });

    return {
        materiales: materialesQuery.data ?? [],
        tiposMateriales: tiposMaterialesQuery.data ?? [],
        isLoading: materialesQuery.isLoading || tiposMaterialesQuery.isLoading,
        isError: materialesQuery.isError || tiposMaterialesQuery.isError,
        error: materialesQuery.error || tiposMaterialesQuery.error,
        createMaterial: createMaterialMutation.mutateAsync,
        updateMaterial: updateMaterialMutation.mutateAsync,
        deleteMaterial: deleteMaterialMutation.mutateAsync,
        isCreating: createMaterialMutation.isPending,
        isUpdating: updateMaterialMutation.isPending,
        isDeleting: deleteMaterialMutation.isPending,
    };
};
