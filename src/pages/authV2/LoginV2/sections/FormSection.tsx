import { useId, useState, type JSX } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { FormField } from '../../../../components/FormField';
import { Button } from '@/components/ui/button';
import { ROUTESV2 } from '@/constants';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

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
          <Link
            to={ROUTESV2.FORGOT_PASSWORD}
            className="text-black text-sm font-medium hover:underline hover:text-primary"
          >
            Forgot your password?
          </Link>
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
  );
}
