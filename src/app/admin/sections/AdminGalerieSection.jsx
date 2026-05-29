'use client'
import { useState, useEffect, useRef } from 'react'
import Icon from '@/components/ui/Icon'
import { createClient } from '@/lib/supabase-client'

const CLOUD_NAME     = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET  = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
const UPLOAD_URL     = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

/** Convertit un File en Blob WebP (max maxW px) via Canvas — aucun crédit Cloudinary utilisé */
function toWebP(file, maxW = 1600) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const ratio  = Math.min(1, maxW / img.naturalWidth)
      const canvas = document.createElement('canvas')
      canvas.width  = Math.round(img.naturalWidth  * ratio)
      canvas.height = Math.round(img.naturalHeight * ratio)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error('Conversion WebP échouée')),
        'image/webp', 0.88
      )
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image invalide')) }
    img.src = url
  })
}

/** Upload un Blob WebP sur Cloudinary (upload non signé) → retourne la secure_url */
async function uploadToCloudinary(blob, folder = 'agmr/galerie') {
  const fd = new FormData()
  fd.append('file', blob, 'photo.webp')
  fd.append('upload_preset', UPLOAD_PRESET)
  fd.append('folder', folder)

  const res = await fetch(UPLOAD_URL, { method: 'POST', body: fd })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `Cloudinary error ${res.status}`)
  }
  const data = await res.json()
  return data.secure_url   // URL https permanente
}

