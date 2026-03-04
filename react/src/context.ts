import { createContext } from 'react';
import type Reveal from 'reveal.js';

export const RevealContext = createContext<Reveal.Api | null>(null);
