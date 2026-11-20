import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Slide } from './slide';
import { RevealContext } from '../reveal-context';

describe('Slide', () => {
	it('renders as a <section> element', () => {
		const { container } = render(<Slide>Hello</Slide>);
		const section = container.querySelector('section');
		expect(section).toBeInTheDocument();
		expect(section).toHaveTextContent('Hello');
	});

	it('passes data-* attributes through', () => {
		const { container } = render(
			<Slide data-background="#ff0000" data-transition="zoom" data-auto-animate="">
				Content
			</Slide>
		);

		const section = container.querySelector('section');
		expect(section).toHaveAttribute('data-background', '#ff0000');
		expect(section).toHaveAttribute('data-transition', 'zoom');
		expect(section).toHaveAttribute('data-auto-animate', '');
	});

	it('maps background shorthand props to slide data attributes', () => {
		const { container } = render(
			<Slide
				background="#111827"
				backgroundImage="https://example.com/hero.png"
				backgroundColor="#000000"
				backgroundOpacity={0.4}
				backgroundTransition="zoom"
				backgroundVideoLoop
			>
				Content
			</Slide>
		);

		const section = container.querySelector('section');
		expect(section).toHaveAttribute('data-background', '#111827');
		expect(section).toHaveAttribute('data-background-image', 'https://example.com/hero.png');
		expect(section).toHaveAttribute('data-background-color', '#000000');
		expect(section).toHaveAttribute('data-background-opacity', '0.4');
		expect(section).toHaveAttribute('data-background-transition', 'zoom');
		expect(section).toHaveAttribute('data-background-video-loop', '');
	});

	it('maps visibility and auto-animate shorthand props to slide data attributes', () => {
		const { container } = render(
			<Slide
				visibility="hidden"
				autoAnimate
				autoAnimateId="hero"
				autoAnimateRestart
				autoAnimateUnmatched={false}
				autoAnimateEasing="ease-out"
				autoAnimateDuration={0.6}
				autoAnimateDelay={0.1}
			>
				Content
			</Slide>
		);

		const section = container.querySelector('section');
		expect(section).toHaveAttribute('data-visibility', 'hidden');
		expect(section).toHaveAttribute('data-auto-animate', '');
		expect(section).toHaveAttribute('data-auto-animate-id', 'hero');
		expect(section).toHaveAttribute('data-auto-animate-restart', '');
		expect(section).toHaveAttribute('data-auto-animate-unmatched', 'false');
		expect(section).toHaveAttribute('data-auto-animate-easing', 'ease-out');
		expect(section).toHaveAttribute('data-auto-animate-duration', '0.6');
		expect(section).toHaveAttribute('data-auto-animate-delay', '0.1');
	});

	it('maps common Reveal slide shorthand props to data attributes', () => {
		const { container } = render(
			<Slide
				transition="zoom-in fade-out"
				transitionSpeed="fast"
				autoSlide={1500}
				notes="Speaker notes"
				backgroundInteractive
				preload
			>
				Content
			</Slide>
		);

		const section = container.querySelector('section');
		expect(section).toHaveAttribute('data-transition', 'zoom-in fade-out');
		expect(section).toHaveAttribute('data-transition-speed', 'fast');
		expect(section).toHaveAttribute('data-autoslide', '1500');
		expect(section).toHaveAttribute('data-notes', 'Speaker notes');
		expect(section).toHaveAttribute('data-background-interactive', '');
		expect(section).toHaveAttribute('data-preload', '');
	});

	it('prefers explicit data-* attributes over shorthand props', () => {
		const { container } = render(
			<Slide
				background="#111827"
				backgroundColor="#000000"
				autoAnimate
				visibility="hidden"
				transition="zoom"
				notes="Shorthand notes"
				preload
				data-background="#222222"
				data-background-color="#333333"
				data-auto-animate=""
				data-visibility="uncounted"
				data-transition="fade"
				data-notes="Raw notes"
				data-preload=""
			>
				Content
			</Slide>
		);

		const section = container.querySelector('section');
		expect(section).toHaveAttribute('data-background', '#222222');
		expect(section).toHaveAttribute('data-background-color', '#333333');
		expect(section).toHaveAttribute('data-auto-animate', '');
		expect(section).toHaveAttribute('data-visibility', 'uncounted');
		expect(section).toHaveAttribute('data-transition', 'fade');
		expect(section).toHaveAttribute('data-notes', 'Raw notes');
		expect(section).toHaveAttribute('data-preload', '');
	});

	it('applies className and style', () => {
		const { container } = render(
			<Slide className="intro" style={{ fontSize: '20px' }}>
				Styled
			</Slide>
		);

		const section = container.querySelector('section');
		expect(section).toHaveClass('intro');
		expect(section).toHaveStyle({ fontSize: '20px' });
	});

	it('passes id and aria attributes', () => {
		const { container } = render(
			<Slide id="slide-1" aria-label="Introduction">
				Accessible
			</Slide>
		);

		const section = container.querySelector('section');
		expect(section).toHaveAttribute('id', 'slide-1');
		expect(section).toHaveAttribute('aria-label', 'Introduction');
	});

	it('renders children of any type', () => {
		const { container } = render(
			<Slide>
				<h1>Title</h1>
				<p>Paragraph</p>
			</Slide>
		);

		const section = container.querySelector('section');
		expect(section?.querySelector('h1')).toHaveTextContent('Title');
		expect(section?.querySelector('p')).toHaveTextContent('Paragraph');
	});

	it('calls syncSlide when data-* attributes change after mount', () => {
		const deck = {
			syncSlide: vi.fn(),
		} as any;

		const { container, rerender } = render(
			<RevealContext.Provider value={deck}>
				<Slide data-background-color="#111">Content</Slide>
			</RevealContext.Provider>
		);

		const section = container.querySelector('section');
		expect(section).toBeInTheDocument();
		expect(deck.syncSlide).not.toHaveBeenCalled();
		deck.syncSlide.mockClear();

		rerender(
			<RevealContext.Provider value={deck}>
				<Slide data-background-color="#222">Content</Slide>
			</RevealContext.Provider>
		);

		expect(deck.syncSlide).toHaveBeenCalledTimes(1);
		expect(deck.syncSlide).toHaveBeenCalledWith(container.querySelector('section'));
	});

	it('calls syncSlide when shorthand background props change after mount', () => {
		const deck = {
			syncSlide: vi.fn(),
		} as any;

		const { container, rerender } = render(
			<RevealContext.Provider value={deck}>
				<Slide backgroundColor="#111">Content</Slide>
			</RevealContext.Provider>
		);

		expect(deck.syncSlide).not.toHaveBeenCalled();
		deck.syncSlide.mockClear();

		rerender(
			<RevealContext.Provider value={deck}>
				<Slide backgroundColor="#222">Content</Slide>
			</RevealContext.Provider>
		);

		expect(deck.syncSlide).toHaveBeenCalledTimes(1);
		expect(deck.syncSlide).toHaveBeenCalledWith(container.querySelector('section'));
	});

	it('calls syncSlide when shorthand Reveal slide props change after mount', () => {
		const deck = {
			syncSlide: vi.fn(),
		} as any;

		const { container, rerender } = render(
			<RevealContext.Provider value={deck}>
				<Slide autoSlide={1000}>Content</Slide>
			</RevealContext.Provider>
		);

		expect(deck.syncSlide).not.toHaveBeenCalled();
		deck.syncSlide.mockClear();

		rerender(
			<RevealContext.Provider value={deck}>
				<Slide autoSlide={2000}>Content</Slide>
			</RevealContext.Provider>
		);

		expect(deck.syncSlide).toHaveBeenCalledTimes(1);
		expect(deck.syncSlide).toHaveBeenCalledWith(container.querySelector('section'));
	});

	it('does not call syncSlide on first render even when data-* attributes are present', () => {
		const deck = {
			syncSlide: vi.fn(),
		} as any;

		render(
			<RevealContext.Provider value={deck}>
				<Slide data-background="#111">Content</Slide>
			</RevealContext.Provider>
		);

		expect(deck.syncSlide).not.toHaveBeenCalled();
	});

	it('does not call syncSlide for non-data prop updates', () => {
		const deck = {
			syncSlide: vi.fn(),
		} as any;

		const { rerender } = render(
			<RevealContext.Provider value={deck}>
				<Slide data-background-color="#111" className="a">
					Content
				</Slide>
			</RevealContext.Provider>
		);

		deck.syncSlide.mockClear();

		rerender(
			<RevealContext.Provider value={deck}>
				<Slide data-background-color="#111" className="b">
					Content
				</Slide>
			</RevealContext.Provider>
		);

		expect(deck.syncSlide).not.toHaveBeenCalled();
	});

	it('does not call syncSlide on mount when no data-* attributes are present', () => {
		const deck = {
			syncSlide: vi.fn(),
		} as any;

		render(
			<RevealContext.Provider value={deck}>
				<Slide className="plain">Content</Slide>
			</RevealContext.Provider>
		);

		expect(deck.syncSlide).not.toHaveBeenCalled();
	});
});
