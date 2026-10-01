<script setup lang="ts">
import { useSlots } from 'vue';

const slots = useSlots();
</script>

<template>
	<div style="display: flex; flex-direction: row">
		<div v-for="(child, index) in slots.default?.()" :key="index" style="flex: 1">
			<component :is="child" />
		</div>
	</div>
</template>
