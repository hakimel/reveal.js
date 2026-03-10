import type { RevealPlugin } from 'reveal.js';

// @ts-expect-error The runtime implementation remains in JS during the migration.
import ZoomImplementation from './plugin.js';

export interface ZoomPlugin extends RevealPlugin {
	id: 'zoom';
}

const Zoom = ZoomImplementation as () => ZoomPlugin;

export default Zoom;
