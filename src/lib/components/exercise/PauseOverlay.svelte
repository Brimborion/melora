<script lang="ts">
	import { exerciseStore } from '$lib/stores/exercise.svelte';

	interface Props {
		onResume?: () => void;
		onRestart?: () => void;
		onExit?: () => void;
	}

	let { onResume, onRestart, onExit }: Props = $props();

	// Format elapsed time as MM:SS
	function formatTime(ms: number): string {
		const totalSeconds = Math.floor(ms / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}

	// Get current elapsed time (updates in real-time)
	let currentTime = $state(0);
	
	// Update time display every second while paused
	$effect(() => {
		if (exerciseStore.isPaused) {
			currentTime = exerciseStore.getCurrentElapsedTime();
			const interval = setInterval(() => {
				currentTime = exerciseStore.getCurrentElapsedTime();
			}, 1000);
			return () => clearInterval(interval);
		}
	});

	// Handle resume button click
	async function handleResume() {
		const success = await exerciseStore.resume();
		if (success && onResume) {
			onResume();
		}
	}

	// Handle restart button click
	async function handleRestart() {
		await exerciseStore.reset();
		if (onRestart) {
			onRestart();
		}
	}

	// Handle exit button click
	async function handleExitClick() {
		await exerciseStore.reset();
		if (onExit) {
			onExit();
		}
	}

	// Keyboard shortcut for resume (Escape or P)
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' || event.key === 'p' || event.key === 'P') {
			handleResume();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div 
	class="pause-overlay" 
	role="dialog" 
	aria-modal="true"
	aria-labelledby="pause-title"
>
	<div class="pause-content">
		<h2 id="pause-title" class="pause-title">Exercise Paused</h2>
		
		<div class="time-display">
			<span class="time-label">Time Elapsed</span>
			<span class="time-value">{formatTime(currentTime)}</span>
		</div>
		
		<div class="progress-summary">
			<span class="progress-label">Question</span>
			<span class="progress-value">
				{exerciseStore.pausedAt !== null ? exerciseStore.pausedAt + 1 : '—'} 
				of {exerciseStore.totalQuestions}
			</span>
		</div>
		
		<div class="score-preview">
			<span class="score-label">Current Score</span>
			<span class="score-value">{exerciseStore.score}%</span>
		</div>
		
		<div class="button-group">
			<!-- svelte-ignore a11y_autofocus -->
			<button 
				class="resume-button"
				onclick={handleResume}
				autofocus
				aria-label="Resume exercise"
			>
				Resume
			</button>
			
			<button 
				class="restart-button"
				onclick={handleRestart}
				aria-label="Restart exercise"
			>
				Restart
			</button>
			
			<button 
				class="exit-button"
				onclick={handleExitClick}
				aria-label="Exit exercise"
			>
				Exit
			</button>
		</div>
		
		<p class="hint-text">Press <kbd>Esc</kbd> or <kbd>P</kbd> to resume</p>
	</div>
</div>

<style>
	.pause-overlay {
		position: fixed;
		inset: 0;
		background: rgba(26, 26, 46, 0.97);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.pause-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding: 3rem;
		max-width: 400px;
		width: 100%;
	}

	.pause-title {
		font-family: 'Playfair Display', serif;
		font-size: 2.5rem;
		color: #D4AF37;
		margin: 0;
		text-align: center;
	}

	.time-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.time-label {
		font-size: 0.875rem;
		color: #E8B4B8;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.time-value {
		font-family: 'Playfair Display', serif;
		font-size: 3rem;
		color: #F5E6D3;
	}

	.progress-summary,
	.score-preview {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.progress-label,
	.score-label {
		font-size: 0.75rem;
		color: #E8B4B8;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.progress-value,
	.score-value {
		font-size: 1.25rem;
		color: #F5E6D3;
		font-weight: 500;
	}

	.button-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		margin-top: 1rem;
	}

	.resume-button {
		background: #1A5F5F;
		border: 2px solid #D4AF37;
		color: #F5E6D3;
		padding: 1rem 2rem;
		font-size: 1.125rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 56px;
	}

	.resume-button:hover {
		background: #247070;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
	}

	.resume-button:focus {
		outline: 2px solid #D4AF37;
		outline-offset: 4px;
	}

	.restart-button,
	.exit-button {
		background: transparent;
		border: 1px solid #722F37;
		color: #E8B4B8;
		padding: 0.875rem 2rem;
		font-size: 1rem;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 44px;
	}

	.restart-button:hover,
	.exit-button:hover {
		background: #722F37;
		color: #F5E6D3;
	}

	.restart-button:focus,
	.exit-button:focus {
		outline: 2px solid #D4AF37;
		outline-offset: 2px;
	}

	.hint-text {
		font-size: 0.875rem;
		color: #E8B4B8;
		margin: 0;
	}

	.hint-text kbd {
		background: #2D1B4E;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-family: monospace;
		border: 1px solid #722F37;
	}
</style>
