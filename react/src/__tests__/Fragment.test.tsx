import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Fragment } from '../Fragment';

describe('Fragment', () => {
	it('renders with the "fragment" class', () => {
		const { container } = render(<Fragment>Hello</Fragment>);
		const el = container.querySelector('.fragment');
		expect(el).toBeInTheDocument();
		expect(el).toHaveTextContent('Hello');
	});

	it('applies the animation class', () => {
		const { container } = render(<Fragment animation="fade-up">Animated</Fragment>);

		const el = container.querySelector('.fragment');
		expect(el).toHaveClass('fragment', 'fade-up');
	});

	it('sets data-fragment-index when index is provided', () => {
		const { container } = render(<Fragment index={2}>Indexed</Fragment>);

		const el = container.querySelector('.fragment');
		expect(el).toHaveAttribute('data-fragment-index', '2');
	});

	it('does not set data-fragment-index when index is omitted', () => {
		const { container } = render(<Fragment>No index</Fragment>);
		const el = container.querySelector('.fragment');
		expect(el?.getAttribute('data-fragment-index')).toBeNull();
	});

	it('renders as a <span> by default', () => {
		const { container } = render(<Fragment>Default</Fragment>);
		const el = container.querySelector('.fragment');
		expect(el?.tagName).toBe('SPAN');
	});

	it('renders as a custom element when "as" is provided', () => {
		const { container } = render(<Fragment as="div">Block</Fragment>);

		const el = container.querySelector('.fragment');
		expect(el?.tagName).toBe('DIV');
	});

	it('combines fragment, animation, and custom className', () => {
		const { container } = render(
			<Fragment animation="grow" className="custom">
				Combined
			</Fragment>
		);

		const el = container.querySelector('.fragment');
		expect(el).toHaveClass('fragment', 'grow', 'custom');
	});

	it('passes style through', () => {
		const { container } = render(<Fragment style={{ opacity: 0.5 }}>Styled</Fragment>);

		const el = container.querySelector('.fragment');
		expect(el).toHaveStyle({ opacity: '0.5' });
	});
});
