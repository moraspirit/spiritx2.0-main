import { createContext, useContext, useEffect, type ReactNode } from 'react';

/** The site is dark-only ("Night Stadium"). The context stays so theme-aware components keep working. */
export type Theme = 'dark';

type ThemeContextValue = {
  theme: Theme;
  isDark: true;
  isLight: false;
};

const VALUE: ThemeContextValue = { theme: 'dark', isDark: true, isLight: false };

const ThemeContext = createContext<ThemeContextValue>(VALUE);

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  return <ThemeContext.Provider value={VALUE}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
