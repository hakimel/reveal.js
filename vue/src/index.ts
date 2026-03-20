import { inject, shallowRef } from 'vue';
import { RevealContextKey } from './reveal-context';

export { default as Deck } from './components/Deck.vue';
export { default as Slide } from './components/Slide.vue';
export { default as Stack } from './components/Stack.vue';
export { default as Markdown } from './components/Markdown.vue';
export { default as Fragment } from './components/Fragment.vue';
export { default as Code } from './components/Code.vue';
export { RevealContextKey } from './reveal-context';

export type {
	DeckProps,
	SlideProps,
	StackProps,
	MarkdownProps,
	MarkdownOptions,
	FragmentProps,
	CodeProps,
} from './types';

export function useReveal() {
	return inject(RevealContextKey, shallowRef(null));
}