export default function AdminGalerieSection() {
  const [photos, setPhotos]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [progress, setProgress]       = useState(null) // { done, total }
  const [selectedAlbum, setSelectedAlbum] = useState('')
  const [newAlbum, setNewAlbum]       = useState('')
  const [filterAlbum, setFilterAlbum] = useState('all')
  const fileRef  = useRef()
  const supabase = createClient()

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from('galerie_photos')
      .select('*')
      .order('created_at', { ascending: false })
    setPhotos(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchPhotos() }, [])

  // Albums connus (depuis la BDD + quelques valeurs par défaut)
  const albums = [...new Set([
    ...photos.map(p => p.album).filter(Boolean),
    'Séjour', 'Marche nordique', 'Cours de gym', 'Rando', 'Événement',
  ])].sort()

  const activeAlbum = newAlbum.trim() || selectedAlbum || albums[0] || 'Galerie'

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setProgress({ done: 0, total: files.length })

    for (let i = 0; i < files.length; i++) {
      try {
        // 1. Convertir en WebP côté client (gratuit, pas de transformation Cloudinary)
        const webp = await toWebP(files[i])
        // 2. Upload sur Cloudinary
        const url = await uploadToCloudinary(webp, `agmr/galerie/${activeAlbum}`)
        // 3. Enregistrer l'URL en base Supabase
        await supabase.from('galerie_photos').insert({
          album:      activeAlbum,
          nom_fichier: `${Date.now()}-${i}.webp`,
          url,
          legende:    files[i].name.replace(/\.[^.]+$/, ''),
        })
        setProgress({ done: i + 1, total: files.length })
      } catch (err) {
        alert(`Erreur sur ${files[i].name} : ${err.message}`)
      }
    }

    setProgress(null)
    if (fileRef.current) fileRef.current.value = ''
    fetchPhotos()
  }

  const deletePhoto = async (photo) => {
    if (!confirm('Supprimer cette photo ?')) return
    // Note : on ne supprime pas de Cloudinary (pas d'API secret côté client)
    // La photo reste dans le CDN mais n'est plus référencée en BDD
    await supabase.from('galerie_photos').delete().eq('id', photo.id)
    fetchPhotos()
  }

  const filtered = filterAlbum === 'all' ? photos : photos.filter(p => p.album === filterAlbum)

  if (loading) return <div style={{ padding: 40, color: 'var(--ink-mute)' }}>Chargement…</div>

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Galerie</h1>
          <p className="muted" style={{ margin: 0 }}>
            {photos.length} photo{photos.length !== 1 ? 's' : ''} —{' '}
            <strong style={{ color: 'var(--green)' }}>Cloudinary CDN · WebP auto</strong>
          </p>
        </div>
      </div>

      {/* ── Zone d'upload ── */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', padding: 24, marginBottom: 28 }}>
        <h3 style={{ fontFamily: 'var(--sans)', fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>
          Ajouter des photos
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div className="field">
            <label>Album existant</label>
            <select value={selectedAlbum} onChange={e => { setSelectedAlbum(e.target.value); setNewAlbum('') }}>
              {albums.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Ou créer un album</label>
            <input
              value={newAlbum}
              onChange={e => setNewAlbum(e.target.value)}
              placeholder="Nom du nouvel album…"
            />
          </div>
        </div>

        {/* Album actif affiché */}
        <div style={{ marginBottom: 14, fontSize: '0.84rem', color: 'var(--ink-mute)' }}>
          Album cible : <strong style={{ color: 'var(--ink)' }}>{activeAlbum}</strong>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            style={{ display: 'none' }}
            id="cld-upload"
            disabled={!!progress}
          />
          <label
            htmlFor="cld-upload"
            className="btn btn-primary"
            style={{ cursor: progress ? 'not-allowed' : 'pointer', opacity: progress ? 0.7 : 1 }}
          >
            <Icon name="plus" size={16}/>
            {progress ? `Upload ${progress.done}/${progress.total}…` : 'Choisir des photos'}
          </label>
          <span style={{ fontSize: '0.82rem', color: 'var(--ink-mute)' }}>
            JPG, PNG, HEIC… → convertis en WebP automatiquement
          </span>
        </div>

        {/* Barre de progression */}
        {progress && (
          <div style={{ marginTop: 14 }}>
            <div style={{ height: 6, background: 'var(--line)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(progress.done / progress.total) * 100}%`, background: 'var(--green)', transition: 'width 0.3s', borderRadius: 99 }}/>
            </div>
            <div style={{ marginTop: 6, fontSize: '0.82rem', color: 'var(--ink-mute)' }}>
              {progress.done} / {progress.total} photo{progress.total > 1 ? 's' : ''} uploadée{progress.total > 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      {/* ── Filtres albums ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button className={`chip ${filterAlbum === 'all' ? 'active' : ''}`} onClick={() => setFilterAlbum('all')}>
          Toutes ({photos.length})
        </button>
        {[...new Set(photos.map(p => p.album).filter(Boolean))].map(a => (
          <button key={a} className={`chip ${filterAlbum === a ? 'active' : ''}`} onClick={() => setFilterAlbum(a)}>
            {a} ({photos.filter(p => p.album === a).length})
          </button>
        ))}
      </div>

      {/* ── Grille photos ── */}
      {filtered.length === 0 ? (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--ink-mute)', background: 'var(--bg-elev)', borderRadius: 'var(--r-md)', border: '2px dashed var(--line)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>🖼️</div>
          <p style={{ margin: 0 }}>Aucune photo{filterAlbum !== 'all' ? ` dans l'album "${filterAlbum}"` : ''}.<br/>Uploadez des photos ci-dessus.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {filtered.map(photo => (
            <div key={photo.id}
              style={{ position: 'relative', borderRadius: 'var(--r-sm)', overflow: 'hidden', aspectRatio: '1/1', background: 'var(--bg-deep)' }}>
              <img
                src={photo.url}
                alt={photo.legende}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Overlay hover */}
              <div
                className="gallery-card-overlay"
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background .2s', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 8 }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fff', fontSize: '0.74rem', textShadow: '0 1px 3px rgba(0,0,0,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 'calc(100% - 36px)' }}>
                    {photo.legende}
                  </span>
                  <button
                    onClick={() => deletePhoto(photo)}
                    style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--accent)', flexShrink: 0 }}
                  >
                    <Icon name="trash" size={12}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
