import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LoadingSpinner from './components/feedback/LoadingSpinner';
import { useTheme } from './hooks/theme/useTheme';
import { routes } from '@/routes';

function App() {
  const { theme } = useTheme();
  const routeElements = useRoutes(routes);

  return (
    <>
      <Helmet>
        <html lang="en" className={theme} />
      </Helmet>
      <Suspense fallback={<LoadingSpinner />}>
        {routeElements}
      </Suspense>
    </>
  );
}

export default App;
