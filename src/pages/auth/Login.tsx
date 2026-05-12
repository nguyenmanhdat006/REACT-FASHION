import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { useAuth } from '@/hooks/auth/useAuth';
import { Button } from '@/components/ui/button';
import Input from '@/components/form/Input';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/constants';
import { authService } from '@/services/auth/authService';
import { SocialProvider } from '@/types/auth/auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [socialLoginProvider, setSocialLoginProvider] = React.useState<SocialProvider | null>(null);

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

  const handleSocialLogin = (provider: SocialProvider) => {
    setSocialLoginProvider(provider);
    authService.startSocialLogin(provider);
  };

  return (
    <>
      <Helmet>
        <title>Login - React Boilerplate</title>
        <meta name="description" content="Login to your account" />
      </Helmet>
      <div className="max-w-md mx-auto">
        <Card title={t('auth.login')}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('auth.email')}
              type="email"
              {...register('email')}
              error={errors.email?.message}
              autoComplete="email"
            />
            <Input
              label={t('auth.password')}
              type="password"
              {...register('password')}
              error={errors.password?.message}
              autoComplete="current-password"
            />
            <div className="flex items-center justify-between">
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>
            <Button
              type="submit"
              variant="default"
              className="w-full"
              // isLoading={isLoading}
            >
              {t('auth.login')}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                or continue with
              </span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center gap-2"
                onClick={() => handleSocialLogin('google')}
                disabled={socialLoginProvider !== null}
              >
                <FcGoogle className="h-5 w-5" />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center gap-2"
                onClick={() => handleSocialLogin('facebook')}
                disabled={socialLoginProvider !== null}
              >
                <FaFacebook className="h-5 w-5 text-[#1877F2]" />
                Facebook
              </Button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth.noAccount')}{' '}
            <Link
              to={ROUTES.SIGNUP}
              className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
            >
              {t('auth.signup')}
            </Link>
          </p>
        </Card>
      </div>
    </>
  );
};

export default Login;
