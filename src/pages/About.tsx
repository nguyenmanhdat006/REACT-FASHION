import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Card from '@/components/Card';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>About - React Boilerplate</title>
        <meta name="description" content="About React Boilerplate" />
      </Helmet>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('pages.about')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Learn more about this boilerplate
          </p>
        </div>

        <Card title="Features">
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>✅ React 18 + TypeScript</li>
            <li>✅ Vite for fast development</li>
            <li>✅ Redux Toolkit for state management</li>
            <li>✅ React Router v6 for routing</li>
            <li>✅ Tailwind CSS with dark mode</li>
            <li>✅ Authentication with JWT</li>
            <li>✅ React Query for data fetching</li>
            <li>✅ Form handling with react-hook-form + Zod</li>
            <li>✅ i18n support (English & Vietnamese)</li>
            <li>✅ Testing setup (Vitest + Playwright)</li>
            <li>✅ ESLint + Prettier</li>
            <li>✅ CI/CD with GitHub Actions</li>
            <li>✅ Docker support</li>
          </ul>
        </Card>
      </div>
    </>
  );
};

export default About;
