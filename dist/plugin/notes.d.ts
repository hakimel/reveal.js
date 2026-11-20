import { RevealPlugin } from 'reveal.js';
export interface NotesPlugin extends RevealPlugin {
    id: 'notes';
    open(): void;
}
declare const Notes: () => NotesPlugin;
export default Notes;
