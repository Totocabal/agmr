import Header from '@/components/shell/Header'
import Footer from '@/components/shell/Footer'

export const metadata = { title: 'Galerie Photos — AGMR' }

const ALBUMS = [
  { titre: "Séjour Alsace", desc: "Mai 2026", count: 14, p: 1 },
  { titre: "Marche nordique", desc: "Avril 2026", count: 8, p: 2 },
  { titre: "Cours de Pilates", desc: "Avril 2026", count: 6, p: 3 },
  { titre: "Pique-nique de printemps", desc: "Avril 2026", count: 24, p: 4 },
  { titre: "Rando dimanche", desc: "Mars 2026", count: 10, p: 5 },
  { titre: "Stage Yoga", desc: "Mars 2026", count: 18, p: 6 },
]

const PATS = ["gallery-pat-1","gallery-pat-2","gallery-pat-3","gallery-pat-4","gallery-pat-5","gallery-pat-6"]

export default function GaleriePage() {
  return (
    <div className="page-shell">
      <Header/>
      <main className="page-main">
        <div className="page-header">
          <div className="container">
            <div className="crumb">Accueil / Actualités / Galerie</div>
            <div className="page-header-eyebrow">Actualités · Photos</div>
            <h1>Galerie photos</h1>
            <p className="page-header-lede">Albums photos des activités et événements de l'AGMR.</p>
          </div>
        </div>

        <section className="section">
          <div className="container">
            {ALBUMS.map((album, ai) => (
              <div key={ai} style={{ marginBottom: 56 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: "1.3rem", marginBottom: 4 }}>{album.titre}</h3>
                    <span style={{ fontSize: "0.86rem", color: "var(--ink-mute)" }}>{album.desc} · {album.count} photos</span>
                  </div>
                </div>
                <div className="gallery-grid">
                  {Array.from({ length: Math.min(album.count, 8) }, (_, i) => (
                    <div key={i} className={`gallery-item ${PATS[(ai * 3 + i) % PATS.length]}`}>
                      <div className="gallery-item-cap">{album.titre} — {i + 1}/{album.count}</div>
                    </div>
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
