import type Reveal from 'reveal.js';

export interface NotesPlugin extends Reveal.Plugin {
	id: 'notes';
	open(): void;
}

declare const Notes: () => NotesPlugin;

export default Notes;
