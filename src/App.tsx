import Header from './components/Header'
import About from './components/About'
import Research from './components/Research'
import Experience from './components/Experience'
import OffTime from './components/OffTime'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <CustomCursor />
      <Header />
      <main id="main" tabIndex={-1}>
        <About />
        <Research />

        {/* Experience Intro Banner */}
        <section className="experience-intro-section">
          <div className="experience-intro-banner">
            <h2 className="experience-intro-title">
              Here's what I've been up to <mark className="hl hl--blue">lately</mark>
            </h2>
          </div>
        </section>

        <Experience />
        <OffTime />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
