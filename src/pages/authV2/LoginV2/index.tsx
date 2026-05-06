import { JSX } from 'react';
import BannerSection from './sections/BannerSection';
import FormSection from './sections/FormSection.tsx';

export default function LoginV2(): JSX.Element {
  return (
    <main className="w-full h-screen overflow-hidden bg-white flex">
      <BannerSection />
      <FormSection />
    </main>
  );
}
