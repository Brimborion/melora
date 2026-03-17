<script lang="ts">
	/**
	 * InitialSetup Component
	 * Complete onboarding form for new users
	 */

	import DifficultySelector from './DifficultySelector.svelte';
	import AccessibilitySettings from './AccessibilitySettings.svelte';

	interface Props {
		onComplete: (data: {
			difficulty: 'beginner' | 'intermediate' | 'advanced';
			highContrastMode: boolean;
			reducedMotion: boolean;
		}) => void;
	}

	let { onComplete }: Props = $props();

	let step = $state(1);
	let difficulty = $state<'beginner' | 'intermediate' | 'advanced'>('beginner');
	let highContrast = $state(false);
	let reducedMotion = $state(false);
	let isSubmitting = $state(false);

	function handleDifficultyChange(value: 'beginner' | 'intermediate' | 'advanced') {
		difficulty = value;
	}

	function handleHighContrastChange(value: boolean) {
		highContrast = value;
	}

	function handleReducedMotionChange(value: boolean) {
		reducedMotion = value;
	}

	function nextStep() {
		if (step < 2) {
			step++;
		}
	}

	function prevStep() {
		if (step > 1) {
			step--;
		}
	}

	async function handleSubmit() {
		isSubmitting = true;
		try {
			await onComplete({
				difficulty,
				highContrastMode: highContrast,
				reducedMotion: reducedMotion
			});
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="initial-setup" class:high-contrast={highContrast} class:reduced-motion={reducedMotion}>
	<div class="progress-indicator">
		<div class="progress-step" class:active={step >= 1} class:completed={step > 1}>
			<span class="step-number">1</span>
			<span class="step-label">Difficulty</span>
		</div>
		<div class="progress-line" class:active={step > 1}></div>
		<div class="progress-step" class:active={step >= 2}>
			<span class="step-number">2</span>
			<span class="step-label">Accessibility</span>
		</div>
	</div>

	<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
		{#if step === 1}
			<div class="step-content" role="tabpanel" aria-labelledby="step1-title">
				<h2 id="step1-title" class="step-title">Choose Your Difficulty</h2>
				<p class="step-description">
					Select the level that best matches your musical experience.
					You can always change this later in settings.
				</p>
				
				<DifficultySelector bind:value={difficulty} onchange={handleDifficultyChange} />
				
				<div class="actions">
					<button
						type="button"
						class="btn btn-primary"
						onclick={nextStep}
					>
						Continue
					</button>
				</div>
			</div>
		{:else if step === 2}
			<div class="step-content" role="tabpanel" aria-labelledby="step2-title">
				<h2 id="step2-title" class="step-title">Accessibility Options</h2>
				<p class="step-description">
					Customize your experience with accessibility settings.
					These can be adjusted anytime in preferences.
				</p>
				
				<AccessibilitySettings
					bind:highContrast
					bind:reducedMotion
					onHighContrastChange={handleHighContrastChange}
					onReducedMotionChange={handleReducedMotionChange}
				/>
				
				<div class="actions">
					<button
						type="button"
						class="btn btn-secondary"
						onclick={prevStep}
					>
						Back
					</button>
					<button
						type="submit"
						class="btn btn-primary"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Setting up...' : 'Start Learning'}
					</button>
				</div>
			</div>
		{/if}
	</form>
</div>

<style>
	.initial-setup {
		max-width: 480px;
		margin: 0 auto;
		padding: 2rem;
	}

	.progress-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.progress-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.step-number {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background-color: var(--color-primary-dark);
		color: var(--color-soft-rose);
		font-weight: 600;
		border: 2px solid var(--color-primary-dark);
		transition: all 0.2s ease;
	}

	.progress-step.active .step-number {
		background-color: var(--color-secondary);
		color: var(--color-dark-bg);
		border-color: var(--color-secondary);
	}

	.progress-step.completed .step-number {
		background-color: var(--color-success);
		border-color: var(--color-success);
	}

	.step-label {
		font-size: 0.75rem;
		color: var(--color-soft-rose);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.progress-line {
		width: 60px;
		height: 2px;
		background-color: var(--color-primary-dark);
		margin: 0 1rem;
		margin-bottom: 1.5rem;
		transition: background-color 0.2s ease;
	}

	.progress-line.active {
		background-color: var(--color-secondary);
	}

	.step-title {
		font-family: var(--font-heading);
		font-size: 1.75rem;
		color: var(--color-warm-cream);
		margin-bottom: 0.5rem;
		text-align: center;
	}

	.step-description {
		color: var(--color-soft-rose);
		text-align: center;
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	.actions {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
		justify-content: center;
	}

	.btn {
		padding: 0.875rem 2rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 44px;
		min-width: 44px;
		border: 2px solid transparent;
	}

	.btn:focus {
		outline: none;
		box-shadow: 0 0 0 2px var(--color-secondary);
	}

	.btn-primary {
		background-color: var(--color-secondary);
		color: var(--color-dark-bg);
		border-color: var(--color-secondary);
	}

	.btn-primary:hover:not(:disabled) {
		background-color: var(--color-secondary-light);
		border-color: var(--color-secondary-light);
		transform: translateY(-2px);
	}

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-secondary {
		background-color: transparent;
		color: var(--color-warm-cream);
		border-color: var(--color-primary-light);
	}

	.btn-secondary:hover {
		border-color: var(--color-secondary);
		color: var(--color-secondary);
	}

	/* High contrast mode */
	.initial-setup.high-contrast {
		--color-warm-cream: #FFFFFF;
		--color-soft-rose: #CCCCCC;
		--color-primary: #000000;
		--color-primary-dark: #333333;
		--color-primary-light: #222222;
	}

	/* Reduced motion */
	.initial-setup.reduced-motion *,
	.initial-setup.reduced-motion *::before,
	.initial-setup.reduced-motion *::after {
		transition: none !important;
		animation: none !important;
	}
</style>
