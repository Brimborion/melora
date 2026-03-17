<script lang="ts">
	import type { ExerciseType } from '$lib/types/game';

	interface AnswerOption {
		id: string;
		label: string;
		correct?: boolean;
		isRecord?: boolean;
	}

	interface Props {
		exerciseType: ExerciseType;
		onSubmit: (correct: boolean) => void;
	}

	let { exerciseType, onSubmit }: Props = $props();

	// Get answer options based on exercise type
	let answerOptions = $derived.by((): AnswerOption[] => {
		switch (exerciseType) {
			case 'interval-identification':
				return [
					{ id: 'unison', label: 'Unison', correct: false },
					{ id: 'minor2', label: 'Minor 2nd', correct: false },
					{ id: 'major2', label: 'Major 2nd', correct: false },
					{ id: 'minor3', label: 'Minor 3rd', correct: false },
					{ id: 'major3', label: 'Major 3rd', correct: false },
					{ id: 'perfect4', label: 'Perfect 4th', correct: true },
					{ id: 'tritone', label: 'Tritone', correct: false },
					{ id: 'perfect5', label: 'Perfect 5th', correct: false },
				];
			case 'chord-identification':
				return [
					{ id: 'major', label: 'Major', correct: true },
					{ id: 'minor', label: 'Minor', correct: false },
					{ id: 'diminished', label: 'Diminished', correct: false },
					{ id: 'augmented', label: 'Augmented', correct: false },
				];
			case 'note-identification':
				return [
					{ id: 'C', label: 'C', correct: true },
					{ id: 'D', label: 'D', correct: false },
					{ id: 'E', label: 'E', correct: false },
					{ id: 'F', label: 'F', correct: false },
					{ id: 'G', label: 'G', correct: false },
					{ id: 'A', label: 'A', correct: false },
					{ id: 'B', label: 'B', correct: false },
				];
			case 'melody-repetition':
				return [
					{ id: 'record', label: 'Record Your Answer', isRecord: true },
				];
			case 'pitch-comparison':
				return [
					{ id: 'higher', label: 'Second note is higher', correct: false },
					{ id: 'lower', label: 'Second note is lower', correct: false },
					{ id: 'same', label: 'Both notes are the same', correct: true },
				];
			default:
				return [];
		}
	});

	let selectedAnswer = $state<string | null>(null);
	let isRecording = $state(false);
	
	// Get answer options as a plain array for keyboard navigation
	let options = $derived(answerOptions);
	
	// Get index of currently selected option
	let selectedIndex = $derived(
		selectedAnswer !== null 
			? options.findIndex(o => o.id === selectedAnswer)
			: -1
	);

	// Handle keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		const optionCount = options.length;
		if (optionCount === 0) return;
		
		switch (event.key) {
			case 'ArrowRight':
			case 'ArrowDown':
				event.preventDefault();
				if (selectedIndex < optionCount - 1) {
					selectedAnswer = options[selectedIndex + 1].id;
				} else {
					selectedAnswer = options[0].id;
				}
				break;
			case 'ArrowLeft':
			case 'ArrowUp':
				event.preventDefault();
				if (selectedIndex > 0) {
					selectedAnswer = options[selectedIndex - 1].id;
				} else {
					selectedAnswer = options[optionCount - 1].id;
				}
				break;
			case 'Home':
				event.preventDefault();
				selectedAnswer = options[0].id;
				break;
			case 'End':
				event.preventDefault();
				selectedAnswer = options[optionCount - 1].id;
				break;
			case 'Enter':
			case ' ':
				// If no answer selected and Enter pressed, don't submit
				// If answer selected, submit
				if (selectedAnswer && event.target === document.activeElement) {
					event.preventDefault();
					handleSubmit();
				}
				break;
		}
	}

	function handleSubmit() {
		if (!selectedAnswer) return;
		
		const option = answerOptions.find(o => o.id === selectedAnswer);
		if (option) {
			onSubmit(option.correct ?? false);
			// Reset selection after submission
			selectedAnswer = null;
		}
	}

	async function handleRecord() {
		// Handle microphone recording for melody repetition
		isRecording = true;
		
		// Simulate recording (in a real app, use Web Audio API or MediaRecorder)
		await new Promise(resolve => setTimeout(resolve, 2000));
		
		isRecording = false;
		// For now, submit a placeholder answer
		onSubmit(false);
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div 
	class="answer-input" 
	role="group" 
	aria-label="Answer options"
	onkeydown={handleKeydown}
	tabindex="0"
>
	<h3 class="answer-prompt">Select your answer:</h3>
	
	<div class="answer-options" role="radiogroup" aria-label="Answer choices">
		{#each options as option (option.id)}
			{#if option.isRecord}
				<button
					class="answer-button record-button"
					class:recording={isRecording}
					onclick={handleRecord}
					disabled={isRecording}
					aria-label={option.label}
				>
					{#if isRecording}
						<span class="recording-indicator"></span>
						Recording...
					{:else}
						🎤 {option.label}
					{/if}
				</button>
			{:else}
				<button
					class="answer-button"
					class:selected={selectedAnswer === option.id}
					onclick={() => selectedAnswer = option.id}
					role="radio"
					aria-checked={selectedAnswer === option.id}
					aria-label={option.label}
				>
					{option.label}
				</button>
			{/if}
		{/each}
	</div>
	
	<button
		class="submit-button"
		onclick={handleSubmit}
		disabled={!selectedAnswer}
		aria-label="Submit answer"
	>
		Submit Answer
	</button>
</div>

<style>
	.answer-input {
		text-align: center;
		outline: none;
	}

	.answer-input:focus {
		outline: 2px solid #D4AF37;
		outline-offset: 4px;
		border-radius: 8px;
	}

	.answer-prompt {
		font-family: 'Inter', sans-serif;
		font-size: 1.125rem;
		color: #E8B4B8;
		margin: 0 0 1.5rem 0;
	}

	.answer-options {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.answer-button {
		background: #2D1B4E;
		border: 2px solid #1A5F5F;
		color: #F5E6D3;
		padding: 1rem;
		font-size: 1rem;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 56px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.answer-button:hover:not(:disabled) {
		background: #1A5F5F;
		transform: translateY(-2px);
	}

	.answer-button:focus {
		outline: 2px solid #D4AF37;
		outline-offset: 2px;
	}

	.answer-button.selected {
		background: #1A5F5F;
		border-color: #D4AF37;
		box-shadow: 0 0 12px rgba(212, 175, 55, 0.3);
	}

	.answer-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.record-button {
		grid-column: 1 / -1;
		background: #722F37;
		border-color: #8B3A42;
	}

	.record-button:hover:not(:disabled) {
		background: #8B3A42;
	}

	.record-button.recording {
		background: #E74C3C;
		border-color: #E74C3C;
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.7; }
	}

	.recording-indicator {
		width: 12px;
		height: 12px;
		background: #fff;
		border-radius: 50%;
		margin-right: 0.5rem;
		animation: blink 0.5s ease-in-out infinite;
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.3; }
	}

	.submit-button {
		background: #D4AF37;
		color: #2D1B4E;
		border: none;
		padding: 1rem 3rem;
		font-size: 1.125rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 56px;
	}

	.submit-button:hover:not(:disabled) {
		background: #E5C04B;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
	}

	.submit-button:focus {
		outline: 2px solid #F5E6D3;
		outline-offset: 2px;
	}

	.submit-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
