<script lang="ts">
	import { permissionStore } from '$lib/stores/permission.svelte';

	interface Props {
		onClose?: () => void;
	}

	let { onClose }: Props = $props();

	let isLoading = $derived(permissionStore.isRequesting);

	async function handleRequestPermission() {
		await permissionStore.requestPermission();
		if (permissionStore.isGranted && onClose) {
			onClose();
		}
	}

	function handleClose() {
		permissionStore.closeModal();
		if (onClose) {
			onClose();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if permissionStore.showPermissionModal}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div 
		class="modal-overlay" 
		onclick={handleClose}
		onkeydown={(e) => e.key === 'Enter' && handleClose()}
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div 
			class="modal-content" 
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<div class="modal-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
					<path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
					<line x1="12" x2="12" y1="19" y2="22"/>
				</svg>
			</div>
			
			<h2 id="permission-title">Microphone Access Needed</h2>
			
			<p class="modal-description">
				To detect your singing pitch and help you improve, we need access to your microphone.
			</p>
			
			<p class="modal-note">
				Your microphone input is processed locally and never leaves your device.
			</p>
			
			<div class="button-group">
				<button 
					onclick={handleRequestPermission} 
					disabled={isLoading}
					class="btn-primary"
					type="button"
				>
					{#if isLoading}
						<span class="loading-spinner"></span>
						Requesting...
					{:else}
						Allow Microphone
					{/if}
				</button>
				<button 
					onclick={handleClose} 
					class="btn-secondary"
					type="button"
				>
					Not Now
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(26, 26, 46, 0.85);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.modal-content {
		background: linear-gradient(145deg, #2D1B4E 0%, #1A1A2E 100%);
		border: 1px solid #D4AF37;
		border-radius: 16px;
		padding: 2.5rem;
		max-width: 420px;
		width: 100%;
		text-align: center;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(212, 175, 55, 0.1);
		animation: slideUp 0.3s ease-out;
	}

	@keyframes slideUp {
		from { 
			opacity: 0;
			transform: translateY(20px);
		}
		to { 
			opacity: 1;
			transform: translateY(0);
		}
	}

	.modal-icon {
		color: #D4AF37;
		margin-bottom: 1.5rem;
	}

	.modal-icon svg {
		width: 64px;
		height: 64px;
	}

	h2 {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.75rem;
		font-weight: 600;
		color: #D4AF37;
		margin: 0 0 1rem 0;
	}

	.modal-description {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 1rem;
		line-height: 1.6;
		color: #F5E6D3;
		margin: 0 0 1rem 0;
	}

	.modal-note {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 0.875rem;
		line-height: 1.5;
		color: rgba(245, 230, 211, 0.7);
		margin: 0 0 2rem 0;
		padding: 0.75rem;
		background: rgba(212, 175, 55, 0.1);
		border-radius: 8px;
	}

	.button-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	button {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 1rem;
		font-weight: 500;
		padding: 0.875rem 1.5rem;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 44px;
	}

	button:focus {
		outline: 2px solid #D4AF37;
		outline-offset: 2px;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-primary {
		background: #D4AF37;
		color: #2D1B4E;
		border: none;
		font-weight: 600;
	}

	.btn-primary:hover:not(:disabled) {
		background: #E5C04B;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
	}

	.btn-primary:active:not(:disabled) {
		transform: translateY(0);
	}

	.btn-secondary {
		background: transparent;
		color: #D4AF37;
		border: 1px solid #D4AF37;
	}

	.btn-secondary:hover:not(:disabled) {
		background: rgba(212, 175, 55, 0.1);
	}

	.loading-spinner {
		display: inline-block;
		width: 16px;
		height: 16px;
		border: 2px solid #2D1B4E;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		margin-right: 0.5rem;
		vertical-align: middle;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	@media (min-width: 480px) {
		.button-group {
			flex-direction: row;
			justify-content: center;
		}

		.btn-primary, .btn-secondary {
			flex: 1;
			max-width: 160px;
		}
	}
</style>
