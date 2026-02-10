import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/Card';
import Table from '@/components/Table';

// Mock data for demonstration
const mockTableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
];

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - React Boilerplate</title>
        <meta name="description" content="User dashboard" />
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('pages.dashboard')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome back, {user?.displayName || user?.email}!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Total Users" hover>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              1,234
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              +12% from last month
            </p>
          </Card>
          <Card title="Active Sessions" hover>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              567
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              +8% from last month
            </p>
          </Card>
          <Card title="Revenue" hover>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              $45,678
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              +23% from last month
            </p>
          </Card>
        </div>

        <Card title="Recent Users">
          <Table data={mockTableData} columns={columns} />
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
