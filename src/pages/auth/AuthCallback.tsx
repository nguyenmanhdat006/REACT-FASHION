import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/feedback/LoadingSpinner';
import { authService } from '@/services/auth/authService';
import { useAppDispatch } from '@/store/hooks';
import { setAuth } from '@/store/slices/authSlice';
import { setAuthTokens } from '@/utils/authStorage';
import { SocialProvider } from '@/types/auth/auth';

const isSocialProvider = (value: string | null): value is SocialProvider =>
  value === 'google' || value === 'facebook';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const bootstrap = async () => {
      const code = searchParams.get('code');
      const provider = searchParams.get('provider');

      if (!code || !isSocialProvider(provider)) {
        toast.error('Missing social login context. Please try again.');
        navigate('/login', { replace: true });
        return;
      }

      try {
        const appAuth = await authService.exchangeOAuthCode(provider, code);

        setAuthTokens(appAuth.accessToken, appAuth.refreshToken);
        dispatch(setAuth(appAuth));

        navigate('/', { replace: true });
      } catch (error) {
        console.error('Authentication callback error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login', { replace: true });
      }
    };

    void bootstrap();
  }, [dispatch, navigate, searchParams]);

  return <LoadingSpinner />;
}