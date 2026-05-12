import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ToolMeta } from '@/types';
import { getCategory } from '@/tools/categories';
import { cn } from '@/lib/cn';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

interface Props {
  tool: ToolMeta;
  children: ReactNode;
}

export function ToolPage({ tool, children }: Props) {
  const { t } = useTranslation();
  const Icon = tool.icon;
  const cat = getCategory(tool.category);
  const title = t(`${tool.i18nKey}.title`, { ns: 'tools' });
  const desc = t(`${tool.i18nKey}.desc`, { ns: 'tools' });
  const catName = t(`categories.${tool.category}`);
  const siteTitle = t('site.title');
  useDocumentTitle(`${title} · ${siteTitle}`);

  return (
    <div className="space-y-6 motion-safe:animate-fade-in">
      <div>
        <Link
          to={`/category/${tool.category}`}
          className="inline-flex items-center gap-1.5 rounded-md text-xs text-muted-fg transition-colors hover:text-fg hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <ArrowLeft size={12} aria-hidden="true" />
          {t('common.backToCategory', { name: catName })}
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <span
            className={cn(
              'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted',
              cat.accent,
            )}
            aria-hidden="true"
          >
            <Icon size={20} />
          </span>
          <div className="min-w-0">
            <h1 className="text-balance text-xl font-bold sm:text-2xl">{title}</h1>
            <p className="text-pretty text-sm text-muted-fg">{desc}</p>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">{children}</div>
    </div>
  );
}
