import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer
      className="mt-16 border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div
        className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-fg sm:flex-row sm:items-center sm:justify-between"
        style={{
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
        }}
      >
        <p>{t('footer.tagline')}</p>
        <p className="tabular-nums">
          {t('footer.year', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
