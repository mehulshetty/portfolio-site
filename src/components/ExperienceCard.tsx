import React, { forwardRef, useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

interface ExperienceData {
  company: string
  title: string
  description: string
  backgroundColor: string
  illustrationType: 'data-engineering' | 'ml-research' | 'software-engineering'
}

interface ExperienceCardProps {
  experiences: ExperienceData[]
  currentIndex: number
}

const placeholderExperience = {
  company: 'My Experience',
  title: 'Professional Journey',
  description: 'Scroll through this section to explore my professional journey across data engineering, machine learning research, and software development roles.',
  backgroundColor: 'var(--rm-blue)',
  illustrationType: 'data-engineering' as const
}

const ExperienceCard = forwardRef<HTMLDivElement, ExperienceCardProps>(
  ({ experiences, currentIndex }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null)
    const prevIndexRef = useRef(currentIndex)

    useEffect(() => {
      if (currentIndex !== prevIndexRef.current && experiences.length > 0) {
        prevIndexRef.current = currentIndex

        // Animate content change
        if (contentRef.current) {
          gsap.to(contentRef.current, {
            opacity: 0,
            y: 15,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              gsap.to(contentRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
              })
            }
          })
        }
      }
    }, [currentIndex, experiences.length])

    // Use placeholder if no experiences or current index is invalid
    const experience = experiences.length > 0 && currentIndex < experiences.length
      ? experiences[currentIndex]
      : placeholderExperience

    return (
      <div ref={ref} className="experience-card" data-type={experience.illustrationType}>
        <div ref={contentRef} className="experience-content">
          <div className="experience-header">
            <h2 className="experience-company">{experience.company}</h2>
            <h3 className="experience-title">{experience.title}</h3>
          </div>
          <p className="experience-description">{experience.description}</p>
          <div className="experience-indicator">
            <span className="experience-number">
              {experiences.length > 0 ? String(currentIndex + 1).padStart(2, '0') : '00'}
            </span>
            <span className="experience-total">
              / {experiences.length > 0 ? String(experiences.length).padStart(2, '0') : '03'}
            </span>
          </div>
        </div>
      </div>
    )
  }
)

ExperienceCard.displayName = 'ExperienceCard'

export default ExperienceCard