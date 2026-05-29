'use client'
import { useState } from 'react'
import Icon from '@/components/ui/Icon'
import { createClient } from '@/lib/supabase-client'

// Tables à inclure dans la sauvegarde (par catégorie)
const BACKUP_TABLES = [
  { group: 'Contenu du site',    tables: ['home_blocks', 'gym_page_blocks', 'rando_page_blocks', 'nordique_page_blocks', 'sante_page_blocks', 'asso_page_blocks'] },
  { group: 'Planning & activités', tables: ['gym_courses', 'vacances_scolaires', 'rando_sorties', 'rando_jeudi_groupes', 'gym_disciplines', 'gym_animateurs'] },
  { group: 'Actualités & contenus', tables: ['actualites', 'sejours', 'galerie_photos', 'ag_documents'] },
  { group: 'Association',        tables: ['bureau', 'tarifs', 'site_stats'] },
  { group: 'Administration',     tables: ['admin_profiles', 'contact_messages', 'activity_log'] },
]

const ALL_TABLES = BACKUP_TABLES.flatMap(g => g.tables)

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / 1024 / 1024).toFixed(2)} Mo`
}

export default function AdminBackupSection() {
  const [loading, setLoading]       = useState(false)
  const [progress, setProgress]     = useState(null) // { done, total, current }
  const [lastBackup, setLastBackup] = useState(() => {
    try { return localStorage.getItem('agmr_last_backup') } catch { return null }
  })
  const [error, setError] = useState(null)
  const supabase = createClient()

  const runBackup = async () => {
    setLoading(true)
    setError(null)
    setProgress({ done: 0, total: ALL_TABLES.length, current: '' })

    const backup = {
      meta: {
        version:    '1.0',
        site:       'AGMR — Gym Marche Rambouillet',
        created_at: new Date().toISOString(),
        tables:     ALL_TABLES.length,
      },
      data: {},
    }

    let done = 0
    for (const table of ALL_TABLES) {
      setProgress({ done, total: ALL_TABLES.length, current: table })
      const { data, error } = await supabase.from(table).select('*')
      if (error) {
        console.warn(`Erreur sur ${table}:`, error.message)
        backup.data[table] = []
      } else {
        backup.data[table] = data ?? []
      }
      done++
    }

    setProgress({ done, total: ALL_TABLES.length, current: 'Génération du fichier…' })

    // Générer et télécharger le JSON
    const json     = JSON.stringify(backup, null, 2)
    const blob     = new Blob([json], { type: 'application/json' })
    const url      = URL.createObjectURL(blob)
    const date     = new Date().toISOString().slice(0, 10)
    const filename = `agmr-backup-${date}.json`

    const a = document.createElement('a')
    a.href = url; a.download = filename
    document.body.appendChild(a); a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)

    // Mémoriser la date
    const now = new Date().toLocaleString('fr-FR')
    localStorage.setItem('agmr_last_backup', now)
    setLastBackup(now)

    const size = formatBytes(blob.size)
    setProgress({ done, total: ALL_TABLES.length, current: `✓ ${filename} (${size})` })
    setLoading(false)
  }

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Sauvegarde</h1>
          <p className="muted" style={{ margin: 0 }}>Export complet des données du site</p>
        </div>
      </div>

      {/* Carte principale */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

        {/* Export JSON */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--green-tint)', border: '1px solid var(--green-soft)', display: 'grid', placeItems: 'center', color: 'var(--green)' }}>
              <Icon name="download" size={18}/>
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>Export JSON complet</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-mute)' }}>{ALL_TABLES.length} tables · données Supabase</div>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', marginBottom: 20, lineHeight: 1.6 }}>
            Exporte l'intégralité des données du site (planning, actualités, séjours, galerie, tarifs, pages, admins…) dans un fichier JSON téléchargeable.
          </p>

          {lastBackup && (
            <div style={{ fontSize: '0.8rem', color: 'var(--ink-mute)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="clock" size={13}/>
              Dernière sauvegarde : {lastBackup}
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={runBackup}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? <><Icon name="download" size={15}/> Export en cours…</> : <><Icon name="download" size={15}/> Télécharger la sauvegarde</>}
          </button>

          {/* Barre de progression */}
          {progress && (
            <div style={{ marginTop: 16 }}>
              <div style={{ height: 5, background: 'var(--line)', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', width: `${(progress.done / progress.total) * 100}%`, background: 'var(--green)', transition: 'width .3s', borderRadius: 99 }}/>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-mute)' }}>
                {progress.done}/{progress.total} — <span style={{ fontFamily: 'monospace' }}>{progress.current}</span>
              </div>
            </div>
          )}
        </div>

        {/* Code source */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg-deep)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', color: 'var(--ink-mute)' }}>
              <Icon name="file" size={18}/>
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>Code source</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-mute)' }}>GitHub · versionné automatiquement</div>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', marginBottom: 20, lineHeight: 1.6 }}>
            Le code du site est versionné sur GitHub à chaque modification. Chaque changement crée un commit horodaté, permettant de revenir à n'importe quelle version antérieure.
          </p>
          <a
            href="https://github.com/Totocabal/agmr"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Voir le dépôt GitHub →
          </a>
        </div>

      </div>

      {/* Détail des tables */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line-soft)', fontWeight: 700, fontSize: '0.9rem' }}>
          Contenu de la sauvegarde JSON
        </div>
        <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 24px' }}>
          {BACKUP_TABLES.map(({ group, tables }) => (
            <div key={group}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 8 }}>{group}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {tables.map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }}/>
                    <code style={{ fontSize: '0.82rem' }}>{t}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note images */}
      <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--accent-tint)', border: '1px solid var(--accent-soft)', borderRadius: 'var(--r-sm)', fontSize: '0.84rem', color: 'var(--ink-soft)', display: 'flex', gap: 10 }}>
        <Icon name="info" size={15}/>
        <span>
          <strong>Images :</strong> les photos sont hébergées sur Cloudinary (galerie) et Supabase Storage (actualités, séjours). Les URLs sont incluses dans l'export JSON. Les fichiers images eux-mêmes sont sauvegardés automatiquement par ces services.
        </span>
      </div>
    </>
  )
}
