import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hasPlaceholder?: boolean;
  placeholderVariant?: 'primary' | 'card' | 'hero';
  imageSrc?: string;
  imageAlt?: string;
}

export function Card({
  children,
  className,
  hasPlaceholder = false,
  placeholderVariant = 'card',
  imageSrc,
  imageAlt,
}: CardProps) {
  return (
    <article
      className={[
        'rounded-2xl overflow-hidden bg-surface-ivory/90 dark:bg-surface-dark-card/80 backdrop-blur-sm border border-seagrass-500/10 dark:border-white/5 hover:border-seagrass-500/35 dark:hover:border-seagrass-500/35 hover:shadow-[0_20px_56px_rgba(3,102,102,0.13)] dark:hover:shadow-[0_20px_56px_rgba(0,0,0,0.55)] hover:-translate-y-2 transition-all duration-500',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {imageSrc ? (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={imageSrc}
            alt={imageAlt || ''}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
      ) : hasPlaceholder ? (
        <div
          className={`placeholder-gradient-${placeholderVariant} placeholder-aspect-card`}
          aria-hidden="true"
        />
      ) : null}
      <div className="p-6">{children}</div>
    </article>
  );
}
