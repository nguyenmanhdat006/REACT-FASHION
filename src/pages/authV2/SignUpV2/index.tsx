import { JSX } from 'react';
import AuthLayout from '../components/AuthLayout';
import SocialAuthSection from '../components/SocialAuthSection';
import AuthSwitchPrompt from '../components/AuthSwitchPrompt';
import FormSection from './sections/FormSection';
import { ROUTES } from '@/constants';

export default function SignUpV2(): JSX.Element {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join us and start your journey"
      contentClassName="gap-6"
    >
      <FormSection />
      <SocialAuthSection />
      <AuthSwitchPrompt promptText="Already a member?" linkText="Login" to={ROUTES.LOGIN} />
    </AuthLayout>
  );
}
