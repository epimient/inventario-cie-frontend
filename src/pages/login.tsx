import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getErrorMessage } from '@/utils/error-handler';
import { Archive, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-[#13152d] p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#d1e8dd]/30 dark:bg-[#3b438e]/20 blur-[120px]"></div>
                <div className="absolute top-[60%] -right-[5%] w-[35%] h-[35%] rounded-full bg-[#cae6fe]/20 dark:bg-[#292a69]/30 blur-[100px]"></div>
                <div className="absolute bottom-[5%] left-[15%] w-[20%] h-[20%] rounded-full bg-[#dcedff]/20 dark:bg-[#3b438e]/25 blur-[80px]"></div>
            </div>

            {/* Theme toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-[#292a69] transition-colors text-[#5a6062] dark:text-[#dddeff]"
            >
                {theme === 'dark' ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                )}
            </button>

            <div className="relative z-10 w-full max-w-md">
                {/* Brand Identity Header */}
                <div className="mb-10 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#4f645b] dark:bg-[#3b438e] rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-[#4f645b]/10 dark:shadow-[#3b438e]/30">
                        <Archive className="text-[#e7fef3] dark:text-[#fdfdfd] text-3xl" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#2d3335] dark:text-[#fdfdfd] mb-2">The Curator</h1>
                    <p className="text-[#5a6062] dark:text-[#dddeff] font-medium tracking-wide">Inventario CIE API</p>
                </div>

                {/* Login Card */}
                <div className="w-full p-8 md:p-10 rounded-2xl shadow-2xl shadow-[#2d3335]/5 dark:shadow-black/40 flex flex-col gap-8 bg-white/70 dark:bg-[#22214d]/70 backdrop-blur-xl border border-white/30 dark:border-[#292a69]/50">
                    <header className="space-y-1">
                        <h2 className="text-xl font-bold text-[#2d3335] dark:text-[#fdfdfd]">Bienvenido</h2>
                        <p className="text-[#5a6062] dark:text-[#dddeff] text-sm">Ingresa tus credenciales para continuar</p>
                    </header>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Email Field */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-[#5a6062] dark:text-[#dddeff] px-1" htmlFor="email">
                                Correo Electrónico
                            </label>
                            <div className="relative flex items-center">
                                <svg className="absolute left-4 text-[#5a6062] dark:text-[#dddeff] text-xl" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="nombre@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full h-14 pl-12 pr-4 bg-[#ebeef0] dark:bg-[#292a69] border-0 rounded-xl text-[#2d3335] dark:text-[#fdfdfd] placeholder:text-[#adb3b5] dark:placeholder:text-[#7b7b8b] focus:ring-2 focus:ring-[#4f645b]/40 dark:focus:ring-[#3b438e]/50 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-[#5a6062] dark:text-[#dddeff]" htmlFor="password">
                                    Contraseña
                                </label>
                                <a className="text-xs font-bold text-[#4f645b] dark:text-[#3b438e] hover:text-[#43574f] dark:hover:text-[#5a62b8] transition-colors" href="#">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                            <div className="relative flex items-center">
                                <svg className="absolute left-4 text-[#5a6062] dark:text-[#dddeff] text-xl" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full h-14 pl-12 pr-12 bg-[#ebeef0] dark:bg-[#292a69] border-0 rounded-xl text-[#2d3335] dark:text-[#fdfdfd] placeholder:text-[#adb3b5] dark:placeholder:text-[#7b7b8b] focus:ring-2 focus:ring-[#4f645b]/40 dark:focus:ring-[#3b438e]/50 transition-all duration-300"
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 text-[#5a6062] dark:text-[#dddeff] hover:text-[#2d3335] dark:hover:text-[#fdfdfd] transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="rounded-lg bg-[#fa746f]/10 dark:bg-[#e53f67]/20 border border-[#fa746f]/20 dark:border-[#e53f67]/40 px-4 py-3 text-sm text-[#a83836] dark:text-[#ff9fb3]">
                                {error}
                            </div>
                        )}

                        {/* Action Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-gradient-to-br from-[#4f645b] to-[#43574f] dark:from-[#3b438e] dark:to-[#292a69] text-[#e7fef3] dark:text-[#fdfdfd] font-bold rounded-full shadow-lg shadow-[#4f645b]/20 dark:shadow-[#3b438e]/40 hover:shadow-xl hover:shadow-[#4f645b]/30 dark:hover:shadow-[#3b438e]/50 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#e7fef3] dark:border-[#fdfdfd] border-t-transparent" />
                            ) : (
                                <>
                                    <span>Iniciar Sesión</span>
                                    <svg className="text-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Footer Links */}
                    <footer className="text-center pt-2">
                        <p className="text-sm text-[#5a6062] dark:text-[#dddeff]">
                            ¿No tienes acceso?
                            <Link className="font-bold text-[#4f645b] dark:text-[#3b438e] hover:text-[#43574f] dark:hover:text-[#5a62b8] underline decoration-[#4f645b]/30 dark:decoration-[#3b438e]/50 underline-offset-4" to="/registro">
                                Solicitar registro
                            </Link>
                        </p>
                    </footer>
                </div>

                {/* System Status Info */}
                <div className="mt-12 flex items-center gap-6 opacity-60 dark:opacity-80 justify-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#4f645b] dark:bg-[#3b438e] animate-pulse"></div>
                        <span className="text-xs font-medium tracking-tight text-[#5a6062] dark:text-[#dddeff]">API Operacional</span>
                    </div>
                    <div className="w-px h-3 bg-[#767c7e] dark:bg-[#7b7b8b]"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium tracking-tight text-[#5a6062] dark:text-[#dddeff]">v2.4.1</span>
                    </div>
                </div>
            </div>

            {/* Hidden visual context for UI completeness */}
            <div className="fixed bottom-0 left-0 p-8 hidden lg:block pointer-events-none">
                <p className="text-[10rem] font-black text-[#c3dacf]/10 dark:text-[#3b438e]/10 leading-none select-none">ARCHIVE</p>
            </div>
        </div>
    );
}
