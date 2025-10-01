import React, { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

export default function Research() {
  const rootRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const q = gsap.utils.selector(root)

    const stage = q('.example-stage')[0] as HTMLElement | undefined
    const examples = Array.from(q('.example')) as HTMLElement[]
    if (!stage || examples.length < 2) return

    // Disable animations on mobile screens
    const isMobile = window.innerWidth <= 700
    if (isMobile) {
      // Show both examples stacked on mobile
      gsap.set(examples, { x: 0, opacity: 1, position: 'relative' })
      return
    }

    const width = () => (stage?.clientWidth ?? window.innerWidth)

    // Initial positions
    gsap.set(examples[0], { x: 0, opacity: 1 })
    gsap.set(examples[1], { x: width(), opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: '+=160%',
        pin: true,
        pinSpacing: true,
        scrub: 1,
      }
    })

    const HOLD = 0.4
    const SLIDE = 1

    tl
      // Pause with first article fully visible
      .to({}, { duration: HOLD })
      // Slide transition (both articles animate concurrently)
      .to(examples[0], { x: () => -width(), opacity: 0, ease: 'none', duration: SLIDE })
      .to(examples[1], { x: 0, opacity: 1, ease: 'none', duration: SLIDE }, '<')
      // Pause with second article fully visible before releasing pin
      .to({}, { duration: HOLD })

    const onResize = () => {
      // keep second slide offscreen on resize while at start
      if (tl.scrollTrigger && tl.scrollTrigger.progress === 0) {
        gsap.set(examples[1], { x: width(), opacity: 0 })
      }
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <section ref={rootRef} className="research-section" id="research" aria-labelledby="band-examples-title">
      <div className="research-frame">
        {/* Top row: full-bleed yellow banner (about half of remaining space) */}
        <div className="research-banner">
          <h2 id="band-examples-title" className="research-title">Here's some <mark className="hl hl--blue">research</mark> I've worked on</h2>
        </div>

        {/* Bottom row: stage with image 30% and text 70%. Slides on scroll. */}
        <div className="container example-stage">
          <article className="example">
            <div className="example__title-strip">
              <div className="title-chip title-chip--orange">POIFormer: A Transformer-Based Framework for Accurate and Scalable Point-of-Interest Attribution</div>
            </div>
            <div className="example__media">
              <img src={`${import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL}/assets/poiAttr.png`} alt="POIFormer preview" loading="lazy" />
            </div>
            <div className="example__content">
              <h3 className="sr-only">POIFormer: A Transformer-Based Framework for POI Attribution</h3>
              <p className="example__desc">
                Accurately attributing user visits to specific Points of Interest (POIs) is a foundational task for mobility analytics, personalized services, marketing and urban planning. However, POI attribution remains challenging due to GPS inaccuracies, typically ranging from 2 to 20 meters in real-world settings, and the high spatial density of POIs in urban environments, where multiple venues can coexist within a small radius (e.g., over 50 POIs within a 100-meter radius in dense city centers)...
              </p>
              <a className="pill pill--cta example__btn" href="https://arxiv.org/abs/2507.09137" aria-label="Read research paper">Read paper</a>
            </div>
          </article>

          <article className="example">
            <div className="example__title-strip">
              <div className="title-chip title-chip--blue">Quantifying Symptom Causality in Clinical Decision Making: An Exploration Using CausaLM</div>
            </div>
            <div className="example__media">
              <img src={`${import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL}/assets/causalLM.png`} alt="Quantifying Symptom Causality preview" loading="lazy" />
            </div>
            <div className="example__content">
              <h3 className="sr-only">Quantifying Symptom Causality in Clinical Decision Making</h3>
              <p className="example__desc">
                Current machine learning approaches to medical diagnosis often rely on correlational patterns between symptoms and diseases, risking misdiagnoses when symptoms are ambiguous or common across multiple conditions. In this work, we move beyond correlation to investigate the causal influence of key symptoms—specifically "chest pain"—on diagnostic predictions. Leveraging the CausaLM framework, we generate counterfactual text representations in which target concepts are effectively "forgotten"...
              </p>
              <a className="pill pill--cta example__btn" href="https://arxiv.org/abs/2503.19394" aria-label="Read research paper">Read paper</a>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
