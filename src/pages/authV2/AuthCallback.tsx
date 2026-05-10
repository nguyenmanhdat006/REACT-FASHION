import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { setAuth } from '@/store/slices/authSlice';
import { setAuthTokens } from '@/utils/authStorage';
import { authService } from '@/services/auth/authService';
import { keycloakAuthService } from '@/services/auth/keycloakService';
import LoadingSpinner from '@/components/feedback/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const session = await keycloakAuthService.exchangeAuthorizationCode();

        if (!session) {
          navigate('/login');
          return;
        }

        const appAuth = await authService.loginWithKeycloakToken({
          accessToken: session.accessToken,
        });

        setAuthTokens(appAuth.accessToken, appAuth.refreshToken);

        dispatch(setAuth(appAuth));

        navigate('/');
      } catch (error) {
        console.error('Authentication callback error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    };

    void bootstrap();
  }, [dispatch, navigate]);

  return <LoadingSpinner />;
}
