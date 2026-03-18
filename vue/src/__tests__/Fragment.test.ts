import { render } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import Fragment from '../Fragment.vue';

describe('Fragment', () => {
	it('renders with the "fragment" class', () => {
		const { container } = render(Fragment, {
            slots: { default: 'Hello' }
        });
		const el = container.querySelector('.fragment');
		expect(el).toBeInTheDocument();
		expect(el).toHaveTextContent('Hello');
	});

	it('applies the animation class', () => {
		const { container } = render(Fragment, {
            props: { animation: 'fade-up' },
            slots: { default: 'Animated' }
        });

		const el = container.querySelector('.fragment');
		expect(el).toHaveClass('fragment', 'fade-up');
	});

	it('sets data-fragment-index when index is provided', () => {
		const { container } = render(Fragment, {
            props: { index: 2 },
            slots: { default: 'Indexed' }
        });

		const el = container.querySelector('.fragment');
		expect(el).toHaveAttribute('data-fragment-index', '2');
	});

	it('does not set data-fragment-index when index is omitted', () => {
		const { container } = render(Fragment, {
            slots: { default: 'No index' }
        });
		const el = container.querySelector('.fragment');
		expect(el?.getAttribute('data-fragment-index')).toBeNull();
	});

	it('renders as a <span> by default', () => {
		const { container } = render(Fragment, {
            slots: { default: 'Default' }
        });
		const el = container.querySelector('.fragment');
		expect(el?.tagName).toBe('SPAN');
	});

	it('renders as a custom element when "as" is provided', () => {
		const { container } = render(Fragment, {
            props: { as: 'div' },
            slots: { default: 'Block' }
        });

		const el = container.querySelector('.fragment');
		expect(el?.tagName).toBe('DIV');
	});

	it('combines fragment, animation, and custom class', () => {
		const { container } = render(Fragment, {
            props: { animation: 'grow' },
            attrs: { class: 'custom' },
            slots: { default: 'Combined' }
        });

		const el = container.querySelector('.fragment');
		expect(el).toHaveClass('fragment', 'grow', 'custom');
	});

	it('passes style through', () => {
		const { container } = render(Fragment, {
            attrs: { style: 'opacity: 0.5;' },
            slots: { default: 'Styled' }
        });

		const el = container.querySelector('.fragment');
		expect(el).toHaveStyle({ opacity: '0.5' });
	});
});
