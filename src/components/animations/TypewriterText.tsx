import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const STAGGER_DELAY = 0.04; // 40ms per character — readable but snappy

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER_DELAY },
  },
};

const charVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0 }, // snap-in, pure typewriter feel, no fade
  },
};

interface TypewriterTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

// Arabic Unicode block — per-character spans break the shaping algorithm,
// causing every letter to render in its isolated (disconnected) form.
const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function TypewriterText({ text, className, as = 'h1' }: TypewriterTextProps) {
  const tagMap = {
    h1: motion.h1,
    h2: motion.h2,
    h3: motion.h3,
    p: motion.p,
    span: motion.span,
  } as const;

  const MotionTag = tagMap[as];

  // For Arabic/RTL text render the whole string in one element so the
  // browser's text shaping engine can connect letters correctly.
  if (ARABIC_RE.test(text)) {
    return (
      <MotionTag
        className={className}
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
      >
        {text}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={charVariants}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </MotionTag>
  );
}
