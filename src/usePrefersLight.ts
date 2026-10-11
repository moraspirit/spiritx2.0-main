/** Always false: the site is dark-only. Kept so theme-aware components need no changes. */
export function usePrefersLight(): boolean {
  return false;
}
