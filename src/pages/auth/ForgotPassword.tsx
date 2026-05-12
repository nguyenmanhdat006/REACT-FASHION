import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/constants';

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Forgot Password - React Boilerplate</title>
        <meta name="description" content="Reset your password" />
      </Helmet>
      <div className="max-w-md mx-auto">
        <Card title={t('auth.forgotPassword')}>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Password reset is handled by the backend identity service in this
            project version. Please contact support or use the in-app reset flow
            from your account settings.
          </p>
          <Link to={ROUTES.LOGIN}>
            <Button type="button" variant="default" className="w-full">
              Back to Login
            </Button>
          </Link>

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
