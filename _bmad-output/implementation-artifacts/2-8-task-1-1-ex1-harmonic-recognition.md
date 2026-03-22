# Story 2.8 Task-1.1: Harmonic Interval Recognition (Unison & Octave)

Status: validated-ready-for-dev

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
  - [ ] Subtask 1.2 - Use existing interval types from intervals.ts
  - [ ] Subtask 1.3 - Implement harmonic playback using `audioStore.playChord([note1, note2])`
  - [ ] Subtask 1.4 - Create two-option UI (Unison / Octave)
  - [ ] Subtask 1.5 - Implement feedback display
  - [ ] Subtask 1.6 - Implement question session flow
  - [ ] Subtask 1.7 - Add completion screen with score display
- [ ] Task 2 (AC: #4) - Integrate with exercise completion and scoring
  - [ ] Subtask 2.1 - Integrate with ExerciseEngine for session management
  - [ ] Subtask 2.2 - Implement score recording to IndexedDB (see Score Integration below)
- [ ] Task 3 - Testing
  - [ ] Subtask 3.1 - Write unit tests for interval generation (see Testing Patterns below)
  - [ ] Subtask 3.2 - Write component tests for Ex1HarmonicRecognition

---

## Dev Notes

### 🚨 CRITICAL API FIXES (MUST READ)

**CORRECTION #1: Audio Playback API**
The story previously referenced `audioStore.playHarmonicInterval()` which does NOT exist.

**Use this instead:**
```typescript
// For harmonic intervals (both notes at the same time), use:
await audioStore.playChord([note1, note2]);
```

Example from component spec below shows the correct usage.

**CORRECTION #2: Existing Types to REUSE**
DO NOT create new `HarmonicInterval` type. Use existing types from `intervals.ts`:

```typescript
// IMPORT THESE from '$lib/music/intervals'
import { 
  type IntervalQuestion,        // Main type for interval questions
  generateIntervalQuestion,     // Generates Unison/Octave questions
  getIntervalDisplayName,       // 'Unison' or 'Octave'
  UNISON_OCTAVE_INTERVALS       // ['P1', 'P8']
} from '$lib/music/intervals';
```

---

### Component Styling

**Theme:** Art Nouveau "Mystical Orient"
- Background: #1A1A2E (dark, immersive)
- Primary: #2D1B4E (deep purple), #D4AF37 (rich gold)
- Accent: #F5E6D3 (warm cream)
- Success: #2ECC71 (emerald green)
- Error: #E74C3C (soft coral)
- Typography: Playfair Display (headings), Inter (body)

**Responsive:** Mobile-first, 44px touch targets minimum

**Pattern Reference:** See `src/lib/components/exercise/ExerciseView.svelte` for component structure

---

### Component Specification

```svelte
<!-- src/lib/components/exercise/Ex1HarmonicRecognition.svelte -->

<script lang="ts">
  import { audioStore } from '$lib/stores/audio.svelte';
  import { 
    type IntervalQuestion,
    generateIntervalQuestion, 
    getIntervalDisplayName 
  } from '$lib/music/intervals';
  import type { Note } from '$lib/types';
  
  interface Props {
    exerciseId?: string;
    onComplete?: (result: ExerciseResult) => void;
  }
  
  let { exerciseId = 'ex1-harmonic-recognition', onComplete }: Props = $props();
  
  // Session state using Svelte 5 runes
  let currentQuestion = $state(0);
  let totalQuestions = 10;
  let question = $state<IntervalQuestion | null>(null);
  let selectedAnswer = $state<string | null>(null);
  let isCorrect = $state<boolean | null>(null);
  let sessionComplete = $state(false);
  let score = $state(0);
  let correctCount = $state(0);
  
  // Available answers for Lesson 1
  const ANSWER_OPTIONS = ['Unison', 'Octave'];
  
  function createNewQuestion(): IntervalQuestion {
    // generateIntervalQuestion already handles Unison/Octave for Lesson 1
    return generateIntervalQuestion();
  }
  
  function nextQuestion() {
    selectedAnswer = null;
    isCorrect = null;
    
    if (currentQuestion >= totalQuestions - 1) {
      sessionComplete = true;
      score = Math.round((correctCount / totalQuestions) * 100);
      // TODO: Save to IndexedDB (see Score Integration section)
      onComplete?.({
        exerciseId,
        score,
        correctAnswers: correctCount,
        totalQuestions
      });
    } else {
      currentQuestion++;
      question = createNewQuestion();
    }
  }
  
  function selectAnswer(answer: string) {
    if (selectedAnswer !== null) return; // Already answered
    
    selectedAnswer = answer;
    isCorrect = question?.intervalName === answer;
    
    if (isCorrect) {
      correctCount++;
    }
  }
  
  async function playHarmonicInterval() {
    if (!question) return;
    
    // Parse notes from question
    const note1: Note = parseNoteString(question.rootNote);
    const note2: Note = parseNoteString(question.targetNote);
    
    // ✅ CORRECT: Use playChord for simultaneous (harmonic) playback
    await audioStore.playChord([note1, note2]);
  }
  
  function parseNoteString(noteStr: string): Note {
    // Parse 'C4' -> { name: 'C', accidental: '', octave: 4 }
    const match = noteStr.match(/^([A-G])([#b])?(\d)$/);
    if (!match) {
      return { name: 'C', accidental: '', octave: 4 };
    }
    return {
      name: match[1] as Note['name'],
      accidental: (match[2] || '') as Note['accidental'],
      octave: parseInt(match[3]) as Note['octave']
    };
  }
  
  // Initialize first question
  question = createNewQuestion();
</script>

<!-- Full component template with accessibility, styling - see existing ExerciseView.svelte pattern -->
```

**Important:** This is a simplified reference. See `src/lib/components/exercise/` for complete component patterns.

---

### Score Integration (IndexedDB)

**Pattern for AC #4 (Score to IndexedDB):**

```typescript
// For MVP, use this simple pattern:
// 1. Import db from $lib/db
// 2. Save score after exercise completion

import { db } from '$lib/db';

async function saveScore(result: ExerciseResult): Promise<void> {
  // TODO: This will be formalized in Story 3-1 (Score Recording)
  // For now, log to console or use a simple temporary table
  console.log('Score saved:', result);
  
  // Future implementation (Story 3-1):
  // await db.scores.add({
  //   exerciseId: result.exerciseId,
  //   score: result.score,
  //   correctAnswers: result.correctAnswers,
  //   totalQuestions: result.totalQuestions,
  //   completedAt: new Date()
  // });
}
```

---

### Testing Patterns (from project-context.md)

**Unit Test Pattern:**
```typescript
// src/lib/music/intervals.test.ts
import { describe, it, expect } from 'vitest';
import { generateIntervalQuestion, UNISON_OCTAVE_INTERVALS } from './intervals';

describe('Interval Generation', () => {
  it('should only generate Unison or Octave intervals', () => {
    for (let i = 0; i < 100; i++) {
      const q = generateIntervalQuestion();
      expect(UNISON_OCTAVE_INTERVALS).toContain(q.interval);
    }
  });
});
```

**Component Test Pattern:**
```typescript
// src/lib/components/exercise/Ex1HarmonicRecognition.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Ex1HarmonicRecognition from './Ex1HarmonicRecognition.svelte';

// Mock audioStore
vi.mock('$lib/stores/audio.svelte', () => ({
  audioStore: {
    playChord: vi.fn().mockResolvedValue(undefined),
    isLoading: false,
    isReady: true
  }
}));

describe('Ex1HarmonicRecognition', () => {
  it('should render answer options', () => {
    const { getByText } = render(Ex1HarmonicRecognition);
    expect(getByText('Unison')).toBeInTheDocument();
    expect(getByText('Octave')).toBeInTheDocument();
  });
  
  it('should show feedback after answer selection', async () => {
    const { getByText } = render(Ex1HarmonicRecognition);
    await fireEvent.click(getByText('Unison'));
    // Verify feedback appears
  });
});
```

---

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

### Architecture Compliance (MANDATORY)

**From architecture.md:**
1. Svelte 5 runes for state - MANDATORY
2. Audio services isolated from components - MANDATORY
3. Tone.js for audio playback - MANDATORY
4. Component Props interface + $props() - MANDATORY

**Patterns to AVOID:**
- ❌ DO NOT create `HarmonicInterval` type (reuse `IntervalQuestion`)
- ❌ DO NOT create `playHarmonicInterval()` method (use `playChord()`)
- ❌ DO NOT create new AudioContext instances
- ❌ DO NOT use legacy Svelte 4 syntax ($:)
- ❌ DO NOT put audio logic directly in component

### Accessibility Requirements (MANDATORY)

- WCAG 2.1 Level A compliance
- Keyboard: All buttons keyboard accessible
- Screen reader: Announce question progress, feedback
- Visual: High contrast, clear visual hierarchy
- Touch: 44x44px minimum touch targets
- Focus: Visible focus indicators

---

## File Changes Summary

**New files:**
- `src/lib/components/exercise/Ex1HarmonicRecognition.svelte`
- `src/lib/components/exercise/Ex1HarmonicRecognition.test.ts`
- `src/lib/music/intervals.test.ts` (add tests)

**Modified files:**
- `src/lib/music/intervals.ts` - ✅ Already has IntervalQuestion and generation functions
- `src/lib/stores/audio.svelte.ts` - ✅ Already has `playChord()` method
- `src/lib/components/exercise/index.ts` - Add export for Ex1HarmonicRecognition

**Files NOT needing changes:**
- `src/lib/audio/ToneAudioEngine.ts` - ✅ Already handles chord playback

---

## Senior Developer Review (AI)

### Review Date: 2026-03-22
### Reviewer: bmad-dev (validate-create-story workflow)

### Validation Issues Found and Fixed

| # | Type | Issue | Resolution |
|---|------|-------|-----------|
| 1 | CRITICAL | Story referenced `audioStore.playHarmonicInterval()` which doesn't exist | Changed to use `audioStore.playChord([note1, note2])` |
| 2 | CRITICAL | Story created new `HarmonicInterval` type | Now uses existing `IntervalQuestion` from `intervals.ts` |
| 3 | ENHANCEMENT | Missing test patterns | Added unit test and component test patterns from project-context.md |
| 4 | ENHANCEMENT | Missing UI component references | Added reference to existing ExerciseView.svelte pattern |
| 5 | ENHANCEMENT | Unclear IndexedDB integration | Added Score Integration section with TODO marker for Story 3-1 |
| 6 | OPTIMIZATION | TODO comments in buttons | Removed TODOs (replay/continue are out of scope for this story) |
| 7 | OPTIMIZATION | Dev Notes too verbose | Streamlined to essential information only |

### Test Results

To be verified after implementation by Dev Agent.

---

## Validation Checklist

- [x] Story uses correct audio API (`playChord()`)
- [x] Story reuses existing types (`IntervalQuestion`)
- [x] Story includes test patterns
- [x] Story references existing UI patterns
- [x] Story clarifies IndexedDB integration
- [x] Story removes out-of-scope TODOs
- [x] Story Dev Notes are concise and actionable
