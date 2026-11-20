import type { RevealPlugin } from 'reveal.js';

// @ts-expect-error The runtime implementation remains in JS during the migration.
import NotesImplementation from './plugin.js';

export interface NotesPlugin extends RevealPlugin {
	id: 'notes';
	open(): void;
}

const Notes = NotesImplementation as () => NotesPlugin;

export default Notes;
