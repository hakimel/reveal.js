import { Children, useEffect, useState } from 'react';
import type { SlideSyncEvent } from 'reveal.js';
import { Deck, Slide, Stack, Fragment, Code, useReveal } from '@revealjs/react';
import 'reveal.js/reveal.css';
import 'reveal.js/theme/black.css';
import 'reveal.js/plugin/highlight/monokai.css';

import RevealHighlight from 'reveal.js/plugin/highlight';
import RevealMarkdown from 'reveal.js/plugin/markdown';

const buttonStyle: React.CSSProperties = {
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

function NavigationControls() {
	const deck = useReveal();

	return (
		<div style={{ marginTop: '1em' }}>
			<button style={buttonStyle} onClick={() => deck?.prev()}>
				Previous
			</button>{' '}
			<button style={buttonStyle} onClick={() => deck?.next()}>
				Next
			</button>
		</div>
	);
}

function Columns({ children }: { children: React.ReactNode }) {
	return (
		<div style={{ display: 'flex', flexDirection: 'row' }}>
			{Children.map(children, (child, index) => (
				<div key={index} style={{ flex: 1 }}>
					{child}
				</div>
			))}
		</div>
	);
}

function SlideSyncPlayground() {
	const [count, setCount] = useState(0);
	const [slideColor, setSlideColor] = useState('#1b1f2a');

	const randomColor = () => {
		const value = Math.floor(Math.random() * 0xffffff)
			.toString(16)
			.padStart(6, '0');
		return `#${value}`;
	};

	return (
		<Slide background={slideColor}>
			<h2>Slide-local HTML updates</h2>
			<p>
				This slide updates only its own React-rendered HTML, without manually calling{' '}
				<code>sync</code> or <code>syncSlide</code>.
			</p>
			<div>
				<div style={{ marginBottom: '0.75em' }}>
					<button style={buttonStyle} onClick={() => setCount((c) => c + 1)}>
						Increase count
					</button>{' '}
					<button style={buttonStyle} onClick={() => setSlideColor(randomColor())}>
						Randomize background
					</button>
				</div>

				<p>
					<strong>Current count:</strong> {count}
				</p>
				<p>
					<strong>Slide color:</strong> {slideColor}
				</p>
			</div>
		</Slide>
	);
}

function Demo() {
	const [showBonus, setShowBonus] = useState(false);
	const [controls, setControls] = useState(true);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'c' && !e.ctrlKey && !e.metaKey && !e.altKey) {
				setControls((prev) => !prev);
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, []);

	return (
		<Deck
			config={{
				width: 1280,
				height: 720,
				transition: 'slide',
				hash: true,
				controls,
			}}
			plugins={[RevealHighlight, RevealMarkdown]}
			onReady={(deck) => console.log('Deck ready!', deck)}
			onSync={() => console.log('Deck synced')}
			onSlideSync={(e) => {
				const slide = (e as SlideSyncEvent).slide;
				console.log('Slide synced', slide);
			}}
			onSlideChange={(e) => console.log('Slide changed')}
		>
			<Slide>
				<h1>@revealjs/react</h1>
				<p>React wrapper for reveal.js</p>
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
						<Fragment animation="highlight-red" asChild>
							<p>And this gets highlighted</p>
						</Fragment>
					</div>
					<div>
						<Code language="html" codeStyle={{ padding: '0.5em' }}>
							{`
							<Fragment animation="fade-up">
								<p>This appears first</p>
							</Fragment>
							<Fragment animation="fade-up">
								<p>Then this</p>
							</Fragment>
							<Fragment animation="highlight-red">
								<p>And this gets highlighted</p>
							</Fragment>
						`}
						</Code>
					</div>
				</Columns>
			</Slide>

			<Stack>
				<Slide background="indigo">
					<h2>Vertical Stack</h2>
					<p>Press down to navigate</p>
					<Code language="html" codeStyle={{ padding: '0.5em' }}>
						{`
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
						`}
					</Code>
				</Slide>
				<Slide background="indigo">
					<h2>Stack Slide 2</h2>
					<p>Vertical navigation works!</p>
				</Slide>
			</Stack>

			<Slide>
				<Columns>
					<div style={{ textAlign: 'left' }}>
						<h2>API Hook</h2>
						<p>Components inside slides can access the reveal.js API via the useReveal() hook.</p>
						<NavigationControls />
					</div>
					<div>
						<Code language="javascript" lineNumbers="1|4">
							{`
							const deck = useReveal();

							function nextSlide() {
								deck?.next();
							}
							`}
						</Code>
					</div>
				</Columns>
			</Slide>

			<Slide data-markdown>
				<script type="text/template">
					{`
						## Markdown Support

						Write content using inline or external Markdown.
						More info in the [docs](https://revealjs.com/markdown/).

						\`\`\`html []
						<Slide data-markdown>
						  <script type="text/template">
						    ## Markdown Support

						    This content is written in **Markdown**.
						  </script>
						</Slide>
						\`\`\`
					`}
				</script>
			</Slide>

			<SlideSyncPlayground />

			<Slide>
				<h2>Dynamic Slides</h2>
				<p>Add slides at runtime — sync() handles it</p>
				<button style={buttonStyle} onClick={() => setShowBonus((b) => !b)}>
					{showBonus ? 'Remove' : 'Add'} bonus slide
				</button>
			</Slide>

			{showBonus && (
				<Slide data-background="#2d2d8c">
					<h2>Bonus Slide!</h2>
					<p>Dynamically added via React state</p>
				</Slide>
			)}

			<Slide>
				<h2>The End</h2>
				<Fragment animation="fade-up">
					<p>Thanks for watching!</p>
				</Fragment>
			</Slide>
		</Deck>
	);
}

export default Demo;
