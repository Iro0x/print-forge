'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
    const cursorRef = useRef(null)

    useEffect(() => {
        const cursor = cursorRef.current
        if (!cursor) return

        const onMove = (e) => {
            cursor.style.left = e.clientX + 'px'
            cursor.style.top = e.clientY + 'px'
        }

        const onEnter = () => cursor.classList.add('big')
        const onLeave = () => cursor.classList.remove('big')

        document.addEventListener('mousemove', onMove)

        const addListeners = () => {
            document.querySelectorAll('a, button, [role="button"], label, select, input, textarea, .product-card').forEach(el => {
                el.addEventListener('mouseenter', onEnter)
                el.addEventListener('mouseleave', onLeave)
            })
        }

        addListeners()

        // Observer na nowe elementy (np. modale)
        const observer = new MutationObserver(addListeners)
        observer.observe(document.body, { childList: true, subtree: true })

        return () => {
            document.removeEventListener('mousemove', onMove)
            observer.disconnect()
        }
    }, [])

    return <div ref={cursorRef} className="cursor" />
}