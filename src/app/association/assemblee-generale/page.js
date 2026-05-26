import Header from '@/components/shell/Header'
import Footer from '@/components/shell/Footer'
import Icon from '@/components/ui/Icon'

export const metadata = { title: 'Assemblée Générale — AGMR' }

const DOCS = [
  {
    annee: "2024-2025",
    items: ["Convocation AG 2025","PV AG ordinaire 2025","Rapport moral 2025","Rapport financier 2025"],
  },
  {
    annee: "2023-2024",
    items: ["PV AG ordinaire 2024","Rapport moral 2024"],
  },
  {
    annee: "2022-2023",
    items: ["PV AG ordinaire 2023"],
  },
]

export default function AGPage() {
  return (
    <div className="page-shell">
      <Header/>
      <main className="page-main">
        <div className="page-header">
          <div className="container">
            <div className="crumb">Accueil / L'association / Assemblée générale</div>
            <div className="page-header-eyebrow">L'association · Documents officiels</div>
            <h1>Assemblée Générale</h1>
            <p className="page-header-lede">L'Assemblée Générale se réunit une fois par an. Les membres du comité directeur sont élus lors de cette réunion.</p>
          </div>
        </div>

        <section className="section">
          <div className="container-narrow">
            {DOCS.map((d, i) => (
              <div key={i} style={{ marginBottom: 40 }}>
                <h3 style={{ fontFamily: "var(--sans)", fontSize: "0.84rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 16 }}>
                  Saison {d.annee}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {d.items.map(doc => (
                    <a key={doc} href="#" className="btn btn-ghost" style={{ justifyContent: "flex-start", textDecoration: "none" }}>
                      <Icon name="file" size={14}/> {doc}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  )
}
