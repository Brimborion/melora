<script lang="ts">
	import AccessibilitySection from '$lib/components/settings/AccessibilitySection.svelte';
	import DifficultySection from '$lib/components/settings/DifficultySection.svelte';
	import AccountDeletionSection from '$lib/components/settings/AccountDeletionSection.svelte';
	import CreditsSection from '$lib/components/settings/CreditsSection.svelte';
</script>

<svelte:head>
	<title>Settings | Melora</title>
	<meta name="description" content="Manage your app preferences and accessibility settings">
</svelte:head>

<main class="settings-page">
	<div class="settings-page__container">
		<header class="settings-header">
			<h1 class="settings-title">Settings</h1>
			<p class="settings-subtitle">Customize your experience</p>
		</header>

		<div class="settings-sections">
			<AccessibilitySection />
			<DifficultySection />
			<AccountDeletionSection />
			<CreditsSection />
		</div>
	</div>
</main>

<style>
	.settings-page {
		min-height: 100vh;
		background: var(--color-dark-bg, #1A1A2E);
		padding: 1.5rem 1rem 3rem;
	}

	.settings-page__container {
		max-width: 600px;
		margin: 0 auto;
	}

	.settings-header {
		margin-bottom: 2rem;
		text-align: center;
	}

	.settings-title {
		font-family: var(--font-heading, 'Playfair Display', serif);
		font-size: 2rem;
		font-weight: 600;
		color: var(--color-secondary, #D4AF37);
		margin: 0 0 0.5rem 0;
	}

	.settings-subtitle {
		font-family: var(--font-body, 'Inter', sans-serif);
		font-size: 1rem;
		color: var(--color-warm-cream, #F5E6D3);
		opacity: 0.8;
		margin: 0;
	}

	.settings-sections {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	@media (max-width: 480px) {
		.settings-page {
			padding: 1rem 0.75rem 2rem;
		}

		.settings-title {
			font-size: 1.75rem;
		}
	}
</style>
