import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ErrorFallbackProps {
  error?: Error
  resetError?: () => void
}

export const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Oops! Terjadi Kesalahan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Maaf, terjadi kesalahan saat memuat konten. Silakan coba lagi.
          </p>
          
          {process.env.NODE_ENV === 'development' && error && (
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-500">
                Detail Error (Development)
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {error.toString()}
              </pre>
            </details>
          )}
          
          <div className="flex gap-2">
            {resetError && (
              <Button onClick={resetError} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            )}
            <Button asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Kembali ke Beranda
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}




