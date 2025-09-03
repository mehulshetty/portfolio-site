import gsapCore from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugin (safe to call multiple times)
gsapCore.registerPlugin(ScrollTrigger)

export const gsap = gsapCore
export { ScrollTrigger }
