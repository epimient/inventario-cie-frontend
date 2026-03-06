import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as robotsService from '@/services/robots';
import { Robot, RobotCreate, RobotUpdate } from '@/types';

export const useRobots = () => {
    const queryClient = useQueryClient();

    const robotsQuery = useQuery({
        queryKey: ['robots'],
        queryFn: () => robotsService.getAll(),
        retry: 2,
        refetchOnWindowFocus: false,
    });

    const createRobotMutation = useMutation({
        mutationFn: (data: RobotCreate) => robotsService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['robots'] });
        },
    });

    const updateRobotMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: RobotUpdate }) =>
            robotsService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['robots'] });
        },
    });

    const deleteRobotMutation = useMutation({
        mutationFn: (id: number) => robotsService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['robots'] });
        },
    });

    return {
        robots: robotsQuery.data ?? [],
        isLoading: robotsQuery.isLoading,
        isError: robotsQuery.isError,
        error: robotsQuery.error,
        createRobot: createRobotMutation.mutateAsync,
        updateRobot: updateRobotMutation.mutateAsync,
        deleteRobot: deleteRobotMutation.mutateAsync,
        isCreating: createRobotMutation.isPending,
        isUpdating: updateRobotMutation.isPending,
        isDeleting: deleteRobotMutation.isPending,
    };
};
