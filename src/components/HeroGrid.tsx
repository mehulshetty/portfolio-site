import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

// ── Constants ──────────────────────────────────────────────────────────────────

const SNAP_THRESHOLD = 10
const STYLE_INTERVAL = 5000
const STYLE_LERP = 0.035
const SPACE_BG = 0x020210
const MAX_WELLS = 4

// ── Types ──────────────────────────────────────────────────────────────────────

interface TextStyle {
  color: THREE.Color
  emissive: THREE.Color
  emissiveIntensity: number
  metalness: number
  roughness: number
  gridTint: THREE.Color
}

interface OrbDef {
  radius: number
  orbit: number
  eccentricity: number
  inclination: number
  ascNode: number
  speed: number
  phase: number
  color: THREE.Color
  glowColor: THREE.Color
  wellStrength: number
  wellRadius: number
}

interface WellSource {
  x: number
  y: number
  strength: number
  radius: number
}

// ── Config ─────────────────────────────────────────────────────────────────────

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
    cameraPos: mobile ? [0, -3.5, 11] as const : [0, -5, 12] as const,
    bgStarCount: mobile ? 400 : 600,
    fgStarCount: mobile ? 0 : 150,
    starDrift: !mobile,
    orbCount: mobile ? 2 : 3,
    sphereSegs: mobile ? 12 : 24,
  }
}

// ── Style cycling (3 harmonious palettes: cyan, gold, violet) ──────────────────

function makeStyles(): TextStyle[] {
  return [
    { color: new THREE.Color(0xddeeff), emissive: new THREE.Color(0x44ccff),
      emissiveIntensity: 0.5, metalness: 0.2, roughness: 0.4,
      gridTint: new THREE.Color(0.25, 0.4, 0.7) },
    { color: new THREE.Color(0xfff4e0), emissive: new THREE.Color(0xffaa44),
      emissiveIntensity: 0.45, metalness: 0.15, roughness: 0.45,
      gridTint: new THREE.Color(0.55, 0.4, 0.25) },
    { color: new THREE.Color(0xeeddff), emissive: new THREE.Color(0xaa66ff),
      emissiveIntensity: 0.5, metalness: 0.25, roughness: 0.35,
      gridTint: new THREE.Color(0.4, 0.28, 0.6) },
  ]
}

// ── Orb definitions (gold, cyan, violet) ───────────────────────────────────────

const ORB_DEFS: OrbDef[] = [
  { radius: 0.35, orbit: 3.5, eccentricity: 0.15, inclination: 0.3,
    ascNode: 0.8, speed: 0.1, phase: 0,
    color: new THREE.Color(0xffaa44), glowColor: new THREE.Color(0xffcc88),
    wellStrength: 0.5, wellRadius: 1.8 },
  { radius: 0.45, orbit: 5.0, eccentricity: 0.1, inclination: 0.5,
    ascNode: 2.5, speed: 0.06, phase: 2.1,
    color: new THREE.Color(0x44ccff), glowColor: new THREE.Color(0x88eeff),
    wellStrength: 0.8, wellRadius: 2.4 },
  { radius: 0.38, orbit: 7.0, eccentricity: 0.2, inclination: 0.15,
    ascNode: 4.8, speed: 0.04, phase: 4.2,
    color: new THREE.Color(0xaa66ff), glowColor: new THREE.Color(0xcc99ff),
    wellStrength: 0.6, wellRadius: 2.0 },
]

// ── Grid shaders (multi-well) ──────────────────────────────────────────────────

const gridVertexShader = /* glsl */ `
  #define MAX_WELLS 4
  uniform vec2 uWellPos[MAX_WELLS];
  uniform float uWellStrength[MAX_WELLS];
  uniform float uWellRadius[MAX_WELLS];
  uniform int uWellCount;

  varying vec2 vOriginalPos;

  void main() {
    vOriginalPos = position.xy;
    vec3 pos = position;

    for (int i = 0; i < MAX_WELLS; i++) {
      if (i >= uWellCount) break;
      float dx = pos.x - uWellPos[i].x;
      float dy = pos.y - uWellPos[i].y;
      float dist = sqrt(dx * dx + dy * dy);
      float t = clamp(dist / uWellRadius[i], 0.0, 1.0);
      float influence = 1.0 - t * t * (3.0 - 2.0 * t);
      float len = max(dist, 0.001);
      vec2 dir = vec2(dx, dy) / len;
      pos.xy += dir * influence * uWellStrength[i] * 0.4;
      pos.z -= influence * uWellStrength[i];
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const gridFragmentShader = /* glsl */ `
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

    gl_FragColor = vec4(uLineColor, alpha * 0.55 * fade);
  }
