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
    company: 'adMarketplace',
    title: 'Data Engineering Intern',
    description: 'Built a real-time anomaly detection pipeline using Databricks and Spark, reducing false positives. Won the company-wide hackathon by creating an MMOE model that improved ad relevance scoring.',
    backgroundColor: 'var(--rm-blue)',
    illustrationType: 'data-engineering'
  },
  {
    company: 'University of Southern California',
    title: 'ML Researcher',
    description: 'Developed a transformer-based model for POI prediction, achieving 96% state-of-the-art accuracy. Also led a team using Genomic Deep Learning for Acute Myeloid Leukemia (AML) detection, reaching 92% accuracy.',
    backgroundColor: 'var(--rm-orange)',
    illustrationType: 'ml-research'
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
        if (illustrationBox1) {
          gsap.set(illustrationBox1, { display: 'none' })
        }
        if (illustrationBox2) {
          gsap.set(illustrationBox2, { display: 'none' })
        }
        if (illustrationBox3) {
          gsap.set(illustrationBox3, { display: 'none' })
        }
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

      // Initialize illustration boxes with off-screen positions for dramatic sliding
      if (illustrationBox1) {
        gsap.set(illustrationBox1, {
          position: 'absolute',
          right: '-20%',
          bottom: '6%',
          opacity: 0,
          transform: 'translate(0, 0)',
          left: 'auto',
          top: 'auto'
        })
      }
      if (illustrationBox2) {
        gsap.set(illustrationBox2, {
          position: 'absolute',
          left: '-20%',
          top: '6%',
          opacity: 0,
          transform: 'translate(0, 0)',
          right: 'auto',
          bottom: 'auto'
        })
      }
      if (illustrationBox3) {
        gsap.set(illustrationBox3, {
          position: 'absolute',
          right: '-20%',
          top: '6%',
          opacity: 0,
          transform: 'translate(0, 0)',
          left: 'auto',
          bottom: 'auto'
        })
      }

      setIsInitialized(true)
    }

    // Check if window is already loaded
    if (document.readyState === 'complete') {
      // Page already loaded, initialize immediately with a small delay
      requestAnimationFrame(() => {
        setTimeout(initializeElements, 300)
      })
    } else {
      // Wait for window load event
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
      // Create simpler scroll trigger for mobile that just changes the experience
      const mobileTrigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=600vh',
        pin: true,
        scrub: 2,
        onUpdate: (self) => {
          const progress = self.progress
          // Determine which experience to show based on scroll progress
          let currentPhase = 0
          if (progress > 0.35 && progress <= 0.70) {
            currentPhase = 1
          } else if (progress > 0.70) {
            currentPhase = 2
          }
          setCurrentExperience(currentPhase)

          // Update background color
          if (container) {
            gsap.to(container, {
              backgroundColor: experiences[currentPhase].backgroundColor,
              duration: 0.3
            })
          }
        }
      })

      return () => {
        mobileTrigger.kill()
      }
    }

    // Additional delay to ensure layout is completely stable
    const setupScrollTrigger = () => {
      // Clear any existing ScrollTriggers for this specific container only
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === container) {
          trigger.kill()
        }
      })

      // Refresh ScrollTrigger to recalculate positions
      ScrollTrigger.refresh()

      // Create the main scroll trigger only after everything is ready
      const mainTrigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=3600vh',
        pin: true,
        scrub: 1.5,
        anticipatePin: 1, // Helps with pin calculations
        refreshPriority: -1,
        invalidateOnRefresh: true, // Recalculate on refresh
        onUpdate: (self) => {
          const progress = self.progress

          // Determine current phase based on progress - must match handlePhaseTransitions boundaries
          let currentPhase = 0
          if (progress > 0.35 && progress <= 0.70) {
            currentPhase = 1
          } else if (progress > 0.70) {
            currentPhase = 2
          }

          // Always update current experience to ensure consistency
          setCurrentExperience(currentPhase)

          // Smooth background color transition
          gsap.to(container, {
            backgroundColor: experiences[currentPhase].backgroundColor,
            duration: 0.8,
            ease: 'power2.out'
          })

          // Handle positioning based on progress
          handlePhaseTransitions(progress, {
            experienceCard,
            illustrationBox1,
            illustrationBox2,
            illustrationBox3
          })
        },
        onRefresh: () => {
          // Reset to initial state on refresh
          if (illustrationBox1) {
            gsap.set(illustrationBox1, {
              opacity: 0,
              position: 'absolute',
              right: '-20%',
              bottom: '6%',
              left: 'auto',
              top: 'auto',
              transform: 'translate(0, 0)'
            })
          }
        }
      })

      return mainTrigger
    }

    // Wait for layout to be completely stable before setting up ScrollTrigger
    const scrollTimer = setTimeout(() => {
      const trigger = setupScrollTrigger()

      // Final refresh after setup
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 100)

      return trigger
    }, 500) // Longer delay for initial setup

    return () => {
      clearTimeout(scrollTimer)
      // Only kill ScrollTriggers associated with this component
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

      // Experience card in center
      if (experienceCard) {
        gsap.set(experienceCard, {
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        })
      }

      // First illustration box slides in from off-screen right to bottom right
      if (illustrationBox1) {
        const slideProgress = Math.min(1, phaseProgress * 2)
        gsap.set(illustrationBox1, {
          position: 'absolute',
          right: `${-20 + (26 * slideProgress)}%`, // Slides from -20% to 6%
          bottom: '6%',
          left: 'auto',
          top: 'auto',
          opacity: slideProgress,
          transform: 'translate(0, 0)'
        })
      }

      // Hide other boxes off-screen
      if (illustrationBox2) {
        gsap.set(illustrationBox2, {
          position: 'absolute',
          left: '-20%',
          top: '6%',
          right: 'auto',
          bottom: 'auto',
          opacity: 0,
          transform: 'translate(0, 0)'
        })
      }
      if (illustrationBox3) {
        gsap.set(illustrationBox3, {
          position: 'absolute',
          right: '-20%',
          top: '6%',
          left: 'auto',
          bottom: 'auto',
          opacity: 0,
          transform: 'translate(0, 0)'
        })
      }
    }
    // Phase 2: 35% - 70% (USC)
    else if (progress <= 0.70) {
      const phaseProgress = (progress - 0.35) / 0.35

      // Experience card moves toward bottom right (to avoid overlapping with top-left illustration box)
      if (experienceCard) {
        const leftPos = 50 + (phaseProgress * 25) // Move right instead of left
        const topPos = 50 + (phaseProgress * 25)  // Move down
        gsap.set(experienceCard, {
          left: `${leftPos}%`,
          top: `${topPos}%`,
          transform: 'translate(-50%, -50%)'
        })
      }

      // First box slides out to the right and up
      if (illustrationBox1) {
        gsap.set(illustrationBox1, {
          position: 'absolute',
          right: `${6 - (phaseProgress * 26)}%`, // Slides from 6% to -20%
          bottom: `${6 + phaseProgress * 80}%`, // Also moves up
          left: 'auto',
          top: 'auto',
          opacity: Math.max(0, 1 - phaseProgress * 1.5),
          transform: 'translate(0, 0)'
        })
      }

      // Second box slides in from off-screen left to top left
      if (illustrationBox2) {
        const slideProgress = Math.min(1, phaseProgress * 1.5)
        gsap.set(illustrationBox2, {
          position: 'absolute',
          left: `${-20 + (26 * slideProgress)}%`, // Slides from -20% to 6%
          top: '6%',
          right: 'auto',
          bottom: 'auto',
          opacity: slideProgress,
          transform: 'translate(0, 0)'
        })
      }

      // Third box stays hidden off-screen
      if (illustrationBox3) {
        gsap.set(illustrationBox3, {
          position: 'absolute',
          right: '-20%',
          top: '6%',
          left: 'auto',
          bottom: 'auto',
          opacity: 0,
          transform: 'translate(0, 0)'
        })
      }
    }
    // Phase 3: 70% - 100% (IBM)
    else {
      const phaseProgress = (progress - 0.70) / 0.30

      // Experience card moves to final position (bottom left to balance the layout)
      if (experienceCard) {
        const leftPos = 75 - (phaseProgress * 45) // Move from bottom-right to bottom-left
        const topPos = 75 - (phaseProgress * 15)  // Move up slightly
        gsap.set(experienceCard, {
          left: `${leftPos}%`,
          top: `${topPos}%`,
          transform: 'translate(-50%, -50%)'
        })
      }

      // First box completely hidden off-screen
      if (illustrationBox1) {
        gsap.set(illustrationBox1, {
          position: 'absolute',
          right: '-20%',
          bottom: '6%',
          left: 'auto',
          top: 'auto',
          opacity: 0,
          transform: 'translate(0, 0)'
        })
      }

      // Second box slides out to the left as phase progresses
      if (illustrationBox2) {
        gsap.set(illustrationBox2, {
          position: 'absolute',
          left: `${6 - (phaseProgress * 13)}%`, // Gradually slides left from 6% to -7%
          top: `${6 + phaseProgress * 10}%`,
          right: 'auto',
          bottom: 'auto',
          opacity: Math.max(0.3, 1 - phaseProgress * 0.7), // Fades out gradually
          transform: 'translate(0, 0)'
        })
      }

      // Third box slides in from off-screen right to top right
      if (illustrationBox3) {
        const slideProgress = Math.min(1, phaseProgress * 1.5)
        gsap.set(illustrationBox3, {
          position: 'absolute',
          right: `${-20 + (26 * slideProgress)}%`, // Slides from -20% to 6%
          top: '6%',
          left: 'auto',
          bottom: 'auto',
          opacity: slideProgress,
          transform: 'translate(0, 0)'
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