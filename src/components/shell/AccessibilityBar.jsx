'use client'
import Icon from '@/components/ui/Icon'

export default function AccessibilityBar({ a11y, setA11y }) {
  return (
    <div className="a11y-bar" role="region" aria-label="Options d'accessibilite">
      <div className="a11y-inner">
        <span className="a11y-label">
          <Icon name="accessibility" size={13}/> Accessibilite
        </span>
        <div className="a11y-group">
          <span className="a11y-label" style={{ marginRight: 4 }}>Texte</span>
          {[{v:16,s:"s"},{v:18,s:"m"},{v:20,s:"l"},{v:22,s:"xl"}].map(t => (
            <button
              key={t.v}
              data-size={t.s}
              className={`a11y-btn ${a11y.fontSize === t.v ? 'active' : ''}`}
              onClick={() => setA11y({ ...a11y, fontSize: t.v })}
              aria-label={`Taille ${t.v}px`}
            >
              A
            </button>
          ))}
        </div>
        <div className="a11y-group">
          <span className="a11y-label" style={{ marginRight: 4 }}>Contraste</span>
          <button
            className={`a11y-btn ${a11y.contrast === 'normal' ? 'active' : ''}`}
            onClick={() => setA11y({ ...a11y, contrast: 'normal' })}
          >
            Standard
          </button>
          <button
            className={`a11y-btn ${a11y.contrast === 'high' ? 'active' : ''}`}
            onClick={() => setA11y({ ...a11y, contrast: 'high' })}
          >
            Eleve
          </button>
        </div>
        <div className="a11y-group" style={{ marginLeft: 'auto' }}>
          <button
            className={`a11y-btn ${a11y.theme === 'light' ? 'active' : ''}`}
            onClick={() => setA11y({ ...a11y, theme: 'light' })}
          >
            <Icon name="sun" size={12}/> Clair
          </button>
          <button
            className={`a11y-btn ${a11y.theme === 'dark' ? 'active' : ''}`}
            onClick={() => setA11y({ ...a11y, theme: 'dark' })}
          >
            <Icon name="moon" size={12}/> Sombre
          </button>
        </div>
      </div>
    </div>
  )
}