`

// ── Gravity well (JS-side, supports multiple sources) ──────────────────────────

function applyWells(
  ox: number, oy: number, oz: number,
  wells: WellSource[],
): [number, number, number] {
  let px = ox, py = oy, pz = oz
  for (const w of wells) {
    const dx = px - w.x
    const dy = py - w.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const t = Math.min(dist / w.radius, 1)
    const influence = 1 - t * t * (3 - 2 * t)
    const len = Math.max(dist, 0.001)
    px += (dx / len) * influence * w.strength * 0.4
    py += (dy / len) * influence * w.strength * 0.4
    pz -= influence * w.strength
  }
  return [px, py, pz]
}

// ── Star texture ───────────────────────────────────────────────────────────────

function createStarTexture(): THREE.Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.15, 'rgba(255,255,255,0.8)')
  grad.addColorStop(0.4, 'rgba(255,255,255,0.3)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

function createStarLayer(
  count: number,
  zMin: number, zMax: number,
  size: number, baseOpacity: number, color: number,
): { points: THREE.Points; speedArr: Float32Array; phaseArr: Float32Array; baseOpacity: number } {
  const positions = new Float32Array(count * 3)
  const speeds = new Float32Array(count)
  const phases = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 44
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30
    positions[i * 3 + 2] = zMin + Math.random() * (zMax - zMin)
    speeds[i] = 0.3 + Math.random() * 0.7
    phases[i] = Math.random() * Math.PI * 2
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const tex = createStarTexture()
  const mat = new THREE.PointsMaterial({
    size, color, transparent: true, opacity: baseOpacity,
    sizeAttenuation: false, map: tex,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })
  return { points: new THREE.Points(geo, mat), speedArr: speeds, phaseArr: phases, baseOpacity }
}

// ── Orb creation (core sphere + detailed sprite glow) ──────────────────────────

function createGlowTexture(r: number, g: number, b: number): THREE.Texture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const cx = size / 2

  // Base radial glow: white-hot center fading to orb color then transparent
  const grad = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.04, 'rgba(255,255,255,0.9)')
  grad.addColorStop(0.08, `rgba(${r},${g},${b},0.8)`)
  grad.addColorStop(0.15, `rgba(${r},${g},${b},0.5)`)
  grad.addColorStop(0.3, `rgba(${r},${g},${b},0.18)`)
  grad.addColorStop(0.5, `rgba(${r},${g},${b},0.06)`)
  grad.addColorStop(0.75, `rgba(${r},${g},${b},0.015)`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  // Subtle light rays (6 spokes) for visual interest
  ctx.globalCompositeOperation = 'lighter'
  const rayCount = 6
  for (let i = 0; i < rayCount; i++) {
    const angle = (i / rayCount) * Math.PI * 2
    ctx.save()
    ctx.translate(cx, cx)
    ctx.rotate(angle)
    const rayGrad = ctx.createLinearGradient(0, 0, cx * 0.85, 0)
    rayGrad.addColorStop(0, `rgba(255,255,255,0.12)`)
    rayGrad.addColorStop(0.3, `rgba(${r},${g},${b},0.06)`)
    rayGrad.addColorStop(1, `rgba(${r},${g},${b},0)`)
    ctx.fillStyle = rayGrad
    ctx.beginPath()
    ctx.moveTo(0, -2)
    ctx.lineTo(cx * 0.85, -1)
    ctx.lineTo(cx * 0.85, 1)
    ctx.lineTo(0, 2)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  // Soft inner ring for a lens-like quality
  ctx.globalCompositeOperation = 'lighter'
  ctx.beginPath()
  ctx.arc(cx, cx, cx * 0.18, 0, Math.PI * 2)
  const ringGrad = ctx.createRadialGradient(cx, cx, cx * 0.14, cx, cx, cx * 0.22)
  ringGrad.addColorStop(0, `rgba(255,255,255,0)`)
  ringGrad.addColorStop(0.5, `rgba(255,255,255,0.08)`)
  ringGrad.addColorStop(1, `rgba(255,255,255,0)`)
  ctx.fillStyle = ringGrad
  ctx.fill()

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

function createOrb(def: OrbDef, segs: number): { group: THREE.Group; sprite: THREE.Sprite } {
  const group = new THREE.Group()

  // Core sphere with slight size
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
  group.add(new THREE.Mesh(
    new THREE.SphereGeometry(def.radius * 0.25, segs, segs),
    coreMat,
  ))

  // Detailed sprite glow
  const gc = def.glowColor
  const tex = createGlowTexture(
    Math.round(gc.r * 255), Math.round(gc.g * 255), Math.round(gc.b * 255),
  )
  const spriteMat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const sprite = new THREE.Sprite(spriteMat)
  const glowScale = def.radius * 7
  sprite.scale.set(glowScale, glowScale, 1)
  group.add(sprite)

  return { group, sprite }
}

// ── 3D orbit calculation ───────────────────────────────────────────────────────

function computeOrbitPosition(
  def: OrbDef, elapsed: number,
): [number, number, number] {
  const angle = elapsed * def.speed + def.phase
  const r = def.orbit * (1 - def.eccentricity * def.eccentricity) /
            (1 + def.eccentricity * Math.cos(angle))
  const ox = r * Math.cos(angle)
  const oy = r * Math.sin(angle)
  const cosA = Math.cos(def.ascNode)
  const sinA = Math.sin(def.ascNode)
  const cosI = Math.cos(def.inclination)
  const sinI = Math.sin(def.inclination)
  const px = ox * cosA - oy * sinA * cosI
  const py = ox * sinA + oy * cosA * cosI
  const pz = oy * sinI
  return [px, py, pz]
}

// ── Component ──────────────────────────────────────────────────────────────────

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

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile })
    renderer.setSize(cw, ch)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(SPACE_BG, 1)
    container.appendChild(renderer.domElement)

    // ── Stars (two layers) ──
    const bgStars = createStarLayer(cfg.bgStarCount, -3, -0.5, 2.5, 0.9, 0xffffff)
    scene.add(bgStars.points)

    let fgStars: ReturnType<typeof createStarLayer> | null = null
    if (cfg.fgStarCount > 0) {
      fgStars = createStarLayer(cfg.fgStarCount, 1, 5, 3.5, 0.7, 0xccddff)
      scene.add(fgStars.points)
    }

    // ── Grid mesh (multi-well) ──
    const wellPosArr = new Array(MAX_WELLS).fill(null).map(() => new THREE.Vector2(9999, 9999))
    const wellStrArr = new Float32Array(MAX_WELLS)
    const wellRadArr = new Float32Array(MAX_WELLS)

    const planeGeo = new THREE.PlaneGeometry(cfg.gridW, cfg.gridH, cfg.segsX, cfg.segsY)
    const gridMat = new THREE.ShaderMaterial({
      uniforms: {
        uWellPos: { value: wellPosArr },
        uWellStrength: { value: wellStrArr },
        uWellRadius: { value: wellRadArr },
        uWellCount: { value: 0 },
        uGridSpacing: { value: cfg.gridSpacing },
        uLineColor: { value: new THREE.Color(0.3, 0.4, 0.7) },
      },
      vertexShader: gridVertexShader,
      fragmentShader: gridFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    scene.add(new THREE.Mesh(planeGeo, gridMat))

    const hitPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(cfg.gridW * 2, cfg.gridH * 2),
      new THREE.MeshBasicMaterial({ visible: false }),
    )
    scene.add(hitPlane)

    // ── Lighting ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7)
    dirLight.position.set(2, -4, 10)
    scene.add(dirLight)

    // ── Orbs ──
    const activeDefs = ORB_DEFS.slice(0, cfg.orbCount)
    const orbs = activeDefs.map((def, i) => {
      const o = createOrb(def, cfg.sphereSegs)
      // Stagger breathing phase per orb
      const breathPhase = (i / activeDefs.length) * Math.PI * 2
      scene.add(o.group)
      return { ...o, breathPhase }
    })

    // ── Style cycling ──
    const styles = makeStyles()
    let styleIndex = 0
    let targetStyle = styles[0]
    const currentColor = new THREE.Color().copy(targetStyle.color)
    const currentEmissive = new THREE.Color().copy(targetStyle.emissive)
    let currentEmissiveIntensity = targetStyle.emissiveIntensity
    let currentMetalness = targetStyle.metalness
    let currentRoughness = targetStyle.roughness
    const currentGridTint = new THREE.Color().copy(targetStyle.gridTint)
    const styleInterval = setInterval(() => {
      styleIndex = (styleIndex + 1) % styles.length
      targetStyle = styles[styleIndex]
    }, STYLE_INTERVAL)

    // ── 3D text ──
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
          color: currentColor, emissive: currentEmissive,
          emissiveIntensity: currentEmissiveIntensity,
          metalness: currentMetalness, roughness: currentRoughness,
          depthTest: false,
        })
        textMesh = new THREE.Mesh(geo, textMat)
        textMesh.renderOrder = 10
        textMesh.position.z = 0.08
        scene.add(textMesh)
      },
    )

    // ── Reduced motion ──
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ── Mouse tracking ──
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

    const onPointerMove = (e: PointerEvent) => projectToGrid(e.clientX, e.clientY)
    const onPointerLeave = () => { isInside = false }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length) projectToGrid(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onTouchEnd = () => { isInside = false }

    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerleave', onPointerLeave)
    container.addEventListener('touchmove', onTouchMove, { passive: true })
    container.addEventListener('touchend', onTouchEnd)

    // ── Orb position cache (for well sources) ──
    const orbXY: [number, number][] = activeDefs.map(() => [9999, 9999])

    // ── Render loop ──
    let rafId: number
    const clock = new THREE.Clock()

    const tick = () => {
      rafId = requestAnimationFrame(tick)
      const elapsed = clock.getElapsedTime()

      // ── Style lerp ──
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
        gridMat.uniforms.uLineColor.value.copy(currentGridTint)
      }

      if (!reducedMotion) {
        // ── Star drift + twinkle ──
        if (cfg.starDrift) {
          const bgPos = bgStars.points.geometry.attributes.position
          const bgArr = bgPos.array as Float32Array
          for (let i = 0; i < cfg.bgStarCount; i++) {
            bgArr[i * 3 + 2] += 0.001 * bgStars.speedArr[i]
            if (bgArr[i * 3 + 2] > -0.5) bgArr[i * 3 + 2] = -3
          }
          bgPos.needsUpdate = true
        }

        // Star twinkle via opacity oscillation
        const bgMat = bgStars.points.material as THREE.PointsMaterial
        bgMat.opacity = bgStars.baseOpacity * (0.85 + 0.15 * Math.sin(elapsed * 1.2))
        if (fgStars) {
          const fgMat = fgStars.points.material as THREE.PointsMaterial
          fgMat.opacity = fgStars.baseOpacity * (0.8 + 0.2 * Math.sin(elapsed * 0.9 + 1.5))
        }

        // ── Mouse smoothing ──
        if (isInside) {
          if (smoothMouse.distanceTo(targetMouse) > SNAP_THRESHOLD) {
            smoothMouse.copy(targetMouse)
          } else {
            smoothMouse.lerp(targetMouse, cfg.lerpMouse)
          }
        }
        smoothActive += ((isInside ? 1 : 0) - smoothActive) * cfg.lerpActive

        // ── Compute orb orbital positions ──
        activeDefs.forEach((def, i) => {
          const [px, py] = computeOrbitPosition(def, elapsed)
          orbXY[i] = [px, py]
        })

        // ── Build well sources ──
        const wells: WellSource[] = []
        wells.push({
          x: smoothMouse.x, y: smoothMouse.y,
          strength: cfg.wellStrength * smoothActive,
          radius: cfg.wellRadius,
        })
        activeDefs.forEach((def, i) => {
          wells.push({
            x: orbXY[i][0], y: orbXY[i][1],
            strength: def.wellStrength,
            radius: def.wellRadius,
          })
        })

        // ── Update grid shader uniforms ──
        const count = Math.min(wells.length, MAX_WELLS)
        gridMat.uniforms.uWellCount.value = count
        for (let i = 0; i < MAX_WELLS; i++) {
          if (i < count) {
            wellPosArr[i].set(wells[i].x, wells[i].y)
            wellStrArr[i] = wells[i].strength
            wellRadArr[i] = wells[i].radius
          } else {
            wellPosArr[i].set(9999, 9999)
            wellStrArr[i] = 0
            wellRadArr[i] = 1
          }
        }

        // ── Position orbs + breathing glow ──
        activeDefs.forEach((def, i) => {
          const [px, py, orbZ] = computeOrbitPosition(def, elapsed)
          const otherWells = wells.filter((_, wi) => wi !== i + 1)
          const [, , wz] = applyWells(px, py, 0, otherWells)
          const orb = orbs[i]
          orb.group.position.set(px, py, orbZ * 0.3 + wz)

          // Subtle breathing: pulse glow scale and opacity
          const breath = 0.92 + 0.08 * Math.sin(elapsed * 0.8 + orb.breathPhase)
          const baseScale = def.radius * 7
          orb.sprite.scale.set(baseScale * breath, baseScale * breath, 1)
          const sMat = orb.sprite.material as THREE.SpriteMaterial
          sMat.opacity = 0.85 + 0.15 * Math.sin(elapsed * 0.8 + orb.breathPhase + 0.5)
        })

        // ── Text vertex distortion (all wells) ──
        if (textMesh && origPositions) {
          const posAttr = textMesh.geometry.attributes.position
          const a = posAttr.array as Float32Array
          for (let i = 0; i < a.length; i += 3) {
            const [nx, ny, nz] = applyWells(
              origPositions[i], origPositions[i + 1], origPositions[i + 2],
              wells,
            )
            a[i] = nx
            a[i + 1] = ny
            a[i + 2] = nz
          }
          posAttr.needsUpdate = true
          textMesh.geometry.computeVertexNormals()
        }
      }

      renderer.render(scene, camera)
    }
    tick()

    // ── Resize ──
    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // ── Cleanup ──
    return () => {
      clearInterval(styleInterval)
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerleave', onPointerLeave)
      container.removeEventListener('touchmove', onTouchMove)
      container.removeEventListener('touchend', onTouchEnd)

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry.dispose()
          const m = obj.material
          if (Array.isArray(m)) m.forEach((mat) => mat.dispose())
          else m.dispose()
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
