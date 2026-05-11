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

      <div className="relative flex h-screen min-h-0 flex-1 min-w-0 flex-col items-start overflow-hidden">
        <HomeHeaderSection />

        <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-y-auto p-8">
          {children}
        </div>
      </div>
    </main>
  );
}
