import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';

/**
 * Page-level lazy imports — each page becomes a separate Vite chunk.
 * This defers Framer Motion component loading until the route is active,
 * reducing the initial bundle transferred on first load.
 */
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const AcademyPage = lazy(() => import('./pages/AcademyPage').then(m => ({ default: m.AcademyPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));

/**
 * Suspense fallback uses the same surface color as the app background
 * to prevent a white flash during chunk loading.
 */
const PageFallback = () => (
  <div className="min-h-screen bg-surface-ivory dark:bg-surface-dark" />
);

export function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={
          <Suspense fallback={<PageFallback />}>
            <HomePage />
          </Suspense>
        } />
        <Route path="services" element={
          <Suspense fallback={<PageFallback />}>
            <ServicesPage />
          </Suspense>
        } />
        <Route path="academy" element={
          <Suspense fallback={<PageFallback />}>
            <AcademyPage />
          </Suspense>
        } />
        <Route path="about" element={
          <Suspense fallback={<PageFallback />}>
            <AboutPage />
          </Suspense>
        } />
        <Route path="contact" element={
          <Suspense fallback={<PageFallback />}>
            <ContactPage />
          </Suspense>
        } />
      </Route>
    </Routes>
  );
}
