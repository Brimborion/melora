<script lang="ts">
	import { pitchStore, type PitchMatchStatus } from '$lib/stores/pitch.svelte';

	interface Props {
		showMeter?: boolean;
		showIndicator?: boolean;
		vertical?: boolean;
	}

	let {
		showMeter = true,
		showIndicator = true,
		vertical = true
	}: Props = $props();

	// Get store values
	let currentPitch = $derived(pitchStore.currentPitch);
	let matchStatus = $derived(pitchStore.matchStatus);
	let isActive = $derived(pitchStore.isActive);

	// Calculate cents offset for visual indicator (capped at ±50)
	let centsOffset = $derived(() => {
		if (!currentPitch) return 0;
		// Clamp to ±50 range
		return Math.max(-50, Math.min(50, currentPitch.cents));
	});

	// Convert cents to percentage (0% = -50, 50% = 0, 100% = +50)
	let indicatorPosition = $derived(() => {
		return ((centsOffset() + 50) / 100) * 100;
	});

	// Determine indicator color class
	let indicatorClass = $derived(() => {
		if (!isActive || !currentPitch) return 'pitch-visualizer__indicator--inactive';
		
		switch (matchStatus) {
			case 'match':
				return 'pitch-visualizer__indicator--match';
			case 'close':
				return 'pitch-visualizer__indicator--close';
			case 'off':
				return 'pitch-visualizer__indicator--off';
			default:
				return 'pitch-visualizer__indicator--inactive';
		}
	});

	// Meter fill percentage (for pitch accuracy visualization)
	let meterFill = $derived(() => {
		if (!currentPitch) return 0;
		
		// Calculate how close to center (0 cents)
		const distanceFromCenter = Math.abs(currentPitch.cents);
		// Convert to percentage (0 = far, 100 = perfect)
		return Math.max(0, 100 - (distanceFromCenter * 2));
	});

	// Meter color class
	let meterClass = $derived(() => {
		if (!isActive || !currentPitch) return 'pitch-visualizer__meter--inactive';
		
		switch (matchStatus) {
			case 'match':
				return 'pitch-visualizer__meter--match';
			case 'close':
				return 'pitch-visualizer__meter--close';
			case 'off':
				return 'pitch-visualizer__meter--off';
			default:
				return 'pitch-visualizer__meter--inactive';
		}
	});
</script>

<div 
	class="pitch-visualizer"
	class:pitch-visualizer--vertical={vertical}
	class:pitch-visualizer--horizontal={!vertical}
