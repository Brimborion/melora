<script lang="ts">
	import type { Badge } from '$lib/stores/profile.svelte';
	
	interface Props {
		badge: Badge;
	}
	
	let { badge }: Props = $props();
</script>

<div class="badge-display" role="listitem" aria-label="{badge.name}: {badge.description}">
	<span class="badge-display__icon" aria-hidden="true">{badge.icon}</span>
	<span class="badge-display__name">{badge.name}</span>
	<span class="badge-display__description">{badge.description}</span>
</div>

<style>
	.badge-display {
		background: var(--color-background, #F5E6D3);
		border-radius: 0.5rem;
		padding: 0.75rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}
	
	.badge-display:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}
	
	.badge-display__icon {
		font-size: 1.75rem;
		line-height: 1;
	}
	
	.badge-display__name {
		font-family: 'Inter', sans-serif;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text, #1A1A2E);
	}
	
	.badge-display__description {
		font-family: 'Inter', sans-serif;
		font-size: 0.625rem;
		color: var(--color-text-muted, #666);
		line-height: 1.3;
	}
</style>
