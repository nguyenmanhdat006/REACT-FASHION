import { JSX } from 'react';
import AuthLayout from '../components/AuthLayout';
import FormSection from './sections/FormSection';

export default function SignUpV2(): JSX.Element {
  return (
    <AuthLayout>
      <FormSection />
    </AuthLayout>
  );
}
