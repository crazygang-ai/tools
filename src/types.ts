import type { LucideIcon } from 'lucide-react';
import type { ComponentType, LazyExoticComponent } from 'react';

export type CategoryId = 'security' | 'image' | 'format' | 'text' | 'cheatsheet';

export interface CategoryMeta {
  id: CategoryId;
  icon: LucideIcon;
  /** Tailwind text color class for the category accent */
  accent: string;
}

export interface ToolMeta {
  slug: string;
  category: CategoryId;
  /** Key under tools.<slug> */
  i18nKey: string;
  icon: LucideIcon;
  component?: LazyExoticComponent<ComponentType>;
  keywords?: string[];
}
