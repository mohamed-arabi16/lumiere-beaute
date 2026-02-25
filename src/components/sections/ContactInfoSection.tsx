import { useTranslation } from 'react-i18next';
import { FadeInSection } from '../animations/FadeInSection';
import { Card } from '../ui/Card';
import { Heading, BodyText } from '../ui/Typography';

/**
 * ContactInfoSection — Static contact details and business hours.
 *
 * Renders address, phone, email, and a business hours list from
 * contact.location locale keys. All content externalized — zero
 * hardcoded strings.
 *
 * Business hours rendered as a definition list for semantic HTML.
 * Each day/hours pair from contact.location.hours array.
 */

interface HoursEntry {
  days: string;
  hours: string;
}

export function ContactInfoSection() {
  const { t } = useTranslation('common');
  const hours = t('contact.location.hours', { returnObjects: true }) as HoursEntry[];

  return (
    <FadeInSection className="py-16 px-6 relative">
      {/* Decorative backdrop for the info section */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-surface-ivory/50 dark:to-surface-dark/50 pointer-events-none" />

      <div className="max-w-xl mx-auto relative z-10">
        <Heading level={2} className="mb-8 text-center text-stormy-teal-950 dark:text-celadon-100">
          {t('contact.location.heading')}
        </Heading>

        <Card hasPlaceholder={false} className="space-y-8 p-8 md:p-10 bg-white/60 dark:bg-surface-dark-card/60 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(3,102,102,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          {/* Address */}
          <div className="flex items-start gap-3 pb-6 border-b border-seagrass-500/10 dark:border-white/5">
            <div className="mt-0.5 w-8 h-8 rounded-full bg-seagrass-500/10 dark:bg-seagrass-500/15 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-seagrass-600 dark:text-mint-leaf-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <BodyText size="sm" className="font-semibold text-seagrass-600 dark:text-mint-leaf-400 uppercase tracking-wider text-xs">
                {t('contact.location.label_address')}
              </BodyText>
              <BodyText size="base" className="font-medium text-stormy-teal-950 dark:text-celadon-100">
                {t('contact.location.address')}
              </BodyText>
            </div>
          </div>

          {/* Phone + Email */}
          <div className="flex flex-col gap-4 pb-6 border-b border-seagrass-500/10 dark:border-white/5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-8 h-8 rounded-full bg-seagrass-500/10 dark:bg-seagrass-500/15 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-seagrass-600 dark:text-mint-leaf-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <BodyText size="sm" className="font-semibold text-seagrass-600 dark:text-mint-leaf-400 uppercase tracking-wider text-xs">
                  {t('contact.location.label_contact')}
                </BodyText>
                <a
                  href={`tel:${t('contact.location.phone')}`}
                  className="font-body text-base text-stormy-teal-950 dark:text-celadon-100 hover:text-seagrass-500 dark:hover:text-mint-leaf-400 transition-colors"
                >
                  {t('contact.location.phone')}
                </a>
                <a
                  href={`mailto:${t('contact.location.email')}`}
                  className="font-body text-base text-stormy-teal-950 dark:text-celadon-100 hover:text-seagrass-500 dark:hover:text-mint-leaf-400 transition-colors"
                >
                  {t('contact.location.email')}
                </a>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-seagrass-500/10 dark:bg-seagrass-500/15 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-seagrass-600 dark:text-mint-leaf-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
                </svg>
              </div>
              <BodyText size="sm" className="font-semibold text-seagrass-600 dark:text-mint-leaf-400 uppercase tracking-wider text-xs">
                {t('contact.location.hours_heading')}
              </BodyText>
            </div>
            <dl className="space-y-3">
              {hours.map((entry) => (
                <div key={entry.days} className="flex justify-between items-center gap-4">
                  <dt className="font-body text-sm font-medium text-jungle-teal-700 dark:text-mint-leaf-300">
                    {entry.days}
                  </dt>
                  <dd className="font-body text-sm text-stormy-teal-950 dark:text-celadon-100 bg-white/50 dark:bg-black/20 px-3 py-1 rounded-full">
                    {entry.hours}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Card>
      </div>
    </FadeInSection>
  );
}
