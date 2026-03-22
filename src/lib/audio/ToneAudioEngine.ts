// ToneAudioEngine for Melora
// Uses Tone.js with Salamander Sound Library for high-quality piano samples
// License: CC-BY-3.0 - Salamander Sound Library by Alexander Holm

import * as Tone from 'tone';
import type { Note } from '../types';

/**
 * Salamander Sound Library attribution
 * Required by CC-BY-3.0 license
 */
export const SALAMANDER_ATTRIBUTION = 'Salamander Sound Library by Alexander Holm (CC-BY-3.0)';

/**
 * Salamander sample base URL
 */
const SALAMANDER_BASE_URL = 'https://tonejs.github.io/audio/salamander/';

/**
 * Notes available in Salamander Sound Library (Yamaha C5)
 * Only contains: A, C, D# (Ds), and F# (Fs) notes
 * Sampled in minor thirds from the lowest A
 * 
 * @see https://github.com/Tonejs/audio/tree/master/salamander
 */
const PIANO_NOTES = [
	// A notes (A0 to A7)
	'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7',
	// C notes (C1 to C8)
	'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8',
	// D# notes (Ds1 to Ds7)
	'Ds1', 'Ds2', 'Ds3', 'Ds4', 'Ds5', 'Ds6', 'Ds7',
	// F# notes (Fs1 to Fs7)
	'Fs1', 'Fs2', 'Fs3', 'Fs4', 'Fs5', 'Fs6', 'Fs7',
];

/**
 * Convert Note object to Salamander note format
 * e.g., { name: 'C', accidental: '', octave: 4 } -> 'C4'
 * e.g., { name: 'D', accidental: '#', octave: 4 } -> 'Ds4'
 * e.g., { name: 'F', accidental: '#', octave: 4 } -> 'Fs4'
 * 
 * Note: Salamander uses 's' for sharps
 */
export function noteToToneJS(note: Note): string {
	const accidental = note.accidental === '#' ? 's' : 
	                  note.accidental === 'b' ? 'b' : '';
	return `${note.name}${accidental}${note.octave}`;
}

/**
 * Check if a note is directly available in Salamander
 * Tone.js will handle pitch-shifting for notes without direct samples
 */
export function isNoteSupported(note: Note): boolean {
	// Salamander has limited samples: A, C, Ds, Fs notes
	// Tone.js can pitch-shift to handle other notes
	return true;
}

/**
 * Get the closest available note in Salamander for pitch-shifting
 * Returns Tone.js format (with #) for triggerAttackRelease
 * The URL mapping is handled by buildSampleUrls()
 */
export function getClosestNote(note: Note): string {
	// If the note is directly in Salamander, return Tone.js format
	const toneNote = noteToToneJS(note);
	if (PIANO_NOTES.includes(toneNote)) {
		// Convert to # notation for Tone.js
		return toneNote.replace('s', '#');
	}
	
	// Map note to closest available note
	// Salamander has: A, C, D# (Ds), F# (Fs)
	const noteName = note.name;
	const octave = note.octave;
	
	// Define mapping for notes without samples
	// These will be pitch-shifted from the nearest sample
	const noteWithoutSample: Record<string, string> = {
		'B': 'C',  // B → C (same octave or down)
		'D': 'D#', // D → D#
		'E': 'F#', // E → F#
		'G': 'F#', // G → F# (closest)
		'F': 'F#', // F → F#
		'A': 'A',  // A exists
		'C': 'C',  // C exists
	};
	
	const closestBase = noteWithoutSample[noteName] || 'C';
	
	// Adjust octave for B (should map to C of next lower octave)
	if (noteName === 'B' && octave > 0) {
		return `${closestBase}${octave - 1}`;
	}
	
	return `${closestBase}${octave}`;
}

/**
 * ToneAudioEngine - Audio engine using Tone.js and Salamander samples
 * 
 * This class provides high-quality piano audio using the Salamander Sound Library
 * which is licensed under CC-BY-3.0.
 * 
 * @see https://tonejs.github.io/audio/salamander/
 * @see https://creativecommons.org/licenses/by/3.0/
 */
export class ToneAudioEngine {
	private sampler: Tone.Sampler | null = null;
	private volumeNode: Tone.Volume | null = null;
	private initialized = false;
	private loadingPromise: Promise<void> | null = null;

	/**
	 * Check if the engine is initialized
	 */
	isInitialized(): boolean {
		return this.initialized;
	}

	/**
	 * Get the Tone.js context state
	 */
	getState(): AudioContextState {
		return Tone.getContext().rawContext.state;
	}

	/**
	 * Check if audio is ready (context running)
	 */
	isReady(): boolean {
		return this.getState() === 'running';
	}

	/**
	 * Initialize the audio engine
	 * Must be called after user interaction to comply with autoplay policy
	 */
	async initialize(): Promise<void> {
		// Return if already initialized
		if (this.initialized) {
			return;
		}

		// Return existing promise if already loading
		if (this.loadingPromise) {
			return this.loadingPromise;
		}

		// Start Tone.js context (required for autoplay policy)
		await Tone.start();

		// Create loading promise
		this.loadingPromise = this.loadSamples();

		try {
			await this.loadingPromise;
			this.initialized = true;
		} finally {
			this.loadingPromise = null;
		}
	}

