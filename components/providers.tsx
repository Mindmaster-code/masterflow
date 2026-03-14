'use client';

import { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
        {children}
      </SessionProvider>
    </Suspense>
  );
}
