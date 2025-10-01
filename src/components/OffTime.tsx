import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from '../lib/gsap'
import F1CarModel from './F1CarModel'
import { Flag, PersonStanding, Mountain, Gamepad2, Coffee, Lightbulb, Music, BookOpen } from 'lucide-react'

const FACTS = [
  "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
  "A group of flamingos is called a 'flamboyance'.",
  "Octopuses have three hearts and blue blood.",
  "Bananas are berries, but strawberries aren't.",
  "A single cloud can weigh more than a million pounds.",
  "The shortest war in history lasted only 38-45 minutes.",
  "Wombat poop is cube-shaped.",
  "There are more possible games of chess than there are atoms in the observable universe."
]

export default function OffTime() {
  const rootRef = useRef<HTMLElement | null>(null)
  const [milesRun, setMilesRun] = useState(0)
  const [randomFact, setRandomFact] = useState("Loading fact...")

  useEffect(() => {
    const today = new Date()
    const startOfYear = new Date(today.getFullYear(), 0, 1)
    const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
    setMilesRun(Math.round(dayOfYear * 0.8 + Math.random() * 50))

    const factIndex = dayOfYear % FACTS.length
    setRandomFact(FACTS[factIndex])
  }, [])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const q = gsap.utils.selector(root)

    const ctx = gsap.context(() => {
      const tiles = q('.hobby-tile')
      tiles.forEach((el) => {
        gsap.from(el as Element, {
          scrollTrigger: { trigger: el as Element, start: 'top 85%' },
          y: 30,
          opacity: 0,
          duration: .7,
          ease: 'power3.out'
        })
      })
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section ref={rootRef} className="offtime-section" id="offtime" aria-labelledby="offtime-title">
      <div className="container">
        <h2 id="offtime-title" className="offtime__title"><mark className="hl hl--blue">Off Time </mark></h2>
      </div>

      <div className="hobbies-masonry container">
        {/* Large F1 Tile - Three.js McLaren Model */}
        <article className="hobby-card f1-card">
          <div className="card-icon-corner">
            <Flag size={20} strokeWidth={2} />
          </div>
          <div className="threejs-model-container">
            <F1CarModel />
          </div>
          <div className="card-graphic">
            <div className="racing-car"></div>
            <div className="racing-track"></div>
          </div>
          <div className="card-content">
            <h3>Formula 1</h3>
            <p className="team-name">Team McLaren</p>
            <p>Papaya crew since day one</p>
            <div className="driver-grid">
              <span className="driver-card">LN4</span>
              <span className="driver-card">OP81</span>
            </div>
          </div>
        </article>

        {/* Running Stats Card */}
        <article className="hobby-card running-card">
          <div className="card-icon-corner">
            <PersonStanding size={20} strokeWidth={2} />
          </div>
          <div className="card-content">
            <h3>Running</h3>
            <div className="content-section">
              <div className="stat-highlight">
                <span className="stat-number">58</span>
                <span className="stat-label">miles in September</span>
              </div>
            </div>
            <div className="content-divider"></div>
            <div className="content-section">
              <div className="achievement-item">
                <span className="achievement-label">Personal Best</span>
                <span className="achievement-value">Half Marathon 1:48</span>
                <span className="achievement-location">Newport</span>
              </div>
            </div>
          </div>
        </article>

        {/* Hiking Adventure Card */}
        <article className="hobby-card hiking-card">
          <div className="card-icon-corner">
            <Mountain size={20} strokeWidth={2} />
          </div>
          <div className="card-content">
            <h3>Mountain Adventures</h3>
            <div className="mountain-profile">
              <div className="elevation-chart">
                <div className="mountain-peak-art">
                  <div className="peak-outline">
                    <div className="summit-point"></div>
                    <div className="peak-face left-face"></div>
                    <div className="peak-face right-face"></div>
                  </div>
                  <div className="elevation-marker">
                    <span className="elevation-line"></span>
                    <span className="elevation-text">6,288 ft</span>
                  </div>
                  <div className="mountain-name-overlay">Mt. Washington</div>
                </div>
              </div>
            </div>
            <div className="content-section">
              <div className="status-item">
                <span className="status-label">Last Conquered</span>
                <span className="status-value conquered-mountain">Mt. Washington</span>
              </div>
            </div>
            <div className="content-divider"></div>
            <div className="content-section">
              <div className="status-item">
                <span className="status-label">Up Next</span>
                <span className="status-value">Mist Trail, Nevada</span>
              </div>
            </div>
          </div>
        </article>

        {/* Gaming Card */}
        <article className="hobby-card gaming-card">
          <div className="card-icon-corner">
            <Gamepad2 size={20} strokeWidth={2} />
          </div>
          <div className="card-content">
            <h3>Gaming</h3>
            <div className="content-section">
              <span className="section-label">Currently Playing</span>
            </div>
          </div>
          <div className="gaming-images">
            <div className="game-item-with-image">
              <img src={`${import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL}/assets/godOfWar.jpg.avif`} alt="God of War: Ragnarok" loading="lazy" />
              <span className="game-title">God of War: Ragnarok</span>
            </div>
            <div className="game-item-with-image">
              <img src={`${import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL}/assets/stardewValley.avif`} alt="Stardew Valley" loading="lazy" />
              <span className="game-title">Stardew Valley</span>
            </div>
          </div>
        </article>

        {/* Coffee Card */}
        <article className="hobby-card coffee-card">
          <div className="card-icon-corner">
            <Coffee size={20} strokeWidth={2} />
          </div>
          <div className="card-content">
            <h3>Coffee</h3>
            <div className="content-section">
              <div className="preference-tag">Matcha all the way!</div>
              <span className="quest-text">On the hunt for the best matcha in LA</span>
            </div>
            <div className="content-divider"></div>
            <div className="content-section">
              <div className="leader-item">
                <span className="leader-label">Current Leader</span>
                <span className="leader-name">Stagger Coffee</span>
                <span className="leader-location">KTown</span>
              </div>
            </div>
          </div>
        </article>

        {/* Daily Fact Card */}
        <article className="hobby-card fact-card">
          <div className="card-icon-corner">
            <Lightbulb size={20} strokeWidth={2} />
          </div>
          <div className="card-content">
            <h3>Daily Fact</h3>
            <p className="fact-content">{randomFact}</p>
          </div>
        </article>

        {/* Music Card */}
        <article className="hobby-card music-card">
          <div className="card-icon-corner">
            <Music size={20} strokeWidth={2} />
          </div>
          <div className="card-content">
            <h3>Music</h3>
            <div className="content-section">
              <span className="section-label">Listening To</span>
              <div className="artists-list">
                <span className="artist-name artist-orange">Cage The Elephant</span>
                <span className="artist-name artist-yellow">Lorde</span>
                <span className="artist-name artist-blue">Radiohead</span>
                <span className="artist-name artist-orange">Cobra Man</span>
                <span className="artist-name artist-yellow">The Smiths</span>
              </div>
            </div>
          </div>
        </article>

        {/* Reading Card */}
        <article className="hobby-card reading-card">
          <div className="card-icon-corner">
            <BookOpen size={20} strokeWidth={2} />
          </div>
          <div className="reading-content-wrapper">
            <div className="reading-text">
              <h3>Reading</h3>
              <div className="content-section">
                <span className="section-label">October Reads</span>
              </div>
              <div className="book-info">
                <div className="book-item">
                  <span className="book-category-label">Fiction</span>
                  <span className="book-title-text">I Who Have Never Known Men</span>
                </div>
                <div className="book-item">
                  <span className="book-category-label">Non-Fiction</span>
                  <span className="book-title-text">What Is Real?: The Unfinished Quest for the Meaning of Quantum Physics</span>
                </div>
              </div>
            </div>
            <div className="reading-images">
              <img src={`${import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL}/assets/iWhoHaveKnownMen.jpg.webp`} alt="I Who Have Never Known Men" loading="lazy" />
              <img src={`${import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL}/assets/whatIsReal.jpg`} alt="What Is Real?" loading="lazy" />
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
