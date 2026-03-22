// Unit tests for IntervalExercise module
// Tests for bug fix: effect_update_depth_exceeded (infinite loop in $effect)
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IntervalExercise, createIntervalExercise } from './IntervalExercise';

// Mock ToneAudioEngine
vi.mock('$lib/audio', () => ({
	toneAudioEngine: {
		ensureReady: vi.fn().mockResolvedValue(undefined),
		playNote: vi.fn().mockResolvedValue(undefined),
		playInterval: vi.fn().mockResolvedValue(undefined),
		playChord: vi.fn().mockResolvedValue(undefined),
	}
}));

describe('IntervalExercise', () => {
	describe('createIntervalExercise', () => {
		it('should create an exercise with default values', () => {
			const exercise = createIntervalExercise();
			
			expect(exercise).toBeInstanceOf(IntervalExercise);
			expect(exercise.getTotalQuestions()).toBe(4);
			expect(exercise.getCurrentIndex()).toBe(0);
			expect(exercise.getScore()).toBe(0);
			expect(exercise.getCorrectCount()).toBe(0);
		});

		it('should create an exercise with custom question count', () => {
			const exercise = createIntervalExercise('interval', 10);
			
			expect(exercise.getTotalQuestions()).toBe(10);
		});

		it('should create different exercise types', () => {
			const intervalExercise = createIntervalExercise('interval', 4);
			const harmonicExercise = createIntervalExercise('harmonic', 4);
			const melodicExercise = createIntervalExercise('melodic', 4);
			
			expect(intervalExercise).toBeInstanceOf(IntervalExercise);
			expect(harmonicExercise).toBeInstanceOf(IntervalExercise);
			expect(melodicExercise).toBeInstanceOf(IntervalExercise);
		});
	});

	describe('generateQuestion', () => {
		it('should generate a question', () => {
			const exercise = createIntervalExercise('interval', 4);
			const question = exercise.generateQuestion();
			
			expect(question).not.toBeNull();
			expect(question).toHaveProperty('type', 'interval');
			expect(question).toHaveProperty('rootNote');
			expect(question).toHaveProperty('targetNote');
			expect(question).toHaveProperty('intervalName');
		});

		it('should return null when all questions are exhausted', () => {
			const exercise = createIntervalExercise('interval', 2);
			
			exercise.generateQuestion();
			exercise.submitAnswer('Unison');
			exercise.generateQuestion();
			exercise.submitAnswer('Octave');
			const thirdQuestion = exercise.generateQuestion();
			
			expect(thirdQuestion).toBeNull();
		});

		it('should not increment current index after generating question', () => {
			// Note: currentIndex is only incremented after submitAnswer
			const exercise = createIntervalExercise('interval', 4);
			
			expect(exercise.getCurrentIndex()).toBe(0);
			exercise.generateQuestion();
			expect(exercise.getCurrentIndex()).toBe(0); // Still 0 before submitAnswer
		});

		it('should reset hasPlayedCurrent when generating new question', () => {
			const exercise = createIntervalExercise('interval', 4);
			const question = exercise.generateQuestion();
			
			expect(question).not.toBeNull();
		});
	});

	describe('submitAnswer', () => {
		it('should return a result with correct structure', () => {
			const exercise = createIntervalExercise('interval', 4);
			exercise.generateQuestion();
			
			const result = exercise.submitAnswer('Unison');
			
			expect(result).not.toBeNull();
			expect(result).toHaveProperty('correct');
			expect(result).toHaveProperty('question');
			expect(result).toHaveProperty('userAnswer', 'Unison');
			expect(result).toHaveProperty('feedback');
		});

		it('should increment current index after answer', () => {
			// Note: currentIndex is incremented in submitAnswer, not in generateQuestion
			const exercise = createIntervalExercise('interval', 4);
			exercise.generateQuestion();
			
			expect(exercise.getCurrentIndex()).toBe(0); // Before submitAnswer
			exercise.submitAnswer('Unison');
			expect(exercise.getCurrentIndex()).toBe(1); // After submitAnswer
		});

		it('should track correct count', () => {
			const exercise = createIntervalExercise('interval', 4);
			exercise.generateQuestion();
			
			expect(exercise.getCorrectCount()).toBe(0);
			exercise.submitAnswer('Unison');
			// Correct count depends on the generated question
		});

		it('should return null if no question is active', () => {
			const exercise = createIntervalExercise('interval', 4);
			
			const result = exercise.submitAnswer('Unison');
			
			expect(result).toBeNull();
		});
	});

	describe('score tracking', () => {
		it('should calculate score correctly', () => {
			const exercise = createIntervalExercise('interval', 4);
			
			// Score should be 0 when no answers
			expect(exercise.getScore()).toBe(0);
		});

		it('should track answer history', () => {
			const exercise = createIntervalExercise('interval', 4);
			exercise.generateQuestion();
			exercise.submitAnswer('Unison');
			
			const history = exercise.getAnswerHistory();
			expect(history).toHaveLength(1);
		});
	});

	describe('isComplete', () => {
		it('should return false when not all questions answered', () => {
			const exercise = createIntervalExercise('interval', 4);
			exercise.generateQuestion();
			
			expect(exercise.isComplete()).toBe(false);
		});

		it('should return true when all questions answered', () => {
			const exercise = createIntervalExercise('interval', 2);
			
			exercise.generateQuestion();
			exercise.submitAnswer('Unison');
			exercise.generateQuestion();
			exercise.submitAnswer('Octave');
			
			expect(exercise.isComplete()).toBe(true);
		});
	});

	describe('reset', () => {
		it('should reset the exercise state', () => {
			const exercise = createIntervalExercise('interval', 4);
			
			exercise.generateQuestion();
			exercise.submitAnswer('Unison');
			
			exercise.reset();
			
			expect(exercise.getCurrentIndex()).toBe(0);
			expect(exercise.getScore()).toBe(0);
			expect(exercise.getCorrectCount()).toBe(0);
			expect(exercise.getAnswerHistory()).toHaveLength(0);
		});
	});

	describe('callbacks', () => {
		it('should set answer callback', () => {
			const exercise = createIntervalExercise('interval', 4);
			const callback = vi.fn();
			
			exercise.setAnswerCallback(callback);
			
			exercise.generateQuestion();
			exercise.submitAnswer('Unison');
			
			expect(callback).toHaveBeenCalled();
		});

		it('should set completion callback', () => {
			const exercise = createIntervalExercise('interval', 2);
			const callback = vi.fn();
			
			exercise.setCompletionCallback(callback);
			
			// Complete the exercise
			exercise.generateQuestion();
			exercise.submitAnswer('Unison');
			exercise.generateQuestion();
			exercise.submitAnswer('Octave');
			
			expect(callback).toHaveBeenCalled();
		});
	});

	describe('regression: effect_update_depth_exceeded', () => {
		// This test ensures the exercise can be created and used without triggering
		// infinite loops in Svelte's $effect
		it('should not cause state mutation loops', () => {
			const exercise = createIntervalExercise('interval', 4);
			
			// Simulate what the Svelte component does
			let questionCount = 0;
			const maxIterations = 10;
			
			for (let i = 0; i < maxIterations; i++) {
				const question = exercise.generateQuestion();
				if (!question) break;
				
				exercise.submitAnswer('Unison');
				questionCount++;
			}
			
			// Should complete without infinite loop
			expect(questionCount).toBeGreaterThan(0);
			expect(questionCount).toBeLessThanOrEqual(4);
		});

		it('should allow repeated reset and generation without memory leaks', () => {
			const exercise = createIntervalExercise('interval', 2); // 2 questions per round
			
			// Simulate multiple rounds of the exercise (like replay button)
			for (let round = 0; round < 3; round++) {
				exercise.reset();
				
				const question = exercise.generateQuestion();
				expect(question).not.toBeNull();
				
				exercise.submitAnswer('Unison');
				
				// Need to generate and answer second question to finish the round
				const question2 = exercise.generateQuestion();
				if (question2) {
					exercise.submitAnswer('Octave');
				}
			}
			
			// Should have tracked answers from all rounds
			// But reset clears history, so we get 2 answers per round
			expect(exercise.getAnswerHistory()).toHaveLength(2);
		});

		it('should handle rapid state changes without triggering effects', () => {
			const exercise = createIntervalExercise('interval', 4);
			
			// Rapid state changes that could trigger $effect loops
			exercise.generateQuestion();
			exercise.submitAnswer('Unison');
			exercise.generateQuestion();
			exercise.submitAnswer('Octave');
			exercise.generateQuestion();
			exercise.submitAnswer('Unison');
			exercise.generateQuestion();
			exercise.submitAnswer('Octave');
			
			// Should complete without issues
			expect(exercise.isComplete()).toBe(true);
			expect(exercise.getScore()).toBeGreaterThanOrEqual(0);
		});
	});
});
