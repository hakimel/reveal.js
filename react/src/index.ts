import { useContext } from 'react';
import { RevealContext } from './context';

export { Deck } from './Deck';
export { Slide } from './Slide';
export { Stack } from './Stack';
export { Fragment } from './Fragment';
export { RevealContext } from './context';

export type { DeckProps, SlideProps, StackProps, FragmentProps } from './types';

export function useReveal() {
	return useContext(RevealContext);
}
