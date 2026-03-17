<script lang="ts">
	import { preferencesStore } from '$lib/stores/preferences.svelte';
	import ConfirmationDialog from './ConfirmationDialog.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	// State for confirmation dialog
	let showConfirmDialog = $state(false);
	let isDeleting = $state(false);

	// Handle account deletion
	async function handleDeleteAccount() {
		isDeleting = true;
		try {
			await preferencesStore.deleteAccount();
			
			// Redirect to setup page after successful deletion
			if (browser) {
				goto('/setup');
			}
		} catch (error) {
			console.error('Failed to delete account:', error);
			isDeleting = false;
			showConfirmDialog = false;
		}
	}

	// Open confirmation dialog
	function confirmDelete() {
		showConfirmDialog = true;
	}

	// Cancel deletion
	function cancelDelete() {
		showConfirmDialog = false;
	}
</script>

<section class="account-deletion-section" aria-labelledby="account-deletion-heading">
	<h2 id="account-deletion-heading" class="section-title">Account</h2>
	
	<div class="setting-item">
		<div class="setting-info">
			<span class="setting-label">Delete Account</span>
			<p class="setting-description">
				Permanently delete your account and all associated data
			</p>
		</div>
		<button
			type="button"
			class="delete-button"
			onclick={confirmDelete}
			disabled={isDeleting}
		>
			{isDeleting ? 'Deleting...' : 'Delete Account'}
		</button>
	</div>

	<!-- Confirmation Dialog -->
	<ConfirmationDialog
		isOpen={showConfirmDialog}
		title="Delete Account?"
		message="This action cannot be undone. All your progress, scores, preferences, and personal data will be permanently deleted from this device. You will need to complete the initial setup again to use the app."
		confirmLabel="Delete"
		cancelLabel="Cancel"
		variant="danger"
		onConfirm={handleDeleteAccount}
		onCancel={cancelDelete}
	/>
</section>

<style>
	.account-deletion-section {
		background: var(--color-primary, #2D1B4E);
		border: 1px solid var(--color-error, #E74C3C);
		border-radius: 0.75rem;
		padding: 1.5rem;
	}

	.section-title {
		font-family: var(--font-heading, 'Playfair Display', serif);
		font-size: 1.25rem;
		color: var(--color-error, #E74C3C);
		margin: 0 0 1.25rem 0;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid rgba(231, 76, 60, 0.3);
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

	.delete-button {
		font-family: var(--font-body, 'Inter', sans-serif);
		font-size: 0.875rem;
		font-weight: 600;
		padding: 0.625rem 1.25rem;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 44px;
		border: none;
		background: var(--color-error, #E74C3C);
		color: white;
	}

	.delete-button:hover:not(:disabled) {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	.delete-button:focus {
		outline: 2px solid var(--color-secondary, #D4AF37);
		outline-offset: 2px;
	}

	.delete-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	@media (max-width: 480px) {
		.setting-item {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.delete-button {
			width: 100%;
		}
	}
</style>
