import { render, cleanup } from '@testing-library/vue';
import { describe, it, expect, vi, afterEach } from 'vitest';
import Slide from '../components/Slide.vue';
import { RevealContextKey } from '../reveal-context';
import { shallowRef, ref, defineComponent, provide, nextTick } from 'vue';

describe('Slide', () => {
    afterEach(() => {
        cleanup();
    });

	it('renders as a <section> element', () => {
		const { container } = render(Slide, { slots: { default: 'Hello' }});
		const section = container.querySelector('section');
		expect(section).toBeInTheDocument();
		expect(section).toHaveTextContent('Hello');
	});

	it('passes component attributes as data-* through Vue fallback', () => {
		const { container } = render(Slide, {
            attrs: {
                'data-background': '#ff0000',
                'data-transition': 'zoom',
                'data-auto-animate': ''
            },
            slots: { default: 'Content'}
        });

		const section = container.querySelector('section');
		expect(section).toHaveAttribute('data-background', '#ff0000');
		expect(section).toHaveAttribute('data-transition', 'zoom');
		expect(section).toHaveAttribute('data-auto-animate', '');
	});

	it('maps background shorthand props to slide data attributes', () => {
		const { container } = render(Slide, {
            props: {
                background: '#111827',
                backgroundImage: 'https://example.com/hero.png',
                backgroundColor: '#000000',
                backgroundOpacity: 0.4,
                backgroundTransition: 'zoom',
                backgroundVideoLoop: true
            },
            slots: { default: 'Content' }
        });

		const section = container.querySelector('section');
		expect(section).toHaveAttribute('data-background', '#111827');
		expect(section).toHaveAttribute('data-background-image', 'https://example.com/hero.png');
		expect(section).toHaveAttribute('data-background-color', '#000000');
		expect(section).toHaveAttribute('data-background-opacity', '0.4');
		expect(section).toHaveAttribute('data-background-transition', 'zoom');
		expect(section).toHaveAttribute('data-background-video-loop', '');
	});

	it('maps visibility and auto-animate shorthand props to slide data attributes', () => {
		const { container } = render(Slide, {
            props: {
                visibility: 'hidden',
                autoAnimate: true,
                autoAnimateId: 'hero',
                autoAnimateRestart: true,
                autoAnimateUnmatched: false,
                autoAnimateEasing: 'ease-out',
                autoAnimateDuration: 0.6,
                autoAnimateDelay: 0.1
            },
            slots: { default: 'Content' }
        });

		const section = container.querySelector('section');
		expect(section).toHaveAttribute('data-visibility', 'hidden');
		expect(section).toHaveAttribute('data-auto-animate', '');
		expect(section).toHaveAttribute('data-auto-animate-id', 'hero');
		expect(section).toHaveAttribute('data-auto-animate-restart', '');
		expect(section).toHaveAttribute('data-auto-animate-unmatched', 'false');
		expect(section).toHaveAttribute('data-auto-animate-easing', 'ease-out');
		expect(section).toHaveAttribute('data-auto-animate-duration', '0.6');
		expect(section).toHaveAttribute('data-auto-animate-delay', '0.1');
	});

	it('maps common Reveal slide shorthand props to data attributes', () => {
		const { container } = render(Slide, {
            props: {
                transition: 'zoom-in fade-out',
                transitionSpeed: 'fast',
                autoSlide: 1500,
                notes: 'Speaker notes',
                backgroundInteractive: true,
                preload: true
            },
            slots: { default: 'Content' }
        });

		const section = container.querySelector('section');
		expect(section).toHaveAttribute('data-transition', 'zoom-in fade-out');
		expect(section).toHaveAttribute('data-transition-speed', 'fast');
		expect(section).toHaveAttribute('data-autoslide', '1500');
		expect(section).toHaveAttribute('data-notes', 'Speaker notes');
		expect(section).toHaveAttribute('data-background-interactive', '');
		expect(section).toHaveAttribute('data-preload', '');
	});

	it('prefers explicit data-* attributes over shorthand props', () => {
		const { container } = render(Slide, {
            props: {
                background: '#111827',
                backgroundColor: '#000000',
                autoAnimate: true,
                visibility: 'hidden',
                transition: 'zoom',
                notes: 'Shorthand notes',
                preload: true
            },
            attrs: {
                'data-background': '#222222',
                'data-background-color': '#333333',
                'data-auto-animate': '',
                'data-visibility': 'uncounted',
                'data-transition': 'fade',
                'data-notes': 'Raw notes',
                'data-preload': ''
            },
            slots: { default: 'Content' }
        });

		const section = container.querySelector('section');
		expect(section).toHaveAttribute('data-background', '#222222');
		expect(section).toHaveAttribute('data-background-color', '#333333');
		expect(section).toHaveAttribute('data-auto-animate', '');
		expect(section).toHaveAttribute('data-visibility', 'uncounted');
		expect(section).toHaveAttribute('data-transition', 'fade');
		expect(section).toHaveAttribute('data-notes', 'Raw notes');
		expect(section).toHaveAttribute('data-preload', '');
	});

	it('applies className and style', () => {
		const { container } = render(Slide, {
            attrs: {
                class: 'intro',
                style: 'font-size: 20px;'
            },
            slots: { default: 'Styled' }
        });

		const section = container.querySelector('section');
		expect(section).toHaveClass('intro');
		expect(section).toHaveStyle({ fontSize: '20px' });
	});

	it('passes id and aria attributes', () => {
		const { container } = render(Slide, {
            attrs: {
                id: 'slide-1',
                'aria-label': 'Introduction'
            },
            slots: { default: 'Accessible' }
        });

		const section = container.querySelector('section');
		expect(section).toHaveAttribute('id', 'slide-1');
		expect(section).toHaveAttribute('aria-label', 'Introduction');
	});

	it('renders children of any type', () => {
		const { container } = render(Slide, {
            slots: { default: '<h1>Title</h1><p>Paragraph</p>'}
        });

		const section = container.querySelector('section');
		expect(section?.querySelector('h1')).toHaveTextContent('Title');
		expect(section?.querySelector('p')).toHaveTextContent('Paragraph');
	});

	it('calls syncSlide when shorthand background props change after mount', async () => {
		const deck = { syncSlide: vi.fn() } as any;
		const deckRef = shallowRef(deck);
		const bgColor = ref('#111');

		const Wrapper = defineComponent({
			components: { Slide },
			setup() {
				provide(RevealContextKey, deckRef);
				return { bgColor };
			},
			template: '<Slide :background-color="bgColor">Content</Slide>',
		});

		const { container } = render(Wrapper);
		await nextTick();
		await nextTick();
		await nextTick();

		expect(deck.syncSlide).not.toHaveBeenCalled();

		bgColor.value = '#222';
		await nextTick();
		await nextTick();
		await nextTick();

		expect(deck.syncSlide).toHaveBeenCalledTimes(1);
		expect(deck.syncSlide).toHaveBeenCalledWith(container.querySelector('section'));
	});

	it('does not call syncSlide on first render even when data-* attributes are present', async () => {
		const deck = { syncSlide: vi.fn() } as any;

		render(Slide, {
            attrs: { 'data-background': '#111' },
            slots: { default: 'Content' },
            global: { provide: { [RevealContextKey as symbol]: shallowRef(deck) } }
        });
        await new Promise(r => setTimeout(r, 0));

		expect(deck.syncSlide).not.toHaveBeenCalled();
	});

	it('does not call syncSlide for non-data prop updates', async () => {
		const deck = { syncSlide: vi.fn() } as any;

		const { rerender } = render(Slide, {
            props: { backgroundColor: '#111' },
            attrs: { class: 'a' },
            slots: { default: 'Content' },
            global: { provide: { [RevealContextKey as symbol]: shallowRef(deck) } }
        });
        await new Promise(r => setTimeout(r, 0));

		deck.syncSlide.mockClear();

		await rerender({
            class: 'b'
        });
        await new Promise(r => setTimeout(r, 0));

		expect(deck.syncSlide).not.toHaveBeenCalled();
	});

	it('does not call syncSlide on mount when no data-* attributes are present', async () => {
		const deck = { syncSlide: vi.fn() } as any;

		render(Slide, {
            attrs: { class: 'plain' },
            slots: { default: 'Content' },
            global: { provide: { [RevealContextKey as symbol]: shallowRef(deck) } }
        });
        await new Promise(r => setTimeout(r, 0));

		expect(deck.syncSlide).not.toHaveBeenCalled();
	});
});
