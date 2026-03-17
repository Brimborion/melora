// Audio store using Svelte 5 runes
// Manages audio playback state and volume preferences

import type { Note, Interval, Chord } from '$lib/types';
import { sampleLibrary, audioContextManager, ensureAudioReady, getAudioContext } from '$lib/audio';

/**
 * Default volume level (0.0 to 1.0)
 */
const DEFAULT_VOLUME = 0.8;

/**
 * Create the audio store
 * Manages volume state and provides audio playback methods
 */
export function createAudioStore() {
	// State using Svelte 5 runes
	let volume = $state(DEFAULT_VOLUME);
	let isPlaying = $state(false);
	let isLoading = $state(false);
	let currentInstrument = $state<'piano' | 'guitar' | 'violin'>('piano');

	// Initialize volume from preferences
	async function loadVolume(): Promise<void> {
		try {
			const { db } = await import('$lib/db');
			const prefs = await db.preferences.get('default');
			if (prefs && prefs.audioVolume !== undefined) {
				volume = prefs.audioVolume;
				// Apply to audio engine
				audioContextManager.setVolume(volume);
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
			audioContextManager.setVolume(clampedVolume);
			volume = clampedVolume;
		} catch (error) {
			console.warn('Failed to save volume preference:', error);
			// Still update local state even if persistence fails
			volume = clampedVolume;
			audioContextManager.setVolume(clampedVolume);
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
			isLoading = true;
			
			await ensureAudioReady();
			await sampleLibrary.play(note);
		} catch (error) {
			console.error('Error playing note:', error);
			throw error;
		} finally {
			isPlaying = false;
			isLoading = false;
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
			isLoading = true;
			
			await ensureAudioReady();
			
			// Play first note
			await sampleLibrary.play(note1);
			
			// Wait for delay
			await new Promise(resolve => setTimeout(resolve, delay));
			
			// Play second note
			await sampleLibrary.play(note2);
		} catch (error) {
			console.error('Error playing interval:', error);
			throw error;
		} finally {
			isPlaying = false;
			isLoading = false;
		}
	}

	// Play a chord (multiple notes simultaneously)
	async function playChord(notes: Note[]): Promise<void> {
		if (isPlaying) return;
		if (notes.length === 0) return;
		
		try {
			isPlaying = true;
			isLoading = true;
			
			await ensureAudioReady();
			
			// Load all samples first
			const buffers = await Promise.all(
				notes.map(note => sampleLibrary.loadSample(note))
			);
			
			// Play all notes simultaneously through masterGain for volume control
			const ctx = getAudioContext();
			const masterGain = audioContextManager.getMasterGain();
			
			buffers.forEach(buffer => {
				const source = ctx.createBufferSource();
				source.buffer = buffer;
				source.connect(masterGain);  // Use masterGain for volume control
				source.start();
			});
		} catch (error) {
			console.error('Error playing chord:', error);
			throw error;
		} finally {
			isPlaying = false;
			isLoading = false;
		}
	}

	// Stop any currently playing audio
	function stop(): void {
		// Note: With sample playback, we can't easily stop once started
		// This is a limitation of using pre-recorded samples
		isPlaying = false;
		isLoading = false;
	}

	// Set the instrument
	function setInstrument(instrument: 'piano' | 'guitar' | 'violin'): void {
		currentInstrument = instrument;
		// TODO: Load different sample library for different instruments
	}

	// Derived: Check if audio is ready
	let isReady = $derived(audioContextManager.isReady());

	// Initialize on creation
	loadVolume();

	return {
		// Getters
		get volume() { return volume; },
		get isPlaying() { return isPlaying; },
		get isLoading() { return isLoading; },
		get currentInstrument() { return currentInstrument; },
		get isReady() { return isReady; },
		
		// Actions
		setVolume,
		playNote,
		playInterval,
		playChord,
		stop,
		setInstrument,
		loadVolume
	};
}

// Export singleton instance
export const audioStore = createAudioStore();
