import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { ROUTES } from '@/constants';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Home - React Boilerplate</title>
        <meta name="description" content="Welcome to React Boilerplate" />
      </Helmet>
      <div className="space-y-8">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('common.welcome')} to React Boilerplate
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            A modern, production-ready React + TypeScript boilerplate
          </p>
          <div className="flex justify-center space-x-4">
            <Link to={ROUTES.SIGNUP}>
              <Button variant="primary" size="lg">
                Get Started
              </Button>
            </Link>
            <Link to={ROUTES.ABOUT}>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="⚡ Fast Development" hover>
            <p className="text-gray-600 dark:text-gray-400">
              Built with Vite for lightning-fast development and hot module
              replacement.
            </p>
          </Card>
          <Card title="🔒 Type Safe" hover>
            <p className="text-gray-600 dark:text-gray-400">
              Full TypeScript support with strict type checking for better
              developer experience.
            </p>
          </Card>
          <Card title="🎨 Modern UI" hover>
            <p className="text-gray-600 dark:text-gray-400">
              Tailwind CSS with dark mode support and beautiful, responsive
              components.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Home;
