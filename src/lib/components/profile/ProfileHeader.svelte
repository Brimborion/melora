<script lang="ts">
	import { profileStore } from '$lib/stores/profile.svelte';
	import StreakDisplay from './StreakDisplay.svelte';
</script>

<header class="profile-header">
	<div class="profile-header__content">
		<div class="profile-header__avatar" aria-hidden="true">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="profile-header__avatar-icon">
				<path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.349a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
			</svg>
		</div>
		
		<div class="profile-header__info">
			<h1 class="profile-header__title">My Profile</h1>
			<p class="profile-header__subtitle">Track your progress and achievements</p>
		</div>
	</div>
	
	<div class="profile-header__stats" role="region" aria-label="Profile statistics">
		<div class="stat-card" aria-label="Total exercises completed">
			<span class="stat-card__value">{profileStore.totalExercises}</span>
			<span class="stat-card__label">Exercises</span>
		</div>
		
		<div class="stat-card" aria-label="Average score">
			<span class="stat-card__value">{profileStore.averageScore}%</span>
			<span class="stat-card__label">Avg Score</span>
		</div>
		
		<StreakDisplay streak={profileStore.currentStreak} />
	</div>
</header>

<style>
	.profile-header {
		background: linear-gradient(135deg, var(--color-primary, #2D1B4E) 0%, var(--color-secondary, #1A5F5F) 100%);
		padding: 1.5rem;
		border-radius: 1rem;
		margin-bottom: 1.5rem;
		color: var(--color-text-light, #F5E6D3);
	}
	
	.profile-header__content {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}
	
	.profile-header__avatar {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: var(--color-accent, #D4AF37);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	
	.profile-header__avatar-icon {
		width: 36px;
		height: 36px;
		color: var(--color-primary, #2D1B4E);
	}
	
	.profile-header__info {
		flex: 1;
	}
	
	.profile-header__title {
		font-family: 'Playfair Display', serif;
		font-size: 1.75rem;
		font-weight: 600;
		margin: 0;
		line-height: 1.2;
	}
	
	.profile-header__subtitle {
		font-family: 'Inter', sans-serif;
		font-size: 0.875rem;
		opacity: 0.85;
		margin: 0.25rem 0 0 0;
	}
	
	.profile-header__stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
	}
	
	.stat-card {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 0.5rem;
		padding: 0.75rem;
		text-align: center;
	}
	
	.stat-card__value {
		display: block;
		font-family: 'Playfair Display', serif;
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1;
	}
	
	.stat-card__label {
		display: block;
		font-family: 'Inter', sans-serif;
		font-size: 0.75rem;
		opacity: 0.85;
		margin-top: 0.25rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	
	@media (max-width: 480px) {
		.profile-header__title {
			font-size: 1.5rem;
		}
		
		.stat-card__value {
			font-size: 1.25rem;
		}
	}
</style>
