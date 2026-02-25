import { motion, AnimatePresence } from 'framer-motion';
import type { Treatment } from '../../types/content';
import { Card } from '../ui/Card';
import { Heading, BodyText } from '../ui/Typography';

interface TreatmentGridProps {
  treatments: Treatment[];
}

export function TreatmentGrid({ treatments }: TreatmentGridProps) {
  return (
    <div className="mt-8">
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatments.map((treatment) => (
            <motion.div
              key={treatment.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
            >
              <Card hasPlaceholder={false} className="h-full flex flex-col gap-3">
                <Heading level={3} className="text-stormy-teal-950 dark:text-celadon-100 text-xl md:text-2xl">
                  {treatment.name}
                </Heading>
                <BodyText size="sm" className="text-jungle-teal-700 dark:text-mint-leaf-400 flex-grow leading-relaxed">
                  {treatment.description}
                </BodyText>
                <div className="flex items-center justify-between gap-4 pt-3 border-t border-seagrass-500/12 dark:border-white/8">
                  <span className="inline-flex items-center gap-1 font-body text-xs font-semibold tracking-wide text-seagrass-600 dark:text-mint-leaf-400 bg-seagrass-500/8 dark:bg-seagrass-500/15 px-3 py-1.5 rounded-full">
                    {treatment.duration}
                  </span>
                  <span className="font-display text-xl font-semibold text-stormy-teal-950 dark:text-celadon-100">
                    {treatment.price}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
