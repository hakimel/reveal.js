import { render, cleanup } from '@testing-library/vue';
import { describe, it, expect, afterEach } from 'vitest';
import Fragment from '../components/Fragment.vue';
import { defineComponent, h } from 'vue';

describe('Fragment', () => {
    afterEach(() => {
        cleanup();
    });

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

	it('renders as a <span> by default', () => {
		const { container } = render(Fragment, {
            slots: { default: () => 'Default' }
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
            props: { animation: 'grow', class: 'custom' },
            slots: { default: 'Combined' }
        });

		const el = container.querySelector('.fragment');
		expect(el).toHaveClass('fragment', 'grow', 'custom');
	});

    it('injects attributes into child when asChild is true', () => {
        const { container } = render(Fragment, {
            props: { asChild: true, animation: 'fade-in', index: 3 },
            slots: {
                default: () => h('strong', { class: 'bold' }, 'Bold Fragment')
            }
        });

        const el = container.querySelector('strong');
        expect(el).toHaveClass('fragment', 'fade-in', 'bold');
        expect(el).toHaveAttribute('data-fragment-index', '3');
        expect(el?.tagName).toBe('STRONG');
    });

    it('throws when asChild is true but multiple children are provided', () => {
        expect(() => {
            render(Fragment, {
                props: { asChild: true },
                slots: {
                    default: () => [h('span', 'one'), h('span', 'two')]
                }
            });
        }).toThrow();
    });
});
