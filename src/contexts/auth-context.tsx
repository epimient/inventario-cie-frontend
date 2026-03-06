import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import * as authService from '@/services/auth';
import type { User } from '@/types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = authService.getUser();
        const storedToken = authService.getToken();
        if (storedUser && storedToken) {
            setUser(storedUser);
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        setUser(response.user);
        setToken(response.access_token);
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setToken(null);
    };

    const hasRole = (roles: string[]): boolean => {
        return user ? roles.includes(user.rol) : false;
    };

    return (
        <AuthContext.Provider
            value={{ user, token, loading, login, logout, isAuthenticated: !!token, hasRole }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
