<script lang="ts">
	/**
	 * Home Page - Main entry point
	 * Checks if user has completed initial setup and redirects accordingly
	 */

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { preferencesStore } from '$lib/stores/preferences.svelte';

	let isReady = $state(false);

	onMount(async () => {
		if (!browser) return;

		// Load preferences
		await preferencesStore.load();

		// Check if user has completed initial setup
		// A user is considered "new" only if updatedAt doesn't exist
		// (meaning they've never saved preferences after initial creation)
		const prefs = preferencesStore.preferences;
		const isNewUser = !prefs.updatedAt;

		// For new users, redirect to setup
		// For returning users, show the journey map
		if (isNewUser) {
			goto('/setup');
		} else {
			// Apply accessibility settings from preferences
			applyAccessibilitySettings(prefs.highContrastMode, prefs.reducedMotion);
		}

		isReady = true;
	});

	function applyAccessibilitySettings(highContrast: boolean, reducedMotion: boolean) {
		if (!browser) return;

		// Apply high contrast
		if (highContrast) {
			document.documentElement.classList.add('high-contrast');
		} else {
			document.documentElement.classList.remove('high-contrast');
		}

		// Apply reduced motion
		if (reducedMotion) {
			document.documentElement.classList.add('reduced-motion');
		} else {
			document.documentElement.classList.remove('reduced-motion');
		}
	}
</script>

<svelte:head>
	<title>Melora - Music Ear Training</title>
	<meta name="description" content="Train your musical ear with Melora" />
</svelte:head>

{#if isReady}
	<div class="journey-map">
		<div class="welcome-banner">
			<h1>Welcome to Melora</h1>
			<p class="welcome-message">Your musical journey awaits!</p>
			<div class="user-preferences">
				<span class="difficulty-badge" class:beginner={preferencesStore.preferences.difficulty === 'beginner'} class:intermediate={preferencesStore.preferences.difficulty === 'intermediate'} class:advanced={preferencesStore.preferences.difficulty === 'advanced'}>
					{preferencesStore.preferences.difficulty}
				</span>
			</div>
		</div>
		
		<div class="journey-content">
			<section class="levels-section">
				<h2>Your Learning Path</h2>
				<p class="section-description">
					{#if preferencesStore.preferences.difficulty === 'beginner'}
						Start with interval recognition to build your foundation.
					{:else if preferencesStore.preferences.difficulty === 'intermediate'}
						Ready to take on chord progressions and more complex intervals.
					{:else}
						Challenge yourself with advanced harmonic analysis.
					{/if}
				</p>
				
				<div class="level-grid">
					<div class="level-card locked" tabindex="0" role="button" aria-disabled="true">
						<div class="level-icon">
							<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
						</div>
						<h3>Intervals</h3>
						<p>Learn to identify the distance between notes</p>
						<span class="level-status">Coming Soon</span>
					</div>
					
					<div class="level-card locked" tabindex="0" role="button" aria-disabled="true">
						<div class="level-icon">
							<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
						</div>
						<h3>Chords</h3>
						<p>Recognize major, minor, and extended chords</p>
						<span class="level-status">Coming Soon</span>
					</div>
					
					<div class="level-card locked" tabindex="0" role="button" aria-disabled="true">
						<div class="level-icon">
							<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
						</div>
						<h3>Scales</h3>
						<p>Identify major, minor, and modal scales</p>
						<span class="level-status">Coming Soon</span>
					</div>
					
					<div class="level-card locked" tabindex="0" role="button" aria-disabled="true">
						<div class="level-icon">
							<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
						</div>
						<h3>Perfect Pitch</h3>
						<p>Identify individual notes by ear</p>
						<span class="level-status">Coming Soon</span>
					</div>
				</div>
			</section>
			
			<section class="quick-start">
				<h2>Ready to Begin?</h2>
				<p>Tap any unlocked level above to start your first exercise.</p>
			</section>
		</div>
	</div>
{:else}
	<div class="loading">
		<div class="spinner" role="status" aria-label="Loading"></div>
	</div>
{/if}

<style>
	.journey-map {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: linear-gradient(180deg, var(--color-primary-dark) 0%, var(--color-dark-bg) 100%);
		text-align: center;
	}

	.journey-map h1 {
		font-family: var(--font-heading);
		font-size: 2.5rem;
		color: var(--color-secondary);
		margin-bottom: 0.5rem;
	}

	.journey-map p {
		color: var(--color-soft-rose);
		font-size: 1.125rem;
	}

	.welcome-banner {
		text-align: center;
		margin-bottom: 3rem;
	}

	.welcome-message {
		font-size: 1.25rem;
		margin-bottom: 1rem;
	}

	.user-preferences {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
	}

	.difficulty-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: capitalize;
		background-color: var(--color-primary);
		border: 2px solid var(--color-secondary);
	}

	.difficulty-badge.beginner {
		border-color: var(--color-success);
		color: var(--color-success);
	}

	.difficulty-badge.intermediate {
		border-color: var(--color-warning);
		color: var(--color-warning);
	}

	.difficulty-badge.advanced {
		border-color: var(--color-error);
		color: var(--color-error);
	}

	.journey-content {
		width: 100%;
		max-width: 900px;
	}

	.levels-section {
		margin-bottom: 2rem;
	}

	.levels-section h2 {
		font-family: var(--font-heading);
		font-size: 1.75rem;
		color: var(--color-warm-cream);
		margin-bottom: 0.5rem;
	}

	.section-description {
		color: var(--color-soft-rose);
		margin-bottom: 1.5rem;
	}

	.level-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.level-card {
		background-color: var(--color-primary);
		border: 2px solid var(--color-primary-dark);
		border-radius: 0.75rem;
		padding: 1.5rem;
		text-align: center;
		transition: all 0.2s ease;
		cursor: not-allowed;
	}

	.level-card.locked {
		opacity: 0.6;
	}

	.level-card.locked:hover,
	.level-card.locked:focus {
		border-color: var(--color-secondary);
	}

	.level-icon {
		color: var(--color-soft-rose);
		margin-bottom: 0.75rem;
	}

	.level-card h3 {
		font-family: var(--font-heading);
		font-size: 1.125rem;
		color: var(--color-warm-cream);
		margin-bottom: 0.5rem;
	}

	.level-card p {
		font-size: 0.875rem;
		color: var(--color-soft-rose);
		margin-bottom: 0.75rem;
	}

	.level-status {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-secondary);
	}

	.quick-start {
		text-align: center;
		padding: 2rem;
		background-color: var(--color-primary);
		border-radius: 0.75rem;
		border: 1px solid var(--color-primary-dark);
	}

	.quick-start h2 {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		color: var(--color-warm-cream);
		margin-bottom: 0.5rem;
	}

	.loading {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(180deg, var(--color-primary-dark) 0%, var(--color-dark-bg) 100%);
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--color-primary);
		border-top-color: var(--color-secondary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
