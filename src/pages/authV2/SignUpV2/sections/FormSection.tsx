import { useId, useState, type JSX } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/auth/useAuth';
import TermsAgreement from '../../components/TermsAgreement';
import { FormField } from '../../../../components/FormField';
import { Button } from '@/components/ui/button';

const signUpSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    fullName: z.string().min(2, 'Full name is required'),
    phone: z
      .string()
      .regex(/^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/, 'Invalid Vietnamese phone number')
      .optional()
      .or(z.literal('')),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

const formWrapper = 'flex flex-col items-center justify-center gap-6 relative w-full max-w-xl';
const inputsWrapper = 'flex flex-col items-center gap-4 relative self-stretch w-full';

export default function FormSection(): JSX.Element {
  const fullNameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { signUp, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    await signUp({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      phone: data.phone,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={formWrapper}>
      <div className={inputsWrapper}>
        <FormField id={fullNameId} label="Full name" type="text" placeholder="Your full name" register={register('fullName')} error={errors.fullName} />

        <FormField id={emailId} label="Email" type="email" placeholder="Enter your email" register={register('email')} error={errors.email} autoComplete="email" />

        <FormField id={passwordId} label="Password" type="password" placeholder="Enter your password" register={register('password')} error={errors.password} autoComplete="new-password" showPassword={showPassword} onPasswordToggle={() => setShowPassword(v => !v)} />
        <FormField id={confirmId} label="Confirm password" type="password" placeholder="Confirm your password" register={register('confirmPassword')} error={errors.confirmPassword} autoComplete="new-password" />
        <TermsAgreement checked={acceptedTerms} onCheckedChange={setAcceptedTerms} />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !acceptedTerms}
        className="w-full h-12 rounded-[32px] bg-primary hover:bg-primary/90 text-white text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Signing up...' : 'Create account'}
      </Button>
    </form>
  );
}
