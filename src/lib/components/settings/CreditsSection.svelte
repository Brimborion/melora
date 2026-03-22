<script lang="ts">
	import { SALAMANDER_ATTRIBUTION } from '$lib/audio';

	// List of third-party libraries and their attributions
	const libraries = [
		{
			name: 'Salamander Sound Library',
			attribution: 'by Alexander Holm',
			url: 'https://tonejs.github.io/audio/salamander/',
			license: 'CC-BY-3.0',
			description: 'High-quality piano samples used for audio playback'
		},
		{
			name: 'Tone.js',
			attribution: 'by Yotam Mann',
			url: 'https://tonejs.github.io/',
			license: 'MIT',
			description: 'Web Audio framework powering the audio engine'
		},
		{
			name: 'SvelteKit',
			attribution: 'by Vercel',
			url: 'https://kit.svelte.dev/',
			license: 'MIT',
			description: 'Framework for building web applications'
		}
	] as const;

	// Melora app info
	const appInfo = {
		name: 'Melora',
		version: '1.0.0',
		description: 'Music ear training application'
	};
</script>

<section class="credits-section" aria-labelledby="credits-heading">
	<h2 id="credits-heading" class="section-title">Credits & Attributions</h2>
	
	<!-- App Info -->
	<div class="app-info">
		<h3 class="app-name">{appInfo.name}</h3>
		<p class="app-version">Version {appInfo.version}</p>
		<p class="app-description">{appInfo.description}</p>
	</div>

	<!-- Salamander Attribution (Required by CC-BY-3.0) -->
	<div class="attribution-block attribution-block--highlight">
		<div class="attribution-header">
			<span class="attribution-icon" aria-hidden="true">🎹</span>
			<span class="attribution-name">Salamander Sound Library</span>
			<span class="attribution-license">CC-BY-3.0</span>
		</div>
		<p class="attribution-text">
			{SALAMANDER_ATTRIBUTION}
		</p>
		<p class="attribution-requirement">
			This attribution is required by the Creative Commons license. Thank you, Alexander Holm!
		</p>
		<a 
			href={libraries[0].url} 
			target="_blank" 
			rel="noopener noreferrer"
			class="attribution-link"
		>
			Learn more about Salamander Sound Library
			<span class="sr-only">(opens in new tab)</span>
		</a>
	</div>

	<!-- Other Libraries -->
	<div class="libraries-list">
		<h3 class="libraries-title">Open Source Libraries</h3>
		{#each libraries.slice(1) as library}
			<div class="library-item">
				<div class="library-header">
					<span class="library-name">{library.name}</span>
					<span class="library-license">{library.license}</span>
				</div>
				<p class="library-attribution">{library.attribution}</p>
				<p class="library-description">{library.description}</p>
				<a 
					href={library.url} 
					target="_blank" 
					rel="noopener noreferrer"
					class="library-link"
				>
					View project
					<span class="sr-only">(opens in new tab)</span>
				</a>
			</div>
		{/each}
	</div>

	<!-- License Notice -->
	<div class="license-notice">
		<p>
			Melora is free and open source software. We are grateful to all the open source 
			projects that make this application possible.
		</p>
	</div>
</section>

<style>
	.credits-section {
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

	/* App Info */
	.app-info {
		text-align: center;
		margin-bottom: 1.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid rgba(245, 230, 211, 0.1);
	}

	.app-name {
		font-family: var(--font-heading, 'Playfair Display', serif);
		font-size: 1.5rem;
		color: var(--color-warm-cream, #F5E6D3);
		margin: 0 0 0.25rem 0;
	}

	.app-version {
		font-size: 0.875rem;
		color: var(--color-accent, #D4AF37);
		margin: 0 0 0.5rem 0;
	}

	.app-description {
		font-size: 0.875rem;
		color: var(--color-warm-cream, #F5E6D3);
		opacity: 0.7;
		margin: 0;
	}

	/* Attribution Block */
	.attribution-block {
		background: rgba(245, 230, 211, 0.05);
		border: 1px solid rgba(245, 230, 211, 0.1);
		border-radius: 0.5rem;
		padding: 1.25rem;
		margin-bottom: 1.5rem;
	}

	.attribution-block--highlight {
		border-color: var(--color-secondary, #D4AF37);
		background: rgba(212, 175, 55, 0.1);
	}

	.attribution-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
		flex-wrap: wrap;
	}

	.attribution-icon {
		font-size: 1.25rem;
	}

	.attribution-name {
		font-weight: 600;
		color: var(--color-warm-cream, #F5E6D3);
	}

	.attribution-license {
		font-size: 0.75rem;
		padding: 0.125rem 0.5rem;
		background: var(--color-secondary, #D4AF37);
		color: var(--color-primary, #2D1B4E);
		border-radius: 9999px;
		font-weight: 600;
	}

	.attribution-text {
		font-size: 0.9375rem;
		color: var(--color-warm-cream, #F5E6D3);
		margin: 0 0 0.75rem 0;
	}

	.attribution-requirement {
		font-size: 0.8125rem;
		color: var(--color-warm-cream, #F5E6D3);
		opacity: 0.8;
		font-style: italic;
		margin: 0 0 0.75rem 0;
	}

	.attribution-link {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.875rem;
		color: var(--color-accent, #D4AF37);
		text-decoration: none;
		transition: opacity 0.2s;
	}

	.attribution-link:hover {
		opacity: 0.8;
		text-decoration: underline;
	}

	.attribution-link:focus {
		outline: 2px solid var(--color-secondary, #D4AF37);
		outline-offset: 2px;
	}

	/* Libraries List */
	.libraries-list {
		margin-bottom: 1.5rem;
	}

	.libraries-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-warm-cream, #F5E6D3);
		opacity: 0.8;
		margin: 0 0 1rem 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.library-item {
		padding: 1rem 0;
		border-bottom: 1px solid rgba(245, 230, 211, 0.1);
	}

	.library-item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.library-item:first-of-type {
		padding-top: 0;
	}

	.library-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.25rem;
	}

	.library-name {
		font-weight: 600;
		color: var(--color-warm-cream, #F5E6D3);
	}

	.library-license {
		font-size: 0.75rem;
		padding: 0.125rem 0.5rem;
		background: rgba(245, 230, 211, 0.1);
		color: var(--color-warm-cream, #F5E6D3);
		border-radius: 9999px;
		opacity: 0.8;
	}

	.library-attribution {
		font-size: 0.8125rem;
		color: var(--color-accent, #D4AF37);
		margin: 0 0 0.25rem 0;
	}

	.library-description {
		font-size: 0.8125rem;
		color: var(--color-warm-cream, #F5E6D3);
		opacity: 0.7;
		margin: 0 0 0.5rem 0;
	}

	.library-link {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.8125rem;
		color: var(--color-accent, #D4AF37);
		text-decoration: none;
		transition: opacity 0.2s;
	}

	.library-link:hover {
		opacity: 0.8;
		text-decoration: underline;
	}

	.library-link:focus {
		outline: 2px solid var(--color-secondary, #D4AF37);
		outline-offset: 2px;
	}

	/* License Notice */
	.license-notice {
		text-align: center;
		padding-top: 1rem;
		border-top: 1px solid rgba(245, 230, 211, 0.1);
	}

	.license-notice p {
		font-size: 0.8125rem;
		color: var(--color-warm-cream, #F5E6D3);
		opacity: 0.6;
		margin: 0;
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
		.attribution-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.25rem;
		}

		.library-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.25rem;
		}
	}
</style>
