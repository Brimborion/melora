<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { preferencesStore } from '$lib/stores/preferences.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	// Apply accessibility settings when preferences are loaded
	$effect(() => {
		if (browser && preferencesStore.isLoaded) {
			const prefs = preferencesStore.preferences;
			
			// Apply high contrast
			if (prefs.highContrastMode) {
				document.documentElement.classList.add('high-contrast');
			} else {
				document.documentElement.classList.remove('high-contrast');
			}

			// Apply reduced motion
			if (prefs.reducedMotion) {
				document.documentElement.classList.add('reduced-motion');
			} else {
				document.documentElement.classList.remove('reduced-motion');
			}

			// Apply text size
			document.documentElement.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
			document.documentElement.classList.add(`text-size-${prefs.textSize}`);
		}
	});

	// Load preferences early in the layout
	onMount(() => {
		if (browser) {
			preferencesStore.load();
		}
	});
	
	// Check if current route is the profile page or settings page or library page
	let isProfilePage = $derived(String($page.url.pathname) === '/profile');
	let isSettingsPage = $derived(String($page.url.pathname) === '/settings');
	let isLibraryPage = $derived(String($page.url.pathname) === '/library');
	let isPracticePage = $derived(String($page.url.pathname) === '/practice');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<!-- Navigation -->
<nav class="nav-bar" aria-label="Main navigation">
	<div class="nav-bar__content">
		<a href="/" class="nav-bar__logo" aria-label="Melora Home">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="nav-bar__logo-icon">
				<path d="M12.735.186c.416-.768 1.56-.768 1.976 0l.088.134c.572.87.572 1.96 0 2.83l-.057.087c-.382.583-.597 1.278-.597 1.978v.197c0 .7.215 1.395.597 1.978l.057.087c.572.87.572 1.96 0 2.83l-.088.134c-.416.768-1.56.768-1.976 0l-.088-.134c-.572-.87-.572-1.96 0-2.83l.057-.087c.382-.583.597-1.278.597-1.978v-.197c0-.7-.215-1.395-.597-1.978l-.057-.087c-.572-.87-.572-1.96 0-2.83l.088-.134z"/>
				<path fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.95 6.95a.75.75 0 011.06 0l2.13 2.13a.75.75 0 010 1.06l-2.13 2.13a.75.75 0 11-1.06-1.06l1.3-1.3-1.3-1.3a.75.75 0 010-1.06zm-6.36 0a.75.75 0 010 1.06L8.44 12.06l-1.3 1.3a.75.75 0 11-1.06-1.06l2.13-2.13a.75.75 0 011.06 0l2.13 2.13a.75.75 0 01-1.06 1.06L10.59 12.06l-1.3-1.3a.75.75 0 010-1.06z" clip-rule="evenodd"/>
			</svg>
			<span class="nav-bar__logo-text">Melora</span>
		</a>
		
		<div class="nav-bar__links">
			{#if !isLibraryPage}
				<a href="/library" class="nav-bar__link" aria-label="Exercise library">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="nav-bar__link-icon">
						<path fill-rule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clip-rule="evenodd" />
					</svg>
					<span>Library</span>
				</a>
			{/if}
			{#if !isPracticePage}
				<a href="/practice" class="nav-bar__link" aria-label="Pitch practice">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="nav-bar__link-icon">
						<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
					</svg>
					<span>Practice</span>
				</a>
			{/if}
			{#if !isProfilePage}
				<a href="/profile" class="nav-bar__link" aria-label="View profile">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="nav-bar__link-icon">
						<path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.349a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
					</svg>
					<span>Profile</span>
				</a>
			{/if}
			{#if !isSettingsPage}
				<a href="/settings" class="nav-bar__link" aria-label="Settings">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="nav-bar__link-icon">
						<path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clip-rule="evenodd" />
					</svg>
					<span>Settings</span>
				</a>
			{/if}
		</div>
	</div>
</nav>

{@render children()}

<style>
	.nav-bar {
		background: var(--color-primary, #2D1B4E);
		padding: 0.75rem 1rem;
		position: sticky;
		top: 0;
		z-index: 100;
	}
	
	.nav-bar__content {
		max-width: 800px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.nav-bar__logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
		color: var(--color-accent, #D4AF37);
	}
	
	.nav-bar__logo-icon {
		width: 28px;
		height: 28px;
	}
	
	.nav-bar__logo-text {
		font-family: 'Playfair Display', serif;
		font-size: 1.25rem;
		font-weight: 600;
	}
	
	.nav-bar__links {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	
	.nav-bar__link {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.75rem;
		text-decoration: none;
		color: var(--color-text-light, #F5E6D3);
		font-family: 'Inter', sans-serif;
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: 0.375rem;
		transition: background-color 0.2s ease;
		min-height: 44px;
	}
	
	.nav-bar__link:hover {
		background: rgba(255, 255, 255, 0.1);
	}
	
	.nav-bar__link:focus {
		outline: 2px solid var(--color-accent, #D4AF37);
		outline-offset: 2px;
	}
	
	.nav-bar__link-icon {
		width: 20px;
		height: 20px;
	}
</style>
