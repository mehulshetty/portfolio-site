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

    // Cache hover selectors for better performance
    const hoverSelectors = 'a, button, [role="button"], .pill, .cta-big, .hover-target, .switch'
    let isCurrentlyHover = false

    const onMove = (e: MouseEvent) => {
      el.classList.remove('is-hidden')

      // Move cursor immediately with no animation delay
      // Use left/top instead of x/y to work with CSS translate(-50%, -50%)
      el.style.left = e.clientX + 'px'
      el.style.top = e.clientY + 'px'

      // Throttle hover detection to improve performance
      const target = e.target as Element | null
      const isHover = !!target?.closest(hoverSelectors)
      if (isHover !== isCurrentlyHover) {
        isCurrentlyHover = isHover
        el.classList.toggle('is-hover', isHover)
      }
    }

    const onDown = () => el.classList.add('is-down')
    const onUp = () => el.classList.remove('is-down')
    const onLeave = () => el.classList.add('is-hidden')

    // Initialize at center to avoid jump
    el.style.left = (window.innerWidth / 2) + 'px'
    el.style.top = (window.innerHeight / 2) + 'px'

    // Use mousemove instead of pointermove for better compatibility
    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mousedown', onDown, { passive: true })
    document.addEventListener('mouseup', onUp, { passive: true })
    document.addEventListener('mouseleave', onLeave, { passive: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [isFinePointer])

  if (!isFinePointer) return null

  return <div ref={elRef} className="custom-cursor" aria-hidden="true" />
}
