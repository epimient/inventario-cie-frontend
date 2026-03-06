import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/auth-context';
import { useMateriales } from '@/hooks/use-materiales';
import { formatDate } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/error-handler';
import type { Material, MaterialCreate } from '@/types';
import { Spinner } from '@/components/ui/spinner';


const categoriaOptions = [
    { value: 'Filamento', label: 'Filamento' },
    { value: 'Resina', label: 'Resina' },
    { value: 'Otro', label: 'Otro' },
];

export default function MaterialesPage() {
    const { materiales: items, isLoading, isError, error, createMaterial, updateMaterial, deleteMaterial, isCreating, isUpdating } = useMateriales();
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<Material | null>(null);
    const [editing, setEditing] = useState<Material | null>(null);
    const [form, setForm] = useState<MaterialCreate>({ color: '', cantidad: '', categoria: 'Filamento', usado: 0, en_uso: 0, en_stock: 0 });
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
                    <h3 className="font-semibold">Error al cargar materiales</h3>
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


    const openCreate = () => { setEditing(null); setForm({ color: '', cantidad: '', categoria: 'Filamento', usado: 0, en_uso: 0, en_stock: 0 }); setModalOpen(true); };
    const openEdit = (item: Material) => { setEditing(item); setForm({ color: item.color, cantidad: item.cantidad, categoria: item.categoria, tipo_id: item.tipo_id, usado: item.usado, en_uso: item.en_uso, en_stock: item.en_stock }); setModalOpen(true); };

    const handleSave = async () => {
        try {
            if (editing) { await updateMaterial({ id: editing.id, data: form }); toast('Actualizado', 'success'); }
            else { await createMaterial(form); toast('Creado', 'success'); }
            setModalOpen(false);
        } catch (err: any) { toast(getErrorMessage(err), 'error'); }
    };


    const handleDelete = async () => {
        if (!deleteModal) return;
        try { await deleteMaterial(deleteModal.id); toast('Eliminado', 'success'); setDeleteModal(null); }
        catch (err: any) { toast(getErrorMessage(err), 'error'); }
    };


    const filtered = items.filter(e => (e.color || '').toLowerCase().includes(search.toLowerCase()) || (e.categoria || '').toLowerCase().includes(search.toLowerCase()));

    const columns = [
        { key: 'color', header: 'Color' },
        { key: 'categoria', header: 'Categoría', render: (e: Material) => <Badge>{e.categoria}</Badge> },
        { key: 'cantidad', header: 'Cantidad' },
        { key: 'en_stock', header: 'En Stock' },
        { key: 'en_uso', header: 'En Uso' },
        { key: 'usado', header: 'Usado' },
        { key: 'total', header: 'Total' },
        { key: 'created_at', header: 'Creado', render: (e: Material) => formatDate(e.created_at) },
        ...(canEdit ? [{
            key: 'actions', header: '', className: 'w-24', render: (e: Material) => (
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
                    <input placeholder="Buscar materiales..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex h-9 w-full rounded-lg border border-input bg-transparent pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
                {canEdit && <Button onClick={openCreate}><Plus className="h-4 w-4" /> Nuevo material</Button>}
            </div>
            <Table columns={columns} data={filtered} loading={isLoading} emptyMessage="No hay materiales" />

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar material' : 'Nuevo material'}>
                <div className="space-y-3">
                    <Input label="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} required />
                    <Select label="Categoría" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value as Material['categoria'] })} options={categoriaOptions} />
                    <Input label="Cantidad" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} placeholder="1KG" />
                    <div className="grid grid-cols-3 gap-3">
                        <Input label="En Stock" type="number" value={form.en_stock} onChange={(e) => setForm({ ...form, en_stock: +e.target.value })} />
                        <Input label="En Uso" type="number" value={form.en_uso} onChange={(e) => setForm({ ...form, en_uso: +e.target.value })} />
                        <Input label="Usado" type="number" value={form.usado} onChange={(e) => setForm({ ...form, usado: +e.target.value })} />
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
                <p className="text-sm text-muted-foreground mb-4">¿Eliminar material <strong>{deleteModal?.color} ({deleteModal?.categoria})</strong>?</p>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
                </div>
            </Modal>
        </div>
    );
}
