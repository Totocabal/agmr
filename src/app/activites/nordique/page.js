import Link from 'next/link'
import Header from '@/components/shell/Header'
import Footer from '@/components/shell/Footer'
import Icon from '@/components/ui/Icon'

export const metadata = { title: 'Marche Nordique — AGMR' }

export default function NordiquePage() {
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
              <span>Marche nordique</span>
            </div>
            <div className="page-header-eyebrow">Activités · Marche dynamique</div>
            <h1>La Marche Nordique</h1>
            <p className="page-header-lede">Plus dynamique que la randonnée, elle accentue le mouvement de balancier des bras à l'aide de deux bâtons. Le corps entier est mobilisé.</p>
          </div>
        </div>

        <section className="section">
          <div className="container-narrow">
            <p style={{ fontSize: "1.2rem", color: "var(--ink-soft)", fontFamily: "var(--serif)", fontStyle: "italic", marginBottom: 32 }}>
              En appuyant sur les bâtons, on va plus vite et on fait travailler le haut du corps. La dépense d'énergie est accrue — et le plaisir arrive dès les premières foulées, car la technique est simple.
            </p>

            <div style={{ background: "var(--accent-tint)", borderRadius: "var(--r-md)", padding: "20px 24px", margin: "32px 0", display: "flex", gap: 14, alignItems: "center" }}>
              <Icon name="leaf" size={20}/> <strong>On peut vous prêter des bâtons pour un essai.</strong>
            </div>

            <h2 style={{ marginTop: 48, fontSize: "2rem" }}>Comment se déroule une séance</h2>
            <p>Chaque séance dure entre <strong>1h30 et 2h</strong>.</p>
            <ol style={{ fontSize: "1.05rem", lineHeight: 1.9, margin: "20px 0 0 20px" }}>
              <li>Échauffement</li>
              <li>Marche nordique</li>
              <li>Renforcement musculaire</li>
              <li>Retour à la marche</li>
              <li>Étirements</li>
            </ol>

            <h2 style={{ marginTop: 48, fontSize: "2rem" }}>Quand pratiquer</h2>
            <div className="affil-grid">
              <div className="affil">
                <div className="affil-eyebrow">Mardi après-midi</div>
                <h4>Séance hebdomadaire</h4>
                <p>Calendrier variable — consulter la page planning pour les horaires exacts.</p>
              </div>
              <div className="affil">
                <div className="affil-eyebrow">Samedi matin</div>
                <h4>Séance hebdomadaire</h4>
                <p>Calendrier disponible en ligne.</p>
              </div>
              <div className="affil">
                <div className="affil-eyebrow">Ponctuel</div>
                <h4>Sorties nocturnes</h4>
                <p>À certaines dates, annoncées dans le planning. Lampe frontale recommandée.</p>
              </div>
              <div className="affil">
                <div className="affil-eyebrow">Encadrement</div>
                <h4>Animateurs formés FFR</h4>
                <p>Pierre et Danièle assurent les séances, formés par la Fédération Française de Randonnée.</p>
              </div>
            </div>

            <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link className="btn btn-primary" href="/planning/randonnee">Voir le planning</Link>
              <Link className="btn btn-ghost" href="/inscriptions">S'inscrire</Link>
              <Link className="btn btn-ghost" href="/contact">Nous contacter</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  )
}
