<script lang="ts">
	import { audioStore } from '$lib/stores/audio.svelte';
	import { 
		type IntervalQuestion,
		generateIntervalQuestion 
	} from '$lib/music/intervals';
	import type { Note } from '$lib/types';
	
	interface Props {
		exerciseId?: string;
		onComplete?: (result: ExerciseResult) => void;
	}
	
	interface ExerciseResult {
		exerciseId: string;
		score: number;
		correctAnswers: number;
		totalQuestions: number;
	}

	let { exerciseId = 'ex1-harmonic-recognition', onComplete }: Props = $props();
	
	const TOTAL_QUESTIONS = 10;
	const PLAYBACK_TIMEOUT_MS = 5000;
	
	let currentQuestion = $state(0);
	let question = $state<IntervalQuestion | null>(null);
	let selectedAnswer = $state<string | null>(null);
	let isCorrect = $state<boolean | null>(null);
	let sessionComplete = $state(false);
	let score = $state(0);
	let correctCount = $state(0);
	let isPlaying = $state(false);
	let playbackError = $state<string | null>(null);
	let onCompleteCalled = $state(false);
	
	function nextQuestion() {
		selectedAnswer = null;
		isCorrect = null;
		
		if (currentQuestion >= TOTAL_QUESTIONS - 1) {
			sessionComplete = true;
			score = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
			if (!onCompleteCalled) {
				onCompleteCalled = true;
				onComplete?.({
					exerciseId,
					score,
					correctAnswers: correctCount,
					totalQuestions: TOTAL_QUESTIONS
				});
			}
		} else {
			currentQuestion++;
			question = generateIntervalQuestion();
		}
	}
	
	function selectAnswer(answer: string) {
		if (selectedAnswer !== null || !question) return;
		
		selectedAnswer = answer;
		isCorrect = question.intervalName === answer;
		
		if (isCorrect) {
			correctCount++;
		}
	}
	
	function parseNoteString(noteStr: string): Note | null {
		const match = noteStr.match(/^([A-G])([#b]?)(\d)$/);
		if (!match) {
			console.error('Invalid note string:', noteStr);
			return null;
		}
		return {
			name: match[1] as Note['name'],
			accidental: (match[2] || '') as Note['accidental'],
			octave: parseInt(match[3], 10) as Note['octave']
		};
	}
	
	async function playInterval() {
		if (!question || isPlaying) return;
		
		const note1 = parseNoteString(question.rootNote);
		const note2 = parseNoteString(question.targetNote);
		
		if (!note1 || !note2) {
			playbackError = 'Invalid note data';
			return;
		}
		
		playbackError = null;
		
		try {
			isPlaying = true;
			
			const playbackPromise = audioStore.playChord([note1, note2], '3');
			const timeoutPromise = new Promise<void>((_, reject) => {
				setTimeout(() => reject(new Error('Playback timeout')), PLAYBACK_TIMEOUT_MS);
			});
			
			await Promise.race([playbackPromise, timeoutPromise]);
		} catch (error) {
			console.error('Error playing interval:', error);
			playbackError = 'Playback failed. Try again.';
		} finally {
			isPlaying = false;
		}
	}
	
	function restartSession() {
		currentQuestion = 0;
		correctCount = 0;
		score = 0;
		sessionComplete = false;
		selectedAnswer = null;
		isCorrect = null;
		isPlaying = false;
		playbackError = null;
		onCompleteCalled = false;
		question = generateIntervalQuestion();
	}

	$effect(() => {
		question = generateIntervalQuestion();
		
		return () => {
			isPlaying = false;
		};
	});
</script>

<div class="harmonic-recognition" role="main" aria-label="Harmonic Interval Recognition Exercise">
	{#if sessionComplete}
		<div class="completion-screen">
			<h1 class="completion-title">Session Complete!</h1>
			
			<div class="score-display">
				<div class="score-circle" class:high-score={score >= 80}>
					<span class="score-value">{score}%</span>
					<span class="score-label">Score</span>
				</div>
				
				<div class="score-details">
					<p class="correct-count">{correctCount} of {TOTAL_QUESTIONS} correct</p>
					{#if score >= 80}
						<p class="encouragement">Excellent work!</p>
					{:else if score >= 60}
						<p class="encouragement">Good effort!</p>
					{:else}
						<p class="encouragement">Keep practicing!</p>
					{/if}
				</div>
			</div>
			
			<div class="completion-actions">
				<button 
					class="primary-button"
					onclick={restartSession}
					aria-label="Try again"
				>
					Try Again
				</button>
			</div>
		</div>
	{:else if question}
		<header class="exercise-header">
			<div class="header-content">
				<h1 class="exercise-title">Harmonic Recognition</h1>
				<span class="lesson-badge">Lesson 1 - Part B</span>
			</div>
			
			<div 
				class="progress-bar" 
				role="progressbar" 
				aria-valuenow={currentQuestion + 1}
				aria-valuemin="1"
				aria-valuemax={TOTAL_QUESTIONS}
				aria-label="Question progress"
			>
				<div 
					class="progress-fill"
					style="width: {((currentQuestion + 1) / TOTAL_QUESTIONS) * 100}%"
				></div>
			</div>
			
			<div class="progress-text">
				<span>Question {currentQuestion + 1} of {TOTAL_QUESTIONS}</span>
				<span>Score: {Math.round((correctCount / Math.max(1, currentQuestion + 1)) * 100)}%</span>
			</div>
		</header>
		
		<main class="exercise-content">
			<div class="question-section">
				<h2 class="question-prompt">What interval is this?</h2>
				
				<button 
					class="play-button"
					onclick={playInterval}
					disabled={isPlaying}
					aria-label={isPlaying ? 'Playing interval...' : 'Play interval'}
				>
					{#if isPlaying}
						<span class="playing-indicator">Playing...</span>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
							<path d="M8 5v14l11-7z"/>
						</svg>
						<span>Play Interval</span>
					{/if}
				</button>
				
				{#if playbackError}
					<p class="error-text">{playbackError}</p>
				{:else}
					<p class="instruction-text">Listen to the two notes played together</p>
				{/if}
			</div>
			
			{#if selectedAnswer !== null}
				<div 
					class="feedback-container"
					class:correct={isCorrect}
					class:incorrect={!isCorrect}
					role="alert"
					aria-live="polite"
				>
					{#if isCorrect}
						<span class="feedback-icon">&#10003;</span>
						<span class="feedback-text">Correct!</span>
					{:else}
						<span class="feedback-icon">&#10007;</span>
						<span class="feedback-text">
							Incorrect. The answer was {question.intervalName}.
						</span>
					{/if}
				</div>
				
				<button 
					class="continue-button"
					onclick={nextQuestion}
					aria-label="Continue to next question"
				>
					{#if currentQuestion >= TOTAL_QUESTIONS - 1}
						Finish
					{:else}
						Next Question
					{/if}
				</button>
			{:else if question}
				<div class="answer-options" role="group" aria-label="Answer options">
					{#each question.options as option}
						<button 
							class="answer-button"
							onclick={() => selectAnswer(option)}
							aria-label={`Select ${option}`}
						>
							{option}
						</button>
					{/each}
				</div>
			{/if}
		</main>
	{/if}
</div>

<style>
	.harmonic-recognition {
		min-height: 100vh;
		background: #1A1A2E;
		color: #F5E6D3;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.exercise-header {
		width: 100%;
		max-width: 600px;
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
	
	.lesson-badge {
		background: #2D1B4E;
		color: #F5E6D3;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.875rem;
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
	
	.exercise-content {
		width: 100%;
		max-width: 600px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.question-section {
		text-align: center;
		margin-bottom: 2rem;
	}
	
	.question-prompt {
		font-family: 'Playfair Display', serif;
		font-size: 1.5rem;
		color: #F5E6D3;
		margin-bottom: 1.5rem;
	}
	
	.play-button {
		background: #2D1B4E;
		border: 2px solid #D4AF37;
		color: #D4AF37;
		padding: 1.5rem 2rem;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		transition: all 0.2s ease;
		min-height: 120px;
		min-width: 120px;
	}
	
	.play-button:hover:not(:disabled) {
		background: #D4AF37;
		color: #1A1A2E;
		transform: scale(1.05);
	}
	
	.play-button:focus {
		outline: 2px solid #D4AF37;
		outline-offset: 4px;
	}
	
	.play-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
	
	.error-text {
		margin-top: 1rem;
		color: #E74C3C;
		font-size: 0.875rem;
	}
	
	.play-button svg {
		width: 48px;
		height: 48px;
	}
	
	.play-button span {
		font-size: 0.875rem;
	}
	
	.playing-indicator {
		animation: pulse 1s ease-in-out infinite;
	}
	
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}
	
	.instruction-text {
		margin-top: 1rem;
		color: #E8B4B8;
		font-size: 0.875rem;
	}
	
	.answer-options {
		display: flex;
		gap: 1rem;
		width: 100%;
		max-width: 400px;
	}
	
	.answer-button {
		flex: 1;
		background: transparent;
		border: 2px solid #D4AF37;
		color: #F5E6D3;
		padding: 1rem 1.5rem;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1.125rem;
		font-weight: 600;
		transition: all 0.2s ease;
		min-height: 60px;
	}
	
	.answer-button:hover {
		background: #D4AF37;
		color: #1A1A2E;
	}
	
	.answer-button:focus {
		outline: 2px solid #D4AF37;
		outline-offset: 2px;
	}
	
	.feedback-container {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		width: 100%;
		max-width: 400px;
	}
	
	.feedback-container.correct {
		background: rgba(46, 204, 113, 0.2);
		border: 2px solid #2ECC71;
		color: #2ECC71;
	}
	
	.feedback-container.incorrect {
		background: rgba(231, 76, 60, 0.2);
		border: 2px solid #E74C3C;
		color: #E74C3C;
	}
	
	.feedback-icon {
		font-size: 1.5rem;
		font-weight: bold;
	}
	
	.feedback-text {
		font-size: 1rem;
	}
	
	.continue-button {
		background: #D4AF37;
		border: none;
		color: #1A1A2E;
		padding: 1rem 2rem;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		transition: all 0.2s ease;
		min-height: 48px;
		min-width: 180px;
	}
	
	.continue-button:hover {
		background: #F5E6D3;
	}
	
	.continue-button:focus {
		outline: 2px solid #F5E6D3;
		outline-offset: 2px;
	}
	
	.completion-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 80vh;
		text-align: center;
	}
	
	.completion-title {
		font-family: 'Playfair Display', serif;
		font-size: 2rem;
		color: #D4AF37;
		margin-bottom: 2rem;
	}
	
	.score-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}
	
	.score-circle {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		background: #2D1B4E;
		border: 4px solid #D4AF37;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.score-circle.high-score {
		border-color: #2ECC71;
	}
	
	.score-value {
		font-size: 2.5rem;
		font-weight: bold;
		color: #F5E6D3;
	}
	
	.score-label {
		font-size: 0.875rem;
		color: #E8B4B8;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	
	.score-details {
		text-align: center;
	}
	
	.correct-count {
		font-size: 1.25rem;
		color: #F5E6D3;
		margin: 0;
	}
	
	.encouragement {
		font-size: 1rem;
		color: #E8B4B8;
		margin-top: 0.5rem;
	}
	
	.completion-actions {
		display: flex;
		gap: 1rem;
	}
	
	.primary-button {
		background: #D4AF37;
		border: none;
		color: #1A1A2E;
		padding: 1rem 2rem;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		transition: all 0.2s ease;
		min-height: 48px;
		min-width: 140px;
	}
	
	.primary-button:hover {
		background: #F5E6D3;
	}
	
	.primary-button:focus {
		outline: 2px solid #F5E6D3;
		outline-offset: 2px;
	}
</style>
