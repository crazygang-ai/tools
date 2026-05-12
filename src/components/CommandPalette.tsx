import { Command } from 'cmdk';
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TOOLS } from '@/tools/registry';
import { CATEGORY_ORDER } from '@/tools/categories';
import { cn } from '@/lib/cn';
import { PaletteContext } from './commandPaletteContext';

export function CommandPalette({ children }: { children?: ReactNode }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // Body scroll lock + focus management when open
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onEsc, true);

    return () => {
      window.removeEventListener('keydown', onEsc, true);
      document.body.style.overflow = prevOverflow;
      // Restore focus to whatever opened the palette
      if (previouslyFocused.current && document.contains(previouslyFocused.current)) {
        previouslyFocused.current.focus({ preventScroll: true });
      }
    };
  }, [open]);

  function go(slug: string) {
    setOpen(false);
    navigate(`/tools/${slug}`);
  }

  return (
    <PaletteContext.Provider value={{ open: () => setOpen(true), close: () => setOpen(false) }}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 py-[15vh] backdrop-blur-sm motion-safe:animate-fade-in-static"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.openSearch')}
            className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ overscrollBehavior: 'contain' }}
          >
            <Command label="DevTools search" className="flex flex-col" loop>
              <Command.Input
                autoFocus
                placeholder={t('nav.search') ?? ''}
                inputMode="search"
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                className={cn(
                  'h-12 w-full border-b border-border bg-transparent px-4 text-sm outline-none',
                  'placeholder:text-muted-fg',
                )}
              />
              <Command.List
                className="max-h-[60vh] overflow-y-auto p-2"
                style={{ overscrollBehavior: 'contain' }}
              >
                <Command.Empty className="py-6 text-center text-sm text-muted-fg">
                  {t('common.empty')}
                </Command.Empty>
                {CATEGORY_ORDER.map((cat) => {
                  const items = TOOLS.filter((x) => x.category === cat);
                  if (items.length === 0) return null;
                  return (
                    <Command.Group
                      key={cat}
                      heading={t(`categories.${cat}`)}
                      className="text-xs text-muted-fg [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
                    >
                      {items.map((tool) => {
                        const Icon = tool.icon;
                        const title = t(`${tool.i18nKey}.title`, { ns: 'tools' });
                        const desc = t(`${tool.i18nKey}.desc`, { ns: 'tools' });
                        return (
                          <Command.Item
                            key={tool.slug}
                            value={`${title} ${tool.slug} ${(tool.keywords ?? []).join(' ')}`}
                            onSelect={() => go(tool.slug)}
                            className={cn(
                              'flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm',
                              'transition-colors data-[selected=true]:bg-muted data-[selected=true]:text-fg',
                            )}
                          >
                            <Icon size={16} className="shrink-0 text-muted-fg" aria-hidden="true" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium text-fg">{title}</div>
                              <div className="line-clamp-1 text-xs text-muted-fg">{desc}</div>
                            </div>
                            {!tool.component && (
                              <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-fg">
                                {t('home.comingSoon')}
                              </span>
                            )}
                          </Command.Item>
                        );
                      })}
                    </Command.Group>
                  );
                })}
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </PaletteContext.Provider>
  );
}
