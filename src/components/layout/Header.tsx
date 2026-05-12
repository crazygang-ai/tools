import { Link } from 'react-router-dom';
import { Languages, Moon, Search, Sun, Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/lib/useTheme';
import { useCommandPalette } from '@/components/useCommandPalette';
import { SUPPORTED_LANGS } from '@/i18n';
import { cn } from '@/lib/cn';

export function Header() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { open: openPalette } = useCommandPalette();

  function nextTheme() {
    setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');
  }

  function nextLang() {
    const idx = SUPPORTED_LANGS.indexOf(i18n.language as (typeof SUPPORTED_LANGS)[number]);
    const next = SUPPORTED_LANGS[(idx + 1) % SUPPORTED_LANGS.length];
    void i18n.changeLanguage(next);
  }

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const themeAriaLabel = `${t('nav.toggleTheme')} (${t(`nav.theme.${theme}`)})`;
  const langAriaLabel = `${t('nav.toggleLanguage')} (${i18n.language === 'zh' ? '中文' : 'English'})`;

  return (
    <header
      className={cn(
        'sticky top-0 z-30 w-full border-b border-border glass',
      )}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div
        className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4"
        style={{
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
        }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={t('site.title')}
          translate="no"
        >
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent text-white"
            aria-hidden="true"
          >
            <span className="text-base font-black">⚡</span>
          </span>
          <span className="hidden sm:inline">{t('site.title')}</span>
        </Link>

        <nav className="ml-auto flex items-center gap-2" aria-label={t('a11y.primaryNav')}>
          <button
            type="button"
            onClick={openPalette}
            className={cn(
              'flex items-center gap-2 rounded-lg border border-border',
              'bg-card/60 px-3 py-1.5 text-sm text-muted-fg',
              'transition-colors hover:bg-card hover:text-fg',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
              'min-w-[12rem] sm:min-w-[20rem]',
            )}
            aria-label={t('nav.openSearch')}
          >
            <Search size={14} aria-hidden="true" />
            <span className="flex-1 text-left">{t('nav.search')}</span>
            <kbd
              className="hidden rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline"
              aria-hidden="true"
            >
              ⌘&nbsp;K
            </kbd>
          </button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextLang}
            aria-label={langAriaLabel}
            title={langAriaLabel}
          >
            <Languages size={16} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextTheme}
            aria-label={themeAriaLabel}
            title={themeAriaLabel}
          >
            <ThemeIcon size={16} aria-hidden="true" />
          </Button>
        </nav>
      </div>
    </header>
  );
}
