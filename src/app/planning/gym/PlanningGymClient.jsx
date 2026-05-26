'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import { monthFR, monthFRFull } from '@/utils/format'

const DAYS = ["lundi","mardi","mercredi","jeudi","vendredi","samedi"]

export default function PlanningGymClient({ courses }) {
  const [weekOffset, setWeekOffset] = useState(0)

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

  return (
    <section className="section">
      <div className="container">
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
          <button className="btn btn-ghost btn-sm">
            <Icon name="download" size={14}/> PDF
          </button>
        </div>

        <div className="gym-grid">
          {DAYS.map((day, di) => {
            const date = new Date(monday)
            date.setDate(date.getDate() + di)
            const slots = courses
              .filter(c => c.jour === day)
              .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut))
            return (
              <div key={day} className="gym-day">
                <div className="gym-day-head">
                  <div className="gym-day-name">{day}</div>
                  <div className="gym-day-date">
                    {date.getDate()} {monthFR(date.getMonth())}
                  </div>
                </div>
                <div className="gym-day-body">
                  {slots.map(s => (
                    <div key={s.id} className={`gym-slot disc-${s.disc}`}>
                      <div className="gym-slot-time">{s.heureDebut} – {s.heureFin}</div>
                      <div className="gym-slot-disc">{s.discipline}</div>
                      <div className="gym-slot-meta">{s.animateur} · {s.salle}</div>
                    </div>
                  ))}
                  {slots.length === 0 && (
                    <div style={{ padding: 16, color: "var(--ink-mute)", fontSize: "0.88rem" }}>—</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

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
      </div>
    </section>
  )
}
