// Sample library for loading and caching audio samples

import { getAudioContext, ensureAudioReady, audioContextManager } from './AudioEngine';
import type { Note } from '../types';

/**
 * SampleLibrary - Handles loading and caching of audio samples
 * Piano samples are pre-cached, other instruments are lazy-loaded
 */
export class SampleLibrary {
	private sampleCache: Map<string, AudioBuffer> = new Map();
	private loadingPromises: Map<string, Promise<AudioBuffer>> = new Map();

	/**
	 * Get the file path for a note sample
	 */
	private getSamplePath(note: Note): string {
		const noteName = note.name;
		const accidental = note.accidental || '';
		const octave = note.octave;
		return `/audio/piano/${noteName}${accidental}${octave}.webm`;
	}

	/**
	 * Load a single sample
	 */
	async loadSample(note: Note): Promise<AudioBuffer> {
		const key = `${note.name}${note.accidental}${note.octave}`;
		
		// Return cached sample if available
		if (this.sampleCache.has(key)) {
			return this.sampleCache.get(key)!;
		}

		// Return existing loading promise if sample is already being loaded
		if (this.loadingPromises.has(key)) {
			return this.loadingPromises.get(key)!;
		}

		// Load the sample
		const loadPromise = this.loadSampleFile(note);
		this.loadingPromises.set(key, loadPromise);

		try {
			const buffer = await loadPromise;
			this.sampleCache.set(key, buffer);
			this.loadingPromises.delete(key);
			return buffer;
		} catch (error) {
			this.loadingPromises.delete(key);
			throw error;
		}
	}

	/**
	 * Load sample file from server
	 */
	private async loadSampleFile(note: Note): Promise<AudioBuffer> {
		await ensureAudioReady();
		
		const ctx = getAudioContext();
		const path = this.getSamplePath(note);

		try {
			const response = await fetch(path);
			if (!response.ok) {
				throw new Error(`Failed to load sample: ${path}`);
			}
			const arrayBuffer = await response.arrayBuffer();
			return await ctx.decodeAudioData(arrayBuffer);
		} catch (error) {
			console.error(`Error loading sample ${path}:`, error);
			throw error;
		}
	}

	/**
	 * Play a note
	 */
	async play(note: Note): Promise<void> {
		await ensureAudioReady();
		
		const ctx = getAudioContext();
		const masterGain = audioContextManager.getMasterGain();
		const buffer = await this.loadSample(note);
		
		const source = ctx.createBufferSource();
		source.buffer = buffer;
		source.connect(masterGain);  // Connect to masterGain for volume control
		source.start();
	}

	/**
	 * Preload samples for a range of notes
	 */
	async preloadRange(notes: Note[]): Promise<void> {
		await Promise.all(notes.map(note => this.loadSample(note)));
	}

	/**
	 * Get the AudioContext (for direct manipulation)
	 */
	getAudioContext(): AudioContext {
		return getAudioContext();
	}

	/**
	 * Clear the sample cache
	 */
	clearCache(): void {
		this.sampleCache.clear();
	}
}

// Export singleton instance
export const sampleLibrary = new SampleLibrary();
