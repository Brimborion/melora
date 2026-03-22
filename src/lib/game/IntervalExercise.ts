// Interval Exercise Engine - Core logic for Unison & Octave interval recognition
// Part of Story 2-8: Level 1 - Interval Recognition (Unison & Octave)

import { toneAudioEngine } from '$lib/audio';
import { parseNote } from '$lib/audio/audioUtils';
import {
	generateIntervalQuestion,
	generateAudiationQuestion,
	checkIntervalAnswer,
	type IntervalQuestion,
	type AudiationQuestion,
} from '$lib/music/intervals';

/**
 * Result of answering a question
 */
export interface IntervalAnswerResult {
	correct: boolean;
	question: IntervalQuestion | AudiationQuestion;
	userAnswer: string;
	feedback: string;
}

/**
 * Callback type for when user answers
 */
export type AnswerCallback = (result: IntervalAnswerResult) => void;

/**
 * Callback type for exercise completion
 */
export type CompletionCallback = (score: number, correctCount: number, totalCount: number) => void;

/**
 * Interval Exercise Manager
 * Handles the logic for Unison & Octave interval recognition exercises
 */
export class IntervalExercise {
	private currentQuestion: IntervalQuestion | AudiationQuestion | null = null;
	private questionCount: number = 4;
	private currentIndex: number = 0;
	private answers: IntervalAnswerResult[] = [];
	private exerciseType: 'interval' | 'audiation' | 'harmonic' | 'melodic' = 'interval';
	private onAnswer: AnswerCallback | null = null;
	private onComplete: CompletionCallback | null = null;
	private hasPlayedCurrent: boolean = false;

	/**
	 * Initialize the exercise
	 */
	constructor(
		exerciseType: 'interval' | 'audiation' | 'harmonic' | 'melodic' = 'interval',
		questionCount: number = 4
	) {
		this.exerciseType = exerciseType;
		this.questionCount = questionCount;
	}

	/**
	 * Set callback for answer events
	 */
	setAnswerCallback(callback: AnswerCallback): void {
		this.onAnswer = callback;
	}

	/**
	 * Set callback for completion
	 */
	setCompletionCallback(callback: CompletionCallback): void {
		this.onComplete = callback;
	}

	/**
	 * Generate the first question
	 */
	generateQuestion(): IntervalQuestion | AudiationQuestion | null {
		if (this.currentIndex >= this.questionCount) {
			return null;
		}

		switch (this.exerciseType) {
			case 'audiation':
				this.currentQuestion = generateAudiationQuestion();
				break;
			case 'interval':
			case 'harmonic':
			case 'melodic':
			default:
				this.currentQuestion = generateIntervalQuestion();
				// Override playback type if specified
				if (this.exerciseType === 'harmonic' && this.currentQuestion) {
					(this.currentQuestion as IntervalQuestion).playbackType = 'harmonic';
				} else if (this.exerciseType === 'melodic' && this.currentQuestion) {
					(this.currentQuestion as IntervalQuestion).playbackType = 'melodic';
				}
				break;
		}

		this.hasPlayedCurrent = false;
		return this.currentQuestion;
	}

	/**
	 * Get the current question
	 */
	getCurrentQuestion(): IntervalQuestion | AudiationQuestion | null {
		return this.currentQuestion;
	}

	/**
	 * Play the current interval or audiation
	 */
	async playCurrent(): Promise<void> {
		if (!this.currentQuestion) return;

		// Ensure audio is ready (handles autoplay policy)
		await toneAudioEngine.ensureReady();

		if (this.currentQuestion.type === 'audiation') {
			// Audiation: play root, pause, then play target
			await this.playAudiation(this.currentQuestion);
		} else {
			// Interval: play based on playback type
			await this.playInterval(this.currentQuestion as IntervalQuestion);
		}

		this.hasPlayedCurrent = true;
	}

	/**
	 * Check if current question has been played
	 */
	getHasPlayedCurrent(): boolean {
		return this.hasPlayedCurrent;
	}

