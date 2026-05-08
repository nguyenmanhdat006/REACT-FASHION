import { JSX } from 'react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

const headerClass = 'flex flex-col items-center gap-4 relative';
const titleClass = 'relative text-h2-semi tracking-tight text-center';
const subtitleClass = 'relative text-black text-body-regular mt-1 text-center';

export default function AuthHeader({ title, subtitle }: AuthHeaderProps): JSX.Element {
  return (
    <header className={headerClass}>
      <div className="flex flex-col items-center justify-center relative">
        <img src="/icons/stuck-at-home.svg" alt="" />
        <h2 className={titleClass}>{title}</h2>
        <p className={subtitleClass}>{subtitle}</p>
      </div>
    </header>
  );
}
