import Link from 'next/link'
import Header from '@/components/shell/Header'
import Footer from '@/components/shell/Footer'

export const metadata = { title: 'Tarifs — AGMR' }

export default function TarifsPage() {
  return (
    <div className="page-shell">
      <Header/>
      <main className="page-main">
        <div className="page-header">
          <div className="container">
            <div className="crumb">Accueil / Inscriptions / Tarifs</div>
            <div className="page-header-eyebrow">Inscriptions · Saison 2025-2026</div>
            <h1>Tarifs</h1>
            <p className="page-header-lede">L'inscription se compose de l'adhésion à l'association, de la licence fédérale et de la cotisation d'activité.</p>
          </div>
        </div>

        <section className="section">
          <div className="container-narrow">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {[
                ["Tarifs Gym", [
                  ["Adhésion association","à confirmer"],
                  ["Licence FFEPGV","à confirmer"],
                  ["1 cours gym / semaine","à confirmer"],
                  ["+ Pilates (par cours)","à confirmer"],
                  ["+ Yoga / Qi Gong (par cours)","à confirmer"],
                ]],
                ["Tarifs Marche", [
                  ["Adhésion association","à confirmer"],
                  ["Licence FFRP","à confirmer"],
                  ["Cotisation marche","à confirmer"],
                ]],
              ].map(([titre, lignes]) => (
                <div key={titre} style={{ background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", overflow: "hidden" }}>
                  <div style={{ background: "var(--green)", color: "#fff", padding: "20px 24px" }}>
                    <h3 style={{ color: "#fff", fontFamily: "var(--sans)", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>{titre}</h3>
                    <p style={{ margin: "4px 0 0", fontSize: "0.88rem", opacity: 0.8 }}>Saison 2025-2026</p>
                  </div>
                  <table className="tbl" style={{ border: "none" }}>
                    <tbody>
                      {lignes.map(([label, val]) => (
                        <tr key={label}>
                          <td>{label}</td>
                          <td style={{ textAlign: "right", color: "var(--ink-mute)" }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28, padding: "20px 24px", background: "var(--bg-elev)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", fontSize: "0.94rem", color: "var(--ink-soft)" }}>
              Les tarifs définitifs seront communiqués lors du Forum des Associations — samedi 13 septembre au stade du Vieux Moulin.
            </div>

            <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
              <Link className="btn btn-primary" href="/inscriptions">S'inscrire</Link>
              <Link className="btn btn-ghost" href="/contact">Nous contacter</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  )
}
