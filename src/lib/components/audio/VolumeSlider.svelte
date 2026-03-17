<script lang="ts">
	import { audioStore } from '$lib/stores';

	interface Props {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		label?: string;
		showValue?: boolean;
		onChange?: (value: number) => void;
	}

	let {
		value: initialValue = 0.8,
		min = 0,
		max = 1,
		step = 0.01,
		label = 'Volume',
		showValue = true,
		onChange
	}: Props = $props();

	// Local state for the slider value (Svelte 5 runes)
	// Initialize with default - effects will sync with prop/store
	let sliderValue = $state(0.8);

	// Keep in sync with external value prop changes
	$effect(() => {
		sliderValue = initialValue;
	});

	// Also sync with audio store
	$effect(() => {
		if (audioStore.volume !== sliderValue) {
			sliderValue = audioStore.volume;
		}
	});

	// Convert value to percentage for display
	let displayValue = $derived(Math.round(sliderValue * 100));

	// Handle slider change
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const newValue = parseFloat(target.value);
		sliderValue = newValue;
		audioStore.setVolume(newValue);
		onChange?.(newValue);
	}

	// Handle keyboard adjustments
	function handleKeyDown(event: KeyboardEvent) {
		const increment = event.shiftKey ? 0.1 : 0.05;
		
		if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
			event.preventDefault();
			const newValue = Math.min(max, sliderValue + increment);
			sliderValue = newValue;
			audioStore.setVolume(newValue);
			onChange?.(newValue);
		} else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
			event.preventDefault();
			const newValue = Math.max(min, sliderValue - increment);
			sliderValue = newValue;
			audioStore.setVolume(newValue);
			onChange?.(newValue);
		}
	}
</script>

	<div class="volume-slider">
		{#if label}
			<label class="volume-slider__label" for="volume-slider">
				{label}
			</label>
		{/if}
		
		<div class="volume-slider__control">
			<span class="volume-slider__icon volume-slider__icon--low" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M5 9v6h4l5 5V4L9 9H5z"/>
				</svg>
			</span>
			
			<input
				id="volume-slider"
				type="range"
				min={min}
				max={max}
				step={step}
				value={sliderValue}
				oninput={handleInput}
				onkeydown={handleKeyDown}
				class="volume-slider__input"
				aria-label={label}
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={displayValue}
				aria-valuetext="{displayValue} percent"
			/>
			
			<span class="volume-slider__icon volume-slider__icon--high" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M5 9v6h4l5 5V4L9 9H5zm11 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
				</svg>
			</span>
		</div>
		
		{#if showValue}
			<span class="volume-slider__value" aria-live="polite">
				{displayValue}%
			</span>
		{/if}
	</div>

<style>
	.volume-slider {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
	}

	.volume-slider__label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-light, #F5E6D3);
	}

	.volume-slider__control {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.volume-slider__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-secondary, #1A5F5F);
		flex-shrink: 0;
	}

	.volume-slider__icon svg {
		width: 20px;
		height: 20px;
	}

	.volume-slider__icon--low svg {
		width: 16px;
		height: 16px;
	}

	/* Slider input */
	.volume-slider__input {
		flex: 1;
		height: 8px;
		-webkit-appearance: none;
		appearance: none;
		background: var(--color-secondary, #1A5F5F);
		border-radius: 4px;
		outline: none;
		cursor: pointer;
		min-height: 44px;
		padding: 10px 0;
	}

	.volume-slider__input:focus-visible {
		outline: 2px solid var(--color-accent, #D4AF37);
		outline-offset: 2px;
	}

	/* Slider thumb */
	.volume-slider__input::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		background: var(--color-accent, #D4AF37);
		border-radius: 50%;
		cursor: pointer;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}

	.volume-slider__input::-webkit-slider-thumb:hover {
		transform: scale(1.1);
		box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
	}

	.volume-slider__input::-webkit-slider-thumb:active {
		transform: scale(0.95);
	}

	.volume-slider__input::-moz-range-thumb {
		width: 20px;
		height: 20px;
		background: var(--color-accent, #D4AF37);
		border: none;
		border-radius: 50%;
		cursor: pointer;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}

	.volume-slider__input::-moz-range-thumb:hover {
		transform: scale(1.1);
		box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
	}

	/* Slider track fill (for browsers that support it) */
	.volume-slider__input::-webkit-slider-runnable-track {
		height: 8px;
		background: linear-gradient(
			to right,
			var(--color-accent, #D4AF37) 0%,
			var(--color-accent, #D4AF37) var(--value-percent, 80%),
			var(--color-secondary, #1A5F5F) var(--value-percent, 80%),
			var(--color-secondary, #1A5F5F) 100%
		);
		border-radius: 4px;
	}

	.volume-slider__value {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-text-light, #F5E6D3);
		text-align: center;
		opacity: 0.8;
	}
</style>
