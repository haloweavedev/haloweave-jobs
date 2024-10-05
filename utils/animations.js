import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const initAnimations = () => {
  // Header animation
  gsap.to("header", {
    scrollTrigger: {
      start: "top top",
      end: "+=50",
      toggleActions: "play none none reverse"
    },
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    duration: 0.3
  })

  // Animate sections with class 'animate-on-scroll'
  gsap.utils.toArray(".animate-on-scroll").forEach((section, i) => {
    gsap.from(section, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    })
  })
}