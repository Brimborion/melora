// User preferences store using Svelte 5 runes
// Manages user settings and preferences

import { db, createDefaultPreferences } from '$lib/db';
import type { UserPreferences } from '$lib/db';
import { browser } from '$app/environment';

function createPreferencesStore() {
	// State
	let preferences = $state<UserPreferences>(createDefaultPreferences());
	let isLoaded = $state(false);
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	// Derived
	let isDarkMode = $derived(
		preferences.theme === 'dark' || 
		(preferences.theme === 'auto' && browser && 
			window.matchMedia('(prefers-color-scheme: dark)').matches)
	);

	// Helper to get plain object from state (handles Svelte 5 proxies)
	function getSnapshot<T>(obj: T): T {
		// Always use JSON fallback in test environments and for Svelte proxies
		// structuredClone fails on Svelte proxy objects
		try {
			return JSON.parse(JSON.stringify(obj));
		} catch {
			// If JSON fails, try structuredClone as last resort
			if (typeof structuredClone === 'function') {
				return structuredClone(obj) as T;
			}
			return obj;
		}
	}

	// Load preferences from IndexedDB
	async function load() {
		isLoading = true;
		error = null;
		try {
			const stored = await db.preferences.get('default');
			if (stored) {
				preferences = stored;
			} else {
				// Create default preferences if none exist
				await db.preferences.add(createDefaultPreferences());
			}
			isLoaded = true;
		} catch (e) {
			const errorMessage = e instanceof Error ? e.message : 'Failed to load preferences';
			console.error('Failed to load preferences:', errorMessage);
			error = errorMessage;
		} finally {
			isLoading = false;
		}
	}

	// Update a single preference
	async function update<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) {
		preferences = { ...preferences, [key]: value, updatedAt: new Date() };
		await db.preferences.put(getSnapshot(preferences));
	}

	// Update multiple preferences at once
	async function updateMany(updates: Partial<UserPreferences>) {
		preferences = { ...preferences, ...updates, updatedAt: new Date() };
		await db.preferences.put(getSnapshot(preferences));
	}

	// Reset to defaults
	async function reset() {
		const defaults = createDefaultPreferences();
		preferences = defaults;
		await db.preferences.put(getSnapshot(preferences));
	}

	// Set theme
	async function setTheme(theme: 'light' | 'dark' | 'auto') {
		await update('theme', theme);
	}

	// Set audio volume
	async function setVolume(volume: number) {
		await update('audioVolume', Math.max(0, Math.min(1, volume)));
	}

	// Toggle music
	async function toggleMusic() {
		await update('musicEnabled', !preferences.musicEnabled);
	}

	// Toggle sound effects
	async function toggleSoundEffects() {
		await update('soundEffectsEnabled', !preferences.soundEffectsEnabled);
	}

	// Set difficulty
	async function setDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced') {
		await update('difficulty', difficulty);
	}

	// Set text size
	async function setTextSize(textSize: 'small' | 'medium' | 'large') {
		await update('textSize', textSize);
	}

	// Set high contrast mode
	async function setHighContrastMode(enabled: boolean) {
		await update('highContrastMode', enabled);
	}

	// Set reduced motion
	async function setReducedMotion(enabled: boolean) {
		await update('reducedMotion', enabled);
	}

	// Delete account - clears all user data
	async function deleteAccount() {
		// Clear all tables to remove all user data
		await db.progress.clear();
		await db.preferences.clear();
		await db.sessions.clear();
		
		// Delete entire database and recreate fresh instance
		await db.delete();
		
		// Reset local state to defaults
		preferences = createDefaultPreferences();
		isLoaded = true;
	}

	return {
		// Getters
		get preferences() { return preferences; },
		get isLoaded() { return isLoaded; },
		get isLoading() { return isLoading; },
		get isDarkMode() { return isDarkMode; },
		get error() { return error; },
		
		// Actions
		load,
		update,
		updateMany,
		reset,
		setTheme,
		setVolume,
		toggleMusic,
		toggleSoundEffects,
		setDifficulty,
		setTextSize,
		setHighContrastMode,
		setReducedMotion,
		deleteAccount
	};
}

// Export singleton instance
export const preferencesStore = createPreferencesStore();
