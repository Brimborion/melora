// Profile store using Svelte 5 runes
// Manages user profile data and statistics

import { db } from '$lib/db';
import type { GameProgress, GameSession } from '$lib/db';
import { browser } from '$app/environment';

// Types for profile data
export interface DayProgress {
	date: string;
	count: number;
}

export interface ChapterProgress {
	chapterId: string;
	chapterName: string;
	completedLevels: number;
	totalLevels: number;
	percentage: number;
}

export interface Badge {
	id: string;
	name: string;
	description: string;
	earnedAt: Date;
	icon: string;
}

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// Number of levels per chapter
const LEVELS_PER_CHAPTER: Record<string, number> = {
	ch1: 5,
	ch2: 8,
	ch3: 8,
	ch4: 10
};

// Chapter names - single source of truth
const CHAPTER_NAMES: Record<string, string> = {
	ch1: 'Introduction',
	ch2: 'Basic Intervals',
	ch3: 'Advanced Intervals',
	ch4: 'Chords',
	ch5: 'Melody',
	ch6: 'Harmony'
};

function createProfileStore() {
	// State
	let totalExercises = $state(0);
	let averageScore = $state(0);
	let currentStreak = $state(0);
	let weeklyProgress = $state<DayProgress[]>([]);
	let chapterProgress = $state<ChapterProgress[]>([]);
	let badges = $state<Badge[]>([]);
	let isLoaded = $state(false);
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	// Get chapter info from level ID
	function getChapterInfo(levelId: string): { chapterId: string; chapterName: string } {
		// Try to extract chapter from level ID (e.g., "2-1" -> chapter 2)
		const prefix = levelId.split('-')[0];
		const chapterNum = parseInt(prefix, 10);
		const chapterId = `ch${chapterNum}`;
		
		return {
			chapterId,
			chapterName: CHAPTER_NAMES[chapterId] || `Chapter ${chapterNum}`
		};
	}

	// Calculate current streak from progress records
	async function calculateStreak(): Promise<number> {
		if (!browser) return 0;
		
		try {
			const allProgress = await db.progress
				.filter(p => p.completed === true)
				.toArray();
			
			if (allProgress.length === 0) return 0;
			
			// Get unique dates with completed exercises
			const datesWithProgress = new Set<string>();
			for (const p of allProgress) {
				if (p.completedAt) {
					const date = p.completedAt.toISOString().split('T')[0];
					datesWithProgress.add(date);
				}
			}
			
			// Sort dates in descending order
			const sortedDates = Array.from(datesWithProgress).sort().reverse();
			
			if (sortedDates.length === 0) return 0;
			
			// Check if today or yesterday has progress (streak is active)
			const today = new Date().toISOString().split('T')[0];
			const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
			
			if (!sortedDates.includes(today) && !sortedDates.includes(yesterday)) {
				return 0;
			}
			
			// Count consecutive days (max 365 to prevent infinite loops)
			let streak = 0;
			const currentDate = new Date();
			currentDate.setHours(0, 0, 0, 0);
			
			for (let i = 0; i < 365; i++) {
				const checkDate = new Date(currentDate);
				checkDate.setDate(checkDate.getDate() - i);
				const dateStr = checkDate.toISOString().split('T')[0];
				
				if (datesWithProgress.has(dateStr)) {
					streak++;
				} else if (i > 0) {
					// Allow skipping today if no progress yet
					break;
				}
			}
			
			return streak;
		} catch (e) {
			console.error('Error calculating streak:', e);
			return 0;
		}
	}

	// Calculate weekly progress (last 7 days)
	async function calculateWeeklyProgress(): Promise<DayProgress[]> {
		if (!browser) return [];
		
		try {
			const allProgress = await db.progress
				.filter(p => p.completed === true)
				.toArray();
			
			const days: DayProgress[] = [];
			const today = new Date();
			
			for (let i = 6; i >= 0; i--) {
				const date = new Date(today);
				date.setDate(date.getDate() - i);
				const dateStr = date.toISOString().split('T')[0];
				
				const count = allProgress.filter(p => {
					if (!p.completedAt) return false;
					return p.completedAt.toISOString().split('T')[0] === dateStr;
				}).length;
				
				days.push({ date: dateStr, count });
			}
			
			return days;
		} catch (e) {
			console.error('Error calculating weekly progress:', e);
			return [];
		}
	}

	// Calculate chapter progress
	async function calculateChapterProgress(): Promise<ChapterProgress[]> {
		if (!browser) return [];
		
		try {
			const allProgress = await db.progress
				.filter(p => p.completed === true)
				.toArray();
			
			// Group completed levels by chapter
			const completedByChapter: Record<string, Set<string>> = {};
			
			for (const progress of allProgress) {
				const { chapterId } = getChapterInfo(progress.levelId);
				if (!completedByChapter[chapterId]) {
					completedByChapter[chapterId] = new Set();
				}
				completedByChapter[chapterId].add(progress.levelId);
			}
			
			// Build chapter progress array
			const chapters: ChapterProgress[] = [];
			
			for (const chapterId of Object.keys(LEVELS_PER_CHAPTER)) {
				const completedLevels = completedByChapter[chapterId]?.size || 0;
				const totalLevels = LEVELS_PER_CHAPTER[chapterId];
				const percentage = totalLevels > 0 
					? Math.round((completedLevels / totalLevels) * 100) 
					: 0;
				
				chapters.push({
					chapterId,
					chapterName: CHAPTER_NAMES[chapterId] || `Chapter ${chapterId}`,
					completedLevels,
					totalLevels,
					percentage
				});
			}
			
			return chapters;
		} catch (e) {
			console.error('Error calculating chapter progress:', e);
			return [];
		}
	}

	// Determine earned badges based on progress
	async function calculateBadges(): Promise<Badge[]> {
		if (!browser) return [];
		
		try {
			const allProgress = await db.progress
				.filter(p => p.completed === true)
				.toArray();
			
			const earnedBadges: Badge[] = [];
			
			// First Exercise badge
			if (allProgress.length >= 1) {
				const firstProgress = allProgress.find(p => p.completedAt);
				earnedBadges.push({
					id: 'first-exercise',
					name: 'First Steps',
					description: 'Complete your first exercise',
					earnedAt: firstProgress?.completedAt || new Date(),
					icon: '🎯'
				});
			}
			
			// Ten Exercises badge
			if (allProgress.length >= 10) {
				earnedBadges.push({
					id: 'ten-exercises',
					name: 'Dedicated Learner',
					description: 'Complete 10 exercises',
					earnedAt: new Date(),
					icon: '📚'
				});
			}
			
			// Perfect Score badge
			const perfectScores = allProgress.filter(p => p.bestScore === 100);
			if (perfectScores.length >= 1) {
				const firstPerfect = perfectScores.find(p => p.completedAt);
				earnedBadges.push({
					id: 'perfect-score',
					name: 'Perfect Pitch',
					description: 'Get a perfect score',
					earnedAt: firstPerfect?.completedAt || new Date(),
					icon: '⭐'
				});
			}
			
			// Streak badges
			const streak = await calculateStreak();
			if (streak >= 3) {
				earnedBadges.push({
					id: 'streak-3',
					name: 'On Fire',
					description: 'Maintain a 3-day streak',
					earnedAt: new Date(),
					icon: '🔥'
				});
			}
			if (streak >= 7) {
				earnedBadges.push({
					id: 'streak-7',
					name: 'Week Warrior',
					description: 'Maintain a 7-day streak',
					earnedAt: new Date(),
					icon: '💪'
				});
			}
			
			// Chapter completion badges
			const chapterProgress = await calculateChapterProgress();
			for (const chapter of chapterProgress) {
				if (chapter.percentage === 100) {
					earnedBadges.push({
						id: `chapter-${chapter.chapterId}`,
						name: `${chapter.chapterName} Master`,
						description: `Complete all ${chapter.chapterName} levels`,
						earnedAt: new Date(),
						icon: '🏆'
					});
				}
			}
			
			return earnedBadges;
		} catch (e) {
			console.error('Error calculating badges:', e);
			return [];
		}
	}

	// Load all profile statistics from IndexedDB
	async function loadStats() {
		if (!browser) {
			error = 'Profile loading is only available in browser';
			return;
		}
		
		isLoading = true;
		error = null;
		
		try {
			// Get all completed progress
			const allProgress = await db.progress
				.filter(p => p.completed === true)
				.toArray();
			
			// Total exercises
			totalExercises = allProgress.length;
			
			// Average score
			if (allProgress.length > 0) {
				const totalScore = allProgress.reduce((sum, p) => sum + p.bestScore, 0);
				averageScore = Math.round(totalScore / allProgress.length);
			} else {
				averageScore = 0;
			}
			
			// Current streak
			currentStreak = await calculateStreak();
			
			// Weekly progress
			weeklyProgress = await calculateWeeklyProgress();
			
			// Chapter progress
			chapterProgress = await calculateChapterProgress();
			
			// Badges
			badges = await calculateBadges();
			
			isLoaded = true;
		} catch (e) {
			const errorMessage = e instanceof Error ? e.message : 'Failed to load profile statistics';
			console.error('Failed to load profile:', errorMessage);
			error = errorMessage;
		} finally {
			isLoading = false;
		}
	}

	return {
		// Getters
		get totalExercises() { return totalExercises; },
		get averageScore() { return averageScore; },
		get currentStreak() { return currentStreak; },
		get weeklyProgress() { return weeklyProgress; },
		get chapterProgress() { return chapterProgress; },
		get badges() { return badges; },
		get isLoaded() { return isLoaded; },
		get isLoading() { return isLoading; },
		get error() { return error; },
		
		// Actions
		loadStats
	};
}

// Export singleton instance
export const profileStore = createProfileStore();
