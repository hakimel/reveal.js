import { render, screen, cleanup } from '@testing-library/vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { shallowRef, nextTick } from 'vue';
import Markdown from '../components/Markdown.vue';
import { RevealContextKey } from '../reveal-context';

describe('Markdown', () => {
	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
	});

	it('renders markdown as slide HTML and normalizes common indentation', () => {
		const { container } = render(Markdown, {
			props: {
                markdown: `
					## Hello

					A paragraph with **markdown**.
				`
            }
		});

		const section = container.querySelector('section');
		expect(section?.querySelector('h2')).toHaveTextContent('Hello');
		expect(section?.querySelector('p')).toHaveTextContent('A paragraph with markdown.');
	});

	it('renders new slide HTML when the markdown source changes', async () => {
		const { container, rerender } = render(Markdown, {
            props: { markdown: '## Before' }
        });

		expect(container.querySelector('h2')).toHaveTextContent('Before');

		await rerender({ markdown: '### After\n\nUpdated paragraph' });

		expect(container.querySelector('h2')).not.toBeInTheDocument();
		expect(container.querySelector('h3')).toHaveTextContent('After');
		expect(container.querySelector('p')).toHaveTextContent('Updated paragraph');
	});

	it('splits horizontal and vertical slides using custom separators', () => {
		const { container } = render(Markdown, {
            props: {
                separator: '^\\n---\\n$',
                verticalSeparator: '^\\n--\\n$',
				markdown: `
## Slide 1.1

--

## Slide 1.2

---

## Slide 2
				`
            }
		});

		const topLevelSections = Array.from(container.children).filter(
			(element): element is HTMLElement => element.tagName === 'SECTION'
		);
		expect(topLevelSections).toHaveLength(2);
		expect(topLevelSections[0].querySelectorAll(':scope > section')).toHaveLength(2);
		expect(topLevelSections[1]).toHaveTextContent('Slide 2');
	});

	it('creates speaker notes using the configured notes separator', () => {
		const { container } = render(Markdown, {
            props: {
                notesSeparator: '^Note:',
				markdown: `
## Slide

Visible content

Note:
Remember this detail
				`
            }
		});

		expect(container.querySelector('section')).toHaveTextContent('Visible content');
		expect(container.querySelector('aside.notes')).toHaveTextContent('Remember this detail');
	});

	it('applies .slide attributes to the generated section', () => {
		const { container } = render(Markdown, {
			props: {
                markdown: `
<!-- .slide: id="intro" data-background="#ff0000" -->
## Intro
				`
            }
		});

		const section = container.querySelector('section');
		expect(section).toHaveAttribute('id', 'intro');
		expect(section).toHaveAttribute('data-background', '#ff0000');
	});

	it('applies .element attributes to the preceding markdown element', () => {
		const { container } = render(Markdown, {
			props: {
                markdown: `
- Item 1 <!-- .element: class="fragment" data-fragment-index="2" -->
- Item 2
				`
            }
		});

		const items = container.querySelectorAll('li');
		expect(items[0]).toHaveClass('fragment');
		expect(items[0]).toHaveAttribute('data-fragment-index', '2');
		expect(items[1]).not.toHaveClass('fragment');
	});

	it('supports custom slide and element attribute separators', () => {
		const { container } = render(Markdown, {
            props: {
                slideAttributesSeparator: '--\\s(.*?)$',
                elementAttributesSeparator: '{_\\s*?([^}]+?)}',
				markdown: `
<!-- -- data-background="#123456" -->
## Title <!-- {_class="fragment highlight-red"} -->
				`
            }
		});

		expect(container.querySelector('section')).toHaveAttribute('data-background', '#123456');
		expect(container.querySelector('h2')).toHaveClass('fragment', 'highlight-red');
	});

	it('matches the core plugin code block line highlight syntax', () => {
		const { container } = render(Markdown, {
			props: {
                markdown: `
\`\`\`javascript [456: 3,4,5]
console.log('hello');
\`\`\`
				`
            }
		});

		const code = container.querySelector('code');
		expect(code).toHaveClass('javascript');
		expect(code).toHaveAttribute('data-line-numbers', '3,4,5');
		expect(code).toHaveAttribute('data-ln-start-from', '456');
	});

	it('runs the Reveal highlight plugin when the deck becomes available later', async () => {
		const highlightBlock = vi.fn((block: HTMLElement) => {
			block.setAttribute('data-highlighted', 'yes');
		});
		const deck = {
			getPlugin: vi.fn().mockReturnValue({ highlightBlock }),
			syncFragments: vi.fn(),
		} as any;

		const deckRef = shallowRef(null as any);

		const { container } = render(Markdown, {
			props: {
				markdown: '```javascript\nconsole.log(\'hello\');\n```',
			},
			global: {
				provide: { [RevealContextKey as symbol]: deckRef },
			},
		});

		expect(highlightBlock).not.toHaveBeenCalled();

		deckRef.value = deck;
		await nextTick();
		await nextTick();

		const section = container.querySelector('section');
		const code = container.querySelector('code');
		expect(code).toBeInTheDocument();
		expect(highlightBlock).toHaveBeenCalledWith(code);
		expect(code).toHaveAttribute('data-highlighted', 'yes');
		expect(deck.syncFragments).toHaveBeenCalledWith(section);
	});

	it('can load markdown from an external source', async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			text: vi.fn().mockResolvedValue('## Remote slide'),
		});
		vi.stubGlobal('fetch', fetchMock);

		render(Markdown, {
            props: { src: '/slides.md' }
        });

		expect(await screen.findByText('Remote slide')).toBeInTheDocument();
		expect(fetchMock).toHaveBeenCalledWith('/slides.md', expect.any(Object));
	});
});
