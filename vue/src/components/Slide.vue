<script setup lang="ts">
import { computed, inject, shallowRef, useTemplateRef, watch, useAttrs } from 'vue';
import type { RevealApi } from 'reveal.js';
import type { SlideProps } from '../types';
import { RevealContextKey } from '../reveal-context';
import {
	EMPTY_DATA_ATTRIBUTES_SIGNATURE,
	getDataAttributesSignature,
	getSlideAttributes,
} from '../utils/slide-attributes';

defineOptions({ inheritAttrs: false });

const props = defineProps<SlideProps>();
const attrs = useAttrs();

const deckRef = inject(RevealContextKey, shallowRef<RevealApi | null>(null));
const slideRef = useTemplateRef<HTMLElement>('slideEl');

const lastSyncedDeckRef = shallowRef<RevealApi | null>(null);
const lastSyncedSignatureRef = shallowRef<string | null>(null);

const slideAttributes = computed(() => {
	return getSlideAttributes(attrs, props);
});

const dataAttributesSignature = computed(() => {
	return getDataAttributesSignature(slideAttributes.value);
});

watch([deckRef, dataAttributesSignature, slideRef], ([deck, signature, slide]) => {
	if (!deck || !slide || typeof deck.syncSlide !== 'function') return;

	// The first render for a given deck instance is handled by the parent Deck.sync() pass.
	// syncSlide() is only safe once Reveal is aware of this slide.
	if (!lastSyncedDeckRef.value || lastSyncedDeckRef.value !== deck) {
		lastSyncedDeckRef.value = deck;
		lastSyncedSignatureRef.value = signature;
		return;
	}

	if (signature === EMPTY_DATA_ATTRIBUTES_SIGNATURE) return;

	const sameDeck = lastSyncedDeckRef.value === deck;
	const sameDataAttributes = lastSyncedSignatureRef.value === signature;
	if (sameDeck && sameDataAttributes) return;

	deck.syncSlide(slide);
	lastSyncedDeckRef.value = deck;
	lastSyncedSignatureRef.value = signature;
}, { immediate: true });
</script>

<template>
	<section ref="slideEl" v-bind="slideAttributes">
		<slot />
	</section>
</template>
