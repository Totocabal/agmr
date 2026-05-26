import Header from '@/components/shell/Header'
import Footer from '@/components/shell/Footer'
import { bureau, animators } from '@/data'

export const metadata = { title: 'Comité Directeur — AGMR' }

export default function ComitePage() {
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
              {bureau.map((b, i) => (
                <div key={i} className="team-card">
                  <div className={`team-photo team-photo-${"abcdefgh"[i % 8]}`}>
                    <div className="team-photo-initial">{b.nom[0]}</div>
                  </div>
                  <div className="team-body">
                    <div className="team-name">{b.nom}</div>
                    <div className="team-role">{b.role}</div>
                  </div>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: "2rem", marginBottom: 28 }}>Les animateurs</h2>
            <div className="team-grid">
              {animators.map((a, i) => (
                <div key={i} className="team-card">
                  <div className={`team-photo team-photo-${a.photo}`}>
                    <div className="team-photo-initial">{a.initial}</div>
                  </div>
                  <div className="team-body">
                    <div className="team-name">{a.nom}</div>
                    <div className="team-role">{a.role}</div>
                    <div className="team-disc">{a.disciplines}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      </main>
      <Footer/>
    </div>
  )
}
