// Library store tests
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createLibraryStore } from './library.svelte.ts';
import type { Level } from '$lib/types';

describe('library.svelte.ts', () => {
	describe('createLibraryStore', () => {
		it('should initialize with default filter set to all', () => {
			const store = createLibraryStore();
			expect(store.selectedFilter).toBe('all');
		});

		it('should allow setting filter to intervals', () => {
			const store = createLibraryStore();
			store.setFilter('intervals');
			expect(store.selectedFilter).toBe('intervals');
		});

		it('should allow setting filter to chords', () => {
			const store = createLibraryStore();
			store.setFilter('chords');
			expect(store.selectedFilter).toBe('chords');
		});

		it('should allow setting filter to melodies', () => {
			const store = createLibraryStore();
			store.setFilter('melodies');
			expect(store.selectedFilter).toBe('melodies');
		});

		it('should filter exercises by type intervals', () => {
			const store = createLibraryStore();
			const exercises: Level[] = [
				{ id: '1-1', title: 'Test', description: 'Test', chapter: 1, level: 1, difficulty: 'beginner', exerciseType: 'interval-identification', unlocked: true },
				{ id: '2-1', title: 'Test2', description: 'Test2', chapter: 2, level: 1, difficulty: 'intermediate', exerciseType: 'chord-identification', unlocked: true },
				{ id: '3-1', title: 'Test3', description: 'Test3', chapter: 3, level: 1, difficulty: 'advanced', exerciseType: 'melody-repetition', unlocked: true }
			];
			
			const filtered = store.filterExercises(exercises, 'intervals');
			expect(filtered).toHaveLength(1);
			expect(filtered[0].id).toBe('1-1');
		});

		it('should filter exercises by type chords', () => {
			const store = createLibraryStore();
			const exercises: Level[] = [
				{ id: '1-1', title: 'Test', description: 'Test', chapter: 1, level: 1, difficulty: 'beginner', exerciseType: 'interval-identification', unlocked: true },
				{ id: '2-1', title: 'Test2', description: 'Test2', chapter: 2, level: 1, difficulty: 'intermediate', exerciseType: 'chord-identification', unlocked: true }
			];
			
			const filtered = store.filterExercises(exercises, 'chords');
			expect(filtered).toHaveLength(1);
			expect(filtered[0].id).toBe('2-1');
		});

		it('should return all exercises when filter is all', () => {
			const store = createLibraryStore();
			const exercises: Level[] = [
				{ id: '1-1', title: 'Test', description: 'Test', chapter: 1, level: 1, difficulty: 'beginner', exerciseType: 'interval-identification', unlocked: true },
				{ id: '2-1', title: 'Test2', description: 'Test2', chapter: 2, level: 1, difficulty: 'intermediate', exerciseType: 'chord-identification', unlocked: true },
				{ id: '3-1', title: 'Test3', description: 'Test3', chapter: 3, level: 1, difficulty: 'advanced', exerciseType: 'melody-repetition', unlocked: true }
			];
			
			const filtered = store.filterExercises(exercises, 'all');
			expect(filtered).toHaveLength(3);
		});

		it('should map exercise types correctly', () => {
			const store = createLibraryStore();
			
			expect(store.mapExerciseType('interval-identification')).toBe('intervals');
			expect(store.mapExerciseType('chord-identification')).toBe('chords');
			expect(store.mapExerciseType('melody-repetition')).toBe('melodies');
		});
	});
});
