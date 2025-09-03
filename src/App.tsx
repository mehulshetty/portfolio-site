import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Research from './components/Research'
import BuildBetter from './components/BuildBetter'
import Devices from './components/Devices'
import ActionFeatures from './components/ActionFeatures'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <CustomCursor />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Research />
        <BuildBetter />
        <Devices />
        <ActionFeatures />
        <Pricing />
        <Footer />
      </main>
    </>
  )
}
