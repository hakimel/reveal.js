import { useContext, useLayoutEffect, useRef } from 'react';
import type { RevealApi } from 'reveal.js';
import { RevealContext } from './context';
import type {
	SlideAutoAnimateProps,
	SlideBackgroundProps,
	SlideDataAttributeValue,
	SlideProps,
	SlideRevealProps,
} from './types';

const EMPTY_DATA_ATTRIBUTES_SIGNATURE = '[]';
type SlideShorthandProps = SlideBackgroundProps & SlideAutoAnimateProps & SlideRevealProps;

const SLIDE_DATA_ATTRIBUTES: Record<keyof SlideShorthandProps, `data-${string}`> = {
	background: 'data-background',
	backgroundImage: 'data-background-image',
	backgroundVideo: 'data-background-video',
	backgroundVideoLoop: 'data-background-video-loop',
	backgroundVideoMuted: 'data-background-video-muted',
	backgroundIframe: 'data-background-iframe',
	backgroundColor: 'data-background-color',
	backgroundGradient: 'data-background-gradient',
	backgroundSize: 'data-background-size',
	backgroundPosition: 'data-background-position',
	backgroundRepeat: 'data-background-repeat',
	backgroundOpacity: 'data-background-opacity',
	backgroundTransition: 'data-background-transition',
	visibility: 'data-visibility',
	autoAnimate: 'data-auto-animate',
	autoAnimateId: 'data-auto-animate-id',
	autoAnimateRestart: 'data-auto-animate-restart',
	autoAnimateUnmatched: 'data-auto-animate-unmatched',
	autoAnimateEasing: 'data-auto-animate-easing',
	autoAnimateDuration: 'data-auto-animate-duration',
	autoAnimateDelay: 'data-auto-animate-delay',
	transition: 'data-transition',
	transitionSpeed: 'data-transition-speed',
	autoSlide: 'data-autoslide',
	notes: 'data-notes',
	backgroundInteractive: 'data-background-interactive',
	preload: 'data-preload',
};

type SlideElementProps = Omit<SlideProps, 'children' | keyof SlideShorthandProps>;

function getDataAttributesSignature(attributes: SlideElementProps) {
	return JSON.stringify(
		Object.entries(attributes)
			.filter(([key]) => key.startsWith('data-'))
			.sort(([a], [b]) => a.localeCompare(b))
	);
}

function getSlideAttributes(
	attributes: SlideElementProps,
	shorthandProps: SlideShorthandProps
): SlideElementProps {
	const resolvedAttributes = { ...attributes } as SlideElementProps;
	const resolvedDataAttributes = resolvedAttributes as unknown as Record<
		string,
		SlideDataAttributeValue
	>;

	for (const [propName, dataAttributeName] of Object.entries(SLIDE_DATA_ATTRIBUTES) as Array<
		[keyof SlideShorthandProps, `data-${string}`]
	>) {
		if (resolvedDataAttributes[dataAttributeName] !== undefined) continue;

		const value = shorthandProps[propName];
		if (value === undefined) continue;

		if (value === false) {
			if (propName === 'autoAnimateUnmatched') {
				resolvedDataAttributes[dataAttributeName] = 'false';
			}
			continue;
		}

		resolvedDataAttributes[dataAttributeName] = typeof value === 'boolean' ? '' : value;
	}

	return resolvedAttributes;
}

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
