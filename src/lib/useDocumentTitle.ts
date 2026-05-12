import { useEffect } from 'react';

/**
 * Sync `document.title` with the current route.
 *
 * No cleanup is performed: the next page that mounts will write its own
 * title via this same hook. Restoring the previous title on unmount sounds
 * tidy but causes flicker when:
 *  - React 18 StrictMode runs effects mount→unmount→mount in development,
 *    so the cleanup briefly resets the title to a stale value
 *  - two pages overlap during route transitions and the unmounting page's
 *    cleanup races the new page's effect
 *
 * The trade-off is that a screen showing no `useDocumentTitle(...)` call
 * would inherit the previous page's title — but every top-level page in
 * this app already calls this hook, so that case doesn't arise.
 */
export function useDocumentTitle(title: string | undefined | null): void {
  useEffect(() => {
    if (!title) return;
    document.title = title;
  }, [title]);
}
