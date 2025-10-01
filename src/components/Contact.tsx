import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

export default function Contact() {
  const rootRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const q = gsap.utils.selector(root)

    const ctx = gsap.context(() => {
      gsap.from(q('.big-circle'), {
        scrollTrigger: { trigger: q('.big-circle')[0], start: 'top 90%' },
        immediateRender: false,
        scale: .6,
        opacity: 0,
        duration: 1,
        ease: 'elastic.out(1, .6)'
      })
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section ref={rootRef} className="pricing" id="contact" aria-labelledby="pricing-title">
      <div className="container pricing-inner">
        <div className="pricing-copy">
          <h2 id="pricing-title">Please <mark className="hl hl--blue">say hi</mark> to me!</h2>
        </div>
        <div className="pricing-cta">
          <div className="big-circle">
            <form className="contact-form">
              <div className="form-field">
                <label htmlFor="name" className="sr-only">Your name</label>
                <input type="text" id="name" name="name" placeholder="Your name" required />
              </div>
              <div className="form-field">
                <label htmlFor="message" className="sr-only">Your message</label>
                <textarea id="message" name="message" placeholder="Your message" rows={4} required></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
