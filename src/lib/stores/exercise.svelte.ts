// Exercise session store using Svelte 5 runes
// Manages the current exercise session state

import type { Level } from '$lib/types/game';
import { db } from '$lib/db/database';

/**
 * Default number of questions per exercise
 */
const DEFAULT_QUESTION_COUNT = 4;

/**
 * Answer types
 */
export type AnswerType = 'correct' | 'wrong';

/**
 * Answer submission
 */
export interface Answer {
	type: AnswerType;
	answeredAt: Date;
}

/**
 * Exercise session state using Svelte 5 runes
 */
export interface ExerciseSessionState {
	// Getters
	get currentExercise(): Level | null;
	get currentQuestionIndex(): number;
	get totalQuestions(): number;
	get answers(): Answer[];
	get correctAnswers(): number;
	get score(): number;
	get isComplete(): boolean;
	get isLoading(): boolean;
	get hasStarted(): boolean;
	get isPaused(): boolean;
	get pausedAt(): number | null;
	get elapsedTime(): number;
	
	// Actions
	loadExercise(level: Level): Promise<void>;
	submitAnswer(answer: AnswerType): void;
	reset(): Promise<void>;
	nextQuestion(): void;
	pause(): Promise<void>;
	resume(): Promise<boolean>;
	getCurrentElapsedTime(): number;
}

/**
 * Create the exercise session store
 * Manages state for a single exercise session
 */
export function createExerciseSessionStore(): ExerciseSessionState {
	// State using Svelte 5 runes
	let currentExercise = $state<Level | null>(null);
	let currentQuestionIndex = $state(0);
	let answers = $state<Answer[]>([]);
	let isLoading = $state(false);
	let startTime = $state<Date | null>(null);
	
	// Pause state
	let isPaused = $state(false);
	let pausedAt = $state<number | null>(null);
	let savedElapsedTime = $state(0);
	
	// Get current elapsed time (updates on each call)
	function getCurrentElapsedTime(): number {
		if (!startTime || isPaused) {
			return savedElapsedTime;
		}
		return Date.now() - startTime.getTime();
	}
	
	// Load exercise into session
	async function loadExercise(level: Level): Promise<void> {
		isLoading = true;
		
		// Simulate async loading (for audio preloading etc.)
		// In a real implementation, this would load exercise-specific data
		await new Promise(resolve => setTimeout(resolve, 50));
		
		currentExercise = level;
		currentQuestionIndex = 0;
		answers = [];
		startTime = new Date();
		savedElapsedTime = 0;
		isPaused = false;
		pausedAt = null;
		
		// Check for cross-session resume (persisted pause state)
		try {
			const persistedSession = await db.exerciseSessions
				.where('levelId')
				.equals(level.id)
				.first();
			
			if (persistedSession) {
				// Restore persisted state for cross-session resume
				currentQuestionIndex = persistedSession.questionIndex;
				answers = persistedSession.answers;
				savedElapsedTime = persistedSession.elapsedTime;
				startTime = new Date(Date.now() - persistedSession.elapsedTime);
				isPaused = true;
				pausedAt = persistedSession.questionIndex;
			}
		} catch (error) {
			console.warn('Could not load persisted session:', error);
		}
		
		isLoading = false;
	}
	
	// Submit an answer
	function submitAnswer(answer: AnswerType): void {
		if (!currentExercise || isPaused) return;
		
		answers = [...answers, {
			type: answer,
			answeredAt: new Date()
		}];
	}
	
	// Move to next question
	function nextQuestion(): void {
		if (!currentExercise || isPaused) return;
		
		const total = currentExercise.questionCount ?? DEFAULT_QUESTION_COUNT;
		if (currentQuestionIndex < total - 1) {
			currentQuestionIndex++;
		}
	}
	
	// Reset the session
	async function reset(): Promise<void> {
		const levelId = currentExercise?.id;
		
		currentExercise = null;
		currentQuestionIndex = 0;
		answers = [];
		startTime = null;
		isLoading = false;
		isPaused = false;
		pausedAt = null;
		savedElapsedTime = 0;
		
		// Clear persisted session from IndexedDB
		if (levelId) {
			try {
				await db.exerciseSessions.where('levelId').equals(levelId).delete();
			} catch (error) {
				console.warn('Could not clear persisted session:', error);
			}
		}
	}
	
	// Pause the exercise and persist state
	async function pause(): Promise<void> {
		if (!currentExercise || isPaused) return;
		
		// Calculate elapsed time
		if (startTime) {
			savedElapsedTime = Date.now() - startTime.getTime();
		}
		
		// Save state to IndexedDB
		await db.exerciseSessions.put({
			levelId: currentExercise.id,
			questionIndex: currentQuestionIndex,
			answers: answers,
			elapsedTime: savedElapsedTime,
			pausedAt: new Date(),
			updatedAt: new Date()
		});
		
		isPaused = true;
		pausedAt = currentQuestionIndex;
	}
	
	// Resume from persisted state
	async function resume(): Promise<boolean> {
		if (!currentExercise || !isPaused) return false;
		
		try {
			// Load persisted state from IndexedDB
			const session = await db.exerciseSessions
				.where('levelId')
				.equals(currentExercise.id)
				.first();
			
			if (session) {
				currentQuestionIndex = session.questionIndex;
				answers = session.answers;
				savedElapsedTime = session.elapsedTime;
				
				// Update start time to account for elapsed time
				startTime = new Date(Date.now() - session.elapsedTime);
			}
			
			isPaused = false;
			pausedAt = null;
			
			// Keep the persisted session for cross-session resume
			// Only clear when exercise is completed or explicitly exited
			
			return true;
		} catch (error) {
			console.error('Error resuming exercise:', error);
			// Still try to resume even if DB load fails
			isPaused = false;
			pausedAt = null;
			return false;
		}
	}
	
	// Derived: Total questions
	let totalQuestions = $derived(
		currentExercise?.questionCount ?? DEFAULT_QUESTION_COUNT
	);
	
	// Derived: Number of correct answers
	let correctAnswers = $derived(
		answers.filter(a => a.type === 'correct').length
	);
	
	// Derived: Score percentage (0-100)
	let score = $derived.by(() => {
		if (answers.length === 0) return 0;
		return Math.round((correctAnswers / answers.length) * 100);
	});
	
	// Derived: Check if exercise is complete
	let isComplete = $derived(
		currentExercise !== null && answers.length >= totalQuestions
	);
	
	// Derived: Check if session has started
	let hasStarted = $derived(
		currentExercise !== null && answers.length > 0
	);
	
	// Elapsed time - computed dynamically when accessed
	let elapsedTime = $derived(getCurrentElapsedTime());
	
	return {
		// Getters
		get currentExercise() { return currentExercise; },
		get currentQuestionIndex() { return currentQuestionIndex; },
		get totalQuestions() { return totalQuestions; },
		get answers() { return answers; },
		get correctAnswers() { return correctAnswers; },
		get score() { return score; },
		get isComplete() { return isComplete; },
		get isLoading() { return isLoading; },
		get hasStarted() { return hasStarted; },
		get isPaused() { return isPaused; },
		get pausedAt() { return pausedAt; },
		get elapsedTime() { return elapsedTime; },
		
		// Actions
		loadExercise,
		submitAnswer,
		reset,
		nextQuestion,
		pause,
		resume,
		getCurrentElapsedTime
	};
}

// Export singleton instance
export const exerciseStore = createExerciseSessionStore();
