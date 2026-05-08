import React, { useEffect, useState } from 'react';

const bannerWrapper = 'hidden md:flex flex-1 flex-col items-center justify-center p-9';
const bannerInner = 'flex flex-col items-center justify-center h-full w-full bg-primary/10 rounded-2xl p-12 gap-8 overflow-hidden';
const heroImg = 'w-full max-w-[540px] aspect-square object-contain';

const slides = [
  {
    src: '/icons/Group.svg',
    alt: 'Shopping illustration',
    title: 'Everything you need, all in one place',
  },
  {
    src: '/icons/deal.svg',
    alt: 'Relaxed shopping illustration',
    title: 'Fresh picks, delivered with less effort',
  },
  {
    src: '/icons/buy.svg',
    alt: 'Fashion lifestyle illustration',
    title: 'Style that keeps up with your day',
  },
];

const BannerSection: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section aria-label="Promotional illustration" className={bannerWrapper}>
      <div className={bannerInner}>
        <div className="w-full overflow-hidden">
          <div
            className="flex w-full transition-transform duration-700 ease-in-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div key={slide.src} className="min-w-full flex justify-center">
                <img
                  className={heroImg}
                  alt={slide.alt}
                  src={slide.src}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 w-full mt-8">
          <div aria-label="Slide indicator" className="inline-flex items-center gap-1.5">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeSlide ? 'bg-black w-5' : 'bg-gray-300 w-2'
                }`}
              />
            ))}
          </div>
          <p className="text-black text-h5-regular text-center tracking-wide transition-all duration-300 motion-reduce:transition-none">
            {slides[activeSlide].title}
          </p>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
