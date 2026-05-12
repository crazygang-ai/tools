import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { CategoryMeta } from '@/types';
import { ToolCard } from '@/components/ToolCard';
import { getToolsByCategory } from '@/tools/registry';
import { cn } from '@/lib/cn';

interface Props {
  category: CategoryMeta;
  withLink?: boolean;
}

export function CategorySection({ category, withLink = true }: Props) {
  const { t } = useTranslation();
  const Icon = category.icon;
  const tools = getToolsByCategory(category.id);
  const headingId = `category-${category.id}-heading`;
  const catName = t(`categories.${category.id}`);
  const catDesc = t(`categoryDesc.${category.id}`);
  const countLabel = t('home.toolCount', { count: tools.length });

  const heading = (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted',
          category.accent,
        )}
        aria-hidden="true"
      >
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <h2 id={headingId} className="truncate text-base font-semibold sm:text-lg">
          {catName}
        </h2>
        <p className="truncate text-xs text-muted-fg">{catDesc}</p>
      </div>
      <span
        className="ml-auto whitespace-nowrap rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-fg"
        aria-label={countLabel}
      >
        {tools.length}
      </span>
    </div>
  );

  return (
    <section
      id={category.id}
      aria-labelledby={headingId}
      className="space-y-3"
    >
      {withLink ? (
        <Link
          to={`/category/${category.id}`}
          className="block rounded-lg transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          aria-label={`${catName} — ${countLabel}`}
        >
          {heading}
        </Link>
      ) : (
        heading
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
