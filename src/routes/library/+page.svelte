<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { libraryStore, type LibraryFilter } from '$lib/stores/library.svelte';
	import ExerciseFilter from '$lib/components/library/ExerciseFilter.svelte';
	import ExerciseList from '$lib/components/library/ExerciseList.svelte';

	// Initialize filter from URL query params
	function getInitialFilter(): LibraryFilter {
		const filterParam = $page.url.searchParams.get('filter');
		if (filterParam === 'intervals' || filterParam === 'chords' || filterParam === 'melodies') {
			return filterParam;
		}
		return 'all';
	}

	// Load progress and initialize filter from URL on mount
	onMount(() => {
		libraryStore.loadProgress();
		// Set initial filter from URL
		const initialFilter = getInitialFilter();
		if (initialFilter !== libraryStore.selectedFilter) {
			libraryStore.setFilter(initialFilter);
		}
	});

	function handleFilterChange(filter: LibraryFilter) {
		libraryStore.setFilter(filter);
		
		// Update URL to persist filter
		const url = new URL($page.url);
		if (filter === 'all') {
			url.searchParams.delete('filter');
		} else {
			url.searchParams.set('filter', filter);
		}
		goto(url, { replaceState: true, keepFocus: true });
	}
</script>

<svelte:head>
	<title>Exercise Library - Melora</title>
	<meta name="description" content="Browse and access ear training exercises in the Melora app">
</svelte:head>

<main class="library-page">
	<header class="library-header">
		<h1 class="library-title">Exercise Library</h1>
		<p class="library-subtitle">
			Discover available ear training exercises and track your progress
		</p>
	</header>

	<section aria-label="Exercise filters">
		<ExerciseFilter 
			selectedFilter={libraryStore.selectedFilter} 
			onFilterChange={handleFilterChange}
		/>
	</section>

	<section aria-label="Exercise list">
		<ExerciseList 
			levels={libraryStore.filteredExercises}
			progressMap={libraryStore.progressMap}
		/>
	</section>
</main>

<style>
	.library-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.library-header {
		margin-bottom: 2rem;
		text-align: center;
	}

	.library-title {
		font-family: 'Playfair Display', serif;
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--color-accent, #D4AF37);
		margin: 0 0 0.5rem 0;
	}

	.library-subtitle {
		font-size: 1rem;
		color: rgba(245, 230, 211, 0.8);
		margin: 0;
	}
</style>
