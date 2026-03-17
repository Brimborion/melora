// Exercise Engine - Core exercise logic and scoring
// Handles exercise state transitions, scoring, and completion

import { db } from '$lib/db/database';
import type { Level, ScoreRecord, ExerciseType } from '$lib/types/game';
import { getRandomInterval, getIntervalOptions } from '$lib/music/theory';

/**
 * Default number of questions per exercise
 */
const DEFAULT_QUESTION_COUNT = 4;

/**
 * Completion threshold for considering an exercise passed
 */
const COMPLETION_THRESHOLD = 70;

/**
 * Interface for exercise questions
 */
export interface ExerciseQuestion {
	id: string;
	type: ExerciseType;
	correctAnswer: string;
	options: string[];
	answered?: boolean;
	wasCorrect?: boolean;
}

/**
 * Detailed answer record for explanations
 */
export interface AnswerRecord {
	questionId: string;
	correctAnswer: string;
	userAnswer: string;
	wasCorrect: boolean;
	answeredAt: Date;
}

/**
 * ExerciseEngine - Manages exercise execution and scoring
 */
export class ExerciseEngine {
	private level: Level | null = null;
	private questionIndex: number = 0;
	private answers: Array<{ correct: boolean; answeredAt: Date }> = [];
	private answerHistory: AnswerRecord[] = []; // Detailed answers for explanations
	private startTime: Date | null = null;
	private questions: ExerciseQuestion[] = [];
	private seenAnswerCombinations: Set<string> = new Set();

	/**
	 * Initialize the engine with a level
	 */
	async initialize(level: Level): Promise<void> {
		this.level = level;
		this.questionIndex = 0;
		this.answers = [];
		this.startTime = new Date();
	}

	/**
	 * Get the current level
	 */
	getLevel(): Level | null {
		return this.level;
	}

	/**
	 * Get the current question index (0-based)
	 */
	getCurrentQuestionIndex(): number {
		return this.questionIndex;
	}

	/**
	 * Get total number of questions
	 */
	getTotalQuestions(): number {
		return this.level?.questionCount ?? DEFAULT_QUESTION_COUNT;
	}

	/**
	 * Get current progress (0-100)
	 */
	getProgress(): number {
		const total = this.getTotalQuestions();
		return Math.round((this.answers.length / total) * 100);
	}

	/**
	 * Check if exercise is complete
	 */
	isComplete(): boolean {
		return this.answers.length >= this.getTotalQuestions();
	}

	/**
	 * Get number of correct answers
	 */
	getCorrectCount(): number {
		return this.answers.filter(a => a.correct).length;
	}

	/**
	 * Calculate and return current score (0-100)
	 */
	getScore(): number {
		if (this.answers.length === 0) return 0;
		return Math.round((this.getCorrectCount() / this.answers.length) * 100);
	}

	/**
	 * Submit an answer
	 * @param correct - Whether the answer was correct
	 * @param userAnswer - The user's answer (optional, defaults to empty string)
	 */
	submitAnswer(correct: boolean, userAnswer: string = ''): void {
		const currentQuestion = this.getCurrentQuestion();
		
		// Record basic answer
		this.answers.push({
			correct,
			answeredAt: new Date()
		});
		
		// Record detailed answer for explanations
		if (currentQuestion) {
			this.answerHistory.push({
				questionId: currentQuestion.id,
				correctAnswer: currentQuestion.correctAnswer,
				userAnswer: userAnswer || currentQuestion.correctAnswer,
				wasCorrect: correct,
				answeredAt: new Date()
			});
			
			// Mark question as answered
			currentQuestion.answered = true;
			currentQuestion.wasCorrect = correct;
		}
	}

	/**
	 * Get answer history for explanations
	 */
	getAnswerHistory(): AnswerRecord[] {
		return this.answerHistory;
	}

	/**
	 * Move to next question
	 */
	nextQuestion(): void {
		if (this.questionIndex < this.getTotalQuestions() - 1) {
			this.questionIndex++;
		}
	}

	/**
	 * Reset the engine
	 */
	reset(): void {
		this.level = null;
		this.questionIndex = 0;
		this.answers = [];
		this.answerHistory = [];
		this.startTime = null;
		this.questions = [];
		this.seenAnswerCombinations = new Set();
	}

	/**
	 * Generate a unique key for a question based on its content
	 */
	private generateQuestionKey(correctAnswer: string, options: string[]): string {
		// Create a deterministic key from the correct answer and sorted options
		const sortedOptions = [...options].sort().join(',');
		return `${correctAnswer}:${sortedOptions}`;
	}

