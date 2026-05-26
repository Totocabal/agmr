import Link from 'next/link'
import Header from '@/components/shell/Header'
import Footer from '@/components/shell/Footer'
import { animators } from '@/data'

export const metadata = { title: 'La Gym — AGMR' }

export default function GymPage() {
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
              <span>Gym</span>
            </div>
            <div className="page-header-eyebrow">Activités · FFEPGV · Label Qualité Club Sport Santé</div>
            <h1>La Gym</h1>
            <p className="page-header-lede">43 heures de cours par semaine, 8 animateurs brevetés professionnels, 5 salles municipales. Construisez votre propre programme.</p>
          </div>
        </div>

        <section className="section">
          <div className="container">
            <div className="two-col">
              <aside className="col-side">
                <div style={{ fontSize: "0.78rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 16, fontWeight: 600 }}>Sur cette page</div>
                <ul className="side-nav">
                  <li><a href="#intro" className="active">Introduction</a></li>
                  <li><a href="#disciplines">Les disciplines</a></li>
                  <li><a href="#programme">Construire son programme</a></li>
                  <li><a href="#animateurs">Animateurs</a></li>
                  <li><a href="#prescri">Prescri'Forme</a></li>
                </ul>
              </aside>
              <div>
                <h2 id="intro" style={{ fontSize: "2.2rem", marginBottom: 18 }}>La Gymnastique Volontaire à Rambouillet</h2>
                <p style={{ fontSize: "1.12rem", color: "var(--ink-soft)" }}>
                  Notre section est affiliée à la <strong>Fédération Française d'Éducation Physique et de Gymnastique Volontaire (FFEPGV)</strong>. Elle bénéficie du label <strong>Qualité Club Sport Santé</strong>.
                </p>
                <p>
                  Tous les cours sont donnés par des <strong>animateurs brevetés d'État</strong>. Ils proposent 43 heures de cours par semaine, d'une grande variété, répartis dans 5 salles mises à disposition par la municipalité.
                </p>

                <h3 id="disciplines" style={{ marginTop: 48, fontFamily: "var(--serif)", fontSize: "1.8rem", fontWeight: 500 }}>Les disciplines</h3>
                <p className="muted">10 disciplines pour construire votre programme sur mesure.</p>
                <div className="disc-list">
                  {[
                    ["G","Gym","Gym générale, cardio, coordination."],
                    ["B","Barre au sol","Inspirée de la danse classique, travail de souplesse et de tonicité."],
                    ["F","Fitball","Équilibre et gainage avec un ballon."],
                    ["G","Gym équilibre senior","Prévention des chutes, coordination, mobilité articulaire."],
                    ["G","Gym senior","Maintien de la forme adapté aux seniors."],
                    ["G","Gym tendance","Cours dynamiques reflétant les nouvelles tendances."],
                    ["P","Pilates","Renforcement musculaire profond, posture, respiration."],
                    ["P","Poundfit","Fitness rythmé avec des baguettes légères."],
                    ["S","Stretching","Étirements, souplesse, récupération."],
                    ["Y","Yoga & Qi Gong","Postures, respiration, relaxation, méditation active."],
                  ].map(([mark, nom, desc]) => (
                    <div key={nom} className="disc-item">
                      <div className="disc-item-mark">{mark}</div>
                      <div className="disc-item-text">
                        <div className="disc-item-name">{nom}</div>
                        <div className="disc-item-desc">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 40, padding: 28, background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: "var(--r-md)" }}>
                  <h3 id="programme" style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", marginBottom: 10 }}>Construisez votre propre programme</h3>
                  <p style={{ margin: 0, color: "var(--ink-soft)" }}>
                    Vous pouvez assister à 2 ou 3 heures de cours par semaine. L'adhésion vous permet de choisir, parmi les 43 cours proposés, au maximum :
                  </p>
                  <ul style={{ margin: "12px 0 0 20px", color: "var(--ink-soft)" }}>
                    <li>3 cours de gym</li>
                    <li>+ 2 cours de yoga / Qi Gong</li>
                    <li>+ 2 cours de Pilates</li>
                  </ul>
                  <p style={{ marginTop: 14, fontSize: "0.92rem", color: "var(--ink-mute)" }}>
                    Chaque cours couvre la saison complète, soit environ 34 séances.
                  </p>
                </div>

                <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
                  <Link className="btn btn-primary" href="/planning/gym">Voir le planning</Link>
                  <Link className="btn btn-ghost" href="/inscriptions">S'inscrire</Link>
                </div>

                <h3 id="animateurs" style={{ marginTop: 60, fontFamily: "var(--serif)", fontSize: "1.8rem", fontWeight: 500 }}>Notre équipe d'animateurs</h3>
                <p className="muted">8 animateurs diplômés d'État.</p>
                <div className="team-grid">
                  {animators.filter(a => a.role.includes("gym")).slice(0, 4).map(a => (
                    <div className="team-card" key={a.nom}>
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

                <div style={{ marginTop: 48, padding: 32, background: "var(--green-tint)", borderRadius: "var(--r-md)" }}>
                  <h3 id="prescri" style={{ marginBottom: 10 }}>Prescri'Forme — sport sur ordonnance</h3>
                  <p style={{ color: "var(--ink-soft)", marginBottom: 14 }}>
                    L'Association est agréée pour dispenser des cours de gym volontaire sur prescription médicale (dispositif Prescri'Forme, Île-de-France, depuis septembre 2019).
                  </p>
                  <Link className="btn btn-ghost btn-sm" href="/activites/sante">En savoir plus</Link>
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
