import { forwardRef } from 'react'
import dataEngineeringImg from '../assets/illustrations/data-engineering.png'
import mlResearchImg from '../assets/illustrations/ml-research.png'
import softwareEngineeringImg from '../assets/illustrations/software-engineering.png'

type IllustrationType = 'data-engineering' | 'ml-research' | 'software-engineering'

interface IllustrationBoxProps {
  type: IllustrationType
  className?: string
}

const IllustrationBox = forwardRef<HTMLDivElement, IllustrationBoxProps>(
  ({ type, className = '' }, ref) => {
    const getImageSrc = () => {
      switch (type) {
        case 'data-engineering':
          return dataEngineeringImg
        case 'ml-research':
          return mlResearchImg
        case 'software-engineering':
          return softwareEngineeringImg
        default:
          return ''
      }
    }

    return (
      <div ref={ref} className={`illustration-box ${className}`}>
        <div className="illustration-content">
          <img 
            src={getImageSrc()} 
            alt={`${type.replace('-', ' ')} illustration`}
            className="illustration-image"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))'
            }}
          />
        </div>
      </div>
    )
  }
)

IllustrationBox.displayName = 'IllustrationBox'

export default IllustrationBox