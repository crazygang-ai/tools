import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ToolMeta } from '@/types';
import { cn } from '@/lib/cn';
import { getCategory } from '@/tools/categories';

interface Props {
  tool: ToolMeta;
}

export function ToolCard({ tool }: Props) {
  const { t } = useTranslation();
  const Icon = tool.icon;
  const cat = getCategory(tool.category);
  const title = t(`${tool.i18nKey}.title`, { ns: 'tools' });
  const desc = t(`${tool.i18nKey}.desc`, { ns: 'tools' });
  const implemented = !!tool.component;

  const inner = (
    <div
      className={cn(
        'group relative flex h-full flex-col rounded-xl border border-border bg-card p-4',
        // List specific transitioned properties (avoid `transition: all`)
        'transition-[transform,box-shadow,border-color,background-color] duration-150 ease-out',
        implemented &&
          'hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md motion-reduce:hover:translate-y-0',
        !implemented && 'opacity-60',
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className={cn(
            'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted',
            cat.accent,
          )}
          aria-hidden="true"
        >
          <Icon size={18} />
        </span>
        {!implemented && (
          <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-fg">
            {t('home.comingSoon')}
          </span>
        )}
      </div>
      <h3 className="mb-1 truncate text-sm font-semibold text-fg">{title}</h3>
      <p
        className="line-clamp-2 break-words text-xs text-muted-fg"
        title={desc}
      >
        {desc}
      </p>
    </div>
  );

  if (!implemented) {
    return (
      <div
        role="link"
        aria-disabled="true"
        aria-label={`${title} — ${t('home.comingSoon')}`}
        className="cursor-not-allowed"
      >
        {inner}
      </div>
    );
  }

  return (
    <Link
      to={`/tools/${tool.slug}`}
      className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      aria-label={`${title}: ${desc}`}
    >
      {inner}
    </Link>
  );
}
