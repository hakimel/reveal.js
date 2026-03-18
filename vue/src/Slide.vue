<script setup lang="ts">
import { computed, inject, onMounted, shallowRef, useTemplateRef, watch } from 'vue';
import type { RevealApi } from 'reveal.js';
import type { SlideProps } from './types';
import { RevealContextKey } from './context';
import type { SlideBackgroundProps, SlideAutoAnimateProps, SlideRevealProps } from './types';

type SlideShorthandProps = SlideBackgroundProps & SlideAutoAnimateProps & SlideRevealProps;

const BOOLEAN_ATTRS = new Set<keyof SlideShorthandProps>([
	'backgroundVideoLoop',
	'backgroundVideoMuted',
	'autoAnimate',
	'autoAnimateRestart',
	'backgroundInteractive',
	'preload',
]);

const SLIDE_DATA_ATTRIBUTES: Record<keyof SlideShorthandProps, `data-${string}`> = {
	background: 'data-background',
	backgroundImage: 'data-background-image',
	backgroundVideo: 'data-background-video',
	backgroundVideoLoop: 'data-background-video-loop',
	backgroundVideoMuted: 'data-background-video-muted',
	backgroundIframe: 'data-background-iframe',
	backgroundColor: 'data-background-color',
	backgroundGradient: 'data-background-gradient',
	backgroundSize: 'data-background-size',
	backgroundPosition: 'data-background-position',
	backgroundRepeat: 'data-background-repeat',
	backgroundOpacity: 'data-background-opacity',
	backgroundTransition: 'data-background-transition',
	visibility: 'data-visibility',
	autoAnimate: 'data-auto-animate',
	autoAnimateId: 'data-auto-animate-id',
	autoAnimateRestart: 'data-auto-animate-restart',
	autoAnimateUnmatched: 'data-auto-animate-unmatched',
	autoAnimateEasing: 'data-auto-animate-easing',
	autoAnimateDuration: 'data-auto-animate-duration',
	autoAnimateDelay: 'data-auto-animate-delay',
	transition: 'data-transition',
	transitionSpeed: 'data-transition-speed',
	autoSlide: 'data-autoslide',
	notes: 'data-notes',
	backgroundInteractive: 'data-background-interactive',
	preload: 'data-preload',
};

const props = defineProps<SlideProps>();

const deckRef = inject(RevealContextKey) ?? shallowRef<RevealApi | null>(null);
const slideRef = useTemplateRef<HTMLElement>('slideEl');

let hasMounted = false;

const slideAttributes = computed(() => {
	const attrs: Record<string, any> = {};

	for (const [propName, dataAttr] of Object.entries(SLIDE_DATA_ATTRIBUTES) as [
		keyof SlideShorthandProps,
		string
	][]) {
		const value = props[propName];
		if (value == null) continue;

		if (BOOLEAN_ATTRS.has(propName)) {
			if (value) attrs[dataAttr] = '';
			continue;
		}

		if (value === false) {
			attrs[dataAttr] = 'false';
			continue;
		}

		attrs[dataAttr] = value;
	}

	return attrs;
});

const dataAttributesSignature = computed(() => {
	return JSON.stringify(
		Object.entries(slideAttributes.value)
			.filter(([key]) => key.startsWith('data-'))
			.sort(([a], [b]) => a.localeCompare(b))
	);
});

onMounted(() => {
	hasMounted = true;
});

watch(dataAttributesSignature, () => {
	if (!hasMounted) return;
	const deck = deckRef.value;
	const slide = slideRef.value;
	if (!deck || !slide || typeof deck.syncSlide !== 'function') return;
	deck.syncSlide(slide);
});
</script>

<template>
	<section ref="slideEl" v-bind="slideAttributes">
		<slot />
	</section>
</template>
