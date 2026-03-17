<script lang="ts">
	/**
	 * DifficultySelector Component
	 * Allows user to select difficulty level: beginner, intermediate, or advanced
	 */

	interface Props {
		value: 'beginner' | 'intermediate' | 'advanced';
		onchange: (value: 'beginner' | 'intermediate' | 'advanced') => void;
	}

	let { value = $bindable('beginner'), onchange }: Props = $props();

	const difficulties = [
		{ id: 'beginner', label: 'Beginner', description: 'Start your musical journey' },
		{ id: 'intermediate', label: 'Intermediate', description: 'For those with some experience' },
		{ id: 'advanced', label: 'Advanced', description: 'Challenge yourself' }
	] as const;

	function selectDifficulty(id: 'beginner' | 'intermediate' | 'advanced') {
		value = id;
		onchange(id);
	}
</script>

<fieldset class="difficulty-selector">
	<legend class="sr-only">Select your difficulty level</legend>
	
	<div class="difficulty-options">
		{#each difficulties as difficulty}
			<button
				type="button"
				class="difficulty-btn"
				class:selected={value === difficulty.id}
				onclick={() => selectDifficulty(difficulty.id)}
				aria-pressed={value === difficulty.id}
			>
				<span class="difficulty-label">{difficulty.label}</span>
				<span class="difficulty-description">{difficulty.description}</span>
			</button>
		{/each}
	</div>
</fieldset>

<style>
	.difficulty-selector {
		border: none;
		padding: 0;
		margin: 0;
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

	.difficulty-options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.difficulty-btn {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 1rem 1.5rem;
		background-color: var(--color-primary);
		border: 2px solid var(--color-primary-dark);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
		min-height: 44px;
		min-width: 44px;
	}

	.difficulty-btn:hover {
		border-color: var(--color-secondary);
		transform: translateY(-2px);
	}

	.difficulty-btn:focus {
		outline: none;
		box-shadow: 0 0 0 2px var(--color-dark-bg), 0 0 0 4px var(--color-secondary);
	}

	.difficulty-btn.selected {
		border-color: var(--color-secondary);
		background-color: var(--color-primary-light);
		box-shadow: 0 0 0 1px var(--color-secondary);
	}

	.difficulty-label {
		font-family: var(--font-heading);
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-warm-cream);
	}

	.difficulty-description {
		font-size: 0.875rem;
		color: var(--color-soft-rose);
		margin-top: 0.25rem;
	}
</style>
