import { useTheme } from './theme.tsx';

/**
 * Returns whether the active site theme is light.
 * Controlled by the user toggle (defaults to light, persists in localStorage).
 */
export function usePrefersLight(): boolean {
  const { isLight } = useTheme();
  return isLight;
}
