<script lang="ts">
	import type { Note, Interval, Chord } from '$lib/types';
	import { audioStore } from '$lib/stores';
	import PlayButton from './PlayButton.svelte';
	import VolumeSlider from './VolumeSlider.svelte';

	/**
	 * Playback mode for the controls
	 */
	type PlaybackMode = 'note' | 'interval' | 'chord';

	interface Props {
		/**
		 * Note to play (for single note mode)
		 */
		note?: Note;
		
		/**
		 * First note of interval
		 */
		intervalNote1?: Note;
		
		/**
		 * Second note of interval  
		 */
		intervalNote2?: Note;
		
		/**
		 * Notes to play as chord
		 */
		chordNotes?: Note[];
		
		/**
		 * Mode: 'note' | 'interval' | 'chord'
		 */
		mode?: PlaybackMode;
		
		/**
		 * Show volume slider
		 */
		showVolume?: boolean;
		
		/**
		 * Volume slider label
		 */
		volumeLabel?: string;
		
		/**
		 * Hide volume percentage display
		 */
		hideVolumeValue?: boolean;
		
		/**
		 * Callback when playback starts
		 */
		onPlay?: () => void;
		
		/**
		 * Callback when playback ends
		 */
		onComplete?: () => void;
		
		/**
		 * Callback on error
		 */
		onError?: (error: Error) => void;
	}

	let {
		note,
		intervalNote1,
		intervalNote2,
		chordNotes = [],
		mode = 'note',
		showVolume = true,
		volumeLabel = 'Volume',
		hideVolumeValue = false,
		onPlay,
		onComplete,
		onError
	}: Props = $props();

	// Get volume from store
	let volume = $state(audioStore.volume);

	// Playback state
	let isPlaying = $derived(audioStore.isPlaying);

	// Handle play based on mode
	async function handlePlay() {
		if (isPlaying) return;
		
		try {
			onPlay?.();
			
			switch (mode) {
				case 'note':
					if (note) {
						await audioStore.playNote(note);
					}
					break;
					
				case 'interval':
					if (intervalNote1 && intervalNote2) {
						await audioStore.playInterval(intervalNote1, intervalNote2);
					}
					break;
					
				case 'chord':
					if (chordNotes.length > 0) {
						await audioStore.playChord(chordNotes);
					}
					break;
			}
			
			onComplete?.();
		} catch (error) {
			onError?.(error as Error);
		}
	}

	// Handle volume change
	function handleVolumeChange(newVolume: number) {
		volume = newVolume;
	}

	// Determine if play button should be disabled
	let canPlay = $derived(
		(mode === 'note' && !!note) ||
		(mode === 'interval' && !!intervalNote1 && !!intervalNote2) ||
		(mode === 'chord' && chordNotes.length > 0)
	);
</script>

	<div class="audio-controls" role="region" aria-label="Audio playback controls">
		<div class="audio-controls__playback">
			<PlayButton
				note={mode === 'note' ? note : undefined}
				label={mode === 'interval' ? 'Play Interval' : mode === 'chord' ? 'Play Chord' : 'Play'}
				disabled={!canPlay || isPlaying}
				onPlay={handlePlay}
				onError={onError}
			/>
			
			{#if isPlaying}
				<span class="audio-controls__status" aria-live="polite">
					Playing...
				</span>
			{/if}
		</div>
		
		{#if showVolume}
			<div class="audio-controls__volume">
				<VolumeSlider
					value={volume}
					label={volumeLabel}
					showValue={!hideVolumeValue}
					onChange={handleVolumeChange}
				/>
			</div>
		{/if}
	</div>

<style>
	.audio-controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		background: rgba(26, 26, 46, 0.6);
		border-radius: 0.75rem;
		border: 1px solid rgba(212, 175, 55, 0.2);
	}

	.audio-controls__playback {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.audio-controls__status {
		font-size: 0.875rem;
		color: var(--color-accent, #D4AF37);
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	.audio-controls__volume {
		padding-top: 0.5rem;
		border-top: 1px solid rgba(212, 175, 55, 0.1);
	}
</style>
