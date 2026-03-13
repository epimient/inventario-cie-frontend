import { useState } from 'react';
import { Plus, Undo2, Trash2, Search, ChevronDown, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
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
import type { Prestamo, Prestatario, PrestamoCreate } from '@/types';

// ── Buscador de prestatarios ──────────────────────────────────────────────────
interface PrestatarioSearchProps {
    prestatarios: Prestatario[];
    value: number;
    onChange: (id: number) => void;
    loading: boolean;
    error?: string;
}

function PrestatarioSearch({ prestatarios, value, onChange, loading, error }: PrestatarioSearchProps) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);

    const selected = prestatarios.find((p) => p.id === value);

    const filtered = prestatarios.filter((p) => {
        const q = search.toLowerCase();
        return (
            p.nombre.toLowerCase().includes(q) ||
            (p.cedula ?? '').includes(q) ||
            p.dependencia.toLowerCase().includes(q)
        );
    });

    const handleSelect = (p: Prestatario) => {
        onChange(p.id);
        setSearch('');
        setOpen(false);
    };

    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
                Prestatario <span className="text-destructive">*</span>
            </label>
            <div className="relative">
                <div
                    className={`flex h-9 w-full items-center rounded-lg border px-3 text-sm cursor-text ${
                        error ? 'border-destructive' : 'border-input'
                    } bg-transparent focus-within:ring-2 focus-within:ring-ring`}
                    onClick={() => !loading && setOpen(true)}
                >
                    {open ? (
                        <input
                            autoFocus
                            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                            placeholder="Buscar por nombre, cédula o dependencia..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onBlur={() => setTimeout(() => setOpen(false), 150)}
                        />
                    ) : (
                        <span className={`flex-1 truncate ${!selected ? 'text-muted-foreground' : ''}`}>
                            {loading ? 'Cargando prestatarios...' : selected ? selected.nombre : 'Seleccionar prestatario'}
                        </span>
                    )}
                    {loading ? (
                        <Spinner size="sm" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                </div>

                {open && (
                    <div className="absolute z-50 w-full mt-1 rounded-lg border border-input bg-card shadow-lg max-h-52 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <p className="px-3 py-3 text-sm text-muted-foreground">
                                No se encontró ningún prestatario activo
                            </p>
                        ) : (
                            filtered.map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
                                    onMouseDown={() => handleSelect(p)}
                                >
                                    <span className="font-medium">{p.nombre}</span>
                                    {p.cedula && (
                                        <span className="text-muted-foreground ml-2 text-xs">· {p.cedula}</span>
                                    )}
                                    <span className="text-muted-foreground ml-2 text-xs">· {p.dependencia}</span>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

// ── Página principal ──────────────────────────────────────────────────────────
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

interface FormErrors {
    prestatario?: string;
    item?: string;
}

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
    const [devolverModal, setDevolverModal] = useState<Prestamo | null>(null);
    const [itemType, setItemType] = useState('equipo');
    const [formErrors, setFormErrors] = useState<FormErrors>({});

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

    const isLoadingItems = loadingEquipos || loadingElectronica || loadingRobots || loadingMateriales;

    // ── Error de API ──
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
        setItemType('equipo');
        setFormErrors({});
        setModalOpen(true);
    };

    // ── Validaciones explícitas ───────────────────────────────────────────────
    const validate = (): boolean => {
        const errors: FormErrors = {};

        // 1. Prestatario seleccionado y activo
        if (!form.prestatario_id || form.prestatario_id === 0) {
            errors.prestatario = 'Debe seleccionar un prestatario.';
        } else {
            const prestatario = prestatarios.find((p) => p.id === form.prestatario_id);
            if (!prestatario) {
                errors.prestatario = 'El prestatario seleccionado no existe.';
            } else if (!prestatario.activo) {
                errors.prestatario = 'Este prestatario está inactivo y no puede recibir préstamos.';
            }
        }

        // 2. Ítem seleccionado
        const itemId = form.equipo_id ?? form.electronica_id ?? form.robot_id ?? form.material_id;
        if (!itemId) {
            errors.item = 'Debe seleccionar un ítem para prestar.';
        } else {
            // Validaciones por tipo de ítem
            if (itemType === 'equipo' && form.equipo_id) {
                const equipo = equipos.find((e) => e.id === form.equipo_id);
                if (!equipo) {
                    errors.item = 'El equipo seleccionado no existe.';
                } else if (equipo.estado === 'prestado') {
                    errors.item = `"${equipo.nombre}" ya está prestado actualmente.`;
                } else if (equipo.estado === 'dañado') {
                    errors.item = `"${equipo.nombre}" está dañado y no puede prestarse.`;
                } else if (equipo.estado === 'mantenimiento') {
                    errors.item = `"${equipo.nombre}" está en mantenimiento y no puede prestarse.`;
                } else if (equipo.estado !== 'disponible') {
                    errors.item = `"${equipo.nombre}" no está disponible (estado: ${equipo.estado}).`;
                }
            }

            if (itemType === 'electronica' && form.electronica_id) {
                const item = electronica.find((e) => e.id === form.electronica_id);
                if (!item) {
                    errors.item = 'El componente seleccionado no existe.';
                } else if (item.en_stock <= 0) {
                    errors.item = `"${item.nombre}" no tiene unidades en stock.`;
                }
            }

            if (itemType === 'robot' && form.robot_id) {
                const robot = robots.find((r) => r.id === form.robot_id);
                if (!robot) {
                    errors.item = 'El robot seleccionado no existe.';
                } else if (robot.disponible <= 0) {
                    errors.item = `"${robot.nombre}" no tiene unidades disponibles.`;
                }
            }

            if (itemType === 'material' && form.material_id) {
                const material = materiales.find((m) => m.id === form.material_id);
                if (!material) {
                    errors.item = 'El material seleccionado no existe.';
                } else if (material.en_stock <= 0) {
                    errors.item = `El material seleccionado no tiene stock disponible.`;
                }
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

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

    const handleDevolver = async () => {
        if (!devolverModal) return;
        try {
            await devolverPrestamo(devolverModal.id);
            toast('Ítem devuelto con éxito', 'success');
            setDevolverModal(null);
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
        const prestatario = (prestatarios.find((pr) => pr.id === p.prestatario_id)?.nombre || '').toLowerCase();
        const matchesSearch =
            prestatario.includes(search.toLowerCase()) ||
            (p.observaciones || '').toLowerCase().includes(search.toLowerCase());
        return matchesEstado && matchesSearch;
    });

    const getPrestatarioName = (id: number) =>
        prestatarios.find((p) => p.id === id)?.nombre || 'Desconocido';

    const getItemName = (p: Prestamo) => {
        if (p.equipo_id) return equipos.find((e) => e.id === p.equipo_id)?.nombre || `Equipo #${p.equipo_id}`;
        if (p.electronica_id) return electronica.find((e) => e.id === p.electronica_id)?.nombre || `Electrónica #${p.electronica_id}`;
        if (p.robot_id) return robots.find((e) => e.id === p.robot_id)?.nombre || `Robot #${p.robot_id}`;
        if (p.material_id) return materiales.find((e) => e.id === p.material_id)?.color || `Material #${p.material_id}`;
        return 'N/A';
    };

    const availableItems = () => {
        const sort = (arr: { value: string; label: string; disabled: boolean }[]) =>
            arr.sort((a, b) => a.label.localeCompare(b.label, 'es'));

        switch (itemType) {
            case 'equipo':
                return sort(equipos.map((e) => ({
                    value: e.id.toString(),
                    label: e.estado === 'disponible'
                        ? `${e.codigo} - ${e.nombre}`
                        : `${e.codigo} - ${e.nombre} (${e.estado})`,
                    disabled: e.estado !== 'disponible',
                })));
            case 'electronica':
                return sort(electronica.map((e) => ({
                    value: e.id.toString(),
                    label: `${e.nombre} (stock: ${e.en_stock})`,
                    disabled: e.en_stock <= 0,
                })));
            case 'robot':
                return sort(robots.map((r) => ({
                    value: r.id.toString(),
                    label: `${r.nombre} (disponibles: ${r.disponible})`,
                    disabled: r.disponible <= 0,
                })));
            case 'material':
                return sort(materiales.map((m) => ({
                    value: m.id.toString(),
                    label: `${m.categoria} - ${m.color} (stock: ${m.en_stock})`,
                    disabled: m.en_stock <= 0,
                })));
            default:
                return [];
        }
    };

    const noItemsMessage = () => {
        switch (itemType) {
            case 'equipo': return 'No hay equipos disponibles. Pueden estar prestados, en mantenimiento o dañados.';
            case 'electronica': return 'No hay componentes de electrónica en stock.';
            case 'robot': return 'No hay robots disponibles.';
            case 'material': return 'No hay materiales en stock.';
            default: return '';
        }
    };

    const columns = [
        { key: 'id', header: 'ID', className: 'w-12 font-mono' },
        { key: 'prestatario', header: 'Prestatario', render: (p: Prestamo) => getPrestatarioName(p.prestatario_id) },
        {
            key: 'tipo',
            header: 'Tipo',
            render: (p: Prestamo) => {
                if (p.equipo_id) return <span className="text-xs text-muted-foreground">Equipo</span>;
                if (p.electronica_id) return <span className="text-xs text-muted-foreground">Electrónica</span>;
                if (p.robot_id) return <span className="text-xs text-muted-foreground">Robot</span>;
                if (p.material_id) return <span className="text-xs text-muted-foreground">Material</span>;
                return '-';
            },
        },
        { key: 'item', header: 'Ítem', render: (p: Prestamo) => getItemName(p) },
        { key: 'fecha_prestamo', header: 'Fecha Préstamo', render: (p: Prestamo) => formatDate(p.fecha_prestamo) },
        {
            key: 'fecha_limite',
            header: 'Fecha Límite',
            render: (p: Prestamo) => (p.fecha_limite ? formatDate(p.fecha_limite) : '-'),
        },
        {
            key: 'estado',
            header: 'Estado',
            render: (p: Prestamo) => {
                const variants: Record<string, any> = {
                    activo: 'warning',
                    devuelto: 'success',
                    vencido: 'destructive',
                    perdido: 'destructive',
                };
                return <Badge variant={variants[p.estado] || 'outline'}>{p.estado.toUpperCase()}</Badge>;
            },
        },
        {
            key: 'actions',
            header: '',
            className: 'w-24',
            render: (p: Prestamo) => (
                <div className="flex gap-1">
                    {p.estado === 'activo' && canEdit && (
                        <Button variant="ghost" size="icon" title="Devolver" onClick={() => setDevolverModal(p)}>
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

    const items = availableItems();

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

            <Table
                columns={columns}
                data={filtered}
                loading={isLoading}
                emptyMessage="No hay préstamos registrados"
            />

            {/* Modal: Nuevo préstamo */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo préstamo">
                <div className="space-y-4">
                    {/* Buscador de prestatarios */}
                    <PrestatarioSearch
                        prestatarios={prestatarios.filter((p) => p.activo)}
                        value={form.prestatario_id}
                        onChange={(id) => {
                            setForm({ ...form, prestatario_id: id });
                            setFormErrors((prev) => ({ ...prev, prestatario: undefined }));
                        }}
                        loading={loadingPrestatarios}
                        error={formErrors.prestatario}
                    />

                    {/* Tipo de ítem + selector */}
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Tipo de ítem"
                            value={itemType}
                            onChange={(e) => {
                                setItemType(e.target.value);
                                setForm({
                                    ...form,
                                    equipo_id: undefined,
                                    electronica_id: undefined,
                                    robot_id: undefined,
                                    material_id: undefined,
                                });
                                setFormErrors((prev) => ({ ...prev, item: undefined }));
                            }}
                            options={itemTypeOptions}
                        />

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">
                                Ítem <span className="text-destructive">*</span>
                            </label>
                            {isLoadingItems ? (
                                <div className="flex h-9 items-center gap-2 rounded-lg border border-input px-3 text-sm text-muted-foreground">
                                    <Spinner size="sm" /> Cargando...
                                </div>
                            ) : (
                                <select
                                    className={`flex h-9 w-full rounded-lg border px-3 py-1 text-sm bg-card text-foreground [&>option]:bg-card [&>option]:text-foreground [&>option:disabled]:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                        formErrors.item ? 'border-destructive' : 'border-input'
                                    }`}
                                    value={
                                        (form.equipo_id ?? form.electronica_id ?? form.robot_id ?? form.material_id ?? '').toString()
                                    }
                                    onChange={(e) => {
                                        const id = parseInt(e.target.value);
                                        setForm({
                                            ...form,
                                            equipo_id: itemType === 'equipo' ? id : undefined,
                                            electronica_id: itemType === 'electronica' ? id : undefined,
                                            robot_id: itemType === 'robot' ? id : undefined,
                                            material_id: itemType === 'material' ? id : undefined,
                                        });
                                        setFormErrors((prev) => ({ ...prev, item: undefined }));
                                    }}
                                >
                                    <option value="">Seleccionar ítem</option>
                                    {items.map((opt) => (
                                        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {formErrors.item && (
                                <p className="text-xs text-destructive">{formErrors.item}</p>
                            )}
                        </div>
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
                        <Button variant="outline" onClick={() => setModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave}>Crear Préstamo</Button>
                    </div>
                </div>
            </Modal>

            {/* Modal: Confirmación de devolución */}
            <Modal open={!!devolverModal} onClose={() => setDevolverModal(null)} title="Confirmar devolución">
                <p className="text-sm text-muted-foreground mb-1">
                    ¿Confirmas la devolución del préstamo <span className="font-semibold text-foreground">#{devolverModal?.id}</span>?
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                    El ítem volverá a estar disponible en el inventario.
                </p>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDevolverModal(null)}>Cancelar</Button>
                    <Button onClick={handleDevolver}>Confirmar devolución</Button>
                </div>
            </Modal>

            {/* Modal: Confirmación de eliminación */}
            <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Confirmar eliminación">
                <p className="text-sm text-muted-foreground mb-4">
                    ¿Estás seguro de eliminar el registro de préstamo #{deleteModal?.id}? Esta acción no se puede
                    deshacer.
                </p>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDeleteModal(null)}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Eliminar
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
