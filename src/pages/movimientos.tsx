import { useState } from 'react';
import { Search, History, ArrowUpRight, ArrowDownLeft, RefreshCcw, AlertTriangle, Trash2, ArrowRightLeft } from 'lucide-react';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMovimientos } from '@/hooks/use-movimientos';
import { useEquipos } from '@/hooks/use-equipos';
import { useElectronica } from '@/hooks/use-electronica';
import { useRobots } from '@/hooks/use-robots';
import { useMateriales } from '@/hooks/use-materiales';
import { formatDate } from '@/utils/formatters';
import type { Movimiento } from '@/types';

const tipoIcons: Record<string, any> = {
    entrada: <ArrowDownLeft className="h-4 w-4 text-success" />,
    salida: <ArrowUpRight className="h-4 w-4 text-warning" />,
    devolucion: <RefreshCcw className="h-4 w-4 text-primary" />,
    daño: <AlertTriangle className="h-4 w-4 text-destructive" />,
    ajuste_stock: <History className="h-4 w-4 text-muted-foreground" />,
    baja: <Trash2 className="h-4 w-4 text-destructive" />,
    transferencia: <ArrowRightLeft className="h-4 w-4 text-blue-500" />,
};

export default function MovimientosPage() {
    const { movimientos, isLoading, isError, error } = useMovimientos();
    const { equipos } = useEquipos();
    const { electronica } = useElectronica();
    const { robots } = useRobots();
    const { materiales } = useMateriales();

    const [search, setSearch] = useState('');

    // Manejo de errores de API
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <div className="text-center space-y-2">
                    <h3 className="font-semibold">Error al cargar movimientos</h3>
                    <p className="text-sm text-muted-foreground">
                        {error?.message || 'No se pudo conectar con el servidor'}
                    </p>
                </div>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    Intentar de nuevo
                </Button>
            </div>
        );
    }

    const getItemName = (m: Movimiento) => {
        if (m.equipo_id) return equipos.find(e => e.id === m.equipo_id)?.nombre || `Equipo #${m.equipo_id}`;
        if (m.electronica_id) return electronica.find(e => e.id === m.electronica_id)?.nombre || `Electrónica #${m.electronica_id}`;
        if (m.robot_id) return robots.find(e => e.id === m.robot_id)?.nombre || `Robot #${m.robot_id}`;
        if (m.material_id) return materiales.find(e => e.id === m.material_id)?.color || `Material #${m.material_id}`;
        return 'N/A';
    };

    const filtered = movimientos.filter((m) => {
        const itemName = (getItemName(m) || '').toLowerCase();
        const description = (m.descripcion || '').toLowerCase();
        const type = (m.tipo || '').toLowerCase();
        const query = search.toLowerCase();

        return itemName.includes(query) || description.includes(query) || type.includes(query);
    });

    const columns = [
        { key: 'id', header: 'ID', className: 'w-12 font-mono' },
        {
            key: 'tipo',
            header: 'Tipo',
            render: (m: Movimiento) => (
                <div className="flex items-center gap-2">
                    {tipoIcons[m.tipo]}
                    <span className="capitalize">{m.tipo.replace('_', ' ')}</span>
                </div>
            )
        },
        { key: 'item', header: 'Ítem', render: (m: Movimiento) => getItemName(m) },
        { key: 'cantidad', header: 'Cant.', className: 'text-center' },
        { key: 'descripcion', header: 'Descripción', className: 'max-w-xs truncate' },
        { key: 'fecha', header: 'Fecha', render: (m: Movimiento) => formatDate(m.created_at) },
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        placeholder="Filtrar movimientos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex h-9 w-full rounded-lg border border-input bg-transparent pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>
            </div>

            <Table columns={columns} data={filtered} loading={isLoading} emptyMessage="No se registran movimientos" />
        </div>
    );
}
