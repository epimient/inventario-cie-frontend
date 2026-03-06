import { useState } from 'react';
import { Plus, Undo2, Trash2, Search, Filter, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/auth-context';
import { usePrestamos } from '@/hooks/use-prestamos';
import { usePrestatarios } from '@/hooks/use-prestatarios';
import { useEquipos } from '@/hooks/use-equipos';
import { useElectronica } from '@/hooks/use-electronica';
import { useRobots } from '@/hooks/use-robots';
import { useMateriales } from '@/hooks/use-materiales';
import { formatDate } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/error-handler';
import type { Prestamo, PrestamoCreate } from '@/types';

const estadoOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'activo', label: 'Activo' },
    { value: 'devuelto', label: 'Devuelto' },
    { value: 'vencido', label: 'Vencido' },
    { value: 'perdido', label: 'Perdido' },
];

const itemTypeOptions = [
    { value: 'equipo', label: 'Equipo' },
    { value: 'electronica', label: 'Electrónica' },
    { value: 'robot', label: 'Robot' },
    { value: 'material', label: 'Material' },
];

export default function PrestamosPage() {
    const { prestamos, isLoading, isError, error, createPrestamo, devolverPrestamo, deletePrestamo } = usePrestamos();
    const { prestatarios, isLoading: loadingPrestatarios } = usePrestatarios();
    const { equipos, isLoading: loadingEquipos } = useEquipos();
    const { electronica, isLoading: loadingElectronica } = useElectronica();
    const { robots, isLoading: loadingRobots } = useRobots();
    const { materiales, isLoading: loadingMateriales } = useMateriales();

    const [search, setSearch] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<Prestamo | null>(null);
    const [itemType, setItemType] = useState('equipo');

    const [form, setForm] = useState<PrestamoCreate>({
        prestatario_id: 0,
        equipo_id: undefined,
        electronica_id: undefined,
        robot_id: undefined,
        material_id: undefined,
        fecha_limite: '',
        observaciones: '',
    });

    const { toast } = useToast();
    const { hasRole } = useAuth();
    const canEdit = hasRole(['admin', 'inventory']);
    const canDelete = hasRole(['admin']);

    const isLoadingData = isLoading || loadingPrestatarios || loadingEquipos || loadingElectronica || loadingRobots || loadingMateriales;

    // Manejo de errores de API
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <div className="text-center space-y-2">
                    <h3 className="font-semibold">Error al cargar préstamos</h3>
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

    const openCreate = () => {
        setForm({
            prestatario_id: 0,
            equipo_id: undefined,
            electronica_id: undefined,
            robot_id: undefined,
            material_id: undefined,
            fecha_limite: '',
            observaciones: '',
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (form.prestatario_id === 0) {
            toast('Debe seleccionar un prestatario', 'error');
            return;
        }

        // Validate that at least one item is selected
        if (!form.equipo_id && !form.electronica_id && !form.robot_id && !form.material_id) {
            toast('Debe seleccionar un ítem para prestar', 'error');
            return;
        }

        // Formatear fecha_limite a ISO 8601 con hora si está presente
        const formData: PrestamoCreate = {
            ...form,
            fecha_limite: form.fecha_limite ? `${form.fecha_limite}T23:59:59` : undefined,
        };

        try {
            await createPrestamo(formData);
            toast('Préstamo creado con éxito', 'success');
            setModalOpen(false);
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };

    const handleDevolver = async (id: number) => {
        try {
            await devolverPrestamo(id);
            toast('Ítem devuelto con éxito', 'success');
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteModal) return;
        try {
            await deletePrestamo(deleteModal.id);
            toast('Préstamo eliminado', 'success');
            setDeleteModal(null);
        } catch (err: any) {
            toast(err.response?.data?.detail || 'Error al eliminar', 'error');
        }
    };

    const filtered = prestamos.filter((p) => {
        const matchesEstado = estadoFilter === 'all' || p.estado === estadoFilter;
        const prestatario = (prestatarios.find(pr => pr.id === p.prestatario_id)?.nombre || '').toLowerCase();
        const matchesSearch = prestatario.includes(search.toLowerCase()) ||
            (p.observaciones || '').toLowerCase().includes(search.toLowerCase());
        return matchesEstado && matchesSearch;
    });

    const getPrestatarioName = (id: number) => prestatarios.find(p => p.id === id)?.nombre || 'Desconocido';

    const getItemName = (p: Prestamo) => {
        if (p.equipo_id) return equipos.find(e => e.id === p.equipo_id)?.nombre || `Equipo #${p.equipo_id}`;
        if (p.electronica_id) return electronica.find(e => e.id === p.electronica_id)?.nombre || `Electrónica #${p.electronica_id}`;
        if (p.robot_id) return robots.find(e => e.id === p.robot_id)?.nombre || `Robot #${p.robot_id}`;
        if (p.material_id) return materiales.find(e => e.id === p.material_id)?.color || `Material #${p.material_id}`;
        return 'N/A';
    };

    const columns = [
        { key: 'id', header: 'ID', className: 'w-12 font-mono' },
        { key: 'prestatario', header: 'Prestatario', render: (p: Prestamo) => getPrestatarioName(p.prestatario_id) },
        { key: 'item', header: 'Ítem', render: (p: Prestamo) => getItemName(p) },
        { key: 'fecha_prestamo', header: 'Fecha Préstamo', render: (p: Prestamo) => formatDate(p.fecha_prestamo) },
        { key: 'fecha_limite', header: 'Fecha Límite', render: (p: Prestamo) => p.fecha_limite ? formatDate(p.fecha_limite) : '-' },
        {
            key: 'estado',
            header: 'Estado',
            render: (p: Prestamo) => {
                const variants: Record<string, any> = { activo: 'warning', devuelto: 'success', vencido: 'destructive', perdido: 'destructive' };
                return <Badge variant={variants[p.estado] || 'outline'}>{p.estado.toUpperCase()}</Badge>;
            }
        },
        {
            key: 'actions',
            header: '',
            className: 'w-24',
            render: (p: Prestamo) => (
                <div className="flex gap-1">
                    {p.estado === 'activo' && canEdit && (
                        <Button variant="ghost" size="icon" title="Devolver" onClick={() => handleDevolver(p.id)}>
                            <Undo2 className="h-4 w-4 text-primary" />
                        </Button>
                    )}
                    {canDelete && (
                        <Button variant="ghost" size="icon" title="Eliminar" onClick={() => setDeleteModal(p)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const availableItems = () => {
        switch (itemType) {
            case 'equipo': return equipos.filter(e => e.estado === 'disponible').map(e => ({ value: e.id.toString(), label: `${e.codigo} - ${e.nombre}` }));
            case 'electronica': return electronica.filter(e => e.en_stock > 0).map(e => ({ value: e.id.toString(), label: e.nombre }));
            case 'robot': return robots.filter(r => r.disponible > 0).map(r => ({ value: r.id.toString(), label: r.nombre }));
            case 'material': return materiales.filter(m => m.en_stock > 0).map(m => ({ value: m.id.toString(), label: `${m.categoria} - ${m.color}` }));
            default: return [];
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="flex flex-1 gap-2 max-w-2xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            placeholder="Buscar por prestatario u observaciones..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex h-9 w-full rounded-lg border border-input bg-transparent pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                    <div className="w-48">
                        <Select
                            value={estadoFilter}
                            onChange={(e) => setEstadoFilter(e.target.value)}
                            options={estadoOptions}
                        />
                    </div>
                </div>
                {canEdit && (
                    <Button onClick={openCreate}>
                        <Plus className="h-4 w-4" /> Nuevo préstamo
                    </Button>
                )}
            </div>

            <Table columns={columns} data={filtered} loading={isLoading} emptyMessage="No hay préstamos registrados" />

            {/* Create Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo préstamo">
                <div className="space-y-4">
                    <Select
                        label="Prestatario"
                        value={form.prestatario_id.toString()}
                        onChange={(e) => setForm({ ...form, prestatario_id: parseInt(e.target.value) })}
                        options={[{ value: '0', label: 'Seleccionar prestatario' }, ...prestatarios.filter(p => p.activo).map(p => ({ value: p.id.toString(), label: p.nombre }))]}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Tipo de ítem"
                            value={itemType}
                            onChange={(e) => {
                                setItemType(e.target.value);
                                setForm({ ...form, equipo_id: undefined, electronica_id: undefined, robot_id: undefined, material_id: undefined });
                            }}
                            options={itemTypeOptions}
                        />
                        <Select
                            label="Ítem"
                            value={(form.equipo_id || form.electronica_id || form.robot_id || form.material_id || '').toString()}
                            onChange={(e) => {
                                const id = parseInt(e.target.value);
                                setForm({
                                    ...form,
                                    equipo_id: itemType === 'equipo' ? id : undefined,
                                    electronica_id: itemType === 'electronica' ? id : undefined,
                                    robot_id: itemType === 'robot' ? id : undefined,
                                    material_id: itemType === 'material' ? id : undefined,
                                });
                            }}
                            options={[{ value: '', label: 'Seleccionar ítem' }, ...availableItems()]}
                            required
                        />
                    </div>

                    <Input
                        label="Fecha Límite (Opcional)"
                        type="date"
                        value={form.fecha_limite || ''}
                        onChange={(e) => setForm({ ...form, fecha_limite: e.target.value })}
                    />

                    <Input
                        label="Observaciones"
                        value={form.observaciones || ''}
                        onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                    />

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave}>Crear Préstamo</Button>
                    </div>
                </div>
            </Modal>

            {/* Delete confirmation */}
            <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Confirmar eliminación">
                <p className="text-sm text-muted-foreground mb-4">
                    ¿Estás seguro de eliminar el registro de préstamo #{deleteModal?.id}? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
                </div>
            </Modal>
        </div>
    );
}
