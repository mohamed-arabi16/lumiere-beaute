import { useInView, animate, motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { StatItem } from '../../types/content';
import { useMediaQuery } from '../../hooks/useMediaQuery';
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
    <div ref={ref} className="flex flex-col items-center gap-3 text-center">
      <span className="font-display text-6xl sm:text-7xl md:text-8xl leading-none text-stormy-teal-950 dark:text-celadon-100 tabular-nums">
        {display}{suffix}
      </span>
      <span className="font-body text-xs tracking-[0.15em] uppercase text-jungle-teal-700 dark:text-mint-leaf-300 font-semibold">
        {label}
      </span>
    </div>
  );
}

export function StatsSection() {
  const { t } = useTranslation('common');
  const stats = t('home.stats', { returnObjects: true }) as StatItem[];
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <FadeInSection>
      <section className="py-16 sm:py-20 px-6 border-y border-seagrass-500/8 dark:border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-10 sm:gap-14">
          {/* Section ornament + heading */}
          <div className="text-center flex flex-col items-center gap-3">
            <div className="flex items-center gap-2" aria-hidden="true">
              <div className="h-px w-8 bg-seagrass-500/35 dark:bg-mint-leaf-400/25" />
              <div className="w-1 h-1 rounded-full bg-seagrass-500/60 dark:bg-mint-leaf-400/50" />
              <div className="h-px w-8 bg-seagrass-500/35 dark:bg-mint-leaf-400/25" />
            </div>
            <Heading level={2} className="text-stormy-teal-950 dark:text-celadon-100">
              {t('home.stats_heading')}
            </Heading>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-seagrass-500/10 dark:divide-white/5 w-full">
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={staggerItemVariants} className="py-8 sm:py-6 sm:px-10 sm:first:ps-0 sm:last:pe-0">
                {isMobile ? (
                  // On mobile: render static values — skips Framer Motion counter animation
                  // which causes forced reflow and reduces Lighthouse mobile performance score
                  <div className="flex flex-col items-center gap-3 text-center">
                    <span className="font-display text-6xl sm:text-7xl md:text-8xl leading-none text-stormy-teal-950 dark:text-celadon-100 tabular-nums">
                      {stat.value.toLocaleString()}{stat.suffix}
                    </span>
                    <span className="font-body text-xs tracking-[0.15em] uppercase text-jungle-teal-700 dark:text-mint-leaf-300 font-semibold">
                      {stat.label}
                    </span>
                  </div>
                ) : (
                  <StatCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                  />
                )}
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </FadeInSection>
  );
}
