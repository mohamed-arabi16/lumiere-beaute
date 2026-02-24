import React from 'react';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}

export function Heading({ level = 2, children, className }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
  const sizes: Record<1 | 2 | 3 | 4, string> = {
    1: 'text-4xl md:text-6xl font-semibold tracking-tight leading-tight',
    2: 'text-3xl md:text-4xl font-semibold tracking-tight leading-snug',
    3: 'text-2xl md:text-3xl font-medium leading-snug',
    4: 'text-xl md:text-2xl font-medium leading-normal',
  };
  return (
    <Tag className={['font-display', sizes[level], className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  );
}

interface BodyTextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'base' | 'lg';
  as?: 'p' | 'span' | 'div';
}

export function BodyText({ children, className, size = 'base', as: Tag = 'p' }: BodyTextProps) {
  const sizes = { sm: 'text-sm', base: 'text-base', lg: 'text-lg' };
  return (
    <Tag className={['font-body', sizes[size], className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  );
}
