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
    'inline-flex items-center ps-6 pe-6 py-3 font-body text-sm font-medium transition-all duration-300 active:scale-95 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seagrass-500 rounded-full cursor-none';
  const variants = {
    primary:
      'bg-gradient-to-r from-stormy-teal-950 to-deep-ocean-900 text-celadon-100 dark:from-seagrass-600 dark:to-seagrass-500 hover:shadow-[0_6px_24px_rgba(3,102,102,0.45)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed border border-white/5',
    ghost:
      'border border-seagrass-500 text-seagrass-600 hover:bg-seagrass-500/10 hover:border-seagrass-600 hover:shadow-[0_4px_16px_rgba(86,171,145,0.2)] dark:text-seagrass-400 dark:border-seagrass-400 dark:hover:border-mint-leaf-400 disabled:opacity-50 disabled:cursor-not-allowed',
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
