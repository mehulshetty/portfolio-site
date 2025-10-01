import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface F1CarModelProps {
  className?: string
}

export default function F1CarModel({ className = '' }: F1CarModelProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    let mounted = true
    let animationId: number | null = null
    let renderer: THREE.WebGLRenderer | null = null

    const initializeScene = () => {
      try {
        const mount = mountRef.current!
        const width = mount.clientWidth || 300
        const height = mount.clientHeight || 200

        // Scene setup
        const scene = new THREE.Scene()
        // Remove background for transparency
        scene.background = null

        // Camera setup
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
        camera.position.set(5, 3, 5)
        camera.lookAt(0, 0, 0)

        // Renderer setup
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true
        })
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap

        mount.appendChild(renderer.domElement)

        // Enhanced lighting for very bright model
        const ambientLight = new THREE.AmbientLight(0xffffff, 3.0)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 3.5)
        directionalLight.position.set(10, 10, 5)
        directionalLight.castShadow = true
        scene.add(directionalLight)

        // Additional fill light for better illumination
        const fillLight = new THREE.DirectionalLight(0xffffff, 2.5)
        fillLight.position.set(-5, 5, -5)
        scene.add(fillLight)

        // Rim light for definition
        const rimLight = new THREE.DirectionalLight(0xffffff, 2.0)
        rimLight.position.set(0, -10, 10)
        scene.add(rimLight)

        // Add bottom light to illuminate underside
        const bottomLight = new THREE.DirectionalLight(0xffffff, 1.8)
        bottomLight.position.set(0, -5, 0)
        scene.add(bottomLight)

        // Add a test cube first
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshStandardMaterial({
          color: 0xff8000,
          metalness: 0.3,
          roughness: 0.4
        })
        const cube = new THREE.Mesh(geometry, material)
        scene.add(cube)

        // Start animation
        const animate = () => {
          if (!mounted) return
          animationId = requestAnimationFrame(animate)

          cube.rotation.x += 0.01
          cube.rotation.y += 0.01

          renderer!.render(scene, camera)
        }
        animate()

        // Load the F1 model
        const loader = new GLTFLoader()
        // Try multiple possible paths
        const basePath = import.meta.env.BASE_URL
        // Remove trailing slash if present and add it explicitly
        const cleanBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
        const modelPath = `${cleanBase}/objects/models/mclaren_35m_2021__www.vecarz.com.glb`

        loader.load(
          modelPath,
          (gltf) => {
            if (!mounted) return

            const model = gltf.scene

            // Remove test cube
            scene.remove(cube)

            // Setup model - center it better to prevent cutoff during rotation
            model.scale.setScalar(1.1)
            model.position.set(0, -0.2, 0)

            model.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true
                child.receiveShadow = true
              }
            })

            scene.add(model)
            setLoading(false)
            setError(null) // Clear any previous errors

            // Enhanced animation with model
            const modelAnimate = () => {
              if (!mounted) return
              animationId = requestAnimationFrame(modelAnimate)

              model.rotation.y += 0.01

              renderer!.render(scene, camera)
            }

            if (animationId) {
              cancelAnimationFrame(animationId)
            }
            modelAnimate()
          },
          undefined, // Progress callback not needed
          (loadError) => {
            setError(`Model loading failed: ${loadError instanceof Error ? loadError.message : 'Unknown error'}`)
            setLoading(false)
          }
        )

        // Resize handler
        const handleResize = () => {
          if (!mount || !renderer || !mounted) return

          const newWidth = mount.clientWidth || 300
          const newHeight = mount.clientHeight || 200

          camera.aspect = newWidth / newHeight
          camera.updateProjectionMatrix()
          renderer.setSize(newWidth, newHeight)
        }

        window.addEventListener('resize', handleResize)

        return () => {
          window.removeEventListener('resize', handleResize)

          if (animationId) {
            cancelAnimationFrame(animationId)
          }

          if (renderer && mount.contains(renderer.domElement)) {
            mount.removeChild(renderer.domElement)
            renderer.dispose()
          }

          // Clean up geometries and materials
          scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.geometry?.dispose()
              if (Array.isArray(object.material)) {
                object.material.forEach(mat => mat.dispose())
              } else {
                object.material?.dispose()
              }
            }
          })
        }

      } catch (err) {
        setError(`Initialization failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setLoading(false)
      }
    }

    const cleanup = initializeScene()

    return () => {
      mounted = false
      cleanup?.()
    }
  }, [])

  return (
    <div className={`f1-model-container ${className}`}>
      <div
        ref={mountRef}
        className="f1-model-mount"
        style={{ width: '100%', height: '100%' }}
      />
      {loading && (
        <div className="f1-model-loading">
          <div className="loading-spinner"></div>
          <span>Loading McLaren...</span>
        </div>
      )}
      {error && (
        <div className="f1-model-error">
          <span>⚠️ {error}</span>
        </div>
      )}
    </div>
  )
}