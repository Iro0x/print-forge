'use client'
import { useState } from 'react'

const ALLOWED = ['.stl', '.obj', '.3mf', '.step', '.stp', '.iges']
const MAX_MB = 50

export default function FileUpload({ onFileSelect }) {
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  const handleFile = (f) => {
    if (!f) return
    const ext = '.' + f.name.split('.').pop().toLowerCase()
    if (!ALLOWED.includes(ext)) { setError(`Niedozwolony format. Dozwolone: ${ALLOWED.join(', ')}`); return }
    if (f.size > MAX_MB * 1024 * 1024) { setError(`Plik za duży. Maks: ${MAX_MB} MB`); return }
    setError('')
    setFile(f)
    onFileSelect(f)
  }

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
        onClick={() => document.getElementById('fileInput3d').click()}
        style={{
          border: `2px dashed ${dragOver ? 'var(--accent)' : file ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: '4px', padding: '3rem 2rem', textAlign: 'center',
          background: dragOver ? 'rgba(255,69,0,0.04)' : 'transparent',
          cursor: 'pointer', transition: 'all 0.3s',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{file ? '✅' : '📎'}</div>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
          {file ? file.name : 'Upuść plik tutaj lub kliknij'}
        </div>
        {file && (
          <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </div>
        )}
        {!file && (
          <>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              STL, OBJ, 3MF, STEP — max {MAX_MB} MB
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {ALLOWED.map(ext => (
                <span key={ext} style={{
                  fontFamily: "'DM Mono', monospace", fontSize: '0.7rem',
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  padding: '0.25rem 0.6rem', borderRadius: '2px', color: 'var(--accent)',
                }}>{ext.toUpperCase()}</span>
              ))}
            </div>
          </>
        )}
        <input id="fileInput3d" type="file" accept={ALLOWED.join(',')} style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
      </div>
      {error && <p style={{ color: 'var(--accent)', fontSize: '0.85rem', marginTop: '0.5rem' }}>⚠️ {error}</p>}
    </div>
  )
}
