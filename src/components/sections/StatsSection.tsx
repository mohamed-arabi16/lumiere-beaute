import { useInView, animate, motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { StatItem } from '../../types/content';
import { FadeInSection } from '../animations/FadeInSection';
import { StaggerContainer, staggerItemVariants } from '../animations/StaggerContainer';
import { Heading } from '../ui/Typography';

interface StatCounterProps {
  target: number;
  suffix: string;
  label: string;
}

function StatCounter({ target, suffix, label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, target, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [isInView, target]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 text-center">
      <span className="font-display text-5xl md:text-6xl text-stormy-teal-950 dark:text-celadon-100">
        {display}{suffix}
      </span>
      <span className="font-body text-sm text-jungle-teal-700 dark:text-mint-leaf-300">
        {label}
      </span>
    </div>
  );
}

export function StatsSection() {
  const { t } = useTranslation('common');
  const stats = t('home.stats', { returnObjects: true }) as StatItem[];

  return (
    <FadeInSection>
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
          <Heading level={2} className="text-stormy-teal-950 dark:text-celadon-100 text-center">
            {t('home.stats_heading')}
          </Heading>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={staggerItemVariants}>
                <StatCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </FadeInSection>
  );
}
