<script setup lang="ts">
import { computed, inject, ref, shallowRef, useTemplateRef, watch, onMounted } from 'vue';
import type { RevealApi } from 'reveal.js';
import type { CodeProps } from './types';
import { RevealContextKey } from './context';

type HighlightPlugin = {
	highlightBlock?: (block: HTMLElement) => void;
};

const props = withDefaults(defineProps<CodeProps>(), {
	trim: true,
});

const deckRef = inject(RevealContextKey) ?? shallowRef<RevealApi | null>(null);
const codeRef = useTemplateRef<HTMLElement>('codeEl');
const slotCode = ref('');
let initialContentCaptured = false;

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

const rawCode = computed(() => props.code ?? slotCode.value);
const normalizedCode = computed(() => (props.trim ? normalizeCode(rawCode.value) : rawCode.value));

const lineNumbersValue = computed(() => {
	if (props.lineNumbers === true) return '';
	if (props.lineNumbers === false || props.lineNumbers == null) return undefined;
	return String(props.lineNumbers);
});

const codeClasses = computed(() => [props.language, props.codeClass].filter(Boolean).join(' '));

onMounted(() => {
	if (!props.code && codeRef.value && !initialContentCaptured) {
		slotCode.value = codeRef.value.textContent || '';
		initialContentCaptured = true;
	}
});

function runHighlight() {
	const block = codeRef.value;
	const deck = deckRef?.value;
	if (!block || !deck) return;

	const plugin = (deck as any).getPlugin?.('highlight') as HighlightPlugin | undefined;
	if (!plugin || typeof plugin.highlightBlock !== 'function') return;

	const codeStr = normalizedCode.value;
	const lang = props.language || '';
	const codeCls = props.codeClass || '';
	const lineNums = lineNumbersValue.value;
	const start = props.startFrom;
	const noEsc = props.noEscape;

	const highlightSignature = [
		codeStr,
		lang,
		codeCls,
		lineNums == null ? '__none__' : `lineNumbers:${lineNums}`,
		start == null ? '' : String(start),
		noEsc ? '1' : '0',
	].join('::');

	if (
		lastHighlightSignature === highlightSignature &&
		block.getAttribute('data-highlighted') === 'yes'
	) {
		return;
	}

	cleanupGeneratedFragments(block);
	if (codeStr !== '') block.textContent = codeStr;
	block.removeAttribute('data-highlighted');
	block.classList.remove('hljs');
	block.classList.remove('has-highlights');

	if (lineNums == null) block.removeAttribute('data-line-numbers');
	else block.setAttribute('data-line-numbers', String(lineNums));

	if (start == null) block.removeAttribute('data-ln-start-from');
	else block.setAttribute('data-ln-start-from', String(start));

	if (noEsc) block.setAttribute('data-noescape', '');
	else block.removeAttribute('data-noescape');

	plugin.highlightBlock(block);

	const slide = block.closest('section');
	if (slide && typeof (deck as any).syncFragments === 'function') {
		(deck as any).syncFragments(slide as HTMLElement);
	}

	lastHighlightSignature = highlightSignature;
}

watch(
	[
		codeRef,
		deckRef,
		normalizedCode,
		() => props.language,
		() => props.codeClass,
		lineNumbersValue,
		() => props.startFrom,
		() => props.noEscape,
	],
	() => runHighlight(),
	{ immediate: true, flush: 'post' }
);
</script>

<template>
	<pre class="code-wrapper">
		<code
			ref="codeEl"
			:class="codeClasses || undefined"
			:style="codeStyle"
			:data-line-numbers="lineNumbersValue"
			:data-ln-start-from="startFrom"
			:data-noescape="noEscape ? '' : undefined"
		>{{ props.code ? normalizedCode : undefined }}<slot v-if="!props.code" /></code>
	</pre>
</template>
