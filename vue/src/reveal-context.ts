import type { InjectionKey, ShallowRef } from 'vue';
import type { RevealApi } from 'reveal.js';

export const RevealContextKey = Symbol('RevealContext') as InjectionKey<ShallowRef<RevealApi | null>>;
