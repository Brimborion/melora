<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { pitchStore, type PitchMatchStatus } from '$lib/stores/pitch.svelte';
	import { PitchDisplay, PitchVisualizer } from '$lib/components/pitch';

	// Target note options for practice
	const noteOptions = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
	const octaveOptions = [3, 4, 5];

	// Selected target
	let selectedNote = $state('A');
	let selectedOctave = $state(4);

	// Loading state
	let isStarting = $state(false);

	async function handleStart() {
		isStarting = true;
		try {
			await pitchStore.start();
		} catch (error) {
			console.error('Failed to start pitch detection:', error);
		} finally {
			isStarting = false;
		}
	}

	function handleStop() {
		pitchStore.stop();
	}

	function handleSetTarget() {
		pitchStore.setTarget(selectedNote, selectedOctave);
	}

	function handleClearTarget() {
		pitchStore.clearTarget();
	}

	// Clean up on destroy
	onDestroy(() => {
		if (pitchStore.isActive) {
			pitchStore.stop();
		}
	});
</script>

<svelte:head>
	<title>Pitch Practice - Melora</title>
	<meta name="description" content="Practice vocal pitch detection with real-time feedback">
</svelte:head>

<main class="practice-page">
	<header class="practice-header">
		<h1 class="practice-title">Pitch Practice</h1>
		<p class="practice-subtitle">
			Sing along and train your ear to match the target pitch
		</p>
	</header>

	<!-- Permission request / Start button -->
	{#if !pitchStore.isActive}
		<section class="start-section" aria-label="Start pitch detection">
			{#if pitchStore.error}
				<div class="error-message" role="alert">
					<p>{pitchStore.error}</p>
					<button 
						class="btn btn--primary"
						onclick={handleStart}
						disabled={isStarting}
					>
						{isStarting ? 'Starting...' : 'Try Again'}
					</button>
				</div>
			{:else if !pitchStore.hasPermission}
				<div class="permission-section">
					<p>Microphone access is required for pitch detection</p>
					<button 
						class="btn btn--primary"
						onclick={handleStart}
						disabled={isStarting}
					>
						{isStarting ? 'Requesting...' : 'Enable Microphone'}
					</button>
				</div>
			{:else}
				<button 
					class="btn btn--primary btn--large"
					onclick={handleStart}
					disabled={isStarting}
				>
					{isStarting ? 'Starting...' : 'Start Practice'}
				</button>
			{/if}
		</section>
	{/if}

	<!-- Active pitch detection UI -->
	{#if pitchStore.isActive}
		<div class="pitch-practice-container">
			<!-- Pitch Display -->
			<section aria-label="Pitch display">
				<PitchDisplay 
					showCents={true}
					showFrequency={false}
					showTarget={true}
				/>
			</section>

			<!-- Pitch Visualizer -->
			<section aria-label="Pitch visualizer">
				<PitchVisualizer 
					showMeter={true}
					showIndicator={true}
					vertical={true}
				/>
			</section>

			<!-- Target note selector -->
			<section class="target-section" aria-label="Select target note">
				<h2 class="target-title">Set Target Note</h2>
				
				<div class="target-selector">
					<label for="note-select" class="selector-label">Note:</label>
					<select 
						id="note-select"
						class="selector"
						bind:value={selectedNote}
					>
						{#each noteOptions as note}
							<option value={note}>{note}</option>
						{/each}
					</select>
				</div>

				<div class="target-selector">
					<label for="octave-select" class="selector-label">Octave:</label>
					<select 
						id="octave-select"
						class="selector"
						bind:value={selectedOctave}
					>
						{#each octaveOptions as octave}
							<option value={octave}>{octave}</option>
						{/each}
					</select>
				</div>

				<div class="target-actions">
					<button 
						class="btn btn--secondary"
						onclick={handleSetTarget}
					>
						Set Target
					</button>
					<button 
						class="btn btn--outline"
						onclick={handleClearTarget}
					>
						Clear
					</button>
				</div>
			</section>

			<!-- Stop button -->
			<button 
				class="btn btn--stop"
				onclick={handleStop}
			>
				Stop Practice
			</button>
		</div>
	{/if}

	<!-- Instructions -->
	<section class="instructions-section" aria-label="How to use">
		<h2>How It Works</h2>
		<ul class="instructions-list">
			<li>Click <strong>Start Practice</strong> to enable microphone access</li>
			<li>Select a target note (e.g., A4) and click <strong>Set Target</strong></li>
			<li>Sing the note and watch the visual feedback</li>
			<li><span class="success-text">Green</span> = Perfect match (±30 cents)</li>
			<li><span class="warning-text">Yellow</span> = Close (±50 cents)</li>
			<li><span class="error-text">Red</span> = Off pitch</li>
		</ul>
	</section>
</main>

<style>
	.practice-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.practice-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.practice-title {
		font-family: 'Playfair Display', serif;
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--color-accent, #D4AF37);
		margin: 0 0 0.5rem 0;
	}

	.practice-subtitle {
		font-size: 1rem;
		color: rgba(245, 230, 211, 0.8);
		margin: 0;
	}

	/* Start section */
	.start-section {
		text-align: center;
		padding: 3rem 1rem;
		background: var(--color-primary, #2D1B4E);
		border-radius: 12px;
		margin-bottom: 2rem;
	}

	.permission-section p,
	.error-message p {
		margin-bottom: 1rem;
		color: rgba(245, 230, 211, 0.9);
	}

	.error-message {
		color: var(--color-error, #E74C3C);
	}

	/* Buttons */
	.btn {
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		border: none;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn--primary {
		background: var(--color-accent, #D4AF37);
		color: var(--color-primary-dark, #1A0F35);
	}

	.btn--primary:hover:not(:disabled) {
		background: var(--color-secondary-light, #E5C76B);
	}

	.btn--large {
		padding: 1rem 2.5rem;
		font-size: 1.25rem;
	}

	.btn--secondary {
		background: var(--color-secondary, #D4AF37);
		color: var(--color-primary-dark, #1A0F35);
	}

	.btn--outline {
		background: transparent;
		border: 2px solid var(--color-accent, #D4AF37);
		color: var(--color-accent, #D4AF37);
	}

	.btn--stop {
		background: var(--color-error, #E74C3C);
		color: white;
		padding: 0.75rem 2rem;
	}

	.btn--stop:hover {
		background: #c0392b;
	}

	/* Practice container */
	.pitch-practice-container {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		justify-content: center;
		align-items: flex-start;
		padding: 2rem;
		background: var(--color-dark-bg, #1A1A2E);
		border-radius: 12px;
		margin-bottom: 2rem;
	}

	/* Target section */
	.target-section {
		width: 100%;
		max-width: 300px;
		padding: 1.5rem;
		background: var(--color-primary, #2D1B4E);
		border-radius: 8px;
	}

	.target-title {
		font-family: 'Playfair Display', serif;
		font-size: 1.25rem;
		color: var(--color-accent, #D4AF37);
		margin: 0 0 1rem 0;
	}

	.target-selector {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.selector-label {
		font-size: 0.875rem;
		color: rgba(245, 230, 211, 0.8);
	}

	.selector {
		flex: 1;
		padding: 0.5rem;
		border-radius: 4px;
		border: 1px solid var(--color-secondary, #D4AF37);
		background: var(--color-dark-bg, #1A1A2E);
		color: var(--color-warm-cream, #F5E6D3);
		font-size: 1rem;
	}

	.target-actions {
		display: flex;
		gap: 0.5rem;
	}

	/* Instructions */
	.instructions-section {
		padding: 1.5rem;
		background: var(--color-primary, #2D1B4E);
		border-radius: 8px;
	}

	.instructions-section h2 {
		font-family: 'Playfair Display', serif;
		font-size: 1.25rem;
		color: var(--color-accent, #D4AF37);
		margin: 0 0 1rem 0;
	}

	.instructions-list {
		margin: 0;
		padding-left: 1.25rem;
		color: rgba(245, 230, 211, 0.9);
		line-height: 1.8;
	}

	.instructions-list li {
		margin-bottom: 0.5rem;
	}

	.success-text {
		color: var(--color-success, #2ECC71);
	}

	.warning-text {
		color: var(--color-warning, #D4AF37);
	}

	.error-text {
		color: var(--color-error, #E74C3C);
	}
</style>
