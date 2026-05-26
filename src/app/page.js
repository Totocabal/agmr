import Link from 'next/link'
import Header from '@/components/shell/Header'
import Footer from '@/components/shell/Footer'
import { news } from '@/data'
import { formatDateFR, catLabel } from '@/utils/format'

export default function HomePage() {
  return (
    <div className="page-shell">
      <Header/>
      <main className="page-main">

        {/* HERO */}
        <section className="hero">
          <div className="hero-photo hero-photo-forest">
            <div className="hero-photo-trees"/>
            <div className="hero-grain"/>
          </div>
          <div className="hero-content">
            <span className="hero-eyebrow">Depuis 1970 · Rambouillet</span>
            <h1>Bougez, marchez,<br/><em>respirez ensemble.</em></h1>
            <p className="hero-sub">
              Gymnastique, randonnee, marche nordique.<br/>
              Dans un esprit de detente et de convivialite.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-lg" href="/inscriptions">
                Je m'inscris
              </Link>
              <Link className="btn btn-light btn-lg" href="/activites/gym">
                Decouvrir nos activites
              </Link>
            </div>
          </div>
          <div className="hero-meta">
            {[["750","Adherents"],["54","Annees"],["3","Disciplines"]].map(([n,l]) => (
              <div key={l}>
                <div className="hero-meta-num">{n}</div>
                <div className="hero-meta-lbl">{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* TRIO */}
        <section className="section section-cream">
          <div className="container">
            <div className="section-head">
              <div className="section-eyebrow">Trois activites, un meme esprit</div>
              <h2 className="section-title">Choisissez votre tempo.</h2>
              <p className="section-lede">
                Une adhesion unique donne acces a la gym et/ou a la marche.
                A vous de construire votre semaine.
              </p>
            </div>
            <div className="trio">
              {[
                { href:"/activites/gym", tag:"Salle", cls:"trio-photo-gym", n:"01", t:"La Gym", d:"Pilates, Yoga, Stretching, Barre au sol, Fitball... 10 disciplines, 8 animateurs brevetes, 5 salles municipales.", stat:"43h / semaine", cta:"Voir les cours" },
                { href:"/activites/randonnee", tag:"Foret", cls:"trio-photo-rando", n:"02", t:"La Randonnee", d:"5 groupes de niveau, 5 a 14 km, chaque jeudi apres-midi. Sorties dimanche tous les 15 jours.", stat:"5 niveaux", cta:"Voir les sorties" },
                { href:"/activites/nordique", tag:"Plein air", cls:"trio-photo-nordique", n:"03", t:"La Marche nordique", d:"Plus dynamique que la randonnee, avec deux batons pour engager tout le corps. Mardi, samedi.", stat:"Batons pretes", cta:"En savoir plus" },
              ].map(c => (
                <Link key={c.href} className="trio-card" href={c.href}>
                  <div className={`trio-photo ${c.cls}`} data-tag={c.tag}>
                    <div className="trio-photo-overlay"/>
                    <div className="trio-photo-num">{c.n}</div>
                  </div>
                  <div className="trio-body">
                    <h3>{c.t}</h3>
                    <p>{c.d}</p>
                    <div className="trio-foot">
                      <span className="trio-link">{c.cta} →</span>
                      <span className="trio-stat">{c.stat}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* MANIFESTO */}
        <section className="section">
          <div className="container">
            <div className="manifesto">
              <div className="manifesto-vis">
                <div className="manifesto-vis-photo"/>
                <div className="manifesto-badge">
                  <strong>L'epanouissement avant la performance</strong>
                  Charte AGMR — 2018
                </div>
              </div>
              <div className="manifesto-text">
                <div className="section-eyebrow">Notre philosophie</div>
                <h2>Le plaisir d'abord,<br/>le reste suit.</h2>
                <p>
                  L'AGMR est une association loi 1901 fondee en 1970. Trois manieres
                  de bouger, toutes pratiquees <strong>dans un esprit de detente et de
                  convivialite, en dehors de toute notion de competition</strong>.
                </p>
                <div className="pull">
                  Une seule adhesion, trois facons de prendre soin de soi.
                </div>
                <div style={{ marginTop: 28, display: "flex", gap: 14 }}>
                  <Link className="btn btn-ghost" href="/association">L'association</Link>
                  <Link className="btn btn-ghost" href="/inscriptions">S'inscrire</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="stats-band">
          <div className="stats-grid">
            {[
              ["750+","Adherents en 2025-2026"],
              ["43h","de cours de gym chaque semaine"],
              ["25","animateurs benevoles randonnee"],
              ["5","salles municipales partenaires"],
            ].map(([n,l]) => (
              <div key={n} className="stat-item">
                <div className="stat-num">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ACTUALITES */}
        <section className="section">
          <div className="container">
            <div className="section-head" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", maxWidth:"none" }}>
              <div>
                <div className="section-eyebrow">A la une</div>
                <h2 className="section-title">Dernieres actualites</h2>
              </div>
              <Link className="btn btn-ghost" href="/actualites">
                Toutes les actualites →
              </Link>
            </div>
            <div className="news-split">
              <article className="news-feature">
                <div className="news-feature-img"/>
                <div className="news-feature-body">
                  <div className="news-meta">
                    <span className={`news-cat news-cat-${news[0].cat}`}>
                      {catLabel(news[0].cat)}
                    </span>
                    <span>{formatDateFR(news[0].date)}</span>
                  </div>
                  <h3>{news[0].title}</h3>
                  <p>{news[0].excerpt}</p>
                  <div style={{ marginTop: 18 }}>
                    <a href="#" style={{ fontWeight: 600 }}>Lire la suite →</a>
                  </div>
                </div>
              </article>
              <div className="news-side-list">
                {news.slice(1, 4).map(n => (
                  <article className="news-side" key={n.id}>
                    <div className="news-meta">
                      <span className={`news-cat news-cat-${n.cat}`}>
                        {catLabel(n.cat)}
                      </span>
                      <span>{formatDateFR(n.date)}</span>
                    </div>
                    <h4>{n.title}</h4>
                    <p>{n.excerpt.slice(0, 90)}...</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="cta-banner">
              <div style={{ position: "relative" }}>
                <h3>Premiere seance d'essai gratuite.</h3>
                <p>Sur simple inscription par telephone ou en ligne. Aucun engagement.</p>
              </div>
              <div style={{ display: "flex", gap: 12, position: "relative" }}>
                <Link className="btn btn-light btn-lg" href="/inscriptions">S'inscrire</Link>
                <Link className="btn btn-light btn-lg" href="/contact">Nous contacter</Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer/>
    </div>
  )
}
