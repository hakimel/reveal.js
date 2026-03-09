import type Reveal from 'reveal.js';
import type { Marked } from 'marked';

export interface MarkdownSlidifyOptions {
	separator?: string | null;
	verticalSeparator?: string | null;
	notesSeparator?: string;
	attributes?: string;
}

export interface MarkdownOptions extends Reveal.MarkdownConfig {
	animateLists?: boolean;
}

export interface MarkdownPlugin extends Reveal.Plugin {
	id: 'markdown';
	processSlides(scope: ParentNode): Promise<void[]>;
	convertSlides(): Promise<void>;
	slidify(markdown: string, options?: MarkdownSlidifyOptions): string;
	readonly marked: Marked | null;
	readonly markdownOptions: MarkdownOptions;
}

declare const Markdown: () => MarkdownPlugin;

export default Markdown;
