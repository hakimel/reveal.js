<script setup lang="ts">
import { computed, inject, shallowRef, useTemplateRef, watch, useSlots } from 'vue';
import type { RevealApi } from 'reveal.js';
import type { CodeProps } from '../types';
import { RevealContextKey } from '../reveal-context';

const props = withDefaults(defineProps<CodeProps>(), {
	trim: true,
});

const slots = useSlots();
const deck = inject(RevealContextKey, shallowRef<RevealApi | null>(null));
const codeRef = useTemplateRef<HTMLElement>('codeEl');
let lastHighlightSignature = '';

function normalizeCode(code: string) {
	const lines = code.replace(/\r\n/g, '\n').split('\n');
	while (lines.length && lines[0].trim().length === 0) lines.shift();
	while (lines.length && lines[lines.length - 1].trim().length === 0) lines.pop();
	if (!lines.length) return '';
	const minIndent = lines
		.filter((line) => line.trim().length > 0)
		.reduce(
			(acc, line) => Math.min(acc, line.match(/^\s*/)?.[0].length ?? 0),
			Number.POSITIVE_INFINITY
		);
	return lines.map((line) => line.slice(minIndent)).join('\n');
}

function cleanupGeneratedFragments(block: HTMLElement) {
	const pre = block.parentElement;
	if (!pre) return;
	Array.from(pre.children).forEach((child) => {
		if (
			child !== block &&
			child instanceof HTMLElement &&
			child.tagName === 'CODE' &&
			child.classList.contains('fragment')
		) {
			child.remove();
		}
	});
}

const rawCode = computed(() => {
	if (props.code !== undefined) return props.code;
	const defaultSlot = slots.default?.();
	if (!defaultSlot) return '';
	return defaultSlot
		.map((vnode: any) => {
			if (typeof vnode.children === 'string') return vnode.children;
			return '';
		})
		.join('\n');
});

const normalizedCode = computed(() => (props.trim ? normalizeCode(rawCode.value) : rawCode.value));

const lineNumbersValue = computed(() => {
	if (props.lineNumbers === true) return '';
	if (props.lineNumbers === false || props.lineNumbers == null) return undefined;
	return String(props.lineNumbers);
});

const codeClasses = computed(() => [props.language, props.codeClassName].filter(Boolean).join(' '));

watch(
	[
		deck,
		normalizedCode,
		() => props.language,
		() => props.codeClassName,
		lineNumbersValue,
		() => props.startFrom,
		() => props.noEscape,
		codeRef,
	],
	() => {
		const block = codeRef.value;
		if (!block || !deck.value) return;

		const plugin = deck.value.getPlugin?.('highlight') as any;
		if (!plugin || typeof plugin.highlightBlock !== 'function') return;

		const highlightSignature = [
			normalizedCode.value,
			props.language || '',
			props.codeClassName || '',
			lineNumbersValue.value == null ? '__none__' : `lineNumbers:${lineNumbersValue.value}`,
			props.startFrom == null ? '' : String(props.startFrom),
			props.noEscape ? '1' : '0',
		].join('::');

		if (
			lastHighlightSignature === highlightSignature &&
			block.getAttribute('data-highlighted') === 'yes'
		) {
			return;
		}

		cleanupGeneratedFragments(block);
		block.textContent = normalizedCode.value;
		block.removeAttribute('data-highlighted');
		block.classList.remove('hljs');
		block.classList.remove('has-highlights');

		if (lineNumbersValue.value == null) block.removeAttribute('data-line-numbers');
		else block.setAttribute('data-line-numbers', lineNumbersValue.value);
		if (props.startFrom == null) block.removeAttribute('data-ln-start-from');
		else block.setAttribute('data-ln-start-from', String(props.startFrom));
		if (props.noEscape) block.setAttribute('data-noescape', '');
		else block.removeAttribute('data-noescape');

		plugin.highlightBlock(block);

		const slide = typeof block.closest === 'function' ? block.closest('section') : null;
		if (slide && typeof deck.value.syncFragments === 'function') {
			deck.value.syncFragments(slide as HTMLElement);
		}

		lastHighlightSignature = highlightSignature;
	},
	{ flush: 'post', immediate: true }
);
</script>

<template>
	<pre class="code-wrapper" v-bind="$attrs">
		<code
			ref="codeEl"
			v-bind="props.codeProps"
			:class="codeClasses || undefined"
			:style="props.codeStyle"
			:data-line-numbers="lineNumbersValue"
			:data-ln-start-from="props.startFrom"
			:data-noescape="props.noEscape ? '' : undefined"
		>{{ normalizedCode }}</code>
	</pre>
</template>
