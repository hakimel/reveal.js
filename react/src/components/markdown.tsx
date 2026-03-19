import {
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type HTMLAttributes,
} from 'react';
import type { MarkdownProps } from '../types';
import { RevealContext } from '../reveal-context';
import { getSlideAttributes } from '../utils/slide-attributes';
import {
	DEFAULT_ELEMENT_ATTRIBUTES_SEPARATOR,
	DEFAULT_NOTES_SEPARATOR,
	DEFAULT_SLIDE_ATTRIBUTES_SEPARATOR,
	DEFAULT_SLIDE_SEPARATOR,
	DEFAULT_VERTICAL_SEPARATOR,
	addAttributes,
	buildMarkdownNodes,
	createMarkedInstance,
	getErrorMessage,
	getSectionPropsSignature,
	hashString,
	normalizeMarkdownSource,
} from '../utils/markdown';

type MarkdownLeafSectionProps = {
	html: string;
	elementAttributesSeparator: string;
	slideAttributesSeparator: string;
	sectionProps?: HTMLAttributes<HTMLElement>;
};

type HighlightPlugin = {
	highlightBlock?: (block: HTMLElement) => void;
};

function MarkdownLeafSection({
	html,
	elementAttributesSeparator,
	slideAttributesSeparator,
	sectionProps,
}: MarkdownLeafSectionProps) {
	const deck = useContext(RevealContext);
	const sectionRef = useRef<HTMLElement>(null);

	useLayoutEffect(() => {
		const section = sectionRef.current;
		if (!section) return;

		// React renders the raw HTML for us, then we run the same comment-based
		// attribute pass as the core plugin to support `.slide:` and `.element:`.
		addAttributes(section, section, null, elementAttributesSeparator, slideAttributesSeparator);
	}, [html, elementAttributesSeparator, slideAttributesSeparator]);

	useLayoutEffect(() => {
		const section = sectionRef.current;
		if (!section) return;

		const plugin = deck?.getPlugin?.('highlight') as HighlightPlugin | undefined;
		const highlightBlock = plugin?.highlightBlock;
		if (typeof highlightBlock !== 'function') return;

		let highlightedBlockCount = 0;
		Array.from(section.querySelectorAll<HTMLElement>('pre code')).forEach((block) => {
			if (block.getAttribute('data-highlighted') === 'yes') return;
			highlightBlock(block);
			highlightedBlockCount += 1;
		});

		const syncFragments = deck?.syncFragments;
		if (highlightedBlockCount > 0 && typeof syncFragments === 'function') {
			syncFragments(section);
		}
	});

	return <section ref={sectionRef} {...sectionProps} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Markdown({
	children,
	markdown,
	src,
	charset,
	separator = DEFAULT_SLIDE_SEPARATOR,
	verticalSeparator = DEFAULT_VERTICAL_SEPARATOR,
	notesSeparator = DEFAULT_NOTES_SEPARATOR,
	elementAttributesSeparator = DEFAULT_ELEMENT_ATTRIBUTES_SEPARATOR,
	slideAttributesSeparator = DEFAULT_SLIDE_ATTRIBUTES_SEPARATOR,
	options,
	background,
	backgroundImage,
	backgroundVideo,
	backgroundVideoLoop,
	backgroundVideoMuted,
	backgroundIframe,
	backgroundColor,
	backgroundGradient,
	backgroundSize,
	backgroundPosition,
	backgroundRepeat,
	backgroundOpacity,
	backgroundTransition,
	visibility,
	autoAnimate,
	autoAnimateId,
	autoAnimateRestart,
	autoAnimateUnmatched,
	autoAnimateEasing,
	autoAnimateDuration,
	autoAnimateDelay,
	transition,
	transitionSpeed,
	autoSlide,
	notes,
	backgroundInteractive,
	preload,
	...rest
}: MarkdownProps) {
	const [loadedMarkdown, setLoadedMarkdown] = useState<string | null>(null);
	const [loadError, setLoadError] = useState<string | null>(null);

	useEffect(() => {
		if (!src) {
			setLoadedMarkdown(null);
			setLoadError(null);
			return;
		}

		const abortController = new AbortController();
		setLoadedMarkdown(null);
		setLoadError(null);

		void (async () => {
			try {
				const response = await fetch(src, { signal: abortController.signal });
				if (!response.ok) {
					throw new Error(`HTTP status ${response.status}`);
				}

				const source = charset
					? new TextDecoder(charset).decode(await response.arrayBuffer())
					: await response.text();

				setLoadedMarkdown(source);
			} catch (error) {
				if (abortController.signal.aborted) return;
				setLoadError(getErrorMessage(error));
			}
		})();

		return () => abortController.abort();
	}, [src, charset]);

	const slideAttributes = getSlideAttributes(rest, {
		background,
		backgroundImage,
		backgroundVideo,
		backgroundVideoLoop,
		backgroundVideoMuted,
		backgroundIframe,
		backgroundColor,
		backgroundGradient,
		backgroundSize,
		backgroundPosition,
		backgroundRepeat,
		backgroundOpacity,
		backgroundTransition,
		visibility,
		autoAnimate,
		autoAnimateId,
		autoAnimateRestart,
		autoAnimateUnmatched,
		autoAnimateEasing,
		autoAnimateDuration,
		autoAnimateDelay,
		transition,
		transitionSpeed,
		autoSlide,
		notes,
		backgroundInteractive,
		preload,
	});
	const forwardedSectionSignature = hashString(getSectionPropsSignature(slideAttributes));

	if (src && loadError) {
		return (
			<section data-state="alert">
				{`ERROR: The attempt to fetch ${src} failed. ${loadError}.`}
				<p>Remember that you need to serve the presentation from an HTTP server.</p>
			</section>
		);
	}

	if (src && loadedMarkdown == null) {
		return null;
	}

	const source = src ? loadedMarkdown || '' : normalizeMarkdownSource(markdown ?? children ?? '');

	try {
		const markedInstance = createMarkedInstance(options);
		const nodes = buildMarkdownNodes(
			source,
			markedInstance,
			separator,
			verticalSeparator,
			notesSeparator
		);
		const attributeSeparatorSignature = hashString(
			`${elementAttributesSeparator}\0${slideAttributesSeparator}`
		);

		return (
			<>
				{nodes.map((node) => {
					if (node.type === 'slide') {
						return (
							<MarkdownLeafSection
								key={`${node.key}-${forwardedSectionSignature}-${attributeSeparatorSignature}-${hashString(node.slide.html)}`}
								html={node.slide.html}
								elementAttributesSeparator={elementAttributesSeparator}
								slideAttributesSeparator={slideAttributesSeparator}
								sectionProps={slideAttributes}
							/>
						);
					}

					return (
						<section key={`${node.key}-${forwardedSectionSignature}`} {...slideAttributes}>
							{node.slides.map((slide) => (
								<MarkdownLeafSection
									key={`${slide.key}-${attributeSeparatorSignature}-${hashString(slide.html)}`}
									html={slide.html}
									elementAttributesSeparator={elementAttributesSeparator}
									slideAttributesSeparator={slideAttributesSeparator}
								/>
							))}
						</section>
					);
				})}
			</>
		);
	} catch (error) {
		return (
			<section data-state="alert">
				{`ERROR: Failed to parse markdown. ${getErrorMessage(error)}.`}
			</section>
		);
	}
}
