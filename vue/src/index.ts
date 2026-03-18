import { inject, shallowRef } from 'vue';
import { RevealContextKey } from './context';
import type { RevealApi } from 'reveal.js';
import type { ShallowRef } from 'vue';

export { default as Deck } from './Deck.vue';
export { default as Slide } from './Slide.vue';
export { default as Fragment } from './Fragment.vue';
export { default as Code } from './Code.vue';
export { default as Stack } from './Stack.vue';

export { RevealContextKey as RevealContext } from './context';

export type { DeckProps, DeckEmits, SlideProps, StackProps, FragmentProps, CodeProps } from './types';

export function useReveal(): ShallowRef<RevealApi | null> {
	const deck = inject(RevealContextKey);
	if (!deck) {
		console.warn('useReveal must be used within a Deck component');
		return shallowRef<RevealApi | null>(null);
	}
	return deck;
}
