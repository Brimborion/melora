import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'tests/e2e',
	timeout: 30000,
	expect: {
		toHaveTimeout: 5000
	},
	forwardPorts: [],
	fullyParallel: true,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:4173',
		trace: 'on-first-retry',
	},
	webServer: {
		command: 'pnpm run preview',
		port: 4173,
		reuseExistingServer: !process.env.CI,
	},
	projects: [
		{
			name: 'chromium',
			use: { browserName: 'chromium' },
		},
	],
});
