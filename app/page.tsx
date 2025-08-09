import Link from 'next/link';

export default function PaginaAcasa() {
  return (
    <main style={{ padding: '24px', maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Harta principală</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Bine ai venit! Alege o secțiune pentru a începe.
      </p>

      <nav style={{ display: 'grid', gap: 12 }}>
        <Link href="/parcarile-mele">Parcările Mele</Link>
        <Link href="/comunitate">Comunitate</Link>
        <Link href="/parcari-disponibile">Parcări Disponibile</Link>
        <Link href="/raporteaza-problema">Raportează o problemă</Link>
      </nav>

      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>Asistent AI (Gemini)</h2>
        <p style={{ color: '#555' }}>
          Integrarea Gemini este activă. Poți folosi endpoint-ul <code>/api/gemini</code> din UI sau CLI pentru a genera SQL, componente și idei.
        </p>
      </section>
    </main>
  );
} 