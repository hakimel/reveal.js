import { useContext } from 'react';
import { RevealContext } from './reveal-context';

export { Deck } from './components/deck';
export { Slide } from './components/slide';
export { Stack } from './components/stack';
export { Markdown } from './components/markdown';
export { Fragment } from './components/fragment';
export { Code } from './components/code';
export { RevealContext } from './reveal-context';

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
	return useContext(RevealContext);
}
