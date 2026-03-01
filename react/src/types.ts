import type { CSSProperties, ReactNode, ElementType, Ref } from 'react';
import type Reveal from 'reveal.js';

type RevealConfig = NonNullable<Parameters<Reveal.Api['initialize']>[0]>;

export type DeckProps = Omit<RevealConfig, 'plugins'> & {
	plugins?: any[];
	onReady?: (deck: Reveal.Api) => void;
	onSlideChange?: (event: any) => void;
	onSlideTransitionEnd?: (event: any) => void;
	onFragmentShown?: (event: any) => void;
	onFragmentHidden?: (event: any) => void;
	onOverviewShown?: () => void;
	onOverviewHidden?: () => void;
	onPaused?: () => void;
	onResumed?: () => void;
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
