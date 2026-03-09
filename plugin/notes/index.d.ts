import type Reveal from 'reveal.js';

interface NotesPlugin extends Reveal.Plugin {
	open(): void;
}

declare const Notes: () => NotesPlugin;

export default Notes;
