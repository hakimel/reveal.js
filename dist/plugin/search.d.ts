import { RevealPlugin } from 'reveal.js';
export interface SearchPlugin extends RevealPlugin {
    id: 'search';
    open(): void;
    close(): void;
    toggle(): void;
}
declare const Search: () => SearchPlugin;
export default Search;
