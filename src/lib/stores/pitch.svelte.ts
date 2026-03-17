// Pitch store using Svelte 5 runes
// Manages pitch detection state for vocal exercises

import { createPitchDetector, type PitchInfo } from '$lib/audio';

export type PitchMatchStatus = 'match' | 'close' | 'off' | 'inactive';

/**
 * Create the pitch detection store
 * Manages pitch detection state, target note, and matching feedback
 */
export function createPitchStore() {
	// Pitch detector instance
	let detector = $state(createPitchDetector());
	
	// State using Svelte 5 runes
	let isActive = $state(false);
	let hasPermission = $state(false);
	let currentPitch = $state<PitchInfo | null>(null);
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	
	// Target note for pitch matching exercises
	let targetNote = $state<string | null>(null);
	let targetOctave = $state<number | null>(null);
	
	// Feedback state
	let matchStatus = $state<PitchMatchStatus>('inactive');
	let isMatching = $state(false);
	
	/**
	 * Request microphone permission
	 */
	async function requestPermission(): Promise<boolean> {
		isLoading = true;
		error = null;
		
		try {
			const granted = await detector.requestMicrophonePermission();
			hasPermission = granted;
			
			if (!granted) {
				error = 'Microphone permission denied. Please allow microphone access to use pitch detection.';
			}
			
			return granted;
		} catch (e) {
			error = 'Failed to request microphone permission';
			hasPermission = false;
			return false;
		} finally {
			isLoading = false;
		}
	}
	
	/**
	 * Start pitch detection
	 */
	async function start(): Promise<void> {
		if (isActive) return;
		
		isLoading = true;
		error = null;
		
		try {
			// Ensure we have permission
			if (!hasPermission) {
				const granted = await requestPermission();
				if (!granted) {
					throw new Error('Microphone permission not granted');
				}
			}
			
			await detector.start();
			isActive = true;
			
			// Start the pitch detection loop
			updatePitch();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to start pitch detection';
			isActive = false;
			throw e;
		} finally {
			isLoading = false;
		}
	}
	
	/**
	 * Stop pitch detection
	 */
	function stop(): void {
		detector.stop();
		isActive = false;
		currentPitch = null;
		matchStatus = 'inactive';
		isMatching = false;
	}
	
	/**
	 * Update pitch detection (called on animation frame)
	 */
	function updatePitch(): void {
		if (!isActive) return;
		
		const pitch = detector.getPitch();
		currentPitch = pitch;
		
		// Check if pitch matches target
		if (pitch && targetNote && targetOctave !== null) {
			const matches = detector.matchesTarget(targetNote, targetOctave, 50);
			const isClose = detector.matchesTarget(targetNote, targetOctave, 30);
			
			if (matches) {
				matchStatus = isClose ? 'match' : 'close';
				isMatching = true;
			} else {
				matchStatus = 'off';
				isMatching = false;
			}
		} else {
			matchStatus = pitch ? 'off' : 'inactive';
			isMatching = false;
		}
		
		// Continue the loop if still active
		if (isActive) {
			requestAnimationFrame(() => updatePitch());
		}
	}
	
	/**
	 * Set target note for pitch matching exercises
	 */
	function setTarget(note: string, octave: number): void {
		targetNote = note;
		targetOctave = octave;
	}
	
	/**
	 * Clear target note
	 */
	function clearTarget(): void {
		targetNote = null;
		targetOctave = null;
		matchStatus = 'inactive';
		isMatching = false;
	}
	
	/**
	 * Reset the store (stop detection and clear state)
	 */
	function reset(): void {
		stop();
		detector = createPitchDetector();
		hasPermission = false;
		error = null;
		targetNote = null;
		targetOctave = null;
		matchStatus = 'inactive';
		isMatching = false;
	}
	
	// Computed: get formatted note string (e.g., "A4")
	let formattedNote = $derived(
		currentPitch 
			? `${currentPitch.note}${currentPitch.octave}`
			: null
	);
	
	// Computed: get encouraging message based on match status
	let feedbackMessage = $derived(() => {
		if (!currentPitch) {
			return 'Sing a note to begin';
		}
		
		if (!targetNote) {
			return `Detected: ${formattedNote}`;
		}
		
		switch (matchStatus) {
			case 'match':
				return 'Perfect! 🎵';
			case 'close':
				return 'Very close!';
			case 'off':
				return `Try ${targetNote}${targetOctave}`;
			default:
				return 'Listening...';
		}
	});
	
	return {
		// Getters
		get isActive() { return isActive; },
		get hasPermission() { return hasPermission; },
		get currentPitch() { return currentPitch; },
		get isLoading() { return isLoading; },
		get error() { return error; },
		get targetNote() { return targetNote; },
		get targetOctave() { return targetOctave; },
		get matchStatus() { return matchStatus; },
		get isMatching() { return isMatching; },
		get formattedNote() { return formattedNote; },
		get feedbackMessage() { return feedbackMessage(); },
		
		// Actions
		requestPermission,
		start,
		stop,
		setTarget,
		clearTarget,
		reset
	};
}

// Export singleton instance
export const pitchStore = createPitchStore();
