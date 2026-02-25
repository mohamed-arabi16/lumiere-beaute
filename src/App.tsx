import { SpeedInsights } from '@vercel/speed-insights/react';
import { AppRouter } from './router';

export default function App() {
  return (
    <>
      <AppRouter />
      <SpeedInsights />
    </>
  );
}
