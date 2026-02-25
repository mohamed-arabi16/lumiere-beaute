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
                <Heading level={3} className="text-stormy-teal-950 dark:text-celadon-100">
                  {treatment.name}
                </Heading>
                <BodyText size="sm" className="text-jungle-teal-700 dark:text-mint-leaf-400 flex-grow">
                  {treatment.description}
                </BodyText>
                <div className="flex items-center justify-between gap-4 pt-2 border-t border-seagrass-200 dark:border-seagrass-700">
                  <BodyText size="sm" className="text-seagrass-600 dark:text-seagrass-400 font-medium">
                    {treatment.duration}
                  </BodyText>
                  <BodyText size="sm" className="text-stormy-teal-950 dark:text-celadon-100 font-semibold font-display">
                    {treatment.price}
                  </BodyText>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
