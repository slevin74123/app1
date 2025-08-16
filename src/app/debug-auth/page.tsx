'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function DebugAuthPage() {
  const { user, signInWithGoogle, signInWithFacebook, signInWithInstagram } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testGoogleAuth = async () => {
    setLoading(true);
    try {
      console.log('Încercare autentificare Google...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      console.log('Răspuns Google OAuth:', { data, error });

      setDebugInfo({
        provider: 'Google',
        success: !error,
        data,
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name
        } : null,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Eroare neașteptată:', error);
      setDebugInfo({
        provider: 'Google',
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Eroare neașteptată',
          name: error instanceof Error ? error.name : 'UnknownError'
        },
        timestamp: new Date().toISOString()
      });
    }
    setLoading(false);
  };

  const testFacebookAuth = async () => {
    setLoading(true);
    try {
      console.log('Încercare autentificare Facebook...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      console.log('Răspuns Facebook OAuth:', { data, error });

      setDebugInfo({
        provider: 'Facebook',
        success: !error,
        data,
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name
        } : null,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Eroare neașteptată:', error);
      setDebugInfo({
        provider: 'Facebook',
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Eroare neașteptată',
          name: error instanceof Error ? error.name : 'UnknownError'
        },
        timestamp: new Date().toISOString()
      });
    }
    setLoading(false);
  };

  const checkSupabaseConfig = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data: { user } } = await supabase.auth.getUser();
      
      setDebugInfo({
        type: 'config_check',
        session: session ? 'exists' : 'null',
        user: user ? 'exists' : 'null',
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setDebugInfo({
        type: 'config_check',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Autentificare</h1>
      
      <div className="space-y-6">
        {/* Status Utilizator */}
        <Card>
          <CardHeader>
            <CardTitle>Status Utilizator</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="text-green-600">
                <p>✅ Autentificat ca: {user.email}</p>
                <p className="text-sm text-muted-foreground">ID: {user.id}</p>
              </div>
            ) : (
              <div className="text-amber-600">
                <p>⚠️ Nu ești autentificat</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Teste Autentificare */}
        <Card>
          <CardHeader>
            <CardTitle>Teste Autentificare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={testGoogleAuth} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Se testează...' : 'Test Google OAuth'}
              </Button>
              
              <Button 
                onClick={testFacebookAuth} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? 'Se testează...' : 'Test Facebook OAuth'}
              </Button>
              
              <Button 
                onClick={checkSupabaseConfig} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Verifică Configurare Supabase
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rezultate Debug */}
        {Object.keys(debugInfo).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Rezultate Debug</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Informații Configurare */}
        <Card>
          <CardHeader>
            <CardTitle>Informații Configurare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Supabase URL:</strong> zugwcilkqqkyzloekddp.supabase.co</p>
              <p><strong>Redirect URL:</strong> {typeof window !== 'undefined' ? window.location.origin : ''}/dashboard</p>
              <p><strong>Provider Google:</strong> Trebuie activat în Supabase Dashboard</p>
              <p><strong>Provider Facebook:</strong> Trebuie activat în Supabase Dashboard</p>
            </div>
          </CardContent>
        </Card>

        {/* Instrucțiuni */}
        <Card>
          <CardHeader>
            <CardTitle>Instrucțiuni pentru Rezolvare</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Mergi la Supabase Dashboard &gt; Authentication &gt; Providers</li>
              <li>Activează Google și Facebook</li>
              <li>Configurează credențialele OAuth în Google Cloud Console</li>
              <li>Adaugă credențialele în Supabase</li>
              <li>Configurează URL-urile de redirect</li>
              <li>Testează din nou cu această pagină</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 