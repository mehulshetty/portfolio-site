import React, { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

export default function CustomCursor() {
  // Only render on pointer-fine devices (skip touch)
  const isFinePointer = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: fine)').matches
  const elRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isFinePointer) return

    const el = elRef.current!
    // start hidden until user moves pointer
    el.classList.add('is-hidden')
    // Smooth follow using quickTo
    const xTo = gsap.quickTo(el, 'x', { duration: 0.10, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.10, ease: 'power3.out' })

    const onMove = (e: PointerEvent) => {
      el.classList.remove('is-hidden')
      xTo(e.clientX)
      yTo(e.clientY)

      const target = e.target as Element | null
      const isHover = !!target?.closest('a, button, [role="button"], .pill, .cta-big, .hover-target, .switch')
      el.classList.toggle('is-hover', isHover)
    }

    const onDown = () => el.classList.add('is-down')
    const onUp = () => el.classList.remove('is-down')
    const onEnter = () => el.classList.remove('is-hidden')
    const onLeave = () => el.classList.add('is-hidden')

    // Initialize at center to avoid jump
    gsap.set(el, { x: window.innerWidth / 2, y: window.innerHeight / 2 })

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('mouseenter', onEnter)
    window.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [isFinePointer])

  if (!isFinePointer) return null

  return <div ref={elRef} className="custom-cursor" aria-hidden="true" />
}