>
	{#if showMeter}
		<!-- Pitch accuracy meter -->
		<div 
			class="pitch-visualizer__meter {meterClass()}"
			role="progressbar"
			aria-valuenow={meterFill()}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-label="Pitch accuracy"
		>
			<!-- Center line (perfect pitch) -->
			<div class="pitch-visualizer__center-line"></div>
			
			<!-- Fill -->
			<div 
				class="pitch-visualizer__fill"
				style="width: {meterFill()}%"
			></div>
		</div>
	{/if}

	{#if showIndicator}
		<!-- Pitch indicator -->
		<div 
			class="pitch-visualizer__indicator {indicatorClass()}"
			style="{vertical ? 'top' : 'left'}: {indicatorPosition()}%"
			role="status"
			aria-label="Pitch indicator"
		>
			<div class="pitch-visualizer__indicator-mark"></div>
		</div>
	{/if}

	<!-- Scale labels -->
	<div class="pitch-visualizer__labels">
		<span class="pitch-visualizer__label pitch-visualizer__label--low">-50</span>
		<span class="pitch-visualizer__label pitch-visualizer__label--center">0</span>
		<span class="pitch-visualizer__label pitch-visualizer__label--high">+50</span>
	</div>
</div>

<style>
	.pitch-visualizer {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		background: var(--color-dark-bg, #1A1A2E);
		border-radius: 8px;
		min-width: 60px;
	}

	.pitch-visualizer--vertical {
		height: 200px;
		width: 60px;
	}

	.pitch-visualizer--horizontal {
		height: 60px;
		width: 200px;
		flex-direction: row;
	}

	/* Meter */
	.pitch-visualizer__meter {
		position: relative;
		flex: 1;
		background: var(--color-secondary, #1A5F5F);
		border-radius: 4px;
		overflow: hidden;
	}

	.pitch-visualizer--vertical .pitch-visualizer__meter {
		width: 30px;
		margin: 0 auto;
	}

	.pitch-visualizer--horizontal .pitch-visualizer__meter {
		height: 30px;
	}

	.pitch-visualizer__center-line {
		position: absolute;
		background: var(--color-accent, #D4AF37);
		opacity: 0.6;
	}

	.pitch-visualizer--vertical .pitch-visualizer__meter .pitch-visualizer__center-line {
		top: 50%;
		left: 0;
		right: 0;
		height: 2px;
		transform: translateY(-50%);
	}

	.pitch-visualizer--horizontal .pitch-visualizer__meter .pitch-visualizer__center-line {
		left: 50%;
		top: 0;
		bottom: 0;
		width: 2px;
		transform: translateX(-50%);
	}

	.pitch-visualizer__fill {
		position: absolute;
		background: var(--color-accent, #D4AF37);
		transition: width 0.1s ease, height 0.1s ease;
	}

	.pitch-visualizer--vertical .pitch-visualizer__fill {
		bottom: 0;
		left: 0;
		right: 0;
		height: var(--fill-height, 0%);
	}

	.pitch-visualizer--horizontal .pitch-visualizer__fill {
		left: 0;
		top: 0;
		bottom: 0;
		width: var(--fill-width, 0%);
	}

	.pitch-visualizer__meter--inactive .pitch-visualizer__fill {
		width: 0;
		height: 0;
	}

	.pitch-visualizer__meter--match .pitch-visualizer__fill {
		background: var(--color-success, #2ECC71);
	}

	.pitch-visualizer__meter--close .pitch-visualizer__fill {
		background: var(--color-warning, #D4AF37);
	}

	.pitch-visualizer__meter--off .pitch-visualizer__fill {
		background: var(--color-error, #E74C3C);
	}

	/* Indicator */
	.pitch-visualizer__indicator {
		position: absolute;
		z-index: 10;
		transition: top 0.1s ease, left 0.1s ease;
	}

	.pitch-visualizer--vertical .pitch-visualizer__indicator {
		left: 50%;
		transform: translateX(-50%);
		width: 40px;
		height: 20px;
	}

	.pitch-visualizer--horizontal .pitch-visualizer__indicator {
		top: 50%;
		transform: translateY(-50%);
		width: 20px;
		height: 40px;
	}

	.pitch-visualizer__indicator-mark {
		width: 100%;
		height: 100%;
		background: var(--color-accent, #D4AF37);
		border-radius: 4px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.pitch-visualizer__indicator--inactive .pitch-visualizer__indicator-mark {
		background: var(--color-text-muted, #888);
		opacity: 0.5;
	}

	.pitch-visualizer__indicator--match .pitch-visualizer__indicator-mark {
		background: var(--color-success, #2ECC71);
	}

	.pitch-visualizer__indicator--close .pitch-visualizer__indicator-mark {
		background: var(--color-warning, #D4AF37);
	}

	.pitch-visualizer__indicator--off .pitch-visualizer__indicator-mark {
		background: var(--color-error, #E74C3C);
	}

	/* Labels */
	.pitch-visualizer__labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.625rem;
		color: var(--color-text-muted, #888);
	}

	.pitch-visualizer--vertical .pitch-visualizer__labels {
		flex-direction: column;
		height: 100%;
		align-items: center;
	}

	.pitch-visualizer--horizontal .pitch-visualizer__labels {
		width: 100%;
	}

	.pitch-visualizer__label--center {
		color: var(--color-accent, #D4AF37);
		font-weight: 600;
	}
</style>
