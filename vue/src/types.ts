import type { CSSProperties } from 'vue';
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

export interface DeckProps {
	config?: Omit<DeckConfig, 'plugins'>;
	/** Registered during deck initialization only. Subsequent prop updates are ignored. */
	plugins?: DeckPlugin[];
}

export interface DeckEmits {
	ready: [deck: RevealApi];
	sync: [event: any];
	slideSync: [event: any];
	slideChanged: [event: any];
	slideTransitionEnd: [event: any];
	fragmentShown: [event: any];
	fragmentHidden: [event: any];
	overviewShown: [event: any];
	overviewHidden: [event: any];
	paused: [event: any];
	resumed: [event: any];
}

export type SlideDataAttributeValue = string | number | boolean | undefined;

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
	autoAnimateUnmatched?: boolean | string;
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

export interface SlideProps extends SlideBackgroundProps, SlideAutoAnimateProps, SlideRevealProps {}

export interface StackProps {}

export interface FragmentProps {
	animation?: FragmentAnimation;
	as?: string;
	index?: number | string;
}

export interface CodeProps {
	code?: string;
	language?: string;
	trim?: boolean;
	lineNumbers?: boolean | string;
	startFrom?: number | string;
	noEscape?: boolean;
	codeClass?: string;
	codeStyle?: CSSProperties;
}
