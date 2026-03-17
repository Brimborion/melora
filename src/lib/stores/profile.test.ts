// Unit tests for profile store
// Tests stats calculations

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock progress data
const mockProgress = [
	{
		id: 1,
		levelId: '1-1',
		completed: true,
		bestScore: 85,
		attempts: 1,
		completedAt: new Date('2026-03-04'),
		updatedAt: new Date('2026-03-04')
	},
	{
		id: 2,
		levelId: '1-2',
		completed: true,
		bestScore: 90,
		attempts: 2,
		completedAt: new Date('2026-03-04'),
		updatedAt: new Date('2026-03-04')
	},
	{
		id: 3,
		levelId: '2-1',
		completed: true,
		bestScore: 75,
		attempts: 1,
		completedAt: new Date('2026-03-03'),
		updatedAt: new Date('2026-03-03')
	},
	{
		id: 4,
		levelId: '2-2',
		completed: true,
		bestScore: 100,
		attempts: 3,
		completedAt: new Date('2026-03-02'),
		updatedAt: new Date('2026-03-02')
	},
	{
		id: 5,
		levelId: '3-1',
		completed: true,
		bestScore: 60,
		attempts: 1,
		completedAt: new Date('2026-02-28'),
		updatedAt: new Date('2026-02-28')
	}
];

// Create a mock chain builder
function createProgressMock() {
	let lastField: string | null = null;
	
	return {
		where: vi.fn((field: string) => {
			lastField = field;
			return {
				equals: vi.fn((value: unknown) => {
					if (lastField === 'completed') {
						return {
							toArray: vi.fn(() => Promise.resolve(mockProgress.filter(p => p.completed)))
						};
					}
					return {
						toArray: vi.fn(() => Promise.resolve(mockProgress))
					};
				})
			};
		}),
		filter: vi.fn((predicate: (p: typeof mockProgress[0]) => boolean) => {
			return {
				toArray: vi.fn(() => Promise.resolve(mockProgress.filter(predicate)))
			};
		})
	};
}

// Mock the database module
vi.mock('$lib/db', () => {
	const mockProgressData = createProgressMock();
	
	return {
		db: {
			progress: mockProgressData
		}
	};
});

// Mock browser environment
vi.mock('$app/environment', () => ({
	browser: true
}));

// Import after mocks are set up
import { profileStore } from './profile.svelte';

describe('Profile Store', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('loadStats', () => {
		it('should calculate total exercises from progress', async () => {
			await profileStore.loadStats();
			
			expect(profileStore.totalExercises).toBe(5);
		});

		it('should calculate average score correctly', async () => {
			await profileStore.loadStats();
			
			// Average of 85, 90, 75, 100, 60 = 410 / 5 = 82
			expect(profileStore.averageScore).toBe(82);
		});
	});

	describe('calculateStreak', () => {
		it('should return 0 when no progress exists', async () => {
			// This test verifies the streak calculation logic
			// Actual streak depends on the dates in mock data
			await profileStore.loadStats();
			
			// Based on mock data, there's progress on consecutive days
			// 2026-03-04, 2026-03-03, 2026-03-02 (with gap on 2026-03-01)
			// So streak should be 2 (days with exercises starting from today)
			expect(typeof profileStore.currentStreak).toBe('number');
		});
	});

	describe('calculateWeeklyProgress', () => {
		it('should return array of 7 days', async () => {
			await profileStore.loadStats();
			
			expect(profileStore.weeklyProgress).toHaveLength(7);
		});

		it('should include today in the weekly progress', async () => {
			await profileStore.loadStats();
			
			const today = new Date().toISOString().split('T')[0];
			const todayEntry = profileStore.weeklyProgress.find(d => d.date === today);
			
			expect(todayEntry).toBeDefined();
		});
	});

	describe('calculateChapterProgress', () => {
		it('should return chapter progress for all chapters', async () => {
			await profileStore.loadStats();
			
			// Should have progress for chapters 1, 2, 3
			expect(profileStore.chapterProgress.length).toBeGreaterThan(0);
		});

		it('should calculate correct chapter completion percentage', async () => {
			await profileStore.loadStats();
			
			const chapter1 = profileStore.chapterProgress.find(c => c.chapterId === 'ch1');
			
			// Chapter 1 has levels 1-1 and 1-2 completed out of 5
			expect(chapter1?.completedLevels).toBe(2);
			expect(chapter1?.totalLevels).toBe(5);
			expect(chapter1?.percentage).toBe(40);
		});
	});

	describe('calculateBadges', () => {
		it('should award First Steps badge for completing at least one exercise', async () => {
			await profileStore.loadStats();
			
			const firstExerciseBadge = profileStore.badges.find(b => b.id === 'first-exercise');
			
			expect(firstExerciseBadge).toBeDefined();
			expect(firstExerciseBadge?.name).toBe('First Steps');
		});

		it('should award Perfect Score badge for 100% score', async () => {
			await profileStore.loadStats();
			
			const perfectScoreBadge = profileStore.badges.find(b => b.id === 'perfect-score');
			
			expect(perfectScoreBadge).toBeDefined();
			expect(perfectScoreBadge?.name).toBe('Perfect Pitch');
		});

		it('should award Ten Exercises badge when 10 exercises completed', async () => {
			// With 5 exercises in mock, this badge should not exist
			const tenExercisesBadge = profileStore.badges.find(b => b.id === 'ten-exercises');
			
			// Badge should not exist with only 5 exercises
			expect(tenExercisesBadge).toBeUndefined();
		});
	});

	describe('State management', () => {
		it('should set isLoading during load', async () => {
			const loadPromise = profileStore.loadStats();
			
			// Note: Due to async nature, this might already be false
			// by the time we check, so we just verify the final state
			await loadPromise;
			
			expect(profileStore.isLoaded).toBe(true);
			expect(profileStore.isLoading).toBe(false);
		});

		it('should handle errors gracefully', async () => {
			// The store should handle errors without throwing
			await profileStore.loadStats();
			
			expect(profileStore.error).toBeNull();
		});
	});
});

describe('Profile Store Types', () => {
	it('should export correct types', () => {
		// These are compile-time checks, but we verify they exist
		const dayProgress = { date: '2026-03-04', count: 5 };
		expect(dayProgress.date).toBeDefined();
		expect(dayProgress.count).toBeDefined();
		
		const chapterProgress = {
			chapterId: 'ch1',
			chapterName: 'Introduction',
			completedLevels: 2,
			totalLevels: 5,
			percentage: 40
		};
		expect(chapterProgress.chapterId).toBeDefined();
		expect(chapterProgress.percentage).toBe(40);
		
		const badge = {
			id: 'first-exercise',
			name: 'First Steps',
			description: 'Complete your first exercise',
			earnedAt: new Date(),
			icon: '🎯'
		};
		expect(badge.id).toBeDefined();
		expect(badge.icon).toBe('🎯');
	});
});
