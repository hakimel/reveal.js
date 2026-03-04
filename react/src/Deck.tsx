import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Reveal from 'reveal.js';
import { RevealContext } from './context';
import type { DeckProps } from './types';

const DEFAULT_PLUGINS: NonNullable<DeckProps['plugins']> = [];
type DeckEventHandler = NonNullable<DeckProps['onSync']>;

function hasShallowConfigChanges(prev: DeckProps['config'], next: DeckProps['config']) {
	if (prev === next) return false;
	if (!prev || !next) return prev !== next;

	const prevKeys = Object.keys(prev);
	const nextKeys = Object.keys(next);

	if (prevKeys.length !== nextKeys.length) return true;

	for (const key of prevKeys) {
		if (!(key in next)) return true;
		if ((prev as Record<string, unknown>)[key] !== (next as Record<string, unknown>)[key]) {
			return true;
		}
	}

	return false;
}

function setRef<T>(ref: React.Ref<T | null> | undefined, value: T | null) {
	if (!ref) return;
	if (typeof ref === 'function') {
		ref(value);
	} else if (typeof ref === 'object') {
		(ref as { current: T | null }).current = value;
	}
}

export function Deck({
	config,
	plugins = DEFAULT_PLUGINS,
	onReady,
	onSync,
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
}: DeckProps) {
	const deckDivRef = useRef<HTMLDivElement>(null);
	const revealRef = useRef<Reveal.Api | null>(null);
	const [deck, setDeck] = useState<Reveal.Api | null>(null);

	// Plugins are init-only in reveal.js; we register them once when creating the instance.
	const initialPluginsRef = useRef<NonNullable<DeckProps['plugins']>>(plugins);

	// configure() performs its own sync in Reveal; this flag prevents us from running an
	// immediate second sync in the next layout effect pass.
	const skipNextSyncRef = useRef(false);

	// Track the last config reference we applied so we can skip redundant configure() calls.
	const appliedConfigRef = useRef<DeckProps['config']>(config);

	// Create the Reveal instance once on mount and destroy it on unmount.
	useEffect(() => {
		if (revealRef.current) return;

		let mounted = true;

		const instance = new Reveal(deckDivRef.current!, {
			...config,
			plugins: initialPluginsRef.current,
		});
		appliedConfigRef.current = config;
		revealRef.current = instance;

		instance.initialize().then(() => {
			if (!mounted) return;
			setDeck(instance);
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
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// Keep consumer refs in sync, including when the ref prop itself changes.
	useEffect(() => {
		setRef(deckRef, deck);
		return () => setRef(deckRef, null);
	}, [deckRef, deck]);

	// Attach and detach Reveal event listeners from the provided callbacks.
	useEffect(() => {
		if (!deck) return;

		const events: [string, DeckEventHandler | undefined][] = [
			['sync', onSync],
			['slidechanged', onSlideChange],
			['slidetransitionend', onSlideTransitionEnd],
			['fragmentshown', onFragmentShown],
			['fragmenthidden', onFragmentHidden],
			['overviewshown', onOverviewShown],
			['overviewhidden', onOverviewHidden],
			['paused', onPaused],
			['resumed', onResumed],
		];

		const bound: [string, DeckEventHandler][] = [];
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
		onSync,
		onSlideChange,
		onSlideTransitionEnd,
		onFragmentShown,
		onFragmentHidden,
		onOverviewShown,
		onOverviewHidden,
		onPaused,
		onResumed,
	]);

	// Re-apply config after init and mark that configure already performed a sync.
	useLayoutEffect(() => {
		if (!deck || !revealRef.current?.isReady()) return;
		if (!hasShallowConfigChanges(appliedConfigRef.current, config)) return;

		skipNextSyncRef.current = true;
		revealRef.current.configure({
			...config,
		});
		appliedConfigRef.current = config;
	}, [deck, config]);

	// Sync Reveal's internal slide bookkeeping after React renders unless configure already did.
	useLayoutEffect(() => {
		if (revealRef.current?.isReady()) {
			if (skipNextSyncRef.current) {
				skipNextSyncRef.current = false;
				return;
			}
			revealRef.current.sync();
		}
	}, [deck, children, config]);

	return (
		<RevealContext.Provider value={deck}>
			<div className={className ? `reveal ${className}` : 'reveal'} style={style} ref={deckDivRef}>
				<div className="slides">{children}</div>
			</div>
		</RevealContext.Provider>
	);
}
