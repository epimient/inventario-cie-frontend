import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const hash = window.location.hash;
                if (!hash) {
                    navigate('/login');
                    return;
                }

                const params = new URLSearchParams(hash.substring(1));
                const token = params.get('access_token');
                const refreshToken = params.get('refresh_token');
                const type = params.get('token_type');

                if (token) {
                    localStorage.setItem('token', token);
                    
                    if (refreshToken) {
                        localStorage.setItem('refresh_token', refreshToken);
                    }

                    const userResponse = await fetch(
                        `${import.meta.env.VITE_API_URL || 'https://inventario-workinn-api.onrender.com/api/v1'}/auth/me`,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }
                    );

                    if (userResponse.ok) {
                        const user = await userResponse.json();
                        localStorage.setItem('user', JSON.stringify(user));
                    }

                    navigate('/dashboard');
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error en callback de autenticación:', error);
                navigate('/login');
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8F3EE] via-[#d1e8dd] to-[#b6dcc7] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-[#4f645b] mx-auto" />
                <p className="text-[#5a6062] dark:text-slate-400">Procesando tu sesión...</p>
            </div>
        </div>
    );
}

export default AuthCallback;