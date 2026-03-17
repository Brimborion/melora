<script lang="ts">
	/**
	 * Confirmation Dialog Component
	 * A reusable modal dialog for confirming important actions
	 */

	interface Props {
		/** Whether the dialog is visible */
		isOpen: boolean;
		/** Title of the dialog */
		title: string;
		/** Message explaining what is being confirmed */
		message: string;
		/** Label for the confirm button */
		confirmLabel?: string;
		/** Label for the cancel button */
		cancelLabel?: string;
		/** Severity level for styling */
		variant?: 'warning' | 'danger' | 'info';
		/** Callback when user confirms */
		onConfirm: () => void;
		/** Callback when user cancels */
		onCancel: () => void;
	}

	let {
			isOpen = false,
			title,
			message,
			confirmLabel = 'Confirm',
			cancelLabel = 'Cancel',
			variant = 'warning',
			onConfirm,
			onCancel
		}: Props = $props();

	// Handle escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isOpen) {
			onCancel();
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onCancel();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div 
		class="dialog-backdrop" 
		role="dialog" 
		aria-modal="true" 
		aria-labelledby="dialog-title"
		onclick={handleBackdropClick}
		tabindex="-1"
	>
		<div class="dialog-content dialog-content--{variant}">
			<h2 id="dialog-title" class="dialog-title">{title}</h2>
			<p class="dialog-message">{message}</p>
			
			<div class="dialog-actions">
				<button
					type="button"
					class="dialog-button dialog-button--cancel"
					onclick={onCancel}
				>
					{cancelLabel}
				</button>
				<button
					type="button"
					class="dialog-button dialog-button--confirm dialog-button--{variant}"
					onclick={onConfirm}
				>
					{confirmLabel}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.dialog-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.dialog-content {
		background: var(--color-primary, #2D1B4E);
		border: 1px solid var(--color-secondary, #D4AF37);
		border-radius: 0.75rem;
		padding: 1.5rem;
		max-width: 400px;
		width: 100%;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
	}

	.dialog-content--warning {
		border-color: var(--color-warning, #F39C12);
	}

	.dialog-content--danger {
		border-color: var(--color-error, #E74C3C);
	}

	.dialog-content--info {
		border-color: var(--color-info, #3498DB);
	}

	.dialog-title {
		font-family: var(--font-heading, 'Playfair Display', serif);
		font-size: 1.25rem;
		color: var(--color-warm-cream, #F5E6D3);
		margin: 0 0 0.75rem 0;
	}

	.dialog-message {
		font-family: var(--font-body, 'Inter', sans-serif);
		font-size: 0.9375rem;
		color: var(--color-warm-cream, #F5E6D3);
		opacity: 0.9;
		margin: 0 0 1.5rem 0;
		line-height: 1.5;
	}

	.dialog-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.dialog-button {
		font-family: var(--font-body, 'Inter', sans-serif);
		font-size: 0.875rem;
		font-weight: 600;
		padding: 0.625rem 1.25rem;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 44px;
		border: none;
	}

	.dialog-button:focus {
		outline: 2px solid var(--color-secondary, #D4AF37);
		outline-offset: 2px;
	}

	.dialog-button--cancel {
		background: transparent;
		color: var(--color-warm-cream, #F5E6D3);
		border: 1px solid var(--color-warm-cream, #F5E6D3);
	}

	.dialog-button--cancel:hover {
		background: rgba(245, 230, 211, 0.1);
	}

	.dialog-button--confirm {
		color: var(--color-primary, #2D1B4E);
	}

	.dialog-button--confirm:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	.dialog-button--warning {
		background: var(--color-warning, #F39C12);
	}

	.dialog-button--danger {
		background: var(--color-error, #E74C3C);
	}

	.dialog-button--info {
		background: var(--color-info, #3498DB);
	}
</style>
