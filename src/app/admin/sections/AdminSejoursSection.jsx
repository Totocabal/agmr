'use client'
import { useState, useEffect } from 'react'
import Icon from '@/components/ui/Icon'
import { createClient } from '@/lib/supabase-client'

// Correspond aux gradients de la page publique + quelques couleurs supplémentaires
const IMG_OPTIONS = {
  a: { label: 'Terre chaude',  gradient: 'linear-gradient(135deg, #c4956a 0%, #8b5e3c 100%)' },
  b: { label: 'Bleu mer',      gradient: 'linear-gradient(135deg, #6aadbc 0%, #3a7d8c 100%)' },
  c: { label: 'Or doux',       gradient: 'linear-gradient(135deg, #c4a96a 0%, #8b7040 100%)' },
  d: { label: 'Forêt',         gradient: 'linear-gradient(135deg, #7a9e7e 0%, #4a6e4e 100%)' },
  e: { label: 'Crépuscule',    gradient: 'linear-gradient(135deg, #c47a8c 0%, #8c4a5c 100%)' },
  f: { label: 'Lavande',       gradient: 'linear-gradient(135deg, #9b8ec4 0%, #6b5e94 100%)' },
}

const STATUT_OPTIONS = [
  { value: 'ouvert',  label: 'Inscriptions ouvertes', color: '#166534', bg: '#dcfce7' },
  { value: 'complet', label: 'Complet',               color: '#991b1b', bg: '#fee2e2' },
  { value: 'passe',   label: 'Terminé',               color: 'var(--ink-mute)', bg: 'var(--bg-deep)' },
]

