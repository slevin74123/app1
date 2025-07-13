'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestRLSPage() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runRLSTests = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test 1: Încercare de citire fără autentificare
      const { data: publicData, error: publicError } = await supabase
        .from('parking_spots')
        .select('*')
        .limit(1);

      results.publicRead = {
        success: !publicError,
        data: publicData,
        error: publicError?.message
      };

      // Test 2: Încercare de citire cu autentificare
      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id);

        results.userProfileRead = {
          success: !userError,
          data: userData,
          error: userError?.message
        };
      }

      // Test 3: Încercare de inserare
      if (user) {
        const { data: insertData, error: insertError } = await supabase
          .from('parking_spots')
          .insert({
            name: 'Test Parking Spot',
            address: 'Test Address',
            latitude: 44.4268,
            longitude: 26.1025,
            price_per_hour: 10.00,
            owner_id: user.id
          })
          .select();

        results.insertTest = {
          success: !insertError,
          data: insertData,
          error: insertError?.message
        };
      }

    } catch (error) {
      results.generalError = error;
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test Row Level Security (RLS)</h1>
      
      <div className="space-y-6">
        {/* Status Autentificare */}
        <Card>
          <CardHeader>
            <CardTitle>Status Autentificare</CardTitle>
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
                <Button onClick={() => signInWithGoogle()} className="mt-2">
                  Autentificare cu Google
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Teste RLS */}
        <Card>
          <CardHeader>
            <CardTitle>Teste Row Level Security</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runRLSTests} 
              disabled={loading}
              className="mb-4"
            >
              {loading ? 'Se testează...' : 'Rulează Teste RLS'}
            </Button>

            {Object.keys(testResults).length > 0 && (
              <div className="space-y-4">
                {/* Test Citire Publică */}
                {testResults.publicRead && (
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">Test Citire Publică (parking_spots)</h3>
                    <p className={testResults.publicRead.success ? 'text-green-600' : 'text-red-600'}>
                      {testResults.publicRead.success ? '✅ Succes' : '❌ Eșec'}
                    </p>
                    {testResults.publicRead.error && (
                      <p className="text-sm text-muted-foreground">Eroare: {testResults.publicRead.error}</p>
                    )}
                  </div>
                )}

                {/* Test Profil Utilizator */}
                {testResults.userProfileRead && (
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">Test Citire Profil Utilizator</h3>
                    <p className={testResults.userProfileRead.success ? 'text-green-600' : 'text-red-600'}>
                      {testResults.userProfileRead.success ? '✅ Succes' : '❌ Eșec'}
                    </p>
                    {testResults.userProfileRead.error && (
                      <p className="text-sm text-muted-foreground">Eroare: {testResults.userProfileRead.error}</p>
                    )}
                  </div>
                )}

                {/* Test Inserare */}
                {testResults.insertTest && (
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">Test Inserare Parking Spot</h3>
                    <p className={testResults.insertTest.success ? 'text-green-600' : 'text-red-600'}>
                      {testResults.insertTest.success ? '✅ Succes' : '❌ Eșec'}
                    </p>
                    {testResults.insertTest.error && (
                      <p className="text-sm text-muted-foreground">Eroare: {testResults.insertTest.error}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informații RLS */}
        <Card>
          <CardHeader>
            <CardTitle>Informații Row Level Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>user_profiles:</strong> Utilizatorii pot citi/actualiza doar propriul profil</p>
              <p><strong>parking_spots:</strong> Toți pot vedea locurile disponibile, doar proprietarii pot modifica</p>
              <p><strong>reservations:</strong> Utilizatorii pot vedea/crea doar propriile rezervări</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 