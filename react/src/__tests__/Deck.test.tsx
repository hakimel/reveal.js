import { render, act, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockApi = vi.hoisted(() => ({
	initialize: vi.fn().mockResolvedValue(undefined),
	destroy: vi.fn(),
	sync: vi.fn(),
	isReady: vi.fn().mockReturnValue(true),
	on: vi.fn(),
	off: vi.fn(),
	configure: vi.fn(),
}));

const RevealConstructor = vi.hoisted(() =>
	vi.fn(function () {
		return mockApi;
	})
);

vi.mock('reveal.js', () => ({ default: RevealConstructor }));

import { Deck, Slide, useReveal } from '../index';

beforeEach(() => {
	vi.clearAllMocks();
	mockApi.initialize.mockResolvedValue(undefined);
	mockApi.isReady.mockReturnValue(true);
});

describe('Deck', () => {
	it('renders .reveal > .slides structure', async () => {
		let container: HTMLElement;
		await act(async () => {
			({ container } = render(
				<Deck>
					<Slide>Hello</Slide>
				</Deck>
			));
		});

		const reveal = container!.querySelector('.reveal');
		expect(reveal).toBeInTheDocument();

		const slides = reveal?.querySelector('.slides');
		expect(slides).toBeInTheDocument();

		const section = slides?.querySelector('section');
		expect(section).toHaveTextContent('Hello');
	});

	it('calls new Reveal() and initialize() on mount', async () => {
		await act(async () => {
			render(
				<Deck config={{ transition: 'slide', hash: true }}>
					<Slide>Test</Slide>
				</Deck>
			);
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
		await act(async () => {
			render(
				<Deck>
					<Slide>Test</Slide>
				</Deck>
			);
		});

		await act(async () => {
			cleanup();
		});

		expect(mockApi.destroy).toHaveBeenCalledTimes(1);
	});

	it('calls sync() after render when ready', async () => {
		await act(async () => {
			render(
				<Deck>
					<Slide>Test</Slide>
				</Deck>
			);
		});

		expect(mockApi.sync).toHaveBeenCalled();
	});

	it('does not call sync() twice when configure() already syncs', async () => {
		mockApi.configure.mockImplementation(() => {
			mockApi.sync();
		});

		let rerender: ReturnType<typeof render>['rerender'];
		await act(async () => {
			({ rerender } = render(
				<Deck config={{ transition: 'slide' }}>
					<Slide>Test</Slide>
				</Deck>
			));
		});

		mockApi.configure.mockClear();
		mockApi.sync.mockClear();

		await act(async () => {
			rerender(
				<Deck config={{ transition: 'convex' }}>
					<Slide>Test</Slide>
				</Deck>
			);
		});

		expect(mockApi.configure).toHaveBeenCalledTimes(1);
		expect(mockApi.sync).toHaveBeenCalledTimes(1);
	});

	it('fires onReady callback after initialization', async () => {
		const onReady = vi.fn();

		await act(async () => {
			render(
				<Deck onReady={onReady}>
					<Slide>Test</Slide>
				</Deck>
			);
		});

		expect(onReady).toHaveBeenCalledWith(mockApi);
	});

	it('wires onSlideChange to the slidechanged event', async () => {
		const onSlideChange = vi.fn();

		await act(async () => {
			render(
				<Deck onSlideChange={onSlideChange}>
					<Slide>Test</Slide>
				</Deck>
			);
		});

		expect(mockApi.on).toHaveBeenCalledWith('slidechanged', onSlideChange);
	});

	it('cleans up event listeners on unmount', async () => {
		const onSlideChange = vi.fn();

		await act(async () => {
			render(
				<Deck onSlideChange={onSlideChange}>
					<Slide>Test</Slide>
				</Deck>
			);
		});

		await act(async () => {
			cleanup();
		});

		expect(mockApi.off).toHaveBeenCalledWith('slidechanged', onSlideChange);
	});

	it('passes plugins to the Reveal constructor', async () => {
		const fakePlugin = () => ({ id: 'fake', init: () => {} });

		await act(async () => {
			render(
				<Deck plugins={[fakePlugin]}>
					<Slide>Test</Slide>
				</Deck>
			);
		});

		expect(RevealConstructor).toHaveBeenCalledWith(
			expect.any(HTMLElement),
			expect.objectContaining({ plugins: [fakePlugin] })
		);
	});

	it('applies className and style to the .reveal div', async () => {
		let container: HTMLElement;
		await act(async () => {
			({ container } = render(
				<Deck className="custom" style={{ height: '400px' }}>
					<Slide>Test</Slide>
				</Deck>
			));
		});

		const reveal = container!.querySelector('.reveal');
		expect(reveal).toHaveClass('reveal', 'custom');
		expect(reveal).toHaveStyle({ height: '400px' });
	});

	it('does not initialize twice in StrictMode', async () => {
		await act(async () => {
			render(
				<Deck>
					<Slide>Test</Slide>
				</Deck>
			);
		});

		expect(RevealConstructor).toHaveBeenCalledTimes(1);
		expect(mockApi.initialize).toHaveBeenCalledTimes(1);
	});
});

describe('useReveal', () => {
	it('returns the Reveal.Api instance inside a Deck', async () => {
		let hookResult: any = undefined;

		function Inspector() {
			hookResult = useReveal();
			return null;
		}

		await act(async () => {
			render(
				<Deck>
					<Slide>
						<Inspector />
					</Slide>
				</Deck>
			);
		});

		expect(hookResult).toBe(mockApi);
	});

	it('returns null outside of a Deck', () => {
		let hookResult: any = 'not-null';

		function Inspector() {
			hookResult = useReveal();
			return null;
		}

		render(<Inspector />);
		expect(hookResult).toBeNull();
	});
});
