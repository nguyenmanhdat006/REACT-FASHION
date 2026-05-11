import type { JSX, ReactNode } from 'react';

import { HomeHeaderSection } from './HomeHeaderSection';
import { NavigationMenuSection } from './NavigationMenuSection';

export type LayoutV2Props = {
  children: ReactNode;
  'aria-label'?: string;
};

export default function LayoutV2({
  children,
  'aria-label': ariaLabel = 'V2 application',
}: LayoutV2Props): JSX.Element {
  return (
    <main
      className="relative flex h-screen w-screen items-start justify-center bg-gray-50"
      aria-label={ariaLabel}
    >
      <NavigationMenuSection />

      <div className="relative flex w-screen h-screen overflow-hidden flex-col items-start">
        <HomeHeaderSection />

        {children}
      </div>
    </main>
  );
}
