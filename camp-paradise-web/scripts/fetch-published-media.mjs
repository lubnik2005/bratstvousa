// Reuse existing optimized production assets; do not regenerate or change media storage.
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';

const source = await readFile(new URL('./fetch-assets.sh', import.meta.url), 'utf8');
const content = await readFile(new URL('../src/lib/content/site.ts', import.meta.url), 'utf8');
const slugs = [
	...new Set([
		...[...source.matchAll(/^\s+"([a-z0-9-]+):[^"\n]+"$/gm)].map((match) => match[1]),
		...[...content.matchAll(/\bimage:\s*['"]([a-z0-9-]+)['"]/g)].map((match) => match[1])
	])
];
const output = new URL('../static/media/', import.meta.url);
await mkdir(output, { recursive: true });
const files = slugs.flatMap((slug) =>
	[640, 1280, 1920].flatMap((width) =>
		['avif', 'webp', 'jpg'].map((ext) => `${slug}-${width}w.${ext}`)
	)
);
let downloaded = 0;
// Limit concurrent downloads to avoid hammering the public CDN on clean CI builds.
for (let offset = 0; offset < files.length; offset += 6) {
	await Promise.all(
		files.slice(offset, offset + 6).map(async (file) => {
			const target = new URL(file, output);
			if (
				await stat(target).then(
					(value) => value.size > 0,
					() => false
				)
			)
				return;
			const response = await fetch(`https://www.camp-paradise.org/media/${file}`, {
				headers: { 'User-Agent': 'camp-paradise-build/1.0' },
				signal: AbortSignal.timeout(30000)
			});
			if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
				throw new Error(`Published asset unavailable: ${file} (HTTP ${response.status})`);
			}
			await writeFile(target, new Uint8Array(await response.arrayBuffer()));
			downloaded++;
		})
	);
}
console.log(`Published media ready: ${files.length} assets, ${downloaded} downloaded unchanged.`);
