import React from 'react';

const headerClass = 'flex flex-col items-center gap-4 relative';
const titleClass = 'relative text-h2-semi tracking-tight text-center';
const subtitleClass = 'relative text-black text-body-regular mt-1 text-center';

const HeaderSection: React.FC = () => (
  <header className={headerClass}>
    <div className="flex flex-col items-center justify-center relative">
      <img src="/icons/stuck-at-home.svg" alt="" />
      <h2 className={titleClass}>Welcome Back!</h2>
      <p className={subtitleClass}>The world at your fingertips</p>
    </div>
  </header>
);

export default HeaderSection;
