import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { FadeInSection } from '../animations/FadeInSection';
import { Heading, BodyText } from '../ui/Typography';
import { Button } from '../ui/Button';

/**
 * ContactFormSection — EmailJS-wired 5-field contact form.
 *
 * State machine: idle | loading | success | error
 * - idle: form visible, submit button enabled
 * - loading: submit button shows "Sending..." text, disabled
 * - success: form hidden, success confirmation shown, fields reset
 * - error: form still visible, error message shown below submit button
 *
 * EmailJS template variable mapping (must match EmailJS dashboard template):
 * - {{from_name}}  ← values.name
 * - {{from_email}} ← values.email
 * - {{phone}}       ← values.phone (optional — not required)
 * - {{service}}    ← values.service
 * - {{message}}    ← values.message
 *
 * Env vars required: VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
 * VITE_ prefix is mandatory — Vite strips non-VITE_ vars from client bundle.
 *
 * WhatsApp CTA uses Button as="a" with target="_blank" rel="noopener noreferrer".
 * Phone from VITE_WHATSAPP_NUMBER env var (digits only, no + prefix).
 */

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormValues {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

function buildWhatsAppURL(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

const inputBase =
  'w-full rounded-xl border border-seagrass-200/50 bg-white/60 px-5 py-3.5 font-body text-sm text-stormy-teal-950 placeholder:text-seagrass-400 focus:border-seagrass-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-seagrass-500/10 dark:border-white/10 dark:bg-surface-dark-card/60 dark:text-celadon-100 dark:placeholder:text-seagrass-500/70 dark:focus:border-seagrass-400 dark:focus:bg-surface-dark-card dark:focus:ring-seagrass-400/10 backdrop-blur-md shadow-sm transition-all duration-300';

export function ContactFormSection() {
  const { t } = useTranslation('common');
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const phone = import.meta.env.VITE_WHATSAPP_NUMBER ?? '905XXXXXXXXX';
  const whatsappHref = buildWhatsAppURL(phone, t('contact.whatsapp_message'));
  const serviceOptions = t('contact.form.service_options', { returnObjects: true }) as string[];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setErrorMessage('');

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: values.name,
          from_email: values.email,
          phone: values.phone,
          service: values.service,
          message: values.message,
        },
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      );
      setStatus('success');
      setValues({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (err) {
      if (err instanceof EmailJSResponseStatus) {
        setErrorMessage(err.text);
      } else {
        setErrorMessage(t('contact.form.error_generic'));
      }
      setStatus('error');
    }
  };

  return (
    <FadeInSection className="py-16 px-6">
      <div className="max-w-xl mx-auto">
        <Heading level={2} className="mb-8 text-center">
          {t('contact.form.heading')}
        </Heading>

        {/* WhatsApp CTA above form */}
        <div className="mb-8 flex justify-center">
          <Button
            as="a"
            variant="primary"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('contact.whatsapp_cta')}
          </Button>
        </div>

        {status === 'success' ? (
          <div className="rounded-sm border border-seagrass-400 bg-seagrass-50 p-8 text-center dark:border-seagrass-600 dark:bg-seagrass-900/20">
            <Heading level={3}>{t('contact.form.success_heading')}</Heading>
            <BodyText className="mt-2 text-jungle-teal-700 dark:text-mint-leaf-400">
              {t('contact.form.success_body')}
            </BodyText>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-1.5 block font-body text-sm font-medium text-stormy-teal-950 dark:text-celadon-100">
                {t('contact.form.name_label')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={values.name}
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block font-body text-sm font-medium text-stormy-teal-950 dark:text-celadon-100">
                {t('contact.form.email_label')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={values.email}
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1.5 block font-body text-sm font-medium text-stormy-teal-950 dark:text-celadon-100">
                {t('contact.form.phone_label')}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
                placeholder={t('contact.form.phone_placeholder')}
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="service" className="mb-1.5 block font-body text-sm font-medium text-stormy-teal-950 dark:text-celadon-100">
                {t('contact.form.service_label')}
              </label>
              <select
                id="service"
                name="service"
                required
                value={values.service}
                onChange={handleChange}
                className={inputBase}
              >
                <option value="" disabled>—</option>
                {serviceOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block font-body text-sm font-medium text-stormy-teal-950 dark:text-celadon-100">
                {t('contact.form.message_label')}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={values.message}
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            {status === 'error' && errorMessage && (
              <BodyText size="sm" className="text-red-600 dark:text-red-400">
                {errorMessage}
              </BodyText>
            )}

            <Button
              variant="primary"
              type="submit"
              disabled={status === 'loading'}
              className="w-full justify-center"
            >
              {status === 'loading' ? t('contact.form.sending') : t('contact.form.submit_cta')}
            </Button>
          </form>
        )}
      </div>
    </FadeInSection>
  );
}
