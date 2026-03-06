import api from '@/lib/api';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '@/types';

export async function login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/auth/login', data);
    const { access_token, refresh_token, token_type, user } = response.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify(user));
    return { access_token, refresh_token, token_type, user };
}

export async function register(data: RegisterRequest): Promise<User> {
    const response = await api.post('/auth/register', data);
    return response.data;
}

export async function logout(): Promise<void> {
    try {
        await api.post('/auth/logout');
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }
}

export async function getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
}

export function getToken(): string | null {
    return localStorage.getItem('token');
}

export function getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

export function isAuthenticated(): boolean {
    return !!getToken();
}

export function hasRole(roles: string[]): boolean {
    const user = getUser();
    return user ? roles.includes(user.rol) : false;
}

