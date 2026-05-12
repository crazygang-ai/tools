import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getToolBySlug } from '@/tools/registry';
import { ToolPage } from '@/components/ToolPage';
import NotFound from './NotFound';

export default function ToolDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const tool = slug ? getToolBySlug(slug) : undefined;
  if (!tool) return <NotFound />;

  if (!tool.component) {
    return (
      <ToolPage tool={tool}>
        <div
          className="py-10 text-center text-muted-fg"
          role="status"
          aria-live="polite"
        >
          {t('home.comingSoon')}
        </div>
      </ToolPage>
    );
  }

  const Comp = tool.component;
  return (
    <ToolPage tool={tool}>
      <Suspense
        fallback={
          <div
            className="flex h-32 items-center justify-center text-sm text-muted-fg"
            role="status"
            aria-live="polite"
          >
            {t('a11y.loading')}
          </div>
        }
      >
        <Comp />
      </Suspense>
    </ToolPage>
  );
}
