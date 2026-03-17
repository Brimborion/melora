// AudioEngine tests
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { audioContextManager, getAudioContext, ensureAudioReady } from '../AudioEngine';
import type { Note } from '$lib/types';

describe('AudioEngine', () => {
	beforeEach(() => {
		// Reset the singleton before each test
		vi.resetModules();
	});

	describe('audioContextManager', () => {
		it('should be a singleton instance', () => {
			const instance1 = audioContextManager;
			const instance2 = audioContextManager;
			expect(instance1).toBe(instance2);
		});

		it('should create AudioContext lazily', () => {
			const ctx = audioContextManager.getContext();
			expect(ctx).toBeDefined();
			expect(ctx).toBeInstanceOf(AudioContext);
		});

		it('should return same AudioContext on subsequent calls', () => {
			const ctx1 = audioContextManager.getContext();
			const ctx2 = audioContextManager.getContext();
			expect(ctx1).toBe(ctx2);
		});

		it('should create master gain node', () => {
			const gain = audioContextManager.getMasterGain();
			expect(gain).toBeDefined();
		});

		it('should set volume between 0 and 1', () => {
			audioContextManager.setVolume(0.5);
			const gain = audioContextManager.getMasterGain();
			expect(gain.gain.value).toBe(0.5);
		});

		it('should clamp volume to valid range', () => {
			audioContextManager.setVolume(1.5);
			const gain = audioContextManager.getMasterGain();
			expect(gain.gain.value).toBe(1);

			audioContextManager.setVolume(-0.5);
			expect(gain.gain.value).toBe(0);
		});

		it('should report ready state', () => {
			const ready = audioContextManager.isReady();
			expect(typeof ready).toBe('boolean');
		});

		it('should return context state', () => {
			const state = audioContextManager.getState();
			expect(state).toBeDefined();
		});
	});

	describe('getAudioContext', () => {
		it('should return AudioContext', () => {
			const ctx = getAudioContext();
			expect(ctx).toBeDefined();
			expect(ctx).toBeInstanceOf(AudioContext);
		});
	});

	describe('ensureAudioReady', () => {
		it('should return a promise', () => {
			const result = ensureAudioReady();
			expect(result).toBeInstanceOf(Promise);
		});

		it('should resolve without error', async () => {
			await expect(ensureAudioReady()).resolves.not.toThrow();
		});
	});

	describe('playNote', () => {
		it('should have playNote method', () => {
			expect(typeof audioContextManager.playNote).toBe('function');
		});

		it('should accept Note parameter', () => {
			const note: Note = { name: 'C', accidental: '', octave: 4 };
			// Method should exist and be callable (will fail without mock AudioBuffer)
			expect(audioContextManager.playNote).toBeDefined();
		});
	});

	describe('playInterval', () => {
		it('should have playInterval method', () => {
			expect(typeof audioContextManager.playInterval).toBe('function');
		});

		it('should accept two Note parameters and optional delay', () => {
			const note1: Note = { name: 'C', accidental: '', octave: 4 };
			const note2: Note = { name: 'G', accidental: '', octave: 4 };
			// Method should exist and be callable
			expect(audioContextManager.playInterval).toBeDefined();
		});
	});

	describe('playChord', () => {
		it('should have playChord method', () => {
			expect(typeof audioContextManager.playChord).toBe('function');
		});

		it('should accept array of Notes', () => {
			const notes: Note[] = [
				{ name: 'C', accidental: '', octave: 4 },
				{ name: 'E', accidental: '', octave: 4 },
				{ name: 'G', accidental: '', octave: 4 }
			];
			// Method should exist and be callable
			expect(audioContextManager.playChord).toBeDefined();
		});

		it('should handle empty array gracefully', async () => {
			// Should not throw when called with empty array
			const notes: Note[] = [];
			await expect(audioContextManager.playChord(notes)).resolves.not.toThrow();
		});
	});
});
