import type { CSSProperties, ReactNode, ElementType, Ref } from 'react';
import type {
	FragmentAnimation,
	RevealApi,
	RevealConfig,
	RevealPlugin,
	RevealPluginFactory,
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

export type SlideProps = React.HTMLAttributes<HTMLElement> & {
	children?: ReactNode;
};

export type StackProps = {
	className?: string;
	style?: CSSProperties;
	children?: ReactNode;
};

export type FragmentProps = {
	animation?: FragmentAnimation;
	index?: number;
	as?: ElementType;
	className?: string;
	style?: CSSProperties;
	children?: ReactNode;
};

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
