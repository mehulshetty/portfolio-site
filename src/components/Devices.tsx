import React from 'react'

export default function Devices() {
  return (
    <section className="devices" id="devices" aria-labelledby="devices-title">
      <div className="container">
        <div className="devices-grid">
          <div className="devices-text">
            <h3 id="devices-title">
              Separate <span className="strong">your desktop and mobile</span> layouts to fine‑tune your project’s appearance across devices.
            </h3>
          </div>
          <div className="devices-cards">
            <div className="device-card">
              <div className="device-head">320</div>
              <div className="device-body">
                <div className="bar"></div>
                <div className="bar small"></div>
                <div className="circle"></div>
              </div>
            </div>
            <div className="device-card">
              <div className="device-head">768</div>
              <div className="device-body">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar small"></div>
              </div>
            </div>
            <div className="device-card">
              <div className="device-head">1024</div>
              <div className="device-body">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
