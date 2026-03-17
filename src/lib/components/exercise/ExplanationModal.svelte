<script lang="ts">
	import type { Explanation } from '$lib/game/ExplanationService';

	interface Props {
		explanations: Explanation[];
		onClose: () => void;
	}

	let { explanations, onClose }: Props = $props();

	// Handle keyboard escape to close modal
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}

	// Handle backdrop click to close
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	// Focus the close button on mount for accessibility
	let closeButton = $state<HTMLButtonElement | null>(null);
	
	$effect(() => {
		if (closeButton) {
			closeButton.focus();
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if explanations.length > 0}
	<div 
		class="explanation-modal-backdrop"
		onclick={handleBackdropClick}
		role="presentation"
	>
		<div 
			class="explanation-modal" 
			role="dialog" 
			aria-modal="true"
			aria-labelledby="explanation-title"
		>
			<div class="modal-header">
				<h2 id="explanation-title">Learn from Your Answers</h2>
				<button 
					bind:this={closeButton}
					class="close-button"
					onclick={onClose}
					aria-label="Close explanations"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>
			
			<div class="explanation-list">
				{#each explanations as explanation, index}
					<article 
						class="explanation-card" 
						class:correct={explanation.wasCorrect}
						aria-label="Explanation {index + 1}"
					>
						<div class="card-header">
							<span class="result-badge" class:correct={explanation.wasCorrect}>
								{explanation.wasCorrect ? '✓ Correct' : '✗ Incorrect'}
							</span>
							{#if !explanation.wasCorrect && explanation.correctAnswer}
								<span class="correct-answer">
									Correct: {explanation.correctAnswer}
								</span>
							{/if}
						</div>
						
						<h3 class="explanation-title">{explanation.title}</h3>
						
						<div class="explanation-content">
							<p class="description">
								{explanation.description}
							</p>
							
							{#if explanation.musicalContext}
								<p class="musical-context">
									<strong>Musical Context:</strong> {explanation.musicalContext}
								</p>
							{/if}
						</div>
						
						<blockquote class="encouraging-note">
							{explanation.encouragingNote}
						</blockquote>
						
						{#if explanation.relatedLevels && explanation.relatedLevels.length > 0}
							<div class="related-levels">
								<span class="related-label">Practice more:</span>
								<div class="level-tags">
									{#each explanation.relatedLevels as level}
										<span class="level-tag">{level}</span>
									{/each}
								</div>
							</div>
						{/if}
					</article>
				{/each}
			</div>
			
			<div class="modal-footer">
				<button 
					class="close-button-large"
					onclick={onClose}
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.explanation-modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(26, 26, 46, 0.95);
		overflow-y: auto;
		padding: 1rem;
		z-index: 1000;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}

	.explanation-modal {
		background: linear-gradient(145deg, #2D1B4E 0%, #1A1A2E 100%);
		border: 2px solid #D4AF37;
		border-radius: 16px;
		max-width: 600px;
		width: 100%;
		margin: 2rem 0;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid rgba(212, 175, 55, 0.2);
	}

	.modal-header h2 {
		font-family: 'Playfair Display', serif;
		font-size: 1.5rem;
		color: #D4AF37;
		margin: 0;
	}

	.close-button {
		background: transparent;
		border: none;
		color: #E8B4B8;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 4px;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		min-width: 44px;
	}

	.close-button:hover {
		background: rgba(232, 180, 184, 0.1);
		color: #F5E6D3;
	}

	.close-button:focus {
		outline: 2px solid #D4AF37;
		outline-offset: 2px;
	}

	.explanation-list {
		padding: 1.5rem;
		max-height: 60vh;
		overflow-y: auto;
	}

	.explanation-card {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1rem;
		border-left: 4px solid #E74C3C;
	}

	.explanation-card.correct {
		border-left-color: #2ECC71;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.result-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		background: #E74C3C;
		color: #F5E6D3;
	}

	.result-badge.correct {
		background: #2ECC71;
		color: #1A1A2E;
	}

	.correct-answer {
		font-size: 0.875rem;
		color: #2ECC71;
		font-weight: 500;
	}

	.explanation-title {
		font-family: 'Playfair Display', serif;
		font-size: 1.25rem;
		color: #F5E6D3;
		margin: 0 0 1rem 0;
	}

	.explanation-content {
		margin-bottom: 1rem;
	}

	.description {
		color: #E8B4B8;
		line-height: 1.6;
		margin: 0 0 0.75rem 0;
	}

	.musical-context {
		color: #F5E6D3;
		font-size: 0.875rem;
		line-height: 1.5;
		margin: 0;
		padding: 0.75rem;
		background: rgba(212, 175, 55, 0.1);
		border-radius: 8px;
	}

	.encouraging-note {
		background: rgba(46, 204, 113, 0.1);
		border-left: 3px solid #2ECC71;
		padding: 0.75rem 1rem;
		margin: 1rem 0;
		border-radius: 0 8px 8px 0;
		color: #F5E6D3;
		font-style: italic;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.related-levels {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid rgba(212, 175, 55, 0.1);
	}

	.related-label {
		font-size: 0.75rem;
		color: #E8B4B8;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.level-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.level-tag {
		background: rgba(26, 95, 95, 0.3);
		color: #D4AF37;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.modal-footer {
		padding: 1.5rem;
		border-top: 1px solid rgba(212, 175, 55, 0.2);
		display: flex;
		justify-content: center;
	}

	.close-button-large {
		background: #D4AF37;
		color: #2D1B4E;
		border: none;
		padding: 0.75rem 2rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 44px;
		min-width: 120px;
	}

	.close-button-large:hover {
		background: #E5C04B;
		transform: translateY(-2px);
	}

	.close-button-large:focus {
		outline: 2px solid #F5E6D3;
		outline-offset: 2px;
	}
</style>
