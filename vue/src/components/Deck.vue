<script setup lang="ts">
import {
	ref,
	watch,
	onMounted,
	onUnmounted,
	provide,
	shallowRef,
	useTemplateRef,
	computed,
	watchEffect,
	onUpdated,
} from 'vue';
import Reveal, { type RevealApi } from 'reveal.js';
import type { DeckProps } from '../types';
import { RevealContextKey } from '../reveal-context';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DeckProps>(), {
	plugins: () => [],
});

const emit = defineEmits<{
	(e: 'ready', deck: RevealApi): void;
	(e: 'sync', event: any): void;
	(e: 'slideSync', event: any): void;
	(e: 'slideChanged', event: any): void;
	(e: 'slideTransitionEnd', event: any): void;
	(e: 'fragmentShown', event: any): void;
	(e: 'fragmentHidden', event: any): void;
	(e: 'overviewShown', event: any): void;
	(e: 'overviewHidden', event: any): void;
	(e: 'paused', event: any): void;
	(e: 'resumed', event: any): void;
}>();

const deckClasses = computed(() => {
	return ['reveal', props.class].flat().filter(Boolean);
});

const deckDivRef = useTemplateRef<HTMLDivElement>('deckEl');
const slidesDivRef = useTemplateRef<HTMLDivElement>('slidesEl');
const revealRef = shallowRef<RevealApi | null>(null);

const initialPlugins = [...props.plugins];
const skipNextSync = ref(false);

const slideIds = new WeakMap<HTMLElement, number>();
let nextSlideId = 1;
const lastSyncedSlidesSignature = ref<string | null>(null);
const appliedConfig = ref(props.config);

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
		if ((prev as any)[key] !== (next as any)[key]) return true;
	}
	return false;
}

function getSectionStructure(container: Element): any[] {
	return Array.from(container.children)
		.filter((el) => el.tagName === 'SECTION')
		.map((section) => {
			let id = slideIds.get(section as HTMLElement);
			if (id === undefined) {
				id = nextSlideId++;
				slideIds.set(section as HTMLElement, id);
			}
			const children = getSectionStructure(section);
			return children.length > 0 ? [id, children] : id;
		});
}

function getSlidesStructureSignature(slidesElement: HTMLElement | null) {
	if (!slidesElement) return '[]';
	return JSON.stringify(getSectionStructure(slidesElement));
}

let teardownRequest = 0;
let mounted = false;

// Event handling — stable handler references so off() removes the same function on() registered
const eventMap: [string, (e: any) => void][] = [
	['sync', (e: any) => emit('sync', e)],
	['slidesync', (e: any) => emit('slideSync', e)],
	['slidechanged', (e: any) => emit('slideChanged', e)],
	['slidetransitionend', (e: any) => emit('slideTransitionEnd', e)],
	['fragmentshown', (e: any) => emit('fragmentShown', e)],
	['fragmenthidden', (e: any) => emit('fragmentHidden', e)],
	['overviewshown', (e: any) => emit('overviewShown', e)],
	['overviewhidden', (e: any) => emit('overviewHidden', e)],
	['paused', (e: any) => emit('paused', e)],
	['resumed', (e: any) => emit('resumed', e)],
];

watch(revealRef, (deck, oldDeck) => {
	if (oldDeck) {
		for (const [name, handler] of eventMap) oldDeck.off(name, handler);
	}
	if (deck) {
		for (const [name, handler] of eventMap) deck.on(name, handler);
	}
});

onMounted(() => {
	mounted = true;
	teardownRequest++;

	if (deckDivRef.value) {
		const instance = new Reveal(deckDivRef.value, {
			...props.config,
			plugins: initialPlugins,
		});
		appliedConfig.value = props.config;
		revealRef.value = instance;

		instance.initialize().then(() => {
			if (!mounted || revealRef.value !== instance) return;
			lastSyncedSlidesSignature.value = getSlidesStructureSignature(slidesDivRef.value);
			emit('ready', instance);
		});

		const observer = new MutationObserver(() => performSync());
		if (slidesDivRef.value) {
			observer.observe(slidesDivRef.value, { childList: true, subtree: true });
		}
		onUnmounted(() => observer.disconnect());
	}
});

onUnmounted(() => {
	mounted = false;
	const instance = revealRef.value;
	if (!instance) return;

	// Remove event listeners immediately — watchers are already stopped at this point
	for (const [name, handler] of eventMap) instance.off(name, handler);

	const currentRequest = ++teardownRequest;
	Promise.resolve().then(() => {
		if (mounted || teardownRequest !== currentRequest) return;
		try {
			instance.destroy();
		} catch (e) {}
		if (revealRef.value === instance) {
			revealRef.value = null;
		}
	});
});

// Sync deckRef prop if provided
watchEffect(() => {
	if (props.deckRef) {
		props.deckRef.value = revealRef.value;
	}
});

// Config updates
watch(
	() => props.config,
	(newConfig) => {
		if (!revealRef.value || !revealRef.value.isReady()) return;
		if (!hasShallowConfigChanges(appliedConfig.value, newConfig)) return;

		skipNextSync.value = true;
		revealRef.value.configure(newConfig ?? {});
		appliedConfig.value = newConfig;
	},
	{ deep: false }
);

// Structure Sync
function performSync() {
	const shouldSkip = skipNextSync.value;
	skipNextSync.value = false;
	const signature = getSlidesStructureSignature(slidesDivRef.value);

	if (shouldSkip) {
		lastSyncedSlidesSignature.value = signature;
		return;
	}

	if (!revealRef.value || !revealRef.value.isReady()) return;
	if (lastSyncedSlidesSignature.value === signature) return;

	revealRef.value.sync();
	lastSyncedSlidesSignature.value = signature;
}

onUpdated(performSync);
</script>

<template>
	<div :class="deckClasses" :style="props.style" ref="deckEl">
		<div class="slides" ref="slidesEl">
			<slot />
		</div>
	</div>
</template>
