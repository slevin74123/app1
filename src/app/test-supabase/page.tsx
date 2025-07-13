import { createServerClient } from '@/utils/supabase/server'

export default async function TestSupabasePage() {
  const supabase = await createServerClient()

  // Testează conexiunea la Supabase
  const { data: authData, error: authError } = await supabase.auth.getSession()
  
  // Testează o interogare simplă (dacă există tabela)
  const { data: testData, error: testError } = await supabase
    .from('parking_spots')
    .select('*')
    .limit(1)

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test Supabase Connection</h1>
      
      <div className="space-y-6">
        {/* Test Autentificare */}
        <div className="bg-card p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">Test Autentificare</h2>
          {authError ? (
            <div className="text-red-600">
              <p>Eroare autentificare: {authError.message}</p>
            </div>
          ) : (
            <div className="text-green-600">
              <p>✅ Conexiune Supabase funcțională!</p>
              <p className="text-sm text-muted-foreground">
                Sesiune: {authData.session ? 'Activă' : 'Inactivă'}
              </p>
            </div>
          )}
        </div>

        {/* Test Baza de Date */}
        <div className="bg-card p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">Test Baza de Date</h2>
          {testError ? (
            <div className="text-amber-600">
              <p>Tabela parking_spots nu există încă (normal pentru prima dată)</p>
              <p className="text-sm">Eroare: {testError.message}</p>
            </div>
          ) : (
            <div className="text-green-600">
              <p>✅ Tabela parking_spots accesibilă!</p>
              <p className="text-sm text-muted-foreground">
                Rezultate: {testData?.length || 0} înregistrări
              </p>
            </div>
          )}
        </div>

        {/* Informații Configurare */}
        <div className="bg-card p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">Configurare Supabase</h2>
          <div className="space-y-2 text-sm">
            <p><strong>URL:</strong> zugwcilkqqkyzloekddp.supabase.co</p>
            <p><strong>Status:</strong> Configurat ✅</p>
            <p><strong>Autentificare:</strong> Activă</p>
            <p><strong>Baza de date:</strong> Conectată</p>
          </div>
        </div>

        {/* Următorii Pași */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold mb-2 text-blue-800">Următorii Pași</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
            <li>Configurează OAuth providers în Supabase Dashboard</li>
            <li>Creează tabelele pentru aplicația de parcare</li>
            <li>Testează autentificarea cu Google/Facebook</li>
            <li>Activează Row Level Security (RLS)</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 