/**
 * Extrae el mensaje de error de una respuesta de API
 * Maneja diferentes formatos de error (string, objeto, array)
 */
export function getErrorMessage(error: any): string {
    // Error sin respuesta de red
    if (!error?.response) {
        return error?.message || 'Error de conexión. Verifica tu conexión e intenta de nuevo.';
    }

    const data = error.response?.data;

    // Error con detail como string
    if (typeof data?.detail === 'string') {
        return data.detail;
    }

    // Error con detail como objeto (Pydantic validation error)
    if (typeof data?.detail === 'object' && data?.detail !== null) {
        // Si es un array de errores
        if (Array.isArray(data.detail)) {
            return data.detail
                .map((err: any) => {
                    const field = err?.loc?.join('.') || 'Campo';
                    const message = err?.msg || 'Error desconocido';
                    return `${field}: ${message}`;
                })
                .join('; ');
        }

        // Si es un objeto con errores
        if (data.detail instanceof Object) {
            return Object.entries(data.detail)
                .map(([key, value]) => `${key}: ${value}`)
                .join('; ');
        }
    }

    // Error con errors array
    if (Array.isArray(data?.errors)) {
        return data.errors
            .map((err: any) => err?.message || err)
            .join('; ');
    }

    // Error con message
    if (typeof data?.message === 'string') {
        return data.message;
    }

    // Default
    return 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';
}
