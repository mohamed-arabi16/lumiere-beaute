import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { staggerContainerVariants, staggerItemVariants as baseItemVariants } from '../../animations/variants';

// Re-export so page sections only need to import from this file
export const staggerItemVariants: Variants = baseItemVariants;

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number; // seconds between children; default 0.06
}

/**
 * Stagger orchestrator that cascades animation across direct children.
 * Each child must be a motion element using staggerItemVariants (exported below).
 *
 * Triggers once — content never re-animates on scroll-back.
 *
 * viewport.amount: 0.1 — lower threshold for grids taller than the viewport;
 * stagger starts as soon as the top of the grid becomes visible.
 * viewport.once: true — prevents re-triggering on scroll-back.
 *
 * Default staggerDelay: 0.06s — with 20 cards at 0.06s, the last card
 * begins at 1.14s, within the perceptual ~1s "animated" window.
 *
 * RTL note: CSS dir="rtl" causes grid to flow right-to-left visually.
 * Stagger follows DOM order (left-to-right), so the first DOM card is
 * visually rightmost in Arabic — creating a correct right-to-left cascade.
 * No JavaScript direction logic needed.
 *
 * Usage:
 *   <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 *     {items.map(item => (
 *       <motion.div key={item.id} variants={staggerItemVariants}>
 *         <Card {...item} />
 *       </motion.div>
 *     ))}
 *   </StaggerContainer>
 */
export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.06,
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={staggerContainerVariants(staggerDelay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
