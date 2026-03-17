// Unit tests for scoring module
import { describe, it, expect } from 'vitest';
import {
	calculateAnswerScore,
	getDifficultyMultiplier,
	calculatePercentage,
	isPassing,
	getGrade,
	calculateStreakBonus,
	createScoreRecord
} from './scoring';

describe('Scoring System', () => {
	describe('calculateAnswerScore', () => {
		it('should return 0 for incorrect answer', () => {
			const score = calculateAnswerScore(false, 1000, 1.0);
			expect(score).toBe(0);
		});

		it('should return base points for correct answer', () => {
			const score = calculateAnswerScore(true, 5000, 1.0); // Slow answer, no time bonus
			expect(score).toBe(100);
		});

		it('should add time bonus for fast answers', () => {
			const fastScore = calculateAnswerScore(true, 500, 1.0); // Very fast
			const slowScore = calculateAnswerScore(true, 5000, 1.0); // Slow
			
			expect(fastScore).toBeGreaterThan(slowScore);
		});

		it('should apply difficulty multiplier', () => {
			const beginnerScore = calculateAnswerScore(true, 1000, 1.0);
			const advancedScore = calculateAnswerScore(true, 1000, 1.5);
			
			expect(advancedScore).toBeGreaterThan(beginnerScore);
		});

		it('should cap time bonus at 50 points', () => {
			const instantScore = calculateAnswerScore(true, 0, 1.0);
			
			// Base 100 + max time bonus 50 = 150
			expect(instantScore).toBe(150);
		});
	});

	describe('getDifficultyMultiplier', () => {
		it('should return 1.0 for beginner', () => {
			expect(getDifficultyMultiplier('beginner')).toBe(1.0);
		});

		it('should return 1.25 for intermediate', () => {
			expect(getDifficultyMultiplier('intermediate')).toBe(1.25);
		});

		it('should return 1.5 for advanced', () => {
			expect(getDifficultyMultiplier('advanced')).toBe(1.5);
		});

		it('should return 2.0 for master', () => {
			expect(getDifficultyMultiplier('master')).toBe(2.0);
		});
	});

	describe('calculatePercentage', () => {
		it('should calculate correct percentage', () => {
			expect(calculatePercentage(8, 10)).toBe(80);
			expect(calculatePercentage(5, 10)).toBe(50);
			expect(calculatePercentage(10, 10)).toBe(100);
		});

		it('should return 0 for 0 questions', () => {
			expect(calculatePercentage(0, 0)).toBe(0);
		});
	});

	describe('isPassing', () => {
		it('should pass beginner at 60%', () => {
			expect(isPassing(60, 'beginner')).toBe(true);
			expect(isPassing(59, 'beginner')).toBe(false);
		});

		it('should pass intermediate at 70%', () => {
			expect(isPassing(70, 'intermediate')).toBe(true);
			expect(isPassing(69, 'intermediate')).toBe(false);
		});

		it('should pass advanced at 80%', () => {
			expect(isPassing(80, 'advanced')).toBe(true);
			expect(isPassing(79, 'advanced')).toBe(false);
		});

		it('should pass master at 90%', () => {
			expect(isPassing(90, 'master')).toBe(true);
			expect(isPassing(89, 'master')).toBe(false);
		});

		it('should default to 70% for unknown difficulty', () => {
			expect(isPassing(70, 'unknown')).toBe(true);
		});
	});

	describe('getGrade', () => {
		it('should return S for 95%+', () => {
			expect(getGrade(95)).toBe('S');
			expect(getGrade(100)).toBe('S');
		});

		it('should return A for 90-94%', () => {
			expect(getGrade(90)).toBe('A');
			expect(getGrade(94)).toBe('A');
		});

		it('should return B for 80-89%', () => {
			expect(getGrade(80)).toBe('B');
			expect(getGrade(89)).toBe('B');
		});

		it('should return C for 70-79%', () => {
			expect(getGrade(70)).toBe('C');
			expect(getGrade(79)).toBe('C');
		});

		it('should return D for 60-69%', () => {
			expect(getGrade(60)).toBe('D');
			expect(getGrade(69)).toBe('D');
		});

		it('should return F for below 60%', () => {
			expect(getGrade(59)).toBe('F');
			expect(getGrade(0)).toBe('F');
		});
	});

	describe('calculateStreakBonus', () => {
		it('should return 0 for streak less than 3', () => {
			expect(calculateStreakBonus(0)).toBe(0);
			expect(calculateStreakBonus(1)).toBe(0);
			expect(calculateStreakBonus(2)).toBe(0);
		});

		it('should return 10 for streak of 3-4', () => {
			expect(calculateStreakBonus(3)).toBe(10);
			expect(calculateStreakBonus(4)).toBe(10);
		});

		it('should return 25 for streak of 5-9', () => {
			expect(calculateStreakBonus(5)).toBe(25);
			expect(calculateStreakBonus(9)).toBe(25);
		});

		it('should return 50 for streak of 10+', () => {
			expect(calculateStreakBonus(10)).toBe(50);
			expect(calculateStreakBonus(15)).toBe(50);
		});
	});

	describe('createScoreRecord', () => {
		it('should create a score record with correct data', () => {
			const record = createScoreRecord('1-1', 8, 10, 'beginner');
			
			expect(record.levelId).toBe('1-1');
			expect(record.correctAnswers).toBe(8);
			expect(record.totalQuestions).toBe(10);
			expect(record.percentage).toBe(80);
			expect(record.difficulty).toBe('beginner');
			expect(record.completedAt).toBeInstanceOf(Date);
		});
	});
});
