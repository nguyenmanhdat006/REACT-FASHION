import { JSX, ReactNode } from 'react';
import { SidebarNavigationSection } from '../sections/SidebarNavigationSection';

interface OrderV2LayoutProps {
  children: ReactNode;
}

export default function OrderV2Layout({ children }: OrderV2LayoutProps): JSX.Element {
  return (
    <main className="relative flex min-h-screen items-start justify-center bg-grayscale-50">
      <SidebarNavigationSection />
      {children}
    </main>
  );
}
