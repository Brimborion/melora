# Story 2.8 Task-1.1: Harmonic Interval Recognition (Unison & Octave)

Status: ready-for-dev

<!-- Sprint: Chapter 1 Level 1 - Task Implementation Order: 1/15 -->

## Story

**From Epic 2.8 (Level 1 - Interval Recognition):**

As a beginner user,
I want to recognize Unison and Octave harmonic intervals,
so that I can develop my foundational ear training skills.

**This Task (TASK-1.1):** L1-PartB - Harmonic Recognition (Unison & Octave)

## Acceptance Criteria

1. **Given** the user starts Exercise 1 (Harmonic Recognition) for Lesson 1
   **When** the system plays a harmonic interval (two notes simultaneously)
   **Then** the interval is either Unison or Octave

2. **Given** the user hears a harmonic interval
   **When** they select their answer
   **Then** feedback is displayed (correct/incorrect)

3. **Given** the user is in the exercise
   **When** they complete all questions
   **Then** the session is complete
   **And** score is displayed

4. **Given** the user completes the exercise
   **When** the exercise ends
   **Then** the score is saved to IndexedDB

## Tasks / Subtasks

- [ ] Task 1 (AC: #1-3) - Implement Ex1HarmonicRecognition component
  - [ ] Subtask 1.1 - Create Ex1HarmonicRecognition.svelte component
  - [ ] Subtask 1.2 - Generate random intervals (Unison or Octave only)
  - [ ] Subtask 1.3 - Implement harmonic playback (both notes together)
  - [ ] Subtask 1.4 - Create two-option UI (Unison / Octave)
  - [ ] Subtask 1.5 - Implement feedback display
  - [ ] Subtask 1.6 - Implement question session flow
  - [ ] Subtask 1.7 - Add completion screen with score display
- [ ] Task 2 (AC: #4) - Integrate with exercise completion and scoring
  - [ ] Subtask 2.1 - Integrate with ExerciseEngine for session management
  - [ ] Subtask 2.2 - Implement score recording to IndexedDB
- [ ] Task 3 - Testing
  - [ ] Subtask 3.1 - Write unit tests for interval generation
  - [ ] Subtask 3.2 - Write component tests for Ex1HarmonicRecognition

---

## Dev Notes

### Architecture Requirements (MANDATORY - DO NOT DEVIATE)

**Component Location:**
```
src/lib/components/exercise/
├── Ex1HarmonicRecognition.svelte    # NEW - Harmonic recognition component
└── index.ts                         # UPDATE - Export Ex1HarmonicRecognition
```

**Component Specification:**

```svelte
<!-- src/lib/components/exercise/Ex1HarmonicRecognition.svelte -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { audioStore } from '$lib/stores/audio.svelte';
  import type { HarmonicInterval } from '$lib/music/intervals';
  import { generateHarmonicInterval, INTERVALS } from '$lib/music/intervals';
  
  interface Props {
    exerciseId?: string;
    onComplete?: (result: ExerciseResult) => void;
  }
  
  let { exerciseId = 'ex1-harmonic-recognition', onComplete }: Props = $props();
  
  // Session state
  let currentQuestion = $state(0);
  let totalQuestions = 10; // Default from chapter-1-level-1.md Part A
  let currentInterval = $state<HarmonicInterval | null>(null);
  let selectedAnswer = $state<string | null>(null);
  let isCorrect = $state<boolean | null>(null);
  let sessionComplete = $state(false);
  let score = $state(0);
  let correctCount = $state(0);
  
  // Available answers for this exercise
  const ANSWER_OPTIONS = ['Unison', 'Octave'];
  
  function generateNewQuestion(): HarmonicInterval {
    // Only generate Unison or Octave for Lesson 1
    const allowedIntervals = [INTERVALS.UNISON, INTERVALS.OCTAVE];
    return generateHarmonicInterval(allowedIntervals);
  }
  
  function nextQuestion() {
    selectedAnswer = null;
    isCorrect = null;
    
    if (currentQuestion >= totalQuestions - 1) {
      sessionComplete = true;
      score = Math.round((correctCount / totalQuestions) * 100);
      onComplete?.({
        exerciseId,
        score,
        correctAnswers: correctCount,
        totalQuestions
      });
    } else {
      currentQuestion++;
      currentInterval = generateNewQuestion();
    }
  }
  
  function selectAnswer(answer: string) {
    if (selectedAnswer !== null) return; // Already answered
    
    selectedAnswer = answer;
    isCorrect = currentInterval?.name === answer;
    
    if (isCorrect) {
      correctCount++;
    }
  }
  
  async function playInterval() {
    if (currentInterval) {
      await audioStore.playHarmonicInterval(currentInterval);
    }
  }
  
  onMount(() => {
    // Generate first question on mount
    currentInterval = generateNewQuestion();
  });
</script>

<div 
  class="harmonic-recognition"
  role="region"
  aria-label="Harmonic Interval Recognition Exercise"
>
  {#if !sessionComplete}
    <div class="question-indicator" aria-live="polite">
      Question {currentQuestion + 1} of {totalQuestions}
    </div>
    
    <div class="exercise-content">
      <p class="instruction">
        Listen to the two notes played together. Is this a Unison or an Octave?
      </p>
      
      <button 
        onclick={playInterval}
        class="play-button"
        aria-label="Play harmonic interval"
        disabled={audioStore.isLoading}
      >
        {#if audioStore.isLoading}
          Loading...
        {:else}
          ▶ Play Interval
        {/if}
      </button>
      
      <div class="answer-options" role="group" aria-label="Answer options">
        {#each ANSWER_OPTIONS as option}
          <button 
            onclick={() => selectAnswer(option)}
            class="answer-button"
            class:selected={selectedAnswer === option}
            class:correct={selectedAnswer === option && isCorrect === true}
            class:incorrect={selectedAnswer === option && isCorrect === false}
            disabled={selectedAnswer !== null}
            aria-label={option}
          >
            {option}
          </button>
        {/each}
      </div>
      
      {#if selectedAnswer !== null}
        <div 
          class="feedback"
          class:correct={isCorrect}
          class:incorrect={!isCorrect}
          role="status"
          aria-live="polite"
        >
          {#if isCorrect}
            <span class="feedback-icon">✓</span>
            <span>Correct! Well done!</span>
          {:else}
            <span class="feedback-icon">✗</span>
            <span>Not quite. That was {currentInterval?.name}.</span>
          {/if}
        </div>
        
        <button 
          onclick={nextQuestion}
          class="btn-primary continue-btn"
        >
          {currentQuestion < totalQuestions - 1 ? 'Next Question' : 'See Results'}
        </button>
      {/if}
    </div>
    
    <div class="progress-bar" role="progressbar" aria-valuenow={currentQuestion} aria-valuemin="0" aria-valuemax={totalQuestions}>
      <div class="progress-fill" style="width: {((currentQuestion + 1) / totalQuestions) * 100}%"></div>
    </div>
  {:else}
    <div class="completion-screen">
      <h2>Exercise Complete!</h2>
      <div class="score-display">
        <span class="score-value">{score}%</span>
        <span class="score-label">{correctCount} of {totalQuestions} correct</span>
      </div>
      <p class="encouraging-message">
        {#if score >= 80}
          Excellent work! You're mastering Unison and Octave recognition.
        {:else if score >= 60}
          Good progress! Keep practicing to improve your recognition.
        {:else}
          Keep trying! Practice makes perfect with interval recognition.
        {/if}
      </p>
      <div class="completion-actions">
        <button 
          onclick={() => { /* TODO: Replay */ }}
          class="btn-secondary"
        >
          Replay
        </button>
        <button 
          onclick={() => { /* TODO: Continue */ }}
          class="btn-primary"
        >
          Continue
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .harmonic-recognition {
    background: #1A1A2E;
    min-height: 100vh;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }
  
  .question-indicator {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: #D4AF37;
  }
  
  .exercise-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    max-width: 480px;
    text-align: center;
  }
  
  .instruction {
    color: #F5E6D3;
    font-size: 1.125rem;
    line-height: 1.6;
  }
  
  .play-button {
    background: linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%);
    color: #2D1B4E;
    padding: 1rem 2rem;
    border-radius: 50px;
    font-weight: 700;
    font-size: 1.125rem;
    min-width: 200px;
    min-height: 56px;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
  }
  
  .play-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
  }
  
  .play-button:active:not(:disabled) {
    transform: translateY(0);
  }
  
  .play-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .answer-options {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .answer-button {
    background: #2D1B4E;
    border: 2px solid #D4AF37;
    color: #F5E6D3;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1.125rem;
    min-width: 140px;
    min-height: 56px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .answer-button:hover:not(:disabled) {
    background: rgba(212, 175, 55, 0.2);
  }
  
  .answer-button.selected {
    border-color: #D4AF37;
    background: rgba(212, 175, 55, 0.2);
  }
  
  .answer-button.correct {
    border-color: #2ECC71;
    background: rgba(46, 204, 113, 0.2);
    color: #2ECC71;
  }
  
  .answer-button.incorrect {
    border-color: #E74C3C;
    background: rgba(231, 76, 60, 0.2);
    color: #E74C3C;
  }
  
  .answer-button:disabled {
    cursor: default;
  }
  
  .feedback {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
  }
  
  .feedback.correct {
    background: rgba(46, 204, 113, 0.15);
    color: #2ECC71;
  }
  
  .feedback.incorrect {
    background: rgba(231, 76, 60, 0.15);
    color: #E8B4B8;
  }
  
  .feedback-icon {
    font-size: 1.25rem;
    font-weight: 700;
  }
  
  .btn-primary {
    background: #D4AF37;
    color: #2D1B4E;
    padding: 0.875rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    min-width: 160px;
    min-height: 44px;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .btn-primary:hover {
    background: #E5C048;
  }
  
  .btn-secondary {
    background: transparent;
    border: 2px solid #D4AF37;
    color: #D4AF37;
    padding: 0.875rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    min-width: 140px;
    min-height: 44px;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .btn-secondary:hover {
    background: rgba(212, 175, 55, 0.1);
  }
  
  .continue-btn {
    margin-top: 0.5rem;
  }
  
  .progress-bar {
    width: 100%;
    max-width: 480px;
    height: 8px;
    background: #2D1B4E;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #D4AF37, #2ECC71);
    transition: width 0.3s ease;
  }
  
  .completion-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    text-align: center;
    padding: 2rem;
  }
  
  .completion-screen h2 {
    font-family: 'Playfair Display', serif;
    color: #D4AF37;
    font-size: 2rem;
    margin: 0;
  }
  
  .score-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .score-value {
    font-size: 4rem;
    font-weight: 700;
    color: #D4AF37;
  }
  
  .score-label {
    font-size: 1rem;
    color: #F5E6D3;
  }
  
  .encouraging-message {
    color: #F5E6D3;
    font-size: 1.125rem;
    max-width: 320px;
  }
  
  .completion-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
</style>
```

**Music Theory Integration:**

```typescript
// src/lib/music/intervals.ts - ADD harmonic interval types and functions

export const INTERVALS = {
  UNISON: 'Unison',
  OCTAVE: 'Octave',
  // Add more as needed for later lessons
} as const;

export type IntervalName = typeof INTERVALS[keyof typeof INTERVALS];

export interface HarmonicInterval {
  name: IntervalName;
  lowNote: string;    // e.g., 'C4'
  highNote: string;  // e.g., 'C5' (octave) or 'C4' (unison)
  semitones: number; // 0 for unison, 12 for octave
}

/**
 * Generates a random harmonic interval from allowed types
 * @param allowedIntervals - Array of interval names to randomly choose from
 * @returns A random harmonic interval
 */
export function generateHarmonicInterval(allowedIntervals: IntervalName[]): HarmonicInterval {
  const intervalName = allowedIntervals[Math.floor(Math.random() * allowedIntervals.length)];
  
  // Generate random base note (pentatonic notes for Level 1)
  const PENTATONIC_NOTES = ['C', 'F', 'G', 'D', 'A'];
  const baseNote = PENTATONIC_NOTES[Math.floor(Math.random() * PENTATONIC_NOTES.length)];
  const octave = 4;
  const lowNote = `${baseNote}${octave}`;
  
  let highNote: string;
  let semitones: number;
  
  switch (intervalName) {
    case INTERVALS.UNISON:
      highNote = lowNote;
      semitones = 0;
      break;
    case INTERVALS.OCTAVE:
      highNote = `${baseNote}${octave + 1}`;
      semitones = 12;
      break;
    default:
      highNote = lowNote;
      semitones = 0;
  }
  
  return { name: intervalName, lowNote, highNote, semitones };
}
```

**AudioStore Enhancement:**

```typescript
// src/lib/stores/audio.svelte.ts - ADD harmonic interval playback

import type { HarmonicInterval } from '$lib/music/intervals';

export function createAudioStore() {
  let isLoading = $state(false);
  // ... existing state
  
  async function playHarmonicInterval(interval: HarmonicInterval): Promise<void> {
    // Play both notes simultaneously using tone.js
    // Both notes are scheduled at the same time
    await Tone.start();
    const now = Tone.now();
    
    // Play low note
    sampler.triggerAttackRelease(interval.lowNote, '2n', now);
    // Play high note at exactly the same time
    sampler.triggerAttackRelease(interval.highNote, '2n', now);
  }
  
  return {
    // ... existing exports
    playHarmonicInterval
  };
}
```

### Previous Story Learnings (CRITICAL - BUILD ON THESE)

From Story 2-7 (Exercise Replay):
- ✅ Repository pattern established
- ✅ Svelte 5 runes ($state, $derived) used consistently
- ✅ Component Props interface + $props() pattern
- ✅ Accessibility: ARIA labels, keyboard nav, 44px touch targets
- ✅ Art Nouveau theme colors used

From Story 2-6 (Microphone Permission):
- ✅ audioStore is PRIMARY service for audio state management
- ✅ Permission states properly managed

From Story 2-5 (Pitch Detection):
- ✅ AudioContext singleton pattern maintained

From Story 2-2 (Audio Playback):
- ✅ ToneAudioEngine handles note playback
- ✅ Salamander samples loaded via Tone.js

**CRITICAL PATTERNS TO REUSE:**
- Same component structure: Props interface + $props() pattern
- Same styling: Art Nouveau theme colors (#1A1A2E, #2D1B4E, #D4AF37)
- Same accessibility: ARIA labels, keyboard nav, 44px touch targets
- Same audio integration: Use audioStore

**Patterns to AVOID:**
- DO NOT create new AudioContext instances
- DO NOT use legacy Svelte 4 syntax ($:)
- DO NOT put audio logic directly in component
- DO NOT hardcode specific notes (use random generation)

### Architecture Compliance (MANDATORY)

**From architecture.md:**
1. Svelte 5 runes for state - MANDATORY
2. Audio services isolated from components - MANDATORY
3. Tone.js for audio playback - MANDATORY
4. Component Props interface + $props() - MANDATORY

**From project-context.md:**
- Component location: `src/lib/components/exercise/`
- Audio access: `import { audioStore } from '$lib/stores/audio.svelte'`
- Note range: E2 to E5 (Salamander samples)

### Design System (Art Nouveau "Mystical Orient")

**Colors to use:**
- Primary: Deep purple (#2D1B4E), Rich gold (#D4AF37)
- Secondary: Teal (#1A5F5F), Burgundy (#722F37)
- Accent: Warm cream (#F5E6D3)
- Background: Dark (#1A1A2E) for immersive focus
- Success: Emerald green (#2ECC71)
- Error: Soft coral (#E74C3C)

**Typography:**
- Display serif for headings (Playfair Display)
- Clean sans-serif for body text (Inter)

**Breakpoints:**
- Mobile-first (320px - 767px)
- Touch targets: 44px minimum

### Accessibility Requirements (MANDATORY)

- WCAG 2.1 Level A compliance
- Keyboard: All buttons keyboard accessible
- Screen reader: Announce question progress, feedback
- Visual: High contrast, clear visual hierarchy
- Touch: 44x44px minimum touch targets
- Focus: Visible focus indicators

### Testing Requirements

- **Unit Tests**: Test harmonic interval generation
- **Component Tests**: Test Ex1HarmonicRecognition component
- **Mocking**: Mock audioStore for unit tests

**Test Scenarios:**
1. generateHarmonicInterval() only returns Unison or Octave
2. Component renders initial state correctly
3. Play button triggers harmonic interval playback
4. Answer selection provides correct/incorrect feedback
5. Score calculated correctly on completion
6. Component is keyboard accessible

---

## Dev Agent Record

### Agent Model Used

opencode/big-pickle

### Debug Log References

From Story 2-7:
- Repository pattern established
- ExerciseEngine handles exercise flow

From Story 2-2:
- ToneAudioEngine handles audio playback
- Salamander samples loaded via Tone.js

### Completion Notes List

**To be completed by Dev Agent:**

**Implementation Summary:**
- Create Ex1HarmonicRecognition.svelte component (Unison & Octave only)
- Add INTERVALS constants, HarmonicInterval type, generateHarmonicInterval function
- Add playHarmonicInterval method to audioStore
- Create unit tests for interval generation
- Create component tests for Ex1HarmonicRecognition

### File List

**New files:**
- src/lib/components/exercise/Ex1HarmonicRecognition.svelte
- src/lib/components/exercise/Ex1HarmonicRecognition.test.ts (component tests)
- src/lib/music/intervals.test.ts (unit tests - add harmonic interval tests)

**Modified files:**
- src/lib/music/intervals.ts (add INTERVALS, HarmonicInterval, generateHarmonicInterval)
- src/lib/stores/audio.svelte.ts (add playHarmonicInterval)
- src/lib/components/exercise/index.ts (export Ex1HarmonicRecognition)

---

## Senior Developer Review (AI)

### Review Date: TBD
### Reviewer: TBD

### Issues Found and Fixed

To be completed during review.

### Test Results

To be verified after implementation.

---

