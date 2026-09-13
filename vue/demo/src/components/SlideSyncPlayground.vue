<script setup lang="ts">
import { ref } from 'vue';
import { Slide } from '@revealjs/vue';

const count = ref(0);
const slideColor = ref('#1b1f2a');

function randomColor() {
	const value = Math.floor(Math.random() * 0xffffff)
		.toString(16)
		.padStart(6, '0');
	return `#${value}`;
}

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
	<Slide :background="slideColor">
		<h2>Slide-local HTML updates</h2>
		<p>
			This slide updates only its own Vue-rendered HTML, without manually calling
			<code>sync</code> or <code>syncSlide</code>.
		</p>
		<div>
			<div style="margin-bottom: 0.75em">
				<button :style="buttonStyle" @click="count++">Increase count</button>
				{{ ' ' }}
				<button :style="buttonStyle" @click="slideColor = randomColor()">
					Randomize background
				</button>
			</div>
			<p><strong>Current count: </strong>{{ count }}</p>
			<p><strong>Slide color: </strong>{{ slideColor }}</p>
		</div>
	</Slide>
</template>
