<script lang="ts">
	import type { DayProgress, ChapterProgress, Badge } from '$lib/stores/profile.svelte';
	import { profileStore } from '$lib/stores/profile.svelte';
	import ChapterProgressComponent from './ChapterProgress.svelte';
	import BadgeDisplay from './BadgeDisplay.svelte';
	
	interface Props {
		weeklyProgress?: DayProgress[];
		chapterProgress?: ChapterProgress[];
		badges?: Badge[];
	}
	
	let { 
		weeklyProgress = profileStore.weeklyProgress, 
		chapterProgress = profileStore.chapterProgress,
		badges = profileStore.badges
	}: Props = $props();
	
	// Get day name from date string
	function getDayName(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { weekday: 'short' });
	}
	
	// Find max count for scaling
	function getMaxCount(): number {
		const max = Math.max(...weeklyProgress.map(d => d.count));
		return max > 0 ? max : 1;
	}
</script>

<section class="stats-section" aria-labelledby="stats-heading">
	<h2 id="stats-heading" class="stats-section__title">Statistics</h2>
	
	<!-- Weekly Progress -->
	<article class="stats-subsection" aria-labelledby="weekly-heading">
		<h3 id="weekly-heading" class="stats-subsection__title">Weekly Progress</h3>
		
		<div class="weekly-chart" role="img" aria-label="Weekly exercise chart">
			{#each weeklyProgress as day}
				<div class="weekly-chart__day">
					<div class="weekly-chart__bar-container">
						<div 
							class="weekly-chart__bar" 
							style="height: {(day.count / getMaxCount()) * 100}%"
							aria-hidden="true"
						></div>
					</div>
					<span class="weekly-chart__label">{getDayName(day.date)}</span>
					<span class="weekly-chart__value" aria-label="{day.count} exercises">{day.count}</span>
				</div>
			{/each}
		</div>
	</article>
	
	<!-- Chapter Progress -->
	<article class="stats-subsection" aria-labelledby="chapter-heading">
		<h3 id="chapter-heading" class="stats-subsection__title">Chapter Progress</h3>
		
		<div class="chapter-list" role="list">
			{#each chapterProgress as chapter}
				<ChapterProgressComponent {chapter} />
			{/each}
		</div>
	</article>
	
	<!-- Badges -->
	<article class="stats-subsection" aria-labelledby="badges-heading">
		<h3 id="badges-heading" class="stats-subsection__title">Earned Badges</h3>
		
		{#if badges.length > 0}
			<div class="badge-list" role="list">
				{#each badges as badge}
					<BadgeDisplay {badge} />
				{/each}
			</div>
		{:else}
			<p class="empty-message">No badges earned yet. Complete exercises to earn badges!</p>
		{/if}
	</article>
</section>

<style>
	.stats-section {
		padding: 1rem 0;
	}
	
	.stats-section__title {
		font-family: 'Playfair Display', serif;
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-text, #1A1A2E);
		margin: 0 0 1.25rem 0;
	}
	
	.stats-subsection {
		margin-bottom: 1.5rem;
	}
	
	.stats-subsection__title {
		font-family: 'Inter', sans-serif;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text, #1A1A2E);
		margin: 0 0 0.75rem 0;
	}
	
	/* Weekly Chart */
	.weekly-chart {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		height: 120px;
		background: var(--color-background, #F5E6D3);
		border-radius: 0.5rem;
		padding: 0.75rem;
		gap: 0.5rem;
	}
	
	.weekly-chart__day {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}
	
	.weekly-chart__bar-container {
		flex: 1;
		width: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}
	
	.weekly-chart__bar {
		width: 80%;
		min-height: 4px;
		background: var(--color-accent, #D4AF37);
		border-radius: 2px 2px 0 0;
		transition: height 0.3s ease;
	}
	
	.weekly-chart__label {
		font-family: 'Inter', sans-serif;
		font-size: 0.625rem;
		color: var(--color-text-muted, #666);
		text-transform: uppercase;
	}
	
	.weekly-chart__value {
		font-family: 'Inter', sans-serif;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text, #1A1A2E);
	}
	
	/* Chapter List */
	.chapter-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	
	/* Badge List */
	.badge-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 0.75rem;
	}
	
	.empty-message {
		font-family: 'Inter', sans-serif;
		font-size: 0.875rem;
		color: var(--color-text-muted, #666);
		text-align: center;
		padding: 1rem;
		background: var(--color-background, #F5E6D3);
		border-radius: 0.5rem;
	}
</style>
