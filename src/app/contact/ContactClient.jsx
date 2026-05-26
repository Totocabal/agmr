'use client'
import { useState } from 'react'
import Icon from '@/components/ui/Icon'

export default function ContactClient() {
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", sujet: "Inscription", message: "" })
  const u = (k, v) => setForm({ ...form, [k]: v })

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 56 }}>

          <div>
            <h3 style={{ marginBottom: 24 }}>Coordonnées</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <Icon name="mail" size={18}/>
                <div>
                  <strong style={{ display: "block", marginBottom: 4 }}>Email</strong>
                  <a href="mailto:contact@gymmarche.fr">contact@gymmarche.fr</a>
                </div>
              </div>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <Icon name="pin" size={18}/>
                <div>
                  <strong style={{ display: "block", marginBottom: 4 }}>Adresse (boîte aux lettres)</strong>
                  <span style={{ color: "var(--ink-soft)" }}>50, rue du Muguet<br/>78120 Rambouillet</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 36, padding: 24, background: "var(--bg-elev)", border: "1px solid var(--line)", borderRadius: "var(--r-md)" }}>
              <h4 style={{ marginBottom: 10 }}>Forum des Associations</h4>
              <p style={{ margin: 0, fontSize: "0.94rem", color: "var(--ink-soft)" }}>
                Samedi 13 septembre au stade du Vieux Moulin. Venez nous rencontrer sur le stand AGMR.
              </p>
            </div>

            <div style={{ marginTop: 20, padding: 24, background: "var(--green-tint)", border: "1px solid var(--green-soft)", borderRadius: "var(--r-md)" }}>
              <h4 style={{ marginBottom: 10 }}>Première séance gratuite</h4>
              <p style={{ margin: 0, fontSize: "0.94rem", color: "var(--ink-soft)" }}>
                Vous pouvez assister à une séance d'essai gratuite sans inscription préalable pour la gym et la randonnée.
              </p>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: 24 }}>Formulaire de contact</h3>
            <div className="form">
              <div className="row-2">
                <div className="field">
                  <label>Prénom</label>
                  <input value={form.prenom} onChange={e => u("prenom", e.target.value)} placeholder="Votre prénom"/>
                </div>
                <div className="field">
                  <label>Nom</label>
                  <input value={form.nom} onChange={e => u("nom", e.target.value)} placeholder="Votre nom"/>
                </div>
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => u("email", e.target.value)} placeholder="votre@email.fr"/>
              </div>
              <div className="field">
                <label>Sujet</label>
                <select value={form.sujet} onChange={e => u("sujet", e.target.value)}>
                  {["Inscription","Randonnée","Gym","Marche nordique","Séjour","Autre"].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Message</label>
                <textarea rows={5} value={form.message} onChange={e => u("message", e.target.value)} placeholder="Votre message..."/>
              </div>
              <button className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
                Envoyer le message
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
