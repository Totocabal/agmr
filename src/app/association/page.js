import Link from 'next/link'
import Header from '@/components/shell/Header'
import Footer from '@/components/shell/Footer'
import Icon from '@/components/ui/Icon'
import { bureau } from '@/data'

export const metadata = { title: "L'Association — AGMR" }

export default function AssoPage() {
  return (
    <div className="page-shell">
      <Header/>
      <main className="page-main">
        <div className="page-header">
          <div className="container">
            <div className="crumb">Accueil / L'association</div>
            <div className="page-header-eyebrow">L'association · Loi 1901 · Fondée en 1970</div>
            <h1>Une association, un esprit</h1>
            <p className="page-header-lede">L'Association Gym Marche Rambouillet est le nouveau nom du Club Loisirs et Détente. Renommée en novembre 2018, elle compte aujourd'hui environ 750 adhérents.</p>
          </div>
        </div>

        <section className="section">
          <div className="container">
            <div className="two-col">
              <aside className="col-side">
                <div style={{ fontSize: "0.78rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 16, fontWeight: 600 }}>Sur cette page</div>
                <ul className="side-nav">
                  <li><a href="#histoire" className="active">Notre histoire</a></li>
                  <li><a href="#sections">Les sections</a></li>
                  <li><a href="#gouvernance">Gouvernance</a></li>
                  <li><a href="#affiliations">Affiliations</a></li>
                  <li><a href="#documents">Documents</a></li>
                </ul>
              </aside>

              <div>
                <h2 id="histoire" style={{ fontSize: "1.8rem", marginBottom: 16 }}>Notre histoire</h2>
                <p style={{ color: "var(--ink-soft)" }}>
                  L'Association Gym Marche Rambouillet (AGMR) est le nouveau nom du <strong>Club Loisirs et Détente (CLD)</strong>. C'est une association selon la loi de 1901, créée en <strong>1970</strong>. Le changement de nom a été voté lors de l'assemblée générale extraordinaire de novembre 2018, pour mieux refléter les activités de l'association.
                </p>
                <div style={{ margin: "20px 0", padding: "20px 24px", borderLeft: "3px solid var(--accent)", background: "var(--accent-tint)", borderRadius: "0 var(--r-sm) var(--r-sm) 0" }}>
                  <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.15rem", color: "var(--accent-deep)", margin: 0 }}>
                    « Ces activités sont pratiquées dans un esprit de détente et de convivialité favorisant l'épanouissement de chacun, en dehors de toute notion de compétition. »
                  </p>
                </div>
                <p style={{ color: "var(--ink-soft)" }}>
                  Ouverte à tous les courants de pensées, l'association s'interdit toutes discussions confessionnelles ou politiques.
                </p>

                <h2 id="sections" style={{ fontSize: "1.8rem", marginTop: 48, marginBottom: 16 }}>Les sections</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 8 }}>
                  <div style={{ padding: 22, background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: "var(--r-md)" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>Section Gym</div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", fontWeight: 500, marginBottom: 8 }}>~460 pratiquants</div>
                    <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--ink-soft)" }}>Affiliée à la FFEPGV. 41h de cours, 5 salles, 8 animatrices et animateurs diplômés.</p>
                  </div>
                  <div style={{ padding: 22, background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: "var(--r-md)" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>Section Marche</div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", fontWeight: 500, marginBottom: 8 }}>~290 pratiquants</div>
                    <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--ink-soft)" }}>Affiliée à la FFR. Sorties jeudi, dimanche, marche nordique mardi/samedi, séjours. 25 animateurs bénévoles.</p>
                  </div>
                </div>

                <h2 id="gouvernance" style={{ fontSize: "1.8rem", marginTop: 48, marginBottom: 8 }}>Gouvernance</h2>
                <p style={{ color: "var(--ink-soft)", marginBottom: 20 }}>
                  L'association est dirigée par un <strong>comité directeur</strong> élu en assemblée générale. Il se réunit 2 fois par trimestre. Les membres du bureau administrent la marche du club.
                </p>
                <h3 style={{ fontFamily: "var(--sans)", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 12 }}>Comité directeur 2025-2026</h3>
                <table className="tbl" style={{ marginBottom: 16 }}>
                  <thead>
                    <tr><th>Membre</th><th>Rôle</th></tr>
                  </thead>
                  <tbody>
                    {bureau.map((b, i) => (
                      <tr key={i}>
                        <td><strong>{b.nom}</strong></td>
                        <td>{b.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Link className="btn btn-ghost btn-sm" href="/association/comite-directeur">
                  Voir tous les animateurs →
                </Link>

                <h2 id="affiliations" style={{ fontSize: "1.8rem", marginTop: 48, marginBottom: 16 }}>Affiliations & labels</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 8 }}>
                  {[
                    ["FFEPGV","Qualité Club Sport Santé","Label fédéral attestant de la qualité de l'encadrement et du projet club."],
                    ["FFR","Label Rando-Santé","Encadrement formé pour les pratiquants nécessitant une marche adaptée."],
                    ["Prescri'Forme","Sport sur ordonnance","Agrément depuis septembre 2019 pour les Activités Physiques Adaptées (ALD)."],
                    ["Conseil Général 78","Partenaire","Soutien institutionnel et financement de l'association."],
                  ].map(([eyebrow, titre, desc]) => (
                    <div key={titre} style={{ padding: 22, background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: "var(--r-md)" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 6 }}>{eyebrow}</div>
                      <div style={{ fontFamily: "var(--serif)", fontSize: "1.2rem", fontWeight: 500, marginBottom: 8 }}>{titre}</div>
                      <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--ink-soft)" }}>{desc}</p>
                    </div>
                  ))}
                </div>

                <h2 id="documents" style={{ fontSize: "1.8rem", marginTop: 48, marginBottom: 16 }}>Documents officiels</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                  {[
                    ["Règlement intérieur","Janvier 2024 · 240 ko"],
                    ["Statuts AGMR","Octobre 2024 · 180 ko"],
                    ["Contrat d'engagement républicain","2024 · 120 ko"],
                  ].map(([titre, meta]) => (
                    <a key={titre} href="#" style={{ padding: "18px 20px", background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", textDecoration: "none", display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 32, height: 32, background: "var(--accent-tint)", borderRadius: "var(--r-sm)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <Icon name="file" size={14}/>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--ink)", marginBottom: 2 }}>{titre}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--ink-mute)" }}>{meta}</div>
                      </div>
                    </a>
                  ))}
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
