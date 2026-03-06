import { Monitor, Cpu, Bot, Package, ClipboardList, History as HistoryIcon, AlertTriangle } from 'lucide-react';
import { StatCard } from '@/components/ui/card';
import { Badge, getEstadoBadgeVariant } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useEquipos } from '@/hooks/use-equipos';
import { useElectronica } from '@/hooks/use-electronica';
import { useRobots } from '@/hooks/use-robots';
import { useMateriales } from '@/hooks/use-materiales';
import { usePrestamos } from '@/hooks/use-prestamos';
import { useMovimientos } from '@/hooks/use-movimientos';
import { formatDateTime } from '@/utils/formatters';


export default function DashboardPage() {
    const { equipos, isLoading: loadingEquipos, isError: errorEquipos } = useEquipos();
    const { electronica, isLoading: loadingElectronica, isError: errorElectronica } = useElectronica();
    const { robots, isLoading: loadingRobots, isError: errorRobots } = useRobots();
    const { materiales, isLoading: loadingMateriales, isError: errorMateriales } = useMateriales();
    const { prestamosActivos, isLoading: loadingPrestamos, isError: errorPrestamos } = usePrestamos();
    const { movimientos, isLoading: loadingMovimientos, isError: errorMovimientos } = useMovimientos();

    const loading = loadingEquipos || loadingElectronica || loadingRobots || loadingMateriales || loadingPrestamos || loadingMovimientos;
    const isError = errorEquipos || errorElectronica || errorRobots || errorMateriales || errorPrestamos || errorMovimientos;

    // Manejo de errores de API
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <div className="text-center space-y-2">
                    <h3 className="font-semibold">Error al cargar datos del dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                        No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.
                    </p>
                </div>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    Intentar de nuevo
                </Button>
            </div>
        );
    }


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Equipos"
                    value={equipos.length}
                    icon={<Monitor className="h-5 w-5" />}
                />
                <StatCard
                    title="Electrónica"
                    value={electronica.length}
                    icon={<Cpu className="h-5 w-5" />}
                />
                <StatCard
                    title="Robots"
                    value={robots.length}
                    icon={<Bot className="h-5 w-5" />}
                />
                <StatCard
                    title="Materiales"
                    value={materiales.length}
                    icon={<Package className="h-5 w-5" />}
                />
            </div>


            <div className="grid gap-6 lg:grid-cols-2">
                {/* Active Loans */}
                <div className="rounded-xl border bg-card p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold flex items-center gap-2">
                            <ClipboardList className="h-4 w-4 text-primary" />
                            Préstamos Activos
                        </h2>
                        <Badge variant="warning">{prestamosActivos.length}</Badge>
                    </div>
                    {prestamosActivos.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">No hay préstamos activos</p>
                    ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {prestamosActivos.slice(0, 5).map((p) => (
                                <div key={p.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                                    <span>Préstamo #{p.id}</span>
                                    <Badge variant={getEstadoBadgeVariant(p.estado)}>{p.estado}</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Movements */}
                <div className="rounded-xl border bg-card p-5 space-y-4">
                    <h2 className="font-semibold flex items-center gap-2">
                        <HistoryIcon className="h-4 w-4 text-primary" />
                        Movimientos Recientes
                    </h2>

                    {movimientos.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">No hay movimientos recientes</p>
                    ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {movimientos.slice(0, 5).map((m) => (

                                <div key={m.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                                    <div>
                                        <span className="font-medium capitalize">{m.tipo}</span>
                                        {m.descripcion && (
                                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{m.descripcion}</p>
                                        )}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{formatDateTime(m.created_at)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
