import { JSX } from 'react';
import { Link } from 'react-router-dom';

interface AuthSwitchPromptProps {
  promptText: string;
  linkText: string;
  to: string;
}

export default function AuthSwitchPrompt({ promptText, linkText, to }: AuthSwitchPromptProps): JSX.Element {
  return (
    <div className="flex items-center justify-center gap-1 relative mt-2 text-base">
      <span className="text-body-regular">{promptText}</span>
      <Link to={to} className="text-primary text-body-regular hover:underline">{linkText}</Link>
    </div>
  );
}
