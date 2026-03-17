// Exercise session store tests
// Tests for exercise session state management

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createExerciseSessionStore, type ExerciseSessionState } from './exercise.svelte.ts';
import type { Level } from '$lib/types';

// Mock the database module
vi.mock('$lib/db/database', () => ({
	db: {
		exerciseSessions: {
			put: vi.fn().mockResolvedValue(1),
			where: vi.fn().mockReturnValue({
				equals: vi.fn().mockReturnValue({
					first: vi.fn().mockResolvedValue(null),
					delete: vi.fn().mockResolvedValue(undefined)
				})
			})
		}
	}
}));

// Mock level for testing
const mockLevel: Level = {
	id: '1-1',
	title: 'Perfect Fifths',
	description: 'Learn to identify the perfect fifth interval',
	chapter: 1,
	level: 1,
	difficulty: 'beginner',
	exerciseType: 'interval-identification',
	unlocked: true,
	requiredScore: 0,
	questionCount: 4
};

describe('createExerciseSessionStore', () => {
	let store: ExerciseSessionState;

	beforeEach(() => {
		// Create a fresh store instance for each test
		// We need to import the factory function, not the singleton
		store = createExerciseSessionStore();
	});

	describe('initialization', () => {
		it('should have null exercise on initial state', () => {
			expect(store.currentExercise).toBeNull();
		});

		it('should have empty answers array on initial state', () => {
			expect(store.answers).toEqual([]);
		});

		it('should not be complete on initial state', () => {
			expect(store.isComplete).toBe(false);
		});

		it('should not be loading on initial state', () => {
			expect(store.isLoading).toBe(false);
		});

		it('should not be paused on initial state', () => {
			expect(store.isPaused).toBe(false);
		});

		it('should have null pausedAt on initial state', () => {
			expect(store.pausedAt).toBeNull();
		});

		it('should have zero elapsedTime on initial state', () => {
			expect(store.elapsedTime).toBe(0);
		});
	});

	describe('loadExercise', () => {
		it('should set the current exercise', async () => {
			await store.loadExercise(mockLevel);
			expect(store.currentExercise).toEqual(mockLevel);
		});

		it('should reset answers when loading new exercise', async () => {
			// First load an exercise
			await store.loadExercise(mockLevel);
			// Add some answers
			store.submitAnswer('correct');
			expect(store.answers.length).toBeGreaterThan(0);
			
			// Load a new exercise
			const mockLevel2: Level = { ...mockLevel, id: '1-2' };
			await store.loadExercise(mockLevel2);
			
			// Answers should be reset
			expect(store.answers).toEqual([]);
		});

		it('should reset score when loading new exercise', async () => {
			await store.loadExercise(mockLevel);
			expect(store.score).toBe(0);
		});

		it('should reset pause state when loading new exercise', async () => {
			// Load and pause
			await store.loadExercise(mockLevel);
			await store.pause();
			expect(store.isPaused).toBe(true);
			
			// Load new exercise
			const mockLevel2: Level = { ...mockLevel, id: '1-2' };
			await store.loadExercise(mockLevel2);
			
			// Pause state should be reset
			expect(store.isPaused).toBe(false);
		});
	});

	describe('submitAnswer', () => {
		it('should add answer to answers array', async () => {
			await store.loadExercise(mockLevel);
			const initialCount = store.answers.length;
			store.submitAnswer('correct');
			expect(store.answers.length).toBe(initialCount + 1);
		});

		it('should track correct answers', async () => {
			await store.loadExercise(mockLevel);
			store.submitAnswer('correct');
			store.submitAnswer('correct');
			store.submitAnswer('wrong');
			expect(store.correctAnswers).toBe(2);
		});

		it('should calculate score correctly', async () => {
			await store.loadExercise(mockLevel);
			// Submit 3 correct out of 4
			store.submitAnswer('correct');
			store.submitAnswer('correct');
			store.submitAnswer('correct');
			store.submitAnswer('wrong');
			
			// Score should be 75%
			expect(store.score).toBe(75);
		});

		it('should not accept answers when paused', async () => {
			await store.loadExercise(mockLevel);
			await store.pause();
			
			const initialCount = store.answers.length;
			store.submitAnswer('correct');
			
			// Answer should not be added when paused
			expect(store.answers.length).toBe(initialCount);
		});
	});

	describe('isComplete', () => {
		it('should be false when not all questions answered', async () => {
			await store.loadExercise(mockLevel);
			expect(store.isComplete).toBe(false);
		});

		it('should be true when all questions answered', async () => {
			await store.loadExercise(mockLevel);
			// Submit enough answers to complete (assuming 4 questions default)
			for (let i = 0; i < 4; i++) {
				store.submitAnswer('correct');
			}
			expect(store.isComplete).toBe(true);
		});
	});

	describe('pause and resume', () => {
		it('should set isPaused to true after pause', async () => {
			await store.loadExercise(mockLevel);
			await store.pause();
			expect(store.isPaused).toBe(true);
		});

		it('should save question index when pausing', async () => {
			await store.loadExercise(mockLevel);
			// Submit some answers to get to question 2
			store.submitAnswer('correct');
			store.nextQuestion();
			await store.pause();
			
			expect(store.pausedAt).toBe(1); // 0-indexed, so question 2 = index 1
		});

		it('should not pause when already paused', async () => {
			await store.loadExercise(mockLevel);
			await store.pause();
			const pausedAtFirst = store.pausedAt;
			await store.pause(); // Try to pause again
			
			// Should still be paused at the same position
			expect(store.pausedAt).toBe(pausedAtFirst);
		});

		it('should restore state after resume', async () => {
			await store.loadExercise(mockLevel);
			// Submit some answers
			store.submitAnswer('correct');
			store.nextQuestion();
			store.submitAnswer('wrong');
			
			const questionIndexBeforePause = store.currentQuestionIndex;
			
			// Pause and resume
			await store.pause();
			await store.resume();
			
			// State should be restored
			expect(store.currentQuestionIndex).toBe(questionIndexBeforePause);
			expect(store.answers.length).toBe(2);
			expect(store.isPaused).toBe(false);
		});

		it('should not accept answers when paused', async () => {
			await store.loadExercise(mockLevel);
			store.submitAnswer('correct');
			const answerCount = store.answers.length;
			
			await store.pause();
			store.submitAnswer('correct');
			
			expect(store.answers.length).toBe(answerCount);
		});

		it('should not move to next question when paused', async () => {
			await store.loadExercise(mockLevel);
			const questionIndex = store.currentQuestionIndex;
			
			await store.pause();
			store.nextQuestion();
			
			expect(store.currentQuestionIndex).toBe(questionIndex);
		});
	});

	describe('reset', () => {
		it('should clear current exercise', async () => {
			await store.loadExercise(mockLevel);
			store.reset();
			expect(store.currentExercise).toBeNull();
		});

		it('should clear answers', async () => {
			await store.loadExercise(mockLevel);
			store.submitAnswer('correct');
			store.reset();
			expect(store.answers).toEqual([]);
		});

		it('should reset score to 0', async () => {
			await store.loadExercise(mockLevel);
			store.submitAnswer('correct');
			store.reset();
			expect(store.score).toBe(0);
		});

		it('should reset pause state', async () => {
			await store.loadExercise(mockLevel);
			await store.pause();
			store.reset();
			expect(store.isPaused).toBe(false);
			expect(store.pausedAt).toBeNull();
		});
	});
});
