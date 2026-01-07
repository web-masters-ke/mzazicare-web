/**
 * Animation constants and utilities for MzaziCare
 * iOS-inspired spring easing and timing functions
 */

// Spring easing configurations (CSS linear() format)
export const springEasing = {
  // iOS system spring - smooth deceleration
  ios: `linear(
    0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%, 0.721 25.3%,
    0.849 31.5%, 0.937 38.1%, 0.968 41.8%, 0.991 45.7%, 1.006 50%,
    1.015 55%, 1.017 63.4%, 1.001 85.2%, 1
  )`,

  // Bouncy spring - slight overshoot
  bounce: `linear(
    0, 0.004, 0.016, 0.035, 0.063 9.1%, 0.141 13.6%, 0.25, 0.391,
    0.562, 0.765, 1.006 45.5%, 1.094 54.5%, 1.109, 1.102,
    1.078, 1.039 72.7%, 1 81.8%, 0.994, 0.997, 1
  )`,

  // Gentle spring - no overshoot
  gentle: `linear(
    0, 0.019, 0.074 2.4%, 0.168 3.6%, 0.543 8.5%, 0.803 12.2%,
    0.944 15.8%, 1.022 18.5%, 1.076 21.5%, 1.107 25%, 1.111 33.1%,
    1.077 47.1%, 1.038 62.2%, 1.013 77.3%, 1
  )`,
} as const;

// Standard easing functions
export const easing = {
  // Quick response, smooth end
  outExpo: "cubic-bezier(0.16, 1, 0.3, 1)",

  // Smooth in and out
  inOutExpo: "cubic-bezier(0.87, 0, 0.13, 1)",

  // Standard ease out
  out: "cubic-bezier(0.33, 1, 0.68, 1)",

  // Standard ease in
  in: "cubic-bezier(0.32, 0, 0.67, 0)",

  // Standard ease in-out
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
} as const;

// Duration presets in milliseconds
export const durations = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  spring: 600,
  verySlow: 1000,
} as const;

// Animation variants for components
export const animationVariants = {
  fadeUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
  },
} as const;

// CSS animation class names
export const animationClasses = {
  fadeUp: "animate-fade-up",
  fadeIn: "animate-fade-in",
  scaleIn: "animate-scale-in",
  float: "animate-float",
  floatSlow: "animate-float-slow",
  pulseGlow: "animate-pulse-glow",
  shimmer: "animate-shimmer",
  bounceSoft: "animate-bounce-soft",
} as const;
