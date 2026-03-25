import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, AlertCircle, Wrench, TrendingUp, Monitor, Cpu, Bot, FolderOpen, ArrowRight, QrCode, CheckCircle, RefreshCcw, Send, XCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import * as dashboardService from '@/services/dashboard';
import type { DashboardResumen } from '@/services/dashboard';

export default function DashboardPage() {
    const [resumen, setResumen] = useState<DashboardResumen | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadResumen() {
            try {
                const data = await dashboardService.getResumen();
                setResumen(data);
            } catch (err: any) {
                setError(err.message || 'Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        }
        loadResumen();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertTriangle className="h-12 w-12 text-red-500" />
                <div className="text-center space-y-2">
                    <h3 className="font-semibold">Error al cargar el dashboard</h3>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </div>
                <Button variant="outline" onClick={() => window.location.reload()} className="rounded-full">
                    Intentar de nuevo
                </Button>
            </div>
        );
    }

    const totalEquipos = resumen?.totales?.equipos || 0;
    const totalElectronica = resumen?.totales?.electronica || 0;
    const totalRobotica = resumen?.totales?.robots || 0;
    const totalMateriales = resumen?.totales?.materiales || 0;
    const prestamosActivos = resumen?.prestamos?.activos || 0;

    return (
        <div className="space-y-8 animate-fade-in pb-8">
            {/* Alert Section: Asymmetric Banner Layout */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Vencidos - Danger */}
                <div className="bg-[#fa746f]/40 p-6 rounded-xl flex items-start gap-4 border-l-4 border-[#a83836]">
                    <div className="bg-[#a83836] text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#a83836] leading-tight">Préstamos Vencidos</h3>
                        <p className="text-sm text-[#6e0a12] mt-1">
                            {resumen?.prestamos?.vencidos || 0} préstamos requieren devolución inmediata.
                        </p>
                        <Link to="/prestamos?tab=vencidos">
                            <button className="mt-3 text-xs font-bold uppercase tracking-wider text-[#a83836] underline decoration-2 underline-offset-4">
                                Ver Detalles
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Stock Bajo - Warning */}
                <div className="bg-[#dcedff]/40 p-6 rounded-xl flex items-start gap-4 border-l-4 border-[#495867]">
                    <div className="bg-[#516170] text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                        <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#374655] leading-tight">Stock Bajo</h3>
                        <p className="text-sm text-[#495867] mt-1">
                            Materiales críticos por debajo del umbral mínimo.
                        </p>
                        <Link to="/materiales">
                            <button className="mt-3 text-xs font-bold uppercase tracking-wider text-[#495867] underline decoration-2 underline-offset-4">
                                Reabastecer
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Mantenimiento - Info */}
                <div className="bg-[#cae6fe]/40 p-6 rounded-xl flex items-start gap-4 border-l-4 border-[#486277]">
                    <div className="bg-[#486277] text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                        <Wrench className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#486277] leading-tight">Mantenimiento</h3>
                        <p className="text-sm text-[#3a5569] mt-1">
                            Equipos programados para revisión preventiva.
                        </p>
                        <Link to="/danados">
                            <button className="mt-3 text-xs font-bold uppercase tracking-wider text-[#3a5569] underline decoration-2 underline-offset-4">
                                Ver Calendario
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stat Cards: Bento Grid Style */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Equipos Card */}
                <Link to="/equipos">
                    <div className="bg-[#f1f4f5] p-6 rounded-xl flex flex-col justify-between h-40 group hover:bg-[#d1e8dd] transition-all duration-300 cursor-pointer">
                        <div className="flex justify-between items-start">
                            <Monitor className="h-6 w-6 text-[#4f645b] group-hover:text-[#2f433c] transition-colors" />
                            <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#d1e8dd] text-[#42564e] group-hover:bg-[#4f645b] group-hover:text-white">+4%</span>
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold tracking-tighter text-[#2d3335] group-hover:text-[#2f433c] transition-colors">{totalEquipos}</p>
                            <p className="text-sm text-[#5a6062] group-hover:text-[#2f433c]/70 transition-colors">Total Equipos</p>
                        </div>
                    </div>
                </Link>

                {/* Electrónica Card */}
                <Link to="/electronica">
                    <div className="bg-[#f1f4f5] p-6 rounded-xl flex flex-col justify-between h-40 group hover:bg-[#cae6fe] transition-all duration-300 cursor-pointer">
                        <div className="flex justify-between items-start">
                            <Cpu className="h-6 w-6 text-[#486277] group-hover:text-[#274255] transition-colors" />
                            <TrendingUp className="h-5 w-5 text-[#767c7e] group-hover:text-[#486277] transition-colors" />
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold tracking-tighter text-[#2d3335] group-hover:text-[#274255] transition-colors">{totalElectronica}</p>
                            <p className="text-sm text-[#5a6062] group-hover:text-[#274255]/70 transition-colors">Electrónica</p>
                        </div>
                    </div>
                </Link>

                {/* Robótica Card */}
                <Link to="/robotica">
                    <div className="bg-[#f1f4f5] p-6 rounded-xl flex flex-col justify-between h-40 group hover:bg-[#f1f4f5] transition-all duration-300 cursor-pointer">
                        <div className="flex justify-between items-start">
                            <Bot className="h-6 w-6 text-[#4f645b] group-hover:text-[#2f433c] transition-colors" />
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold tracking-tighter text-[#2d3335]">{totalRobotica}</p>
                            <p className="text-sm text-[#5a6062]">Robots Activos</p>
                        </div>
                    </div>
                </Link>

                {/* Materiales Card */}
                <Link to="/materiales">
                    <div className="bg-[#f1f4f5] p-6 rounded-xl flex flex-col justify-between h-40 group hover:bg-[#dcedff] transition-all duration-300 cursor-pointer">
                        <div className="flex justify-between items-start">
                            <FolderOpen className="h-6 w-6 text-[#516170] group-hover:text-[#374655] transition-colors" />
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold tracking-tighter text-[#2d3335] group-hover:text-[#374655] transition-colors">{totalMateriales}</p>
                            <p className="text-sm text-[#5a6062] group-hover:text-[#374655]/70 transition-colors">Tipos Material</p>
                        </div>
                    </div>
                </Link>

                {/* Préstamos Card */}
                <Link to="/prestamos">
                    <div className="bg-[#f1f4f5] p-6 rounded-xl flex flex-col justify-between h-40 group hover:bg-[#fa746f]/20 transition-all duration-300 cursor-pointer">
                        <div className="flex justify-between items-start">
                            <Send className="h-6 w-6 text-[#a83836] group-hover:text-[#6e0a12] transition-colors" />
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold tracking-tighter text-[#2d3335] group-hover:text-[#a83836] transition-colors">{prestamosActivos}</p>
                            <p className="text-sm text-[#5a6062] group-hover:text-[#6e0a12]/70 transition-colors">Préstamos Hoy</p>
                        </div>
                    </div>
                </Link>
            </section>

            {/* Main Status & Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Equipos por Estado */}
                <section className="lg:col-span-2 space-y-6">
                    <div className="flex items-end justify-between">
                        <h3 className="text-2xl font-bold text-[#2d3335] tracking-tight">Equipos por Estado</h3>
                        <span className="text-sm text-[#5a6062] font-medium">Actualizado: {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="bg-[#f1f4f5] p-8 rounded-2xl space-y-6">
                        {/* Disponible */}
                        <div className="flex items-center gap-6">
                            <div className="w-2 h-16 rounded-full bg-[#4f645b]"></div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-[#2d3335]">Disponibles</span>
                                    <span className="font-bold text-[#4f645b]">{resumen?.equipos?.disponibles || 0} unidades</span>
                                </div>
                                <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                                    <div className="bg-[#4f645b] h-full w-[62%] rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* En Uso */}
                        <div className="flex items-center gap-6">
                            <div className="w-2 h-16 rounded-full bg-[#486277]"></div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-[#2d3335]">En Uso</span>
                                    <span className="font-bold text-[#486277]">{resumen?.equipos?.en_uso || 0} unidades</span>
                                </div>
                                <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                                    <div className="bg-[#486277] h-full w-[20%] rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Prestados */}
                        <div className="flex items-center gap-6">
                            <div className="w-2 h-16 rounded-full bg-[#516170]"></div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-[#2d3335]">Prestados</span>
                                    <span className="font-bold text-[#516170]">{resumen?.equipos?.prestados || 0} unidades</span>
                                </div>
                                <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                                    <div className="bg-[#516170] h-full w-[13%] rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Dañados */}
                        <div className="flex items-center gap-6">
                            <div className="w-2 h-16 rounded-full bg-[#a83836]"></div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-[#2d3335]">Dañados</span>
                                    <span className="font-bold text-[#a83836]">{resumen?.equipos?.danados || 0} unidades</span>
                                </div>
                                <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                                    <div className="bg-[#a83836] h-full w-[5%] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Loan Status */}
                <section className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-[#2d3335] tracking-tight">Estado de Préstamos</h3>
                        <Link to="/prestamos" className="text-sm font-semibold text-[#4f645b] flex items-center gap-1">
                            Ver todo <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="bg-[#f1f4f5] p-8 rounded-2xl space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            {/* Activos */}
                            <div className="bg-white p-6 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <RefreshCcw className="h-4 w-4 text-[#4f645b]" />
                                    <span className="text-xs font-bold text-[#5a6062] uppercase tracking-wider">Activos</span>
                                </div>
                                <p className="text-3xl font-black text-[#2d3335]">{resumen?.prestamos?.activos || 0}</p>
                            </div>

                            {/* Devueltos */}
                            <div className="bg-white p-6 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-xs font-bold text-[#5a6062] uppercase tracking-wider">Devueltos</span>
                                </div>
                                <p className="text-3xl font-black text-[#2d3335]">{resumen?.prestamos?.devueltos || 0}</p>
                            </div>

                            {/* Vencidos */}
                            <div className="bg-white p-6 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <XCircle className="h-4 w-4 text-red-500" />
                                    <span className="text-xs font-bold text-[#5a6062] uppercase tracking-wider">Vencidos</span>
                                </div>
                                <p className="text-3xl font-black text-[#a83836]">{resumen?.prestamos?.vencidos || 0}</p>
                            </div>
                        </div>

                        {/* Por Vencer */}
                        <div className="bg-[#dcedff] p-6 rounded-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-[#374655]">Préstamos por Vencer</p>
                                    <p className="text-xs text-[#495867]">En los próximos 7 días</p>
                                </div>
                                <p className="text-3xl font-black text-[#486277]">{resumen?.prestamos?.por_vencer_7_dias || 0}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Floating Quick Action (QR Scanner) */}
            <button
                className="fixed bottom-10 right-10 w-16 h-16 bg-[#4f645b] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
                title="Escanear Código QR"
            >
                <QrCode className="h-7 w-7" />
                <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity font-semibold">
                    Escanear Activo
                </span>
            </button>
        </div>
    );
}
