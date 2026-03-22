<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getLevelById } from '$lib/game/levels';
	import type { IntervalQuestion, AudiationQuestion } from '$lib/music/intervals';
	import IntervalOptions from '$lib/components/exercise/IntervalOptions.svelte';
	import { createIntervalExercise, type IntervalAnswerResult } from '$lib/game/IntervalExercise';

	// Get level ID from URL
	let levelId = $derived($page.params.level ?? '');
	let level = $derived(getLevelById(levelId));

	// Exercise state
	let exercise = $state<ReturnType<typeof createIntervalExercise> | null>(null);
	let currentQuestion = $state<IntervalQuestion | AudiationQuestion | null>(null);
	let currentResult = $state<IntervalAnswerResult | null>(null);
	let hasPlayed = $state(false);
	let isComplete = $state(false);
	let score = $state(0);
	let correctCount = $state(0);
	let totalQuestions = $state(4);
	let isLoading = $state(true);
	let feedbackMessage = $state('');

	// Track initialization to prevent infinite loops
	let initialized = $state(false);

	// Initialize exercise when level is loaded
	$effect(() => {
		if (level && !initialized) {
			initialized = true;
			startExercise();
		}
	});

	function startExercise() {
		if (!level) return;
		
		exercise = createIntervalExercise('interval', level.questionCount || 4);
		totalQuestions = exercise.getTotalQuestions();
		currentQuestion = exercise.generateQuestion();
		hasPlayed = false;
		currentResult = null;
		isComplete = false;
		score = 0;
		correctCount = 0;
		isLoading = false;
	}

	async function playInterval() {
		if (!currentQuestion || !exercise) return;
		
		try {
			await exercise.playCurrent();
			hasPlayed = true;
		} catch (error) {
			console.error('Error playing interval:', error);
			feedbackMessage = 'Unable to play audio. Please ensure your audio is enabled.';
		}
	}

	function handleAnswer(answer: string) {
		if (!currentQuestion || !exercise || currentQuestion.type !== 'interval') return;

		const result = exercise.submitAnswer(answer);
		currentResult = result;
		
		// Update score
		score = exercise.getScore();
		correctCount = exercise.getCorrectCount();
		
		// Show feedback
		if (result) {
			feedbackMessage = result.feedback;
		}

		// Check if complete
		if (exercise.isComplete()) {
			isComplete = true;
		} else {
			// Move to next question after a delay
			setTimeout(() => {
				nextQuestion();
			}, 2000);
		}
	}

	function nextQuestion() {
		if (!exercise) return;
		currentQuestion = exercise.generateQuestion();
		hasPlayed = false;
		currentResult = null;
		feedbackMessage = '';
	}

	function replayExercise() {
		startExercise();
	}

	function goBack() {
		goto('/library');
	}
</script>

<svelte:head>
	<title>{level?.title || 'Exercise'} - Melora</title>
</svelte:head>

