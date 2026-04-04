import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme, toggleTheme } from '@/store/slices/themeSlice';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector(state => state.theme);

  useEffect(() => {
    // Apply theme to document on mount and theme change
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggle = () => {
    dispatch(toggleTheme());
  };

  const set = (newTheme: 'light' | 'dark') => {
    dispatch(setTheme(newTheme));
  };

  return {
    theme,
    toggle,
    set,
    isDark: theme === 'dark',
  };
};
