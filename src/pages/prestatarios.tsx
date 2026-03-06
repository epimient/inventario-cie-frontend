import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/auth-context';
import { usePrestatarios } from '@/hooks/use-prestatarios';
import { formatDate } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/error-handler';
import type { Prestatario, PrestatarioCreate } from '@/types';
import { Spinner } from '@/components/ui/spinner';


export default function PrestatariosPage() {
    const { prestatarios: items, isLoading, isError, error, createPrestatario, updatePrestatario, deletePrestatario, isCreating, isUpdating } = usePrestatarios();
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<Prestatario | null>(null);
    const [editing, setEditing] = useState<Prestatario | null>(null);
    const [form, setForm] = useState<PrestatarioCreate>({
        nombre: '', telefono: '', dependencia: '', cedula: '', email: '',
    });
    const { toast } = useToast();
    const { hasRole } = useAuth();
    const canEdit = hasRole(['admin', 'inventory']);

    // Manejo de errores de API
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <div className="text-center space-y-2">
                    <h3 className="font-semibold">Error al cargar prestatarios</h3>
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
        setForm({ nombre: '', telefono: '', dependencia: '', cedula: '', email: '' });
        setModalOpen(true);
    };

    const openEdit = (item: Prestatario) => {
        setEditing(item);
        setForm({
            nombre: item.nombre, telefono: item.telefono || '',
            dependencia: item.dependencia, cedula: item.cedula || '',
            email: item.email || '',
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editing) {
                await updatePrestatario({ id: editing.id, data: form });
                toast('Actualizado', 'success');
            } else {
                await createPrestatario(form);
                toast('Creado', 'success');
            }
            setModalOpen(false);
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };


    const handleDelete = async () => {
        if (!deleteModal) return;
        try {
            await deletePrestatario(deleteModal.id);
            toast('Inactivado', 'success');
            setDeleteModal(null);
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };


    const filtered = items.filter((e) =>
        (e.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.dependencia || '').toLowerCase().includes(search.toLowerCase()),
    );

    const columns = [
        { key: 'nombre', header: 'Nombre' },
        { key: 'cedula', header: 'Cédula', render: (e: Prestatario) => e.cedula || '-' },
        { key: 'dependencia', header: 'Dependencia' },
        { key: 'telefono', header: 'Teléfono', render: (e: Prestatario) => e.telefono || '-' },
        { key: 'email', header: 'Email', render: (e: Prestatario) => e.email || '-' },
        {
            key: 'activo', header: 'Estado',
            render: (e: Prestatario) => (
                <Badge variant={e.activo ? 'success' : 'secondary'}>
                    {e.activo ? 'Activo' : 'Inactivo'}
                </Badge>
            ),
        },
        ...(canEdit ? [{
            key: 'actions', header: '', className: 'w-24',
            render: (e: Prestatario) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={(ev) => { ev.stopPropagation(); openEdit(e); }}>
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(ev) => { ev.stopPropagation(); setDeleteModal(e); }}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                </div>
            ),
        }] : []),
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        placeholder="Buscar prestatarios..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex h-9 w-full rounded-lg border border-input bg-transparent pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>
                {canEdit && (
                    <Button onClick={openCreate}>
                        <Plus className="h-4 w-4" /> Nuevo prestatario
                    </Button>
                )}
            </div>
            <Table columns={columns} data={filtered} loading={isLoading} />


            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar' : 'Nuevo prestatario'}>
                <div className="space-y-3">
                    <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
                    <Input label="Cédula" value={form.cedula || ''} onChange={(e) => setForm({ ...form, cedula: e.target.value })} />
                    <Input label="Dependencia" value={form.dependencia} onChange={(e) => setForm({ ...form, dependencia: e.target.value })} required />
                    <Input label="Teléfono" value={form.telefono || ''} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
                    <Input label="Email" type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={isCreating || isUpdating}>
                            {editing ? (isUpdating ? <Spinner size="sm" /> : 'Guardar') : (isCreating ? <Spinner size="sm" /> : 'Crear')}
                        </Button>
                    </div>

                </div>
            </Modal>

            <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Confirmar">
                <p className="text-sm text-muted-foreground mb-4">¿Inactivar a <strong>{deleteModal?.nombre}</strong>?</p>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete}>Inactivar</Button>
                </div>
            </Modal>
        </div>
    );
}
