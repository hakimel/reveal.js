<script setup lang="ts">
import { useReveal } from '@revealjs/vue';

const deck = useReveal();

const buttonStyle = {
	padding: '0.55em 0.95em',
	fontSize: '0.7em',
	fontWeight: 600,
	lineHeight: 1.2,
	color: '#ffffff',
	background: 'rgba(8, 13, 24, 0.72)',
	border: '1px solid rgba(255, 255, 255, 0.4)',
	borderRadius: '0.35em',
	cursor: 'pointer',
};
</script>

<template>
	<div style="margin-top: 1em">
		<button :style="buttonStyle" @click="deck?.prev()">Previous</button>
		{{ ' ' }}
		<button :style="buttonStyle" @click="deck?.next()">Next</button>
	</div>
</template>
