<script lang="ts">
	import HarmonicRecognition from '$lib/components/exercise/HarmonicRecognition.svelte';

	function handleComplete(result: { score: number; correctAnswers: number; totalQuestions: number }) {
		console.log('Exercise completed:', result);
	}
</script>

<svelte:head>
	<title>Ex1: Harmonic Recognition - Melora</title>
</svelte:head>

<HarmonicRecognition 
	exerciseId="ex1-harmonic-recognition" 
	onComplete={handleComplete} 
/>