	/**
	 * Load Salamander samples
	 */
	private async loadSamples(): Promise<void> {
		return new Promise((resolve, reject) => {
			// Create volume node for volume control
			this.volumeNode = new Tone.Volume(0).toDestination();

			// Create sampler with Salamander samples
			// Using envelope settings for natural piano decay
			this.sampler = new Tone.Sampler({
				urls: this.buildSampleUrls(),
				baseUrl: SALAMANDER_BASE_URL,
				onload: () => {
					console.log('Salamander samples loaded');
					resolve();
				},
				onerror: (error) => {
					console.error('Error loading Salamander samples:', error);
					reject(error);
				}
			}).connect(this.volumeNode);
		});
	}

/**
 * Build sample URLs for Tone.js Sampler
 * Keys use # notation for Tone.js pitch parsing
 * URLs use 's' notation for Salamander file naming
 */
private buildSampleUrls(): Record<string, string> {
	const urls: Record<string, string> = {};

	for (const note of PIANO_NOTES) {
		// Convert 's' notation to '#' for Tone.js key
		// e.g., 'Ds1' -> key: 'D#1', url: 'Ds1.mp3'
		const toneKey = note.replace('s', '#');
		urls[toneKey] = `${note}.mp3`;
	}

	return urls;
}

	/**
	 * Ensure audio is ready (start context if needed)
	 * Also initializes the sampler if not already done
	 */
	async ensureReady(): Promise<void> {
		if (this.getState() !== 'running') {
			await Tone.start();
		}
		// Auto-initialize if not already done
		if (!this.initialized) {
			await this.initialize();
		}
	}

	/**
	 * Set volume (0 to 1)
	 */
	setVolume(volume: number): void {
		const dbValue = Tone.gainToDb(Math.max(0, Math.min(1, volume)));
		if (this.volumeNode) {
			this.volumeNode.volume.value = dbValue;
		}
	}

	/**
	 * Play a single note
	 * @param note - The note to play
	 * @param duration - Duration in Tone.js time format (default: '2n' for natural piano decay)
	 */
	async playNote(note: Note, duration: Tone.Unit.Time = '2n'): Promise<void> {
		await this.ensureReady();

		if (!this.sampler) {
			throw new Error('ToneAudioEngine not initialized');
		}

		// Get the note to play (may be mapped to closest sample)
		const toneNote = getClosestNote(note);
		
		// Warn if note was mapped
		const originalNote = noteToToneJS(note);
		if (toneNote !== originalNote) {
			console.warn(`Note ${originalNote} mapped to ${toneNote} for playback`);
		}

		this.sampler.triggerAttackRelease(toneNote, duration);
	}

	/**
	 * Play a melodic interval (two notes sequentially)
	 * @param note1 - First note
	 * @param note2 - Second note
	 * @param delay - Delay between notes in milliseconds (default: 600)
	 */
	async playInterval(note1: Note, note2: Note, delay: number = 600): Promise<void> {
		await this.ensureReady();

		if (!this.sampler) {
			throw new Error('ToneAudioEngine not initialized');
		}

		// Get closest available notes for playback
		const toneNote1 = getClosestNote(note1);
		const toneNote2 = getClosestNote(note2);

		// Play first note with longer duration for natural decay
		this.sampler.triggerAttackRelease(toneNote1, '2n');

		// Wait and play second note
		await new Promise(resolve => setTimeout(resolve, delay));
		this.sampler.triggerAttackRelease(toneNote2, '2n');
	}

	/**
	 * Play a chord (multiple notes simultaneously)
	 * @param notes - Array of notes to play together
	 * @param duration - Duration in Tone.js time format (default: '2n' for natural piano decay)
	 */
	async playChord(notes: Note[], duration: Tone.Unit.Time = '2n'): Promise<void> {
		await this.ensureReady();

		if (!this.sampler) {
			throw new Error('ToneAudioEngine not initialized');
		}

		// Map all notes to closest available samples
		const mappedNotes = notes.map(note => getClosestNote(note));

		if (mappedNotes.length === 0) {
			console.warn('No notes in chord');
			return;
		}

		// Play all notes as a chord with natural decay
		this.sampler.triggerAttackRelease(mappedNotes, duration);
	}

	/**
	 * Play an array of notes sequentially (melody)
	 * @param notes - Array of notes to play
	 * @param noteDuration - Duration of each note (default: '4n' for natural piano decay)
	 * @param gap - Gap between notes in milliseconds
	 */
	async playSequence(
		notes: Note[],
		noteDuration: Tone.Unit.Time = '4n',
		gap: number = 150
	): Promise<void> {
		await this.ensureReady();

		if (!this.sampler) {
			throw new Error('ToneAudioEngine not initialized');
		}

		for (let i = 0; i < notes.length; i++) {
			const note = notes[i];
			const toneNote = getClosestNote(note);
			this.sampler.triggerAttackRelease(toneNote, noteDuration);

			// Wait between notes (except after the last one)
			if (i < notes.length - 1) {
				await new Promise(resolve => setTimeout(resolve, gap));
			}
		}
	}

	/**
	 * Dispose of the audio engine resources
	 */
	dispose(): void {
		if (this.sampler) {
			this.sampler.dispose();
			this.sampler = null;
		}
		if (this.volumeNode) {
			this.volumeNode.dispose();
			this.volumeNode = null;
		}
		this.initialized = false;
	}
}

// Export singleton instance
export const toneAudioEngine = new ToneAudioEngine();
