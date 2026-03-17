<script lang="ts">
	/**
	 * AccessibilitySettings Component
	 * Toggles for high contrast mode and reduced motion
	 */

	interface Props {
		highContrast: boolean;
		reducedMotion: boolean;
		onHighContrastChange: (value: boolean) => void;
		onReducedMotionChange: (value: boolean) => void;
	}

	let {
		highContrast = $bindable(false),
		reducedMotion = $bindable(false),
		onHighContrastChange,
		onReducedMotionChange
	}: Props = $props();

	function toggleHighContrast() {
		highContrast = !highContrast;
		onHighContrastChange(highContrast);
	}

	function toggleReducedMotion() {
		reducedMotion = !reducedMotion;
		onReducedMotionChange(reducedMotion);
	}
</script>

<fieldset class="accessibility-settings">
	<legend class="sr-only">Accessibility settings</legend>

	<div class="setting-row">
		<label for="high-contrast-toggle" class="setting-label">
			<span class="label-text">High Contrast</span>
			<span class="label-description">Enhance visual clarity with stronger contrasts</span>
		</label>
		<button
			type="button"
			id="high-contrast-toggle"
			role="switch"
			aria-checked={highContrast}
			class="toggle"
			class:active={highContrast}
			onclick={toggleHighContrast}
		>
			<span class="sr-only">{highContrast ? 'Enabled' : 'Disabled'}</span>
			<span class="toggle-slider"></span>
		</button>
	</div>

	<div class="setting-row">
		<label for="reduced-motion-toggle" class="setting-label">
			<span class="label-text">Reduced Motion</span>
			<span class="label-description">Minimize animations and transitions</span>
		</label>
		<button
			type="button"
			id="reduced-motion-toggle"
			role="switch"
			aria-checked={reducedMotion}
			class="toggle"
			class:active={reducedMotion}
			onclick={toggleReducedMotion}
		>
			<span class="sr-only">{reducedMotion ? 'Enabled' : 'Disabled'}</span>
			<span class="toggle-slider"></span>
		</button>
	</div>
</fieldset>

<style>
	.accessibility-settings {
		border: none;
		padding: 0;
		margin: 0;
	}

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

	.setting-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 0;
		border-bottom: 1px solid var(--color-primary-dark);
	}

	.setting-row:last-child {
		border-bottom: none;
	}

	.setting-label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		cursor: pointer;
	}

	.label-text {
		font-weight: 500;
		color: var(--color-warm-cream);
	}

	.label-description {
		font-size: 0.875rem;
		color: var(--color-soft-rose);
	}

	.toggle {
		position: relative;
		width: 56px;
		height: 32px;
		background-color: var(--color-primary-dark);
		border: 2px solid var(--color-secondary-dark);
		border-radius: 16px;
		cursor: pointer;
		transition: all 0.2s ease;
		padding: 0;
		min-width: 44px;
		min-height: 44px;
	}

	.toggle:hover {
		border-color: var(--color-secondary);
	}

	.toggle:focus {
		outline: none;
		box-shadow: 0 0 0 2px var(--color-secondary);
	}

	.toggle.active {
		background-color: var(--color-secondary);
		border-color: var(--color-secondary);
	}

	.toggle-slider {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 24px;
		height: 24px;
		background-color: var(--color-warm-cream);
		border-radius: 50%;
		transition: transform 0.2s ease;
	}

	.toggle.active .toggle-slider {
		transform: translateX(24px);
	}
</style>
