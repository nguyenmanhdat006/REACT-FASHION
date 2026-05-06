import React from 'react';

const bannerWrapper = 'hidden md:flex flex-1 flex-col items-center justify-center p-9';
const bannerInner = 'flex flex-col items-center justify-center h-full w-full bg-slate-50 rounded-2xl p-12 gap-8';
const heroImg = 'w-full max-w-[540px] aspect-square object-contain';

const carouselDots = ['bg-gray-300 w-2', 'bg-gray-300 w-2', 'bg-black w-5'];

const BannerSection: React.FC = () => {
  return (
    <section aria-label="Promotional illustration" className={bannerWrapper}>
      <div className={bannerInner}>
        <img
          className={heroImg}
          alt="Shopping illustration"
          src="/icons/Group.svg"
        />

        <div className="flex flex-col items-center justify-center gap-6 w-full mt-8">
          <div aria-label="Slide indicator" className="inline-flex items-center gap-1.5">
            {carouselDots.map((dotClassName, index) => (
              <div key={index} className={`h-2 rounded-full transition-all ${dotClassName}`} />
            ))}
          </div>
          <p className="text-black text-xl font-medium text-center tracking-wide">
            Everything you need, all in one place
          </p>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
