import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Markdown } from './markdown';
import { RevealContext } from '../reveal-context';

describe('Markdown', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders markdown as slide HTML and normalizes common indentation', () => {
		const { container } = render(
			<Markdown>
				{`
					## Hello

					A paragraph with **markdown**.
				`}
			</Markdown>
		);

		const section = container.querySelector('section');
		expect(section?.querySelector('h2')).toHaveTextContent('Hello');
		expect(section?.querySelector('p')).toHaveTextContent('A paragraph with markdown.');
	});

	it('renders new slide HTML when the markdown source changes', () => {
		const { container, rerender } = render(<Markdown markdown="## Before" />);

		expect(container.querySelector('h2')).toHaveTextContent('Before');

		rerender(<Markdown markdown={'### After\n\nUpdated paragraph'} />);

		expect(container.querySelector('h2')).not.toBeInTheDocument();
		expect(container.querySelector('h3')).toHaveTextContent('After');
		expect(container.querySelector('p')).toHaveTextContent('Updated paragraph');
	});

	it('splits horizontal and vertical slides using custom separators', () => {
		const { container } = render(
			<Markdown separator={'^\\n---\\n$'} verticalSeparator={'^\\n--\\n$'}>
				{`
## Slide 1.1

--

## Slide 1.2

---

## Slide 2
				`}
			</Markdown>
		);

		const topLevelSections = Array.from(container.children).filter(
			(element): element is HTMLElement => element.tagName === 'SECTION'
		);
		expect(topLevelSections).toHaveLength(2);
		expect(topLevelSections[0].querySelectorAll(':scope > section')).toHaveLength(2);
		expect(topLevelSections[1]).toHaveTextContent('Slide 2');
	});

	it('creates speaker notes using the configured notes separator', () => {
		const { container } = render(
			<Markdown notesSeparator="^Note:">
				{`
## Slide

Visible content

Note:
Remember this detail
				`}
			</Markdown>
		);

		expect(container.querySelector('section')).toHaveTextContent('Visible content');
		expect(container.querySelector('aside.notes')).toHaveTextContent('Remember this detail');
	});

	it('applies .slide attributes to the generated section', () => {
		const { container } = render(
			<Markdown>
				{`
<!-- .slide: id="intro" data-background="#ff0000" -->
## Intro
				`}
			</Markdown>
		);

		const section = container.querySelector('section');
		expect(section).toHaveAttribute('id', 'intro');
		expect(section).toHaveAttribute('data-background', '#ff0000');
	});

	it('applies .element attributes to the preceding markdown element', () => {
		const { container } = render(
			<Markdown>
				{`
- Item 1 <!-- .element: class="fragment" data-fragment-index="2" -->
- Item 2
				`}
			</Markdown>
		);

		const items = container.querySelectorAll('li');
		expect(items[0]).toHaveClass('fragment');
		expect(items[0]).toHaveAttribute('data-fragment-index', '2');
		expect(items[1]).not.toHaveClass('fragment');
	});

	it('supports custom slide and element attribute separators', () => {
		const { container } = render(
			<Markdown
				slideAttributesSeparator={'--\\s(.*?)$'}
				elementAttributesSeparator={'{_\\s*?([^}]+?)}'}
			>
				{`
<!-- -- data-background="#123456" -->
## Title <!-- {_class="fragment highlight-red"} -->
				`}
			</Markdown>
		);

		expect(container.querySelector('section')).toHaveAttribute('data-background', '#123456');
		expect(container.querySelector('h2')).toHaveClass('fragment', 'highlight-red');
	});

	it('matches the core plugin code block line highlight syntax', () => {
		const { container } = render(
			<Markdown>
				{`
\`\`\`javascript [456: 3,4,5]
console.log('hello');
\`\`\`
				`}
			</Markdown>
		);

		const code = container.querySelector('code');
		expect(code).toHaveClass('javascript');
		expect(code).toHaveAttribute('data-line-numbers', '3,4,5');
		expect(code).toHaveAttribute('data-ln-start-from', '456');
	});

	it('runs the Reveal highlight plugin when the deck becomes available later', () => {
		const highlightBlock = vi.fn((block: HTMLElement) => {
			block.setAttribute('data-highlighted', 'yes');
		});
		const deck = {
			getPlugin: vi.fn().mockReturnValue({ highlightBlock }),
			syncFragments: vi.fn(),
		} as any;

		const { container, rerender } = render(
			<RevealContext.Provider value={null}>
				<Markdown markdown={'```javascript\nconsole.log("hello");\n```'} />
			</RevealContext.Provider>
		);

		expect(highlightBlock).not.toHaveBeenCalled();

		rerender(
			<RevealContext.Provider value={deck}>
				<Markdown markdown={'```javascript\nconsole.log("hello");\n```'} />
			</RevealContext.Provider>
		);

		const section = container.querySelector('section');
		const code = container.querySelector('code');
		expect(code).toBeInTheDocument();
		expect(highlightBlock).toHaveBeenCalledWith(code);
		expect(code).toHaveAttribute('data-highlighted', 'yes');
		expect(deck.syncFragments).toHaveBeenCalledWith(section);
	});

	it('rehighlights markdown code blocks when the same slide rerenders', () => {
		const highlightBlock = vi.fn((block: HTMLElement) => {
			block.setAttribute('data-highlighted', 'yes');
		});
		const deck = {
			getPlugin: vi.fn().mockReturnValue({ highlightBlock }),
			syncFragments: vi.fn(),
		} as any;

		const { container, rerender } = render(
			<RevealContext.Provider value={deck}>
				<Markdown markdown={'```javascript\nconsole.log("hello");\n```'} />
			</RevealContext.Provider>
		);

		const code = container.querySelector('code');
		expect(code).toHaveAttribute('data-highlighted', 'yes');
		expect(highlightBlock).toHaveBeenCalledTimes(1);

		code?.removeAttribute('data-highlighted');

		rerender(
			<RevealContext.Provider value={deck}>
				<Markdown markdown={'```javascript\nconsole.log("hello");\n```'} />
			</RevealContext.Provider>
		);

		const rerenderedCode = container.querySelector('code');
		expect(highlightBlock).toHaveBeenCalledTimes(2);
		expect(rerenderedCode).toHaveAttribute('data-highlighted', 'yes');
	});

	it('can load markdown from an external source', async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			text: vi.fn().mockResolvedValue('## Remote slide'),
		});
		vi.stubGlobal('fetch', fetchMock);

		render(<Markdown src="/slides.md" />);

		expect(await screen.findByText('Remote slide')).toBeInTheDocument();
		expect(fetchMock).toHaveBeenCalledWith('/slides.md', expect.any(Object));
	});
});
