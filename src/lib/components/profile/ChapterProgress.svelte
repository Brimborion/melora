<script lang="ts">
	import type { ChapterProgress as ChapterProgressType } from '$lib/stores/profile.svelte';
	
	interface Props {
		chapter: ChapterProgressType;
	}
	
	let { chapter }: Props = $props();
</script>

<div class="chapter-progress" role="listitem" aria-label="{chapter.chapterName}: {chapter.completedLevels} of {chapter.totalLevels} completed">
	<div class="chapter-progress__header">
		<span class="chapter-progress__name">{chapter.chapterName}</span>
		<span class="chapter-progress__count">{chapter.completedLevels}/{chapter.totalLevels}</span>
	</div>
	
	<div class="chapter-progress__bar-container" role="progressbar" aria-valuenow={chapter.percentage} aria-valuemin={0} aria-valuemax={100} aria-label="Progress: {chapter.percentage}%">
		<div 
			class="chapter-progress__bar" 
			class:chapter-progress__bar--complete={chapter.percentage === 100}
			style="width: {chapter.percentage}%"
		></div>
	</div>
	
	<span class="chapter-progress__percentage">{chapter.percentage}%</span>
</div>

<style>
	.chapter-progress {
		background: var(--color-background, #F5E6D3);
		border-radius: 0.5rem;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.chapter-progress__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.chapter-progress__name {
		font-family: 'Inter', sans-serif;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text, #1A1A2E);
	}
	
	.chapter-progress__count {
		font-family: 'Inter', sans-serif;
		font-size: 0.75rem;
		color: var(--color-text-muted, #666);
	}
	
	.chapter-progress__bar-container {
		height: 8px;
		background: rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		overflow: hidden;
	}
	
	.chapter-progress__bar {
		height: 100%;
		background: var(--color-accent, #D4AF37);
		border-radius: 4px;
		transition: width 0.3s ease;
	}
	
	.chapter-progress__bar--complete {
		background: var(--color-success, #2ECC71);
	}
	
	.chapter-progress__percentage {
		font-family: 'Inter', sans-serif;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-muted, #666);
		align-self: flex-end;
	}
</style>
