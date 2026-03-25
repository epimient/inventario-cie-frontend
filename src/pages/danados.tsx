import { useState } from 'react';
import { useEquipos } from '@/hooks/use-equipos';
import { useElectronica } from '@/hooks/use-electronica';
import { useRobotica } from '@/hooks/use-robotica';
import { AlertTriangle, Search, RefreshCw, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table } from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import type { Equipo, Electronica, Robot } from '@/types';

interface DanadoItem {
    id: number;
    tipo: 'equipo' | 'electronica' | 'robot';
    nombre: string;
    codigo?: string;
    descripcion?: string;
    estado: string;
}

const tabs = ['Todos', 'Equipos', 'Electrónica', 'Robótica'];

export default function DanadosPage() {
    const { equipos, isLoading: loadingEquipos } = useEquipos();
    const { robots, isLoading: loadingRobots } = useRobotica();
    const { electronica, isLoading: loadingElectronica } = useElectronica();
    const [activeTab, setActiveTab] = useState('Todos');
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const isLoading = loadingEquipos || loadingElectronica || loadingRobots;

    const equiposDanados = equipos.filter(e => e.estado === 'dañado' || e.estado === 'mantenimiento');
    const robotsDanados = robots.filter(r => r.fuera_de_servicio > 0);

    let items: DanadoItem[] = [];

    if (activeTab === 'Todos') {
        items = [
            ...equiposDanados.map(e => ({
                id: e.id,
                tipo: 'equipo' as const,
                nombre: e.nombre,
                codigo: e.codigo,
                descripcion: e.marca,
                estado: e.estado
            })),
            ...robotsDanados.map(r => ({
                id: r.id,
                tipo: 'robot' as const,
                nombre: r.nombre,
                codigo: undefined,
                descripcion: `${r.fuera_de_servicio} unidades fuera de servicio`,
                estado: 'fuera_de_servicio'
            }))
        ];
    } else if (activeTab === 'Equipos') {
        items = equiposDanados.map(e => ({
            id: e.id,
            tipo: 'equipo' as const,
            nombre: e.nombre,
            codigo: e.codigo,
            descripcion: e.marca,
            estado: e.estado
        }));
    } else if (activeTab === 'Electrónica') {
        items = [];
    } else if (activeTab === 'Robótica') {
        items = robotsDanados.map(r => ({
            id: r.id,
            tipo: 'robot' as const,
            nombre: r.nombre,
            codigo: undefined,
            descripcion: `${r.fuera_de_servicio} unidades fuera de servicio`,
            estado: 'fuera_de_servicio'
        }));
    }

    const filtered = items.filter(item =>
        item.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (item.codigo && item.codigo.toLowerCase().includes(search.toLowerCase()))
    );

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filtered.slice(startIndex, endIndex);

    const getBadgeVariant = (estado: string) => {
        if (estado === 'dañado') return 'destructive';
        if (estado === 'mantenimiento') return 'warning';
        return 'secondary';
    };

    const getTipoIcon = (tipo: string) => {
        if (tipo === 'equipo') return '💻';
        if (tipo === 'electronica') return '🔌';
        if (tipo === 'robot') return '🤖';
        return '📦';
    };

    const columns = [
        {
            key: 'tipo',
            header: 'Tipo',
            render: (item: DanadoItem) => (
                <span className="text-2xl">{getTipoIcon(item.tipo)}</span>
            )
        },
        { 
            key: 'codigo', 
            header: 'Código',
            render: (item: DanadoItem) => item.codigo ? (
                <span className="font-mono text-xs text-muted-foreground">{item.codigo}</span>
            ) : '-'
        },
        {
            key: 'nombre',
            header: 'Nombre',
            render: (item: DanadoItem) => <span className="font-bold text-[#1a1f1c]">{item.nombre}</span>
        },
        { 
            key: 'descripcion', 
            header: 'Descripción',
            render: (item: DanadoItem) => <span className="text-muted-foreground">{item.descripcion}</span>
        },
        {
            key: 'estado',
            header: 'Estado',
            render: (item: DanadoItem) => (
                <Badge variant={getBadgeVariant(item.estado)}>
                    {item.estado === 'dañado' ? 'Dañado' : item.estado === 'mantenimiento' ? 'Mantenimiento' : 'Fuera de servicio'}
                </Badge>
            ),
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in pb-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-extrabold text-[#2d3335] tracking-tighter leading-none">Equipos Dañados</h2>
                    <p className="text-[#5a6062] max-w-md">Lista de equipos que requieren reparación o mantenimiento.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 px-5 rounded-full gap-2 font-semibold">
                        <RefreshCw className="h-4 w-4" /> Reportar Daño
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 p-6 rounded-xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                        <XCircle className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-red-600">{equiposDanados.filter(e => e.estado === 'dañado').length}</p>
                        <p className="text-sm text-red-600/70 font-medium">Dañados</p>
                    </div>
                </div>
                <div className="bg-yellow-50 p-6 rounded-xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-yellow-600">{equiposDanados.filter(e => e.estado === 'mantenimiento').length}</p>
                        <p className="text-sm text-yellow-600/70 font-medium">En Mantenimiento</p>
                    </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-gray-600">{robotsDanados.reduce((acc, r) => acc + r.fuera_de_servicio, 0)}</p>
                        <p className="text-sm text-gray-600/70 font-medium">Robots Fuera de Servicio</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab
                            ? 'bg-[#4f645b] text-white'
                            : 'bg-[#f1f4f5] text-[#5a6062] hover:bg-[#dee3e6]'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                    placeholder="Buscar equipo dañado..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="flex h-12 w-full rounded-2xl border border-transparent bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] pl-12 pr-4 text-sm placeholder:text-muted-foreground transition-all hover:border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E8F3EE] focus:border-[#4f645b]"
                />
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 overflow-hidden">
                <Table columns={columns} data={paginatedData} loading={isLoading} emptyMessage="No se encontraron equipos dañados" />

                {/* Pagination */}
                {!isLoading && filtered.length > 0 && (
                    <div className="px-8 py-5 border-t border-gray-50 flex items-center justify-between text-sm text-muted-foreground font-medium">
                        <span>Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} registros</span>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-30"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = i + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-4 py-2 rounded-xl font-bold transition-colors ${currentPage === page
                                            ? 'bg-[#E8F3EE] text-[#4f645b]'
                                            : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-30"
                            >
                                <ArrowLeft className="h-4 w-4 rotate-180" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
