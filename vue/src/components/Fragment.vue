<script setup lang="ts">
import { computed, useSlots, h, cloneVNode } from 'vue';
import type { FragmentProps } from '../types';

const props = defineProps<FragmentProps>();
const slots = useSlots();

const classes = computed(() => {
	const base = ['fragment', props.animation];
	if (props.class) base.push(props.class);
	return base.filter(Boolean);
});

// Since we are using render function logic for asChild, we define a small render component
function renderContent() {
	if (props.asChild) {
		const children = slots.default?.();
		if (!children || children.length !== 1) {
			throw new Error('Fragment with asChild expects exactly one child.');
		}
		const child = children[0];
		return cloneVNode(child, {
			class: [child.props?.class, classes.value],
			style: [child.props?.style, props.style],
			'data-fragment-index': props.index,
		});
	}

	const Tag = props.as ?? 'span';
	return h(
		Tag,
		{
			class: classes.value,
			style: props.style,
			'data-fragment-index': props.index,
		},
		slots.default?.()
	);
}
</script>

<template>
	<component :is="renderContent" />
</template>
