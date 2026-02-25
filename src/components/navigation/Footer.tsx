import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NAV_LINKS = [
  { key: 'nav.home', to: '/' },
  { key: 'nav.services', to: '/services' },
  { key: 'nav.academy', to: '/academy' },
  { key: 'nav.about', to: '/about' },
  { key: 'nav.contact', to: '/contact' },
] as const;

export function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-stormy-teal-950 dark:bg-surface-dark-card text-celadon-100">
      {/* ── Main grid ──────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-8">

        {/* Brand column */}
        <div className="sm:col-span-2 md:col-span-1 space-y-4">
          <Link
            to="/"
            className="inline-block group"
            aria-label="Lumière Beauté — Home"
          >
            <span className="font-display text-2xl tracking-wide text-celadon-100 group-hover:text-white transition-colors duration-200">
              Lumière Beauté
            </span>
            <div className="text-[0.42rem] tracking-[0.26em] uppercase font-body font-semibold text-mint-leaf-400/60 mt-0.5">
              Beauty Studio · Istanbul
            </div>
          </Link>

          <p className="font-body text-sm text-mint-leaf-400/75 leading-relaxed max-w-[26ch]">
            {t('footer.tagline')}
          </p>

          {/* Decorative rule */}
          <div className="flex items-center gap-2 pt-1 opacity-25">
            <div className="h-px w-6 bg-celadon-100" />
            <div className="w-1 h-1 rounded-full bg-celadon-100" />
            <div className="h-px w-6 bg-celadon-100" />
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-display text-base tracking-widest uppercase text-celadon-100/60 mb-5 text-[0.7rem]">
            {t('footer.quick_links')}
          </h3>
          <ul className="space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  to={link.to}
                  className="font-body text-sm text-mint-leaf-400/75 hover:text-celadon-100 transition-colors duration-200 inline-flex items-center gap-1.5 group"
                >
                  <span className="w-0 group-hover:w-2.5 h-px bg-celadon-100/60 transition-all duration-300 overflow-hidden" />
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display text-base tracking-widest uppercase text-celadon-100/60 mb-5 text-[0.7rem]">
            {t('footer.contact_heading')}
          </h3>
          <div className="space-y-2.5 font-body text-sm text-mint-leaf-400/75">
            <p>{t('contact.location.address')}</p>
            <a
              href={`tel:${t('contact.location.phone')}`}
              className="block hover:text-celadon-100 transition-colors duration-200"
            >
              {t('contact.location.phone')}
            </a>
            <a
              href={`mailto:${t('contact.location.email')}`}
              className="block hover:text-celadon-100 transition-colors duration-200"
            >
              {t('contact.location.email')}
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────── */}
      <div className="border-t border-white/8 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[0.7rem] font-body text-mint-leaf-400/50">
          <span>{t('footer.copyright')}</span>
          <span className="flex items-center gap-1.5">
            {t('footer.developed_by')}
            <span className="text-mint-leaf-400/75">{t('footer.developer')}</span>
            <span className="opacity-30">·</span>
            <span className="text-mint-leaf-400/75">{t('footer.developer_company')}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
