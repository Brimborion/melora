<script lang="ts">
	import { preferencesStore } from '$lib/stores/preferences.svelte';
	import ConfirmationDialog from './ConfirmationDialog.svelte';

	// Difficulty options with descriptions
	const difficultyOptions = [
		{ 
			value: 'beginner', 
			label: 'Beginner',
			description: 'Simple intervals, slower pace, more forgiving scoring'
		},
		{ 
			value: 'intermediate', 
			label: 'Intermediate',
			description: 'All intervals, standard pace, normal scoring'
		},
		{ 
			value: 'advanced', 
			label: 'Advanced',
			description: 'Complex intervals, faster pace, strict scoring'
		}
	] as const;

	// State for confirmation dialog
	let showConfirmDialog = $state(false);
	let pendingDifficulty = $state<'beginner' | 'intermediate' | 'advanced' | null>(null);

	// Handle difficulty change with confirmation
	function handleDifficultyChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newDifficulty = target.value as 'beginner' | 'intermediate' | 'advanced';
		
		// If changing to a harder difficulty, show confirmation
		if (newDifficulty !== preferencesStore.preferences.difficulty) {
			pendingDifficulty = newDifficulty;
			showConfirmDialog = true;
		}
	}

	// Confirm the difficulty change
	function confirmDifficultyChange() {
		if (pendingDifficulty) {
			preferencesStore.setDifficulty(pendingDifficulty);
		}
		closeDialog();
	}

	// Cancel the difficulty change
	function closeDialog() {
		showConfirmDialog = false;
		pendingDifficulty = null;
	}
</script>

<section class="difficulty-section" aria-labelledby="difficulty-heading">
	<h2 id="difficulty-heading" class="section-title">Difficulty Level</h2>
	
	<div class="setting-item setting-item--select">
		<div class="setting-info">
			<label for="difficulty-select" class="setting-label">
				Current Difficulty
			</label>
			<p class="setting-description">
				Affects exercise complexity and scoring criteria
			</p>
		</div>
		<select
			id="difficulty-select"
			value={preferencesStore.preferences.difficulty}
			onchange={handleDifficultyChange}
			class="setting-select"
		>
			{#each difficultyOptions as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>

	<!-- Difficulty descriptions -->
	<div class="difficulty-info" role="region" aria-label="Difficulty level information">
		{#each difficultyOptions as option}
			<div 
				class="difficulty-card"
				class:difficulty-card--active={preferencesStore.preferences.difficulty === option.value}
				aria-hidden={preferencesStore.preferences.difficulty !== option.value}
			>
				<span class="difficulty-label">{option.label}</span>
				<span class="difficulty-description">{option.description}</span>
			</div>
		{/each}
	</div>

	<!-- Confirmation Dialog -->
	<ConfirmationDialog
		isOpen={showConfirmDialog}
		title="Change Difficulty?"
		message="Changing your difficulty level will affect which exercises you receive. Are you sure you want to change to {pendingDifficulty}?"
		confirmLabel="Yes, Change"
		cancelLabel="Cancel"
		variant="warning"
		onConfirm={confirmDifficultyChange}
		onCancel={closeDialog}
	/>
</section>

<style>
	.difficulty-section {
		background: var(--color-primary, #2D1B4E);
		border: 1px solid var(--color-secondary, #D4AF37);
		border-radius: 0.75rem;
		padding: 1.5rem;
	}

	.section-title {
		font-family: var(--font-heading, 'Playfair Display', serif);
		font-size: 1.25rem;
		color: var(--color-secondary, #D4AF37);
		margin: 0 0 1.25rem 0;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid rgba(212, 175, 55, 0.3);
	}

	.setting-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 0;
	}

	.setting-info {
		flex: 1;
		margin-right: 1rem;
	}

	.setting-label {
		display: block;
		font-family: var(--font-body, 'Inter', sans-serif);
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-warm-cream, #F5E6D3);
		margin-bottom: 0.25rem;
	}

	.setting-description {
		font-family: var(--font-body, 'Inter', sans-serif);
		font-size: 0.8125rem;
		color: var(--color-warm-cream, #F5E6D3);
		opacity: 0.7;
		margin: 0;
		line-height: 1.4;
	}

	/* Select */
	.setting-select {
		font-family: var(--font-body, 'Inter', sans-serif);
		font-size: 0.875rem;
		padding: 0.625rem 2rem 0.625rem 0.875rem;
		background: rgba(245, 230, 211, 0.1);
		border: 1px solid rgba(245, 230, 211, 0.3);
		border-radius: 0.5rem;
		color: var(--color-warm-cream, #F5E6D3);
		cursor: pointer;
		min-height: 44px;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23F5E6D3' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.75rem center;
		min-width: 160px;
	}

	.setting-select:focus {
		outline: 2px solid var(--color-secondary, #D4AF37);
		outline-offset: 2px;
	}

	.setting-select option {
		background: var(--color-primary, #2D1B4E);
		color: var(--color-warm-cream, #F5E6D3);
	}

	/* Difficulty info cards */
	.difficulty-info {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
		margin-top: 1.25rem;
	}

	.difficulty-card {
		background: rgba(245, 230, 211, 0.05);
		border: 1px solid rgba(245, 230, 211, 0.15);
		border-radius: 0.5rem;
		padding: 0.875rem;
		text-align: center;
		transition: all 0.2s ease;
	}

	.difficulty-card--active {
		background: rgba(212, 175, 55, 0.15);
		border-color: var(--color-secondary, #D4AF37);
	}

	.difficulty-label {
		display: block;
		font-family: var(--font-body, 'Inter', sans-serif);
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-warm-cream, #F5E6D3);
		margin-bottom: 0.375rem;
	}

	.difficulty-card--active .difficulty-label {
		color: var(--color-secondary, #D4AF37);
	}

	.difficulty-description {
		display: block;
		font-family: var(--font-body, 'Inter', sans-serif);
		font-size: 0.75rem;
		color: var(--color-warm-cream, #F5E6D3);
		opacity: 0.7;
		line-height: 1.4;
	}

	@media (max-width: 600px) {
		.difficulty-info {
			grid-template-columns: 1fr;
		}

		.setting-item {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.setting-select {
			width: 100%;
		}
	}
</style>
