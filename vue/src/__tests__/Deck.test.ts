import { render, cleanup } from '@testing-library/vue';
import { defineComponent, h, ref, nextTick, shallowRef, provide } from 'vue';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockApi = vi.hoisted(() => ({
	initialize: vi.fn().mockResolvedValue(undefined),
	destroy: vi.fn(),
	sync: vi.fn(),
	isReady: vi.fn().mockReturnValue(true),
	on: vi.fn(),
	off: vi.fn(),
	configure: vi.fn(),
    getPlugin: vi.fn(),
    syncFragments: vi.fn()
}));

const RevealConstructor = vi.hoisted(() =>
	vi.fn(function () {
		return mockApi;
	})
);

vi.mock('reveal.js', () => ({ default: RevealConstructor }));

import Deck from '../components/Deck.vue';
import Slide from '../components/Slide.vue';
import { useReveal } from '../index';
import { RevealContextKey } from '../reveal-context';

const tick = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => {
	vi.clearAllMocks();
	mockApi.initialize.mockResolvedValue(undefined);
	mockApi.isReady.mockReturnValue(true);
});

describe('Deck', () => {
	afterEach(() => {
		cleanup();
	});

	it('renders .reveal > .slides structure', async () => {
		const Wrapper = defineComponent({
			components: { Deck, Slide },
			template: '<Deck><Slide>Hello</Slide></Deck>',
		});

		const { container } = render(Wrapper);

		const reveal = container.querySelector('.reveal');
		expect(reveal).toBeInTheDocument();

		const slides = reveal?.querySelector('.slides');
		expect(slides).toBeInTheDocument();

		const section = slides?.querySelector('section');
		expect(section).toHaveTextContent('Hello');
	});

	it('calls new Reveal() and initialize() on mount', async () => {
		render(Deck, {
			props: { config: { transition: 'slide', hash: true } },
			slots: { default: () => '<section>Test</section>' },
		});

		expect(RevealConstructor).toHaveBeenCalledWith(
			expect.any(HTMLElement),
			expect.objectContaining({
				transition: 'slide',
				hash: true,
				plugins: [],
			})
		);
		expect(mockApi.initialize).toHaveBeenCalledTimes(1);
	});

	it('calls destroy() on unmount', async () => {
		const { unmount } = render(Deck, {
			slots: { default: '<section>Test</section>' },
		});
		await tick();
		unmount();
        await tick();

		expect(mockApi.destroy).toHaveBeenCalledTimes(1);
	});

	it('does not call sync() when slide content changes without structural changes', async () => {
		const count = ref(1);
		const Wrapper = defineComponent({
			components: { Deck, Slide },
			setup() {
				return { count };
			},
			template: '<Deck><Slide><p>Tick {{ count }}</p></Slide></Deck>',
		});

		render(Wrapper);
		await tick();
		await nextTick();
		await tick();
		mockApi.sync.mockClear();

		count.value = 2;
		await nextTick();
		await tick();

		expect(mockApi.sync).not.toHaveBeenCalled();
	});

	it('does not call sync() twice when configure() already syncs', async () => {
		mockApi.configure.mockImplementation(() => {
			mockApi.sync();
		});

		const { rerender } = render(Deck, {
			props: { config: { transition: 'slide' } },
			slots: { default: '<section>Test</section>' },
		});
		await tick();

		mockApi.configure.mockClear();
		mockApi.sync.mockClear();

		await rerender({ config: { transition: 'convex' } });
		await tick();

		expect(mockApi.configure).toHaveBeenCalledTimes(1);
		expect(mockApi.sync).toHaveBeenCalledTimes(1);
	});

	it('calls sync() when keyed slides are reordered', async () => {
		const items = ref(['first', 'second']);
		const Wrapper = defineComponent({
			components: { Deck, Slide },
			setup() {
				return { items };
			},
			template: `
				<Deck>
					<Slide v-for="item in items" :key="item">{{ item }}</Slide>
				</Deck>
			`,
		});

		render(Wrapper);
		await tick();
		mockApi.sync.mockClear();

		items.value = ['second', 'first'];
		await nextTick();
		await tick();

		expect(mockApi.sync).toHaveBeenCalledTimes(1);
	});

	it('fires ready emit after initialization', async () => {
		const onReady = vi.fn();
		const Wrapper = defineComponent({
			components: { Deck },
			setup() {
				return { onReady };
			},
			template: '<Deck @ready="onReady"><section>Test</section></Deck>',
		});

		render(Wrapper);
		await tick();

		expect(onReady).toHaveBeenCalledWith(mockApi);
	});

	it('wires slideChanged emit to the slidechanged event', async () => {
		const onSlideChanged = vi.fn();
		const Wrapper = defineComponent({
			components: { Deck },
			setup() {
				return { onSlideChanged };
			},
			template: '<Deck @slide-changed="onSlideChanged"><section>Test</section></Deck>',
		});

		render(Wrapper);
		await tick();

		expect(mockApi.on).toHaveBeenCalledWith('slidechanged', expect.any(Function));
	});

	it('cleans up event listeners on unmount', async () => {
		const Wrapper = defineComponent({
			components: { Deck },
			template: '<Deck><section>Test</section></Deck>',
		});

		const { unmount } = render(Wrapper);
		await tick();

		expect(mockApi.on).toHaveBeenCalled();
		const onCallCount = mockApi.on.mock.calls.length;

		unmount();
        await tick();

		expect(mockApi.off).toHaveBeenCalledTimes(onCallCount);
		for (const [name, handler] of mockApi.on.mock.calls) {
			expect(mockApi.off).toHaveBeenCalledWith(name, handler);
		}
	});

	it('applies class and style to the .reveal div', async () => {
		const { container } = render(Deck, {
			attrs: { class: 'custom', style: 'height: 400px;' },
			slots: { default: '<section>Test</section>' },
		});

		const reveal = container.querySelector('.reveal');
		expect(reveal).toHaveClass('reveal', 'custom');
		expect(reveal).toHaveStyle({ height: '400px' });
	});
});

describe('useReveal', () => {
	afterEach(() => {
		cleanup();
	});

	it('returns the RevealApi instance inside a Deck', async () => {
		let hookResult: any = undefined;

		const Inspector = defineComponent({
			setup() {
				hookResult = useReveal();
				return () => null;
			},
		});

		render(Deck, {
			slots: { default: () => h(Inspector) },
		});
		await tick();

		expect(hookResult.value).toBe(mockApi);
	});

	it('returns null outside of a Deck', () => {
		let hookResult: any = 'not-null';

		const Inspector = defineComponent({
			setup() {
				hookResult = useReveal();
				return () => null;
			},
		});

		render(Inspector);
		expect(hookResult.value).toBeNull();
	});
});
