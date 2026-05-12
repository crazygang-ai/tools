import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from './Header';
import { Footer } from './Footer';
import { CommandPalette } from '@/components/CommandPalette';

export function Layout() {
  const { i18n, t } = useTranslation();

  // Keep <html lang> in sync with the active i18n language
  useEffect(() => {
    const lang = i18n.language?.split('-')[0] || 'en';
    if (document.documentElement.lang !== lang) {
      document.documentElement.lang = lang;
    }
  }, [i18n.language]);

  return (
    <CommandPalette>
      <div className="flex min-h-screen flex-col">
        <a href="#main-content" className="skip-link">
          {t('a11y.skipToContent')}
        </a>
        <Header />
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 outline-none sm:py-10"
          style={{
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
            paddingRight: 'max(1rem, env(safe-area-inset-right))',
          }}
        >
          <Outlet />
        </main>
        <Footer />
      </div>
    </CommandPalette>
  );
}
