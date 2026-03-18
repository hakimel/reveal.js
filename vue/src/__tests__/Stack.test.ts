import { render } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import Stack from '../Stack.vue';
import Slide from '../Slide.vue';

describe('Stack', () => {
	it('renders as a <section> element', () => {
		const { container } = render(Stack, {
            slots: {
                default: [Slide, Slide] // Pass two Slides as default slot loosely
            }
        });

		const sections = container.querySelectorAll('section');
		expect(sections).toHaveLength(3); // 1 outer (Stack) + 2 inner (Slides)
	});

	it('creates nested section structure for vertical slides', () => {
		const { container } = render(Stack, {
            slots: {
                default: ['<section>First</section>', '<section>Second</section>']
            }
        });

		const outer = container.querySelector('section');
		expect(outer).toBeInTheDocument();

		const inner = outer?.querySelectorAll(':scope > section');
		expect(inner).toHaveLength(2);
		expect(inner?.[0]).toHaveTextContent('First');
		expect(inner?.[1]).toHaveTextContent('Second');
	});

	it('applies className and style to the outer section', () => {
		const { container } = render(Stack, {
            attrs: {
                class: 'my-stack',
                style: 'padding: 10px;'
            },
            slots: {
                default: 'Content'
            }
        });

		const outer = container.querySelector('section');
		expect(outer).toHaveClass('my-stack');
		expect(outer).toHaveStyle({ padding: '10px' });
	});
});
