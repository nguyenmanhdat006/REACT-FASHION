import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/auth/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/form/Input';
import Card from '@/components/ui/Card';
import { ROUTES } from '@/constants';

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

const SignUp: React.FC = () => {
  const { t } = useTranslation();
  const { signUp } = useAuth();

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
    <>
      <Helmet>
        <title>Sign Up - React Boilerplate</title>
        <meta name="description" content="Create a new account" />
      </Helmet>
      <div className="max-w-md mx-auto">
        <Card title={t('auth.signup')}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              {...register('fullName')}
              error={errors.fullName?.message}
              autoComplete="name"
            />
            <Input
              label="Phone (Optional)"
              type="text"
              {...register('phone')}
              error={errors.phone?.message}
              autoComplete="tel"
            />
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
              autoComplete="new-password"
            />
            <Input
              label="Confirm Password"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              // isLoading={isLoading}
            >
              {t('auth.signup')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth.hasAccount')}{' '}
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
            >
              {t('auth.login')}
            </Link>
          </p>
        </Card>
      </div>
    </>
  );
};

export default SignUp;
