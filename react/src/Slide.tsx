import { useContext, useLayoutEffect, useMemo, useRef } from 'react';
import type Reveal from 'reveal.js';
import { RevealContext } from './context';
import type { SlideProps } from './types';

const EMPTY_DATA_ATTRIBUTES_SIGNATURE = '[]';

function getDataAttributesSignature(attributes: Omit<SlideProps, 'children'>) {
	return JSON.stringify(
		Object.entries(attributes)
			.filter(([key]) => key.startsWith('data-'))
			.sort(([a], [b]) => a.localeCompare(b))
	);
}

export function Slide({ children, ...rest }: SlideProps) {
	const deck = useContext(RevealContext);
	const slideRef = useRef<HTMLElement>(null);
	const lastSyncedDeckRef = useRef<Reveal.Api | null>(null);
	const lastSyncedSignatureRef = useRef<string | null>(null);
	const dataAttributesSignature = useMemo(() => getDataAttributesSignature(rest), [rest]);

	useLayoutEffect(() => {
		const slide = slideRef.current;
		if (!deck || !slide || typeof deck.syncSlide !== 'function') return;

		// The first render for a given deck instance is handled by the parent Deck.sync() pass.
		// syncSlide() is only safe once Reveal is aware of this slide.
		if (lastSyncedDeckRef.current !== deck) {
			lastSyncedDeckRef.current = deck;
			lastSyncedSignatureRef.current = dataAttributesSignature;
			return;
		}

		if (dataAttributesSignature === EMPTY_DATA_ATTRIBUTES_SIGNATURE) return;

		const sameDeck = lastSyncedDeckRef.current === deck;
		const sameDataAttributes = lastSyncedSignatureRef.current === dataAttributesSignature;
		if (sameDeck && sameDataAttributes) return;

		deck.syncSlide(slide);
		lastSyncedDeckRef.current = deck;
		lastSyncedSignatureRef.current = dataAttributesSignature;
	}, [deck, dataAttributesSignature]);

	return (
		<section ref={slideRef} {...rest}>
			{children}
		</section>
	);
}
