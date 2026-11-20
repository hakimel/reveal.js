import { useContext, useLayoutEffect, useRef } from 'react';
import type { RevealApi } from 'reveal.js';
import { RevealContext } from '../reveal-context';
import type { SlideProps } from '../types';
import {
	EMPTY_DATA_ATTRIBUTES_SIGNATURE,
	getDataAttributesSignature,
	getSlideAttributes,
} from '../utils/slide-attributes';

export function Slide({
	children,
	background,
	backgroundImage,
	backgroundVideo,
	backgroundVideoLoop,
	backgroundVideoMuted,
	backgroundIframe,
	backgroundColor,
	backgroundGradient,
	backgroundSize,
	backgroundPosition,
	backgroundRepeat,
	backgroundOpacity,
	backgroundTransition,
	visibility,
	autoAnimate,
	autoAnimateId,
	autoAnimateRestart,
	autoAnimateUnmatched,
	autoAnimateEasing,
	autoAnimateDuration,
	autoAnimateDelay,
	transition,
	transitionSpeed,
	autoSlide,
	notes,
	backgroundInteractive,
	preload,
	...rest
}: SlideProps) {
	const deck = useContext(RevealContext);
	const slideRef = useRef<HTMLElement>(null);
	const lastSyncedDeckRef = useRef<RevealApi | null>(null);
	const lastSyncedSignatureRef = useRef<string | null>(null);
	const slideAttributes = getSlideAttributes(rest, {
		background,
		backgroundImage,
		backgroundVideo,
		backgroundVideoLoop,
		backgroundVideoMuted,
		backgroundIframe,
		backgroundColor,
		backgroundGradient,
		backgroundSize,
		backgroundPosition,
		backgroundRepeat,
		backgroundOpacity,
		backgroundTransition,
		visibility,
		autoAnimate,
		autoAnimateId,
		autoAnimateRestart,
		autoAnimateUnmatched,
		autoAnimateEasing,
		autoAnimateDuration,
		autoAnimateDelay,
		transition,
		transitionSpeed,
		autoSlide,
		notes,
		backgroundInteractive,
		preload,
	});
	const dataAttributesSignature = getDataAttributesSignature(slideAttributes);

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
		<section ref={slideRef} {...slideAttributes}>
			{children}
		</section>
	);
}
