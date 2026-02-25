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
    <FadeInSection className="py-16 px-6 bg-surface-ivory dark:bg-surface-dark">
      <div className="max-w-xl mx-auto">
        <Heading level={2} className="mb-8 text-center">
          {t('contact.location.heading')}
        </Heading>

        <Card className="space-y-6">
          {/* Address */}
          <div>
            <BodyText size="sm" className="font-medium text-stormy-teal-950 dark:text-celadon-100">
              {t('contact.location.address')}
            </BodyText>
          </div>

          {/* Phone + Email */}
          <div className="space-y-1">
            <BodyText size="sm" className="text-seagrass-600 dark:text-seagrass-400">
              {t('contact.location.phone')}
            </BodyText>
            <BodyText size="sm" className="text-seagrass-600 dark:text-seagrass-400">
              {t('contact.location.email')}
            </BodyText>
          </div>

          {/* Business Hours */}
          <div>
            <BodyText size="sm" className="mb-3 font-medium text-stormy-teal-950 dark:text-celadon-100">
              {t('contact.location.hours_heading')}
            </BodyText>
            <dl className="space-y-2">
              {hours.map((entry) => (
                <div key={entry.days} className="flex justify-between gap-4">
                  <dt className="font-body text-sm text-jungle-teal-700 dark:text-mint-leaf-400">
                    {entry.days}
                  </dt>
                  <dd className="font-body text-sm text-stormy-teal-950 dark:text-celadon-100">
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