function statutBadge(statut) {
  const s = STATUT_OPTIONS.find(o => o.value === statut) ?? STATUT_OPTIONS[0]
  return (
    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: s.color, background: s.bg, borderRadius: 4, padding: '2px 8px', whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export default function AdminSejoursSection() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const supabase = createClient()

  const load = async () => {
    const { data, error } = await supabase
      .from('sejours')
      .select('*')
      .order('created_at')
    if (!error) setItems(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const save = async (f) => {
    const payload = {
      titre:       f.titre,
      dates:       f.dates,
      transport:   f.transport || null,
      statut:      f.statut ?? 'ouvert',
      description: f.description || null,
      img:         f.img ?? 'a',
    }
    if (f.id) {
      await supabase.from('sejours').update(payload).eq('id', f.id)
    } else {
      await supabase.from('sejours').insert(payload)
    }
    setEditing(null); load()
  }

  const del = async (id) => {
    if (!confirm('Supprimer ce séjour ?')) return
    await supabase.from('sejours').delete().eq('id', id)
    load()
  }

  const setStatut = async (id, statut) => {
    await supabase.from('sejours').update({ statut }).eq('id', id)
    load()
  }

  const blank = { titre: '', dates: '', transport: '', statut: 'ouvert', description: '', img: 'a' }

  if (loading) return <div style={{ padding: 40, color: 'var(--ink-mute)' }}>Chargement…</div>

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Séjours</h1>
          <p className="muted" style={{ margin: 0 }}>{items.length} séjour{items.length > 1 ? 's' : ''} · {items.filter(s => s.statut === 'ouvert').length} ouvert{items.filter(s => s.statut === 'ouvert').length > 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a className="btn btn-ghost btn-sm" href="/actualites/sejours" target="_blank" rel="noopener noreferrer">
            Voir la page →
          </a>
          <button className="btn btn-primary" onClick={() => setEditing(blank)}>
            <Icon name="plus" size={14}/> Nouveau séjour
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(s => (
          <div key={s.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', overflow: 'hidden', display: 'grid', gridTemplateColumns: '80px 1fr auto auto', alignItems: 'center', gap: 0 }}>
            {/* Color swatch */}
            <div style={{ height: '100%', minHeight: 72, background: (IMG_OPTIONS[s.img] ?? IMG_OPTIONS.a).gradient }}/>
            {/* Info */}
            <div style={{ padding: '14px 20px' }}>
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 2 }}>{s.titre}</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--ink-mute)', display: 'flex', gap: 14 }}>
                <span>📅 {s.dates}</span>
                {s.transport && <span>🚌 {s.transport}</span>}
              </div>
              {s.description && (
                <div style={{ fontSize: '0.82rem', color: 'var(--ink-mute)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400 }}>
                  {s.description}
                </div>
              )}
            </div>
            {/* Statut + toggle rapide */}
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
              {statutBadge(s.statut)}
              <select
                value={s.statut}
                onChange={e => setStatut(s.id, e.target.value)}
                style={{ fontSize: '0.74rem', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--line)', background: 'var(--bg-elev)', color: 'var(--ink-soft)', cursor: 'pointer' }}
              >
                {STATUT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {/* Actions */}
            <div style={{ padding: '0 16px', display: 'flex', gap: 6, borderLeft: '1px solid var(--line)' }}>
              <button className="icon-btn" onClick={() => setEditing(s)}><Icon name="edit" size={14}/></button>
              <button className="icon-btn" onClick={() => del(s.id)}><Icon name="trash" size={14}/></button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--ink-mute)', padding: 64 }}>
            Aucun séjour enregistré — <button className="btn btn-ghost btn-sm" onClick={() => setEditing(blank)}>Créer le premier</button>
          </div>
        )}
      </div>

      {editing && (
        <Modal title={editing.id ? 'Modifier le séjour' : 'Nouveau séjour'} onClose={() => setEditing(null)}>
          <SejourForm item={editing} onSave={save} onCancel={() => setEditing(null)}/>
        </Modal>
      )}
    </>
  )
}

function SejourForm({ item, onSave, onCancel }) {
  const [f, setF] = useState({ ...item })
  const u = (k, v) => setF(p => ({ ...p, [k]: v }))

  return (
    <div className="form">
      {/* Aperçu couleur */}
      <div style={{ height: 60, borderRadius: 'var(--r-sm)', background: (IMG_OPTIONS[f.img] ?? IMG_OPTIONS.a).gradient, marginBottom: 4 }}/>

      <div className="field">
        <label>Titre du séjour</label>
        <input value={f.titre} onChange={e => u('titre', e.target.value)} placeholder="Alsace — vignobles et villages"/>
      </div>

      <div className="row-2">
        <div className="field">
          <label>Dates</label>
          <input value={f.dates} onChange={e => u('dates', e.target.value)} placeholder="14 – 21 mai 2026"/>
        </div>
        <div className="field">
          <label>Transport</label>
          <input value={f.transport} onChange={e => u('transport', e.target.value)} placeholder="Car, Covoiturage, Train…"/>
        </div>
      </div>

      <div className="field">
        <label>Description</label>
        <textarea rows={3} value={f.description} onChange={e => u('description', e.target.value)} placeholder="Présentation du séjour, programme…"/>
      </div>

      <div className="row-2">
        <div className="field">
          <label>Statut</label>
          <select value={f.statut} onChange={e => u('statut', e.target.value)}>
            {STATUT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Couleur de la carte</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            {Object.entries(IMG_OPTIONS).map(([key, opt]) => (
              <button
                key={key}
                type="button"
                onClick={() => u('img', key)}
                title={opt.label}
                style={{
                  width: 32, height: 32,
                  borderRadius: 6,
                  background: opt.gradient,
                  border: f.img === key ? '2px solid var(--ink)' : '2px solid transparent',
                  cursor: 'pointer',
                  boxShadow: f.img === key ? '0 0 0 2px var(--bg-card), 0 0 0 4px var(--ink)' : 'none',
                  transition: 'box-shadow 0.1s',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
        <button className="btn btn-ghost" onClick={onCancel}>Annuler</button>
        <button className="btn btn-primary" disabled={!f.titre || !f.dates} onClick={() => onSave(f)}>
          Enregistrer
        </button>
      </div>
    </div>
  )
}
