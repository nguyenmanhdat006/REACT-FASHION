import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { ROUTES } from '@/constants';

const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found</title>
        <meta name="description" content="Page not found" />
      </Helmet>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            {t('pages.notFound')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8">
            {t('pages.notFoundDescription')}
          </p>
          <Link to={ROUTES.HOME}>
            <Button variant="primary">Go Home</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
