import { JSX } from 'react';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  /** Top illustration shown on Login/SignUp; hidden for condensed flows like password reset */
  showIllustration?: boolean;
}

const headerClass = 'flex flex-col items-center gap-4 relative';
const titleClass = 'relative text-h2-semi tracking-tight text-center';
const subtitleClass = 'relative text-black text-body-regular mt-1 text-center';

export default function AuthHeader({
  title,
  subtitle = '',
  showIllustration = true,
}: AuthHeaderProps): JSX.Element {
  return (
    <header className={headerClass}>
      <div className="flex flex-col items-center justify-center relative gap-2">
        {showIllustration ? (
          <img src="/icons/stuck-at-home.svg" alt="" className="mb-2" />
        ) : null}
        <h2 className={titleClass}>{title}</h2>
        {subtitle ? <p className={subtitleClass}>{subtitle}</p> : null}
      </div>
    </header>
  );
}
