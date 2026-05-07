import { JSX, ReactNode } from 'react';
import BannerSection from './BannerSection';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps): JSX.Element {
  return (
    <main className="w-full h-screen overflow-hidden bg-white flex">
      <BannerSection />
      {children}
    </main>
  );
}
