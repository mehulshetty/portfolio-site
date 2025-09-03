import React, { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const q = gsap.utils.selector(root)

    const ctx = gsap.context(() => {
      // Title + CTA should appear immediately on load (independent of scroll)
      gsap.from(q('.hero__title'), { y: 14, opacity: 0, duration: 0.6, ease: 'power2.out' })
      gsap.from(q('.cta-big'), { y: 8, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.05 })

      // Collage animation: cards peek from corners then slide to center collage while pinned
      const cards = gsap.utils.toArray<HTMLElement>(q('.card'))
      if (!cards.length) {
        // Mobile fallback: no collage
        return
      }

      const tl = gsap.timeline({
        defaults: { duration: 1, ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: () => {
            // Re-apply start positions on refresh so cards keep peeking from edges
            const cs = gsap.utils.toArray<HTMLElement>(q('.card'))
            cs.forEach((c, i) => {
              const { x, y } = startFromCorner(c, i)
              gsap.set(c, { xPercent: -50, yPercent: -50, x, y, scale: 1.02, opacity: 0.95, transformOrigin: '50% 50%' })
            })
          },
          onUpdate: (self) => {
            // When close to center, bring collage above text; otherwise keep behind
            const above = self.progress >= 0.42
            gsap.set(q('.hero-collage'), { zIndex: above ? 5 : 1 })
          },
        }
      })

      const W = () => root.getBoundingClientRect().width
      const H = () => root.getBoundingClientRect().height
      // Direction vectors for each card's origin corner
      const corners = [
        { sx: -1, sy: -1 }, // top-left
        { sx:  1, sy: -1 }, // top-right
        { sx: -1, sy:  1 }, // bottom-left
        { sx:  1, sy:  1 }, // bottom-right
        { sx:  0, sy:  1 }, // bottom-center
      ] as const

      const getVarPx = (el: HTMLElement, name: string) => {
        const raw = getComputedStyle(el).getPropertyValue(name).trim()
        if (!raw) return 0
        const n = parseFloat(raw)
        if (raw.endsWith('vw')) return (n / 100) * window.innerWidth
        if (raw.endsWith('vh')) return (n / 100) * window.innerHeight
        return n // assume px
      }

      const getRootVarPx = (name: string) => {
        const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
        if (!raw) return 0
        const n = parseFloat(raw)
        if (raw.endsWith('vw')) return (n / 100) * window.innerWidth
        if (raw.endsWith('vh')) return (n / 100) * window.innerHeight
        return n // assume px
      }

      const getVarDeg = (el: HTMLElement, name: string) => {
        const raw = getComputedStyle(el).getPropertyValue(name).trim()
        if (!raw) return 0
        return parseFloat(raw) || 0
      }

      const startFromCorner = (el: HTMLElement, idx: number) => {
        const { sx, sy } = corners[idx % corners.length]
        const rect = el.getBoundingClientRect()
        const w = rect.width || el.offsetWidth || W() * 0.3
        const h = rect.height || el.offsetHeight || H() * 0.2
        const peek = Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.06) // ~6% viewport
        // Desired start position relative to hero center (only a small slice visible)
        const cornerX = sx === 0 ? 0 : sx * (W() / 2 + w / 2 - peek)
        // Compensate for fixed header so top-edge peek is visible
        const headerH = getRootVarPx('--header-h') || 64
        const cornerY0 = sy * (H() / 2 + h / 2 - peek)
        const cornerY = (sy === -1) ? (cornerY0 + headerH) : cornerY0
        return { x: cornerX, y: cornerY }
      }

      // Ensure initial "peek from edges" state is visible before scrolling
      const applyStart = (el: HTMLElement, idx: number) => {
        const { x, y } = startFromCorner(el, idx)
        gsap.set(el, { xPercent: -50, yPercent: -50, x, y, rotation: getVarDeg(el, '--rot'), scale: 1.02, opacity: 0.95, transformOrigin: '50% 50%' })
      }

      // Set initial positions
      cards.forEach((c, i) => applyStart(c, i))

      tl.to(cards, {
        xPercent: -50,
        yPercent: -50,
        x: (i, target) => getVarPx(target as HTMLElement, '--tx'),
        y: (i, target) => getVarPx(target as HTMLElement, '--ty'),
        rotation: (i, target) => getVarDeg(target as HTMLElement, '--rot'),
        scale: 1,
        opacity: 1,
        stagger: 0.08,
      }, 0)

      // Ensure ScrollTrigger sizes are correct after we set initial positions
      ScrollTrigger.refresh()
    }, root)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach(t => t.refresh())
    }
  }, [])

  return (
    <section ref={rootRef} className="hero" id="solutions" aria-labelledby="hero-title">
      <div className="container">
        <h1 id="hero-title" className="hero__title text-blue">
          Hello, I'm <mark className="hl hl--yellow">Mehul</mark>
          <br />
          Welcome to my zone!
        </h1>
        <div className="cta-row">
          <a className="cta-big" href="https://www.linkedin.com/in/mehul-shetty/">Follow Me</a>
        </div>
      </div>

      {/* Floating collage */}
      <div className="hero-collage" aria-hidden="true">
        <figure className="card c1"><img src="https://picsum.photos/seed/rm1/520/360" alt="" loading="lazy" /></figure>
        <figure className="card c2"><img src="https://picsum.photos/seed/rm2/420/300" alt="" loading="lazy" /></figure>
        <figure className="card c3"><img src="https://picsum.photos/seed/rm3/360/280" alt="" loading="lazy" /></figure>
        <figure className="card c4"><img src="https://picsum.photos/seed/rm4/420/340" alt="" loading="lazy" /></figure>
        <figure className="card c5"><img src="https://picsum.photos/seed/rm5/420/320" alt="" loading="lazy" /></figure>
      </div>
      <div className="scrim-bottom" aria-hidden="true"></div>
    </section>
  )
}
