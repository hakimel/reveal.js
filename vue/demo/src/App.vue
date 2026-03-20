<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Deck, Slide, Stack, Markdown, Fragment, Code } from '@revealjs/vue';

import RevealHighlight from 'reveal.js/plugin/highlight';
import RevealNotes from 'reveal.js/plugin/notes';

import Columns from './components/Columns.vue';
import NavigationControls from './components/NavigationControls.vue';
import SlideSyncPlayground from './components/SlideSyncPlayground.vue';

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

const showBonus = ref(false);
const controls = ref(true);

onMounted(() => {
	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'c' && !e.ctrlKey && !e.metaKey && !e.altKey) {
			controls.value = !controls.value;
		}
	};
	window.addEventListener('keydown', onKeyDown);
	onUnmounted(() => window.removeEventListener('keydown', onKeyDown));
});

const onReady = (deck: any) => console.log('Deck ready!', deck);
const onSync = () => console.log('Deck synced');
const onSlideSync = (e: any) => console.log('Slide synced', e.slide);
const onSlideChange = () => console.log('Slide changed');
</script>

<template>
	<Deck
		:config="{
			width: 1280,
			height: 720,
			transition: 'slide',
			hash: true,
			controls,
		}"
		:plugins="[RevealHighlight, RevealNotes]"
		@ready="onReady"
		@sync="onSync"
		@slide-sync="onSlideSync"
		@slide-changed="onSlideChange"
	>
		<Slide>
			<h1>@revealjs/vue</h1>
			<p>Vue 3 wrapper for reveal.js</p>
		</Slide>

		<Stack>
			<Slide background="indigo">
				<h2>Vertical Stack</h2>
				<p>Press down to navigate</p>
				<Code language="html">
					{{ `
					<Stack>
						<Slide background="indigo">
							<h2>Vertical Stack</h2>
							<p>Press down to navigate</p>
						</Slide>
						<Slide background="indigo">
							<h2>Stack Slide 2</h2>
							<p>Vertical navigation works!</p>
						</Slide>
					</Stack>
					` }}
				</Code>
			</Slide>
			<Slide background="indigo">
				<h2>Stack Slide 2</h2>
				<p>Vertical navigation works!</p>
			</Slide>
		</Stack>

		<Slide>
			<Columns>
				<div style="text-align: left">
					<h2>API Hook</h2>
					<p>Components inside slides can access the reveal.js API via the useReveal() hook.</p>
					<NavigationControls />
				</div>
				<div>
					<Code language="javascript" line-numbers="1|4">
						{{
							`
						const deck = useReveal();

						function nextSlide() {
							deck.value?.next();
						}
						`
						}}
					</Code>
				</div>
			</Columns>
		</Slide>

		<SlideSyncPlayground />

		<Slide>
			<h2>Dynamic Slides</h2>
			<p>Add slides at runtime — sync() handles it</p>
			<button :style="buttonStyle" @click="showBonus = !showBonus">
				{{ showBonus ? 'Remove' : 'Add' }} bonus slide
			</button>
		</Slide>

		<Slide v-if="showBonus" data-background="#2d2d8c">
			<h2>Bonus Slide!</h2>
			<p>Dynamically added via Vue state</p>
		</Slide>

		<Slide data-background="#000">
			<h2>Fragments</h2>
			<Columns>
				<div>
					<Fragment animation="fade-up">
						<p>This appears first</p>
					</Fragment>
					<Fragment animation="fade-up">
						<p>Then this</p>
					</Fragment>
					<Fragment animation="highlight-red" as-child>
						<p>And this gets highlighted</p>
					</Fragment>
				</div>
				<div>
					<Code language="html">
						{{ `
						<Fragment animation="fade-up">
							<p>This appears first</p>
						</Fragment>
						<Fragment animation="fade-up">
							<p>Then this</p>
						</Fragment>
						<Fragment animation="highlight-red">
							<p>And this gets highlighted</p>
						</Fragment>
						` }}
					</Code>
				</div>
			</Columns>
		</Slide>

		<Slide auto-animate>
			<h1>Auto-animate</h1>
			<p>This slide is animated automatically</p>
		</Slide>

		<Slide auto-animate>
			<h1 style="opacity: 0.4">Auto-animate</h1>
			<Code language="html">
				{{ `
				<Slide auto-animate>
					<h1>Auto-animate</h1>
					<p>This slide is animated automatically</p>
				</Slide>
				` }}
			</Code>
			<p style="opacity: 0.4">This slide is animated automatically</p>
		</Slide>

		<Markdown
			separator="^\n---\n$"
			vertical-separator="^\n--\n$"
			:options="{ smartypants: true, animateLists: true }"
		>
			{{ ` ## Markdown 1.1 - First point
			<!-- .element: class="fragment" -->
			- Second point
			<!-- .element: class="fragment" -->

			-- ## Markdown 1.2 Notes: These are speaker notes parsed from markdown. ---

			<!-- .slide: data-background="#0f172a" -->
			## Markdown 2 \`\`\`js [1|2] const a = 1; const b = 2; \`\`\` ` }}
		</Markdown>

		<Markdown src="markdown.md" vertical-separator="@@@" />

		<Slide>
			<h2>The End</h2>
			<Fragment animation="fade-up">
				<p>Thanks for watching!</p>
			</Fragment>
		</Slide>
	</Deck>
</template>

<style>
#app {
	width: 100vw;
	height: 100vh;
	margin: 0;
}
body {
	margin: 0;
}
</style>
