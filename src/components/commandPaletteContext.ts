import { createContext } from 'react';

export interface PaletteCtx {
  open: () => void;
  close: () => void;
}

export const PaletteContext = createContext<PaletteCtx | null>(null);
