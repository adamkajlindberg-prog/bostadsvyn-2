import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // In production, you would send this to your error reporting service
    // Example: Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} reset={this.handleReset} />;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Något gick fel</CardTitle>
              <p className="text-muted-foreground">
                Ett oväntat fel inträffade. Vi ber om ursäkt för besväret.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Fel information (endast utveckling):</h4>
                  <pre className="text-xs text-muted-foreground overflow-auto max-h-32">
                    {this.state.error.message}
                  </pre>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button onClick={this.handleReset} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Försök igen
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Hem
                </Button>
              </div>
              
              <div className="text-center">
                <Button 
                  variant="link" 
                  onClick={() => window.location.reload()}
                  className="text-sm"
                >
                  Ladda om sidan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional component version using react-error-boundary (if you prefer hooks)
export function ErrorFallback({ 
  error, 
  resetErrorBoundary 
}: { 
  error: Error; 
  resetErrorBoundary: () => void; 
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Något gick fel</CardTitle>
          <p className="text-muted-foreground">
            Ett oväntat fel inträffade. Vi ber om ursäkt för besväret.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Fel information:</h4>
              <pre className="text-xs text-muted-foreground overflow-auto max-h-32">
                {error.message}
              </pre>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button onClick={resetErrorBoundary} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Försök igen
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Hem
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}