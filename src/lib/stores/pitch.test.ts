// Pitch store tests

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPitchStore } from './pitch.svelte';

// Mock the PitchDetector
vi.mock('$lib/audio', () => ({
	createPitchDetector: vi.fn(() => ({
		requestMicrophonePermission: vi.fn().mockResolvedValue(true),
		start: vi.fn().mockResolvedValue(undefined),
		stop: vi.fn(),
		getPitch: vi.fn().mockReturnValue(null),
		matchesTarget: vi.fn().mockReturnValue(false),
		get isActive() { return false; },
		get isPermissionGranted() { return false; },
		get lastPitch() { return null; },
	})),
}));

describe('pitchStore', () => {
	let store: ReturnType<typeof createPitchStore>;

	beforeEach(() => {
		store = createPitchStore();
	});

	afterEach(() => {
		store.reset();
	});

	describe('initialization', () => {
		it('should initialize with inactive state', () => {
			expect(store.isActive).toBe(false);
		});

		it('should not have permission initially', () => {
			expect(store.hasPermission).toBe(false);
		});

		it('should have no current pitch initially', () => {
			expect(store.currentPitch).toBe(null);
		});

		it('should have no error initially', () => {
			expect(store.error).toBe(null);
		});
	});

	describe('target note', () => {
		it('should set target note', () => {
			store.setTarget('A', 4);
			expect(store.targetNote).toBe('A');
			expect(store.targetOctave).toBe(4);
		});

		it('should clear target note', () => {
			store.setTarget('A', 4);
			store.clearTarget();
			expect(store.targetNote).toBe(null);
			expect(store.targetOctave).toBe(null);
		});
	});

	describe('reset', () => {
		it('should reset all state', () => {
			store.setTarget('A', 4);
			store.reset();
			
			expect(store.isActive).toBe(false);
			expect(store.hasPermission).toBe(false);
			expect(store.currentPitch).toBe(null);
			expect(store.error).toBe(null);
			expect(store.targetNote).toBe(null);
		});
	});
});
