import { motion } from 'framer-motion';
import { fadeInUpVariants } from '../../animations/variants';

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // seconds; defaults to 0
}

/**
 * Scroll-reveal wrapper that fades and slides content upward into view
 * when scrolled to. Triggers once — content never re-animates on scroll-back.
 *
 * Uses vertical-only (y) animation — no RTL complication.
 * The y-axis has no reading direction, so no custom prop needed.
 *
 * viewport.amount: 0.2 — triggers when 20% of the element is visible.
 * viewport.once: true — prevents re-triggering on scroll-back.
 *
 * Usage:
 *   <FadeInSection className="py-16">
 *     <h2>Section Heading</h2>
 *     <p>Content...</p>
 *   </FadeInSection>
 *
 *   // With delay (seconds):
 *   <FadeInSection delay={0.2}>
 *     <Card />
 *   </FadeInSection>
 */
export function FadeInSection({ children, className, delay = 0 }: FadeInSectionProps) {
  const variants =
    delay > 0
      ? {
          hidden: fadeInUpVariants.hidden,
          visible: {
            ...(fadeInUpVariants.visible as object),
            transition: {
              ...((fadeInUpVariants.visible as { transition?: object }).transition ?? {}),
              delay,
            },
          },
        }
      : fadeInUpVariants;

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
