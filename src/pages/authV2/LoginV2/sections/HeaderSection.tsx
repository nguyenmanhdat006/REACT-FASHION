import React from 'react';

const headerClass = 'flex flex-col items-center gap-4 relative';
const titleClass = 'relative text-black text-3xl font-semibold tracking-tight text-center';
const subtitleClass = 'relative text-black text-base font-normal mt-1 text-center';

const HeaderSection: React.FC = () => (
  <header className={headerClass}>
    <div className="flex flex-col items-center justify-center relative">
      <h1 className={titleClass}>Welcome Back!</h1>
      <p className={subtitleClass}>The world at your fingertips</p>
    </div>
  </header>
);

export default HeaderSection;
