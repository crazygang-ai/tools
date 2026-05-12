import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

export default function NotFound() {
  const { t } = useTranslation();
  useDocumentTitle(`${t('common.notFound')} · ${t('site.title')}`);
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-balance text-2xl font-bold">{t('common.notFound')}</h1>
      <p className="mt-2 max-w-md text-pretty text-sm text-muted-fg">
        {t('common.notFoundDesc')}
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        {t('common.backToHome')}
      </Link>
    </div>
  );
}
