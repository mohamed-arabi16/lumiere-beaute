import { motion } from 'framer-motion';
import { useDirection } from '../hooks/useDirection';
import { pageTransitionVariants } from '../animations/variants';
import { HeroSection } from '../components/sections/HeroSection';
import { StatsSection } from '../components/sections/StatsSection';
import { ServicesTeaserSection } from '../components/sections/ServicesTeaserSection';
import { AcademyTeaserSection } from '../components/sections/AcademyTeaserSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';

export function HomePage() {
  const { dir } = useDirection();

  return (
    <motion.div
      custom={dir}
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <main>
        <HeroSection />
        <StatsSection />
        <ServicesTeaserSection />
        <AcademyTeaserSection />
        <TestimonialsSection />
      </main>
    </motion.div>
  );
}
