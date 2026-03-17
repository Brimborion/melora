// Unit tests for preferences store - Testing the store API
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { preferencesStore } from '$lib/stores/preferences.svelte';
import { db } from '$lib/db';

// Mock the browser environment
const mockMatchMedia = vi.fn().mockImplementation(query => ({
	matches: false,
	media: query,
	onchange: null,
	addListener: vi.fn(),
	removeListener: vi.fn(),
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
	dispatchEvent: vi.fn(),
}));

vi.stubGlobal('matchMedia', mockMatchMedia);

describe('Preferences Store API Tests', () => {
	beforeEach(async () => {
		// Clear preferences before each test
		await db.preferences.clear();
		// Reset the store state
		await preferencesStore.load();
	});

	describe('Store Initialization', () => {
		it('should initialize with default preferences', async () => {
			expect(preferencesStore.preferences.difficulty).toBe('beginner');
			expect(preferencesStore.preferences.highContrastMode).toBe(false);
			expect(preferencesStore.preferences.reducedMotion).toBe(false);
		});

		it('should have isLoaded true after load', async () => {
			expect(preferencesStore.isLoaded).toBe(true);
		});

		it('should not have error initially', () => {
			expect(preferencesStore.error).toBeNull();
		});
	});

	describe('Store API - update()', () => {
		it('should update single preference using update()', async () => {
			await preferencesStore.update('difficulty', 'intermediate');
			
			expect(preferencesStore.preferences.difficulty).toBe('intermediate');
			
			// Verify persistence
			const stored = await db.preferences.get('default');
			expect(stored?.difficulty).toBe('intermediate');
		});

		it('should update highContrastMode using update()', async () => {
			await preferencesStore.update('highContrastMode', true);
			
			expect(preferencesStore.preferences.highContrastMode).toBe(true);
			
			const stored = await db.preferences.get('default');
			expect(stored?.highContrastMode).toBe(true);
		});

		it('should update reducedMotion using update()', async () => {
			await preferencesStore.update('reducedMotion', true);
			
			expect(preferencesStore.preferences.reducedMotion).toBe(true);
			
			const stored = await db.preferences.get('default');
			expect(stored?.reducedMotion).toBe(true);
		});

		it('should update username using update()', async () => {
			await preferencesStore.update('username', 'MusicLover');
			
			expect(preferencesStore.preferences.username).toBe('MusicLover');
			
			const stored = await db.preferences.get('default');
			expect(stored?.username).toBe('MusicLover');
		});

		it('should update textSize using update()', async () => {
			await preferencesStore.update('textSize', 'large');
			
			expect(preferencesStore.preferences.textSize).toBe('large');
			
			const stored = await db.preferences.get('default');
			expect(stored?.textSize).toBe('large');
		});
	});

	describe('Store API - updateMany()', () => {
		it('should update multiple preferences at once using updateMany()', async () => {
			await preferencesStore.updateMany({
				difficulty: 'advanced',
				highContrastMode: true,
				reducedMotion: true
			});
			
			expect(preferencesStore.preferences.difficulty).toBe('advanced');
			expect(preferencesStore.preferences.highContrastMode).toBe(true);
			expect(preferencesStore.preferences.reducedMotion).toBe(true);
			
			// Verify persistence
			const stored = await db.preferences.get('default');
			expect(stored?.difficulty).toBe('advanced');
			expect(stored?.highContrastMode).toBe(true);
			expect(stored?.reducedMotion).toBe(true);
		});

		it('should preserve unchanged preferences when using updateMany()', async () => {
			// First set some preferences
			await preferencesStore.update('username', 'TestUser');
			
			// Update only difficulty
			await preferencesStore.updateMany({ difficulty: 'intermediate' });
			
			// Username should still be preserved
			expect(preferencesStore.preferences.username).toBe('TestUser');
			expect(preferencesStore.preferences.difficulty).toBe('intermediate');
		});
	});

	describe('Store API - Convenience Methods', () => {
		it('should set difficulty using setDifficulty()', async () => {
			await preferencesStore.setDifficulty('advanced');
			expect(preferencesStore.preferences.difficulty).toBe('advanced');
		});

		it('should set text size using setTextSize()', async () => {
			await preferencesStore.setTextSize('large');
			expect(preferencesStore.preferences.textSize).toBe('large');
			
			await preferencesStore.setTextSize('small');
			expect(preferencesStore.preferences.textSize).toBe('small');
			
			await preferencesStore.setTextSize('medium');
			expect(preferencesStore.preferences.textSize).toBe('medium');
		});

		it('should set theme using setTheme()', async () => {
			await preferencesStore.setTheme('light');
			expect(preferencesStore.preferences.theme).toBe('light');
		});

		it('should set volume with clamping using setVolume()', async () => {
			await preferencesStore.setVolume(0.5);
			expect(preferencesStore.preferences.audioVolume).toBe(0.5);
			
			// Test clamping - values > 1 should be clamped to 1
			await preferencesStore.setVolume(1.5);
			expect(preferencesStore.preferences.audioVolume).toBe(1);
			
			// Test clamping - values < 0 should be clamped to 0
			await preferencesStore.setVolume(-0.5);
			expect(preferencesStore.preferences.audioVolume).toBe(0);
		});

		it('should toggle music using toggleMusic()', async () => {
			const initial = preferencesStore.preferences.musicEnabled;
			await preferencesStore.toggleMusic();
			expect(preferencesStore.preferences.musicEnabled).toBe(!initial);
		});

		it('should toggle sound effects using toggleSoundEffects()', async () => {
			const initial = preferencesStore.preferences.soundEffectsEnabled;
			await preferencesStore.toggleSoundEffects();
			expect(preferencesStore.preferences.soundEffectsEnabled).toBe(!initial);
		});
	});

	describe('Store API - reset()', () => {
		it('should reset all preferences to defaults', async () => {
			// Customize preferences first
			await preferencesStore.updateMany({
				username: 'CustomUser',
				difficulty: 'advanced',
				highContrastMode: true
			});
			
			// Reset
			await preferencesStore.reset();
			
			// Verify defaults
			expect(preferencesStore.preferences.username).toBe('Player');
			expect(preferencesStore.preferences.difficulty).toBe('beginner');
			expect(preferencesStore.preferences.highContrastMode).toBe(false);
		});
	});

	describe('Data Persistence', () => {
		it('should persist preferences across store reloads', async () => {
			// Set preferences
			await preferencesStore.updateMany({
				difficulty: 'intermediate',
				highContrastMode: true
			});
			
			// Simulate a new page load by loading again
			await preferencesStore.load();
			
			// Preferences should be persisted
			expect(preferencesStore.preferences.difficulty).toBe('intermediate');
			expect(preferencesStore.preferences.highContrastMode).toBe(true);
		});

		it('should update updatedAt timestamp on changes', async () => {
			const before = new Date();
			await preferencesStore.update('difficulty', 'advanced');
			const after = new Date();
			
			expect(preferencesStore.preferences.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
			expect(preferencesStore.preferences.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
		});
	});

	describe('New User Detection (Setup Flow)', () => {
		/**
		 * These tests verify the logic used in +page.svelte for detecting new users:
		 * const isNewUser = !prefs.updatedAt;
		 * 
		 * The bug was: users who completed setup but kept default values were
		 * incorrectly redirected back to /setup because the old logic checked
		 * if values differed from defaults, not just if updatedAt existed.
		 */

		it('should have updatedAt set after any preference change', async () => {
			// Clear and reload to get fresh state
			await db.preferences.clear();
			await preferencesStore.load();
			
			// Initially, updatedAt should be defined (defaults are created on first load)
			expect(preferencesStore.preferences.updatedAt).toBeDefined();
			
			// After update, updatedAt should be updated
			const oldUpdatedAt = preferencesStore.preferences.updatedAt;
			
			// Wait a tiny bit to ensure different timestamp
			await new Promise(r => setTimeout(r, 10));
			
			await preferencesStore.update('difficulty', 'intermediate');
			
			expect(preferencesStore.preferences.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
		});

		it('should correctly identify user as returning after setup with default values', async () => {
			// This simulates completing setup but keeping all default values
			// The critical scenario that was causing the infinite redirect loop
			
			// User completes setup (simulates clicking "Start Learning" without changing anything)
			await preferencesStore.updateMany({
				difficulty: 'beginner',
				highContrastMode: false,
				reducedMotion: false
			});
			
			// Verify updatedAt is set
			expect(preferencesStore.preferences.updatedAt).toBeDefined();
			
			// This is the exact logic from +page.svelte that was buggy:
			const isNewUser = !preferencesStore.preferences.updatedAt;
			
			// After completing setup (even with defaults), user should NOT be new
			expect(isNewUser).toBe(false);
		});

		it('should correctly identify user as returning after setup with custom values', async () => {
			// Complete setup with custom values
			await preferencesStore.updateMany({
				difficulty: 'intermediate',
				highContrastMode: true,
				reducedMotion: true,
				username: 'CustomUser'
			});
			
			// User should NOT be considered new
			const isNewUser = !preferencesStore.preferences.updatedAt;
			expect(isNewUser).toBe(false);
		});

		it('should preserve returning user status after page reload', async () => {
			// First session: complete setup with default values
			await preferencesStore.updateMany({
				difficulty: 'beginner',
				highContrastMode: false,
				reducedMotion: false
			});
			
			// Simulate page reload by loading again
			await preferencesStore.load();
			
			// Should still be recognized as returning user
			const isNewUser = !preferencesStore.preferences.updatedAt;
			expect(isNewUser).toBe(false);
			expect(preferencesStore.preferences.difficulty).toBe('beginner');
		});
	});
});
