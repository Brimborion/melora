// Library store using Svelte 5 runes
// State management for the exercise library page

import { levels } from '$lib/game/levels';
import type { Level, ExerciseType } from '$lib/types';

/**
 * Filter type for exercise filtering
 */
export type LibraryFilter = 'all' | 'intervals' | 'chords' | 'melodies';

/**
 * Minimum score required to consider an exercise completed
 */
const COMPLETION_THRESHOLD = 70;

/**
 * Create the library store
 * Manages filter state and exercise data
 */
export function createLibraryStore() {
	// State
	let selectedFilter = $state<LibraryFilter>('all');
	let progressMap = $state<Map<string, number>>(new Map());

	// Load progress from database
	async function loadProgress(): Promise<void> {
		try {
			const { db } = await import('$lib/db');
			const progress = await db.progress.toArray();
			
			const newMap = new Map<string, number>();
			for (const p of progress) {
				// Store best score for each level
				const existing = newMap.get(p.levelId);
				if (!existing || p.bestScore > existing) {
					newMap.set(p.levelId, p.bestScore);
				}
			}
			progressMap = newMap;
		} catch (error) {
			console.warn('Failed to load progress from database:', error);
			// Keep empty progress map if loading fails (e.g., private browsing)
			progressMap = new Map();
		}
	}

	// Get all levels with progress
	function getLevels(): Level[] {
		return levels;
	}

	// Get progress for a specific level
	function getProgress(levelId: string): number | undefined {
		return progressMap.get(levelId);
	}

	// Check if a level is completed
	function isCompleted(levelId: string): boolean {
		const score = progressMap.get(levelId);
		return score !== undefined && score >= COMPLETION_THRESHOLD;
	}

	// Filter exercises by type
	function filterExercises(
		exercises: Level[], 
		filter: LibraryFilter
	): Level[] {
		if (filter === 'all') {
			return exercises;
		}

		return exercises.filter(level => {
			const mappedType = mapExerciseType(level.exerciseType);
			return mappedType === filter;
		});
	}

	// Map exercise type from Level to filter type
	function mapExerciseType(exerciseType: ExerciseType): LibraryFilter {
		switch (exerciseType) {
			case 'interval-identification':
				return 'intervals';
			case 'chord-identification':
				return 'chords';
			case 'melody-repetition':
			case 'note-identification':
			case 'pitch-comparison':
				return 'melodies';
			default:
				return 'all';
		}
	}

	// Set the filter
	function setFilter(filter: LibraryFilter): void {
		selectedFilter = filter;
	}

	// Get filtered exercises
	let filteredExercises = $derived(
		filterExercises(levels, selectedFilter)
	);

	return {
		// Getters
		get selectedFilter() { return selectedFilter; },
		get filteredExercises() { return filteredExercises; },
		get levels() { return levels; },
		get progressMap() { return progressMap; },
		
		// Actions
		setFilter,
		loadProgress,
		getProgress,
		isCompleted,
		filterExercises,
		mapExerciseType
	};
}

// Export singleton instance
export const libraryStore = createLibraryStore();
