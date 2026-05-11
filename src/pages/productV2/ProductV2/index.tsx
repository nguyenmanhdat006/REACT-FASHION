import { type JSX } from 'react';

import LayoutV2 from '@/components/layout/LayoutV2';

import { HomeMainSection } from './sections/HomeMainSection';

export default function HomeV2(): JSX.Element {
  return (
    <LayoutV2 aria-label="Home">
      <HomeMainSection />
    </LayoutV2>
  );
}
