<script lang="ts">
	/**
	 * Setup Page - Initial User Setup
	 * First-time user onboarding flow
	 */

	import InitialSetup from '$lib/components/InitialSetup.svelte';
	import { preferencesStore } from '$lib/stores/preferences.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	// Load preferences on mount
	$effect(() => {
		if (browser) {
			preferencesStore.load();
		}
	});

	async function handleSetupComplete(data: {
		difficulty: 'beginner' | 'intermediate' | 'advanced';
		highContrastMode: boolean;
		reducedMotion: boolean;
	}) {
		// Save all preferences at once
		await preferencesStore.updateMany({
			difficulty: data.difficulty,
			highContrastMode: data.highContrastMode,
			reducedMotion: data.reducedMotion
		});

		// Apply accessibility settings immediately
		applyAccessibilitySettings(data.highContrastMode, data.reducedMotion);

		// Navigate to the main game/journey page
		goto('/');
	}

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
	<title>Welcome to Melora - Setup</title>
	<meta name="description" content="Set up your musical journey with Melora" />
</svelte:head>

<main class="setup-page">
	<div class="welcome-header">
		<h1 class="app-title">Melora</h1>
		<p class="app-tagline">Train Your Musical Ear</p>
	</div>

	{#if preferencesStore.isLoading}
		<div class="loading">
			<div class="spinner" role="status" aria-label="Loading"></div>
			<p>Loading...</p>
		</div>
	{:else if preferencesStore.error}
		<div class="error" role="alert">
			<p>Unable to load preferences. Please try again.</p>
			<button class="btn btn-primary" onclick={() => preferencesStore.load()}>
				Retry
			</button>
		</div>
	{:else}
		<InitialSetup onComplete={handleSetupComplete} />
	{/if}
</main>

<style>
	.setup-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: linear-gradient(180deg, var(--color-primary-dark) 0%, var(--color-dark-bg) 100%);
	}

	.welcome-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.app-title {
		font-family: var(--font-heading);
		font-size: 3rem;
		color: var(--color-secondary);
		margin: 0;
		background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-soft-rose) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.app-tagline {
		font-size: 1.125rem;
		color: var(--color-soft-rose);
		margin-top: 0.5rem;
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		color: var(--color-warm-cream);
	}

	.error {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		color: var(--color-error);
		text-align: center;
	}

	.error .btn {
		margin-top: 1rem;
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

	/* Apply high contrast to entire page */
	:global(html.high-contrast) {
		--color-warm-cream: #FFFFFF;
		--color-soft-rose: #CCCCCC;
		--color-primary: #000000;
		--color-primary-dark: #333333;
		--color-primary-light: #222222;
	}

	/* Apply reduced motion to entire page */
	:global(html.reduced-motion),
	:global(html.reduced-motion *) {
		transition: none !important;
		animation: none !important;
	}
</style>
