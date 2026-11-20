import { useEffect, useLayoutEffect, useRef, useState, type Ref, type RefObject } from 'react';
import Reveal from 'reveal.js';
import type { RevealApi } from 'reveal.js';
import { RevealContext } from '../reveal-context';
import type { DeckProps } from '../types';

const DEFAULT_PLUGINS: NonNullable<DeckProps['plugins']> = [];
type DeckEventHandler = NonNullable<DeckProps['onSync']>;
type SlideStructureNode = number | [number, SlideStructureNode[]];
type CurrentRef<T> = { current: T };

// Shallow-compare config objects so that re-renders where the parent creates a new object
// literal with identical values do not trigger an unnecessary configure() call.
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

function setRef<T>(ref: Ref<T | null> | undefined, value: T | null) {
	if (!ref) return;
	if (typeof ref === 'function') {
		ref(value);
	} else {
		(ref as RefObject<T | null>).current = value;
	}
}

function isSectionElement(element: Element): element is HTMLElement {
	return element.tagName === 'SECTION';
}

function getSectionStructure(
	container: Element,
	slideIds: WeakMap<HTMLElement, number>,
	nextSlideIdRef: CurrentRef<number>
): SlideStructureNode[] {
	return Array.from(container.children)
		.filter(isSectionElement)
		.map((section) => {
			let id = slideIds.get(section);
			if (id === undefined) {
				id = nextSlideIdRef.current++;
				slideIds.set(section, id);
			}

			const childSlides = getSectionStructure(section, slideIds, nextSlideIdRef);
			return childSlides.length > 0 ? [id, childSlides] : id;
		});
}

function getSlidesStructureSignature(
	slidesElement: HTMLElement | null,
	slideIds: WeakMap<HTMLElement, number>,
	nextSlideIdRef: CurrentRef<number>
) {
	if (!slidesElement) return '[]';
	return JSON.stringify(getSectionStructure(slidesElement, slideIds, nextSlideIdRef));
}

export function Deck({
	config,
	plugins = DEFAULT_PLUGINS,
	onReady,
	onSync,
	onSlideSync,
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
	const slidesDivRef = useRef<HTMLDivElement>(null);
	const revealRef = useRef<RevealApi | null>(null);
	const [deck, setDeck] = useState<RevealApi | null>(null);

	// Plugins are init-only in reveal.js; we register them once when creating the instance.
	const initialPluginsRef = useRef<NonNullable<DeckProps['plugins']>>(plugins);

	// configure() performs its own sync in Reveal; this flag prevents us from running an
	// immediate second sync in the next layout effect pass.
	const skipNextSyncRef = useRef(false);

	// Track the last config reference we applied so we can skip redundant configure() calls.
	const appliedConfigRef = useRef<DeckProps['config']>(config);
	const lastSyncedSlidesSignatureRef = useRef<string | null>(null);
	const slideIdsRef = useRef(new WeakMap<HTMLElement, number>());
	const nextSlideIdRef = useRef(1);
	const mountedRef = useRef(false);
	const teardownRequestRef = useRef(0);

	// Create the Reveal instance once on mount and destroy it on unmount.
	useEffect(() => {
		mountedRef.current = true;
		teardownRequestRef.current += 1;

		if (!revealRef.current) {
			const instance = new Reveal(deckDivRef.current!, {
				...config,
				plugins: initialPluginsRef.current,
			});
			// Capture the config that was passed to the constructor so the configure
			// effect can later detect whether anything actually changed.
			appliedConfigRef.current = config;
			revealRef.current = instance;

			instance.initialize().then(() => {
				if (!mountedRef.current || revealRef.current !== instance) return;
				setDeck(instance);
				onReady?.(instance);
			});
		} else if (revealRef.current.isReady()) {
			// React StrictMode unmounts and remounts every effect. On the second mount
			// the instance is already live, so skip construction. The isReady() guard
			// ensures we only expose it once initialization has fully completed.
			setDeck(revealRef.current);
		}

		return () => {
			mountedRef.current = false;
			const instance = revealRef.current;
			if (!instance) return;

			// Defer teardown to the next microtask. In StrictMode the component
			// remounts immediately, incrementing teardownRequestRef before the
			// microtask runs. The stale request number causes the callback to bail
			// out, preventing the instance from being destroyed on a live component.
			const teardownRequest = ++teardownRequestRef.current;
			Promise.resolve().then(() => {
				if (mountedRef.current || teardownRequestRef.current !== teardownRequest) return;
				if (revealRef.current !== instance) return;

				try {
					instance.destroy();
				} catch (e) {
					// Ignore errors during cleanup
				}

				if (revealRef.current === instance) {
					revealRef.current = null;
				}
			});
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
			['slidesync', onSlideSync],
			['slidechanged', onSlideChange],
			['slidetransitionend', onSlideTransitionEnd],
			['fragmentshown', onFragmentShown],
			['fragmenthidden', onFragmentHidden],
			['overviewshown', onOverviewShown],
			['overviewhidden', onOverviewHidden],
			['paused', onPaused],
			['resumed', onResumed],
		];

		const bound = events.filter((e): e is [string, DeckEventHandler] => e[1] != null);
		for (const [name, handler] of bound) {
			deck.on(name, handler);
		}

		return () => {
			for (const [name, handler] of bound) {
				deck.off(name, handler);
			}
		};
	}, [
		deck,
		onSync,
		onSlideSync,
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
		revealRef.current.configure(config ?? {});
		appliedConfigRef.current = config;
	}, [deck, config]);

	// Sync Reveal's internal slide bookkeeping only when the rendered slide
	// structure changes. Avoid triggering sync for child changes.
	useLayoutEffect(() => {
		const shouldSkip = skipNextSyncRef.current;
		skipNextSyncRef.current = false;
		const slidesStructureSignature = getSlidesStructureSignature(
			slidesDivRef.current,
			slideIdsRef.current,
			nextSlideIdRef
		);

		if (shouldSkip) {
			lastSyncedSlidesSignatureRef.current = slidesStructureSignature;
			return;
		}

		if (!revealRef.current?.isReady()) return;
		if (lastSyncedSlidesSignatureRef.current === slidesStructureSignature) return;

		revealRef.current.sync();
		lastSyncedSlidesSignatureRef.current = slidesStructureSignature;
	});

	return (
		<RevealContext.Provider value={deck}>
			<div className={className ? `reveal ${className}` : 'reveal'} style={style} ref={deckDivRef}>
				<div className="slides" ref={slidesDivRef}>
					{children}
				</div>
			</div>
		</RevealContext.Provider>
	);
}
