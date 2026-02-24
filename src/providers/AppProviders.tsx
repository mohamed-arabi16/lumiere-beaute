import { type ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { MotionConfig } from 'framer-motion';
import i18n from '../i18n/config';
import { ThemeProvider } from './ThemeProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ThemeProvider>
          <I18nextProvider i18n={i18n}>
            {children}
          </I18nextProvider>
        </ThemeProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}
