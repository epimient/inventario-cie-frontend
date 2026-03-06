import { Sun, Moon, LogOut, User, Menu } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    title: string;
    onMenuClick?: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = async () => {
        try {
            setDropdownOpen(false);
            await logout();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Forzar logout local incluso si falla la API
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            navigate('/login', { replace: true });
        }
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 backdrop-blur-xl px-6">
            <div className="flex items-center gap-3">
                {onMenuClick && (
                    <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                )}
                <h1 className="text-lg font-semibold">{title}</h1>
            </div>

            <div className="flex items-center gap-2">
                {/* Theme toggle */}
                <Button variant="ghost" size="icon" onClick={toggleTheme} title="Cambiar tema">
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-accent transition-colors"
                    >
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-3.5 w-3.5" />
                        </div>
                        <span className="hidden sm:inline font-medium">{user?.nombre}</span>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border bg-card p-2 shadow-xl animate-scale-in">
                            <div className="px-3 py-2 border-b mb-1">
                                <p className="text-sm font-medium">{user?.nombre}</p>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                                <span className="inline-block mt-1 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 capitalize">
                                    {user?.rol}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
