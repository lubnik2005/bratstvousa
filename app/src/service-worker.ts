/// <reference lib="webworker" />
import { build, version } from '$service-worker';

const worker = self as unknown as ServiceWorkerGlobalScope;
const prefix = 'bratstvo-mobile-';
const assetsName = `${prefix}assets-${version}`;
const pagesName = `${prefix}pages-${version}`;
const essential = build.filter((path) => /\.(js|css)$/.test(path));
const offline = '/offline.html';

worker.addEventListener('install', (event) => {
	// Cache route assets on use rather than downloading the entire site at install.
	event.waitUntil(
		caches
			.open(assetsName)
			.then((cache) =>
				cache.addAll([
					offline,
					'/css/main.min.css',
					'/fonts/opensans-cyrillic.woff2',
					'/fonts/lora-cyrillic.woff2'
				])
			)
	);
});

worker.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			for (const name of await caches.keys()) {
				if (name.startsWith(prefix) && name !== assetsName && name !== pagesName)
					await caches.delete(name);
			}
			await worker.clients.claim();
		})()
	);
});

async function store(
	cache: Cache,
	request: Request,
	response: Response,
	limit: number
): Promise<void> {
	await cache.put(request, response);
	const keys = await cache.keys();
	for (const key of keys.slice(0, Math.max(0, keys.length - limit))) await cache.delete(key);
}

worker.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);
	if (request.method !== 'GET' || url.origin !== worker.location.origin) return;
	const isAsset =
		essential.includes(url.pathname) ||
		url.pathname === '/css/main.min.css' ||
		/^\/fonts\/[^/]+\.woff2$/.test(url.pathname);
	const isPublicPage = /^\/(calendar|churches)(\/__data\.json)?\/?$/.test(url.pathname);
	if (!isAsset && !isPublicPage && request.mode !== 'navigate') return;
	event.respondWith(
		(async () => {
			const cache = await caches.open(isAsset ? assetsName : pagesName);
			if (isAsset) {
				const cached = await cache.match(request);
				if (cached) return cached;
			}
			try {
				const response = await fetch(request);
				if (isPublicPage && /private|no-store/.test(response.headers.get('cache-control') ?? '')) {
					await cache.delete(request);
				}
				if (
					response.ok &&
					!response.redirected &&
					(isAsset || (isPublicPage && /public/.test(response.headers.get('cache-control') ?? '')))
				) {
					await store(cache, request, response.clone(), isAsset ? 100 : 24);
				}
				return response;
			} catch {
				const cached = await cache.match(request);
				if (cached) return cached;
				if (request.mode === 'navigate') return (await caches.match(offline)) ?? Response.error();
				return Response.error();
			}
		})()
	);
});
