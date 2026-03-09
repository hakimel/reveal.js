import type Reveal from 'reveal.js';

interface SearchPlugin extends Reveal.Plugin {
	open(): void;
	close(): void;
	toggle(): void;
}

declare const Search: () => SearchPlugin;

export default Search;
