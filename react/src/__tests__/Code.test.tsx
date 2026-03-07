import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Code } from '../Code';
import { RevealContext } from '../context';

describe('Code', () => {
	it('renders pre/code and trims multiline template literals by default', () => {
		const { container } = render(
			<Code language="javascript">{`
				function add(a, b) {
					return a + b;
				}
			`}</Code>
		);

		const pre = container.querySelector('pre');
		const code = container.querySelector('pre > code');

		expect(pre).toBeInTheDocument();
		expect(pre).toHaveClass('code-wrapper');
		expect(code).toHaveClass('javascript');
		expect(code?.textContent).toBe('function add(a, b) {\n\treturn a + b;\n}');
	});

	it('can disable trimming', () => {
		const source = '\n\tconst value = 1;\n';
		const { container } = render(<Code trim={false}>{source}</Code>);
		const code = container.querySelector('pre > code');

		expect(code?.textContent).toBe(source);
	});

	it('maps line number props to reveal data attributes', () => {
		const { container } = render(
			<Code language="js" lineNumbers="|2,4-6|8" startFrom={10}>
				{`console.log('hello')`}
			</Code>
		);

		const code = container.querySelector('pre > code');
		expect(code).toHaveAttribute('data-line-numbers', '|2,4-6|8');
		expect(code).toHaveAttribute('data-ln-start-from', '10');
	});

	it('invokes the Reveal highlight plugin when registered on the deck', () => {
		const highlightBlock = vi.fn((block: HTMLElement) => {
			block.setAttribute('data-highlighted', 'yes');
		});
		const deck = {
			getPlugin: vi.fn().mockReturnValue({ highlightBlock }),
			syncFragments: vi.fn(),
		} as any;

		const { container } = render(
			<RevealContext.Provider value={deck}>
				<section>
					<Code language="javascript">{`console.log('hello')`}</Code>
				</section>
			</RevealContext.Provider>
		);

		const code = container.querySelector('pre > code');
		expect(deck.getPlugin).toHaveBeenCalledWith('highlight');
		expect(highlightBlock).toHaveBeenCalledWith(code);
		expect(deck.syncFragments).toHaveBeenCalledWith(expect.any(HTMLElement));
	});

	it('rehighlights updated code without accumulating generated fragments', () => {
		const highlightBlock = vi.fn((block: HTMLElement) => {
			block.setAttribute('data-highlighted', 'yes');
			const fragment = block.cloneNode(true) as HTMLElement;
			fragment.classList.add('fragment');
			block.parentElement?.appendChild(fragment);
		});

		const deck = {
			getPlugin: vi.fn().mockReturnValue({ highlightBlock }),
			syncFragments: vi.fn(),
		} as any;

		const { container, rerender } = render(
			<RevealContext.Provider value={deck}>
				<section>
					<Code lineNumbers="|1|2">{`console.log('one')`}</Code>
				</section>
			</RevealContext.Provider>
		);

		expect(container.querySelectorAll('pre > code.fragment')).toHaveLength(1);

		rerender(
			<RevealContext.Provider value={deck}>
				<section>
					<Code lineNumbers="|1|2">{`console.log('two')`}</Code>
				</section>
			</RevealContext.Provider>
		);

		expect(highlightBlock).toHaveBeenCalledTimes(2);
		expect(container.querySelectorAll('pre > code.fragment')).toHaveLength(1);
		expect(container.querySelector('pre > code:not(.fragment)')).toHaveTextContent("console.log('two')");
	});

	it('restores full line-number steps before rehighlighting after plugin mutation', () => {
		const seenLineNumbers: string[] = [];
		const highlightBlock = vi.fn((block: HTMLElement) => {
			seenLineNumbers.push(block.getAttribute('data-line-numbers') || '');
			block.setAttribute('data-highlighted', 'yes');

			// Mimic RevealHighlight: original block is rewritten to the first step and
			// an extra fragment block is appended for following steps.
			block.setAttribute('data-line-numbers', '1');
			const fragment = block.cloneNode(true) as HTMLElement;
			fragment.classList.add('fragment');
			fragment.setAttribute('data-line-numbers', '3');
			block.parentElement?.appendChild(fragment);
		});

		const deck = {
			getPlugin: vi.fn().mockReturnValue({ highlightBlock }),
			syncFragments: vi.fn(),
		} as any;

		const { rerender } = render(
			<RevealContext.Provider value={deck}>
				<section>
					<Code language="javascript" lineNumbers="1|3">{`console.log('one')`}</Code>
				</section>
			</RevealContext.Provider>
		);

		rerender(
			<RevealContext.Provider value={deck}>
				<section>
					<Code language="ts" lineNumbers="1|3">{`console.log('one')`}</Code>
				</section>
			</RevealContext.Provider>
		);

		expect(seenLineNumbers).toEqual(['1|3', '1|3']);
	});
});
