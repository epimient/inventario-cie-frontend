import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, AlertTriangle, History, Package, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { usePrestamos } from '@/hooks/use-prestamos';
import { usePrestatarios } from '@/hooks/use-prestatarios';
import { useEquipos } from '@/hooks/use-equipos';
import { useElectronica } from '@/hooks/use-electronica';
import { useRobotica } from '@/hooks/use-robotica';
import { useMateriales } from '@/hooks/use-materiales';
import { getErrorMessage } from '@/utils/error-handler';
import { Spinner } from '@/components/ui/spinner';

export default function NuevoPrestamoPage() {
    const navigate = useNavigate();
    const { createPrestamo, isCreating } = usePrestamos();
    const { prestatarios, isLoading: loadingPrestatarios } = usePrestatarios();
    const { equipos, isLoading: loadingEquipos } = useEquipos();
    const { electronica, isLoading: loadingElectronica } = useElectronica();
    const { robots, isLoading: loadingRobots } = useRobotica();
    const { materiales, isLoading: loadingMateriales } = useMateriales();
    
    const { toast } = useToast();
    
    const [form, setForm] = useState({
        prestatario_id: '',
        tipo_item: 'equipo',
        item_id: '',
        fecha_limite: '',
        observaciones: '',
    });

    const isLoading = loadingPrestatarios || loadingEquipos || loadingElectronica || loadingRobots || loadingMateriales;

    const equiposDisponibles = equipos.filter(e => e.estado === 'disponible');
    const electronicaDisponibles = electronica.filter(e => e.en_stock > 0);
    const robotsDisponibles = robots.filter(r => r.disponible > 0);
    const materialesDisponibles = materiales.filter(m => m.en_stock > 0);

    const getItems = () => {
        switch (form.tipo_item) {
            case 'equipo': return equiposDisponibles;
            case 'electronica': return electronicaDisponibles;
            case 'robotica': return robotsDisponibles;
            case 'material': return materialesDisponibles;
            default: return [];
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!form.prestatario_id || !form.item_id || !form.fecha_limite) {
            toast('Por favor complete todos los campos requeridos', 'error');
            return;
        }

        const fechaLimite = new Date(form.fecha_limite);
        const fechaMaxima = new Date();
        fechaMaxima.setDate(fechaMaxima.getDate() + 30);
        
        if (fechaLimite > fechaMaxima) {
            toast('La fecha límite no puede exceder 30 días', 'error');
            return;
        }

        try {
            const data: any = {
                prestatario_id: parseInt(form.prestatario_id),
                fecha_limite: form.fecha_limite,
                observaciones: form.observaciones,
            };

            switch (form.tipo_item) {
                case 'equipo': data.equipo_id = parseInt(form.item_id); break;
                case 'electronica': data.electronica_id = parseInt(form.item_id); break;
                case 'robotica': data.robot_id = parseInt(form.item_id); break;
                case 'material': data.material_id = parseInt(form.item_id); break;
            }

            await createPrestamo(data);
            toast('Préstamo creado con éxito', 'success');
            navigate('/prestamos');
        } catch (err: any) {
            toast(getErrorMessage(err), 'error');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground dark:text-[#7b7b8b]">
                <Link to="/prestamos" className="hover:text-[#4f645b] dark:hover:text-[#5a62b8]">Préstamos</Link>
                <span className="text-xs">›</span>
                <span className="font-semibold text-[#4f645b] dark:text-[#5a62b8]">Nuevo Préstamo</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-[#22214d] rounded-2xl p-8 shadow-sm dark:shadow-black/30 border border-gray-100/50 dark:border-[#292a69]/50">
                        <h2 className="text-2xl font-bold text-[#2d3335] dark:text-[#fdfdfd] mb-2">Nuevo Préstamo</h2>
                        <p className="text-[#5a6062] dark:text-[#dddeff] text-sm mb-8">
                            Registre la salida de equipos. Recuerde verificar el estado físico del material antes de confirmar.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Prestatario */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#2d3335] dark:text-[#fdfdfd] ml-1">Prestatario</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-[#7b7b8b]">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <select
                                        value={form.prestatario_id}
                                        onChange={(e) => setForm({ ...form, prestatario_id: e.target.value })}
                                        className="w-full h-14 pl-12 pr-4 bg-[#f1f4f5] dark:bg-[#292a69] border-none rounded-xl focus:ring-2 focus:ring-[#4f645b]/20 text-sm font-medium appearance-none dark:text-[#fdfdfd]"
                                        required
                                    >
                                        <option value="">Seleccione un usuario</option>
                                        {prestatarios.filter(p => p.activo).map(p => (
                                            <option key={p.id} value={p.id}>{p.nombre} - {p.dependencia}</option>
                                        ))}
                                    </select>
                                </div>
                                <p className="text-[11px] text-muted-foreground dark:text-[#7b7b8b] px-1 italic">El usuario debe estar activo en el sistema.</p>
                            </div>

                            {/* Tipo de Item */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#2d3335] dark:text-[#fdfdfd] ml-1">Tipo de Item</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-[#7b7b8b]">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <select
                                        value={form.tipo_item}
                                        onChange={(e) => setForm({ ...form, tipo_item: e.target.value, item_id: '' })}
                                        className="w-full h-14 pl-12 pr-4 bg-[#f1f4f5] dark:bg-[#292a69] border-none rounded-xl focus:ring-2 focus:ring-[#4f645b]/20 text-sm font-medium appearance-none dark:text-[#fdfdfd]"
                                    >
                                        <option value="equipo">Equipo</option>
                                        <option value="electronica">Electrónica</option>
                                        <option value="robotica">Robótica</option>
                                        <option value="material">Material</option>
                                    </select>
                                </div>
                            </div>

                            {/* Item */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#2d3335] dark:text-[#fdfdfd] ml-1">Item</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-[#7b7b8b]">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <select
                                        value={form.item_id}
                                        onChange={(e) => setForm({ ...form, item_id: e.target.value })}
                                        className="w-full h-14 pl-12 pr-4 bg-[#f1f4f5] dark:bg-[#292a69] border-none rounded-xl focus:ring-2 focus:ring-[#4f645b]/20 text-sm font-medium appearance-none dark:text-[#fdfdfd]"
                                        required
                                    >
                                        <option value="">Seleccione un item disponible</option>
                                        {getItems().map((item: any) => (
                                            <option key={item.id} value={item.id}>
                                                {item.nombre || item.color} {item.codigo ? `(${item.codigo})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <p className="text-[11px] text-muted-foreground dark:text-[#7b7b8b] px-1 italic">Solo se listan items con estado "Disponible".</p>
                            </div>

                            {/* Fecha Límite */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#2d3335] dark:text-[#fdfdfd] ml-1">Fecha Límite</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-[#7b7b8b]">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="datetime-local"
                                        value={form.fecha_limite}
                                        onChange={(e) => setForm({ ...form, fecha_limite: e.target.value })}
                                        className="w-full h-14 pl-12 pr-4 bg-[#f1f4f5] dark:bg-[#292a69] border-none rounded-xl focus:ring-2 focus:ring-[#4f645b]/20 text-sm font-medium dark:text-[#fdfdfd]"
                                        required
                                    />
                                </div>
                                <div className="flex items-center gap-1.5 px-1 mt-1">
                                    <CheckCircle className="h-4 w-4 text-[#4f645b]" />
                                    <p className="text-[11px] font-bold text-[#4f645b]">Máximo 30 días de préstamo permitido.</p>
                                </div>
                            </div>

                            {/* Observaciones */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#2d3335] dark:text-[#fdfdfd] ml-1">Observaciones</label>
                                <textarea
                                    value={form.observaciones}
                                    onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                                    placeholder="Detalles adicionales sobre el préstamo, estado inicial del equipo, o propósitos específicos..."
                                    className="w-full p-4 bg-[#f1f4f5] dark:bg-[#292a69] border-none rounded-xl focus:ring-2 focus:ring-[#4f645b]/20 text-sm font-medium resize-none dark:text-[#fdfdfd] dark:placeholder:text-[#7b7b8b]"
                                    rows={4}
                                />
                            </div>

                            {/* Actions */}
                            <div className="pt-6 flex items-center justify-end gap-4 border-t border-gray-100 dark:border-[#292a69]">
                                <Link to="/prestamos">
                                    <Button type="button" variant="ghost" className="px-8 py-3 rounded-full dark:text-[#dddeff] dark:hover:bg-[#292a69]">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={isCreating}
                                    className="px-10 py-3 bg-gradient-to-br from-[#4f645b] to-[#43574f] dark:from-[#3b438e] dark:to-[#292a69] text-white rounded-full font-bold shadow-lg shadow-[#4f645b]/20 dark:shadow-[#3b438e]/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                                >
                                    {isCreating ? <Spinner size="sm" /> : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Crear Préstamo
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Quick Info Cards */}
                <div className="space-y-4">
                    <div className="bg-[#cae6fe] dark:bg-[#3b438e]/30 p-5 rounded-xl">
                        <h4 className="text-[#274255] dark:text-[#9fb3ff] font-bold text-xs uppercase tracking-widest mb-2">Préstamos Activos</h4>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-black text-[#274255] dark:text-[#9fb3ff]">{equiposDisponibles.length}</span>
                            <History className="h-6 w-6 text-[#274255]/30 dark:text-[#9fb3ff]/30" />
                        </div>
                    </div>
                    <div className="bg-[#f1f4f5] dark:bg-[#292a69] p-5 rounded-xl">
                        <h4 className="text-muted-foreground dark:text-[#7b7b8b] font-bold text-xs uppercase tracking-widest mb-2">Devoluciones Hoy</h4>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-black text-[#2d3335] dark:text-[#fdfdfd]">0</span>
                            <History className="h-6 w-6 text-muted-foreground/30 dark:text-[#7b7b8b]/30" />
                        </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl">
                        <h4 className="text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-widest mb-2">Vencidos</h4>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-black text-red-600 dark:text-red-400">0</span>
                            <AlertTriangle className="h-6 w-6 text-red-600/30 dark:text-red-400/30" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
