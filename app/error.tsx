'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#060d18' }}>
      <div className="max-w-md text-center">
        <p className="text-[4rem] mb-4">⚠️</p>
        <h1 className="text-xl font-bold text-white mb-2">Algo deu errado</h1>
        <p className="text-white/60 text-sm mb-6">
          Ocorreu um erro ao carregar a página. Tente novamente ou volte para a home.
        </p>
        {isDev && (
          <pre className="text-left text-xs text-red-400 bg-red-950/30 p-4 rounded-lg mb-6 overflow-auto max-h-40">
            {error.message}
          </pre>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="premium-button">
            Tentar novamente
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'} className="outline-button">
            Ir para a home
          </Button>
        </div>
      </div>
    </div>
  );
}
