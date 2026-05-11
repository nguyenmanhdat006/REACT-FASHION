import { type JSX } from 'react';

import { productV2Layout } from './productV2Classes';
import { HomeMainSection } from './sections/HomeMainSection';
import { NavigationMenuSection } from './sections/NavigationMenuSection';

export default function HomeV2(): JSX.Element {
  return (
    <main
      className={productV2Layout.pageRoot}
      aria-label="Home"
    >
      <NavigationMenuSection />
      <HomeMainSection />
    </main>
  );
}
