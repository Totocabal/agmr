'use client'
import { useState, useEffect, useCallback } from 'react'

// ── Téléchargement WebP → JPG via Canvas ──────────────────────
async function downloadJpg(url, filename = 'photo') {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url })
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
  canvas.getContext('2d').drawImage(img, 0, 0)
  canvas.toBlob(blob => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename + '.jpg'
    document.body.appendChild(a); a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }, 'image/jpeg', 0.92)
}

async function downloadAlbum(photos, albumName, onProgress) {
  for (let i = 0; i < photos.length; i++) {
    onProgress(i + 1, photos.length)
    await downloadJpg(photos[i].url, `${albumName}-${i + 1}`)
    if (i < photos.length - 1) await new Promise(r => setTimeout(r, 300))
  }
  onProgress(0, 0)
}

// ── Lightbox ──────────────────────────────────────────────────
function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  const photo = photos[index]

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose, onPrev, onNext])

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,15,10,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      {/* Image */}
      <img
        src={photo.url}
        alt={photo.legende || ''}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: 6, boxShadow: '0 8px 40px rgba(0,0,0,0.6)', userSelect: 'none' }}
      />

      {/* Légende + télécharger */}
      {(photo.legende || true) && (
        <div
          onClick={e => e.stopPropagation()}
          style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '14px 24px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}
        >
          <span style={{ fontSize: '0.9rem', opacity: 0.85 }}>
            {photo.legende || ''}{' '}
            <span style={{ opacity: 0.5, marginLeft: 8 }}>{index + 1} / {photos.length}</span>
          </span>
          <button
            onClick={() => downloadJpg(photo.url, photo.legende || `photo-${index + 1}`)}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', backdropFilter: 'blur(4px)' }}
          >
            ↓ Télécharger JPG
          </button>
        </div>
      )}

      {/* Fermer */}
      <button
        onClick={onClose}
        style={{ position: 'fixed', top: 16, right: 16, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', width: 38, height: 38, borderRadius: '50%', cursor: 'pointer', fontSize: '1.1rem', display: 'grid', placeItems: 'center', backdropFilter: 'blur(4px)' }}
      >✕</button>

      {/* Navigation */}
      {index > 0 && (
        <button
          onClick={e => { e.stopPropagation(); onPrev() }}
          style={{ position: 'fixed', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem', display: 'grid', placeItems: 'center', backdropFilter: 'blur(4px)' }}
        >‹</button>
      )}
      {index < photos.length - 1 && (
        <button
          onClick={e => { e.stopPropagation(); onNext() }}
          style={{ position: 'fixed', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem', display: 'grid', placeItems: 'center', backdropFilter: 'blur(4px)' }}
        >›</button>
      )}
    </div>
  )
}

// ── Vue album (grille de photos) ──────────────────────────────
function AlbumView({ album, photos, onBack }) {
  const [lightboxIdx, setLightboxIdx] = useState(null)
  const [dlProgress, setDlProgress]   = useState(null) // { done, total }

  const handleBatch = () => downloadAlbum(photos, album, (done, total) =>
    setDlProgress(done > 0 ? { done, total } : null)
  )

  return (
    <div>
      {/* En-tête album */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={onBack}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: 'var(--r-sm)', padding: '8px 14px', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}
          >
            ← Retour
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{album}</h2>
            <span style={{ fontSize: '0.86rem', color: 'var(--ink-mute)' }}>{photos.length} photo{photos.length > 1 ? 's' : ''}</span>
          </div>
        </div>
        <button
          onClick={handleBatch}
          disabled={!!dlProgress}
          style={{ background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 'var(--r-sm)', padding: '9px 18px', cursor: dlProgress ? 'not-allowed' : 'pointer', fontSize: '0.9rem', opacity: dlProgress ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}
        >
          {dlProgress
            ? `↓ ${dlProgress.done}/${dlProgress.total}…`
            : `↓ Tout télécharger (JPG)`
          }
        </button>
      </div>

      {/* Grille */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            onClick={() => setLightboxIdx(i)}
            style={{ aspectRatio: '1/1', borderRadius: 'var(--r-sm)', overflow: 'hidden', position: 'relative', cursor: 'zoom-in', background: 'var(--bg-deep)' }}
          >
            <img
              src={photo.url}
              alt={photo.legende || album}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .25s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
            {photo.legende && (
              <div style={{ position: 'absolute', inset: 'auto 0 0 0', padding: '8px 10px', background: 'linear-gradient(transparent, rgba(0,0,0,0.65))', color: '#fff', fontSize: '0.75rem', opacity: 0, transition: 'opacity .2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0'}
              >{photo.legende}</div>
            )}
          </div>
        ))}
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onPrev={() => setLightboxIdx(i => Math.max(0, i - 1))}
          onNext={() => setLightboxIdx(i => Math.min(photos.length - 1, i + 1))}
        />
      )}
    </div>
  )
}

// ── Composant principal ───────────────────────────────────────
export default function GalerieClient({ albumsMap }) {
  const [openAlbum, setOpenAlbum] = useState(null)

  const albums = Object.entries(albumsMap) // [[name, photos[]], ...]

  if (openAlbum) {
    return (
      <AlbumView
        album={openAlbum}
        photos={albumsMap[openAlbum]}
        onBack={() => setOpenAlbum(null)}
      />
    )
  }

  // ── Vue dossiers ──
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
      {albums.map(([album, photos]) => {
        const cover = photos[0]
        return (
          <button
            key={album}
            onClick={() => setOpenAlbum(album)}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--line-soft)', borderRadius: 'var(--r-md)', overflow: 'hidden', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'inherit', transition: 'transform .2s, box-shadow .2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--sh-md)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
          >
            {/* Couverture */}
            <div style={{ aspectRatio: '16/9', background: 'var(--bg-deep)', overflow: 'hidden', position: 'relative' }}>
              {cover
                ? <img src={cover.url} alt={album} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontSize: '2rem', color: 'var(--ink-mute)' }}>🖼️</div>
              }
              {/* Compteur */}
              <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.78rem', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
                {photos.length} photo{photos.length > 1 ? 's' : ''}
              </div>
            </div>
            {/* Nom */}
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>{album}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-mute)', marginTop: 2 }}>Ouvrir l'album →</div>
            </div>
          </button>
        )
      })}

      {albums.length === 0 && (
        <div style={{ gridColumn: '1/-1', padding: 48, textAlign: 'center', color: 'var(--ink-mute)', background: 'var(--bg-elev)', borderRadius: 'var(--r-md)', border: '2px dashed var(--line)' }}>
          Aucune photo pour le moment.
        </div>
      )}
    </div>
  )
}
