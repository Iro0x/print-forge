'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProductImageManager({ product, onUpdate }) {
    const [images, setImages] = useState(product.images || [])
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files)
        if (!files.length) return
        setUploading(true)
        setError('')

        const newUrls = []

        for (const file of files) {
            // Sprawdź typ
            if (!file.type.startsWith('image/')) {
                setError('Tylko pliki graficzne (JPG, PNG, WebP)')
                continue
            }
            // Sprawdź rozmiar (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Plik za duży — maksymalnie 5 MB')
                continue
            }

            const ext = file.name.split('.').pop()
            const path = `${product.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(path, file, { contentType: file.type, upsert: false })

            if (uploadError) {
                setError('Błąd uploadu: ' + uploadError.message)
                continue
            }

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(path)

            newUrls.push(publicUrl)
        }

        if (newUrls.length > 0) {
            const updatedImages = [...images, ...newUrls]
            const { error: dbError } = await supabase
                .from('products')
                .update({ images: updatedImages })
                .eq('id', product.id)

            if (!dbError) {
                setImages(updatedImages)
                onUpdate?.(updatedImages)
            } else {
                setError('Błąd zapisu do bazy: ' + dbError.message)
            }
        }

        setUploading(false)
        e.target.value = ''
    }

    const handleDelete = async (urlToDelete) => {
        // Wyciągnij ścieżkę z URL
        const path = urlToDelete.split('/product-images/')[1]
        await supabase.storage.from('product-images').remove([path])

        const updatedImages = images.filter(url => url !== urlToDelete)
        await supabase.from('products').update({ images: updatedImages }).eq('id', product.id)
        setImages(updatedImages)
        onUpdate?.(updatedImages)
    }

    const handleSetMain = async (url) => {
        // Przesuń wybrane zdjęcie na pierwszą pozycję
        const reordered = [url, ...images.filter(u => u !== url)]
        await supabase.from('products').update({ images: reordered }).eq('id', product.id)
        setImages(reordered)
        onUpdate?.(reordered)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Siatka zdjęć */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {images.map((url, i) => (
                    <div key={url} style={{ position: 'relative', aspectRatio: '1', border: `2px solid ${i === 0 ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '2px', overflow: 'hidden', background: 'var(--bg)' }}>
                        <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                        {/* Overlay z akcjami */}
                        <div style={{
                            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            gap: '0.4rem', opacity: 0, transition: 'opacity 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                        >
                            {i !== 0 && (
                                <button onClick={() => handleSetMain(url)} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0.3rem 0.6rem', fontSize: '0.65rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                    Ustaw główne
                                </button>
                            )}
                            {i === 0 && (
                                <span style={{ background: 'var(--accent)', color: 'white', padding: '0.2rem 0.5rem', fontSize: '0.6rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px' }}>
                                    Główne
                                </span>
                            )}
                            <button onClick={() => handleDelete(url)} style={{ background: 'rgba(255,50,50,0.9)', color: 'white', border: 'none', padding: '0.3rem 0.6rem', fontSize: '0.65rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer' }}>
                                Usuń
                            </button>
                        </div>
                    </div>
                ))}

                {/* Przycisk dodaj */}
                <label style={{
                    aspectRatio: '1', border: '2px dashed var(--border)', borderRadius: '2px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '0.4rem', cursor: uploading ? 'not-allowed' : 'pointer',
                    color: 'var(--muted)', fontSize: '0.7rem', fontFamily: "'DM Mono', monospace",
                    letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.2s',
                    background: uploading ? 'var(--surface2)' : 'transparent',
                }}
                    onMouseEnter={e => { if (!uploading) e.currentTarget.style.borderColor = 'var(--accent)' }}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                    <span style={{ fontSize: '1.5rem' }}>{uploading ? '⏳' : '+'}</span>
                    <span>{uploading ? 'Wysyłanie...' : 'Dodaj'}</span>
                    <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading} style={{ display: 'none' }} />
                </label>
            </div>

            {error && (
                <p style={{ color: 'var(--accent)', fontSize: '0.8rem', fontFamily: "'DM Mono', monospace" }}>⚠️ {error}</p>
      )}

            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>
                JPG, PNG, WebP — max 5 MB · Pierwsze zdjęcie = główne w sklepie
            </p>
        </div>
    )
}