	/**
	 * Submit an answer
	 */
	submitAnswer(userAnswer: string): IntervalAnswerResult | null {
		if (!this.currentQuestion) return null;

		const isCorrect = this.currentQuestion.type === 'audiation'
			? true // Audiation is self-assessed, always correct
			: checkIntervalAnswer(this.currentQuestion as IntervalQuestion, userAnswer);

		const feedback = this.generateFeedback(this.currentQuestion as IntervalQuestion, userAnswer, isCorrect);

		const result: IntervalAnswerResult = {
			correct: isCorrect,
			question: this.currentQuestion,
			userAnswer,
			feedback,
		};

		this.answers.push(result);
		this.currentIndex++;

		// Notify callback
		if (this.onAnswer) {
			this.onAnswer(result);
		}

		// Check for completion
		if (this.currentIndex >= this.questionCount) {
			this.complete();
		}

		return result;
	}

	/**
	 * Get current progress
	 */
	getProgress(): number {
		return Math.round((this.currentIndex / this.questionCount) * 100);
	}

	/**
	 * Get current index
	 */
	getCurrentIndex(): number {
		return this.currentIndex;
	}

	/**
	 * Get total questions
	 */
	getTotalQuestions(): number {
		return this.questionCount;
	}

	/**
	 * Get current score
	 */
	getScore(): number {
		if (this.answers.length === 0) return 0;
		const correctCount = this.answers.filter(a => a.correct).length;
		return Math.round((correctCount / this.answers.length) * 100);
	}

	/**
	 * Get correct answer count
	 */
	getCorrectCount(): number {
		return this.answers.filter(a => a.correct).length;
	}

	/**
	 * Check if exercise is complete
	 */
	isComplete(): boolean {
		return this.currentIndex >= this.questionCount;
	}

	/**
	 * Get answer history
	 */
	getAnswerHistory(): IntervalAnswerResult[] {
		return this.answers;
	}

	/**
	 * Reset the exercise
	 */
	reset(): void {
		this.currentQuestion = null;
		this.currentIndex = 0;
		this.answers = [];
		this.hasPlayedCurrent = false;
	}

	/**
	 * Complete the exercise and notify callback
	 */
	private complete(): void {
		if (this.onComplete) {
			this.onComplete(this.getScore(), this.getCorrectCount(), this.questionCount);
		}
	}

	/**
	 * Play an interval (harmonic or melodic)
	 */
	private async playInterval(question: IntervalQuestion): Promise<void> {
		const { rootNote, targetNote, playbackType } = question;

		// Parse note strings into Note objects
		const root = parseNote(rootNote);
		const target = parseNote(targetNote);
		
		if (!root || !target) {
			console.error('Failed to parse notes:', rootNote, targetNote);
			return;
		}

		if (playbackType === 'harmonic') {
			// Both notes play together
			await toneAudioEngine.playChord([root, target]);
		} else {
			// Melodic: notes play successively
			await toneAudioEngine.playInterval(root, target, 500);
		}
	}

	/**
	 * Play an audiation prompt
	 */
	private async playAudiation(question: AudiationQuestion): Promise<void> {
		const { rootNote, targetNote } = question;

		// Parse note strings into Note objects
		const root = parseNote(rootNote);
		const target = parseNote(targetNote);
		
		if (!root || !target) {
			console.error('Failed to parse notes:', rootNote, targetNote);
			return;
		}

		// Step 1: Play reference note
		await toneAudioEngine.playNote(root);

		// Step 2: Pause for user to imagine (2.5 seconds)
		await new Promise(resolve => setTimeout(resolve, 2500));

		// Step 3: Play target for confirmation
		await toneAudioEngine.playNote(target);
	}

	/**
	 * Generate feedback for an answer
	 */
	private generateFeedback(question: IntervalQuestion, userAnswer: string, isCorrect: boolean): string {
		if (isCorrect) {
			if (question.intervalName === 'Unison') {
				return "Excellent! That's Unison - two notes at exactly the same pitch.";
			} else {
				return "Excellent! That's an Octave - the same note one register higher.";
			}
		} else {
			if (question.intervalName === 'Unison') {
				return `Good try! The answer was Unison. Unison means both notes are at the same pitch - "${question.rootNote}" is the same as "${question.targetNote}".`;
			} else {
				return `Good try! The answer was Octave. The Octave is the same note one register higher - "${question.rootNote}" becomes "${question.targetNote}".`;
			}
		}
	}
}

/**
 * Create an interval exercise
 */
export function createIntervalExercise(
	exerciseType: 'interval' | 'audiation' | 'harmonic' | 'melodic' = 'interval',
	questionCount: number = 4
): IntervalExercise {
	return new IntervalExercise(exerciseType, questionCount);
}
