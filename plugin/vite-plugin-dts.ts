import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';

export function createPluginDts(pluginName: string) {
	return dts({
		include: [`plugin/${pluginName}/index.ts`],
		entryRoot: 'plugin',
		outDir: 'dist/plugin',
		beforeWriteFile(filePath, content) {
			const normalizedPath = filePath.replace(/\\/g, '/');
			const generatedPathSuffix = `/dist/plugin/${pluginName}/index.d.ts`;

			if (!normalizedPath.endsWith(generatedPathSuffix)) {
				return false;
			}

			return {
				filePath: resolve(process.cwd(), 'dist/plugin', `${pluginName}.d.ts`),
				content,
			};
		},
	});
}
