import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Slide } from '../Slide';

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
});
