import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import HeroGrid from './HeroGrid'

export default function About() {
  const rootRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const q = gsap.utils.selector(root)

    const ctx = gsap.context(() => {
      gsap.from(q('.hero__subtitle'), { y: 14, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 })
      gsap.from(q('.cta-big'), { y: 8, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.2 })
    }, root)

    return () => { ctx.revert() }
  }, [])

  return (
    <section ref={rootRef} className="hero" id="about" aria-labelledby="hero-title">
      <HeroGrid />
      <div className="hero-overlay">
        <p className="hero__subtitle">Welcome to my zone</p>
        <div className="cta-row">
          <a
            className="cta-big"
            href="https://www.linkedin.com/in/mehul-shetty/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow Me
          </a>
        </div>
      </div>
    </section>
  )
}
