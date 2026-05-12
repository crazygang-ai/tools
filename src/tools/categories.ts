import { Shield, Image, RefreshCw, Type, BookOpen } from 'lucide-react';
import type { CategoryMeta } from '@/types';

export const CATEGORIES: CategoryMeta[] = [
  { id: 'security', icon: Shield, accent: 'text-emerald-500' },
  { id: 'image', icon: Image, accent: 'text-pink-500' },
  { id: 'format', icon: RefreshCw, accent: 'text-amber-500' },
  { id: 'text', icon: Type, accent: 'text-violet-500' },
  { id: 'cheatsheet', icon: BookOpen, accent: 'text-rose-500' },
];

export const CATEGORY_ORDER: CategoryMeta['id'][] = CATEGORIES.map((c) => c.id);

export function getCategory(id: CategoryMeta['id']): CategoryMeta {
  const c = CATEGORIES.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown category: ${id}`);
  return c;
}
