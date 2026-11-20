import type { HLJSApi } from 'highlight.js';
import type { RevealPlugin } from 'reveal.js';

// @ts-expect-error The runtime implementation remains in JS during the migration.
import HighlightImplementation from './plugin.js';

export interface HighlightLine {
	start?: number;
	end?: number;
}

export interface HighlightLineNumbersOptions {
	singleLine?: boolean;
	startFrom?: number;
}

export interface HighlightJsApi extends HLJSApi {
	initLineNumbersOnLoad(options?: HighlightLineNumbersOptions): void;
	lineNumbersBlock(element: HTMLElement, options?: HighlightLineNumbersOptions): void;
	lineNumbersValue(code: string, options?: HighlightLineNumbersOptions): string | undefined;
}

export interface HighlightScrollState {
	currentBlock?: HTMLElement;
	animationFrameID?: number;
}

export interface HighlightLineBounds {
	top: number;
	bottom: number;
}

export type HighlightLineStep = HighlightLine[];

export interface HighlightPlugin extends RevealPlugin {
	id: 'highlight';
	HIGHLIGHT_STEP_DELIMITER: '|';
	HIGHLIGHT_LINE_DELIMITER: ',';
	HIGHLIGHT_LINE_RANGE_DELIMITER: '-';
	hljs: HighlightJsApi;
	highlightBlock(block: HTMLElement): void;
	scrollHighlightedLineIntoView(
		block: HTMLElement,
		scrollState: HighlightScrollState,
		skipAnimation?: boolean
	): void;
	easeInOutQuart(t: number): number;
	getHighlightedLineBounds(block: HTMLElement): HighlightLineBounds;
	highlightLines(block: HTMLElement, linesToHighlight?: string): void;
	deserializeHighlightSteps(highlightSteps: string): HighlightLineStep[];
	serializeHighlightSteps(highlightSteps: HighlightLineStep[]): string;
}

const Highlight = HighlightImplementation as () => HighlightPlugin;

export default Highlight;
