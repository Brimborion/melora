<script lang="ts">
	import type { Level } from '$lib/types';
	import ExerciseProgress from './ExerciseProgress.svelte';

	interface Props {
		level: Level;
		bestScore?: number;
		completed?: boolean;
	}

	let { level, bestScore = 0, completed = false }: Props = $props();

	// Map exercise type to display label - using $derived.by for complex logic
	let exerciseTypeLabel = $derived.by(() => {
		switch (level.exerciseType) {
			case 'interval-identification':
				return 'Intervals';
			case 'chord-identification':
				return 'Chords';
			case 'melody-repetition':
				return 'Melodies';
			case 'note-identification':
				return 'Notes';
			case 'pitch-comparison':
				return 'Pitch';
			default:
				return level.exerciseType;
		}
	});

	// Map difficulty to display label with appropriate styling - using $derived.by for complex logic
	let difficultyLabel = $derived.by(() => {
		switch (level.difficulty) {
			case 'beginner':
				return 'Beginner';
			case 'intermediate':
				return 'Intermediate';
			case 'advanced':
				return 'Advanced';
			case 'master':
				return 'Master';
			default:
				return level.difficulty;
		}
	});

	// Determine card status
	let cardAriaLabel = $derived(
		`${level.title}, ${exerciseTypeLabel}, Chapter ${level.chapter}, ${difficultyLabel}, ` +
		(completed ? 'Completed' : bestScore > 0 ? `Best score ${bestScore} percent` : 'Not started')
	);
</script>

<article 
	class="exercise-card"
	class:exercise-card--completed={completed}
	class:exercise-card--locked={!level.unlocked}
	aria-label={cardAriaLabel}
>
	<div class="exercise-card__header">
		<span class="exercise-card__chapter">Chapter {level.chapter}</span>
		<span 
			class="exercise-card__type"
			aria-label="Exercise type: {exerciseTypeLabel}"
		>
			{exerciseTypeLabel}
		</span>
	</div>

	<h3 class="exercise-card__title">{level.title}</h3>
	
	<p class="exercise-card__description">{level.description}</p>

	<div class="exercise-card__meta">
		<span 
			class="exercise-card__difficulty"
			class:difficulty--beginner={level.difficulty === 'beginner'}
			class:difficulty--intermediate={level.difficulty === 'intermediate'}
			class:difficulty--advanced={level.difficulty === 'advanced'}
		>
			{difficultyLabel}
		</span>
	</div>

	<div class="exercise-card__progress">
		<ExerciseProgress {bestScore} {completed} />
	</div>

	{#if !level.unlocked}
		<div class="exercise-card__lock-overlay" aria-hidden="true">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="lock-icon">
				<path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
			</svg>
			<span>Complete previous levels to unlock</span>
		</div>
	{/if}
</article>

<style>
	.exercise-card {
		background: var(--color-primary, #2D1B4E);
		border: 1px solid var(--color-accent, #D4AF37);
		border-radius: 0.75rem;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
		position: relative;
		overflow: hidden;
	}

	.exercise-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(212, 175, 55, 0.15);
	}

	.exercise-card:focus-within {
		outline: 2px solid var(--color-accent, #D4AF37);
		outline-offset: 2px;
	}

	.exercise-card--completed {
		border-color: var(--color-success, #2ECC71);
	}

	.exercise-card--locked {
		opacity: 0.7;
	}

	.exercise-card__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.exercise-card__chapter {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-accent, #D4AF37);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.exercise-card__type {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-secondary, #1A5F5F);
		background: rgba(26, 95, 95, 0.2);
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
	}

	.exercise-card__title {
		font-family: 'Playfair Display', serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text-light, #F5E6D3);
		margin: 0;
		line-height: 1.3;
	}

	.exercise-card__description {
		font-size: 0.875rem;
		color: rgba(245, 230, 211, 0.8);
		margin: 0;
		line-height: 1.5;
	}

	.exercise-card__meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.exercise-card__difficulty {
		font-size: 0.75rem;
		font-weight: 500;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		background: rgba(255, 255, 255, 0.1);
		color: var(--color-text-light, #F5E6D3);
	}

	.difficulty--beginner {
		background: rgba(46, 204, 113, 0.2);
		color: var(--color-success, #2ECC71);
	}

	.difficulty--intermediate {
		background: rgba(241, 196, 15, 0.2);
		color: #F1C40F;
	}

	.difficulty--advanced {
		background: rgba(231, 76, 60, 0.2);
		color: var(--color-error, #E74C3C);
	}

	.exercise-card__progress {
		margin-top: auto;
		padding-top: 0.5rem;
	}

	.exercise-card__lock-overlay {
		position: absolute;
		inset: 0;
		background: rgba(26, 26, 46, 0.85);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		color: var(--color-text-light, #F5E6D3);
		font-size: 0.875rem;
		font-weight: 500;
	}

	.lock-icon {
		width: 32px;
		height: 32px;
		color: var(--color-accent, #D4AF37);
	}
</style>
