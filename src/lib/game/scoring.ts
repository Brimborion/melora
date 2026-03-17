// Scoring system for Melora

import type { AnswerResult, ScoreRecord } from '../types';

/**
 * Calculate score for a single correct answer
 * Base points + time bonus
 */
export function calculateAnswerScore(
	isCorrect: boolean,
	responseTimeMs: number,
	difficultyMultiplier: number
): number {
	if (!isCorrect) {
		return 0;
	}

	// Base points per correct answer
	const basePoints = 100;
	
	// Time bonus: faster answers get more points
	// Max bonus for answers under 2 seconds
	const maxTimeBonus = 50;
	const timeThreshold = 2000; // 2 seconds
	const timeBonus = Math.max(0, maxTimeBonus * (1 - responseTimeMs / timeThreshold));
	
	// Apply difficulty multiplier
	const totalScore = Math.round((basePoints + timeBonus) * difficultyMultiplier);
	
	return totalScore;
}

/**
 * Get difficulty multiplier
 */
export function getDifficultyMultiplier(difficulty: 'beginner' | 'intermediate' | 'advanced' | 'master'): number {
	switch (difficulty) {
		case 'beginner':
			return 1.0;
		case 'intermediate':
			return 1.25;
		case 'advanced':
			return 1.5;
		case 'master':
			return 2.0;
	}
}

/**
 * Calculate final score percentage
 */
export function calculatePercentage(correct: number, total: number): number {
	if (total === 0) return 0;
	return Math.round((correct / total) * 100);
}

/**
 * Determine if score is passing
 */
export function isPassing(percentage: number, difficulty: string): boolean {
	switch (difficulty) {
		case 'beginner':
			return percentage >= 60;
		case 'intermediate':
			return percentage >= 70;
		case 'advanced':
			return percentage >= 80;
		case 'master':
			return percentage >= 90;
		default:
			return percentage >= 70;
	}
}

/**
 * Get grade based on score percentage
 */
export function getGrade(percentage: number): string {
	if (percentage >= 95) return 'S';
	if (percentage >= 90) return 'A';
	if (percentage >= 80) return 'B';
	if (percentage >= 70) return 'C';
	if (percentage >= 60) return 'D';
	return 'F';
}

/**
 * Calculate streak bonus
 */
export function calculateStreakBonus(streak: number): number {
	if (streak < 3) return 0;
	if (streak < 5) return 10;
	if (streak < 10) return 25;
	return 50;
}

/**
 * Create a score record
 */
export function createScoreRecord(
	levelId: string,
	correctAnswers: number,
	totalQuestions: number,
	difficulty: string
): ScoreRecord {
	const percentage = calculatePercentage(correctAnswers, totalQuestions);
	const score = correctAnswers * 100; // Simplified score calculation
	
	return {
		levelId,
		score,
		correctAnswers,
		totalQuestions,
		percentage,
		difficulty: difficulty as any,
		completedAt: new Date()
	};
}
