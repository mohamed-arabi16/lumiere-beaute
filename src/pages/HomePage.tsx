// PHASE 3 VERIFICATION SCAFFOLD — replaced entirely in Phase 4
import { motion } from 'framer-motion';
import { useDirection } from '../hooks/useDirection';
import { pageTransitionVariants } from '../animations/variants';
import { FadeInSection } from '../components/animations/FadeInSection';
import { StaggerContainer, staggerItemVariants } from '../components/animations/StaggerContainer';
import { TypewriterText } from '../components/animations/TypewriterText';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Heading, BodyText } from '../components/ui/Typography';

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
      <main className="min-h-screen bg-surface-ivory dark:bg-surface-dark">
        {/* Hero: TypewriterText + Buttons */}
        <section className="flex flex-col items-center justify-center min-h-screen gap-8 px-6">
          <TypewriterText
            text="Lumiere Beaute"
            as="h1"
            className="font-display text-5xl md:text-7xl text-stormy-teal-950 dark:text-celadon-100 text-center"
          />
          <BodyText size="lg" className="text-jungle-teal-700 dark:text-mint-leaf-300 text-center max-w-md">
            Premium beauty &amp; academy — Istanbul
          </BodyText>
          <div className="flex gap-4 flex-wrap justify-center">
            <Button variant="primary">Book Treatment</Button>
            <Button variant="ghost">View Services</Button>
          </div>
        </section>

        {/* FadeInSection — requires scroll to trigger */}
        <section className="px-6 py-24">
          <FadeInSection className="max-w-2xl mx-auto text-center">
            <Heading level={2} className="text-stormy-teal-950 dark:text-celadon-100 mb-4">
              Phase 3 — FadeInSection
            </Heading>
            <BodyText className="text-jungle-teal-700 dark:text-mint-leaf-400">
              This section fades and slides up into view when scrolled to.
              It will not re-animate on scroll-back (viewport once:true).
            </BodyText>
          </FadeInSection>
        </section>

        {/* Card with gradient placeholder */}
        <section className="px-6 py-12">
          <FadeInSection delay={0.1} className="max-w-sm mx-auto">
            <Card hasPlaceholder={true}>
              <Heading level={3} className="text-stormy-teal-950 dark:text-celadon-100 mb-2">
                Treatment Card
              </Heading>
              <BodyText size="sm" className="text-jungle-teal-700 dark:text-mint-leaf-400">
                Card with gradient placeholder — ready for Phase 4 content.
              </BodyText>
            </Card>
          </FadeInSection>
        </section>

        {/* StaggerContainer — 20 items performance test */}
        <section className="px-6 py-24">
          <FadeInSection className="text-center mb-12">
            <Heading level={2} className="text-stormy-teal-950 dark:text-celadon-100">
              Phase 3 — StaggerContainer (20 items)
            </Heading>
          </FadeInSection>
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {Array.from({ length: 20 }, (_, i) => (
              <motion.div key={i} variants={staggerItemVariants}>
                <div className="bg-surface-dark-card dark:bg-jungle-teal-700 rounded-lg p-4 text-center">
                  <BodyText size="sm" className="text-celadon-100 font-medium">
                    Item {i + 1}
                  </BodyText>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </section>

        <div className="h-32" /> {/* bottom spacer */}
      </main>
    </motion.div>
  );
}
