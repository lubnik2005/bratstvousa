import { json } from '@sveltejs/kit';

export const prerender = true;

export function GET() {
	return json(
		{
			name: 'Camp Paradise',
			short_name: 'Paradise',
			description:
				'A year-round Christian camp and retreat center in Strawberry Valley, California.',
			start_url: '/',
			scope: '/',
			display: 'standalone',
			orientation: 'portrait',
			background_color: '#0f3d2e',
			theme_color: '#0f3d2e',
			icons: [
				{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
				{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
				{
					src: '/icons/icon-maskable-512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'maskable'
				}
			]
		},
		{ headers: { 'content-type': 'application/manifest+json' } }
	);
}
