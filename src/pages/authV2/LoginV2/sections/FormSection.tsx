import { useId, useState, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/auth/useAuth';
import HeaderSection from './HeaderSection';
import SocialProviders from '../../components/SocialProviders';
import { FormField } from '../../../../components/FormField';
import { Button } from '@/components/ui/button';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const sectionClass = 'flex flex-1 flex-col items-center h-full justify-center gap-10 py-12 px-6 sm:px-12 md:px-20 lg:px-[120px] bg-cover bg-center overflow-y-auto';
const formWrapper = 'flex flex-col items-center justify-center gap-6 relative w-full max-w-xl';
const inputsWrapper = 'flex flex-col items-center gap-5 relative self-stretch w-full';

export default function FormSection(): JSX.Element {
  const emailId = useId();
  const passwordId = useId();
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <section className={sectionClass}>
      <HeaderSection />

      <form onSubmit={handleSubmit(onSubmit)} className={formWrapper}>
        <div className={inputsWrapper}>
          <FormField
            id={emailId}
            label="Email"
            type="email"
            placeholder="Enter your email"
            register={register('email')}
            error={errors.email}
            autoComplete="email"
          />

          <FormField
            id={passwordId}
            label="Password"
            type="password"
            placeholder="Enter your password"
            register={register('password')}
            error={errors.password}
            autoComplete="current-password"
            showPassword={showPassword}
            onPasswordToggle={() => setShowPassword(v => !v)}
          />

          <div className="relative self-stretch text-right">
            <button type="button" className="text-black text-sm font-medium hover:underline hover:text-primary">Forgot your password?</button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-[32px] bg-primary hover:bg-primary/90 text-white text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging in...' : 'Login'}
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
        <span className="text-body-regular">Don&apos;t have account?</span>
        <Link to="/v2/signup" className="text-primary text-body-regular hover:underline">Register now</Link>
      </div>
    </section>
  );
}
