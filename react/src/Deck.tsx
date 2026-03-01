import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Reveal from 'reveal.js';
import { RevealContext } from './context';
import type { DeckProps } from './types';

function setRef<T>(ref: React.Ref<T | null> | undefined, value: T | null) {
	if (!ref) return;
	if (typeof ref === 'function') {
		ref(value);
	} else if (typeof ref === 'object') {
		(ref as { current: T | null }).current = value;
	}
}

export function Deck(props: DeckProps) {
	const {
		plugins,
		onReady,
		onSlideChange,
		onSlideTransitionEnd,
		onFragmentShown,
		onFragmentHidden,
		onOverviewShown,
		onOverviewHidden,
		onPaused,
		onResumed,
		deckRef,
		className,
		style,
		children,
		...revealOptions
	} = props;

	const deckDivRef = useRef<HTMLDivElement>(null);
	const revealRef = useRef<Reveal.Api | null>(null);
	const [deck, setDeck] = useState<Reveal.Api | null>(null);

	useEffect(() => {
		if (revealRef.current) return;

		let mounted = true;

		const instance = new Reveal(deckDivRef.current!, {
			...revealOptions,
			plugins: plugins ?? [],
		});
		revealRef.current = instance;

		instance.initialize().then(() => {
			if (!mounted) return;
			setDeck(instance);
			setRef(deckRef, instance);
			onReady?.(instance);
		});

		return () => {
			mounted = false;
			try {
				instance.destroy();
			} catch (e) {
				// Ignore errors during cleanup
			}
			revealRef.current = null;
			setDeck(null);
			setRef(deckRef, null);
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!deck) return;

		const events: [string, ((e: any) => void) | undefined][] = [
			['slidechanged', onSlideChange],
			['slidetransitionend', onSlideTransitionEnd],
			['fragmentshown', onFragmentShown],
			['fragmenthidden', onFragmentHidden],
			['overviewshown', onOverviewShown],
			['overviewhidden', onOverviewHidden],
			['paused', onPaused],
			['resumed', onResumed],
		];

		const bound: [string, (e: any) => void][] = [];
		for (const [name, handler] of events) {
			if (handler) {
				deck.on(name, handler);
				bound.push([name, handler]);
			}
		}

		return () => {
			for (const [name, handler] of bound) {
				deck.off(name, handler);
			}
		};
	}, [
		deck,
		onSlideChange,
		onSlideTransitionEnd,
		onFragmentShown,
		onFragmentHidden,
		onOverviewShown,
		onOverviewHidden,
		onPaused,
		onResumed,
	]);

	useLayoutEffect(() => {
		if (revealRef.current?.isReady()) {
			revealRef.current.sync();
		}
	});

	return (
		<RevealContext.Provider value={deck}>
			<div className={className ? `reveal ${className}` : 'reveal'} style={style} ref={deckDivRef}>
				<div className="slides">{children}</div>
			</div>
		</RevealContext.Provider>
	);
}
