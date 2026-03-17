<script lang="ts">
	import { permissionStore } from '$lib/stores/permission.svelte';
	import { getBrowserName } from '$lib/audio/MicrophonePermission';

	interface Props {
		onRequestAgain?: () => void;
	}

	let { onRequestAgain }: Props = $props();

	const browserName = getBrowserName();

	const browserInstructions: Record<string, { icon: string; steps: string[] }> = {
		Chrome: {
			icon: '🔒',
			steps: [
				'Click the lock or microphone icon in the address bar',
				'Click on "Permissions" or "Site settings"',
				'Find "Microphone" and select "Allow"',
				'Refresh the page'
			]
		},
		Firefox: {
			icon: '🛡️',
			steps: [
				'Click the shield icon in the address bar',
				'Click on "Permissions" or "Enhanced Tracking Protection"',
				'Find "Microphone" and select "Allow"',
				'Refresh the page'
			]
		},
		Safari: {
			icon: '🍎',
			steps: [
				'Open Safari menu → Settings → Websites',
				'Click on "Microphone" in the sidebar',
				'Find this website and select "Allow"',
				'Refresh the page'
			]
		},
		Edge: {
			icon: '🔷',
			steps: [
				'Click the lock or microphone icon in the address bar',
				'Click on "Permissions" or "Site permissions"',
				'Find "Microphone" and select "Allow"',
				'Refresh the page'
			]
		}
	};

	const instructions = browserInstructions[browserName] || {
		icon: '🌐',
		steps: [
			'Open your browser settings',
			'Find "Privacy and Security" or "Site Permissions"',
			'Locate "Microphone" permissions',
			'Allow access for this website',
			'Refresh the page'
		]
	};

	function handleTryAgain() {
		permissionStore.tryAgain();
		if (onRequestAgain) {
			onRequestAgain();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			// Allow dismissing by pressing Escape
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if permissionStore.showPermissionDenied}
	<div class="permission-denied-container" role="alert">
		<div class="icon-container">
			<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
				<path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
				<line x1="12" x2="12" y1="19" y2="22"/>
				<line x1="4" x2="20" y1="4" y2="20" stroke-width="2"/>
			</svg>
		</div>
		
		<h2>Microphone Access Denied</h2>
		
		<p class="description">
			To use pitch detection features, please enable microphone access in your browser settings.
		</p>
		
		<div class="instructions">
			<h3>How to enable in {browserName}:</h3>
			<ul>
				{#each instructions.steps as step, index}
					<li>
						<span class="step-number">{index + 1}</span>
						<span class="step-text">{step}</span>
					</li>
				{/each}
			</ul>
		</div>
		
		<div class="alternatives">
			<h3>Other options:</h3>
			<ul>
				<li>Check if another application is using your microphone</li>
				<li>Make sure your microphone is connected and working</li>
				<li>Try closing other browser tabs that might be using the microphone</li>
			</ul>
		</div>
		
		<div class="actions">
			<button 
				onclick={handleTryAgain} 
				class="btn-primary"
				type="button"
			>
				Try Again
			</button>
		</div>
		
		<p class="help-text">
			After enabling, click "Try Again" to test your microphone.
		</p>
	</div>
{/if}

<style>
	.permission-denied-container {
		background: linear-gradient(145deg, #2D1B4E 0%, #1A1A2E 100%);
		border: 1px solid #722F37;
		border-radius: 16px;
		padding: 2rem;
		max-width: 500px;
		margin: 1rem auto;
		text-align: left;
	}

	.icon-container {
		color: #E8B4B8;
		text-align: center;
		margin-bottom: 1rem;
	}

	h2 {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.5rem;
		font-weight: 600;
		color: #E8B4B8;
		margin: 0 0 1rem 0;
		text-align: center;
	}

	.description {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 1rem;
		line-height: 1.6;
		color: #F5E6D3;
		margin: 0 0 1.5rem 0;
	}

	.instructions, .alternatives {
		margin-bottom: 1.5rem;
	}

	h3 {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 0.875rem;
		font-weight: 600;
		color: #D4AF37;
		margin: 0 0 0.75rem 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 0.9375rem;
		line-height: 1.5;
		color: #F5E6D3;
		padding: 0.5rem 0;
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.step-number {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		background: rgba(212, 175, 55, 0.2);
		color: #D4AF37;
		border-radius: 50%;
		font-size: 0.75rem;
		font-weight: 600;
		flex-shrink: 0;
	}

	.step-text {
		flex: 1;
	}

	.alternatives {
		padding: 1rem;
		background: rgba(114, 47, 55, 0.15);
		border-radius: 8px;
	}

	.alternatives li {
		font-size: 0.875rem;
		color: rgba(245, 230, 211, 0.8);
	}

	.actions {
		margin: 1.5rem 0;
		display: flex;
		justify-content: center;
	}

	button {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 1rem;
		font-weight: 500;
		padding: 0.875rem 2rem;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 44px;
	}

	button:focus {
		outline: 2px solid #D4AF37;
		outline-offset: 2px;
	}

	.btn-primary {
		background: #D4AF37;
		color: #2D1B4E;
		border: none;
		font-weight: 600;
	}

	.btn-primary:hover {
		background: #E5C04B;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
	}

	.help-text {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 0.875rem;
		color: rgba(245, 230, 211, 0.6);
		text-align: center;
		margin: 0;
	}
</style>
