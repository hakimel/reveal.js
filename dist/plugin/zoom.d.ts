import type Reveal from 'reveal.js';

export interface ZoomPlugin extends Reveal.Plugin {
	id: 'zoom';
}

declare const Zoom: () => ZoomPlugin;

export default Zoom;
