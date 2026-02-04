import React, { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import ExperienceCard from './ExperienceCard'
import IllustrationBox from './IllustrationBox'
import { Database, Brain, Code } from 'lucide-react'

interface ExperienceData {
  company: string
  title: string
  description: string
  backgroundColor: string
  illustrationType: 'data-engineering' | 'ml-research' | 'software-engineering'
}

const experiences: ExperienceData[] = [
  {
    company: 'USC InfoLab',
    title: 'ML Researcher',
    description: 'Developed a transformer-based model for POI prediction, achieving 96% state-of-the-art accuracy. Also led a team using Genomic Deep Learning for Acute Myeloid Leukemia (AML) detection, reaching 92% accuracy.',
    backgroundColor: 'var(--rm-orange)',
    illustrationType: 'ml-research'
  },
  {
    company: 'adMarketplace',
    title: 'Data Engineering Intern',
    description: 'Built a real-time anomaly detection pipeline using Databricks and Spark, reducing false positives. Won the company-wide hackathon by creating an MMOE model that improved ad relevance scoring.',
    backgroundColor: 'var(--rm-blue)',
    illustrationType: 'data-engineering'
  },
  {
    company: 'IBM',
    title: 'Software Engineering Intern',
    description: 'Engineered a collaborative research platform using an LLM to cut source discovery time by 35%. Also developed a secure ticketing application using React and PostgreSQL that resulted in 50% faster checkouts.',
    backgroundColor: 'var(--rm-yellow)',
    illustrationType: 'software-engineering'
  }
]

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const experienceCardRef = useRef<HTMLDivElement>(null)
  const illustrationBox1Ref = useRef<HTMLDivElement>(null)
  const illustrationBox2Ref = useRef<HTMLDivElement>(null)
  const illustrationBox3Ref = useRef<HTMLDivElement>(null)
  const [currentExperience, setCurrentExperience] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize elements and layout
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const experienceCard = experienceCardRef.current
    const illustrationBox1 = illustrationBox1Ref.current
    const illustrationBox2 = illustrationBox2Ref.current
    const illustrationBox3 = illustrationBox3Ref.current

    // Wait for layout to be stable
    const initializeElements = () => {
      // Check if mobile
      const isMobile = window.innerWidth <= 700

      // Set initial styles and positions
      gsap.set(container, { backgroundColor: experiences[0].backgroundColor })

      // On mobile, center card and hide all illustration boxes (using Lucide icons instead)
      if (isMobile) {
        if (experienceCard) {
          gsap.set(experienceCard, {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 1
          })
        }
        if (illustrationBox1) gsap.set(illustrationBox1, { display: 'none' })
        if (illustrationBox2) gsap.set(illustrationBox2, { display: 'none' })
        if (illustrationBox3) gsap.set(illustrationBox3, { display: 'none' })
        setIsInitialized(true)
        return
      }

      // Desktop: Initialize experience card position
      if (experienceCard) {
        gsap.set(experienceCard, {
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 1
        })
      }

      // Initialize illustration boxes with off-screen positions
      // Box 1: Bottom Right (starts off-screen right)
      if (illustrationBox1) {
        gsap.set(illustrationBox1, {
          position: 'absolute',
          right: '-30%',
          bottom: '10%',
          opacity: 0,
          scale: 0.8,
          rotation: 10,
          transformOrigin: 'center center'
        })
      }
      // Box 2: Top Left (starts off-screen left)
      if (illustrationBox2) {
        gsap.set(illustrationBox2, {
          position: 'absolute',
          left: '-30%',
          top: '10%',
          opacity: 0,
          scale: 0.8,
          rotation: -10,
          transformOrigin: 'center center'
        })
      }
      // Box 3: Top Right (starts off-screen right)
      if (illustrationBox3) {
        gsap.set(illustrationBox3, {
          position: 'absolute',
          right: '-30%',
          top: '10%',
          opacity: 0,
          scale: 0.8,
          rotation: 10,
          transformOrigin: 'center center'
        })
      }

      setIsInitialized(true)
    }

    // Check if window is already loaded
    if (document.readyState === 'complete') {
      requestAnimationFrame(() => {
        setTimeout(initializeElements, 300)
      })
    } else {
      const handleLoad = () => {
        requestAnimationFrame(() => {
          setTimeout(initializeElements, 300)
        })
      }
      window.addEventListener('load', handleLoad)
      return () => {
        window.removeEventListener('load', handleLoad)
      }
    }

  }, [])

  // Separate useEffect for ScrollTrigger that waits for initialization
  useEffect(() => {
    if (!isInitialized || !containerRef.current) return

    const container = containerRef.current
    const experienceCard = experienceCardRef.current
    const illustrationBox1 = illustrationBox1Ref.current
    const illustrationBox2 = illustrationBox2Ref.current
    const illustrationBox3 = illustrationBox3Ref.current

    // Simplified scrolling for mobile
    const isMobile = window.innerWidth <= 700
    if (isMobile) {
      const mobileTrigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=600vh',
        pin: true,
        scrub: 2,
        onUpdate: (self) => {
          const progress = self.progress
          let currentPhase = 0
          if (progress > 0.35 && progress <= 0.70) {
            currentPhase = 1
          } else if (progress > 0.70) {
            currentPhase = 2
          }
          setCurrentExperience(currentPhase)

          if (container) {
            gsap.to(container, {
              backgroundColor: experiences[currentPhase].backgroundColor,
              duration: 0.5
            })
          }
        }
      })

      return () => {
        mobileTrigger.kill()
      }
    }

    // Desktop ScrollTrigger setup
    const setupScrollTrigger = () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === container) {
          trigger.kill()
        }
      })

      ScrollTrigger.refresh()

      const mainTrigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=4000vh', // Increased scroll distance for slower pace
        pin: true,
        scrub: 3, // Increased scrub for smoother, heavier feel
        anticipatePin: 1,
        refreshPriority: -1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress

          let currentPhase = 0
          if (progress > 0.35 && progress <= 0.70) {
            currentPhase = 1
          } else if (progress > 0.70) {
            currentPhase = 2
          }

          setCurrentExperience(currentPhase)

          gsap.to(container, {
            backgroundColor: experiences[currentPhase].backgroundColor,
            duration: 1.2,
            ease: 'power2.out'
          })

          handlePhaseTransitions(progress, {
            experienceCard,
            illustrationBox1,
            illustrationBox2,
            illustrationBox3
          })
        },
        onRefresh: () => {
          if (illustrationBox1) {
            gsap.set(illustrationBox1, {
              opacity: 0,
              right: '-30%',
              bottom: '10%',
              scale: 0.8,
              rotation: 10
            })
          }
        }
      })

      return mainTrigger
    }

    const scrollTimer = setTimeout(() => {
      const trigger = setupScrollTrigger()
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 100)
      return trigger
    }, 500)

    return () => {
      clearTimeout(scrollTimer)
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === container) {
          trigger.kill()
        }
      })
    }
  }, [isInitialized])

  const handlePhaseTransitions = (
    progress: number,
    elements: {
      experienceCard: HTMLDivElement | null
      illustrationBox1: HTMLDivElement | null
      illustrationBox2: HTMLDivElement | null
      illustrationBox3: HTMLDivElement | null
    }
  ) => {
    const { experienceCard, illustrationBox1, illustrationBox2, illustrationBox3 } = elements

    // Phase 1: 0% - 35% (adMarketplace)
    if (progress <= 0.35) {
      const phaseProgress = progress / 0.35

      // Card stays relatively centered but breathes slightly
      if (experienceCard) {
        gsap.set(experienceCard, {
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${1 + phaseProgress * 0.05})`
        })
      }

      // Box 1 slides in from right with rotation
      if (illustrationBox1) {
        const slideProgress = Math.min(1, phaseProgress * 2.5) // Faster entry
        gsap.set(illustrationBox1, {
          right: `${-30 + (35 * slideProgress)}%`, // Ends at 5%
          bottom: '10%',
          opacity: slideProgress,
          scale: 0.8 + (0.2 * slideProgress),
          rotation: 10 - (10 * slideProgress) // Rotates to 0
        })
      }

      // Hide others
      if (illustrationBox2) gsap.set(illustrationBox2, { opacity: 0, left: '-30%' })
      if (illustrationBox3) gsap.set(illustrationBox3, { opacity: 0, right: '-30%' })
    }
    // Phase 2: 35% - 70% (USC)
    else if (progress <= 0.70) {
      const phaseProgress = (progress - 0.35) / 0.35

      // Card moves in a curved path to bottom-right
      if (experienceCard) {
        // Bezier-like curve calculation
        const t = phaseProgress
        // Start: 50, 50
        // Control: 60, 40
        // End: 70, 65
        const leftPos = 50 * (1 - t) * (1 - t) + 60 * 2 * (1 - t) * t + 70 * t * t
        const topPos = 50 * (1 - t) * (1 - t) + 40 * 2 * (1 - t) * t + 65 * t * t

        gsap.set(experienceCard, {
          left: `${leftPos}%`,
          top: `${topPos}%`,
          transform: 'translate(-50%, -50%)'
        })
      }

      // Box 1 exits down and right
      if (illustrationBox1) {
        gsap.set(illustrationBox1, {
          right: `${5 - (phaseProgress * 35)}%`,
          bottom: `${10 - (phaseProgress * 20)}%`,
          opacity: 1 - phaseProgress * 2,
          scale: 1 - (0.2 * phaseProgress),
          rotation: phaseProgress * -10
        })
      }

      // Box 2 slides in from left to top-left
      if (illustrationBox2) {
        const slideProgress = Math.min(1, phaseProgress * 2)
        gsap.set(illustrationBox2, {
          left: `${-30 + (35 * slideProgress)}%`, // Ends at 5%
          top: '10%',
          opacity: slideProgress,
          scale: 0.8 + (0.2 * slideProgress),
          rotation: -10 + (10 * slideProgress) // Rotates to 0
        })
      }

      if (illustrationBox3) gsap.set(illustrationBox3, { opacity: 0, right: '-30%' })
    }
    // Phase 3: 70% - 100% (IBM)
    else {
      const phaseProgress = (progress - 0.70) / 0.30

      // Card moves in a curved path to bottom-left
      if (experienceCard) {
        // Start: 70, 65
        // Control: 50, 80
        // End: 30, 65
        const t = phaseProgress
        const leftPos = 70 * (1 - t) * (1 - t) + 50 * 2 * (1 - t) * t + 30 * t * t
        const topPos = 65 * (1 - t) * (1 - t) + 80 * 2 * (1 - t) * t + 65 * t * t

        gsap.set(experienceCard, {
          left: `${leftPos}%`,
          top: `${topPos}%`,
          transform: 'translate(-50%, -50%)'
        })
      }

      if (illustrationBox1) gsap.set(illustrationBox1, { opacity: 0 })

      // Box 2 exits up and left
      if (illustrationBox2) {
        gsap.set(illustrationBox2, {
          left: `${5 - (phaseProgress * 35)}%`,
          top: `${10 - (phaseProgress * 20)}%`,
          opacity: 1 - phaseProgress * 2,
          scale: 1 - (0.2 * phaseProgress),
          rotation: phaseProgress * 10
        })
      }

      // Box 3 slides in from right to top-right
      if (illustrationBox3) {
        const slideProgress = Math.min(1, phaseProgress * 2)
        gsap.set(illustrationBox3, {
          right: `${-30 + (35 * slideProgress)}%`, // Ends at 5%
          top: '10%',
          opacity: slideProgress,
          scale: 0.8 + (0.2 * slideProgress),
          rotation: 10 - (10 * slideProgress)
        })
      }
    }
  }

  // Get icon based on current experience type
  const getIconForExperience = (illustrationType: string) => {
    switch (illustrationType) {
      case 'data-engineering':
        return <Database className="experience-icon" />
      case 'ml-research':
        return <Brain className="experience-icon" />
      case 'software-engineering':
        return <Code className="experience-icon" />
      default:
        return <Code className="experience-icon" />
    }
  }

  const isMobile = window.innerWidth <= 700
  const mobileIcon = isMobile ? getIconForExperience(experiences[currentExperience].illustrationType) : null

  return (
    <section
      ref={containerRef}
      className="experience-section"
      id="experience"
      aria-label="Work Experience"
      style={{ backgroundColor: experiences[0].backgroundColor }}
    >
      <div className="experience-container">
        <ExperienceCard
          ref={experienceCardRef}
          experiences={experiences}
          currentIndex={currentExperience}
        />

        {/* Mobile icon - rendered at section level for screen-level positioning */}
        {mobileIcon && (
          <div className="experience-icon-mobile">
            {mobileIcon}
          </div>
        )}

        <IllustrationBox
          ref={illustrationBox1Ref}
          type="data-engineering"
          className="illustration-box-1"
        />

        <IllustrationBox
          ref={illustrationBox2Ref}
          type="ml-research"
          className="illustration-box-2"
        />

        <IllustrationBox
          ref={illustrationBox3Ref}
          type="software-engineering"
          className="illustration-box-3"
        />
      </div>
    </section>
  )
}