<script lang="ts">
	import { permissionStore } from '$lib/stores/permission.svelte';
</script>

{#if permissionStore.showContextResumedNotification}
	<div class="notification" role="status" aria-live="polite">
		<div class="notification-icon">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
				<path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
				<line x1="12" x2="12" y1="19" y2="22"/>
			</svg>
		</div>
		<div class="notification-content">
			<p class="notification-title">Audio Ready</p>
			<p class="notification-message">Microphone is now active</p>
		</div>
		<button 
			class="dismiss-button" 
			onclick={() => permissionStore.dismissContextNotification()}
			aria-label="Dismiss notification"
			type="button"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="18" x2="6" y1="6" y2="18"/>
				<line x1="6" x2="18" y1="6" y2="18"/>
			</svg>
		</button>
	</div>
{/if}

<style>
	.notification {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		background: linear-gradient(145deg, #2D1B4E 0%, #1A1A2E 100%);
		border: 1px solid #2ECC71;
		border-radius: 12px;
		padding: 1rem;
		max-width: 320px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(46, 204, 113, 0.15);
		z-index: 1000;
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.notification-icon {
		color: #2ECC71;
		flex-shrink: 0;
		padding-top: 2px;
	}

	.notification-content {
		flex: 1;
	}

	.notification-title {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 0.9375rem;
		font-weight: 600;
		color: #F5E6D3;
		margin: 0 0 0.25rem 0;
	}

	.notification-message {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 0.8125rem;
		color: rgba(245, 230, 211, 0.7);
		margin: 0;
	}

	.dismiss-button {
		background: transparent;
		border: none;
		color: rgba(245, 230, 211, 0.5);
		cursor: pointer;
		padding: 4px;
		margin: -4px;
		border-radius: 4px;
		transition: color 0.2s ease, background 0.2s ease;
		min-width: auto;
		min-height: auto;
	}

	.dismiss-button:hover {
		color: #F5E6D3;
		background: rgba(245, 230, 211, 0.1);
	}

	.dismiss-button:focus {
		outline: 2px solid #D4AF37;
		outline-offset: 2px;
	}
</style>
