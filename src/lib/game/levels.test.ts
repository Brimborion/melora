// Unit tests for levels module
// Tests for bug fix: effect_update_depth_exceeded
import { describe, it, expect } from 'vitest';
import { getLevelById, getLevelsByChapter, isLevelUnlocked, getLevelsByDifficulty } from './levels';

describe('levels', () => {
	describe('getLevelById', () => {
		it('should return level 1-1', () => {
			const level = getLevelById('1-1');
			
			expect(level).toBeDefined();
			expect(level?.id).toBe('1-1');
			expect(level?.title).toBe('Lesson 1: Unison & Octave');
			expect(level?.questionCount).toBe(4);
		});

		it('should return undefined for non-existent level', () => {
			const level = getLevelById('non-existent');
			
			expect(level).toBeUndefined();
		});

		it('should return level with correct properties', () => {
			const level = getLevelById('1-1');
			
			expect(level).toHaveProperty('id');
			expect(level).toHaveProperty('title');
			expect(level).toHaveProperty('description');
			expect(level).toHaveProperty('chapter');
			expect(level).toHaveProperty('level');
			expect(level).toHaveProperty('difficulty');
			expect(level).toHaveProperty('questionCount');
		});

		it('should handle different level IDs', () => {
			const level1 = getLevelById('1-1');
			const level2 = getLevelById('1-2');
			
			expect(level1?.id).not.toBe(level2?.id);
		});
	});

	describe('getLevelsByChapter', () => {
		it('should return levels for chapter 1', () => {
			const levels = getLevelsByChapter(1);
			
			expect(levels.length).toBeGreaterThan(0);
			levels.forEach(level => {
				expect(level.chapter).toBe(1);
			});
		});

		it('should return empty array for non-existent chapter', () => {
			const levels = getLevelsByChapter(999);
			
			expect(levels).toHaveLength(0);
		});
	});

	describe('isLevelUnlocked', () => {
		it('should unlock level with no required score', () => {
			const level = getLevelById('1-1');
			
			expect(level).toBeDefined();
			const unlocked = isLevelUnlocked(level!, new Map());
			
			expect(unlocked).toBe(true);
		});

		it('should unlock level when required score is met', () => {
			const level = getLevelById('1-2');
			
			expect(level).toBeDefined();
			// Level 1-2 requires score of 70
			const scores = new Map<string, number>([['1-1', 80]]);
			const unlocked = isLevelUnlocked(level!, scores);
			
			expect(unlocked).toBe(true);
		});

		it('should not unlock level when required score is not met', () => {
			const level = getLevelById('1-2');
			
			expect(level).toBeDefined();
			// Level 1-2 requires score from level 1-1 (previous level in same chapter)
			// Level 1-1 requires score 0, but let's test with level that requires score
			// Actually, level 1-1 has requiredScore: 0 so it doesn't require previous score
			// Let's use a different approach - level 1-3 requires score from 1-2
			
			const level3 = getLevelById('1-3');
			expect(level3).toBeDefined();
			
			// Level 1-3 requires 70 from level 1-2, user only got 60
			const scores = new Map<string, number>([['1-2', 60]]);
			const unlocked = isLevelUnlocked(level3!, scores);
			
			expect(unlocked).toBe(false);
		});
	});

	describe('getLevelsByDifficulty', () => {
		it('should return beginner levels for beginner difficulty', () => {
			const levels = getLevelsByDifficulty('beginner');
			
			expect(levels.length).toBeGreaterThan(0);
			levels.forEach(level => {
				expect(['beginner']).toContain(level.difficulty);
			});
		});

		it('should include all levels up to user difficulty', () => {
			const beginnerLevels = getLevelsByDifficulty('beginner');
			const advancedLevels = getLevelsByDifficulty('advanced');
			
			// Advanced should include at least as many levels as beginner
			expect(advancedLevels.length).toBeGreaterThanOrEqual(beginnerLevels.length);
		});
	});

	describe('regression: effect_update_depth_exceeded', () => {
		// This test ensures levels can be loaded quickly without causing
		// issues in the Svelte component's $effect
		it('should load level quickly for $effect', () => {
			const start = performance.now();
			const level = getLevelById('1-1');
			const duration = performance.now() - start;
			
			expect(level).toBeDefined();
			// Should load in under 10ms to avoid triggering $effect issues
			expect(duration).toBeLessThan(10);
		});

		it('should handle rapid level lookups without side effects', () => {
			// Simulate rapid navigation between levels
			for (let i = 0; i < 10; i++) {
				const level = getLevelById('1-1');
				expect(level).toBeDefined();
			}
			
			// All lookups should return the same level
			const level1 = getLevelById('1-1');
			const level2 = getLevelById('1-1');
			expect(level1).toEqual(level2);
		});

		it('should provide stable references for reactive dependencies', () => {
			// In Svelte's $effect, the level should remain stable
			const level = getLevelById('1-1');
			
			// Multiple calls should return equivalent objects
			const level2 = getLevelById('1-1');
			
			expect(level?.id).toBe(level2?.id);
			expect(level?.title).toBe(level2?.title);
			expect(level?.questionCount).toBe(level2?.questionCount);
		});
	});
});
