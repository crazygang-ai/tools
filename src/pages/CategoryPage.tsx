import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CATEGORIES } from '@/tools/categories';
import { CategorySection } from '@/components/CategorySection';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import NotFound from './NotFound';

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const cat = CATEGORIES.find((c) => c.id === id);
  const catName = cat ? t(`categories.${cat.id}`) : '';
  useDocumentTitle(cat ? `${catName} · ${t('site.title')}` : null);
  if (!cat) return <NotFound />;
  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 rounded-md text-xs text-muted-fg transition-colors hover:text-fg hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        <ArrowLeft size={12} aria-hidden="true" />
        {t('common.backToHomeShort')}
      </Link>
      <CategorySection category={cat} withLink={false} />
    </div>
  );
}
