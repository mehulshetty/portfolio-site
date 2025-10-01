import { forwardRef, useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

type IllustrationType = 'data-engineering' | 'ml-research' | 'software-engineering'

interface IllustrationBoxProps {
  type: IllustrationType
  className?: string
}

const DataEngineeringAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const bars = container.querySelectorAll('.data-bar')
    const numbers = container.querySelectorAll('.data-number')
    const statusDots = container.querySelectorAll('.status-dot')
    const animations: gsap.core.Tween[] = []

    // Animated growing bars
    bars.forEach((bar, index) => {
      animations.push(gsap.to(bar, {
        scaleY: () => 0.3 + Math.random() * 0.7,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.2
      }))
    })

    // Counting numbers
    numbers.forEach((number, index) => {
      const target = [1247, 892, 1653][index]
      animations.push(gsap.to(number, {
        textContent: target,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        snap: { textContent: 1 },
        delay: index * 0.3
      }))
    })

    // Pulsing status dots
    statusDots.forEach((dot, index) => {
      animations.push(gsap.to(dot, {
        scale: 1.4,
        opacity: 1,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.4
      }))
    })

    return () => {
      animations.forEach(anim => anim.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className="art-data-engineering-new">
      <div className="data-dashboard">
        {/* Dashboard title */}
        <div className="dashboard-header">
          <span className="dashboard-icon">📊</span>
          <span className="dashboard-title">Pipeline Monitor</span>
        </div>

        {/* Animated bar chart */}
        <div className="bar-chart">
          <div className="bar-container">
            <div className="data-bar bar-1"></div>
            <span className="bar-label">ETL</span>
          </div>
          <div className="bar-container">
            <div className="data-bar bar-2"></div>
            <span className="bar-label">Clean</span>
          </div>
          <div className="bar-container">
            <div className="data-bar bar-3"></div>
            <span className="bar-label">Load</span>
          </div>
        </div>

        {/* Live metrics */}
        <div className="metrics-panel">
          <div className="metric-item">
            <span className="metric-label">Records/sec</span>
            <span className="data-number number-1">0</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Processed</span>
            <span className="data-number number-2">0</span>K
          </div>
          <div className="metric-item">
            <span className="metric-label">Throughput</span>
            <span className="data-number number-3">0</span>MB/s
          </div>
        </div>

        {/* Status indicators */}
        <div className="status-bar">
          <div className="status-indicator">
            <div className="status-dot dot-1"></div>
            <span>Active</span>
          </div>
          <div className="status-indicator">
            <div className="status-dot dot-2"></div>
            <span>Healthy</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const MLResearchAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const neurons = container.querySelectorAll('.neuron')
    const synapses = container.querySelectorAll('.synapse')
    const accuracyValue = container.querySelector('.accuracy-value')
    const epochValue = container.querySelector('.epoch-value')
    const animations: gsap.core.Tween[] = []

    // Neurons firing sequence
    neurons.forEach((neuron, index) => {
      animations.push(gsap.to(neuron, {
        backgroundColor: '#ff6b35',
        scale: 1.3,
        duration: 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        delay: index * 0.4,
        onStart: () => {
          // Light up synapses when neuron fires
          if (synapses[index]) {
            animations.push(gsap.to(synapses[index], {
              opacity: 1,
              duration: 0.3
            }))
          }
        },
        onComplete: () => {
          if (synapses[index]) {
            animations.push(gsap.to(synapses[index], {
              opacity: 0.3,
              duration: 0.3
            }))
          }
        }
      }))
    })

    // Training metrics animation
    let epoch = 0
    let accuracy = 65
    const trainingTl = gsap.timeline({ repeat: -1, duration: 5 })

    trainingTl.to({}, {
      duration: 5,
      onUpdate: function() {
        const progress = this.progress()
        epoch = Math.floor(progress * 100)
        accuracy = 65 + (progress * 30)

        if (epochValue) epochValue.textContent = epoch.toString()
        if (accuracyValue) accuracyValue.textContent = accuracy.toFixed(1) + '%'
      }
    })

    return () => {
      trainingTl.kill()
      animations.forEach(anim => anim.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className="art-ml-research-new">
      <div className="brain-network">
        {/* Brain visualization */}
        <div className="brain-container">
          <div className="neuron-layer input-layer">
            <div className="neuron"></div>
            <div className="neuron"></div>
            <div className="neuron"></div>
          </div>

          <div className="synapse-layer">
            <svg className="synapse" viewBox="0 0 50 100">
              <line x1="0" y1="20" x2="50" y2="33" stroke="#4A90E2" strokeWidth="2" opacity="0.3"/>
              <line x1="0" y1="50" x2="50" y2="50" stroke="#4A90E2" strokeWidth="2" opacity="0.3"/>
              <line x1="0" y1="80" x2="50" y2="67" stroke="#4A90E2" strokeWidth="2" opacity="0.3"/>
            </svg>
          </div>

          <div className="neuron-layer hidden-layer">
            <div className="neuron"></div>
            <div className="neuron"></div>
          </div>

          <div className="synapse-layer">
            <svg className="synapse" viewBox="0 0 50 100">
              <line x1="0" y1="33" x2="50" y2="50" stroke="#4A90E2" strokeWidth="2" opacity="0.3"/>
              <line x1="0" y1="67" x2="50" y2="50" stroke="#4A90E2" strokeWidth="2" opacity="0.3"/>
            </svg>
          </div>

          <div className="neuron-layer output-layer">
            <div className="neuron"></div>
          </div>
        </div>

        {/* Training status */}
        <div className="training-status">
          <div className="status-item">
            <span className="status-icon">🧠</span>
            <span className="status-text">Training...</span>
          </div>
          <div className="training-metric">
            <span>Epoch: </span>
            <span className="epoch-value">0</span>
          </div>
          <div className="training-metric">
            <span>Accuracy: </span>
            <span className="accuracy-value">65.0%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const SoftwareEngineeringAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const codeLines = container.querySelectorAll('.code-line')
    const branchNodes = container.querySelectorAll('.branch-node')
    const deployStatus = container.querySelector('.deploy-status-text')

    // Typewriter effect for code
    codeLines.forEach((line, index) => {
      const text = line.textContent || ''
      line.textContent = ''

      gsap.to(line, {
        textContent: text,
        duration: 1.5,
        delay: index * 0.5,
        ease: 'none',
        repeat: -1,
        repeatDelay: 3,
        snap: { textContent: 1 },
        onUpdate: function() {
          const currentText = line.textContent || ''
          line.textContent = currentText + (Math.random() > 0.5 ? '_' : '')
        }
      })
    })

    // Git branch merging animation
    branchNodes.forEach((node, index) => {
      gsap.to(node, {
        backgroundColor: '#4CAF50',
        scale: 1.2,
        duration: 0.5,
        delay: index * 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      })
    })

    // Deployment status cycling
    const statuses = ['Building...', 'Testing...', 'Deploying...', 'Live ✓']
    let statusIndex = 0

    const statusTl = gsap.timeline({ repeat: -1, duration: 8 })
    statusTl.to({}, {
      duration: 2,
      onComplete: () => {
        if (deployStatus) {
          deployStatus.textContent = statuses[statusIndex % statuses.length]
          statusIndex++
        }
      },
      repeat: 3
    })

    return () => {
      statusTl.kill()
    }
  }, [])

  return (
    <div ref={containerRef} className="art-software-engineering-new">
      <div className="code-editor">
        {/* Code editor window */}
        <div className="editor-header">
          <div className="editor-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <span className="editor-title">app.tsx</span>
        </div>

        <div className="editor-body">
          <div className="code-line">{'const deploy = () => {'}</div>
          <div className="code-line">{'  build()'}</div>
          <div className="code-line">{'  test()'}</div>
          <div className="code-line">{'}'}</div>
        </div>

        {/* Git workflow */}
        <div className="git-workflow">
          <div className="git-branch">
            <span className="branch-name">main</span>
            <div className="branch-node"></div>
            <div className="branch-line"></div>
            <div className="branch-node"></div>
          </div>
          <div className="merge-arrow">⚡</div>
          <div className="git-branch feature">
            <span className="branch-name">feature</span>
            <div className="branch-node"></div>
          </div>
        </div>

        {/* Deploy status */}
        <div className="deploy-status">
          <span className="deploy-icon">🚀</span>
          <span className="deploy-status-text">Building...</span>
        </div>
      </div>
    </div>
  )
}

const IllustrationBox = forwardRef<HTMLDivElement, IllustrationBoxProps>(
  ({ type, className = '' }, ref) => {
    const renderAnimation = () => {
      switch (type) {
        case 'data-engineering':
          return <DataEngineeringAnimation />
        case 'ml-research':
          return <MLResearchAnimation />
        case 'software-engineering':
          return <SoftwareEngineeringAnimation />
        default:
          return null
      }
    }

    return (
      <div ref={ref} className={`illustration-box ${className}`}>
        <div className="illustration-content">
          {renderAnimation()}
        </div>
      </div>
    )
  }
)

IllustrationBox.displayName = 'IllustrationBox'

export default IllustrationBox