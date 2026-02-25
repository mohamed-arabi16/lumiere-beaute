import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { Course } from '../../types/content';
import { FadeInSection } from '../animations/FadeInSection';
import { StaggerContainer, staggerItemVariants } from '../animations/StaggerContainer';
import { Card } from '../ui/Card';
import { Heading, BodyText } from '../ui/Typography';
import { Button } from '../ui/Button';

/**
 * CoursesSection — Academy page section displaying 2 certification courses.
 *
 * Each course card shows: title, description, duration, price, and two CTAs:
 * 1. "Enroll via WhatsApp" — opens wa.me in a new tab with pre-filled message
 * 2. "Book a Consultation" — React Router Link to /contact (NOT <a href>)
 *
 * WhatsApp phone from VITE_WHATSAPP_NUMBER env var (digits only, no + prefix).
 * Message pre-filled from t('academy.enroll_cta') + course title for context.
 *
 * CRITICAL: Internal /contact navigation uses <Link to="/contact"> to preserve
 * AnimatePresence exit animation (locked decision from 04-03).
 */

function buildWhatsAppURL(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function CoursesSection() {
  const { t } = useTranslation('common');
  const courses = t('academy.courses', { returnObjects: true }) as Course[];
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER ?? '905XXXXXXXXX';

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <FadeInSection className="text-center mb-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2" aria-hidden="true">
          <div className="h-px w-8 bg-seagrass-500/35 dark:bg-mint-leaf-400/25" />
          <div className="w-1 h-1 rounded-full bg-seagrass-500/60 dark:bg-mint-leaf-400/50" />
          <div className="h-px w-8 bg-seagrass-500/35 dark:bg-mint-leaf-400/25" />
        </div>
        <Heading level={2}>{t('academy.courses_heading')}</Heading>
      </FadeInSection>

      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 max-w-5xl mx-auto">
        {courses.map((course) => {
          const whatsappMessage = `${t('academy.enroll_cta')}: ${course.title}`;
          return (
            <motion.div key={course.id} variants={staggerItemVariants}>
              <Card
                imageSrc={
                  course.id === 'aesthetic-practitioner'
                    ? '/aesthetic-practitioner-course.jpg'
                    : '/prof-cosmetology-course.jpg'
                }
                imageAlt={course.title}
                className="h-full flex flex-col"
              >
                <Heading level={3}>{course.title}</Heading>
                <BodyText size="sm" className="mt-3 flex-1 text-jungle-teal-700 dark:text-mint-leaf-400">
                  {course.description}
                </BodyText>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center font-body text-xs font-semibold tracking-wide text-seagrass-600 dark:text-mint-leaf-400 bg-seagrass-500/8 dark:bg-seagrass-500/15 px-3 py-1.5 rounded-full">
                    {course.duration}
                  </span>
                  <span className="font-display text-2xl font-semibold text-stormy-teal-950 dark:text-celadon-100">
                    {course.price}
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    as="a"
                    variant="primary"
                    href={buildWhatsAppURL(phone, whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('academy.enroll_cta')}
                  </Button>
                  <Link to="/contact">
                    <Button variant="ghost">{t('academy.contact_cta')}</Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </StaggerContainer>
    </section>
  );
}
