import type { CSSProperties, ReactNode, ElementType, Ref, ReactElement } from 'react';
import type {
	FragmentAnimation,
	RevealApi,
	RevealConfig,
	RevealPlugin,
	RevealPluginFactory,
	TransitionSpeed,
	TransitionStyle,
} from 'reveal.js';

type DeckConfig = RevealConfig;
type DeckPlugin = RevealPlugin | RevealPluginFactory;
type RevealEventHandler = Parameters<RevealApi['on']>[1];

export type DeckProps = {
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
	className?: string;
	style?: CSSProperties;
	children?: ReactNode;
};

export type SlideDataAttributeValue = string | number | boolean | undefined;

export type SlideDataAttributes = {
	[key: `data-${string}`]: SlideDataAttributeValue;
};

export type SlideBackgroundProps = {
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
};

export type SlideVisibility = 'hidden' | 'uncounted';

export type SlideAutoAnimateProps = {
	visibility?: SlideVisibility;
	autoAnimate?: boolean;
	autoAnimateId?: string;
	autoAnimateRestart?: boolean;
	autoAnimateUnmatched?: boolean;
	autoAnimateEasing?: string;
	autoAnimateDuration?: number | string;
	autoAnimateDelay?: number | string;
};

export type SlideRevealProps = {
	transition?: string;
	transitionSpeed?: TransitionSpeed;
	autoSlide?: number | string;
	notes?: string;
	backgroundInteractive?: boolean;
	preload?: boolean;
};

export type SlideProps = React.HTMLAttributes<HTMLElement> &
	SlideDataAttributes &
	SlideBackgroundProps &
	SlideAutoAnimateProps &
	SlideRevealProps & {
	children?: ReactNode;
};

export type StackProps = {
	className?: string;
	style?: CSSProperties;
	children?: ReactNode;
};

type FragmentBaseProps = {
	animation?: FragmentAnimation;
	className?: string;
	style?: CSSProperties;
	index?: number;
};

type FragmentElementProps = FragmentBaseProps & {
	asChild?: false;
	as?: ElementType;
	children?: ReactNode;
};

type FragmentAsChildProps = FragmentBaseProps & {
	asChild: true;
	as?: never;
	children: ReactElement;
};

export type FragmentProps = FragmentElementProps | FragmentAsChildProps;

export type CodeProps = Omit<React.HTMLAttributes<HTMLPreElement>, 'children'> & {
	children?: string;
	code?: string;
	language?: string;
	trim?: boolean;
	lineNumbers?: boolean | string;
	startFrom?: number;
	noEscape?: boolean;
	codeClassName?: string;
	codeStyle?: CSSProperties;
	codeProps?: Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'className' | 'style'>;
};
