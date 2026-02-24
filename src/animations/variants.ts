import type { Variants } from 'framer-motion';

export type TextDir = 'ltr' | 'rtl';

/**
 * RTL-aware slide + fade variants for cinematic page transitions.
 * Use custom={dir} on the motion component to pass the text direction.
 * AnimatePresence preserves the custom value on exiting components,
 * ensuring exit direction matches the language active when the route was entered.
 *
 * The [0.22, 1, 0.36, 1] cubic-bezier is the fast-decelerate luxury easing
 * (editorial standard for premium brand experiences).
 *
 * Usage:
 *   <motion.div
 *     custom={dir}
 *     variants={pageTransitionVariants}
 *     initial="initial"
 *     animate="animate"
 *     exit="exit"
 *     className="min-h-screen"
 *   >
 */
export const pageTransitionVariants: Variants = {
  initial: (dir: TextDir) => ({
    opacity: 0,
    x: dir === 'rtl' ? '-5vw' : '5vw',
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (dir: TextDir) => ({
    opacity: 0,
    x: dir === 'rtl' ? '5vw' : '-5vw',
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/**
 * Opacity-only fade variants for pages where slide transitions are inappropriate.
 * No custom prop required — safe to use without AnimatePresence custom pass-through.
 */
export const pageFadeVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: 'easeIn',
    },
  },
};

/**
 * Vertical fade-up variant for scroll-reveal sections.
 * Used by FadeInSection as the whileInView target.
 * Vertical-only (y) — no RTL complication; vertical axis has no reading direction.
 * The [0.22, 1, 0.36, 1] ease matches the luxury page transition easing.
 */
export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

/**
 * Parent container variant factory for staggered child reveals.
 * Returns variants with staggerChildren + delayChildren configured.
 * Children must use staggerItemVariants (or any variant with 'hidden'/'visible' keys).
 *
 * @param staggerDelay - seconds between each child; 0.06 works for up to 20 cards
 */
export const staggerContainerVariants = (staggerDelay = 0.06): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.05,
    },
  },
});

/**
 * Child item variant for use inside StaggerContainer.
 * Opacity + translateY only — no layout recalculation on any frame.
 */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};
