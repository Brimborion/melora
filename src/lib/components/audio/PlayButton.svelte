<script lang="ts">
	import type { Note } from '$lib/types';
	import { audioStore } from '$lib/stores';
	import { formatNote } from '$lib/audio/audioUtils';

	interface Props {
		note?: Note;
		label?: string;
		disabled?: boolean;
		size?: 'small' | 'medium' | 'large';
		variant?: 'primary' | 'secondary';
		onPlay?: () => void;
		onError?: (error: Error) => void;
	}

	let {
		note,
		label = 'Play',
		disabled = false,
		size = 'medium',
		variant = 'primary',
		onPlay,
		onError
	}: Props = $props();

	// Loading state
	let isLoading = $state(false);

	// Compute button label
	let buttonLabel = $derived(
		note ? `Play ${formatNote(note)}` : label
	);

	// Size classes
	let sizeClasses = $derived({
		small: 'play-button--small',
		medium: 'play-button--medium',
		large: 'play-button--large'
	}[size]);

	// Handle play action
	async function handlePlay(event: MouseEvent | KeyboardEvent) {
		if (disabled || isLoading || !note) return;

		// Handle keyboard events
		if (event.type === 'keydown' && (event as KeyboardEvent).key !== ' ' && (event as KeyboardEvent).key !== 'Enter') {
			return;
		}
		event.preventDefault();

		try {
			isLoading = true;
			await audioStore.playNote(note);
			onPlay?.();
		} catch (error) {
			onError?.(error as Error);
		} finally {
			isLoading = false;
		}
	}

	// Handle keyboard interaction
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === ' ' || event.key === 'Enter') {
			handlePlay(event);
		}
	}
</script>

	<button
		class="play-button {sizeClasses}"
		class:play-button--primary={variant === 'primary'}
		class:play-button--secondary={variant === 'secondary'}
		class:play-button--loading={isLoading}
		onclick={handlePlay}
		onkeydown={handleKeyDown}
		disabled={disabled || isLoading}
		aria-label={buttonLabel}
		aria-busy={isLoading}
		type="button"
	>
		{#if isLoading}
			<span class="play-button__icon play-button__icon--loading" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12" />
				</svg>
			</span>
		{:else}
			<span class="play-button__icon" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M8 5v14l11-7z" />
				</svg>
			</span>
		{/if}
		<span class="play-button__label">{buttonLabel}</span>
	</button>

<style>
	.play-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-family: 'Inter', sans-serif;
		font-weight: 600;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
		border: none;
		outline: none;
		min-height: 44px;
		min-width: 44px;
	}

	.play-button:focus-visible {
		outline: 2px solid var(--color-accent, #D4AF37);
		outline-offset: 2px;
	}

	/* Sizes */
	.play-button--small {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		min-height: 36px;
	}

	.play-button--medium {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		min-height: 44px;
	}

	.play-button--large {
		padding: 1rem 2rem;
		font-size: 1.125rem;
		min-height: 56px;
	}

	/* Primary variant */
	.play-button--primary {
		background: var(--color-accent, #D4AF37);
		color: var(--color-primary, #2D1B4E);
	}

	.play-button--primary:hover:not(:disabled) {
		background: #c9a030;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
	}

	.play-button--primary:active:not(:disabled) {
		transform: translateY(0);
	}

	/* Secondary variant */
	.play-button--secondary {
		background: transparent;
		color: var(--color-accent, #D4AF37);
		border: 2px solid var(--color-accent, #D4AF37);
	}

	.play-button--secondary:hover:not(:disabled) {
		background: rgba(212, 175, 55, 0.1);
	}

	/* Disabled state */
	.play-button--disabled,
	.play-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	/* Loading state */
	.play-button--loading {
		pointer-events: none;
	}

	/* Icon */
	.play-button__icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.play-button__icon svg {
		width: 1.25em;
		height: 1.25em;
	}

	.play-button--small .play-button__icon svg {
		width: 1em;
		height: 1em;
	}

	.play-button--large .play-button__icon svg {
		width: 1.5em;
		height: 1.5em;
	}

	/* Loading spinner */
	.play-button__icon--loading svg {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	/* Label */
	.play-button__label {
		white-space: nowrap;
	}
</style>
