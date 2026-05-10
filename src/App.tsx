import { Suspense, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LoadingSpinner from './components/feedback/LoadingSpinner';
import { useTheme } from './hooks/theme/useTheme';
import { routes } from '@/routes';
import { useAppDispatch } from '@/store/hooks';
import { getAccessToken } from '@/utils/authStorage';
import { getProfileThunk } from '@/store/thunks/authThunks';

function App() {
  const { theme } = useTheme();
  const routeElements = useRoutes(routes);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    dispatch(getProfileThunk());
  }, [dispatch]);

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