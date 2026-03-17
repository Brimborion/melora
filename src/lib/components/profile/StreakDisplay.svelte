<script lang="ts">
	interface Props {
		streak: number;
	}
	
	let { streak }: Props = $props();
</script>

<div class="streak-card" aria-label="Current streak: {streak} days">
	<span class="streak-card__value">
		{#if streak > 0}
			🔥 {streak}
		{:else}
			0
		{/if}
	</span>
	<span class="streak-card__label">Day Streak</span>
</div>

<style>
	.streak-card {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 0.5rem;
		padding: 0.75rem;
		text-align: center;
	}
	
	.streak-card__value {
		display: block;
		font-family: 'Playfair Display', serif;
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1;
	}
	
	.streak-card__label {
		display: block;
		font-family: 'Inter', sans-serif;
		font-size: 0.75rem;
		opacity: 0.85;
		margin-top: 0.25rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
</style>
