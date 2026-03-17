<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { profileStore } from '$lib/stores/profile.svelte';
	import ProfileHeader from '$lib/components/profile/ProfileHeader.svelte';
	import StatsSection from '$lib/components/profile/StatsSection.svelte';
	
	// Load profile data on mount
	onMount(() => {
		if (browser) {
			profileStore.loadStats();
		}
	});
</script>

<svelte:head>
	<title>My Profile | Melora</title>
	<meta name="description" content="View your profile and statistics">
</svelte:head>

<main class="profile-page">
	<div class="profile-page__container">
		{#if profileStore.isLoading && !profileStore.isLoaded}
			<div class="profile-page__loading" role="status" aria-live="polite">
				<div class="loading-spinner" aria-hidden="true"></div>
				<p>Loading profile...</p>
			</div>
		{:else if profileStore.error}
			<div class="profile-page__error" role="alert">
				<p>Error loading profile: {profileStore.error}</p>
				<button 
					class="retry-button"
					onclick={() => profileStore.loadStats()}
					type="button"
				>
					Try Again
				</button>
			</div>
		{:else}
			<ProfileHeader />
			<StatsSection />
		{/if}
	</div>
</main>

<style>
	.profile-page {
		min-height: 100vh;
		background: var(--color-background, #F5E6D3);
		padding: 1rem;
	}
	
	.profile-page__container {
		max-width: 600px;
		margin: 0 auto;
	}
	
	.profile-page__loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 50vh;
		gap: 1rem;
	}
	
	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--color-background, #F5E6D3);
		border-top-color: var(--color-accent, #D4AF37);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
	
	.profile-page__loading p {
		font-family: 'Inter', sans-serif;
		font-size: 0.875rem;
		color: var(--color-text-muted, #666);
	}
	
	.profile-page__error {
		text-align: center;
		padding: 2rem;
		background: var(--color-background, #F5E6D3);
		border-radius: 0.5rem;
	}
	
	.profile-page__error p {
		font-family: 'Inter', sans-serif;
		font-size: 0.875rem;
		color: var(--color-error, #E74C3C);
		margin-bottom: 1rem;
	}
	
	.retry-button {
		font-family: 'Inter', sans-serif;
		font-size: 0.875rem;
		font-weight: 600;
		padding: 0.75rem 1.5rem;
		background: var(--color-accent, #D4AF37);
		color: var(--color-primary, #2D1B4E);
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: opacity 0.2s ease;
		min-height: 44px;
	}
	
	.retry-button:hover {
		opacity: 0.9;
	}
	
	.retry-button:focus {
		outline: 2px solid var(--color-accent, #D4AF37);
		outline-offset: 2px;
	}
</style>
