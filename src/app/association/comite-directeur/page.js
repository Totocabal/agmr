import Header from '@/components/shell/Header'
import Footer from '@/components/shell/Footer'
import { getBureau, getGymAnimateurs } from '@/lib/queries'

export const metadata = { title: 'Comité Directeur — AGMR' }

export default async function ComitePage() {
  const [bureau, animateurs] = await Promise.all([getBureau(), getGymAnimateurs()])

  return (
    <div className="page-shell">
      <Header/>
      <main className="page-main">
        <div className="page-header">
          <div className="container">
            <div className="crumb">Accueil / L'association / Comité directeur</div>
            <div className="page-header-eyebrow">L'association · Gouvernance</div>
            <h1>Comité directeur</h1>
            <p className="page-header-lede">Élu en assemblée générale, le comité directeur se réunit 2 fois par trimestre.</p>
          </div>
        </div>

        <section className="section">
          <div className="container">

            <h2 style={{ fontSize: "2rem", marginBottom: 28 }}>Le bureau</h2>
            <div className="team-grid" style={{ marginBottom: 64 }}>
              {bureau.map(b => (
                <div key={b.id} className="team-card">
                  <div
                    className="team-photo"
                    style={b.photo_url ? { backgroundImage: `url(${b.photo_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                  >
                    {!b.photo_url && <div className="team-photo-initial">{b.nom.charAt(0)}</div>}
                  </div>
                  <div className="team-body">
                    <div className="team-name">{b.nom}</div>
                    <div className="team-role">{b.role}</div>
                  </div>
                </div>
              ))}
            </div>

            {animateurs.length > 0 && (
              <>
                <h2 style={{ fontSize: "2rem", marginBottom: 28 }}>Les animateurs</h2>
                <div className="team-grid">
                  {animateurs.map(a => (
                    <div key={a.id} className="team-card">
                      <div
                        className="team-photo"
                        style={a.photo_url ? { backgroundImage: `url(${a.photo_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                      >
                        {!a.photo_url && <div className="team-photo-initial">{a.nom?.charAt(0)?.toUpperCase() ?? '?'}</div>}
                      </div>
                      <div className="team-body">
                        <div className="team-name">{a.nom}</div>
                        <div className="team-role">{a.role}</div>
                        {a.disciplines && <div className="team-disc">{a.disciplines}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </section>
      </main>
      <Footer/>
    </div>
  )
}
