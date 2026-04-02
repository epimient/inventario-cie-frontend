import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/utils/cn';
import { Archive, Cpu, Bot, Package } from 'lucide-react';

const pageTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/equipos': 'Inventario',
    '/electronica': 'Electrónica',
    '/robotica': 'Robótica',
    '/materiales': 'Materiales',
    '/prestatarios': 'Prestatarios',
    '/prestamos': 'Préstamos',
    '/prestamos/nuevo': 'Nuevo Préstamo',
    '/movimientos': 'Movimientos',
    '/danados': 'Equipos Dañados',
    '/reportes': 'Reportes',
    '/configuracion': 'Configuración',
};

export function Layout() {
    const [collapsed, setCollapsed] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    
    const title = pageTitles[location.pathname] || 'Inventario CIE';

    const handleAddNew = (type: string) => {
        setAddModalOpen(false);
        switch (type) {
            case 'equipo':
                navigate('/equipos?new=true');
                break;
            case 'electronica':
                navigate('/electronica?new=true');
                break;
            case 'robotica':
                navigate('/robotica?new=true');
                break;
            case 'material':
                navigate('/materiales?new=true');
                break;
            default:
                break;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Sidebar 
                collapsed={collapsed} 
                onToggle={() => setCollapsed(!collapsed)} 
                onAddNew={() => setAddModalOpen(true)}
            />
            <div
                className={cn(
                    'transition-all duration-300',
                    collapsed ? 'lg:ml-20' : 'lg:ml-64',
                )}
            >
                <Header
                    title={title}
                    onMenuClick={() => setCollapsed(!collapsed)}
                />
                <main className="p-6 animate-fade-in">
                    <Outlet />
                </main>
            </div>

            {/* Modal Agregar Nuevo */}
            <Modal 
                open={addModalOpen} 
                onClose={() => setAddModalOpen(false)}
                title="Agregar Nuevo Item"
            >
                <div className="pt-2 pb-4">
                    <p className="text-sm text-muted-foreground mb-6">
                        Seleccione el tipo de item que desea agregar:
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleAddNew('equipo')}
                            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-transparent hover:border-[#4f645b] hover:bg-[#E8F3EE] transition-all group"
                        >
                            <div className="h-14 w-14 rounded-xl bg-[#4f645b] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Archive className="h-7 w-7" />
                            </div>
                            <span className="font-semibold text-[#1a1f1c] dark:text-[#fdfdfd]">Equipo</span>
                        </button>
                        <button
                            onClick={() => handleAddNew('electronica')}
                            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-transparent hover:border-[#486277] hover:bg-blue-50 dark:hover:bg-[#292a69] transition-all group"
                        >
                            <div className="h-14 w-14 rounded-xl bg-[#486277] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Cpu className="h-7 w-7" />
                            </div>
                            <span className="font-semibold text-[#1a1f1c] dark:text-[#fdfdfd]">Electrónica</span>
                        </button>
                        <button
                            onClick={() => handleAddNew('robotica')}
                            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-transparent hover:border-[#516170] hover:bg-gray-50 dark:hover:bg-[#292a69] transition-all group"
                        >
                            <div className="h-14 w-14 rounded-xl bg-[#516170] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Bot className="h-7 w-7" />
                            </div>
                            <span className="font-semibold text-[#1a1f1c] dark:text-[#fdfdfd]">Robótica</span>
                        </button>
                        <button
                            onClick={() => handleAddNew('material')}
                            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-transparent hover:border-[#4f645b] hover:bg-[#E8F3EE] dark:hover:bg-[#292a69] transition-all group"
                        >
                            <div className="h-14 w-14 rounded-xl bg-[#4f645b] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Package className="h-7 w-7" />
                            </div>
                            <span className="font-semibold text-[#1a1f1c] dark:text-[#fdfdfd]">Material</span>
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
