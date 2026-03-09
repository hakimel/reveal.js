import type Reveal from 'reveal.js';

export interface SearchPlugin extends Reveal.Plugin {
	id: 'search';
	open(): void;
	close(): void;
	toggle(): void;
}

declare const Search: () => SearchPlugin;

export default Search;
