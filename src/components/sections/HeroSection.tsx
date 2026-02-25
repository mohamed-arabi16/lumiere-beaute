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
      style={{ backgroundPositionY: shouldReduceMotion ? '0%' : backgroundY }}
      className="relative min-h-screen flex flex-col items-center justify-center
                 placeholder-gradient-hero overflow-hidden px-6 text-center"
    >
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl">
        <TypewriterText
          text={t('home.hero.headline')}
          as="h1"
          className="font-display text-5xl md:text-7xl text-white"
        />
        <BodyText
          size="lg"
          className="text-white/85 max-w-xl"
        >
          {t('home.hero.subtitle')}
        </BodyText>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/services">
            <Button variant="primary" className="bg-white text-stormy-teal-950 hover:bg-celadon-100 dark:bg-white dark:text-stormy-teal-950 dark:hover:bg-celadon-100">{t('home.hero.cta_primary')}</Button>
          </Link>
          <Link to="/services">
            <Button variant="ghost" className="border-white/60 text-white hover:bg-white/10 dark:border-white/60 dark:text-white">{t('home.hero.cta_secondary')}</Button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
