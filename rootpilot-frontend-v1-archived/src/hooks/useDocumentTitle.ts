import { useEffect } from 'react';

/**
 * Sets the browser tab title dynamically per page.
 * Appends " — RootPilot" as the suffix.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = `${title} — RootPilot`;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
