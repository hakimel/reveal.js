import { createContext } from 'react';
import type { RevealApi } from 'reveal.js';

export const RevealContext = createContext<RevealApi | null>(null);
