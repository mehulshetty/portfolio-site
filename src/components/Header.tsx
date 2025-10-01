import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

export default function Header() {
  const rootRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const menuItems = Array.from(root.querySelectorAll<HTMLAnchorElement>('.pill-nav a[href^="#"]'))
    const sectionMenuMap = new Map<string, HTMLAnchorElement>()
    menuItems.forEach(item => {
      const sectionId = item.getAttribute('href')?.substring(1) || ''
      if (sectionId) sectionMenuMap.set(sectionId, item)
    })

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    }

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = (entry.target as HTMLElement).id
        const menuItem = sectionMenuMap.get(sectionId)
        if (entry.isIntersecting && menuItem) {
          const currentActive = root.querySelector('.pill--active') as HTMLAnchorElement | null
          if (currentActive && currentActive !== menuItem) {
            gsap.to(currentActive, {
              scale: 1,
              duration: 0.2,
              ease: 'power2.out',
              onComplete: () => currentActive.classList.remove('pill--active'),
            })
          }

          gsap.fromTo(menuItem, { scale: 1 }, {
            scale: 1.05,
            duration: 0.4,
            ease: 'elastic.out(1, 0.6)',
            onStart: () => menuItem.classList.add('pill--active'),
          })

          gsap.to(menuItem, {
            boxShadow: '0 4px 12px rgba(12, 94, 255, 0.35), 0 0 0 1px rgba(12, 94, 255, 0.15)',
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
          })
        }
      })
    }, observerOptions)

    // Observe all sections on the page
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'))
    sections.forEach(section => sectionObserver.observe(section))

    // Initial active state
    if (menuItems.length > 0) menuItems[0].classList.add('pill--active')

    // Hover interactions
    const handlers: Array<{ el: HTMLAnchorElement; enter: () => void; leave: () => void }> = []
    menuItems.forEach(pill => {
      const enter = () => { if (!pill.classList.contains('pill--active')) gsap.to(pill, { scale: 1.02, y: -1, duration: 0.2, ease: 'power2.out' }) }
      const leave = () => { if (!pill.classList.contains('pill--active')) gsap.to(pill, { scale: 1, y: 0, duration: 0.2, ease: 'power2.out' }) }
      pill.addEventListener('mouseenter', enter)
      pill.addEventListener('mouseleave', leave)
      handlers.push({ el: pill, enter, leave })
    })

    return () => {
      sectionObserver.disconnect()
      handlers.forEach(({ el, enter, leave }) => {
        el.removeEventListener('mouseenter', enter)
        el.removeEventListener('mouseleave', leave)
      })
    }
  }, [])

  return (
    <header ref={rootRef} className="site-header" aria-label="Primary">
      <div className="brand">
        <span className="brand-dot" aria-hidden="true">MS</span>
      </div>
      <nav className="pill-nav" aria-label="Site">
        <a href="#about" className="pill">About</a>
        <a href="#research" className="pill">Research</a>
        <a href="#experience" className="pill">Experience</a>
        <a href="#offtime" className="pill">Off Time</a>
        <a href="#contact" className="pill">Contact</a>
      </nav>
    </header>
  )
}
