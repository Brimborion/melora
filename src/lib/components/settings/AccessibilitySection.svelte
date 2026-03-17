<script lang="ts">
	import { preferencesStore } from '$lib/stores/preferences.svelte';

	// Text size options
	const textSizeOptions = [
		{ value: 'small', label: 'Small' },
		{ value: 'medium', label: 'Medium' },
		{ value: 'large', label: 'Large' }
	] as const;

	// Handle high contrast toggle
	function handleHighContrastChange(event: Event) {
		const target = event.target as HTMLInputElement;
		preferencesStore.setHighContrastMode(target.checked);
	}

	// Handle reduced motion toggle
	function handleReducedMotionChange(event: Event) {
		const target = event.target as HTMLInputElement;
		preferencesStore.setReducedMotion(target.checked);
	}

	// Handle text size change
	function handleTextSizeChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		preferencesStore.setTextSize(target.value as 'small' | 'medium' | 'large');
	}
</script>

<section class="accessibility-section" aria-labelledby="accessibility-heading">
	<h2 id="accessibility-heading" class="section-title">Accessibility</h2>
	
	<!-- High Contrast Mode -->
	<div class="setting-item">
		<div class="setting-info">
			<label for="high-contrast-toggle" class="setting-label">
				High Contrast Mode
			</label>
			<p class="setting-description">
				Enhance visibility with stronger color contrast (WCAG AAA)
			</p>
		</div>
		<label class="toggle">
			<input
				type="checkbox"
				id="high-contrast-toggle"
				checked={preferencesStore.preferences.highContrastMode}
				onchange={handleHighContrastChange}
				class="toggle-input"
			/>
			<span class="toggle-slider" aria-hidden="true"></span>
			<span class="sr-only">
				{preferencesStore.preferences.highContrastMode ? 'Enabled' : 'Disabled'}
			</span>
		</label>
	</div>

	<!-- Reduced Motion -->
	<div class="setting-item">
		<div class="setting-info">
			<label for="reduced-motion-toggle" class="setting-label">
				Reduced Motion
			</label>
			<p class="setting-description">
				Minimize animations and transitions throughout the app
			</p>
		</div>
		<label class="toggle">
			<input
				type="checkbox"
				id="reduced-motion-toggle"
				checked={preferencesStore.preferences.reducedMotion}
				onchange={handleReducedMotionChange}
				class="toggle-input"
			/>
			<span class="toggle-slider" aria-hidden="true"></span>
			<span class="sr-only">
				{preferencesStore.preferences.reducedMotion ? 'Enabled' : 'Disabled'}
			</span>
		</label>
	</div>

	<!-- Text Size -->
	<div class="setting-item setting-item--select">
		<div class="setting-info">
			<label for="text-size-select" class="setting-label">
				Text Size
			</label>
			<p class="setting-description">
				Adjust the base text size across the application
			</p>
		</div>
		<select
			id="text-size-select"
			value={preferencesStore.preferences.textSize}
			onchange={handleTextSizeChange}
			class="setting-select"
		>
			{#each textSizeOptions as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>

	<!-- Live region for screen reader announcements -->
	<div class="sr-only" aria-live="polite" aria-atomic="true">
		{#if preferencesStore.preferences.highContrastMode}
			High contrast mode enabled.
		{:else}
			High contrast mode disabled.
		{/if}
		{#if preferencesStore.preferences.reducedMotion}
			Reduced motion enabled.
		{:else}
			Reduced motion disabled.
		{/if}
		Text size set to {preferencesStore.preferences.textSize}.
	</div>
</section>

<style>
	.accessibility-section {
		background: var(--color-primary, #2D1B4E);
		border: 1px solid var(--color-secondary, #D4AF37);
		border-radius: 0.75rem;
		padding: 1.5rem;
	}

	.section-title {
		font-family: var(--font-heading, 'Playfair Display', serif);
		font-size: 1.25rem;
		color: var(--color-secondary, #D4AF37);
		margin: 0 0 1.25rem 0;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid rgba(212, 175, 55, 0.3);
	}

	.setting-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 0;
		border-bottom: 1px solid rgba(245, 230, 211, 0.1);
	}

	.setting-item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.setting-item:first-of-type {
		padding-top: 0;
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

	/* Toggle Switch */
	.toggle {
		position: relative;
		display: inline-block;
		width: 52px;
		height: 28px;
		flex-shrink: 0;
	}

	.toggle-input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.toggle-slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(245, 230, 211, 0.2);
		transition: 0.3s;
		border-radius: 28px;
		border: 2px solid transparent;
	}

	.toggle-slider::before {
		position: absolute;
		content: "";
		height: 20px;
		width: 20px;
		left: 2px;
		bottom: 2px;
		background-color: var(--color-warm-cream, #F5E6D3);
		transition: 0.3s;
		border-radius: 50%;
	}

	.toggle-input:checked + .toggle-slider {
		background-color: var(--color-success, #2ECC71);
	}

	.toggle-input:checked + .toggle-slider::before {
		transform: translateX(24px);
	}

	.toggle-input:focus + .toggle-slider {
		border-color: var(--color-secondary, #D4AF37);
	}

	/* Select */
	.setting-select {
		font-family: var(--font-body, 'Inter', sans-serif);
		font-size: 0.875rem;
		padding: 0.625rem 2rem 0.625rem 0.875rem;
		background: rgba(245, 230, 211, 0.1);
		border: 1px solid rgba(245, 230, 211, 0.3);
		border-radius: 0.5rem;
		color: var(--color-warm-cream, #F5E6D3);
		cursor: pointer;
		min-height: 44px;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23F5E6D3' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.75rem center;
	}

	.setting-select:focus {
		outline: 2px solid var(--color-secondary, #D4AF37);
		outline-offset: 2px;
	}

	.setting-select option {
		background: var(--color-primary, #2D1B4E);
		color: var(--color-warm-cream, #F5E6D3);
	}

	/* Screen reader only */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (max-width: 480px) {
		.setting-item {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.setting-item--select {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.setting-select {
			width: 100%;
		}
	}
</style>
