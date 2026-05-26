'use client'
import { useState } from 'react'
import Icon from '@/components/ui/Icon'
import { randoSorties } from '@/data'
import { labelType } from '@/utils/format'

const TYPES = ["all","rando-jeudi","rando-dimanche","nordique-mardi","nordique-samedi","sortie-journee","sejour"]
const DOW = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"]
const MSHORT = ["jan","fév","mars","avr","mai","juin","juil","août","sept","oct","nov","déc"]

export default function PlanningRandoClient() {
  const [filter, setFilter] = useState("all")
  const filtered = randoSorties
    .filter(s => filter === "all" || s.type === filter)
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {TYPES.map(t => (
            <button key={t} className={`chip ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>
              {t === "all" ? "Toutes les sorties" : labelType(t)}
            </button>
          ))}
        </div>

        <div className="rando-list">
          {filtered.map(s => {
            const d = new Date(s.date)
            return (
              <div key={s.id} className="rando-card" style={{ opacity: s.annule ? 0.6 : 1 }}>
                <div className="rando-date-col">
                  <div className="rando-dow">{DOW[d.getDay()]}</div>
                  <div className="rando-day">{d.getDate()}</div>
                  <div className="rando-month">{MSHORT[d.getMonth()]}</div>
                </div>
                <div className="rando-info">
                  <div className="rando-title">{s.titre}</div>
                  <div className="rando-meta">
                    <span><Icon name="clock" size={13}/> Départ {s.heureDepart}</span>
                    <span><Icon name="pin" size={13}/> {s.pointDepart}</span>
                    {s.distanceKm && <span>{s.distanceKm} km{s.denivele ? ` · ${s.denivele}m D+` : ""}</span>}
                    {s.animateur && <span>{s.animateur}</span>}
                  </div>
                  <div className="rando-tags">
                    {s.groupes.map(g => <span key={g} className="rando-tag-groupe">{g}</span>)}
                    <span className={`rando-type type-${s.type}`}>{labelType(s.type)}</span>
                  </div>
                </div>
                <div className="rando-status">
                  {s.complet && <span className="badge badge-full">Complet</span>}
                  {s.annule && <span className="badge badge-cancel">Annulée</span>}
                  {!s.complet && !s.annule && <span className="badge badge-ok">Ouverte</span>}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 32, padding: 24, background: "var(--bg-elev)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong>Plannings complets en ligne</strong>
            <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "var(--ink-mute)" }}>Calendriers complets sur Google Sheets — saison en cours.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="https://docs.google.com/spreadsheets/d/1HtnvxtFALYKxeitvtg9G2Jww_Zz0W0QwCJ1NUjZBL3w/" target="_blank" rel="noopener" className="btn btn-ghost btn-sm"><Icon name="download" size={14}/> Planning rando</a>
            <a href="https://docs.google.com/spreadsheets/d/179on1ss96y0_AiGywGb-1uQFRFvPBOoYJ4tEA9UkPTE/" target="_blank" rel="noopener" className="btn btn-ghost btn-sm"><Icon name="download" size={14}/> Planning nordique</a>
          </div>
        </div>
      </div>
    </section>
  )
}