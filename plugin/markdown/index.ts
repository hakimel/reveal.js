import type { MarkdownConfig, RevealPlugin } from 'reveal.js';
import type { Marked } from 'marked';

// @ts-expect-error The runtime implementation remains in JS during the migration.
import MarkdownImplementation from './plugin.js';

export interface MarkdownSlidifyOptions {
	separator?: string | null;
	verticalSeparator?: string | null;
	notesSeparator?: string;
	attributes?: string;
}

export interface MarkdownOptions extends MarkdownConfig {
	animateLists?: boolean;
}

export interface MarkdownPlugin extends RevealPlugin {
	id: 'markdown';
	processSlides(scope: ParentNode): Promise<void[]>;
	convertSlides(): Promise<void>;
	slidify(markdown: string, options?: MarkdownSlidifyOptions): string;
	readonly marked: Marked | null;
	readonly markdownOptions: MarkdownOptions;
}

const Markdown = MarkdownImplementation as () => MarkdownPlugin;

export default Markdown;
