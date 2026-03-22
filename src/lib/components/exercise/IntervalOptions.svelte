<script lang="ts">
	interface Props {
		options: string[]; // ['Unison', 'Octave']
		onAnswer: (answer: string) => void;
		disabled?: boolean;
		showNoteNames?: boolean;
		rootNote?: string;
		targetNote?: string;
	}

	let { options, onAnswer, disabled = false, showNoteNames = false, rootNote = '', targetNote = '' }: Props = $props();

	let selectedAnswer = $state<string | null>(null);
	let isSubmitting = $state(false);

	async function handleAnswer(answer: string) {
		if (disabled || isSubmitting) return;
		
		selectedAnswer = answer;
		isSubmitting = true;
		
		// Small delay for visual feedback
		await new Promise(resolve => setTimeout(resolve, 300));
		
		onAnswer(answer);
		
		// Reset after a short delay
		setTimeout(() => {
			selectedAnswer = null;
			isSubmitting = false;
		}, 500);
	}

	// Keyboard navigation
	function handleKeydown(event: KeyboardEvent, index: number) {
		if (disabled || isSubmitting) return;

		switch (event.key) {
			case 'Enter':
			case ' ':
				event.preventDefault();
				handleAnswer(options[index]);
				break;
		}
	}
</script>

<div class="interval-options" role="group" aria-label="Select interval answer">
	{#each options as option, index (option)}
		<button
			class="interval-btn"
			class:selected={selectedAnswer === option}
			class:unison={option === 'Unison'}
			class:octave={option === 'Octave'}
			onclick={() => handleAnswer(option)}
			onkeydown={(e) => handleKeydown(e, index)}
			disabled={disabled || isSubmitting}
			aria-label={option}
			aria-pressed={selectedAnswer === option}
		>
			<span class="option-label">{option}</span>
			{#if showNoteNames && rootNote && targetNote}
				<span class="note-hint">
					{#if option === 'Unison'}
						{rootNote}
					{:else}
						{rootNote} → {targetNote}
					{/if}
				</span>
			{/if}
		</button>
	{/each}
</div>

<style>
	.interval-options {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
		margin: 2rem 0;
		flex-wrap: wrap;
	}

	.interval-btn {
		min-width: 160px;
		min-height: 100px;
		background: #2D1B4E;
		border: 3px solid #D4AF37;
		border-radius: 16px;
		color: #F5E6D3;
		font-size: 1.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 1rem 2rem;
	}

	.interval-btn:hover:not(:disabled) {
		background: #D4AF37;
		color: #2D1B4E;
		transform: translateY(-4px);
		box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
	}

	.interval-btn:focus {
		outline: 3px solid #D4AF37;
		outline-offset: 3px;
	}

	.interval-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.interval-btn.selected {
		background: #D4AF37;
		color: #2D1B4E;
		transform: scale(1.05);
		box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
	}

	.interval-btn.unison {
		border-color: #2ECC71;
	}

	.interval-btn.unison:hover:not(:disabled) {
		background: #2ECC71;
		border-color: #27AE60;
	}

	.interval-btn.unison.selected {
		background: #2ECC71;
		border-color: #27AE60;
	}

	.interval-btn.octave {
		border-color: #3498DB;
	}

	.interval-btn.octave:hover:not(:disabled) {
		background: #3498DB;
		border-color: #2980B9;
	}

	.interval-btn.octave.selected {
		background: #3498DB;
		border-color: #2980B9;
	}

	.option-label {
		font-size: 1.75rem;
	}

	.note-hint {
		font-size: 0.9rem;
		opacity: 0.8;
		font-weight: 400;
	}
</style>
