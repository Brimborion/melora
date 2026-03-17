<script lang="ts">
	import type { ExerciseType } from '$lib/types/game';
	import { audioStore } from '$lib/stores/audio.svelte';

	interface Props {
		questionIndex: number;
		exerciseType: ExerciseType;
	}

	let { questionIndex, exerciseType }: Props = $props();

	// Generate question text based on exercise type
	let questionText = $derived(() => {
		switch (exerciseType) {
			case 'interval-identification':
				return 'Listen to the interval and identify it:';
			case 'chord-identification':
				return 'Listen to the chord and identify it:';
			case 'note-identification':
				return 'Identify the note you hear:';
			case 'melody-repetition':
				return 'Listen to the melody and repeat it:';
			case 'pitch-comparison':
				return 'Compare the two pitches:';
			default:
				return 'Listen and answer:';
		}
	});

	// Determine if play button should be disabled
	let canPlay = $derived(!audioStore.isPlaying && !audioStore.isLoading);

	// Play the audio for the current question
	async function playQuestionAudio() {
		// Check if audio is ready first (handles suspended AudioContext)
		if (!audioStore.isReady) {
			console.warn('Audio context not ready - user interaction required');
			return;
		}
		
		// This would be connected to actual audio in a real implementation
		// For now, we'll use the audioStore to play a sample
		try {
			// Play a sample note to demonstrate the pattern
			await audioStore.playNote({
				name: 'C',
				accidental: '',
				octave: 4
			});
		} catch (error) {
			console.error('Error playing question audio:', error);
		}
	}
</script>

<div class="question-display" role="region" aria-label="Question">
	<h2 class="question-prompt">{questionText()}</h2>
	
	<!-- Audio playback button -->
	<div class="audio-controls">
		<button 
			class="play-button"
			onclick={playQuestionAudio}
			disabled={!canPlay || !audioStore.isReady}
			aria-label={audioStore.isReady ? (audioStore.isPlaying ? 'Playing audio' : 'Play question audio') : 'Tap to enable audio'}
		>
			{#if audioStore.isLoading}
				<span class="loading-indicator" aria-hidden="true"></span>
				Loading...
			{:else if audioStore.isPlaying}
				<span class="playing-indicator" aria-hidden="true"></span>
				Playing...
			{:else if !audioStore.isReady}
				<span class="play-icon" aria-hidden="true">▶</span>
				Enable Audio
			{:else}
				<span class="play-icon" aria-hidden="true">▶</span>
				Play Sound
			{/if}
		</button>
	</div>
	
	<!-- Question number for screen readers -->
	<span class="visually-hidden">
		Question {questionIndex + 1}
	</span>
</div>

<style>
	.question-display {
		text-align: center;
		padding: 2rem;
		background: #2D1B4E;
		border-radius: 12px;
		margin-bottom: 2rem;
	}

	.question-prompt {
		font-family: 'Playfair Display', serif;
		font-size: 1.5rem;
		color: #F5E6D3;
		margin: 0 0 1.5rem 0;
	}

	.audio-controls {
		display: flex;
		justify-content: center;
	}

	.play-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background: #1A5F5F;
		color: #F5E6D3;
		border: none;
		padding: 1rem 2rem;
		font-size: 1.125rem;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 56px;
		min-width: 160px;
	}

	.play-button:hover:not(:disabled) {
		background: #237878;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(26, 95, 95, 0.4);
	}

	.play-button:focus {
		outline: 2px solid #D4AF37;
		outline-offset: 2px;
	}

	.play-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.play-icon {
		font-size: 1.25rem;
	}

	.loading-indicator,
	.playing-indicator {
		width: 20px;
		height: 20px;
		border: 2px solid #F5E6D3;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
