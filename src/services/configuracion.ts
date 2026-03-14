import api from '@/lib/api';

export interface ConfiguracionAlerta {
    id: number;
    clave: string;
    valor: number;
    descripcion?: string;
    updated_at?: string;
}

export const configuracionService = {
    // Obtener todas las configuraciones
    async getAll(): Promise<ConfiguracionAlerta[]> {
        const { data } = await api.get('/configuracion/alertas');
        return data;
    },

    // Obtener configuración específica
    async getByClave(clave: string): Promise<ConfiguracionAlerta> {
        const { data } = await api.get(`/configuracion/alertas/${clave}`);
        return data;
    },

    // Actualizar configuración
    async update(clave: string, valor: number): Promise<ConfiguracionAlerta> {
        const { data } = await api.put(`/configuracion/alertas/${clave}`, { valor });
        return data;
    },

    // Obtener valor numérico directamente
    async getValor(clave: string): Promise<number> {
        const config = await this.getByClave(clave);
        return config.valor;
    },
};
