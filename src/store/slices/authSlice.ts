import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/auth';
import {
  loginThunk,
  signUpThunk,
  logoutThunk,
  signInWithGoogleThunk,
  signInWithFacebookThunk,
  signInWithGitHubThunk,
  forgotPasswordThunk,
} from '../thunks/authThunks';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Login thunk
    builder
      .addCase(loginThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      });

    // Sign up thunk
    builder
      .addCase(signUpThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Sign up failed';
      });

    // Logout thunk
    builder
      .addCase(logoutThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Logout failed';
      });

    // Google sign in thunk
    builder
      .addCase(signInWithGoogleThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGoogleThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInWithGoogleThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Google sign in failed';
      });

    // Facebook sign in thunk
    builder
      .addCase(signInWithFacebookThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithFacebookThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInWithFacebookThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Facebook sign in failed';
      });

    // GitHub sign in thunk
    builder
      .addCase(signInWithGitHubThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGitHubThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInWithGitHubThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'GitHub sign in failed';
      });

    // Forgot password thunk
    builder
      .addCase(forgotPasswordThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, state => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to send reset email';
      });
  },
});

export const { setLoading, setAuth, setError, logout, updateUser, clearError } =
  authSlice.actions;
export default authSlice.reducer;
