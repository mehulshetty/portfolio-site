import React, { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'

export default function BuildBetter() {
  const rootRef = useRef<HTMLElement | null>(null)
  const [isOn, setIsOn] = useState(false)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const q = gsap.utils.selector(root)

    const tiles = q('.board-center .tile, .board-right .note, .board-left .panel')
    tiles.forEach((el) => {
      gsap.from(el as Element, {
        scrollTrigger: { trigger: el as Element, start: 'top 85%' },
        y: 30,
        opacity: 0,
        duration: .7,
        ease: 'power3.out'
      })
    })

    return () => {
      // gsap context not used here because triggers are element-scoped; they will auto-clean on page change
    }
  }, [])

  return (
    <section ref={rootRef} className="build-better" id="templates" aria-labelledby="build-title">
      <div className="container">
        <h2 id="build-title" className="build__title">Build better <mark className="hl hl--yellow">with Readymag</mark></h2>
      </div>

      <div className="feature-board container">
        <div className="board-left">
          <div className="panel">
            <div className="toggle">
              <div className="toggle-row">
                <span>Scale layout</span>
                <button
                  className={`switch${isOn ? ' is-on' : ''}`}
                  aria-label={`Scale layout ${isOn ? 'on' : 'off'}`}
                  onClick={() => setIsOn(v => !v)}
                ></button>
              </div>
              <div className="toggle-row">
                <span>Limit scale at</span>
                <span className="num">3600</span>
              </div>
              <div className="toggle-row">
                <span>Width</span>
                <span className="num">1024</span>
              </div>
              <div className="grid-demo">
                <div className="g">5</div>
                <div className="g">Auto</div>
                <div className="g">44</div>
              </div>
            </div>
            <div className="actions">
              <a className="pill small">Snap</a>
              <a className="pill small">Sizes</a>
              <a className="pill small">Guides</a>
              <a className="pill small">Grid</a>
            </div>
          </div>
        </div>

        <div className="board-center">
          <div className="mini-grid"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          <div className="tile quick-tour">Quick tour</div>
          <div className="tile shortcuts">Shortcuts</div>
          <div className="tile help">Help page</div>
          <div className="tile updates">R/m updates</div>
        </div>

        <aside className="board-right">
          <div className="note">
            <h3>Design visually</h3>
            <p>Just drag, drop, and create custom layouts that match your personal style.</p>
          </div>
        </aside>
      </div>
    </section>
  )
}
