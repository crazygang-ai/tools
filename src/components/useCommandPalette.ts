import { useContext } from 'react';
import { PaletteContext, type PaletteCtx } from './commandPaletteContext';

export function useCommandPalette(): PaletteCtx {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error('useCommandPalette must be used within <CommandPalette>');
  return ctx;
}
