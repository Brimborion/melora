<script lang="ts">
	import type { Level } from '$lib/types/game';
	import { exerciseStore } from '$lib/stores/exercise.svelte';
	import { audioStore } from '$lib/stores/audio.svelte';
	import { exerciseEngine } from '$lib/game/ExerciseEngine';
	import QuestionDisplay from './QuestionDisplay.svelte';
	import AnswerInput from './AnswerInput.svelte';
	import ScoreDisplay from './ScoreDisplay.svelte';
	import PauseOverlay from './PauseOverlay.svelte';
	import ExplanationModal from './ExplanationModal.svelte';
	import { getIncorrectAnswerExplanations, type Explanation } from '$lib/game/ExplanationService';

	interface Props {
		level: Level;
		onComplete?: (score: number) => void;
		onExit?: () => void;
	}

	let { level, onComplete, onExit }: Props = $props();

	// State for explanation modal
	let showExplanations = $state(false);
	let explanations: Explanation[] = $state([]);
	let replayError = $state<string | null>(null);

	// Load the exercise when component mounts
	$effect(() => {
		exerciseStore.loadExercise(level);
		// Initialize ExerciseEngine for score persistence
		exerciseEngine.initialize(level);
	});

	// Handle answer submission
	function handleAnswer(correct: boolean) {
		exerciseStore.submitAnswer(correct ? 'correct' : 'wrong');
		
		// Also record answer in ExerciseEngine for explanations
		const currentQuestion = exerciseEngine.getCurrentQuestion();
		exerciseEngine.submitAnswer(correct, currentQuestion?.correctAnswer || '');
		
		// Check if exercise is complete
		if (exerciseStore.isComplete) {
			handleComplete();
		} else {
			exerciseStore.nextQuestion();
		}
	}

	// Handle exercise completion
	async function handleComplete() {
		// Save the score to the database
		try {
			await exerciseEngine.saveResult();
		} catch (error) {
			console.error('Error saving score:', error);
		}
		
		// Call onComplete callback if provided
		if (onComplete) {
			onComplete(exerciseStore.score);
		}
	}

	// Handle exit
	async function handleExit() {
		await exerciseStore.reset();
		exerciseEngine.reset();
		if (onExit) {
			onExit();
		}
	}

	// Handle replay - reset exercise with new questions
	async function handleReplay() {
		replayError = null;
		try {
			// First reinitialize the engine (this clears state)
			await exerciseEngine.initialize(level);
			
			// Then reset with new random questions
			await exerciseEngine.resetExercise(level.questionCount || 4);
			
			// Reset the exercise store
			await exerciseStore.loadExercise(level);
		} catch (error) {
			console.error('Error resetting exercise:', error);
			replayError = 'Failed to replay exercise. Please try again.';
			// Fallback to regular reset
			await exerciseStore.loadExercise(level);
			await exerciseEngine.initialize(level);
		}
	}

	// Handle view explanations
	function handleViewExplanations() {
		const answerHistory = exerciseEngine.getAnswerHistory();
		if (answerHistory.length > 0) {
			explanations = getIncorrectAnswerExplanations(
				answerHistory,
				level.exerciseType,
				exerciseStore.score
			);
			showExplanations = true;
		}
	}

	// Close explanation modal
	function closeExplanations() {
		showExplanations = false;
	}

	// Handle pause button click
	async function handlePause() {
		// Stop audio playback
		audioStore.stop();
		// Pause the exercise
		await exerciseStore.pause();
	}

	// Handle keyboard shortcuts
	function handleKeydown(event: KeyboardEvent) {
		// Only handle if not in an input field
		const target = event.target as HTMLElement;
		if (target.tagName === 'INPUT' || target.tagName === 'BUTTON') return;
		
		// P or Escape to toggle pause/resume (only when exercise is active)
		const isPauseKey = event.key === 'p' || event.key === 'P' || event.key === 'Escape';
		
		if (isPauseKey && exerciseStore.hasStarted && !exerciseStore.isComplete) {
			event.preventDefault();
			
			if (exerciseStore.isPaused) {
				// Resume when paused
				handleResume();
			} else {
				// Pause when not paused
				handlePause();
			}
		}
	}

	// Handle resume from overlay
	async function handleResume() {
		// Ensure audio context is ready after resume
		// This handles the suspended audio context during pause/resume transitions
		try {
			await audioStore.setVolume(audioStore.volume); // This triggers ensureAudioReady internally
		} catch (error) {
			console.warn('Failed to resume audio context:', error);
		}
	}

	// Handle restart from overlay
	function handleRestart() {
		// Reload the exercise
		exerciseStore.loadExercise(level);
		exerciseEngine.initialize(level);
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="exercise-view" role="main" aria-label="Exercise">
	<!-- Header with progress -->
	<header class="exercise-header">
		<div class="header-content">
			<h1 class="exercise-title">{exerciseStore.currentExercise?.title ?? ''}</h1>
			<div class="header-buttons">
				{#if exerciseStore.hasStarted && !exerciseStore.isComplete && !exerciseStore.isLoading}
					<button 
						class="pause-button"
						onclick={handlePause}
						aria-label="Pause exercise"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<rect x="6" y="4" width="4" height="16" rx="1"/>
							<rect x="14" y="4" width="4" height="16" rx="1"/>
						</svg>
					</button>
				{/if}
				<button 
					class="exit-button"
					onclick={handleExit}
					aria-label="Exit exercise"
				>
					Exit
				</button>
			</div>
		</div>
		
		<!-- Progress bar -->
		<div 
			class="progress-bar" 
			role="progressbar" 
			aria-valuenow={exerciseStore.answers.length}
			aria-valuemin="0"
			aria-valuemax={exerciseStore.totalQuestions}
			aria-label="Exercise progress"
		>
			<div 
				class="progress-fill"
				style="width: {(exerciseStore.answers.length / exerciseStore.totalQuestions) * 100}%"
			></div>
		</div>
		
		<div class="progress-text">
			<span>Question {exerciseStore.currentQuestionIndex + 1} of {exerciseStore.totalQuestions}</span>
			<span>Score: {exerciseStore.score}%</span>
		</div>
	</header>

	<!-- Loading state -->
	{#if exerciseStore.isLoading}
		<div class="loading-state" aria-live="polite">
			<div class="loading-spinner"></div>
			<p>Loading exercise...</p>
		</div>
	{:else if exerciseStore.isComplete}
		<!-- Completion state -->
		<ScoreDisplay 
			score={exerciseStore.score}
			totalQuestions={exerciseStore.totalQuestions}
			correctAnswers={exerciseStore.correctAnswers}
			exerciseType={level.exerciseType}
			answerHistory={exerciseEngine.getAnswerHistory()}
			replayError={replayError}
			onReplay={handleReplay}
			onViewExplanations={handleViewExplanations}
			onExit={handleExit}
		/>
		
		<!-- Explanation Modal -->
		{#if showExplanations}
			<ExplanationModal 
				explanations={explanations}
				onClose={closeExplanations}
			/>
		{/if}
	{:else}
		<!-- Active exercise state -->
		<main class="exercise-content">
			<QuestionDisplay 
				questionIndex={exerciseStore.currentQuestionIndex}
				exerciseType={exerciseStore.currentExercise?.exerciseType ?? 'interval-identification'}
			/>
			
			<AnswerInput 
				exerciseType={exerciseStore.currentExercise?.exerciseType ?? 'interval-identification'}
				onSubmit={handleAnswer}
			/>
		</main>
	{/if}
	
	<!-- Pause Overlay -->
	{#if exerciseStore.isPaused}
		<PauseOverlay 
			onResume={handleResume}
			onRestart={handleRestart}
			onExit={handleExit}
		/>
	{/if}
</div>

<style>
	.exercise-view {
		min-height: 100vh;
		background: #1A1A2E;
		color: #F5E6D3;
		padding: 1rem;
	}

	.exercise-header {
		margin-bottom: 2rem;
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.exercise-title {
		font-family: 'Playfair Display', serif;
		font-size: 1.75rem;
		color: #D4AF37;
		margin: 0;
	}

	.header-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.pause-button {
		background: transparent;
		border: 1px solid #D4AF37;
		color: #D4AF37;
		padding: 0.5rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.875rem;
		transition: all 0.2s ease;
		min-height: 44px;
		min-width: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pause-button:hover {
		background: #D4AF37;
		color: #1A1A2E;
	}

	.pause-button:focus {
		outline: 2px solid #D4AF37;
		outline-offset: 2px;
	}

	.exit-button {
		background: transparent;
		border: 1px solid #1A5F5F;
		color: #F5E6D3;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.875rem;
		transition: all 0.2s ease;
		min-height: 44px;
		min-width: 44px;
	}

	.exit-button:hover {
		background: #1A5F5F;
	}

	.exit-button:focus {
		outline: 2px solid #D4AF37;
		outline-offset: 2px;
	}

	.progress-bar {
		height: 8px;
		background: #2D1B4E;
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}

	.progress-fill {
		height: 100%;
		background: #D4AF37;
		transition: width 0.3s ease;
	}

	.progress-text {
		display: flex;
		justify-content: space-between;
		font-size: 0.875rem;
		color: #E8B4B8;
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 50vh;
	}

	.loading-spinner {
		width: 48px;
		height: 48px;
		border: 4px solid #2D1B4E;
		border-top-color: #D4AF37;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.loading-state p {
		margin-top: 1rem;
		color: #E8B4B8;
	}

	.exercise-content {
		max-width: 600px;
		margin: 0 auto;
	}
</style>
