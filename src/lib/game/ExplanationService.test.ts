// Unit tests for ExplanationService
import { describe, it, expect } from 'vitest';
import {
	getExplanation,
	getExplanations,
	getIncorrectAnswerExplanations
} from './ExplanationService';

describe('ExplanationService', () => {
	describe('getExplanation', () => {
		it('should return correct explanation for correct interval answer', () => {
			const explanation = getExplanation(
				'interval-identification',
				'major3',
				'major3',
				true,
				100
			);

			expect(explanation.wasCorrect).toBe(true);
			expect(explanation.correctAnswer).toBe('Major3');
			expect(explanation.description).toBeTruthy();
			expect(explanation.musicalContext).toBeTruthy();
			expect(explanation.encouragingNote).toBeTruthy();
			expect(explanation.relatedLevels).toEqual(['2-8', '2-9', '2-10']);
		});

		it('should return encouraging note for correct answer', () => {
			const explanation = getExplanation(
				'interval-identification',
				'perfect5',
				'perfect5',
				true,
				100
			);

			expect(explanation.wasCorrect).toBe(true);
			// The encouraging note is randomly selected from a set of positive messages
			expect(explanation.encouragingNote.length).toBeGreaterThan(0);
		});

		it('should return correct explanation for incorrect interval answer', () => {
			const explanation = getExplanation(
				'interval-identification',
				'major3',
				'minor3',
				false,
				50
			);

			expect(explanation.wasCorrect).toBe(false);
			expect(explanation.correctAnswer).toBe('Major3');
			expect(explanation.description).toBeTruthy();
		});

		it('should return encouraging note for incorrect answer with good score', () => {
			const explanation = getExplanation(
				'interval-identification',
				'perfect5',
				'perfect4',
				false,
				75
			);

			expect(explanation.wasCorrect).toBe(false);
			// Should have encouraging note for score >= 70
			expect(explanation.encouragingNote).toBeTruthy();
		});

		it('should return encouraging note for incorrect answer with low score', () => {
			const explanation = getExplanation(
				'interval-identification',
				'perfect5',
				'perfect4',
				false,
				25
			);

			expect(explanation.wasCorrect).toBe(false);
			// Should have encouraging note for score < 50
			expect(explanation.encouragingNote).toBeTruthy();
		});

		it('should return chord explanation for chord exercise type', () => {
			const explanation = getExplanation(
				'chord-identification',
				'major',
				'minor',
				false,
				50
			);

			expect(explanation.exerciseType).toBe('chord-identification');
			expect(explanation.description).toBeTruthy();
			expect(explanation.musicalContext).toBeTruthy();
		});

		it('should return default explanation for unknown exercise type', () => {
			const explanation = getExplanation(
				'pitch-comparison',
				'answer1',
				'answer2',
				false,
				50
			);

			expect(explanation.description).toBeTruthy();
			expect(explanation.encouragingNote).toBeTruthy();
		});

		it('should generate unique IDs for each explanation', () => {
			const explanation1 = getExplanation('interval-identification', 'major3', 'major3', true, 100);
			const explanation2 = getExplanation('interval-identification', 'major3', 'major3', true, 100);

			expect(explanation1.id).not.toBe(explanation2.id);
		});
	});

	describe('getExplanations', () => {
		it('should return explanations for multiple answers', () => {
			const answers = [
				{ correctAnswer: 'major3', userAnswer: 'major3', wasCorrect: true },
				{ correctAnswer: 'perfect5', userAnswer: 'perfect4', wasCorrect: false }
			];

			const explanations = getExplanations(answers, 'interval-identification', 50);

			expect(explanations).toHaveLength(2);
			expect(explanations[0].wasCorrect).toBe(true);
			expect(explanations[1].wasCorrect).toBe(false);
		});

		it('should handle empty answers array', () => {
			const explanations = getExplanations([], 'interval-identification', 100);

			expect(explanations).toHaveLength(0);
		});
	});

	describe('getIncorrectAnswerExplanations', () => {
		it('should return explanations only for incorrect answers', () => {
			const answers = [
				{ correctAnswer: 'major3', userAnswer: 'major3', wasCorrect: true },
				{ correctAnswer: 'perfect5', userAnswer: 'perfect4', wasCorrect: false },
				{ correctAnswer: 'minor3', userAnswer: 'minor3', wasCorrect: true },
				{ correctAnswer: 'octave', userAnswer: 'major6', wasCorrect: false }
			];

			const explanations = getIncorrectAnswerExplanations(answers, 'interval-identification', 50);

			expect(explanations).toHaveLength(2);
			expect(explanations.every(e => !e.wasCorrect)).toBe(true);
		});

		it('should return empty array when all answers are correct', () => {
			const answers = [
				{ correctAnswer: 'major3', userAnswer: 'major3', wasCorrect: true },
				{ correctAnswer: 'perfect5', userAnswer: 'perfect5', wasCorrect: true }
			];

			const explanations = getIncorrectAnswerExplanations(answers, 'interval-identification', 100);

			expect(explanations).toHaveLength(0);
		});

		it('should handle empty answers array', () => {
			const explanations = getIncorrectAnswerExplanations([], 'interval-identification', 100);

			expect(explanations).toHaveLength(0);
		});
	});
});
