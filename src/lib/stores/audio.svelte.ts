// Audio store using Svelte 5 runes
// Manages audio playback state and volume preferences using Tone.js + Salamander

import type { Note } from '$lib/types';
import { toneAudioEngine, SALAMANDER_ATTRIBUTION } from '$lib/audio';

/**
 * Default volume level (0.0 to 1.0)
 */
const DEFAULT_VOLUME = 0.8;

/**
 * Create the audio store
 * Manages volume state and provides audio playback methods
 * Uses ToneAudioEngine with Salamander Sound Library
 * 
 * Attribution: Salamander Sound Library by Alexander Holm (CC-BY-3.0)
 */
export function createAudioStore() {
	// State using Svelte 5 runes
	let volume = $state(DEFAULT_VOLUME);
	let isPlaying = $state(false);
	let isLoading = $state(false);
	let isInitialized = $state(false);
	let currentInstrument = $state<'piano' | 'guitar' | 'violin'>('piano');

	/**
	 * Initialize the audio engine
	 * Should be called on first user interaction
	 */
	async function initialize(): Promise<void> {
		if (isInitialized) return;
		
		try {
			isLoading = true;
			await toneAudioEngine.initialize();
			isInitialized = true;
			// Apply saved volume
			toneAudioEngine.setVolume(volume);
		} finally {
			isLoading = false;
		}
	}

	// Initialize volume from preferences
	async function loadVolume(): Promise<void> {
		try {
			const { db } = await import('$lib/db');
			const prefs = await db.preferences.get('default');
			if (prefs && prefs.audioVolume !== undefined) {
				volume = prefs.audioVolume;
				// Apply to audio engine if initialized
				if (isInitialized) {
					toneAudioEngine.setVolume(volume);
				}
			}
		} catch (error) {
			console.warn('Failed to load volume preference:', error);
			// Keep default volume if loading fails
		}
	}

	// Save volume to preferences
	async function saveVolume(newVolume: number): Promise<void> {
		const clampedVolume = Math.max(0, Math.min(1, newVolume));
		
		try {
			const { db, createDefaultPreferences } = await import('$lib/db');
			
			// Get existing or create default preferences
			let prefs = await db.preferences.get('default');
			if (!prefs) {
				prefs = createDefaultPreferences();
				await db.preferences.add(prefs);
			}
			
			// Update audio volume
			await db.preferences.update('default', {
				audioVolume: clampedVolume,
				updatedAt: new Date()
			});
			
			// Apply to audio engine
			toneAudioEngine.setVolume(clampedVolume);
			volume = clampedVolume;
		} catch (error) {
			console.warn('Failed to save volume preference:', error);
			// Still update local state even if persistence fails
			volume = clampedVolume;
			toneAudioEngine.setVolume(clampedVolume);
		}
	}

	// Set volume (0.0 to 1.0)
	function setVolume(newVolume: number): void {
		saveVolume(newVolume);
	}

	// Play a single note
	async function playNote(note: Note): Promise<void> {
		if (isPlaying) return;
		
		try {
			isPlaying = true;
			
			// Initialize on first play
			if (!isInitialized) {
				isLoading = true;
				await initialize();
				isLoading = false;
			}
			
			await toneAudioEngine.playNote(note);
		} catch (error) {
			console.error('Error playing note:', error);
			throw error;
		} finally {
			isPlaying = false;
		}
	}

	// Play a melodic interval (two notes sequentially)
	async function playInterval(
		note1: Note, 
		note2: Note, 
		delay: number = 500
	): Promise<void> {
		if (isPlaying) return;
		
		try {
			isPlaying = true;
			
			// Initialize on first play
			if (!isInitialized) {
				isLoading = true;
				await initialize();
				isLoading = false;
			}
			
			await toneAudioEngine.playInterval(note1, note2, delay);
		} catch (error) {
			console.error('Error playing interval:', error);
			throw error;
		} finally {
			isPlaying = false;
		}
	}

	// Play a chord (multiple notes simultaneously)
	async function playChord(notes: Note[]): Promise<void> {
		if (isPlaying) return;
		if (notes.length === 0) return;
		
		try {
			isPlaying = true;
			
			// Initialize on first play
			if (!isInitialized) {
				isLoading = true;
				await initialize();
				isLoading = false;
			}
			
			await toneAudioEngine.playChord(notes);
		} catch (error) {
			console.error('Error playing chord:', error);
			throw error;
		} finally {
			isPlaying = false;
		}
	}

	// Stop any currently playing audio
	function stop(): void {
		// Tone.js handles this internally
		isPlaying = false;
		isLoading = false;
	}

	// Set the instrument
	function setInstrument(instrument: 'piano' | 'guitar' | 'violin'): void {
		currentInstrument = instrument;
		// TODO: Load different sample library for different instruments
		// For MVP, only piano (Salamander) is supported
	}

	// Derived: Check if audio is ready
	let isReady = $derived(isInitialized && toneAudioEngine.isReady());

	// Get Salamander attribution
	function getAttribution(): string {
		return SALAMANDER_ATTRIBUTION;
	}

	// Initialize on creation (load volume only, don't initialize audio engine yet)
	loadVolume();

	return {
		// Getters
		get volume() { return volume; },
		get isPlaying() { return isPlaying; },
		get isLoading() { return isLoading; },
		get isInitialized() { return isInitialized; },
		get currentInstrument() { return currentInstrument; },
		get isReady() { return isReady; },
		
		// Actions
		initialize,
		setVolume,
		playNote,
		playInterval,
		playChord,
		stop,
		setInstrument,
		loadVolume,
		getAttribution
	};
}

// Export singleton instance
export const audioStore = createAudioStore();
