import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials, SignUpCredentials } from '@/types/auth';
import {
  loginThunk,
  signUpThunk,
  logoutThunk,
  getProfileThunk,
} from '@/store/thunks/authThunks';
import toast from 'react-hot-toast';
import { getAccessToken } from '@/utils/authStorage';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    state => state.auth
  );

  const loadProfile = useCallback(async () => {
    if (getAccessToken()) {
      await dispatch(getProfileThunk());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && !user) {
      void loadProfile();
    }
  }, [isAuthenticated, user, loadProfile]);

  const login = async (credentials: LoginCredentials) => {
    const result = await dispatch(loginThunk(credentials));
    if (loginThunk.fulfilled.match(result)) {
      toast.success('Login successful!');
      navigate('/products');
    } else if (loginThunk.rejected.match(result)) {
      toast.error(result.payload || 'Login failed');
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    const result = await dispatch(signUpThunk(credentials));
    if (signUpThunk.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      navigate('/login');
    } else if (signUpThunk.rejected.match(result)) {
      toast.error(result.payload || 'Sign up failed');
    }
  };

  const logoutUser = async () => {
    const result = await dispatch(logoutThunk());
    if (logoutThunk.fulfilled.match(result)) {
      toast.success('Logged out successfully');
      navigate('/');
    } else if (logoutThunk.rejected.match(result)) {
      toast.error('Logout failed');
      navigate('/');
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
  };
};
