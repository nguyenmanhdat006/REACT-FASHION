import { JSX, ReactNode } from 'react';
import BannerSection from './BannerSection';
import AuthHeader from './AuthHeader';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  contentClassName?: string;
  children: ReactNode;
}

const sectionBaseClass = 'flex flex-1 flex-col items-center h-full justify-center py-12 px-6 sm:px-12 md:px-20 lg:px-[120px] bg-cover bg-center overflow-y-auto';

export default function AuthLayout({ title, subtitle, contentClassName = '', children }: AuthLayoutProps): JSX.Element {
  const sectionClassName = [sectionBaseClass, contentClassName].filter(Boolean).join(' ');

  return (
    <main className="w-full h-screen overflow-hidden bg-white flex">
      <BannerSection />
      <section className={sectionClassName}>
        <AuthHeader title={title} subtitle={subtitle} />
        {children}
      </section>
    </main>
  );
}
