'use client'
import { useState, useEffect } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)
  const show = (title, msg, duration = 3500) => {
    setToast({ title, msg })
    setTimeout(() => setToast(null), duration)
  }
  return { toast, show }
}

export default function Toast({ toast }) {
  if (!toast) return null
  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem',
      background: 'var(--surface2)', border: '1px solid var(--accent)',
      borderLeft: '3px solid var(--accent)', padding: '1rem 1.5rem',
      borderRadius: '2px', zIndex: 9998, maxWidth: '320px',
      animation: 'slideIn 0.3s ease',
    }}>
      <style>{`@keyframes slideIn { from { transform: translateX(120%); } to { transform: translateX(0); } }`}</style>
      <div style={{ fontWeight: 600, color: 'var(--accent)', marginBottom: '0.25rem' }}>{toast.title}</div>
      <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{toast.msg}</div>
    </div>
  )
}
