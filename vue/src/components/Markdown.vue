<script setup lang="ts">
import {
	computed,
	inject,
	onMounted,
	ref,
	shallowRef,
	useTemplateRef,
	watch,
	watchEffect,
	h,
	defineComponent,
	onUpdated,
	nextTick,
	useSlots,
} from 'vue';
import type { RevealApi } from 'reveal.js';
import type { MarkdownProps } from '../types';
import { RevealContextKey } from '../reveal-context';
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

const props = withDefaults(defineProps<MarkdownProps>(), {
	separator: DEFAULT_SLIDE_SEPARATOR,
	verticalSeparator: DEFAULT_VERTICAL_SEPARATOR,
	notesSeparator: DEFAULT_NOTES_SEPARATOR,
	elementAttributesSeparator: DEFAULT_ELEMENT_ATTRIBUTES_SEPARATOR,
	slideAttributesSeparator: DEFAULT_SLIDE_ATTRIBUTES_SEPARATOR,
});

const slots = useSlots();
const deck = inject(RevealContextKey, shallowRef<RevealApi | null>(null));

const loadedMarkdown = ref<string | null>(null);
const loadError = ref<string | null>(null);

// Fetch markdown source if 'src' is provided
watchEffect((onCleanup) => {
	if (!props.src) {
		loadedMarkdown.value = null;
		loadError.value = null;
		return;
	}

	const abortController = new AbortController();
	loadedMarkdown.value = null;
	loadError.value = null;

	void (async () => {
		try {
			const response = await fetch(props.src!, { signal: abortController.signal });
			if (!response.ok) {
				throw new Error(`HTTP status ${response.status}`);
			}

			const source = props.charset
				? new TextDecoder(props.charset).decode(await response.arrayBuffer())
				: await response.text();

			loadedMarkdown.value = source;
		} catch (error) {
			if (abortController.signal.aborted) return;
			loadError.value = getErrorMessage(error);
		}
	})();

	onCleanup(() => abortController.abort());
});

const slideAttributes = computed(() => {
	// Extract shorthand props to pass them correctly
	const {
		markdown,
		src,
		charset,
		separator,
		verticalSeparator,
		notesSeparator,
		elementAttributesSeparator,
		slideAttributesSeparator,
		options,
		...rest
	} = props;
	return getSlideAttributes({}, rest);
});

const forwardedSectionSignature = computed(() =>
	hashString(getSectionPropsSignature(slideAttributes.value))
);

// Inner component for individual markdown slides
const MarkdownLeafSection = defineComponent({
	props: ['html', 'elementAttributesSeparator', 'slideAttributesSeparator', 'sectionProps'],
	setup(innerProps) {
		const deckApi = inject(RevealContextKey, shallowRef<RevealApi | null>(null));
		const sectionRef = useTemplateRef<HTMLElement>('sectionEl');

		const applyAttributes = () => {
			const section = sectionRef.value;
			if (!section) return;
			addAttributes(
				section,
				section,
				null,
				innerProps.elementAttributesSeparator,
				innerProps.slideAttributesSeparator
			);
		};

		const highlight = () => {
			const section = sectionRef.value;
			if (!section || !deckApi?.value) return;

			const plugin = deckApi.value.getPlugin?.('highlight') as any;
			const highlightBlock = plugin?.highlightBlock;
			if (typeof highlightBlock !== 'function') return;

			let highlightedBlockCount = 0;
			Array.from(section.querySelectorAll<HTMLElement>('pre code')).forEach((block) => {
				if (block.getAttribute('data-highlighted') === 'yes') return;
				highlightBlock(block);
				highlightedBlockCount += 1;
			});

			const syncFragments = deckApi.value.syncFragments;
			if (highlightedBlockCount > 0 && typeof syncFragments === 'function') {
				syncFragments(section);
			}
		};

		onMounted(() => {
			applyAttributes();
			highlight();
		});

		onUpdated(() => {
			applyAttributes();
			highlight();
		});

		watch(
			deckApi,
			() => {
				highlight();
			},
			{ flush: 'post' }
		);

		return () =>
			h('section', {
				ref: 'sectionEl',
				...innerProps.sectionProps,
				innerHTML: innerProps.html,
			});
	},
});

const renderedNodes = computed(() => {
	if (props.src && loadError.value) return null;
	if (props.src && loadedMarkdown.value == null) return null;

	// Get children content as a string if no markdown prop
	let rawSource = '';
	if (props.markdown) {
		rawSource = props.markdown;
	} else if (props.src) {
		rawSource = loadedMarkdown.value || '';
	} else {
		// Concatenate children text content if they exist
		// In Vue, extracting raw text from slot is tricky, but usually users pass a string to markdown prop.
		// We'll support children only if they are text nodes.
		const defaultSlot = slots.default?.();
		if (defaultSlot) {
			rawSource = defaultSlot
				.map((vnode: any) => {
					if (typeof vnode.children === 'string') return vnode.children;
					if (Array.isArray(vnode.children)) return ''; // Recursive call omitted for simplicity
					return '';
				})
				.join('\n');
		}
	}

	const source = normalizeMarkdownSource(rawSource);

	try {
		const markedInstance = createMarkedInstance(props.options);
		return buildMarkdownNodes(
			source,
			markedInstance,
			props.separator,
			props.verticalSeparator,
			props.notesSeparator
		);
	} catch (e) {
		throw new Error(`Failed to parse markdown: ${getErrorMessage(e)}`);
	}
});

const attributeSeparatorSignature = computed(() =>
	hashString(`${props.elementAttributesSeparator}\0${props.slideAttributesSeparator}`)
);
</script>

<template>
	<template v-if="props.src && loadError">
		<section data-state="alert">
			ERROR: The attempt to fetch {{ props.src }} failed. {{ loadError }}.
			<p>Remember that you need to serve the presentation from an HTTP server.</p>
		</section>
	</template>
	<template v-else-if="renderedNodes">
		<template v-for="node in renderedNodes" :key="node.key">
			<template v-if="node.type === 'slide'">
				<MarkdownLeafSection
					:key="`${
						node.key
					}-${forwardedSectionSignature}-${attributeSeparatorSignature}-${hashString(
						node.slide.html
					)}`"
					:html="node.slide.html"
					:element-attributes-separator="elementAttributesSeparator"
					:slide-attributes-separator="slideAttributesSeparator"
					:section-props="slideAttributes"
				/>
			</template>
			<section v-else :key="`${node.key}-${forwardedSectionSignature}`" v-bind="slideAttributes">
				<MarkdownLeafSection
					v-for="slide in node.slides"
					:key="`${slide.key}-${attributeSeparatorSignature}-${hashString(slide.html)}`"
					:html="slide.html"
					:element-attributes-separator="elementAttributesSeparator"
					:slide-attributes-separator="slideAttributesSeparator"
				/>
			</section>
		</template>
	</template>
</template>
