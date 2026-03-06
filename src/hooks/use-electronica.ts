import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as electronicaService from '@/services/electronica';
import { Electronica, ElectronicaCreate, ElectronicaUpdate } from '@/types';

export const useElectronica = () => {
    const queryClient = useQueryClient();

    const electronicaQuery = useQuery({
        queryKey: ['electronica'],
        queryFn: () => electronicaService.getAll(),
        retry: 2,
        refetchOnWindowFocus: false,
    });

    const createElectronicaMutation = useMutation({
        mutationFn: (data: ElectronicaCreate) => electronicaService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['electronica'] });
        },
    });

    const updateElectronicaMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: ElectronicaUpdate }) =>
            electronicaService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['electronica'] });
        },
    });

    const deleteElectronicaMutation = useMutation({
        mutationFn: (id: number) => electronicaService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['electronica'] });
        },
    });

    return {
        electronica: electronicaQuery.data ?? [],
        isLoading: electronicaQuery.isLoading,
        isError: electronicaQuery.isError,
        error: electronicaQuery.error,
        createElectronica: createElectronicaMutation.mutateAsync,
        updateElectronica: updateElectronicaMutation.mutateAsync,
        deleteElectronica: deleteElectronicaMutation.mutateAsync,
        isCreating: createElectronicaMutation.isPending,
        isUpdating: updateElectronicaMutation.isPending,
        isDeleting: deleteElectronicaMutation.isPending,
    };
};
