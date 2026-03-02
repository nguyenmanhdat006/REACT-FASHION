import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { ROUTES } from '@/constants';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { t } = useTranslation();
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
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              {t('auth.login')}
            </Button>
          </form>

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
