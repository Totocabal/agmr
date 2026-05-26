import Link from 'next/link'
import Header from '@/components/shell/Header'
import Footer from '@/components/shell/Footer'
import { testimonials } from '@/data'

export const metadata = { title: 'La Randonnée — AGMR' }

export default function RandoPage() {
  return (
    <div className="page-shell">
      <Header/>
      <main className="page-main">
        <div className="page-header">
          <div className="container">
            <div className="crumb">
              <Link href="/">Accueil</Link>
              <span>/</span>
              <span>Activités</span>
              <span>/</span>
              <span>Randonnée</span>
            </div>
            <div className="page-header-eyebrow">Activités · Fédération Française de Randonnée</div>
            <h1>La Randonnée</h1>
            <p className="page-header-lede">Forêt de Rambouillet et alentours. 5 groupes de niveau, sorties chaque jeudi et un dimanche sur deux, séjours en France.</p>
          </div>
        </div>

        <section className="section">
          <div className="container">
            <div className="two-col">
              <aside className="col-side">
                <div style={{ fontSize: "0.78rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 16, fontWeight: 600 }}>Sur cette page</div>
                <ul className="side-nav">
                  <li><a href="#intro" className="active">Introduction</a></li>
                  <li><a href="#jeudi">Le jeudi</a></li>
                  <li><a href="#dimanche">Le dimanche</a></li>
                  <li><a href="#sejours">Sorties & séjours</a></li>
                  <li><a href="#sante">Rando-Santé</a></li>
                </ul>
              </aside>
              <div>
                <h2 id="intro" style={{ fontSize: "2.2rem", marginBottom: 18 }}>Marcher dans la forêt de Rambouillet</h2>
                <p style={{ fontSize: "1.12rem", color: "var(--ink-soft)" }}>
                  Les randonnées se font en forêt de Rambouillet ou à proximité immédiate. Les adhérents se répartissent en 4 ou 5 groupes selon leurs possibilités ou affinités. <strong>Il est toujours possible de changer de groupe d'une fois sur l'autre.</strong>
                </p>
                <div style={{ background: "var(--accent-tint)", border: "1px solid var(--accent-soft)", borderRadius: "var(--r-md)", padding: 20, margin: "20px 0", fontSize: "0.96rem" }}>
                  <strong>Important :</strong> tout randonneur devrait avoir dans son sac la fiche individuelle de santé. Elle contribue à renforcer la sécurité lors des sorties. <a href="#" style={{ fontWeight: 600 }}>Télécharger la fiche</a>
                </div>

                <h3 id="jeudi" style={{ marginTop: 40, fontFamily: "var(--serif)", fontSize: "1.8rem" }}>Les randonnées du jeudi</h3>
                <p>5 groupes de niveau, chaque jeudi après-midi.</p>
                <table className="tbl" style={{ marginTop: 16 }}>
                  <thead>
                    <tr><th>Groupe</th><th>Distance</th><th>Retour vers</th><th>Point de RDV</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><strong>Groupe 1</strong></td><td>12 à 14 km</td><td>17h30</td><td>Parking Leclerc</td></tr>
                    <tr><td><strong>Groupe 2A</strong></td><td>10 à 12 km</td><td>17h00</td><td>Parking Leclerc</td></tr>
                    <tr><td><strong>Groupe 2B</strong></td><td>8 à 10 km</td><td>16h30</td><td>Parking Leclerc</td></tr>
                    <tr><td><strong>Groupe 3</strong></td><td>7 à 9 km</td><td>16h30</td><td>Parking Nickel</td></tr>
                    <tr><td><strong>Groupe 4</strong></td><td>5 à 7 km</td><td>16h30</td><td>Parking Nickel</td></tr>
                  </tbody>
                </table>
                <p style={{ marginTop: 12, fontSize: "0.92rem", color: "var(--ink-mute)" }}>
                  Les groupes 2A et 2B pourront être réunis en fonction du nombre d'animateurs disponibles. Les départs se font en <strong>covoiturage</strong>.
                </p>

                <h3 id="dimanche" style={{ marginTop: 40, fontFamily: "var(--serif)", fontSize: "1.8rem" }}>Les randonnées du dimanche</h3>
                <p>Environ tous les 15 jours. Parcours de 9 à 11 km. Rassemblement à 8h45 sur le parking du centre Leclerc, départ à 9h, retour vers midi.</p>
                <p style={{ color: "var(--ink-soft)", fontSize: "0.96rem" }}>
                  Conditions : être inscrit à la section marche de l'AGMR. <strong>Une sortie d'essai est possible sans inscription.</strong>
                </p>

                <h3 id="sejours" style={{ marginTop: 40, fontFamily: "var(--serif)", fontSize: "1.8rem" }}>Sorties à la journée et séjours</h3>
                <p>Sorties à thèmes plusieurs fois par trimestre, en train, en car ou en covoiturage. 1 séjour en car chaque saison + plusieurs séjours en covoiturage.</p>
                <Link className="btn btn-green" style={{ marginTop: 12, display: "inline-flex" }} href="/actualites/sejours">Voir les séjours</Link>

                <div className="quote" style={{ padding: "48px 0 24px", marginTop: 32 }}>
                  <div className="quote-body" style={{ padding: 0 }}>
                    <div className="quote-text" style={{ fontSize: "1.7rem" }}>
                      « {testimonials[1].quote} »
                    </div>
                    <div className="quote-attr">
                      <div className="quote-avatar">J</div>
                      <div className="quote-attr-text">
                        <span className="quote-attr-name">{testimonials[1].name}</span>
                        <span className="quote-attr-role">{testimonials[1].role}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 32, padding: 32, background: "var(--green-tint)", borderRadius: "var(--r-md)" }}>
                  <h3 id="sante" style={{ marginBottom: 10 }}>Rando-Santé</h3>
                  <p style={{ color: "var(--ink-soft)", marginBottom: 14 }}>
                    Plus lentement, moins longtemps et moins loin. Activité destinée aux personnes atteintes de diverses pathologies. L'AGMR a obtenu le label « Santé » de la FFR.
                  </p>
                  <Link className="btn btn-green btn-sm" href="/activites/sante">En savoir plus</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  )
}
