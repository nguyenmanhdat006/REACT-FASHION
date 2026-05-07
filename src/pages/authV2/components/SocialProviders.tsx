import React from 'react';

type Provider = { id: string; label: string; icon: React.ReactNode };

const providers: Provider[] = [
  { id: 'google', label: 'Continue with Google', icon: null },
  { id: 'facebook', label: 'Continue with Facebook', icon: null },
  { id: 'apple', label: 'Continue with Apple', icon: null },
];

const wrapper = 'flex items-center justify-center gap-6 sm:gap-[42px] relative w-full';
const buttonBase = 'flex items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-gray-100';

const SocialProviders: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className={wrapper}>
      {children ? (
        children
      ) : (
        // fallback empty providers (icons can be injected by parent FormSection)
        providers.map((p) => (
          <button key={p.id} type="button" aria-label={p.label} className={buttonBase}>
            {p.icon}
          </button>
        ))
      )}
    </div>
  );
};

export default SocialProviders;
