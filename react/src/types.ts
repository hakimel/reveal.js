import type { CSSProperties, ReactNode, ElementType, Ref } from 'react';
import type Reveal from 'reveal.js';

type RevealConfig = NonNullable<Parameters<Reveal.Api['initialize']>[0]>;
type RevealPlugin = Reveal.Plugin | Reveal.PluginFunction;
type RevealEventHandler = Parameters<Reveal.Api['on']>[1];

export type DeckProps = {
	config?: Omit<RevealConfig, 'plugins'>;
	/** Registered during deck initialization only. Subsequent prop updates are ignored. */
	plugins?: RevealPlugin[];
	onReady?: (deck: Reveal.Api) => void;
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
	deckRef?: Ref<Reveal.Api | null>;
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
	animation?: Reveal.FragmentAnimation;
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
