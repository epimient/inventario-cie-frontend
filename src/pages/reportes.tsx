import { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, Printer, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import * as exportService from '@/services/export';

export default function ReportesPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const { toast } = useToast();

    const handleExportJSON = async () => {
        setLoading('json');
        try {
            const data = await exportService.exportJSON();
            exportService.downloadJSON(data, `backup_inventario_${new Date().toISOString().split('T')[0]}.json`);
            toast('Exportación completada', 'success');
        } catch (err: any) {
            toast('Error al exportar: ' + (err.response?.data?.detail || err.message), 'error');
        } finally {
            setLoading(null);
        }
    };

    const handleExportResumen = async () => {
        setLoading('resumen');
        try {
            const data = await exportService.exportResumen();
            exportService.downloadJSON(data, `resumen_inventario_${new Date().toISOString().split('T')[0]}.json`);
            toast('Resumen exportado', 'success');
        } catch (err: any) {
            toast('Error al exportar: ' + (err.response?.data?.detail || err.message), 'error');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-extrabold text-[#2d3335] tracking-tighter leading-none">Reportes</h2>
                    <p className="text-[#5a6062] max-w-md">Exporta y genera reportes del inventario.</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#d1e8dd] p-6 rounded-xl">
                    <p className="text-xs font-bold text-[#42564e] uppercase tracking-widest mb-2">Exportar</p>
                    <p className="text-2xl font-black text-[#2f433c]">JSON</p>
                    <p className="text-xs text-[#42564e]/70 mt-1">Copia de seguridad completa</p>
                </div>
                <div className="bg-[#cae6fe] p-6 rounded-xl">
                    <p className="text-xs font-bold text-[#3a5569] uppercase tracking-widest mb-2">Exportar</p>
                    <p className="text-2xl font-black text-[#274255]">Resumen</p>
                    <p className="text-xs text-[#3a5569]/70 mt-1">Estadísticas generales</p>
                </div>
                <div className="bg-[#dcedff] p-6 rounded-xl">
                    <p className="text-xs font-bold text-[#495867] uppercase tracking-widest mb-2">Exportar</p>
                    <p className="text-2xl font-black text-[#374655]">Excel</p>
                    <p className="text-xs text-[#495867]/70 mt-1">Formato para hojas de cálculo</p>
                </div>
                <div className="bg-[#fa746f]/20 p-6 rounded-xl">
                    <p className="text-xs font-bold text-[#6e0a12] uppercase tracking-widest mb-2">Reportes</p>
                    <p className="text-2xl font-black text-[#a83836]">Personalizado</p>
                    <p className="text-xs text-[#6e0a12]/70 mt-1">Genera reportes a medida</p>
                </div>
            </div>

            {/* Export Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* JSON Export */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
                    <div className="h-14 w-14 rounded-xl bg-[#4f645b] text-white flex items-center justify-center mb-6">
                        <FileJson className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2d3335] mb-2">Backup Completo</h3>
                    <p className="text-[#5a6062] text-sm mb-6">
                        Exporta todos los datos del sistema en formato JSON. Incluye equipos, electrónica, robótica, materiales y préstamos.
                    </p>
                    <Button 
                        onClick={handleExportJSON} 
                        disabled={loading === 'json'}
                        className="w-full h-12 rounded-xl font-semibold gap-2"
                    >
                        {loading === 'json' ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <Download className="h-4 w-4" />
                        )}
                        Descargar JSON
                    </Button>
                </div>

                {/* Resumen Export */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
                    <div className="h-14 w-14 rounded-xl bg-[#486277] text-white flex items-center justify-center mb-6">
                        <FileSpreadsheet className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2d3335] mb-2">Resumen Ejecutivo</h3>
                    <p className="text-[#5a6062] text-sm mb-6">
                        Exporta un resumen con estadísticas generales del inventario. Ideal para presentaciones y reportes administrativos.
                    </p>
                    <Button 
                        onClick={handleExportResumen} 
                        disabled={loading === 'resumen'}
                        variant="outline"
                        className="w-full h-12 rounded-xl font-semibold gap-2"
                    >
                        {loading === 'resumen' ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#4f645b] border-t-transparent" />
                        ) : (
                            <Download className="h-4 w-4" />
                        )}
                        Descargar Resumen
                    </Button>
                </div>

                {/* Print Report */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
                    <div className="h-14 w-14 rounded-xl bg-[#516170] text-white flex items-center justify-center mb-6">
                        <Printer className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2d3335] mb-2">Imprimir Reporte</h3>
                    <p className="text-[#5a6062] text-sm mb-6">
                        Genera un reporte imprimible del estado actual del inventario. Incluye gráficos y estadísticas.
                    </p>
                    <Button 
                        onClick={() => window.print()}
                        variant="outline"
                        className="w-full h-12 rounded-xl font-semibold gap-2"
                    >
                        <Printer className="h-4 w-4" />
                        Imprimir
                    </Button>
                </div>
            </div>

            {/* Recent Exports */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/50">
                <h3 className="text-xl font-bold text-[#2d3335] mb-6">Últimas Exportaciones</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#f1f4f5]">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-[#4f645b]/10 flex items-center justify-center">
                                <FileJson className="h-5 w-5 text-[#4f645b]" />
                            </div>
                            <div>
                                <p className="font-semibold text-[#2d3335]">backup_inventario_2026-03-24.json</p>
                                <p className="text-xs text-[#5a6062]">Hace 2 horas</p>
                            </div>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#f1f4f5]">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-[#486277]/10 flex items-center justify-center">
                                <FileSpreadsheet className="h-5 w-5 text-[#486277]" />
                            </div>
                            <div>
                                <p className="font-semibold text-[#2d3335]">resumen_inventario_2026-03-23.json</p>
                                <p className="text-xs text-[#5a6062]">Ayer</p>
                            </div>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}
