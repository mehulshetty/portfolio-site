import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

const SNAP_THRESHOLD = 10
const STYLE_INTERVAL = 3000
const STYLE_LERP = 0.045

interface TextStyle {
  color: THREE.Color
  emissive: THREE.Color
  emissiveIntensity: number
  metalness: number
  roughness: number
  wireframe: boolean
  gridTint: THREE.Color
}

function makeStyles(): TextStyle[] {
  return [
    { // Solid blue (site brand)
      color: new THREE.Color(0x0c5eff),
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
      metalness: 0.15,
      roughness: 0.5,
      wireframe: false,
      gridTint: new THREE.Color(0.72, 0.76, 0.86),
    },
    { // Matrix green — neon glow on dark
      color: new THREE.Color(0x003311),
      emissive: new THREE.Color(0x00ff88),
      emissiveIntensity: 0.9,
      metalness: 0.0,
      roughness: 0.3,
      wireframe: false,
      gridTint: new THREE.Color(0.3, 0.7, 0.45),
    },
    { // Neon red — code terminal
      color: new THREE.Color(0x1a1a2e),
      emissive: new THREE.Color(0xff6b6b),
      emissiveIntensity: 0.75,
      metalness: 0.2,
      roughness: 0.4,
      wireframe: false,
      gridTint: new THREE.Color(0.75, 0.4, 0.4),
    },
    { // Terminal green — wireframe hacker
      color: new THREE.Color(0x001a00),
      emissive: new THREE.Color(0x00ff41),
      emissiveIntensity: 0.85,
      metalness: 0.0,
      roughness: 0.2,
      wireframe: true,
      gridTint: new THREE.Color(0.25, 0.65, 0.3),
    },
    { // Glitch pink/blue
      color: new THREE.Color(0xff0080),
      emissive: new THREE.Color(0x0080ff),
      emissiveIntensity: 0.5,
      metalness: 0.3,
      roughness: 0.35,
      wireframe: false,
      gridTint: new THREE.Color(0.7, 0.4, 0.75),
    },
    { // Metallic purple — premium
      color: new THREE.Color(0x667eea),
      emissive: new THREE.Color(0x764ba2),
      emissiveIntensity: 0.35,
      metalness: 0.7,
      roughness: 0.15,
      wireframe: false,
      gridTint: new THREE.Color(0.6, 0.5, 0.78),
    },
    { // Warm orange — energetic
      color: new THREE.Color(0xff5a00),
      emissive: new THREE.Color(0xffc800),
      emissiveIntensity: 0.3,
      metalness: 0.1,
      roughness: 0.45,
      wireframe: false,
      gridTint: new THREE.Color(0.8, 0.65, 0.5),
    },
  ]
}

function getConfig(mobile: boolean) {
  return {
    gridW: mobile ? 22 : 28,
    gridH: mobile ? 14 : 18,
    segsX: mobile ? 44 : 112,
    segsY: mobile ? 28 : 72,
    wellRadius: mobile ? 3.5 : 3.0,
    wellStrength: mobile ? 1.2 : 1.5,
    gridSpacing: mobile ? 0.7 : 0.5,
    textSize: mobile ? 1.4 : 2.2,
    lerpMouse: mobile ? 0.12 : 0.1,
    lerpActive: mobile ? 0.08 : 0.06,
    cameraPos: mobile
      ? [0, -3.5, 11] as const
      : [0, -5, 12] as const,
  }
}

const vertexShader = /* glsl */ `
  uniform vec2 uMouse;
  uniform float uRadius;
  uniform float uStrength;
  uniform float uActive;

  varying vec2 vOriginalPos;

  void main() {
    vOriginalPos = position.xy;
    vec3 pos = position;

    float dx = pos.x - uMouse.x;
    float dy = pos.y - uMouse.y;
    float dist = sqrt(dx * dx + dy * dy);

    float t = clamp(dist / uRadius, 0.0, 1.0);
    float influence = 1.0 - t * t * (3.0 - 2.0 * t);

    float len = max(dist, 0.001);
    vec2 dir = vec2(dx, dy) / len;
    pos.xy += dir * influence * uStrength * 0.4 * uActive;
    pos.z -= influence * uStrength * uActive;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uGridSpacing;
  uniform vec3 uLineColor;

  varying vec2 vOriginalPos;

  void main() {
    vec2 coord = vOriginalPos / uGridSpacing;
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = min(grid.x, grid.y);
    float alpha = 1.0 - min(line, 1.0);

    if (alpha < 0.01) discard;

    float fade = 1.0 - max(
      smoothstep(10.0, 14.0, abs(vOriginalPos.x)),
      smoothstep(6.0, 9.0, abs(vOriginalPos.y))
    );

    gl_FragColor = vec4(uLineColor, alpha * 0.45 * fade);
  }
`

