import { JSX } from 'react';
import AuthLayout from '../components/AuthLayout';
import SocialAuthSection from '../components/SocialAuthSection';
import AuthSwitchPrompt from '../components/AuthSwitchPrompt';
import FormSection from './sections/FormSection';
import { ROUTESV2 } from '@/constants';

export default function LoginV2(): JSX.Element {
  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="The world at your fingertips"
      contentClassName="gap-10"
    >
      <FormSection />
      <SocialAuthSection />
      <AuthSwitchPrompt promptText="Don&apos;t have account?" linkText="Register now" to={ROUTESV2.SIGNUP} />
    </AuthLayout>
  );
}
