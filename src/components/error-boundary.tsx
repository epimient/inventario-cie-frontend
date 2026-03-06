import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="max-w-md w-full rounded-xl border bg-card p-6 text-center space-y-4">
                        <div className="flex justify-center">
                            <AlertTriangle className="h-12 w-12 text-destructive" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-xl font-bold">¡Ups! Algo salió mal</h1>
                            <p className="text-sm text-muted-foreground">
                                Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
                            </p>
                            {this.state.error && (
                                <details className="text-left mt-4 p-3 rounded-lg bg-muted/50 text-xs font-mono overflow-auto max-h-32">
                                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                        Ver detalles del error
                                    </summary>
                                    <p className="mt-2 text-destructive">{this.state.error.toString()}</p>
                                </details>
                            )}
                        </div>
                        <div className="flex gap-2 justify-center pt-2">
                            <Button variant="outline" onClick={() => window.location.reload()}>
                                <RefreshCcw className="h-4 w-4 mr-2" />
                                Recargar página
                            </Button>
                            <Button onClick={this.handleReset}>
                                Ir al inicio
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
