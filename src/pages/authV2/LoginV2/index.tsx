import { JSX } from 'react';
import BannerSection from './sections/BannerSection';
import FormSection from './sections/FormSection.tsx';

export default function LoginV2(): JSX.Element {
  return (
    <main className="flex max-h-screen w-full overflow-hidden items-center justify-center bg-white p-4">
      <div className="flex w-full max-w-[1512px] min-h-[982px] items-stretch justify-center relative bg-white flex-col md:flex-row overflow-hidden rounded-[32px] shadow-sm">
        <BannerSection />
        <FormSection />
      </div>
    </main>
  );
}
