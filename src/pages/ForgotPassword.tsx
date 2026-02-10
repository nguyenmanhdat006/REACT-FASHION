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

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const { forgotPassword, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await forgotPassword(data.email);
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - React Boilerplate</title>
        <meta name="description" content="Reset your password" />
      </Helmet>
      <div className="max-w-md mx-auto">
        <Card title={t('auth.forgotPassword')}>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('auth.email')}
              type="email"
              {...register('email')}
              error={errors.email?.message}
              autoComplete="email"
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Send Reset Link
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </Card>
      </div>
    </>
  );
};

export default ForgotPassword;
