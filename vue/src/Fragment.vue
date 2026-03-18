<script setup lang="ts">
import { computed } from 'vue';
import type { FragmentProps } from './types';

const props = withDefaults(defineProps<FragmentProps>(), {
	as: 'span',
});

const classes = computed(() => {
	return ['fragment', props.animation].filter(Boolean).join(' ');
});
</script>

<template>
	<component :is="as" :class="classes" :data-fragment-index="index">
		<slot />
	</component>
</template>