<div class="exercise-container">
	{#if !level}
		<div class="error">
			<h1>Exercise not found</h1>
			<p>The requested exercise could not be found.</p>
			<button class="btn-primary" onclick={goBack}>Back to Library</button>
		</div>
	{:else if isLoading}
		<div class="loading">
			<div class="spinner"></div>
			<p>Loading exercise...</p>
		</div>
	{:else if isComplete}
		<!-- Completion Screen -->
		<div class="completion-screen">
			<h1>Exercise Complete!</h1>
			
			<div class="score-display">
				<div class="score-circle" class:passed={score >= 70}>
					<span class="score-value">{score}%</span>
				</div>
				<p class="score-label">
					{correctCount} out of {totalQuestions} correct
				</p>
			</div>

			{#if score >= 70}
				<p class="congratulations">Congratulations! You've passed this lesson!</p>
			{:else}
				<p class="encouragement">Keep practicing! You'll get there!</p>
			{/if}

			<div class="completion-actions">
				<button class="btn-secondary" onclick={replayExercise}>
					Play Again
				</button>
				<button class="btn-primary" onclick={goBack}>
					Back to Library
				</button>
			</div>
		</div>
	{:else}
		<!-- Exercise Screen -->
		<div class="exercise-header">
			<h1>{level.title}</h1>
			{#if exercise}
				<div class="progress">
					<span>Question {exercise.getCurrentIndex() + 1} of {totalQuestions}</span>
					<div class="progress-bar">
						<div 
							class="progress-fill" 
							style="width: {(exercise.getCurrentIndex() / totalQuestions) * 100}%"
						></div>
					</div>
				</div>
			{/if}
		</div>

		<div class="exercise-content">
			{#if currentQuestion && currentQuestion.type === 'interval'}
				<div class="question-area">
					<h2>Listen to the interval</h2>
					
					<div class="play-section">
						<button 
							class="play-button" 
							onclick={playInterval}
							aria-label={hasPlayed ? 'Play again' : 'Play interval'}
						>
							{#if hasPlayed}
								<span class="icon">🔊</span>
								<span>Listen Again</span>
							{:else}
								<span class="icon">▶️</span>
								<span>Play Interval</span>
							{/if}
						</button>
						<p class="play-hint">
							{#if currentQuestion.playbackType === 'harmonic'}
								<em>Harmonic: Both notes play together</em>
							{:else}
								<em>Melodic: Notes play one after the other</em>
							{/if}
						</p>
					</div>

					{#if hasPlayed}
						<div class="answer-section">
							<h3>What interval did you hear?</h3>
							
							<IntervalOptions
								options={['Unison', 'Octave']}
								onAnswer={handleAnswer}
								disabled={!!currentResult}
								showNoteNames={true}
								rootNote={currentQuestion.rootNote}
								targetNote={currentQuestion.targetNote}
							/>
						</div>
					{/if}

					{#if currentResult}
						<div class="feedback" class:correct={currentResult.correct} class:incorrect={!currentResult.correct}>
							<p>{currentResult.feedback}</p>
						</div>
					{/if}
				</div>
			{:else}
				<p>Loading question...</p>
			{/if}
		</div>

		{#if feedbackMessage && !currentResult}
			<div class="feedback-toast">
				<p>{feedbackMessage}</p>
			</div>
		{/if}
	{/if}
</div>

<style>
	.exercise-container {
		min-height: 100vh;
		background: #1A1A2E;
		color: #F5E6D3;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.error {
		text-align: center;
		padding: 3rem;
	}

	.error h1 {
		color: #D4AF37;
		margin-bottom: 1rem;
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 50vh;
	}

	.spinner {
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

	.exercise-header {
		width: 100%;
		max-width: 800px;
		text-align: center;
		margin-bottom: 2rem;
	}

	.exercise-header h1 {
		font-family: 'Playfair Display', serif;
		font-size: 2rem;
		color: #D4AF37;
		margin-bottom: 1rem;
	}

	.progress {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.progress span {
		font-size: 0.9rem;
		color: #E8B4B8;
	}

	.progress-bar {
		height: 8px;
		background: #2D1B4E;
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #D4AF37, #2ECC71);
		transition: width 0.3s ease;
	}

	.exercise-content {
		width: 100%;
		max-width: 800px;
	}

	.question-area {
		text-align: center;
	}

	.question-area h2 {
		font-family: 'Playfair Display', serif;
		font-size: 1.5rem;
		color: #E8B4B8;
		margin-bottom: 2rem;
	}

	.play-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.play-button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: #D4AF37;
		color: #2D1B4E;
		border: none;
		padding: 1rem 2.5rem;
		font-size: 1.25rem;
		font-weight: 600;
		border-radius: 50px;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 64px;
	}

	.play-button:hover:not(:disabled) {
		background: #E5C04B;
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
	}

	.play-button:focus {
		outline: 3px solid #F5E6D3;
		outline-offset: 2px;
	}

	.play-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.play-button .icon {
		font-size: 1.5rem;
	}

	.play-hint {
		color: #E8B4B8;
		font-size: 0.9rem;
	}

	.answer-section {
		margin-top: 2rem;
	}

	.answer-section h3 {
		font-family: 'Playfair Display', serif;
		font-size: 1.25rem;
		color: #E8B4B8;
		margin-bottom: 1rem;
	}

	.feedback {
		margin-top: 1.5rem;
		padding: 1rem 1.5rem;
		border-radius: 12px;
		font-size: 1.1rem;
		animation: fadeIn 0.3s ease;
	}

	.feedback.correct {
		background: rgba(46, 204, 113, 0.2);
		border: 2px solid #2ECC71;
		color: #2ECC71;
	}

	.feedback.incorrect {
		background: rgba(231, 76, 60, 0.2);
		border: 2px solid #E74C3C;
		color: #E74C3C;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(-10px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.feedback-toast {
		position: fixed;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		background: #2D1B4E;
		border: 2px solid #D4AF37;
		padding: 1rem 2rem;
		border-radius: 12px;
		color: #F5E6D3;
		animation: slideUp 0.3s ease;
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translate(-50%, 20px); }
		to { opacity: 1; transform: translate(-50%, 0); }
	}

	/* Completion Screen */
	.completion-screen {
		text-align: center;
		padding: 2rem;
	}

	.completion-screen h1 {
		font-family: 'Playfair Display', serif;
		font-size: 2.5rem;
		color: #D4AF37;
		margin-bottom: 2rem;
	}

	.score-display {
		margin: 2rem 0;
	}

	.score-circle {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		background: #2D1B4E;
		border: 4px solid #E74C3C;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
	}

	.score-circle.passed {
		border-color: #2ECC71;
	}

	.score-value {
		font-size: 2.5rem;
		font-weight: bold;
		color: #F5E6D3;
	}

	.score-label {
		color: #E8B4B8;
		margin-top: 1rem;
	}

	.congratulations, .encouragement {
		font-size: 1.25rem;
		margin: 1.5rem 0;
	}

	.congratulations {
		color: #2ECC71;
	}

	.encouragement {
		color: #E8B4B8;
	}

	.completion-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-top: 2rem;
	}

	.btn-primary, .btn-secondary {
		padding: 1rem 2rem;
		font-size: 1.1rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 48px;
	}

	.btn-primary {
		background: #D4AF37;
		color: #2D1B4E;
		border: none;
	}

	.btn-primary:hover {
		background: #E5C04B;
		transform: translateY(-2px);
	}

	.btn-secondary {
		background: transparent;
		color: #F5E6D3;
		border: 2px solid #D4AF37;
	}

	.btn-secondary:hover {
		background: rgba(212, 175, 55, 0.1);
	}
</style>
