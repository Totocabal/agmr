'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import Icon from '@/components/ui/Icon'
import { monthFR, monthFRFull } from '@/utils/format'

const DAYS    = ["lundi","mardi","mercredi","jeudi","vendredi","samedi"]
const HOUR_PX = 64          // pixels per hour
const START_H = 8           // first visible hour
const END_H   = 21          // last visible hour (exclusive)
const HOURS   = Array.from({ length: END_H - START_H }, (_, i) => START_H + i)
const GRID_H  = (END_H - START_H) * HOUR_PX  // total grid height in px
const TIME_W  = 52          // time-label column width in px

function toMin(t)       { const [h, m] = t.split(':').map(Number); return h * 60 + m }
function slotTop(s)     { return (toMin(s) - START_H * 60) * (HOUR_PX / 60) }
function slotHeight(s, e) { return (toMin(e) - toMin(s)) * (HOUR_PX / 60) }

// ── PDF export ─────────────────────────────────────────────────
function exportPDF(courses, weekLabel) {
  const byDay = DAYS.map(day => ({
    day,
    slots: courses.filter(c => c.jour === day).sort((a, b) => a.heureDebut.localeCompare(b.heureDebut)),
  }))
  const rows = byDay.flatMap(({ day, slots }) =>
    slots.map(s => `<tr><td class="cap">${day}</td><td>${s.heureDebut} – ${s.heureFin}</td><td>${s.discipline}${s.complet ? ' [COMPLET]' : ''}</td><td>${s.animateur}</td><td>${s.salle}</td></tr>`)
  ).join('')
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Planning Gym — AGMR</title>
<style>
  body{font-family:Georgia,serif;padding:32px;color:#1a1a1a}
  h1{font-size:1.5rem;margin:0 0 4px}
  .sub{font-family:Arial,sans-serif;font-size:0.78rem;color:#666;margin-bottom:24px}
  table{width:100%;border-collapse:collapse}
  th{background:#1e3528;color:#fff;padding:9px 14px;text-align:left;font-family:Arial,sans-serif;font-size:0.72rem;text-transform:uppercase;letter-spacing:0.1em}
  td{padding:9px 14px;border-bottom:1px solid #e8e4dc;font-size:0.88rem}
  tr:nth-child(even) td{background:#f9f7f3}
  .cap{text-transform:capitalize}
</style></head><body>
<h1>Planning Gym — AGMR</h1>
<div class="sub">Semaine du ${weekLabel} · Exporté le ${new Date().toLocaleDateString('fr-FR')}</div>
<table>
<thead><tr><th>Jour</th><th>Horaire</th><th>Discipline</th><th>Animateur</th><th>Salle</th></tr></thead>
<tbody>${rows}</tbody>
</table>
</body></html>`
  const w = window.open('', '_blank', 'width=920,height=680')
  w.document.write(html)
  w.document.close()
  w.print()
}

// ── Discipline dropdown ────────────────────────────────────────
function DiscDropdown({ disciplines, selected, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggle = (disc) => {
    const next = new Set(selected)
    next.has(disc) ? next.delete(disc) : next.add(disc)
    onChange(next)
  }

  const allSelected = selected.size === 0
  const label = allSelected
    ? 'Toutes les disciplines'
    : selected.size === 1
      ? [...selected][0]
      : `${selected.size} disciplines`

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 200, justifyContent: "space-between" }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="filter" size={14}/>
          {label}
        </span>
        {!allSelected && (
          <span style={{ background: "var(--accent)", color: "#fff", borderRadius: "99px", fontSize: "0.72rem", padding: "1px 7px", fontWeight: 700 }}>
            {selected.size}
          </span>
        )}
        <Icon name={open ? "chevronUp" : "chevronDown"} size={12}/>
      </button>

      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 50, background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", boxShadow: "var(--sh-md)", minWidth: 240, padding: "8px 0" }}>
          <button
            onClick={() => onChange(new Set())}
            style={{ width: "100%", padding: "8px 16px", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: "0.88rem", color: allSelected ? "var(--accent)" : "var(--ink-mute)", fontWeight: allSelected ? 600 : 400, borderBottom: "1px solid var(--line-soft)", marginBottom: 4 }}
          >
            Toutes les disciplines
          </button>
          {disciplines.map(d => (
            <label
              key={d}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 16px", cursor: "pointer", fontSize: "0.92rem", color: "var(--ink-soft)" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--bg-elev)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <input
                type="checkbox"
                checked={selected.has(d)}
                onChange={() => toggle(d)}
                style={{ accentColor: "var(--accent)", width: 15, height: 15, cursor: "pointer" }}
              />
              {d}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────
export default function PlanningGymClient({ courses }) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [selected, setSelected]     = useState(new Set())

  const monday = useMemo(() => {
    const d = new Date()
    const day = d.getDay()
    const diff = (day === 0 ? -6 : 1 - day) + weekOffset * 7
    d.setDate(d.getDate() + diff)
    d.setHours(0, 0, 0, 0)
    return d
  }, [weekOffset])

  const weekLabel = useMemo(() => {
    const end = new Date(monday)
    end.setDate(end.getDate() + 5)
    return `${monday.getDate()} ${monthFRFull(monday.getMonth())} — ${end.getDate()} ${monthFRFull(end.getMonth())} ${end.getFullYear()}`
  }, [monday])

  const todayStr   = useMemo(() => new Date().toDateString(), [])
  const disciplines = useMemo(() => [...new Set(courses.map(c => c.discipline))].sort(), [courses])
  const visible     = useMemo(() =>
    selected.size === 0 ? courses : courses.filter(c => selected.has(c.discipline))
  , [courses, selected])

  return (
    <section className="section">
      <div className="container">

        {/* ── Toolbar ── */}
        <div className="planning-toolbar">
          <div className="week-nav">
            <button className="icon-btn" onClick={() => setWeekOffset(weekOffset - 1)}>
              <Icon name="chevronLeft" size={16}/>
            </button>
            <button className="icon-btn" onClick={() => setWeekOffset(weekOffset + 1)}>
              <Icon name="chevronRight" size={16}/>
            </button>
          </div>
          <div className="planning-week">Semaine du {weekLabel}</div>
          {weekOffset !== 0 && (
            <button className="btn btn-ghost btn-sm" onClick={() => setWeekOffset(0)}>
              Aujourd'hui
            </button>
          )}
          <DiscDropdown disciplines={disciplines} selected={selected} onChange={setSelected}/>
          <button className="btn btn-ghost btn-sm" onClick={() => exportPDF(visible, weekLabel)}>
            <Icon name="download" size={14}/> PDF
          </button>
        </div>

        {/* ── Calendar grid ── */}
        <div className="planning-time-grid" style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-md)', overflow: 'hidden', background: 'var(--bg-card)', marginTop: 20 }}>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: `${TIME_W}px repeat(6, 1fr)`, borderBottom: '2px solid var(--line)', background: 'var(--bg-deep)' }}>
            <div/>{/* corner */}
            {DAYS.map((day, di) => {
              const date = new Date(monday)
              date.setDate(date.getDate() + di)
              const isToday = date.toDateString() === todayStr
              return (
                <div key={day} style={{ padding: '10px 6px', textAlign: 'center', borderLeft: '1px solid var(--line)' }}>
                  <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: isToday ? 'var(--accent)' : 'var(--ink-mute)', fontWeight: 600, marginBottom: 4 }}>
                    {day}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: isToday ? 'var(--accent)' : 'transparent', color: isToday ? '#fff' : 'var(--ink)', fontSize: '0.9rem', fontWeight: isToday ? 700 : 400 }}>
                    {date.getDate()}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Scrollable body */}
          <div style={{ display: 'flex', overflowY: 'auto', maxHeight: 680 }}>

            {/* Time labels */}
            <div style={{ width: TIME_W, flexShrink: 0, borderRight: '1px solid var(--line)', background: 'var(--bg-deep)' }}>
              {HOURS.map((h, i) => (
                <div key={h} style={{ height: HOUR_PX, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', paddingRight: 10 }}>
                  <span style={{ fontSize: '0.66rem', color: 'var(--ink-mute)', marginTop: i === 0 ? 4 : -8, fontVariantNumeric: 'tabular-nums' }}>
                    {h}:00
                  </span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', position: 'relative' }}>

              {/* Hour lines (span all columns) */}
              {HOURS.map((h, i) => (
                <div key={`hl-${h}`} style={{
                  position: 'absolute', left: 0, right: 0,
                  top: i * HOUR_PX,
                  borderTop: `1px solid rgba(0,0,0,${i === 0 ? 0.12 : 0.06})`,
                  zIndex: 1, pointerEvents: 'none',
                }}/>
              ))}
              {/* Half-hour lines */}
              {HOURS.map((_, i) => (
                <div key={`hh-${i}`} style={{
                  position: 'absolute', left: 0, right: 0,
                  top: i * HOUR_PX + HOUR_PX / 2,
                  borderTop: '1px dashed rgba(0,0,0,0.04)',
                  zIndex: 1, pointerEvents: 'none',
                }}/>
              ))}

              {/* One column per day */}
              {DAYS.map((day, di) => {
                const date = new Date(monday)
                date.setDate(date.getDate() + di)
                const isToday = date.toDateString() === todayStr
                const slots   = visible.filter(c => c.jour === day)

                return (
                  <div key={day} style={{
                    position: 'relative',
                    height: GRID_H,
                    borderLeft: di > 0 ? '1px solid var(--line)' : 'none',
                    background: isToday ? 'rgba(52,90,60,0.025)' : 'transparent',
                  }}>
                    {slots.map(s => {
                      const top = slotTop(s.heureDebut)
                      const h   = Math.max(slotHeight(s.heureDebut, s.heureFin), 18)
                      const pad = h < 30 ? '2px 6px' : '5px 8px'
                      return (
                        <div
                          key={s.id}
                          className={`gym-slot disc-${s.disc}${s.complet ? ' complet' : ''}`}
                          style={{ position: 'absolute', top, height: h, left: 3, right: 3, overflow: 'hidden', zIndex: 2, padding: pad, cursor: 'default' }}
                          title={`${s.heureDebut}–${s.heureFin} · ${s.discipline} · ${s.animateur} · ${s.salle}`}
                        >
                          {h >= 22 && (
                            <div style={{ fontSize: '0.63rem', fontWeight: 700, lineHeight: 1, opacity: 0.75, marginBottom: 1 }}>
                              {s.heureDebut}
                            </div>
                          )}
                          <div style={{ fontSize: h < 32 ? '0.69rem' : '0.78rem', fontWeight: 600, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {s.discipline}
                            {s.complet && <span className="slot-badge badge-complet" style={{ fontSize: '0.58rem', marginLeft: 4 }}>C</span>}
                            {s.tag === 'nouveau' && <span className="slot-badge badge-nouveau" style={{ fontSize: '0.58rem', marginLeft: 4 }}>N</span>}
                            {s.tag === 'apa'     && <span className="slot-badge badge-apa"     style={{ fontSize: '0.58rem', marginLeft: 4 }}>APA</span>}
                          </div>
                          {h >= 46 && (
                            <div className="gym-slot-meta" style={{ fontSize: '0.66rem', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {s.animateur}
                            </div>
                          )}
                          {h >= 64 && (
                            <div className="gym-slot-meta" style={{ fontSize: '0.62rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {s.salle}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Info cards ── */}
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: 24 }}>
            <h4 style={{ marginBottom: 12 }}>Les 5 salles</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: "0.92rem", color: "var(--ink-soft)" }}>
              <li><strong>La Ruche</strong> — La Clairière</li>
              <li><strong>Catherine de Vivonne</strong></li>
              <li><strong>Dreyfus</strong> — Stationnement salle Patenôtre (disque obligatoire)</li>
              <li><strong>Gymnase du Bel-Air</strong></li>
              <li><strong>Maison des Associations</strong></li>
            </ul>
          </div>
          <div style={{ background: "var(--accent-tint)", border: "1px solid var(--accent-soft)", borderRadius: "var(--r-md)", padding: 24 }}>
            <h4 style={{ marginBottom: 10 }}>Rappel</h4>
            <p style={{ margin: 0, fontSize: "0.94rem", color: "var(--ink-soft)" }}>
              Il n'y a <strong>pas de cours pendant les vacances scolaires</strong>.
              Des stages spécifiques sont régulièrement organisés.
            </p>
          </div>
        </div>

        {/* ── Légende badges ── */}
        <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--ink-mute)' }}>
          <span><span className="slot-badge badge-complet">C</span> Complet — inscription non disponible</span>
          <span><span className="slot-badge badge-nouveau">N</span> Nouveau cours cette saison</span>
          <span><span className="slot-badge badge-apa">APA</span> Activité Physique Adaptée (sur ordonnance)</span>
        </div>

      </div>
    </section>
  )
}
