import { render } from '@testing-library/vue';
import { describe, it, expect, vi } from 'vitest';
import Code from '../Code.vue';
import { RevealContextKey } from '../context';
import { shallowRef, defineComponent, nextTick } from 'vue';

describe('Code', () => {
	it('renders pre/code and trims multiline template literals by default', () => {
		const { container } = render(Code, {
            props: {
                language: 'javascript',
                code: `
				function add(a, b) {
					return a + b;
				}
			`
            }
        });

		const pre = container.querySelector('pre');
		const code = container.querySelector('pre > code');

		expect(pre).toBeInTheDocument();
		expect(pre).toHaveClass('code-wrapper');
		expect(code).toHaveClass('javascript');
		expect(code?.textContent).toBe('function add(a, b) {\n\treturn a + b;\n}');
	});

	it('can disable trimming', () => {
		const source = '\n\tconst value = 1;\n';
		const { container } = render(Code, {
            props: { trim: false, code: source }
        });
		const code = container.querySelector('pre > code');

		expect(code?.textContent).toBe(source);
	});

	it('maps line number props to reveal data attributes', () => {
		const { container } = render(Code, {
            props: {
                language: 'js',
                lineNumbers: '|2,4-6|8',
                startFrom: 10,
                code: `console.log('hello')`
            }
        });

		const code = container.querySelector('pre > code');
		expect(code).toHaveAttribute('data-line-numbers', '|2,4-6|8');
		expect(code).toHaveAttribute('data-ln-start-from', '10');
	});

	it('invokes the Reveal highlight plugin when registered on the deck', async () => {
		const highlightBlock = vi.fn((block: HTMLElement) => {
			block.setAttribute('data-highlighted', 'yes');
		});
		const deck = {
			getPlugin: vi.fn().mockReturnValue({ highlightBlock }),
			syncFragments: vi.fn(),
		} as any;

		const Wrapper = defineComponent({
			components: { Code },
			template: `<section><Code language="javascript" :code="code" /></section>`,
			setup() {
				return { code: `console.log('hello')` };
			},
		});

		const { container } = render(Wrapper, {
			global: {
				provide: { [RevealContextKey as symbol]: shallowRef(deck) },
			},
		});

		await nextTick();

		const code = container.querySelector('pre > code');
		expect(deck.getPlugin).toHaveBeenCalledWith('highlight');
		expect(highlightBlock).toHaveBeenCalledWith(code);
		expect(deck.syncFragments).toHaveBeenCalledWith(expect.any(HTMLElement));
	});

	it('rehighlights updated code without accumulating generated fragments', async () => {
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

		const { container, rerender } = render(Code, {
            props: {
                lineNumbers: '|1|2',
                code: `console.log('one')`
            },
            global: {
                provide: { [RevealContextKey as symbol]: shallowRef(deck) }
            }
        });

		await nextTick();
		expect(container.querySelectorAll('pre > code.fragment')).toHaveLength(1);

		await rerender({
            lineNumbers: '|1|2',
            code: `console.log('two')`
        });
		await nextTick();

		expect(highlightBlock).toHaveBeenCalledTimes(2);
		expect(container.querySelectorAll('pre > code.fragment')).toHaveLength(1);
		expect(container.querySelector('pre > code:not(.fragment)')).toHaveTextContent("console.log('two')");
	});

	it('restores full line-number steps before rehighlighting after plugin mutation', async () => {
		const seenLineNumbers: string[] = [];
		const highlightBlock = vi.fn((block: HTMLElement) => {
			seenLineNumbers.push(block.getAttribute('data-line-numbers') || '');
			block.setAttribute('data-highlighted', 'yes');

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

		const { rerender } = render(Code, {
            props: {
                language: 'javascript',
                lineNumbers: '1|3',
                code: `console.log('one')`
            },
            global: {
                provide: { [RevealContextKey as symbol]: shallowRef(deck) }
            }
        });
		await nextTick();

		await rerender({
            language: 'ts',
            lineNumbers: '1|3',
            code: `console.log('one')`
        });
		await nextTick();

		expect(seenLineNumbers).toEqual(['1|3', '1|3']);
	});
});