function gravityWell(
  ox: number, oy: number, oz: number,
  mx: number, my: number,
  radius: number, strength: number, active: number,
): [number, number, number] {
  const dx = ox - mx
  const dy = oy - my
  const dist = Math.sqrt(dx * dx + dy * dy)
  const t = Math.min(dist / radius, 1)
  const influence = 1 - t * t * (3 - 2 * t)
  const len = Math.max(dist, 0.001)
  return [
    ox + (dx / len) * influence * strength * 0.4 * active,
    oy + (dy / len) * influence * strength * 0.4 * active,
    oz - influence * strength * active,
  ]
}

export default function HeroGrid() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const isMobile = container.clientWidth <= 700
    const cfg = getConfig(isMobile)
    const cw = container.clientWidth
    const ch = container.clientHeight

    // Scene & camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, cw / ch, 0.1, 100)
    camera.position.set(cfg.cameraPos[0], cfg.cameraPos[1], cfg.cameraPos[2])
    camera.lookAt(0, 0, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true })
    renderer.setSize(cw, ch)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // --- Grid mesh ---
    const planeGeo = new THREE.PlaneGeometry(cfg.gridW, cfg.gridH, cfg.segsX, cfg.segsY)
    const gridMat = new THREE.ShaderMaterial({
      uniforms: {
        uMouse: { value: new THREE.Vector2(9999, 9999) },
        uRadius: { value: cfg.wellRadius },
        uStrength: { value: cfg.wellStrength },
        uActive: { value: 0 },
        uGridSpacing: { value: cfg.gridSpacing },
        uLineColor: { value: new THREE.Color(0.72, 0.76, 0.86) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    scene.add(new THREE.Mesh(planeGeo, gridMat))

    // Invisible plane for raycasting (larger than visible grid)
    const hitPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(cfg.gridW * 2, cfg.gridH * 2),
      new THREE.MeshBasicMaterial({ visible: false }),
    )
    scene.add(hitPlane)

    // --- Lighting (for the 3D text) ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.8))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
    dirLight.position.set(2, -4, 10)
    scene.add(dirLight)

    // --- Style cycling ---
    const styles = makeStyles()
    let styleIndex = 0
    let targetStyle = styles[0]
    const currentColor = new THREE.Color().copy(targetStyle.color)
    const currentEmissive = new THREE.Color().copy(targetStyle.emissive)
    let currentEmissiveIntensity = targetStyle.emissiveIntensity
    let currentMetalness = targetStyle.metalness
    let currentRoughness = targetStyle.roughness
    const currentGridTint = new THREE.Color().copy(targetStyle.gridTint)
    let targetWireframe = targetStyle.wireframe
    const styleInterval = setInterval(() => {
      styleIndex = (styleIndex + 1) % styles.length
      targetStyle = styles[styleIndex]
      targetWireframe = targetStyle.wireframe
    }, STYLE_INTERVAL)

    // --- 3D text ---
    let textMesh: THREE.Mesh | null = null
    let textMat: THREE.MeshStandardMaterial | null = null
    let origPositions: Float32Array | null = null

    const fontLoader = new FontLoader()
    fontLoader.load(
      'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/fonts/helvetiker_bold.typeface.json',
      (font) => {
        const geo = new TextGeometry('MEHUL', {
          font,
          size: cfg.textSize,
          depth: isMobile ? 0.08 : 0.15,
          curveSegments: isMobile ? 6 : 12,
          bevelEnabled: false,
        })
        geo.computeBoundingBox()
        geo.center()

        origPositions = new Float32Array(geo.attributes.position.array)

        textMat = new THREE.MeshStandardMaterial({
          color: currentColor,
          emissive: currentEmissive,
          emissiveIntensity: currentEmissiveIntensity,
          metalness: currentMetalness,
          roughness: currentRoughness,
        })
        textMesh = new THREE.Mesh(geo, textMat)
        textMesh.position.z = 0.08
        scene.add(textMesh)
      },
    )

    // --- Reduced motion ---
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // --- Mouse tracking ---
    const targetMouse = new THREE.Vector2(9999, 9999)
    const smoothMouse = new THREE.Vector2(9999, 9999)
    let isInside = false
    let smoothActive = 0
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()

    const projectToGrid = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect()
      ndc.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      )
      raycaster.setFromCamera(ndc, camera)
      const hits = raycaster.intersectObject(hitPlane)
      if (hits.length) {
        targetMouse.set(hits[0].point.x, hits[0].point.y)
        isInside = true
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      projectToGrid(e.clientX, e.clientY)
    }
    const onPointerLeave = () => { isInside = false }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length) {
        projectToGrid(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    const onTouchEnd = () => { isInside = false }

    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerleave', onPointerLeave)
    container.addEventListener('touchmove', onTouchMove, { passive: true })
    container.addEventListener('touchend', onTouchEnd)

    // --- Render loop ---
    let rafId: number

    const tick = () => {
      rafId = requestAnimationFrame(tick)

      // Lerp material style toward current target (always, even in reduced-motion)
      if (textMat) {
        currentColor.lerp(targetStyle.color, STYLE_LERP)
        currentEmissive.lerp(targetStyle.emissive, STYLE_LERP)
        currentEmissiveIntensity += (targetStyle.emissiveIntensity - currentEmissiveIntensity) * STYLE_LERP
        currentMetalness += (targetStyle.metalness - currentMetalness) * STYLE_LERP
        currentRoughness += (targetStyle.roughness - currentRoughness) * STYLE_LERP
        currentGridTint.lerp(targetStyle.gridTint, STYLE_LERP)

        textMat.color.copy(currentColor)
        textMat.emissive.copy(currentEmissive)
        textMat.emissiveIntensity = currentEmissiveIntensity
        textMat.metalness = currentMetalness
        textMat.roughness = currentRoughness
        textMat.wireframe = targetWireframe

        gridMat.uniforms.uLineColor.value.copy(currentGridTint)

        if (!reducedMotion) {
          // Glitch jitter for the pink/blue style (#4)
          if (styleIndex === 4 && textMesh) {
            textMesh.position.x = (Math.random() - 0.5) * 0.04
          } else if (textMesh) {
            textMesh.position.x *= 0.85
          }
        }
      }

      if (!reducedMotion) {
        // Smooth mouse position
        if (isInside) {
          if (smoothMouse.distanceTo(targetMouse) > SNAP_THRESHOLD) {
            smoothMouse.copy(targetMouse)
          } else {
            smoothMouse.lerp(targetMouse, cfg.lerpMouse)
          }
        }
        smoothActive += ((isInside ? 1 : 0) - smoothActive) * cfg.lerpActive

        // Grid uniforms
        gridMat.uniforms.uMouse.value.copy(smoothMouse)
        gridMat.uniforms.uActive.value = smoothActive

        // Distort text vertices
        if (textMesh && origPositions && smoothActive > 0.001) {
          const posAttr = textMesh.geometry.attributes.position
          const arr = posAttr.array as Float32Array
          const mx = smoothMouse.x
          const my = smoothMouse.y
          for (let i = 0; i < arr.length; i += 3) {
            const [nx, ny, nz] = gravityWell(
              origPositions[i],
              origPositions[i + 1],
              origPositions[i + 2],
              mx, my,
              cfg.wellRadius, cfg.wellStrength, smoothActive,
            )
            arr[i] = nx
            arr[i + 1] = ny
            arr[i + 2] = nz
          }
          posAttr.needsUpdate = true
          textMesh.geometry.computeVertexNormals()
        }
      }

      renderer.render(scene, camera)
    }
    tick()

    // --- Resize ---
    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // --- Cleanup ---
    return () => {
      clearInterval(styleInterval)
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerleave', onPointerLeave)
      container.removeEventListener('touchmove', onTouchMove)
      container.removeEventListener('touchend', onTouchEnd)

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose())
          } else {
            obj.material.dispose()
          }
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="hero-grid-canvas" />
}
