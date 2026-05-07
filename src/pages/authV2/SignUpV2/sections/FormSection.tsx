import { useId, useState, type JSX } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import HeaderSection from './HeaderSection';
import SocialProviders from '../../components/SocialProviders';
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

const sectionClass = 'flex flex-1 flex-col items-center h-full justify-center gap-6 py-12 px-6 sm:px-12 md:px-20 lg:px-[120px] bg-cover bg-center overflow-y-auto';
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
    <section className={sectionClass}>
      <HeaderSection />

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

      <div className="flex items-center justify-center gap-2 relative self-stretch w-full" aria-label="Alternative login methods">
        <div className="flex-1 h-px bg-gray-300 max-w-[200px]" />
        <span className="text-black text-body-regular px-2">OR</span>
        <div className="flex-1 h-px bg-gray-300 max-w-[200px]" />
      </div>

      <SocialProviders>
        <button type="button" aria-label="Continue with Google" className="flex items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-gray-100"><FcGoogle className="w-6 h-6"/></button>
        <button type="button" aria-label="Continue with Facebook" className="flex items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-gray-100"><FaFacebook className="w-6 h-6 text-[#1877F2]"/></button>
        <button type="button" aria-label="Continue with Apple" className="flex items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-gray-100"><FaApple className="w-6 h-6 text-black"/></button>
      </SocialProviders>

      <div className="flex items-center justify-center gap-1 relative mt-2 text-base">
        <span className="text-body-regular">Already a member?</span>
        <Link to="/v2/login" className="text-primary text-body-regular hover:underline">Login</Link>
      </div>
    </section>
  );
}
