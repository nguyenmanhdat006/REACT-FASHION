import { type JSX } from 'react';
import AuthLayout from '../components/AuthLayout';
import FormSection from './sections/FormSection';
import { ROUTES } from '@/constants';
import AuthSwitchPrompt from '../components/AuthSwitchPrompt';

export default function ForgotPasswordV2(): JSX.Element {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle=""
      contentClassName="gap-10"
    >
      <FormSection />
      <AuthSwitchPrompt promptText="Remember your password?" linkText="Sign in" to={ROUTES.LOGIN} />
    </AuthLayout>
  );
}

