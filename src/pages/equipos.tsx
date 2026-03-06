import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Badge, getEstadoBadgeVariant } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/auth-context';
import { useEquipos } from '@/hooks/use-equipos';
import { formatDate } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/error-handler';
import type { Equipo, EquipoCreate } from '@/types';
import { Spinner } from '@/components/ui/spinner';



const estadoOptions = [
    { value: 'disponible', label: 'Disponible' },
    { value: 'en uso', label: 'En uso' },
    { value: 'prestado', label: 'Prestado' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'dañado', label: 'Dañado' },
];

export default function EquiposPage() {
    const { equipos, isLoading, isError, error, createEquipo, updateEquipo, deleteEquipo, isCreating, isUpdating } = useEquipos();
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<Equipo | null>(null);
    const [editing, setEditing] = useState<Equipo | null>(null);
    const [form, setForm] = useState<EquipoCreate>({
        nombre: '', marca: '', codigo: '', accesorios: '', serial: '', estado: 'disponible',
    });
    const { toast } = useToast();
    const { hasRole } = useAuth();
    const canEdit = hasRole(['admin', 'inventory']);
    const canDelete = hasRole(['admin']);

    // Manejo de errores de API
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <div className="text-center space-y-2">
                    <h3 className="font-semibold">Error al cargar equipos</h3>
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
        setEditing(null);
        setForm({ nombre: '', marca: '', codigo: '', accesorios: '', serial: '', estado: 'disponible' });
        setModalOpen(true);
    };

    const openEdit = (equipo: Equipo) => {
        setEditing(equipo);
        setForm({ nombre: equipo.nombre, marca: equipo.marca, codigo: equipo.codigo, accesorios: equipo.accesorios || '', serial: equipo.serial || '', estado: equipo.estado });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editing) {
                await updateEquipo({ id: editing.id, data: form });
                toast('Equipo actualizado', 'success');
            } else {
                await createEquipo(form);
                toast('Equipo creado', 'success');
            }
            setModalOpen(false);
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };


    const handleDelete = async () => {
        if (!deleteModal) return;
        try {
            await deleteEquipo(deleteModal.id);
            toast('Equipo eliminado', 'success');
            setDeleteModal(null);
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };


    const filtered = equipos.filter((e) =>
        (e.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.codigo || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.marca || '').toLowerCase().includes(search.toLowerCase()),
    );

    const columns = [
        { key: 'codigo', header: 'Código', className: 'font-mono' },
        { key: 'nombre', header: 'Nombre' },
        { key: 'marca', header: 'Marca' },
        { key: 'serial', header: 'Serial' },
        {
            key: 'estado',
            header: 'Estado',
            render: (e: Equipo) => <Badge variant={getEstadoBadgeVariant(e.estado)}>{e.estado}</Badge>,
        },
        { key: 'created_at', header: 'Creado', render: (e: Equipo) => formatDate(e.created_at) },
        ...(canEdit
            ? [{
                key: 'actions',
                header: '',
                className: 'w-24',
                render: (e: Equipo) => (
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={(ev) => { ev.stopPropagation(); openEdit(e); }}>
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        {canDelete && (
                            <Button variant="ghost" size="icon" onClick={(ev) => { ev.stopPropagation(); setDeleteModal(e); }}>
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                        )}
                    </div>
                ),
            }]
            : []),
    ];

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        placeholder="Buscar por nombre, código o marca..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex h-9 w-full rounded-lg border border-input bg-transparent pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>
                {canEdit && (
                    <Button onClick={openCreate}>
                        <Plus className="h-4 w-4" /> Nuevo equipo
                    </Button>
                )}
            </div>

            <Table columns={columns} data={filtered} loading={isLoading} emptyMessage="No se encontraron equipos" />
            {/* Create/Edit Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar equipo' : 'Nuevo equipo'}>
                <div className="space-y-3">
                    <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
                    <Input label="Marca" value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} required />
                    <Input label="Código" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} required />
                    <Input label="Serial" value={form.serial || ''} onChange={(e) => setForm({ ...form, serial: e.target.value })} />
                    <Input label="Accesorios" value={form.accesorios || ''} onChange={(e) => setForm({ ...form, accesorios: e.target.value })} />
                    <Select label="Estado" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value as Equipo['estado'] })} options={estadoOptions} />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={isCreating || isUpdating}>
                            {editing ? (isUpdating ? <Spinner size="sm" /> : 'Guardar') : (isCreating ? <Spinner size="sm" /> : 'Crear')}
                        </Button>
                    </div>

                </div>
            </Modal>

            {/* Delete confirmation */}
            <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Confirmar eliminación">
                <p className="text-sm text-muted-foreground mb-4">
                    ¿Estás seguro de eliminar <strong>{deleteModal?.nombre}</strong> ({deleteModal?.codigo})?
                </p>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
                </div>
            </Modal>
        </div>
    );
}
