import type { RevealPlugin } from 'reveal.js';

// @ts-expect-error The runtime implementation remains in JS during the migration.
import SearchImplementation from './plugin.js';

export interface SearchPlugin extends RevealPlugin {
	id: 'search';
	open(): void;
	close(): void;
	toggle(): void;
}

const Search = SearchImplementation as () => SearchPlugin;

export default Search;
