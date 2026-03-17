<script lang="ts">
	import { pitchStore, type PitchMatchStatus } from '$lib/stores/pitch.svelte';

	interface Props {
		showCents?: boolean;
		showFrequency?: boolean;
		showTarget?: boolean;
		compact?: boolean;
	}

	let {
		showCents = true,
		showFrequency = false,
		showTarget = true,
		compact = false
	}: Props = $props();

	// Get store values
	let currentPitch = $derived(pitchStore.currentPitch);
	let formattedNote = $derived(pitchStore.formattedNote);
	let matchStatus = $derived(pitchStore.matchStatus);
	let targetNote = $derived(pitchStore.targetNote);
	let targetOctave = $derived(pitchStore.targetOctave);
	let isActive = $derived(pitchStore.isActive);
	let feedbackMessage = $derived(pitchStore.feedbackMessage);

	// Compute display classes based on match status
	let noteClass = $derived(() => {
		if (!isActive || !currentPitch) return 'pitch-display__note--inactive';
		
		switch (matchStatus) {
			case 'match':
				return 'pitch-display__note--match';
			case 'close':
				return 'pitch-display__note--close';
			case 'off':
				return 'pitch-display__note--off';
			default:
				return 'pitch-display__note--inactive';
		}
	});

	// Format cents display
	let centsDisplay = $derived(() => {
		if (!currentPitch) return '';
		const cents = currentPitch.cents;
		if (cents === 0) return '±0';
		return cents > 0 ? `+${cents}` : `${cents}`;
	});

	// Target note display
	let targetDisplay = $derived(() => {
		if (!targetNote || targetOctave === null) return null;
		return `${targetNote}${targetOctave}`;
	});
</script>

<div class="pitch-display" class:pitch-display--compact={compact}>
	{#if isActive}
		<!-- Detected Note -->
		<div class="pitch-display__note-container">
			<span class="pitch-display__note {noteClass()}" aria-live="polite">
				{formattedNote || '--'}
			</span>
		</div>

		{#if showCents && currentPitch}
			<span 
				class="pitch-display__cents"
				class:pitch-display__cents--positive={currentPitch.cents > 0}
				class:pitch-display__cents--negative={currentPitch.cents < 0}
				aria-label="Cents deviation"
			>
				{centsDisplay()}
			</span>
		{/if}

		{#if showFrequency && currentPitch}
			<span class="pitch-display__frequency">
				{Math.round(currentPitch.frequency)} Hz
			</span>
		{/if}

		<!-- Feedback / Target -->
		{#if showTarget && targetDisplay()}
			<div class="pitch-display__target" aria-label="Target note">
				<span class="pitch-display__target-label">Target:</span>
				<span 
					class="pitch-display__target-note"
					class:pitch-display__target-note--match={matchStatus === 'match'}
				>
					{targetDisplay()}
				</span>
			</div>
		{/if}

		<!-- Encouraging message -->
		<p class="pitch-display__feedback" aria-live="polite">
			{feedbackMessage}
		</p>
	{:else}
		<!-- Inactive state -->
		<div class="pitch-display__inactive">
			<span class="pitch-display__inactive-text">
				Start pitch detection to begin
			</span>
		</div>
	{/if}
</div>

<style>
	.pitch-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1.5rem;
		background: var(--color-dark-bg, #1A1A2E);
		border-radius: 12px;
		min-width: 200px;
	}

	.pitch-display--compact {
		padding: 1rem;
		min-width: 150px;
	}

	.pitch-display__note-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pitch-display__note {
		font-family: 'Playfair Display', serif;
		font-size: 3.5rem;
		font-weight: 700;
		color: var(--color-text-light, #F5E6D3);
		transition: color 0.2s ease, transform 0.2s ease;
	}

	.pitch-display--compact .pitch-display__note {
		font-size: 2.5rem;
	}

	.pitch-display__note--inactive {
		color: var(--color-text-muted, #888);
	}

	.pitch-display__note--match {
		color: var(--color-success, #2ECC71);
		transform: scale(1.05);
	}

	.pitch-display__note--close {
		color: var(--color-warning, #D4AF37);
	}

	.pitch-display__note--off {
		color: var(--color-error, #E74C3C);
	}

	.pitch-display__cents {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text-light, #F5E6D3);
		font-variant-numeric: tabular-nums;
	}

	.pitch-display__cents--positive {
		color: var(--color-success, #2ECC71);
	}

	.pitch-display__cents--negative {
		color: var(--color-error, #E74C3C);
	}

	.pitch-display__frequency {
		font-size: 0.875rem;
		color: var(--color-text-muted, #888);
	}

	.pitch-display__target {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--color-primary, #2D1B4E);
		border-radius: 8px;
		border: 2px solid var(--color-accent, #D4AF37);
	}

	.pitch-display__target-label {
		font-size: 0.875rem;
		color: var(--color-text-muted, #AAA);
	}

	.pitch-display__target-note {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-accent, #D4AF37);
	}

	.pitch-display__target-note--match {
		color: var(--color-success, #2ECC71);
	}

	.pitch-display__feedback {
		font-size: 1rem;
		color: var(--color-text-light, #F5E6D3);
		text-align: center;
		margin: 0;
		min-height: 1.5rem;
	}

	.pitch-display__inactive {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.pitch-display__inactive-text {
		font-size: 1rem;
		color: var(--color-text-muted, #888);
		text-align: center;
	}
</style>
