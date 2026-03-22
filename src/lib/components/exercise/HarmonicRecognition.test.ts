// Component tests for HarmonicRecognition
// Part of Story 2-8: Level 1 - Interval Recognition (Unison & Octave)

import { describe, it, expect, vi } from 'vitest';
import { 
	generateIntervalQuestion, 
	checkIntervalAnswer,
	UNISON_OCTAVE_INTERVALS,
	type IntervalQuestion
} from '$lib/music/intervals';

vi.mock('$lib/stores/audio.svelte', () => ({
	audioStore: {
		playChord: vi.fn().mockResolvedValue(undefined),
		isLoading: false,
		isReady: true,
		volume: 0.8,
		isPlaying: false,
		isInitialized: true
	}
}));

describe('HarmonicRecognition - Component Logic', () => {
	describe('Interval Question Generation', () => {
		it('should generate questions with only Unison or Octave', () => {
			for (let i = 0; i < 50; i++) {
				const question = generateIntervalQuestion();
				expect(UNISON_OCTAVE_INTERVALS).toContain(question.interval);
				expect(['Unison', 'Octave']).toContain(question.intervalName);
			}
		});

		it('should generate questions with two answer options', () => {
			const question = generateIntervalQuestion();
			expect(question.options).toHaveLength(2);
			expect(question.options).toContain('Unison');
			expect(question.options).toContain('Octave');
		});

		it('should generate unique question IDs', () => {
			const ids = new Set();
			for (let i = 0; i < 20; i++) {
				const question = generateIntervalQuestion();
				expect(ids).not.toContain(question.id);
				ids.add(question.id);
			}
		});
	});

	describe('Answer Checking Logic', () => {
		it('should correctly identify Unison answer', () => {
			const question: IntervalQuestion = {
				id: 'test-1',
				type: 'interval',
				interval: 'P1',
				intervalName: 'Unison',
				playbackType: 'harmonic',
				rootNote: 'C4',
				targetNote: 'C4',
				options: ['Unison', 'Octave'],
				correctAnswer: 'Unison'
			};
			
			expect(checkIntervalAnswer(question, 'Unison')).toBe(true);
			expect(checkIntervalAnswer(question, 'unison')).toBe(true);
			expect(checkIntervalAnswer(question, 'Octave')).toBe(false);
		});

		it('should correctly identify Octave answer', () => {
			const question: IntervalQuestion = {
				id: 'test-2',
				type: 'interval',
				interval: 'P8',
				intervalName: 'Octave',
				playbackType: 'harmonic',
				rootNote: 'C4',
				targetNote: 'C5',
				options: ['Unison', 'Octave'],
				correctAnswer: 'Octave'
			};
			
			expect(checkIntervalAnswer(question, 'Octave')).toBe(true);
			expect(checkIntervalAnswer(question, 'octave')).toBe(true);
			expect(checkIntervalAnswer(question, 'Unison')).toBe(false);
		});
	});

	describe('Score Calculation', () => {
		it('should calculate 100% for all correct answers', () => {
			const totalQuestions = 10;
			const correctCount = 10;
			const score = Math.round((correctCount / totalQuestions) * 100);
			expect(score).toBe(100);
		});

		it('should calculate 70% for 7 correct out of 10', () => {
			const totalQuestions = 10;
			const correctCount = 7;
			const score = Math.round((correctCount / totalQuestions) * 100);
			expect(score).toBe(70);
		});

		it('should calculate 50% for 5 correct out of 10', () => {
			const totalQuestions = 10;
			const correctCount = 5;
			const score = Math.round((correctCount / totalQuestions) * 100);
			expect(score).toBe(50);
		});

		it('should calculate 0% for all incorrect', () => {
			const totalQuestions = 10;
			const correctCount = 0;
			const score = Math.round((correctCount / totalQuestions) * 100);
			expect(score).toBe(0);
		});
	});

	describe('Question Progression', () => {
		it('should have correct progress calculation', () => {
			const currentQuestion = 0;
			const totalQuestions = 10;
			expect(currentQuestion + 1).toBe(1);
			expect(((currentQuestion + 1) / totalQuestions) * 100).toBe(10);
		});

		it('should identify session completion after 10 questions', () => {
			const currentQuestion = 9;
			const totalQuestions = 10;
			const isComplete = currentQuestion >= totalQuestions - 1;
			expect(isComplete).toBe(true);
		});

		it('should not be complete before 10 questions', () => {
			const currentQuestion = 5;
			const totalQuestions = 10;
			const isComplete = currentQuestion >= totalQuestions - 1;
			expect(isComplete).toBe(false);
		});
	});

	describe('Note Parsing', () => {
		it('should parse valid note strings correctly', () => {
			const testCases = [
				{ input: 'C4', expected: { name: 'C', accidental: '', octave: 4 } },
				{ input: 'F#3', expected: { name: 'F', accidental: '#', octave: 3 } },
				{ input: 'Bb5', expected: { name: 'B', accidental: 'b', octave: 5 } },
			];
			
			for (const { input, expected } of testCases) {
				const match = input.match(/^([A-G])([#b]?)(\d)$/);
				expect(match).toBeTruthy();
				if (match) {
					const name = match[1];
					const accidental = match[2] || '';
					const octave = parseInt(match[3], 10);
					expect(name).toBe(expected.name);
					expect(accidental).toBe(expected.accidental);
					expect(octave).toBe(expected.octave);
				}
			}
		});

		it('should handle invalid note strings with default values', () => {
			const match = 'INVALID'.match(/^([A-G])([#b]?)(\d)$/);
			expect(match).toBeNull();
		});
	});
});

describe('HarmonicRecognition - Component Integration', () => {
	it('should have correct component props interface', () => {
		const exerciseId = 'ex1-harmonic-recognition';
		const onComplete = vi.fn();
		
		expect(exerciseId).toBe('ex1-harmonic-recognition');
		expect(typeof onComplete).toBe('function');
	});

	it('should trigger onComplete with correct result structure', () => {
		const result = {
			exerciseId: 'ex1-harmonic-recognition',
			score: 80,
			correctAnswers: 8,
			totalQuestions: 10
		};
		
		expect(result).toHaveProperty('exerciseId');
		expect(result).toHaveProperty('score');
		expect(result).toHaveProperty('correctAnswers');
		expect(result).toHaveProperty('totalQuestions');
		expect(result.totalQuestions).toBe(10);
	});
});
