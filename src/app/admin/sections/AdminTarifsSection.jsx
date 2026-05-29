'use client'
import { useState, useEffect } from 'react'
import Icon from '@/components/ui/Icon'
import { createClient } from '@/lib/supabase-client'
import { logActivity } from '@/lib/activity'

const CAT_LABELS = { gym: 'Gym', marche: 'Marche & Nordique' }

function TarifRow({ item, onChange }) {
  const [val, setVal]   = useState(item.valeur)
  const [note, setNote] = useState(item.note ?? '')
  const [saved, setSaved] = useState(false)

  const save = async () => {
    await onChange(item.id, val.trim(), note.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const onKey = (e) => { if (e.key === 'Enter') save() }

  return (
    <tr>
      <td style={{ color: 'var(--ink-soft)' }}>{item.label}</td>
      <td style={{ width: 160 }}>
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          onBlur={save}
          onKeyDown={onKey}
          placeholder="ex : 32 €"
          style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--line-strong)', borderRadius: 'var(--r-sm)', fontFamily: 'inherit', fontSize: '0.94rem', background: 'var(--bg-card)', color: 'var(--ink)' }}
        />
      </td>
      <td style={{ width: 220 }}>
        <input
          value={note}
          onChange={e => setNote(e.target.value)}
          onBlur={save}
          onKeyDown={onKey}
          placeholder="Note optionnelle…"
          style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--line-strong)', borderRadius: 'var(--r-sm)', fontFamily: 'inherit', fontSize: '0.88rem', background: 'var(--bg-card)', color: 'var(--ink-mute)' }}
        />
      </td>
      <td style={{ width: 36, textAlign: 'center' }}>
        {saved && <span style={{ color: 'var(--green)', fontSize: '1rem' }}>✓</span>}
      </td>
    </tr>
  )
}

export default function AdminTarifsSection() {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [note, setNote]       = useState('')
  const supabase = createClient()

  const load = async () => {
    const { data } = await supabase.from('tarifs').select('*').order('categorie').order('ordre')
    setItems(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const updateRow = async (id, valeur, note) => {
    await supabase.from('tarifs').update({ valeur, note: note || null }).eq('id', id)
  }

  const saveAll = async () => {
    setSaving(true)
    // Récupère les valeurs actuelles depuis le DOM n'est pas idéal —
    // on re-fetch puis log
    await load()
    await logActivity(supabase, { message: 'Tarifs mis à jour', section: 'tarifs', action: 'update' })
    setSaving(false)
  }

  const grouped = items.reduce((acc, t) => {
    if (!acc[t.categorie]) acc[t.categorie] = []
    acc[t.categorie].push(t)
    return acc
  }, {})

  if (loading) return <div style={{ padding: 40, color: 'var(--ink-mute)' }}>Chargement…</div>

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Tarifs</h1>
          <p className="muted" style={{ margin: 0 }}>
            Saison 2025-2026 — les modifications sont enregistrées automatiquement ·{' '}
            <strong style={{ color: 'var(--green)' }}>données Supabase</strong>
          </p>
        </div>
        <a className="btn btn-ghost btn-sm" href="/inscriptions/tarifs" target="_blank" rel="noopener noreferrer">
          Voir la page →
        </a>
      </div>

      <div style={{ background: 'var(--accent-tint)', border: '1px solid var(--accent-soft)', borderRadius: 'var(--r-sm)', padding: '10px 16px', marginBottom: 24, fontSize: '0.88rem', color: 'var(--ink-soft)', display: 'flex', gap: 8 }}>
        <Icon name="info" size={15}/>
        <span>Cliquez sur un champ, saisissez la valeur et appuyez sur <kbd style={{ background: 'var(--bg-deep)', padding: '1px 5px', borderRadius: 3, fontSize: '0.82rem' }}>Entrée</kbd> ou cliquez ailleurs pour enregistrer.</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {Object.entries(grouped).map(([cat, rows]) => (
          <div key={cat} style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
            <div style={{ background: 'var(--green)', padding: '14px 20px' }}>
              <h3 style={{ color: '#fff', fontFamily: 'var(--sans)', fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                {CAT_LABELS[cat] ?? cat}
              </h3>
            </div>
            <table className="tbl" style={{ border: 'none' }}>
              <thead>
                <tr>
                  <th>Libellé</th>
                  <th>Tarif</th>
                  <th>Note</th>
                  <th style={{ width: 36 }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(item => (
                  <TarifRow key={item.id} item={item} onChange={updateRow}/>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Note globale */}
      <div style={{ marginTop: 24, background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', padding: 20 }}>
        <NoteGlobale supabase={supabase}/>
      </div>
    </>
  )
}

function NoteGlobale({ supabase }) {
  const [val, setVal]     = useState('')
  const [saved, setSaved] = useState(false)
  const KEY = 'tarifs_note_globale'

  useEffect(() => {
    supabase.from('tarifs').select('note').eq('label', '__note_globale__').maybeSingle()
      .then(({ data }) => { if (data?.note) setVal(data.note) })
  }, [])

  const save = async () => {
    // Upsert dans une ligne dédiée
    const { data } = await supabase.from('tarifs').select('id').eq('label', '__note_globale__').maybeSingle()
    if (data?.id) {
      await supabase.from('tarifs').update({ note: val }).eq('id', data.id)
    } else {
      await supabase.from('tarifs').insert({ categorie: '__meta__', label: '__note_globale__', valeur: '', note: val, ordre: 99 })
    }
    setSaved(true); setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="field">
      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Message affiché sous le tableau (ex : date du Forum des Associations)</span>
        {saved && <span style={{ color: 'var(--green)', fontSize: '0.84rem' }}>✓ Enregistré</span>}
      </label>
      <textarea
        rows={2}
        value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={save}
        placeholder="Les tarifs définitifs seront communiqués lors du Forum des Associations…"
      />
    </div>
  )
}
