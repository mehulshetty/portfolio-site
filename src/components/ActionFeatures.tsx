import React from 'react'

export default function ActionFeatures() {
  return (
    <section className="action band--orange" aria-labelledby="features-title">
      <div className="container">
        <h2 id="features-title" className="action__title">See some <mark className="hl hl--blue">design features</mark> in action</h2>
        <div className="action-grid">
          <div className="action-card stack">
            <h3>Multistep animation</h3>
            <p>Create sequences, integrate Lottie and add special features like Hotspot or Slideshow.</p>
            <div className="stack-demo" aria-hidden="true">
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
          <div className="action-card lock">
            <h3>Restrict access</h3>
            <p>Share specific projects with a selected audience.</p>
            <div className="lock-demo">
              <input type="password" placeholder="Enter password" aria-label="Password" />
              <button className="pill pill--dark">Open</button>
            </div>
          </div>
          <div className="action-card integrate">
            <h3>Integrations</h3>
            <p>Collect emails, track analytics, embed surveys, and add content from tools like Figma or Spline.</p>
            <div className="logo-row">
              <div className="logo">F</div>
              <div className="logo">S</div>
              <div className="logo">V</div>
              <div className="logo">M</div>
              <div className="logo">S</div>
            </div>
          </div>
          <div className="action-card hoverme">
            <h3>Hover me</h3>
            <p>Simple hover interactions to show states.</p>
            <div className="hover-target" tabIndex={0}>Hover me</div>
          </div>
        </div>
      </div>
    </section>
  )
}
