import { MarkdownConfig, RevealPlugin } from 'reveal.js';
import { Marked } from 'marked';
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
declare const Markdown: () => MarkdownPlugin;
export default Markdown;
