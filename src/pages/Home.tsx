import { useTranslation } from 'react-i18next';
import { CATEGORIES } from '@/tools/categories';
import { CategorySection } from '@/components/CategorySection';
import { TOOLS } from '@/tools/registry';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

export default function Home() {
  const { t } = useTranslation();
  const total = TOOLS.length;
  useDocumentTitle(`${t('site.title')} — ${t('site.tagline')}`);

  return (
    <div className="space-y-12">
      <section
        aria-labelledby="hero-title"
        className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 sm:p-10"
      >
        <h1
          id="hero-title"
          className="text-balance text-2xl font-bold tracking-tight sm:text-4xl"
        >
          {t('home.heroTitle')}
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-sm text-muted-fg sm:text-base">
          {t('home.heroSubtitle')}
        </p>
        <div
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs text-muted-fg"
          aria-label={t('home.statsLabel', { count: total })}
        >
          <span className="tabular-nums" translate="no">
            {total}+
          </span>
          <span aria-hidden="true">·</span>
          <span>{t('home.localOnly')}</span>
        </div>
      </section>
      {CATEGORIES.map((cat) => (
        <CategorySection key={cat.id} category={cat} />
      ))}
    </div>
  );
}
