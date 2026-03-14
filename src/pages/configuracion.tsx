import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, AlertTriangle, Package, ClipboardList, Monitor, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/auth-context';
import { configuracionService, ConfiguracionAlerta } from '@/services/configuracion';
import { getErrorMessage } from '@/utils/error-handler';
import { Navigate } from 'react-router-dom';

export default function ConfiguracionPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { hasRole } = useAuth();

    // Solo admins pueden ver esta página
    if (!hasRole(['admin'])) {
        return <Navigate to="/dashboard" replace />;
    }

    const { data: configuraciones = [], isLoading, isError, error } = useQuery({
        queryKey: ['configuracion-alertas'],
        queryFn: configuracionService.getAll,
    });

    const updateMutation = useMutation({
        mutationFn: ({ clave, valor }: { clave: string; valor: number }) =>
            configuracionService.update(clave, valor),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['configuracion-alertas'] });
            // Forzamos actualización de alertas
            queryClient.invalidateQueries({ queryKey: ['materiales'] });
            queryClient.invalidateQueries({ queryKey: ['prestamos'] });
            toast('Configuración actualizada', 'success');
        },
        onError: (err: any) => {
            toast(getErrorMessage(err), 'error');
        }
    });

    const EditableRow = ({ config }: { config: ConfiguracionAlerta }) => {
        const [valor, setValor] = useState(config.valor.toString());
        const isModified = valor !== config.valor.toString();

        const handleSave = () => {
            const num = parseInt(valor);
            if (isNaN(num)) {
                toast('Debe ingresar un valor numérico válido', 'error');
                return;
            }
            updateMutation.mutate({ clave: config.clave, valor: num });
        };

        return (
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        className="flex-1 h-9 font-medium"
                    />
                    <Button
                        size="md"
                        variant={isModified ? 'primary' : 'secondary'}
                        disabled={!isModified || updateMutation.isPending}
                        onClick={handleSave}
                        className="shrink-0"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                    </Button>
                </div>
            </div>
        );
    };

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <div className="text-center space-y-2">
                    <h3 className="font-semibold">Error al cargar la configuración</h3>
                    <p className="text-sm text-muted-foreground">{error?.message || 'Revisa tu conexión'}</p>
                </div>
                <Button variant="outline" onClick={() => window.location.reload()}>Reintentar</Button>
            </div>
        );
    }

    const getConfigIcon = (clave: string) => {
        if (clave.includes('stock')) return <Package className="h-5 w-5 text-primary" />;
        if (clave.includes('prestamo')) return <ClipboardList className="h-5 w-5 text-blue-500" />;
        if (clave.includes('equipo') || clave.includes('danado')) return <Monitor className="h-5 w-5 text-destructive" />;
        return <Settings className="h-5 w-5 text-muted-foreground" />;
    };

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <p className="text-muted-foreground">
                    Define los umbrales operativos globales del sistema para las alertas de préstamos, stock límite y límites de usuario.
                </p>
            </div>

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-xl border bg-card p-6 shadow-sm animate-pulse">
                            <div className="h-10 w-10 bg-muted rounded-full mb-4"></div>
                            <div className="h-5 w-2/3 bg-muted rounded mb-2"></div>
                            <div className="h-4 w-full bg-muted rounded mb-6"></div>
                            <div className="h-10 w-full bg-muted rounded"></div>
                        </div>
                    ))}
                </div>
            ) : configuraciones.length === 0 ? (
                <div className="text-center p-12 border border-dashed rounded-xl text-muted-foreground">
                    No se encontró configuración.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {configuraciones.map((config) => (
                        <div key={config.id} className="flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    {getConfigIcon(config.clave)}
                                </div>
                                <h3 className="font-semibold text-sm leading-tight break-words">
                                    {config.descripcion || config.clave.replace(/_/g, ' ').toUpperCase()}
                                </h3>
                            </div>
                            <div className="mt-auto pt-4 border-t">
                                <div className="flex flex-col space-y-1.5 mb-3">
                                    <span className="text-xs text-muted-foreground font-mono truncate" title={config.clave}>
                                        Clave: {config.clave}
                                    </span>
                                </div>
                                <EditableRow config={config} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
