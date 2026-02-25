import React from 'react';

interface ButtonProps {
  variant: 'primary' | 'ghost';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'button' | 'a';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  target?: string;   // for external links opened in new tab
  rel?: string;      // rel="noopener noreferrer" for _blank security
}

export function Button({
  variant,
  children,
  className,
  onClick,
  as: Tag = 'button',
  href,
  type = 'button',
  disabled,
  target,
  rel,
}: ButtonProps) {
  const base =
    'inline-flex items-center ps-6 pe-6 py-3 font-body text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seagrass-500 rounded-sm';
  const variants = {
    primary:
      'bg-stormy-teal-950 text-celadon-100 hover:bg-deep-ocean-900 dark:bg-seagrass-600 dark:hover:bg-seagrass-500 disabled:opacity-50 disabled:cursor-not-allowed',
    ghost:
      'border border-seagrass-500 text-seagrass-600 hover:bg-seagrass-500/10 dark:text-seagrass-400 dark:border-seagrass-400 disabled:opacity-50 disabled:cursor-not-allowed',
  };
  return (
    <Tag
      href={href}
      target={target}
      rel={rel}
      type={Tag === 'button' ? type : undefined}
      onClick={onClick}
      disabled={Tag === 'button' ? disabled : undefined}
      className={[base, variants[variant], className].filter(Boolean).join(' ')}
    >
      {children}
    </Tag>
  );
}
