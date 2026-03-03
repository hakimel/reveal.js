import { Children, useEffect, useState } from 'react';
import { Deck, Slide, Stack, Fragment, Code, useReveal } from '@revealjs/react';
import 'reveal.js/reveal.css';
import 'reveal.js/theme/black.css';
import 'reveal.js/plugin/highlight/monokai.css';

// @ts-ignore
import RevealHighlight from 'reveal.js/plugin/highlight';

function NavigationControls() {
	const deck = useReveal();

	return (
		<div style={{ marginTop: '1em' }}>
			<button onClick={() => deck?.prev()}>Previous</button>{' '}
			<button onClick={() => deck?.next()}>Next</button>
		</div>
	);
}

function Columns({ children }: { children: React.ReactNode }) {
	return (
		<div style={{ display: 'flex', flexDirection: 'row' }}>
			{Children.map(children, (child, index) => (
				<div key={index} style={{ width: '50%' }}>
					{child}
				</div>
			))}
		</div>
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
			plugins={[RevealHighlight]}
			onReady={(deck) => console.log('Deck ready!', deck)}
			onSync={() => console.log('Deck synced')}
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
						<Fragment animation="highlight-red">
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
				<Slide data-background-color="indigo">
					<h2>Vertical Stack</h2>
					<p>Press down to navigate</p>
					<Code language="html" codeStyle={{ padding: '0.5em' }}>
						{`
						<Stack>
							<Slide data-background-color="indigo">
								<h2>Vertical Stack</h2>
								<p>Press down to navigate</p>
							</Slide>
							<Slide data-background-color="indigo">
								<h2>Stack Slide 2</h2>
								<p>Vertical navigation works!</p>
							</Slide>
						</Stack>
						`}
					</Code>
				</Slide>
				<Slide data-background-color="indigo">
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

			<Slide>
				<h2>Dynamic Slides</h2>
				<p>Add slides at runtime — sync() handles it</p>
				<button onClick={() => setShowBonus((b) => !b)}>
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
