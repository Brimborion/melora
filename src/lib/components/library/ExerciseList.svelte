<script lang="ts">
	import type { Level } from '$lib/types';
	import ExerciseCard from './ExerciseCard.svelte';

	interface Props {
		levels: Level[];
		progressMap: Map<string, number>;
	}

	let { levels, progressMap }: Props = $props();

	// Minimum score required to consider an exercise completed
	const COMPLETION_THRESHOLD = 70;

	// Group levels by chapter - using $derived.by for complex derived logic
	let levelsByChapter = $derived.by(() => {
		const grouped = new Map<number, Level[]>();
		
		for (const level of levels) {
			const chapter = level.chapter;
			if (!grouped.has(chapter)) {
				grouped.set(chapter, []);
			}
			grouped.get(chapter)!.push(level);
		}
		
		// Sort chapters and levels
		const sorted = new Map<number, Level[]>();
		const sortedKeys = Array.from(grouped.keys()).sort((a, b) => a - b);
		for (const key of sortedKeys) {
			sorted.set(key, grouped.get(key)!);
		}
		
		return sorted;
	});

	// Get best score for a level
	function getBestScore(levelId: string): number {
		return progressMap.get(levelId) ?? 0;
	}

	// Check if level is completed (score >= COMPLETION_THRESHOLD)
	function isCompleted(levelId: string): boolean {
		const score = progressMap.get(levelId) ?? 0;
		return score >= COMPLETION_THRESHOLD;
	}
</script>

<div 
	class="exercise-list"
	role="list" 
	aria-label="Exercise library"
>
	{#if levels.length === 0}
		<div class="exercise-list__empty" role="status">
			<p>No exercises available.</p>
		</div>
	{:else}
		{#each [...levelsByChapter.entries()] as [chapter, chapterLevels]}
			<section class="chapter-section" aria-labelledby="chapter-{chapter}-heading">
				<h2 id="chapter-{chapter}-heading" class="chapter-heading">
					Chapter {chapter}
				</h2>
				
				<div class="exercise-grid" role="list">
					{#each chapterLevels as level (level.id)}
						<div role="listitem">
							<ExerciseCard 
								{level}
								bestScore={getBestScore(level.id)}
								completed={isCompleted(level.id)}
							/>
						</div>
					{/each}
				</div>
			</section>
		{/each}
	{/if}
</div>

<style>
	.exercise-list {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.exercise-list__empty {
		text-align: center;
		padding: 3rem;
		color: var(--color-text-light, #F5E6D3);
		font-size: 1rem;
	}

	.chapter-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.chapter-heading {
		font-family: 'Playfair Display', serif;
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-accent, #D4AF37);
		margin: 0;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid rgba(212, 175, 55, 0.3);
	}

	.exercise-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}
</style>
