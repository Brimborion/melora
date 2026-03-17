<script lang="ts">
	import type { LibraryFilter } from '$lib/stores/library.svelte';

	interface Props {
		selectedFilter: LibraryFilter;
		onFilterChange: (filter: LibraryFilter) => void;
	}

	let { selectedFilter, onFilterChange }: Props = $props();

	const filters: { value: LibraryFilter; label: string; ariaLabel: string }[] = [
		{ value: 'all', label: 'All', ariaLabel: 'Show all exercises' },
		{ value: 'intervals', label: 'Intervals', ariaLabel: 'Show only interval exercises' },
		{ value: 'chords', label: 'Chords', ariaLabel: 'Show only chord exercises' },
		{ value: 'melodies', label: 'Melodies', ariaLabel: 'Show only melody exercises' }
	];

	function handleKeyDown(event: KeyboardEvent, filter: LibraryFilter) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onFilterChange(filter);
		}
	}
</script>

<div 
	class="exercise-filter" 
	role="group" 
	aria-label="Filter exercises by type"
>
	<div class="filter-buttons" role="tablist" aria-label="Exercise type filters">
		{#each filters as filter}
			<button
				class="filter-button"
				class:filter-button--active={selectedFilter === filter.value}
				role="tab"
				aria-selected={selectedFilter === filter.value}
				aria-label={filter.ariaLabel}
				tabindex={selectedFilter === filter.value ? 0 : -1}
				onclick={() => onFilterChange(filter.value)}
				onkeydown={(e) => handleKeyDown(e, filter.value)}
			>
				{filter.label}
			</button>
		{/each}
	</div>
</div>

<!-- Live region for screen reader announcements -->
<div 
	class="sr-only" 
	aria-live="polite" 
	aria-atomic="true"
>
	{selectedFilter === 'all' 
		? 'Showing all exercises' 
		: `Showing ${selectedFilter} exercises`}
</div>

<style>
	.exercise-filter {
		margin-bottom: 1.5rem;
	}

	.filter-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.filter-button {
		padding: 0.625rem 1.25rem;
		border: 1px solid var(--color-accent, #D4AF37);
		border-radius: 9999px;
		background: transparent;
		color: var(--color-text-light, #F5E6D3);
		font-family: 'Inter', sans-serif;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 44px;
		min-width: 44px;
	}

	.filter-button:hover {
		background: rgba(212, 175, 55, 0.15);
	}

	.filter-button:focus {
		outline: 2px solid var(--color-accent, #D4AF37);
		outline-offset: 2px;
	}

	.filter-button--active {
		background: var(--color-accent, #D4AF37);
		color: var(--color-primary, #2D1B4E);
		font-weight: 600;
	}

	.filter-button--active:hover {
		background: var(--color-accent, #D4AF37);
		filter: brightness(1.1);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
