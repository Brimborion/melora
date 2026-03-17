<script lang="ts">
	import { exerciseEngine, type AnswerRecord } from '$lib/game';
	import { getIncorrectAnswerExplanations, type Explanation } from '$lib/game';
	import type { ExerciseType } from '$lib/types/game';

	interface Props {
		score: number;
		totalQuestions: number;
		correctAnswers: number;
		exerciseType?: ExerciseType;
		answerHistory?: Array<{ correctAnswer: string; userAnswer: string; wasCorrect: boolean }>;
		replayError?: string | null;
		onReplay?: () => void;
		onViewExplanations?: () => void;
		onExit?: () => void;
	}

	let { 
		score, 
		totalQuestions, 
		correctAnswers, 
		exerciseType = 'interval-identification',
		answerHistory: initialHistory = [],
		replayError = null,
		onReplay, 
		onViewExplanations, 
		onExit 
	}: Props = $props();

	// Use provided answer history or fall back to engine
	let answerHistory: Array<{ correctAnswer: string; userAnswer: string; wasCorrect: boolean }> = $state([]);
	
	// Get explanations for incorrect answers
	let incorrectExplanations: Explanation[] = $state([]);

	// Determine score message based on score
	let scoreMessage = $derived(() => {
		if (score >= 90) return 'Excellent!';
		if (score >= 70) return 'Great job!';
		if (score >= 50) return 'Good effort!';
		return 'Keep practicing!';
	});

	// Determine if passed (>= 70%)
	let passed = $derived(score >= 70);

	// Check if there are any explanations to show
	let hasExplanations = $derived(() => {
		return incorrectExplanations.length > 0;
	});

	// Initialize explanations from props or engine
	$effect(() => {
		// Use provided answer history from props
		if (initialHistory && initialHistory.length > 0) {
			answerHistory = initialHistory;
		} else {
			// Fall back to engine if no props provided
			try {
				const engineHistory = exerciseEngine.getAnswerHistory();
				if (engineHistory && engineHistory.length > 0) {
					answerHistory = engineHistory.map(h => ({
						correctAnswer: h.correctAnswer,
						userAnswer: h.userAnswer,
						wasCorrect: h.wasCorrect
					}));
				}
			} catch {
				// Engine may not be available
				answerHistory = [];
			}
		}
		
		// Get explanations for incorrect answers
		if (answerHistory.length > 0) {
			incorrectExplanations = getIncorrectAnswerExplanations(
				answerHistory,
				exerciseType ?? 'interval-identification',
				score
			);
		}
	});

	// Handle replay
	function handleReplay() {
		if (onReplay) {
			onReplay();
		}
	}

	// Handle view explanations
	function handleViewExplanations() {
		if (onViewExplanations) {
			onViewExplanations();
		}
	}

	// Handle exit after viewing score
	function handleExit() {
		if (onExit) {
			onExit();
		}
	}

	// Expose explanations for parent components
	export function getExplanationsData(): Explanation[] {
		return incorrectExplanations;
	}
</script>

