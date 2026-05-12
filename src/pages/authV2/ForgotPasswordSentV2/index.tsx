import { useState, type JSX } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { ROUTESV2 } from '@/constants';
import { useAuth } from '@/hooks/auth/useAuth';
import { Check } from "lucide-react";

const cardWrapper = 'w-full max-w-xl flex flex-col items-center gap-6';
const iconBase = 'w-[100px] h-[100px] rounded-full flex items-center justify-center';

export default function ForgotPasswordSentV2(): JSX.Element {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const { resendForgotPassword } = useAuth();
  const [resendPending, setResendPending] = useState(false);

  const handleResend = async () => {
    if (resendPending) return;
    setResendPending(true);
    try {
      await resendForgotPassword(email);
    } finally {
      setResendPending(false);
    }
  };

  return (
    <AuthLayout
      title="Check your email"
      subtitle=""
      contentClassName="gap-10"
      authHeaderIllustration={false}
    >
      <div className={cardWrapper}>
        <div className={`${iconBase} bg-emerald-50`} aria-hidden="true">
          <span className="flex items-center justify-center text-emerald-600 border-2 border-emerald-600 rounded-full p-2">
            <Check className="w-6 h-6" />
          </span>
        </div>

        <p className="text-center text-gray-600 text-sm leading-6 max-w-md">
          Password reset link has been sent to your email. Please check your
          inbox and follow the instructions to set a new password.
        </p>

        <Link
          to={ROUTESV2.LOGIN}
          className="w-full h-12 rounded-[32px] bg-primary hover:bg-primary/90 text-white text-base font-medium flex items-center justify-center"
        >
          Return to Sign In
        </Link>

        <p className="text-center text-sm text-gray-600">
          Didn&apos;t receive the email?{' '}
          <button
            type="button"
            onClick={() => void handleResend()}
            disabled={resendPending || !email}
            className="font-medium text-primary hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {resendPending ? 'Sending…' : 'Click to resend'}
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
