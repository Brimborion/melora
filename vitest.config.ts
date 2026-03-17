import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.ts', 'tests/**/*.test.ts'],
		environment: 'jsdom',
		setupFiles: ['./tests/setup.ts'],
		coverage: {
			reporter: ['text', 'html'],
			exclude: ['node_modules/', 'tests/', '**/*.d.ts']
		}
	}
});
