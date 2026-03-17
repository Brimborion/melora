// Integration tests for the setup flow
import { describe, it, expect, beforeEach } from 'vitest';
import { preferencesStore } from '$lib/stores/preferences.svelte';
import { db } from '$lib/db';

describe('Setup Flow Integration Tests', () => {
	beforeEach(async () => {
		await db.preferences.clear();
		// Reload store to get fresh state
		await preferencesStore.load();
	});

	describe('Complete Setup Flow', () => {
		it('should save preferences for new users', async () => {
			// Simulate new user flow
			const initialPrefs = await db.preferences.get('default');
			expect(initialPrefs).toBeDefined();

			// Load preferences - should create defaults
			expect(preferencesStore.isLoaded).toBe(true);
			expect(preferencesStore.preferences.difficulty).toBe('beginner');
		});

		it('should detect returning users with custom preferences', async () => {
			// Create existing user with custom setup
			await db.preferences.put({
				id: 'default',
				username: 'Player',
				theme: 'dark',
				audioVolume: 0.8,
				musicEnabled: true,
				soundEffectsEnabled: true,
				highContrastMode: true,
				reducedMotion: false,
				textSize: 'large',
				difficulty: 'advanced',
				createdAt: new Date(),
				updatedAt: new Date()
			});

			// Load preferences - should load existing
			await preferencesStore.load();
			expect(preferencesStore.preferences.difficulty).toBe('advanced');
			expect(preferencesStore.preferences.highContrastMode).toBe(true);
		});

		it('should persist difficulty across sessions', async () => {
			// First session: user selects difficulty
			await preferencesStore.update('difficulty', 'advanced');
			
			// Verify saved to DB
			const stored = await db.preferences.get('default');
			expect(stored?.difficulty).toBe('advanced');
		});

		it('should persist accessibility settings across sessions', async () => {
			await preferencesStore.updateMany({
				highContrastMode: true,
				reducedMotion: true
			});

			const stored = await db.preferences.get('default');
			expect(stored?.highContrastMode).toBe(true);
			expect(stored?.reducedMotion).toBe(true);
		});
	});

	describe('Journey Map Accessibility Integration', () => {
		it('should apply high contrast mode preference', async () => {
			// Setup user with high contrast enabled
			await db.preferences.put({
				id: 'default',
				username: 'Player',
				theme: 'dark',
				audioVolume: 0.8,
				musicEnabled: true,
				soundEffectsEnabled: true,
				highContrastMode: true,
				reducedMotion: false,
				textSize: 'medium',
				difficulty: 'beginner',
				createdAt: new Date(),
				updatedAt: new Date()
			});

			await preferencesStore.load();

			const prefs = preferencesStore.preferences;
			expect(prefs.highContrastMode).toBe(true);
		});

		it('should apply reduced motion preference', async () => {
			await db.preferences.put({
				id: 'default',
				username: 'Player',
				theme: 'dark',
				audioVolume: 0.8,
				musicEnabled: true,
				soundEffectsEnabled: true,
				highContrastMode: false,
				reducedMotion: true,
				textSize: 'small',
				difficulty: 'beginner',
				createdAt: new Date(),
				updatedAt: new Date()
			});

			await preferencesStore.load();

			const prefs = preferencesStore.preferences;
			expect(prefs.reducedMotion).toBe(true);
		});

		it('should combine multiple accessibility settings', async () => {
			await db.preferences.put({
				id: 'default',
				username: 'Player',
				theme: 'dark',
				audioVolume: 0.8,
				musicEnabled: true,
				soundEffectsEnabled: true,
				highContrastMode: true,
				reducedMotion: true,
				textSize: 'large',
				difficulty: 'intermediate',
				createdAt: new Date(),
				updatedAt: new Date()
			});

			await preferencesStore.load();

			const prefs = preferencesStore.preferences;
			expect(prefs.highContrastMode).toBe(true);
			expect(prefs.reducedMotion).toBe(true);
			expect(prefs.difficulty).toBe('intermediate');
		});
	});
});
