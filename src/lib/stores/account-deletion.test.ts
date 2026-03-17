// Unit tests for account deletion functionality
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { preferencesStore } from '$lib/stores/preferences.svelte';
import { db } from '$lib/db';

// Mock browser environment
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

describe('Account Deletion Tests', () => {
	beforeEach(async () => {
		// Clear all tables before each test
		await db.progress.clear();
		await db.preferences.clear();
		await db.sessions.clear();
		// Reload preferences to reset state
		await preferencesStore.load();
	});

	describe('deleteAccount method', () => {
		it('should have deleteAccount method available on preferencesStore', async () => {
			expect(typeof preferencesStore.deleteAccount).toBe('function');
		});

		it('should clear progress table on account deletion', async () => {
			// Add some progress data
			await db.progress.add({
				levelId: '1-1',
				completed: true,
				bestScore: 100,
				attempts: 1,
				updatedAt: new Date()
			});

			// Verify progress exists
			const progressBefore = await db.progress.toArray();
			expect(progressBefore.length).toBeGreaterThan(0);

			// Delete account
			await preferencesStore.deleteAccount();

			// Verify progress is cleared
			const progressAfter = await db.progress.toArray();
			expect(progressAfter.length).toBe(0);
		});

		it('should clear preferences table on account deletion', async () => {
			// Verify preferences exist
			const prefsBefore = await db.preferences.toArray();
			expect(prefsBefore.length).toBeGreaterThan(0);

			// Delete account
			await preferencesStore.deleteAccount();

			// Verify preferences are cleared
			const prefsAfter = await db.preferences.toArray();
			expect(prefsAfter.length).toBe(0);

			// But local store state should have defaults
			expect(preferencesStore.preferences.username).toBe('Player');
		});

		it('should clear sessions table on account deletion', async () => {
			// Add some session data
			await db.sessions.add({
				levelId: '1-1',
				startedAt: new Date(),
				score: 100,
				correctAnswers: 5,
				totalQuestions: 10,
				completed: true
			});

			// Verify sessions exist
			const sessionsBefore = await db.sessions.toArray();
			expect(sessionsBefore.length).toBeGreaterThan(0);

			// Delete account
			await preferencesStore.deleteAccount();

			// Verify sessions are cleared
			const sessionsAfter = await db.sessions.toArray();
			expect(sessionsAfter.length).toBe(0);
		});

		it('should reset preferences to defaults after deletion', async () => {
			// Change some preferences first
			await preferencesStore.update('username', 'TestUser');
			await preferencesStore.update('difficulty', 'advanced');

			// Verify changes were made
			expect(preferencesStore.preferences.username).toBe('TestUser');
			expect(preferencesStore.preferences.difficulty).toBe('advanced');

			// Delete account
			await preferencesStore.deleteAccount();

			// Verify preferences are reset to defaults
			expect(preferencesStore.preferences.username).toBe('Player');
			expect(preferencesStore.preferences.difficulty).toBe('beginner');
		});

		it('should delete and recreate the database after account deletion', async () => {
			// Add data to verify database is deleted
			await db.progress.add({
				levelId: '1-1',
				completed: true,
				bestScore: 100,
				attempts: 1,
				updatedAt: new Date()
			});

			// Get database name before deletion
			const dbNameBefore = db.name;

			// Delete account (this should call db.delete() and recreate)
			await preferencesStore.deleteAccount();

			// Verify database was deleted and recreated (name should still be 'melora')
			expect(db.name).toBe(dbNameBefore);

			// Verify all data is gone after recreation
			const progressAfter = await db.progress.toArray();
			expect(progressAfter.length).toBe(0);
		});
	});
});
