import { useState } from 'react';
import { Deck, Slide, Stack, Fragment, useReveal } from '@revealjs/react';
import 'reveal.js/reveal.css';
import 'reveal.js/theme/black.css';

function NavigationControls() {
	const deck = useReveal();

	return (
		<div style={{ marginTop: '1em' }}>
			<button onClick={() => deck?.prev()}>Previous</button>{' '}
			<button onClick={() => deck?.next()}>Next</button>
		</div>
	);
}

function Demo() {
	const [showBonus, setShowBonus] = useState(false);

	return (
		<Deck
			transition="slide"
			hash
			onReady={(deck) => console.log('Deck ready!', deck)}
			onSlideChange={(e) => console.log('Slide changed:', e)}
		>
			<Slide>
				<h1>@revealjs/react</h1>
				<p>React wrapper for reveal.js</p>
			</Slide>

			<Slide data-background="#4d7e65">
				<h2>Fragments</h2>
				<Fragment animation="fade-up">
					<p>This appears first</p>
				</Fragment>
				<Fragment animation="fade-up">
					<p>Then this</p>
				</Fragment>
				<Fragment animation="highlight-red">
					<p>And this gets highlighted</p>
				</Fragment>
			</Slide>

			<Stack>
				<Slide data-background="#b5533c">
					<h2>Vertical Stack</h2>
					<p>Press down to navigate</p>
				</Slide>
				<Slide data-background="#b5533c">
					<h2>Stack Slide 2</h2>
					<p>Vertical navigation works!</p>
				</Slide>
			</Stack>

			<Slide>
				<h2>useReveal() Hook</h2>
				<p>Components inside slides can access the API</p>
				<NavigationControls />
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
