// Game types for Melora

import type { Note, IntervalName, ChordType } from './music';

/**
 * Difficulty levels
 */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'master';

/**
 * Types of ear training exercises
 */
export type ExerciseType = 
	| 'interval-identification'
	| 'note-identification'
	| 'chord-identification'
	| 'melody-repetition'
	| 'pitch-comparison'
	| 'interval-recognition-unison-octave'
	| 'audiation'
	| 'harmonic-identification'
	| 'melodic-identification';

/**
 * Game level configuration
 */
export interface Level {
	id: string;
	title: string;
	description: string;
	chapter: number;
	level: number;
	difficulty: Difficulty;
	exerciseType: ExerciseType;
	unlocked: boolean;
	requiredScore?: number; // Score needed to unlock next level
	questionCount?: number; // Number of questions in the exercise (default: 4)
}

/**
 * Chapter containing multiple levels
 */
export interface Chapter {
	id: number;
	title: string;
	description: string;
	levels: Level[];
	unlocked: boolean;
	requiredScore?: number;
}

/**
 * Result of answering a question
 */
export interface AnswerResult {
	correct: boolean;
	correctAnswer: string;
	userAnswer: string;
	responseTimeMs: number;
}

/**
 * Current game session state
 */
export interface GameState {
	levelId: string | null;
	currentQuestion: number;
	totalQuestions: number;
	score: number;
	streak: number;
	correctAnswers: number;
	startTime: Date | null;
	isActive: boolean;
}

/**
 * Question in an exercise
 */
export interface Question {
	id: string;
	type: ExerciseType;
	prompt: string;
	correctAnswer: string;
	options?: string[];
	notes?: Note[]; // For interval/chord questions
}

/**
 * Score record for leaderboard/history
 */
export interface ScoreRecord {
	id?: number;
	levelId: string;
	score: number;
	correctAnswers: number;
	totalQuestions: number;
	percentage: number;
	difficulty: Difficulty;
	completedAt: Date;
}

/**
 * User statistics
 */
export interface UserStats {
	totalSessions: number;
	totalScore: number;
	averageScore: number;
	bestStreak: number;
	levelsCompleted: number;
	timePlayedMinutes: number;
}
