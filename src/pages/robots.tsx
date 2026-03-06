import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/auth-context';
import { useRobots } from '@/hooks/use-robots';
import { formatDate } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/error-handler';
import type { Robot, RobotCreate } from '@/types';
import { Spinner } from '@/components/ui/spinner';


export default function RobotsPage() {
    const { robots: items, isLoading, isError, error, createRobot, updateRobot, deleteRobot, isCreating, isUpdating } = useRobots();
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<Robot | null>(null);
    const [editing, setEditing] = useState<Robot | null>(null);
    const [form, setForm] = useState<RobotCreate>({ nombre: '', fuera_de_servicio: 0, en_uso: 0, disponible: 0 });
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
                    <h3 className="font-semibold">Error al cargar robots</h3>
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


    const openCreate = () => { setEditing(null); setForm({ nombre: '', fuera_de_servicio: 0, en_uso: 0, disponible: 0 }); setModalOpen(true); };
    const openEdit = (item: Robot) => { setEditing(item); setForm({ nombre: item.nombre, fuera_de_servicio: item.fuera_de_servicio, en_uso: item.en_uso, disponible: item.disponible }); setModalOpen(true); };

    const handleSave = async () => {
        try {
            if (editing) { await updateRobot({ id: editing.id, data: form }); toast('Actualizado', 'success'); }
            else { await createRobot(form); toast('Creado', 'success'); }
            setModalOpen(false);
        } catch (err: any) { toast(getErrorMessage(err), 'error'); }
    };


    const handleDelete = async () => {
        if (!deleteModal) return;
        try { await deleteRobot(deleteModal.id); toast('Eliminado', 'success'); setDeleteModal(null); }
        catch (err: any) { toast(getErrorMessage(err), 'error'); }
    };


    const filtered = items.filter(e => (e.nombre || '').toLowerCase().includes(search.toLowerCase()));

    const columns = [
        { key: 'nombre', header: 'Nombre' },
        { key: 'disponible', header: 'Disponibles' },
        { key: 'en_uso', header: 'En Uso' },
        { key: 'fuera_de_servicio', header: 'Fuera Servicio' },
        { key: 'total', header: 'Total' },
        { key: 'created_at', header: 'Creado', render: (e: Robot) => formatDate(e.created_at) },
        ...(canEdit ? [{
            key: 'actions', header: '', className: 'w-24', render: (e: Robot) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={(ev) => { ev.stopPropagation(); openEdit(e); }}><Pencil className="h-3.5 w-3.5" /></Button>
                    {canDelete && <Button variant="ghost" size="icon" onClick={(ev) => { ev.stopPropagation(); setDeleteModal(e); }}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>}
                </div>
            )
        }] : []),
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input placeholder="Buscar robots..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex h-9 w-full rounded-lg border border-input bg-transparent pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
                {canEdit && <Button onClick={openCreate}><Plus className="h-4 w-4" /> Nuevo robot</Button>}
            </div>
            <Table columns={columns} data={filtered} loading={isLoading} emptyMessage="No hay robots" />

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar robot' : 'Nuevo robot'}>
                <div className="space-y-3">
                    <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
                    <div className="grid grid-cols-3 gap-3">
                        <Input label="Disponibles" type="number" value={form.disponible} onChange={(e) => setForm({ ...form, disponible: +e.target.value })} />
                        <Input label="En Uso" type="number" value={form.en_uso} onChange={(e) => setForm({ ...form, en_uso: +e.target.value })} />
                        <Input label="Fuera Serv." type="number" value={form.fuera_de_servicio} onChange={(e) => setForm({ ...form, fuera_de_servicio: +e.target.value })} />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={isCreating || isUpdating}>
                            {editing ? (isUpdating ? <Spinner size="sm" /> : 'Guardar') : (isCreating ? <Spinner size="sm" /> : 'Crear')}
                        </Button>
                    </div>

                </div>
            </Modal>
            <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Confirmar eliminación">
                <p className="text-sm text-muted-foreground mb-4">¿Eliminar <strong>{deleteModal?.nombre}</strong>?</p>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
                </div>
            </Modal>
        </div>
    );
}
