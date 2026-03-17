<script lang="ts">
	interface Props {
		bestScore?: number;
		completed?: boolean;
	}

	let { bestScore = 0, completed = false }: Props = $props();

	// Minimum score required to consider an exercise completed
	const COMPLETION_THRESHOLD = 70;
	
	// Calculate progress percentage (considering 70 as passing score)
	let progressPercent = $derived(completed ? 100 : Math.min(bestScore, 100));
	
	// Determine status text
	let statusText = $derived(
		completed 
			? 'Completed' 
			: bestScore > 0 
				? `${bestScore}%` 
				: 'Not started'
	);
</script>

<div 
	class="exercise-progress" 
	role="status" 
	aria-label={completed ? 'Exercise completed' : `Best score: ${bestScore}%`}
>
	<div class="progress-bar" aria-hidden="true">
		<div 
			class="progress-bar__fill" 
			class:progress-bar__fill--completed={completed}
			style="width: {progressPercent}%"
		></div>
	</div>
	<span class="progress-text" aria-hidden="true">{statusText}</span>
</div>

<style>
	.exercise-progress {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.progress-bar {
		flex: 1;
		height: 6px;
		background: rgba(26, 95, 95, 0.3);
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-bar__fill {
		height: 100%;
		background: var(--color-secondary, #1A5F5F);
		border-radius: 3px;
		transition: width 0.3s ease;
	}

	.progress-bar__fill--completed {
		background: var(--color-success, #2ECC71);
	}

	.progress-text {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-text-light, #F5E6D3);
		min-width: 3.5rem;
		text-align: right;
	}
</style>
