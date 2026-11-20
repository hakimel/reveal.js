import { resolve } from 'node:path';

const normalizePath = (filePath: string): string => filePath.replace(/\\/g, '/');

export const rewriteLegacyCoreDtsPath = (filePath: string): string => {
	const normalizedPath = normalizePath(filePath);
	const legacyPathMarker = '/dist/js/';
	const markerIndex = normalizedPath.indexOf(legacyPathMarker);

	if (markerIndex === -1) {
		return filePath;
	}

	const distRoot = normalizedPath.slice(0, markerIndex + '/dist'.length);
	const relativePath = normalizedPath.slice(markerIndex + legacyPathMarker.length);

	return resolve(distRoot, relativePath);
};

export const rewriteLegacyPluginDtsPath = (filePath: string, pluginName: string): string | null => {
	const normalizedPath = normalizePath(filePath);

	if (normalizedPath.endsWith(`/${pluginName}.d.ts`)) {
		return filePath;
	}

	if (!normalizedPath.endsWith('/index.d.ts')) {
		return null;
	}

	const pluginDirectoryMarker = `/${pluginName}/`;
	const markerIndex = normalizedPath.indexOf(pluginDirectoryMarker);

	if (markerIndex === -1) {
		return null;
	}

	return resolve(normalizedPath.slice(0, markerIndex), `${pluginName}.d.ts`);
};
