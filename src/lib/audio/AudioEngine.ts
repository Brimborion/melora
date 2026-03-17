// Audio engine for Melora
// Uses lazy initialization for AudioContext (NOT at module level)

import { sampleLibrary } from './SampleLibrary';
import type { Note } from '../types';

/**
 * AudioContext singleton with lazy initialization
 * AudioContext is created only when needed (after user interaction)
 * This follows the Web Audio API autoplay policy requirements
 */
class AudioContextManager {
	private static instance: AudioContextManager;
	private context: AudioContext | null = null;
	private masterGain: GainNode | null = null;

	private constructor() {}

	static getInstance(): AudioContextManager {
		if (!AudioContextManager.instance) {
			AudioContextManager.instance = new AudioContextManager();
		}
		return AudioContextManager.instance;
	}

	/**
	 * Get or create the AudioContext
	 * Must be called after user interaction to comply with autoplay policy
	 */
	getContext(): AudioContext {
		if (!this.context) {
			this.context = new AudioContext();
		}
		return this.context;
	}

	/**
	 * Get or create the master gain node
	 */
	getMasterGain(): GainNode {
		if (!this.masterGain) {
			const ctx = this.getContext();
			this.masterGain = ctx.createGain();
			this.masterGain.connect(ctx.destination);
		}
		return this.masterGain;
	}

	/**
	 * Set master volume (0-1)
	 */
	setVolume(volume: number): void {
		const gain = this.getMasterGain();
		gain.gain.value = Math.max(0, Math.min(1, volume));
	}

	/**
	 * Resume the audio context if suspended
	 * Required for browser autoplay policy
	 */
	async resume(): Promise<void> {
		const ctx = this.getContext();
		if (ctx.state === 'suspended') {
			await ctx.resume();
		}
	}

	/**
	 * Get current context state
	 */
	getState(): AudioContextState {
		return this.context?.state ?? 'closed';
	}

	/**
	 * Check if audio is ready (running)
	 */
	isReady(): boolean {
		return this.context?.state === 'running';
	}

	/**
	 * Close the audio context
	 */
	async close(): Promise<void> {
		if (this.context) {
			await this.context.close();
			this.context = null;
			this.masterGain = null;
		}
	}

	/**
	 * Play a single note
	 */
	async playNote(note: Note): Promise<void> {
		await this.resume();
		await sampleLibrary.play(note);
	}

	/**
	 * Play a melodic interval (two notes sequentially)
	 */
	async playInterval(note1: Note, note2: Note, delay: number = 500): Promise<void> {
		await this.resume();
		
		// Play first note
		await sampleLibrary.play(note1);
		
		// Wait for delay
		await new Promise(resolve => setTimeout(resolve, delay));
		
		// Play second note
		await sampleLibrary.play(note2);
	}

	/**
	 * Play a chord (multiple notes simultaneously)
	 */
	async playChord(notes: Note[]): Promise<void> {
		if (notes.length === 0) return;
		
		await this.resume();
		
		// Load all samples first
		const buffers = await Promise.all(
			notes.map(note => sampleLibrary.loadSample(note))
		);
		
		// Play all notes simultaneously
		const ctx = this.getContext();
		const masterGain = this.getMasterGain();
		
		buffers.forEach(buffer => {
			const source = ctx.createBufferSource();
			source.buffer = buffer;
			source.connect(masterGain);
			source.start();
		});
	}
}

// Export singleton instance
export const audioContextManager = AudioContextManager.getInstance();

// Convenience function for getting context
export function getAudioContext(): AudioContext {
	return audioContextManager.getContext();
}

// Convenience function for resuming context
export async function ensureAudioReady(): Promise<void> {
	await audioContextManager.resume();
}
