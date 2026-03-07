import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Slide } from '../Slide';
import { RevealContext } from '../context';

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
