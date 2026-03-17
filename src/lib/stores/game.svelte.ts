// Game store using Svelte 5 runes
// This follows the architecture requirement: Svelte 5 runes ($state, $derived, $effect)

import type { GameState, Level, Question } from '$lib/types';

// Create a singleton game store using Svelte 5 runes
function createGameStore() {
	// State
	let currentLevel = $state<Level | null>(null);
	let questions = $state<Question[]>([]);
	let currentQuestionIndex = $state(0);
	let score = $state(0);
	let streak = $state(0);
	let correctAnswers = $state(0);
	let totalQuestions = $state(0);
	let isActive = $state(false);
	let startTime = $state<Date | null>(null);
	let answers = $state<{ correct: boolean; timeMs: number }[]>([]);

	// Derived state
	let currentQuestion = $derived<Question | null>(
		questions.length > 0 && currentQuestionIndex < questions.length 
			? questions[currentQuestionIndex] 
			: null
	);

	let progress = $derived(
		totalQuestions > 0 ? (currentQuestionIndex / totalQuestions) * 100 : 0
	);

	let averageResponseTime = $derived(() => {
		if (answers.length === 0) return 0;
		const total = answers.reduce((sum, a) => sum + a.timeMs, 0);
		return total / answers.length;
	});

	// Actions
	function startGame(level: Level, questionList: Question[]) {
		currentLevel = level;
		questions = questionList;
		currentQuestionIndex = 0;
		score = 0;
		streak = 0;
		correctAnswers = 0;
		totalQuestions = questionList.length;
		isActive = true;
		startTime = new Date();
		answers = [];
	}

	function answerQuestion(isCorrect: boolean, responseTimeMs: number) {
		answers = [...answers, { correct: isCorrect, timeMs: responseTimeMs }];
		
		if (isCorrect) {
			correctAnswers += 1;
			streak += 1;
			// Simple scoring - 100 points per correct answer + streak bonus
			const streakBonus = Math.min(streak * 10, 50);
			score += 100 + streakBonus;
		} else {
			streak = 0;
		}
	}

	function nextQuestion() {
		if (currentQuestionIndex < totalQuestions - 1) {
			currentQuestionIndex += 1;
		} else {
			endGame();
		}
	}

	function endGame() {
		isActive = false;
	}

	function reset() {
		currentLevel = null;
		questions = [];
		currentQuestionIndex = 0;
		score = 0;
		streak = 0;
		correctAnswers = 0;
		totalQuestions = 0;
		isActive = false;
		startTime = null;
		answers = [];
	}

	return {
		// Getters
		get currentLevel() { return currentLevel; },
		get questions() { return questions; },
		get currentQuestionIndex() { return currentQuestionIndex; },
		get score() { return score; },
		get streak() { return streak; },
		get correctAnswers() { return correctAnswers; },
		get totalQuestions() { return totalQuestions; },
		get isActive() { return isActive; },
		get startTime() { return startTime; },
		
		// Derived getters
		get currentQuestion() { return currentQuestion; },
		get progress() { return progress; },
		get averageResponseTime() { return averageResponseTime(); },
		
		// Actions
		startGame,
		answerQuestion,
		nextQuestion,
		endGame,
		reset
	};
}

// Export singleton instance
export const gameStore = createGameStore();
