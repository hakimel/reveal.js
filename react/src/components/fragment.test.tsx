import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Fragment } from './fragment';

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

	it('renders the child element directly when asChild is provided', () => {
		const { container } = render(
			<Fragment asChild animation="fade-up">
				<li>Item</li>
			</Fragment>
		);

		expect(container.firstElementChild?.tagName).toBe('LI');
		expect(container.firstElementChild).toHaveClass('fragment', 'fade-up');
		expect(container.firstElementChild).toHaveTextContent('Item');
	});

	it('merges child className and style when asChild is provided', () => {
		const { container } = render(
			<Fragment asChild animation="grow" className="outer" style={{ opacity: 0.5 }}>
				<div className="inner" style={{ color: 'red' }}>
					Merged
				</div>
			</Fragment>
		);

		const el = container.firstElementChild;
		expect(el).toHaveClass('inner', 'fragment', 'grow', 'outer');
		expect(el).toHaveStyle({ color: 'rgb(255, 0, 0)', opacity: '0.5' });
	});

	it('sets data-fragment-index on the child when asChild is provided', () => {
		const { container } = render(
			<Fragment asChild index={2}>
				<div data-fragment-index={1}>Indexed</div>
			</Fragment>
		);

		expect(container.firstElementChild).toHaveAttribute('data-fragment-index', '2');
	});

	it('throws when asChild receives multiple children', () => {
		expect(() =>
			render(
				// @ts-expect-error - This is a test
				<Fragment asChild>
					<span>One</span>
					<span>Two</span>
				</Fragment>
			)
		).toThrow('Fragment with asChild expects exactly one React element child.');
	});

	it('throws when asChild receives a React.Fragment child', () => {
		expect(() =>
			render(
				<Fragment asChild>
					<>
						<span>One</span>
					</>
				</Fragment>
			)
		).toThrow('Fragment with asChild expects exactly one non-Fragment React element child.');
	});
});
