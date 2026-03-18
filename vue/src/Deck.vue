<script setup lang="ts">
import {
	ref,
	watch,
	onMounted,
	onUnmounted,
	provide,
	shallowRef,
	useAttrs,
	useTemplateRef,
	computed,
} from 'vue';
import Reveal, { type RevealApi } from 'reveal.js';
import type { DeckProps, DeckEmits } from './types';
import { RevealContextKey } from './context';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DeckProps>(), {
	plugins: () => [],
});

const emit = defineEmits<DeckEmits>();
const attrs = useAttrs();

const revealClasses = computed(() => {
	const base = 'reveal';
	const extra = attrs.class;
	if (!extra) return base;
	if (typeof extra === 'string') return `${base} ${extra}`;
	if (Array.isArray(extra)) return [base, ...extra];
	return [base, extra];
});

const deckDivRef = useTemplateRef<HTMLDivElement>('deckEl');
const slidesDivRef = useTemplateRef<HTMLDivElement>('slidesEl');
const revealRef = shallowRef<RevealApi | null>(null);
const isReady = ref(false);

const initialPlugins = [...props.plugins];
const skipNextSyncCount = ref(0);

const slideIds = new WeakMap<HTMLElement, number>();
let nextSlideId = 1;
let lastSyncedSlidesSignature: string | null = null;
let currentConfig = { ...props.config };
let observer: MutationObserver | null = null;
let boundEventHandlers: Array<{ name: string; handler: (e: any) => void }> = [];

provide(RevealContextKey, revealRef);

defineExpose({
	reveal: revealRef,
});

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

function isSectionElement(element: Element): element is HTMLElement {
	return element.tagName === 'SECTION';
}

function getSectionStructure(
	container: Element,
	slideIdsMap: WeakMap<HTMLElement, number>
): (number | [number, any])[] {
	return Array.from(container.children)
		.filter(isSectionElement)
		.map((section) => {
			let id = slideIdsMap.get(section);
			if (id === undefined) {
				id = nextSlideId++;
				slideIdsMap.set(section, id);
			}

			const childSlides = getSectionStructure(section, slideIdsMap);
			return childSlides.length > 0 ? [id, childSlides] : id;
		});
}

function getSlidesStructureSignature(
	slidesElement: HTMLElement | null,
	slideIdsMap: WeakMap<HTMLElement, number>
) {
	if (!slidesElement) return '[]';
	return JSON.stringify(getSectionStructure(slidesElement, slideIdsMap));
}

function wireEvents(deck: RevealApi) {
	const events: [string, string][] = [
		['sync', 'sync'],
		['slidesync', 'slideSync'],
		['slidechanged', 'slideChanged'],
		['slidetransitionend', 'slideTransitionEnd'],
		['fragmentshown', 'fragmentShown'],
		['fragmenthidden', 'fragmentHidden'],
		['overviewshown', 'overviewShown'],
		['overviewhidden', 'overviewHidden'],
		['paused', 'paused'],
		['resumed', 'resumed'],
	];

	for (const [name, emitName] of events) {
		const handler = (e: any) => (emit as any)(emitName, e);
		deck.on(name, handler);
		boundEventHandlers.push({ name, handler });
	}
}

function unwireEvents(deck: RevealApi) {
	for (const { name, handler } of boundEventHandlers) {
		deck.off(name, handler);
	}
	boundEventHandlers = [];
}

onMounted(() => {
	if (!deckDivRef.value) return;

	const instance = new Reveal(deckDivRef.value, {
		...props.config,
		plugins: initialPlugins,
	});

	revealRef.value = instance;

	instance.initialize().then(() => {
		if (revealRef.value !== instance) return;
		lastSyncedSlidesSignature = getSlidesStructureSignature(slidesDivRef.value, slideIds);
		isReady.value = true;
		wireEvents(instance);
		emit('ready', instance);
	});

	observer = new MutationObserver(() => {
		const shouldSkip = skipNextSyncCount.value > 0;
		if (shouldSkip) {
			skipNextSyncCount.value--;
		}

		const signature = getSlidesStructureSignature(slidesDivRef.value, slideIds);

		if (shouldSkip) {
			lastSyncedSlidesSignature = signature;
			return;
		}

		if (!isReady.value || !revealRef.value) return;
		if (lastSyncedSlidesSignature === signature) return;

		revealRef.value.sync();
		lastSyncedSlidesSignature = signature;
	});

	if (slidesDivRef.value) {
		observer.observe(slidesDivRef.value, { childList: true, subtree: true });
	}
});

onUnmounted(() => {
	const instance = revealRef.value;
	if (observer) {
		observer.disconnect();
	}

	if (!instance) return;

	unwireEvents(instance);

	try {
		instance.destroy();
	} catch (e) {
		// Ignore errors during cleanup
	}

	if (revealRef.value === instance) {
		revealRef.value = null;
		isReady.value = false;
	}
});

watch(
	() => props.config,
	(newConfig) => {
		if (!isReady.value || !revealRef.value) return;
		if (!hasShallowConfigChanges(currentConfig, newConfig)) return;

		skipNextSyncCount.value++;
		revealRef.value.configure(newConfig ?? {});
		currentConfig = { ...newConfig };
	},
	{ deep: false }
);
</script>

<template>
	<div :class="revealClasses" :style="(attrs.style as any)" ref="deckEl">
		<div class="slides" ref="slidesEl">
			<slot />
		</div>
	</div>
</template>
