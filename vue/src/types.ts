import type { StyleValue, Component, VNode, Ref } from 'vue';
import type {
	FragmentAnimation,
	MarkdownConfig,
	RevealApi,
	RevealConfig,
	RevealPlugin,
	RevealPluginFactory,
	TransitionSpeed,
	TransitionStyle,
} from 'reveal.js';

export type DeckConfig = RevealConfig;
export type DeckPlugin = RevealPlugin | RevealPluginFactory;
export type RevealEventHandler = Parameters<RevealApi['on']>[1];

export interface DeckProps {
	config?: Omit<DeckConfig, 'plugins'>;
	/** Registered during deck initialization only. Subsequent prop updates are ignored. */
	plugins?: DeckPlugin[];
	onReady?: (deck: RevealApi) => void;
	onSync?: RevealEventHandler;
	onSlideSync?: RevealEventHandler;
	onSlideChange?: RevealEventHandler;
	onSlideTransitionEnd?: RevealEventHandler;
	onFragmentShown?: RevealEventHandler;
	onFragmentHidden?: RevealEventHandler;
	onOverviewShown?: RevealEventHandler;
	onOverviewHidden?: RevealEventHandler;
	onPaused?: RevealEventHandler;
	onResumed?: RevealEventHandler;
	deckRef?: Ref<RevealApi | null>;
	class?: any;
	style?: StyleValue;
}

export type SlideDataAttributeValue = string | number | boolean | undefined;

export type SlideDataAttributes = {
	[key: `data-${string}`]: SlideDataAttributeValue;
};

export interface SlideBackgroundProps {
	background?: string;
	backgroundImage?: string;
	backgroundVideo?: string;
	backgroundVideoLoop?: boolean;
	backgroundVideoMuted?: boolean;
	backgroundIframe?: string;
	backgroundColor?: string;
	backgroundGradient?: string;
	backgroundSize?: string;
	backgroundPosition?: string;
	backgroundRepeat?: string;
	backgroundOpacity?: number | string;
	backgroundTransition?: TransitionStyle;
}

export type SlideVisibility = 'hidden' | 'uncounted';

export interface SlideAutoAnimateProps {
	visibility?: SlideVisibility;
	autoAnimate?: boolean;
	autoAnimateId?: string;
	autoAnimateRestart?: boolean;
	autoAnimateUnmatched?: boolean;
	autoAnimateEasing?: string;
	autoAnimateDuration?: number | string;
	autoAnimateDelay?: number | string;
}

export interface SlideRevealProps {
	transition?: string;
	transitionSpeed?: TransitionSpeed;
	autoSlide?: number | string;
	notes?: string;
	backgroundInteractive?: boolean;
	preload?: boolean;
}

export interface SlideProps extends
	SlideBackgroundProps,
	SlideAutoAnimateProps,
	SlideRevealProps {
	// SlideDataAttributes is handled by Vue fallthrough $attrs
}

export type MarkdownOptions = Omit<
	MarkdownConfig,
	'async' | 'separator' | 'verticalSeparator' | 'notesSeparator' | 'attributes'
> & {
	animateLists?: boolean;
};

export interface MarkdownProps extends SlideProps {
	markdown?: string;
	src?: string;
	charset?: string;
	separator?: string;
	verticalSeparator?: string | null;
	notesSeparator?: string;
	elementAttributesSeparator?: string;
	slideAttributesSeparator?: string;
	options?: MarkdownOptions;
}

export interface StackProps {
	class?: any;
	style?: StyleValue;
}

export interface FragmentBaseProps {
	animation?: FragmentAnimation;
	class?: any;
	style?: StyleValue;
	index?: number;
}

export interface FragmentElementProps extends FragmentBaseProps {
	asChild?: false;
	as?: string | Component;
}

export interface FragmentAsChildProps extends FragmentBaseProps {
	asChild: true;
	as?: never;
}

export type FragmentProps = FragmentElementProps | FragmentAsChildProps;

export interface CodeProps {
	code?: string;
	language?: string;
	trim?: boolean;
	lineNumbers?: boolean | string;
	startFrom?: number;
	noEscape?: boolean;
	codeClassName?: string;
	codeStyle?: StyleValue;
	codeProps?: any;
}
