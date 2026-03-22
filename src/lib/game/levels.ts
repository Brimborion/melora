// Game configuration and level definitions

import type { Level, Chapter, ExerciseType, Difficulty } from '../types';

export type UserDifficulty = 'beginner' | 'intermediate' | 'advanced';

// Export helper for easy access to user difficulty from preferences
// Usage: import { getUserDifficulty } from '$lib/game/levels';
// Then: const userDiff = await getUserDifficulty();
import { db } from '$lib/db';
import type { UserPreferences } from '$lib/db';

/**
 * Get the current user's difficulty preference from the database
 */
export async function getUserDifficulty(): Promise<'beginner' | 'intermediate' | 'advanced'> {
	const prefs = await db.preferences.get('default');
	return (prefs?.difficulty as 'beginner' | 'intermediate' | 'advanced') ?? 'beginner';
}

/**
 * Get levels filtered by user difficulty preference
 * Higher difficulties include lower difficulty levels
 */
export function getLevelsByDifficulty(difficulty: UserDifficulty): Level[] {
	const difficultyOrder: UserDifficulty[] = ['beginner', 'intermediate', 'advanced'];
	const userLevelIndex = difficultyOrder.indexOf(difficulty);
	
	// Include all levels from beginner up to user's difficulty
	return levels.filter(level => {
		const levelIndex = difficultyOrder.indexOf(level.difficulty as UserDifficulty);
		return levelIndex <= userLevelIndex;
	});
}

/**
 * Get the next recommended level based on user difficulty and progress
 */
export function getRecommendedLevel(
	difficulty: UserDifficulty,
	completedLevelIds: Set<string>
): Level | undefined {
	const availableLevels = getLevelsByDifficulty(difficulty);
	
	// Find the first uncompleted level at the current difficulty
	return availableLevels.find(level => !completedLevelIds.has(level.id));
}

/**
 * Level definitions for the game
 * Organized by chapter
 */
export const levels: Level[] = [
	// Chapter 1: Introduction to Intervals - Level 1: Unison & Octave (Story 2-8)
	{
		id: '1-1',
		title: 'Lesson 1: Unison & Octave',
		description: 'Learn to recognize Unison and Octave intervals - the foundation of ear training',
		chapter: 1,
		level: 1,
		difficulty: 'beginner',
		exerciseType: 'interval-recognition-unison-octave',
		unlocked: true,
		requiredScore: 0,
		questionCount: 4
	},
	// Chapter 1: Original Perfect Fifths (now moved to later in the chapter)
	{
		id: '1-2',
		title: 'Perfect Fifths',
		description: 'Learn to identify the perfect fifth interval',
		chapter: 1,
		level: 2,
		difficulty: 'beginner',
		exerciseType: 'interval-identification',
		unlocked: false,
		requiredScore: 70
	},
	{
		id: '1-3',
		title: 'Perfect Fourths',
		description: 'Learn to identify the perfect fourth interval',
		chapter: 1,
		level: 3,
		difficulty: 'beginner',
		exerciseType: 'interval-identification',
		unlocked: false,
		requiredScore: 70
	},
	{
		id: '1-4',
		title: 'Major Thirds',
		description: 'Learn to identify major third intervals',
		chapter: 1,
		level: 3,
		difficulty: 'beginner',
		exerciseType: 'interval-identification',
		unlocked: false,
		requiredScore: 70
	},
	{
		id: '1-5',
		title: 'Minor Thirds',
		description: 'Learn to identify minor third intervals',
		chapter: 1,
		level: 4,
		difficulty: 'beginner',
		exerciseType: 'interval-identification',
		unlocked: false,
		requiredScore: 70
	},
	// Chapter 2: More Intervals
	{
		id: '2-1',
		title: 'Major Seconds',
		description: 'Learn to identify major second intervals',
		chapter: 2,
		level: 1,
		difficulty: 'intermediate',
		exerciseType: 'interval-identification',
		unlocked: false,
		requiredScore: 75
	},
	{
		id: '2-2',
		title: 'Minor Seconds',
		description: 'Learn to identify minor second intervals',
		chapter: 2,
		level: 2,
		difficulty: 'intermediate',
		exerciseType: 'interval-identification',
		unlocked: false,
		requiredScore: 75
	},
	{
		id: '2-3',
		title: 'Octaves',
		description: 'Learn to identify octave intervals',
		chapter: 2,
		level: 3,
		difficulty: 'intermediate',
		exerciseType: 'interval-identification',
		unlocked: false,
		requiredScore: 75
	},
	// Chapter 3: Chord Recognition
	{
		id: '3-1',
		title: 'Major Chords',
		description: 'Identify major chords',
		chapter: 3,
		level: 1,
		difficulty: 'intermediate',
		exerciseType: 'chord-identification',
		unlocked: false,
		requiredScore: 80
	},
	{
		id: '3-2',
		title: 'Minor Chords',
		description: 'Identify minor chords',
		chapter: 3,
		level: 2,
		difficulty: 'intermediate',
		exerciseType: 'chord-identification',
		unlocked: false,
		requiredScore: 80
	}
];

/**
 * Get a level by ID
 */
export function getLevelById(id: string): Level | undefined {
	return levels.find(level => level.id === id);
}

/**
 * Get levels for a specific chapter
 */
export function getLevelsByChapter(chapter: number): Level[] {
	return levels.filter(level => level.chapter === chapter);
}

/**
 * Check if a level is unlocked based on previous progress
 */
export function isLevelUnlocked(level: Level, scores: Map<string, number>): boolean {
	if (level.requiredScore === undefined || level.requiredScore === 0) {
		return true;
	}
	
	// Find the previous level in the same chapter
	const previousLevel = levels.find(l => 
		l.chapter === level.chapter && 
		l.level === level.level - 1
	);
	
	if (!previousLevel) {
		return true;
	}
	
	const previousScore = scores.get(previousLevel.id) ?? 0;
	return previousScore >= (previousLevel.requiredScore ?? 0);
}
