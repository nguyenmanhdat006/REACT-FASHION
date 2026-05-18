import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials, SignUpCredentials } from '@/types/auth/auth';
import {
  loginThunk,
  signUpThunk,
  logoutThunk,
  getProfileThunk,
  forgotPasswordThunk,
} from '@/store/thunks/authThunks';
import toast from 'react-hot-toast';
import { getAccessToken } from '@/utils/authStorage';
import { ROUTES } from '@/constants';
import type { ForgotPasswordData } from '@/types/auth/auth';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    state => state.auth
  );
  const profileRequestedRef = useRef<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (getAccessToken()) {
      await dispatch(getProfileThunk());
    }
  }, [dispatch]);

  useEffect(() => {
    const accessToken = getAccessToken();

    if (isAuthenticated && !user && accessToken && profileRequestedRef.current !== accessToken) {
      profileRequestedRef.current = accessToken;
      void loadProfile();
    }

    if (!isAuthenticated) {
      profileRequestedRef.current = null;
    }
  }, [isAuthenticated, user, loadProfile]);

  const login = async (credentials: LoginCredentials) => {
    const result = await dispatch(loginThunk(credentials));
    if (loginThunk.fulfilled.match(result)) {
      toast.success('Login successful!');
      navigate(ROUTES.HOME);
    } else if (loginThunk.rejected.match(result)) {
      toast.error(result.payload || 'Login failed');
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    const result = await dispatch(signUpThunk(credentials));
    if (signUpThunk.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      navigate(ROUTES.LOGIN);
    } else if (signUpThunk.rejected.match(result)) {
      toast.error(result.payload || 'Sign up failed');
    }
  };

  const logoutUser = async () => {
    const result = await dispatch(logoutThunk());
    if (logoutThunk.fulfilled.match(result)) {
      toast.success('Logged out successfully');
      navigate(ROUTES.HOME);
    } else if (logoutThunk.rejected.match(result)) {
      toast.error('Logout failed');
      navigate(ROUTES.HOME);
    }
  };

  const forgotPassword = async (data: ForgotPasswordData) => {
    const result = await dispatch(forgotPasswordThunk(data));
    if (forgotPasswordThunk.fulfilled.match(result)) {
      toast.success('If the email exists, a reset link has been sent.');
      navigate(`${ROUTES.FORGOT_PASSWORD_SENT}?email=${encodeURIComponent(data.email)}`);
    } else if (forgotPasswordThunk.rejected.match(result)) {
      toast.error(result.payload || 'Unable to send reset email');
    }
  };

  const resendForgotPassword = async (emailFromQuery: string | null | undefined) => {
    const trimmed = emailFromQuery?.trim();
    if (!trimmed) {
      toast.error('Missing email. Go back and enter your email to resend.');
      return;
    }

    const result = await dispatch(forgotPasswordThunk({ email: trimmed }));
    if (forgotPasswordThunk.fulfilled.match(result)) {
      toast.success('If the email exists, another reset link has been sent.');
    } else if (forgotPasswordThunk.rejected.match(result)) {
      toast.error(result.payload || 'Unable to resend reset email');
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signUp,
    logout: logoutUser,
    loadProfile,
    forgotPassword,
    resendForgotPassword,
  };
};
