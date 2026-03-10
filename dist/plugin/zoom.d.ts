import { RevealPlugin } from 'reveal.js';
export interface ZoomPlugin extends RevealPlugin {
    id: 'zoom';
}
declare const Zoom: () => ZoomPlugin;
export default Zoom;
