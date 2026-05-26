import Link from 'next/link'
import Header from '@/components/shell/Header'
import Footer from '@/components/shell/Footer'
import { testimonials } from '@/data'

export const metadata = { title: "Santé par le sport — AGMR" }

export default function SantePage() {
  return (
    <div className="page-shell">
      <Header/>
      <main className="page-main">
        <div className="page-header">
          <div className="container">
            <div className="crumb">
              <Link href="/">Accueil</Link>
              <span>/</span>
              <span>Santé par le sport</span>
            </div>
            <div className="page-header-eyebrow">Santé par le Sport · Activités Physiques Adaptées</div>
            <h1>Prescri'Forme & Rando-Santé</h1>
            <p className="page-header-lede">Cours d'Activités Physiques Adaptées (APA) sur prescription médicale, pour les affections de longue durée. Reprenez une activité physique en toute sécurité.</p>
          </div>
        </div>

        <section className="section">
          <div className="container">
            <div className="two-col">
              <aside className="col-side">
                <div style={{ fontSize: "0.78rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 16, fontWeight: 600 }}>Sur cette page</div>
                <ul className="side-nav">
                  <li><a href="#prescri" className="active">Prescri'Forme</a></li>
                  <li><a href="#rando-sante">Rando-Santé</a></li>
                  <li><a href="#temoignage">Témoignage</a></li>
                </ul>
              </aside>
              <div>
                <h2 id="prescri" style={{ fontSize: "2.2rem" }}>Prescri'Forme — Sport sur ordonnance</h2>
                <p style={{ fontSize: "1.12rem", color: "var(--ink-soft)" }}>
                  Si vous avez du diabète, êtes en surpoids ou souffrez d'hypertension artérielle et avez besoin de pratiquer un sport, demandez à votre médecin de vous prescrire de la <strong>gymnastique adaptée pour les ALD</strong> par le biais du programme Prescri'Forme.
                </p>
                <p>Depuis septembre 2019, des cours d'Activités Physiques Adaptées sont proposés avec des animateurs spécialement formés, pour permettre de reprendre une activité physique <strong>en toute sécurité et dans la bonne humeur</strong>.</p>

                <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div style={{ padding: 22, background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: "var(--r-md)" }}>
                    <div style={{ fontSize: "0.74rem", color: "var(--ink-mute)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Certification</div>
                    <p style={{ margin: 0, fontSize: "0.94rem" }}>Section gym certifiée auprès de la <strong>DRJSCS Yvelines</strong> et répertoriée au <strong>CROS Île-de-France</strong>.</p>
                  </div>
                  <div style={{ padding: 22, background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: "var(--r-md)" }}>
                    <div style={{ fontSize: "0.74rem", color: "var(--ink-mute)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>En savoir plus</div>
                    <p style={{ margin: 0, fontSize: "0.94rem" }}>
                      <a href="http://www.lasanteparlesport.fr" target="_blank" rel="noopener">lasanteparlesport.fr</a>
                    </p>
                  </div>
                </div>

                <h2 id="rando-sante" style={{ marginTop: 56, fontSize: "2.2rem" }}>Rando-Santé — Marche adaptée</h2>
                <p>Pour la marche, l'AGMR a obtenu le <strong>label Santé de la FFR</strong>, avec des animateurs formés à l'accompagnement de personnes ayant des contraintes de santé.</p>
                <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.4rem", color: "var(--accent-deep)", margin: "20px 0", paddingLeft: 20, borderLeft: "3px solid var(--accent)" }}>
                  « Plus lentement, moins longtemps et moins loin — pour que la marche reste accessible à tous. »
                </p>

                <div id="temoignage" className="quote" style={{ padding: "48px 0 24px", marginTop: 32 }}>
                  <div className="quote-body" style={{ padding: 0 }}>
                    <div className="quote-text" style={{ fontSize: "1.7rem" }}>
                      « {testimonials[2].quote} »
                    </div>
                    <div className="quote-attr">
                      <div className="quote-avatar">H</div>
                      <div className="quote-attr-text">
                        <span className="quote-attr-name">{testimonials[2].name}</span>
                        <span className="quote-attr-role">{testimonials[2].role}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
                  <Link className="btn btn-primary" href="/contact">Parler à un animateur</Link>
                  <Link className="btn btn-ghost" href="/inscriptions">S'inscrire</Link>
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
