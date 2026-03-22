import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.svg', 'robots.txt'],
			manifest: {
				name: 'Melora - Music Ear Training',
				short_name: 'Melora',
				description: 'Music ear training game with progressive levels',
				theme_color: '#1A1A2E',
				background_color: '#1A1A2E',
				display: 'standalone',
				scope: '/',
				start_url: '/',
				icons: [
					{
						src: 'icon-192.svg',
						sizes: '192x192',
						type: 'image/svg+xml'
					},
					{
						src: 'icon-512.svg',
						sizes: '512x512',
						type: 'image/svg+xml'
					},
					{
						src: 'icon-512.svg',
						sizes: '512x512',
						type: 'image/svg+xml',
						purpose: 'any maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
				runtimeCaching: [
					// Google Fonts
					{
						urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'google-fonts-cache',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					},
					{
						urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'gstatic-fonts-cache',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					},
					// Salamander Sound Library (piano samples)
					{
						urlPattern: /^https:\/\/tonejs\.github\.io\/audio\/salamander\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'salamander-samples',
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					}
				]
			}
		})
	]
});
