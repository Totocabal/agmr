'use client'
import { useState } from 'react'
import { useHelp } from '@/lib/help-context'

export default function HelpTip({ text, position = 'top' }) {
  const { helpMode } = useHelp()
  const [visible, setVisible] = useState(false)

  if (!helpMode) return null

  const positions = {
    top:    { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 },
    bottom: { top: '100%',   left: '50%', transform: 'translateX(-50%)', marginTop: 8 },
    right:  { left: '100%',  top: '50%',  transform: 'translateY(-50%)', marginLeft: 8 },
    left:   { right: '100%', top: '50%',  transform: 'translateY(-50%)', marginRight: 8 },
  }

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', marginLeft: 5 }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span style={{
        width: 16, height: 16, borderRadius: '50%',
        background: 'var(--accent)', color: '#fff',
        fontSize: '0.65rem', fontWeight: 700, fontFamily: 'var(--sans)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'help', flexShrink: 0, lineHeight: 1,
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        userSelect: 'none',
      }}>
        ?
      </span>

      {visible && (
        <span style={{
          position: 'absolute',
          zIndex: 999,
          ...positions[position],
          background: '#1a1f1c',
          color: '#e8e4d8',
          fontSize: '0.8rem',
          lineHeight: 1.5,
          padding: '8px 12px',
          borderRadius: 6,
          width: 220,
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          pointerEvents: 'none',
          whiteSpace: 'normal',
          fontFamily: 'var(--sans)',
          fontWeight: 400,
          textAlign: 'left',
        }}>
          {text}
        </span>
      )}
    </span>
  )
}