<div class="score-display" role="dialog" aria-labelledby="score-title" aria-modal="true">
	<div class="score-card">
		<!-- Score icon -->
		<div class="score-icon" class:passed>
			{#if passed}
				<span aria-hidden="true">★</span>
			{:else}
				<span aria-hidden="true">○</span>
			{/if}
		</div>
		
		<!-- Score message -->
		<h2 id="score-title" class="score-message">
			{scoreMessage()}
		</h2>
		
		<!-- Score value -->
		<div 
			class="score-value"
			class:passed
			role="status"
			aria-label={`Your score: ${score} percent`}
		>
			{score}%
		</div>
		
		<!-- Stats -->
		<div class="score-stats" aria-label="Exercise statistics">
			<div class="stat">
				<span class="stat-label">Correct</span>
				<span class="stat-value correct">{correctAnswers}</span>
			</div>
			<div class="stat-divider" aria-hidden="true"></div>
			<div class="stat">
				<span class="stat-label">Total</span>
				<span class="stat-value">{totalQuestions}</span>
			</div>
		</div>
		
		<!-- Status badge -->
		<div 
			class="status-badge"
			class:passed
			role="status"
			aria-label={passed ? 'Exercise passed' : 'Exercise not passed'}
		>
			{passed ? 'PASSED' : 'NOT PASSED'}
		</div>
		
		<!-- Encouragement message -->
		<p class="encouragement">
			{#if passed}
				You've mastered this exercise! Ready for a new challenge?
			{:else}
				Don't give up! Practice makes perfect.
			{/if}
		</p>
		
		<!-- Action buttons -->
		<div class="action-buttons">
			{#if replayError}
				<p class="error-message" role="alert">{replayError}</p>
			{/if}
			
			{#if onReplay}
				<button 
					class="primary-button replay-button"
					onclick={handleReplay}
					aria-label="Replay exercise with new questions"
				>
					Replay Exercise
				</button>
			{/if}
			
			{#if onViewExplanations && hasExplanations()}
				<button 
					class="secondary-button"
					onclick={handleViewExplanations}
					aria-label="View explanations for answers"
				>
					View Explanations ({incorrectExplanations.length})
				</button>
			{/if}
			
			{#if onExit}
				<button 
					class="exit-button"
					onclick={handleExit}
					aria-label="Return to library"
				>
					Return to Library
				</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.score-display {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 60vh;
		padding: 1rem;
	}

	.score-card {
		background: linear-gradient(145deg, #2D1B4E 0%, #1A1A2E 100%);
		border: 2px solid #D4AF37;
		border-radius: 16px;
		padding: 3rem;
		text-align: center;
		max-width: 400px;
		width: 100%;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.score-icon {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: #722F37;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 1.5rem;
		font-size: 2.5rem;
		color: #F5E6D3;
	}

	.score-icon.passed {
		background: linear-gradient(135deg, #D4AF37 0%, #E5C04B 100%);
		color: #2D1B4E;
	}

	.score-message {
		font-family: 'Playfair Display', serif;
		font-size: 1.75rem;
		color: #F5E6D3;
		margin: 0 0 1rem 0;
	}

	.score-value {
		font-family: 'Playfair Display', serif;
		font-size: 4rem;
		font-weight: 700;
		color: #E74C3C;
		margin-bottom: 1.5rem;
		line-height: 1;
	}

	.score-value.passed {
		color: #2ECC71;
	}

	.score-stats {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 8px;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stat-label {
		font-size: 0.75rem;
		color: #E8B4B8;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 600;
		color: #F5E6D3;
	}

	.stat-value.correct {
		color: #2ECC71;
	}

	.stat-divider {
		width: 1px;
		height: 40px;
		background: #1A5F5F;
	}

	.status-badge {
		display: inline-block;
		padding: 0.5rem 1.5rem;
		border-radius: 20px;
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		margin-bottom: 1rem;
		background: #722F37;
		color: #F5E6D3;
	}

	.status-badge.passed {
		background: #1A5F5F;
		color: #F5E6D3;
	}

	.encouragement {
		color: #E8B4B8;
		font-size: 0.875rem;
		margin: 0 0 2rem 0;
		line-height: 1.5;
	}

	.error-message {
		color: #E74C3C;
		font-size: 0.875rem;
		margin: 0 0 0.5rem 0;
		padding: 0.75rem;
		background: rgba(231, 76, 60, 0.1);
		border-radius: 8px;
		text-align: center;
	}

	.action-buttons {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.primary-button {
		background: #D4AF37;
		color: #2D1B4E;
		border: none;
		padding: 1rem 2rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 56px;
	}

	.primary-button:hover {
		background: #E5C04B;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
	}

	.primary-button:focus {
		outline: 2px solid #F5E6D3;
		outline-offset: 2px;
	}

	.replay-button {
		background: linear-gradient(135deg, #D4AF37 0%, #E5C04B 100%);
	}

	.secondary-button {
		background: transparent;
		color: #D4AF37;
		border: 2px solid #D4AF37;
		padding: 1rem 2rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 56px;
	}

	.secondary-button:hover {
		background: rgba(212, 175, 55, 0.1);
		transform: translateY(-2px);
	}

	.secondary-button:focus {
		outline: 2px solid #F5E6D3;
		outline-offset: 2px;
	}

	.exit-button {
		background: transparent;
		color: #E8B4B8;
		border: 1px solid #E8B4B8;
		padding: 0.75rem 1.5rem;
		font-size: 0.875rem;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 44px;
	}

	.exit-button:hover {
		background: rgba(232, 180, 184, 0.1);
	}

	.exit-button:focus {
		outline: 2px solid #F5E6D3;
		outline-offset: 2px;
	}
</style>
