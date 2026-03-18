<script setup lang="ts">
import { ref, onMounted, onUnmounted, h, defineComponent } from 'vue';
import type { SlideSyncEvent } from 'reveal.js';
import { Deck, Slide, Stack, Fragment, Code, useReveal } from '@revealjs/vue';
import 'reveal.js/reveal.css';
import 'reveal.js/theme/black.css';
import 'reveal.js/plugin/highlight/monokai.css';
import RevealHighlight from 'reveal.js/plugin/highlight';

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

// Extracted SlideSyncPlayground component functionality
const count = ref(0);
const slideColor = ref('#1b1f2a');

function randomColor() {
	const value = Math.floor(Math.random() * 0xffffff)
		.toString(16)
		.padStart(6, '0');
	return `#${value}`;
}

// Extracted Columns component functionality (can just be wrapper css, but let's do it with CSS directly here)
// Actually we'll make a local component to handle Columns just like React does.
const Columns = defineComponent({
	setup(_, { slots }) {
		return () => {
			const rawChildren = slots.default?.() || [];
			return h(
				'div',
				{ style: { display: 'flex', flexDirection: 'row' } },
				rawChildren.map((child: any) => h('div', { style: { flex: 1 } }, [child]))
			);
		};
	},
});

const NavigationControls = defineComponent({
	setup() {
		const deck = useReveal();
		return () =>
			h('div', { style: { marginTop: '1em' } }, [
				h('button', { style: buttonStyle, onClick: () => deck.value?.prev() }, 'Previous'),
				h('button', { style: buttonStyle, onClick: () => deck.value?.next() }, 'Next'),
			]);
	},
});

// Demo state
const showBonus = ref(false);
const controls = ref(true);

function handleKeyDown(e: KeyboardEvent) {
	if (e.key === 'c' && !e.ctrlKey && !e.metaKey && !e.altKey) {
		controls.value = !controls.value;
	}
}

onMounted(() => {
	window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
	window.removeEventListener('keydown', handleKeyDown);
});

function onReady(deckInstance: any) {
	console.log('Deck ready!', deckInstance);
}

function onSync() {
	console.log('Deck synced');
}

function onSlideSync(e: any) {
	const slide = (e as SlideSyncEvent).slide;
	console.log('Slide synced', slide);
}

function onSlideChange() {
	console.log('Slide changed');
}

const plugins = [RevealHighlight];
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
		:plugins="plugins"
		@ready="onReady"
		@sync="onSync"
		@slideSync="onSlideSync"
		@slideChanged="onSlideChange"
	>
		<Slide>
			<h1>@revealjs/vue</h1>
			<p>Vue wrapper for reveal.js</p>
		</Slide>

		<Slide data-background="#000">
			<h2>Fragments</h2>
			<Columns>
				<template #default>
					<div>
						<Fragment animation="fade-up">
							<p>This appears first</p>
						</Fragment>
						<Fragment animation="fade-up">
							<p>Then this</p>
						</Fragment>
						<Fragment animation="highlight-red" as="p"> And this gets highlighted </Fragment>
					</div>
					<div>
						<Code language="html" :codeStyle="{ padding: '0.5em' }">
							{{ `
							<Fragment animation="fade-up">
								<p>This appears first</p>
							</Fragment>
							<Fragment animation="fade-up">
								<p>Then this</p>
							</Fragment>
							<Fragment animation="highlight-red" as="p"> And this gets highlighted </Fragment>
							` }}
						</Code>
					</div>
				</template>
			</Columns>
		</Slide>

		<Stack>
			<Slide background="indigo">
				<h2>Vertical Stack</h2>
				<p>Press down to navigate</p>
				<Code language="html" :codeStyle="{ padding: '0.5em' }">
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
				<template #default>
					<div style="text-align: left">
						<h2>API Hook</h2>
						<p>Components inside slides can access the reveal.js API via the useReveal() hook.</p>
						<NavigationControls />
					</div>
					<div>
						<Code language="javascript" lineNumbers="1|4">
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
				</template>
			</Columns>
		</Slide>

		<Slide :background="slideColor">
			<h2>Slide-local HTML updates</h2>
			<p>
				This slide updates only its own Vue-rendered HTML, without manually calling
				<code>sync</code> or <code>syncSlide</code>.
			</p>
			<div>
				<div style="margin-bottom: 0.75em">
					<button :style="buttonStyle" @click="count++">Increase count</button>
					<button :style="buttonStyle" @click="slideColor = randomColor()">
						Randomize background
					</button>
				</div>

				<p><strong>Current count:</strong> {{ count }}</p>
				<p><strong>Slide color:</strong> {{ slideColor }}</p>
			</div>
		</Slide>

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

		<Slide>
			<h2>The End</h2>
			<Fragment animation="fade-up">
				<p>Thanks for watching!</p>
			</Fragment>
		</Slide>
	</Deck>
</template>
