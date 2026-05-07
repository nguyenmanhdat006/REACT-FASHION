import React from 'react';

const headerClass = 'flex flex-col items-center gap-4 relative';
const titleClass = 'relative text-h2-semi tracking-tight text-center';
const subtitleClass = 'relative text-black text-body-regular mt-1 text-center';

const HeaderSection: React.FC = () => (
  <header className={headerClass}>
    <div className="flex flex-col items-center justify-center relative">
      <img src="/icons/stuck-at-home.svg" alt="" />
      <h2 className={titleClass}>Create Account</h2>
      <p className={subtitleClass}>Join us and start your journey</p>
    </div>
  </header>
);

export default HeaderSection;