	/**
	 * Generate new random questions for replay
	 * Ensures no duplicate questions in the session
	 */
	private generateNewQuestions(exerciseType: ExerciseType, count: number): ExerciseQuestion[] {
		const questions: ExerciseQuestion[] = [];
		const type = exerciseType || 'interval-identification';
		
		for (let i = 0; i < count; i++) {
			let question: ExerciseQuestion;
			let attempts = 0;
			
			// Generate unique question (avoid repeats based on answer content)
			do {
				const correctAnswer = getRandomInterval();
				const options = getIntervalOptions();
				const questionKey = this.generateQuestionKey(correctAnswer, options);
				
				question = {
					id: crypto.randomUUID(),
					type,
					correctAnswer,
					options,
					answered: false,
					wasCorrect: false
				};
				attempts++;
			} while (this.seenAnswerCombinations.has(this.generateQuestionKey(question.correctAnswer, question.options)) && attempts < 10);
			
			// Add to seen combinations
			this.seenAnswerCombinations.add(this.generateQuestionKey(question.correctAnswer, question.options));
			questions.push(question);
		}
		
		return questions;
	}

	/**
	 * Reset exercise with new random questions (for replay functionality)
	 * Maintains the same level and exercise type but generates new questions
	 */
	async resetExercise(questionCount: number = DEFAULT_QUESTION_COUNT): Promise<void> {
		if (!this.level) {
			throw new Error('No level loaded - cannot reset exercise');
		}
		
		// Generate completely new questions
		this.questions = this.generateNewQuestions(
			this.level.exerciseType,
			questionCount || this.level.questionCount || DEFAULT_QUESTION_COUNT
		);
		
		// Reset all state but keep the level
		this.questionIndex = 0;
		this.answers = [];
		this.answerHistory = []; // Clear answer history for new attempt
		this.startTime = new Date();
	}

	/**
	 * Get current questions
	 */
	getQuestions(): ExerciseQuestion[] {
		return this.questions;
	}

	/**
	 * Get current question
	 */
	getCurrentQuestion(): ExerciseQuestion | null {
		return this.questions[this.questionIndex] || null;
	}

	/**
	 * Check if exercise was passed (score >= threshold)
	 */
	hasPassed(): boolean {
		return this.getScore() >= COMPLETION_THRESHOLD;
	}

	/**
	 * Get elapsed time in milliseconds
	 */
	getElapsedMs(): number {
		if (!this.startTime) return 0;
		return Date.now() - this.startTime.getTime();
	}

	/**
	 * Save the exercise result to the database
	 */
	async saveResult(): Promise<void> {
		if (!this.level) {
			throw new Error('No level loaded');
		}

		const score = this.getScore();
		const correctCount = this.getCorrectCount();
		const totalQuestions = this.getTotalQuestions();

		// Create session record
		const session: ScoreRecord = {
			levelId: this.level.id,
			score,
			correctAnswers: correctCount,
			totalQuestions,
			percentage: score,
			difficulty: this.level.difficulty,
			completedAt: new Date()
		};

		// Save to database
		await db.sessions.add({
			levelId: this.level.id,
			startedAt: this.startTime!,
			endedAt: new Date(),
			score,
			correctAnswers: correctCount,
			totalQuestions,
			completed: true
		});

		// Update or create progress record
		const existingProgress = await db.progress.where('levelId').equals(this.level.id).first();

		if (existingProgress) {
			// Update existing progress if this score is better
			if (score > existingProgress.bestScore) {
				await db.progress.update(existingProgress.id!, {
					bestScore: score,
					completed: score >= COMPLETION_THRESHOLD,
					completedAt: score >= COMPLETION_THRESHOLD ? new Date() : undefined,
					attempts: existingProgress.attempts + 1,
					updatedAt: new Date()
				});
			} else {
				// Just increment attempts
				await db.progress.update(existingProgress.id!, {
					attempts: existingProgress.attempts + 1,
					updatedAt: new Date()
				});
			}
		} else {
			// Create new progress record
			await db.progress.add({
				levelId: this.level.id,
				completed: score >= COMPLETION_THRESHOLD,
				bestScore: score,
				attempts: 1,
				completedAt: score >= COMPLETION_THRESHOLD ? new Date() : undefined,
				updatedAt: new Date()
			});
		}
	}
}

// Export singleton instance
export const exerciseEngine = new ExerciseEngine();
