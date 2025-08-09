'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Pentru dezvoltare, permitem accesul fără autentificare
  // Comentează această linie pentru a reactiva protecția
  const allowUnauthenticatedAccess = true;

  useEffect(() => {
    // Verifică doar dacă nu permitem accesul fără autentificare
    if (!allowUnauthenticatedAccess && !loading && !user) {
      router.push('/');
    }
  }, [user, loading, router, allowUnauthenticatedAccess]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Se încarcă...</p>
          <p className="text-xs text-muted-foreground">Verificare conectivitate Supabase...</p>
        </div>
      </div>
    );
  }

  // Pentru dezvoltare, afișează conținutul fără verificare
  if (allowUnauthenticatedAccess) {
    return (
      <>
        {!user && (
          <div className="fixed top-4 right-4 z-50 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-md text-sm">
            🛠️ Mod dezvoltare - Acces fără autentificare
          </div>
        )}
        {children}
      </>
    );
  }

  // Verifică autentificarea doar dacă nu permitem accesul fără autentificare
  if (!user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Acces restricționat</h2>
          <p className="text-muted-foreground mb-4">
            Trebuie să fii autentificat pentru a accesa această pagină.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="text-primary hover:underline"
          >
            Înapoi la pagina principală
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}; 