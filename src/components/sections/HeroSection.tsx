import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { TypewriterText } from '../animations/TypewriterText';
import { Button } from '../ui/Button';
import { BodyText } from '../ui/Typography';

export function HeroSection() {
  const { t } = useTranslation('common');
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <motion.section
      ref={sectionRef}
      style={{
        backgroundPositionY: shouldReduceMotion ? '0%' : backgroundY,
        backgroundImage: `url('/hero-bg.jpg')`
      }}
      // -mt-28 sm:-mt-36 cancels the main pt-28/pt-36 so the hero bleeds to the top
      // and the navbar floats over it instead of leaving a white gap.
      className="relative -mt-28 sm:-mt-36 min-h-screen flex flex-col items-center justify-center
                 bg-cover bg-center bg-no-repeat placeholder-gradient-hero overflow-hidden text-center"
    >
      {/* Cinematic gradient overlay — no blur so the image stays crisp */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/42 to-black/72 z-0" />
      {/* Radial vignette on sides */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_40%,rgba(0,0,0,0.38)_100%)] z-0" />

      {/* Ambient glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 -left-1/4 w-[40rem] h-[40rem] bg-mint-leaf-400/30 rounded-full blur-[120px] z-0 pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-1/4 -right-1/4 w-[50rem] h-[50rem] bg-deep-ocean-900/50 rounded-full blur-[140px] z-0 pointer-events-none"
      />

      {/* Content — pt-32 sm:pt-36 clears the floating navbar */}
      <div className="relative z-10 flex flex-col items-center gap-5 max-w-3xl px-6 pt-32 sm:pt-36">
        {/* Ornamental divider — language-agnostic */}
        <div className="flex items-center justify-center gap-2.5 mb-1" aria-hidden="true">
          <div className="h-px w-10 bg-white/30" />
          <div className="w-1 h-1 rounded-full bg-white/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
          <div className="w-1 h-1 rounded-full bg-white/50" />
          <div className="h-px w-10 bg-white/30" />
        </div>

        <div className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-celadon-200/90">
          <TypewriterText
            text={t('home.hero.headline')}
            as="h1"
            className="font-display text-[2.6rem] sm:text-5xl md:text-7xl leading-tight"
          />
        </div>

        <BodyText
          size="lg"
          className="text-white/80 max-w-lg text-center leading-relaxed"
        >
          {t('home.hero.subtitle')}
        </BodyText>

        <div className="flex gap-3 flex-wrap justify-center mt-2">
          <Link to="/services">
            {/*
              Using [background:white] (shorthand) instead of bg-white.
              The CSS `background` shorthand resets background-image to none,
              so it overrides the gradient from variant="primary".
              !text-stormy-teal-950 uses Tailwind's ! (important) modifier to
              override the text-celadon-100 set by the primary variant.
            */}
            <Button
              variant="primary"
              className="[background:white] hover:[background:var(--color-celadon-100)] !text-stormy-teal-950 !border-white/20 shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
            >
              {t('home.hero.cta_primary')}
            </Button>
          </Link>
          <Link to="/services">
            <Button
              variant="ghost"
              className="!border-white/55 !text-white hover:bg-white/10 hover:!border-white/75"
            >
              {t('home.hero.cta_secondary')}
            </Button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
