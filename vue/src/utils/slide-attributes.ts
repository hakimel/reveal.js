import type {
	SlideAutoAnimateProps,
	SlideBackgroundProps,
	SlideDataAttributeValue,
	SlideRevealProps,
} from '../types';

export const EMPTY_DATA_ATTRIBUTES_SIGNATURE = '[]';

export type SlideShorthandProps = SlideBackgroundProps & SlideAutoAnimateProps & SlideRevealProps;

export type SlideElementProps = Record<string, any>;

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

export function getDataAttributesSignature(attributes: SlideElementProps) {
	return JSON.stringify(
		Object.entries(attributes)
			.filter(([key]) => key.startsWith('data-'))
			.sort(([a], [b]) => a.localeCompare(b))
	);
}

export function getSlideAttributes(
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

		const value = shorthandProps[propName as keyof SlideShorthandProps];
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
