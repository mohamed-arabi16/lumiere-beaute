import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hasPlaceholder?: boolean;
  placeholderVariant?: 'primary' | 'card' | 'hero';
}

export function Card({
  children,
  className,
  hasPlaceholder = false,
  placeholderVariant = 'card',
}: CardProps) {
  return (
    <article
      className={[
        'rounded-lg overflow-hidden bg-surface-ivory dark:bg-surface-dark-card',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {hasPlaceholder && (
        <div
          className={`placeholder-gradient-${placeholderVariant} placeholder-aspect-card`}
          aria-hidden="true"
        />
      )}
      <div className="p-6">{children}</div>
    </article>
  );
}
