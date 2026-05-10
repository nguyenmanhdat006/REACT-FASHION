import { type JSX } from 'react';
import AuthLayout from '../components/AuthLayout';
import FormSection from './sections/FormSection';
import { Link } from 'react-router-dom';
import { ROUTESV2 } from '@/constants';

export default function ForgotPasswordV2(): JSX.Element {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle=""
      contentClassName="gap-10"
    >
      <FormSection />

      <div className="relative self-stretch text-center">
        <span className="text-gray-600 text-sm">Remember your password? </span>
        <Link
          to={ROUTESV2.LOGIN}
          className="text-black text-sm font-medium hover:underline hover:text-primary"
        >
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}

