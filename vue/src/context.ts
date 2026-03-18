import type { InjectionKey, ShallowRef } from 'vue';
import type { RevealApi } from 'reveal.js';

export const RevealContextKey: InjectionKey<ShallowRef<RevealApi | null>> = Symbol('RevealContext');
