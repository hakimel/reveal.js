import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Stack } from './stack';
import { Slide } from './slide';

describe('Stack', () => {
	it('renders as a <section> element', () => {
		const { container } = render(
			<Stack>
				<Slide>A</Slide>
				<Slide>B</Slide>
			</Stack>
		);

		const sections = container.querySelectorAll('section');
		expect(sections).toHaveLength(3); // 1 outer (Stack) + 2 inner (Slides)
	});

	it('creates nested section structure for vertical slides', () => {
		const { container } = render(
			<Stack>
				<Slide>First</Slide>
				<Slide>Second</Slide>
			</Stack>
		);

		const outer = container.querySelector('section');
		expect(outer).toBeInTheDocument();

		const inner = outer?.querySelectorAll(':scope > section');
		expect(inner).toHaveLength(2);
		expect(inner?.[0]).toHaveTextContent('First');
		expect(inner?.[1]).toHaveTextContent('Second');
	});

	it('applies className and style to the outer section', () => {
		const { container } = render(
			<Stack className="my-stack" style={{ padding: '10px' }}>
				<Slide>Content</Slide>
			</Stack>
		);

		const outer = container.querySelector('section');
		expect(outer).toHaveClass('my-stack');
		expect(outer).toHaveStyle({ padding: '10px' });
	});
});
