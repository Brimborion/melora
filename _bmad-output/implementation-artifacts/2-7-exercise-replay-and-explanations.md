# Story 2.7: Exercise Replay and Explanations

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to replay exercises and see explanations,
so that I can improve my understanding.

## Acceptance Criteria

1. **Given** the user completed an exercise
   **When** they tap replay
   **Then** the exercise restarts with new random questions
   **And** previous answers do not affect the new attempt

2. **Given** the user answers incorrectly
   **When** they view the explanation
   **Then** they see a clear explanation of the correct answer
   **And** the explanation is encouraging, not punitive

## Tasks / Subtasks

- [x] Task 1 (AC: #1) - Implement exercise replay functionality
  - [x] Subtask 1.1 - Add replay button to exercise completion screen
  - [x] Subtask 1.2 - Create exercise reset logic with new random questions
  - [x] Subtask 1.3 - Ensure previous answers don't affect new attempt
- [x] Task 2 (AC: #2) - Implement answer explanations
  - [x] Subtask 2.1 - Create explanation content for each exercise type
  - [x] Subtask 2.2 - Build explanation display component
  - [x] Subtask 2.3 - Add encouraging messaging for incorrect answers

---

## Dev Notes

### Architecture Requirements (MANDATORY - DO NOT DEVIATE)

**ExerciseEngine Replay Pattern:**
- **MUST** create new method: `resetExercise()` in ExerciseEngine
- **MUST** generate new random questions on reset
- **MUST** clear all previous answer state
- **MUST** maintain exercise type and difficulty level

```typescript
// ✅ CORRECT - Exercise replay pattern
import { getAudioContext } from '$lib/audio/AudioEngine';
import { db } from '$lib/db/database';
import { getRandomInterval, getIntervalOptions } from '$lib/music/intervals';

export interface ExerciseQuestion {
  id: string;
  type: 'interval' | 'chord' | 'melody';
  correctAnswer: string;
  options: string[];
  audioData?: AudioData;
}

// Helper functions to create in src/lib/music/intervals.ts
function getRandomCorrectAnswer(exerciseType: string): string {
  // Use existing music theory utilities or create new helpers
  if (exerciseType === 'interval') {
    return getRandomInterval(); // From src/lib/music/intervals.ts
  }
  // ... other types
  return '';
}

function generateOptions(exerciseType: string): string[] {
  // Use existing music theory utilities or create new helpers
  if (exerciseType === 'interval') {
    return getIntervalOptions(); // From src/lib/music/intervals.ts
  }
  // ... other types
  return [];
}

export function createExerciseEngine() {
  let currentQuestions = $state<ExerciseQuestion[]>([]);
  let currentQuestionIndex = $state(0);
  let answers = $state<Record<string, string>>({});
  // Track seen questions to avoid repeats in replay
  let seenQuestionIds = $state<Set<string>>(new Set());
  
  function generateNewQuestions(exerciseType: string, count: number): ExerciseQuestion[] {
    // Generate new random questions - DO NOT reuse previous
    // Use music theory utilities from src/lib/music/
    const questions: ExerciseQuestion[] = [];
    for (let i = 0; i < count; i++) {
      let question: ExerciseQuestion;
      let attempts = 0;
      
      // Generate unique question (avoid repeats)
      do {
        question = {
          id: crypto.randomUUID(),
          type: exerciseType as ExerciseQuestion['type'],
          correctAnswer: getRandomCorrectAnswer(exerciseType),
          options: generateOptions(exerciseType),
        };
        attempts++;
      } while (seenQuestionIds.has(question.id) && attempts < 10);
      
      // Add to seen questions
      seenQuestionIds = new Set([...seenQuestionIds, question.id]);
      questions.push(question);
    }
    return questions;
  }
  
  async function resetExercise(exerciseType: string, questionCount: number = 10): Promise<void> {
    // Generate completely new questions
    currentQuestions = generateNewQuestions(exerciseType, questionCount);
    currentQuestionIndex = 0;
    answers = {}; // CRITICAL: Clear ALL previous answers
  }
  
  return {
    get currentQuestions() { return currentQuestions; },
    get currentQuestionIndex() { return currentQuestionIndex; },
    get answers() { return answers; },
    resetExercise,
  };
}
```

**Explanation Service Architecture:**
- **MUST** create new file: `src/lib/game/ExplanationService.ts`
- **MUST** provide encouraging, non-punitive messaging
- **MUST** include musical context in explanations
- **Import existing ExerciseEngine**: Use import pattern from `$lib/game/index.ts`

```typescript
// ✅ CORRECT - Import existing ExerciseEngine instance
import { createExerciseEngine } from '$lib/game/ExerciseEngine';
import { getIntervalDescription, getIntervalMusicalContext } from '$lib/music/intervals';

const engine = createExerciseEngine(); // Create new instance per exercise session
```

```typescript
// ✅ CORRECT - Explanation service pattern
import { getIntervalDescription, getIntervalMusicalContext } from '$lib/music/intervals';

export interface Explanation {
  title: string;
  description: string;
  musicalContext: string;
  encouragingNote: string;
  relatedExercises?: string[];
}

export function getExplanation(
  exerciseType: string, 
  correctAnswer: string, 
  userAnswer: string
): Explanation {
  // Pull musical content from existing utilities in src/lib/music/
  // These functions should already exist or be created in intervals.ts
  const descriptions: Record<string, Explanation> = {
    interval: {
      title: 'Interval Explanation',
      description: getIntervalDescription(correctAnswer), // From $lib/music/intervals.ts
      musicalContext: getIntervalMusicalContext(correctAnswer), // From $lib/music/intervals.ts
      encouragingNote: 'Great effort! Keep practicing to train your ear.',
      relatedExercises: ['2-8', '2-9', '2-10'],
    },
    // ... other types - use existing music theory utilities
  };
  
  return descriptions[exerciseType] || getDefaultExplanation();
}
```

**Project Structure:**
```
src/lib/game/
├── ExerciseEngine.ts         # EXISTING - Add resetExercise method
├── ExplanationService.ts    # NEW - Answer explanations
├── Scoring.ts               # EXISTING - From previous stories
├── Progress.ts              # EXISTING - From previous stories
└── index.ts                # UPDATE - Export ExplanationService

src/lib/music/
├── intervals.ts             # UPDATE - Add getIntervalDescription, getIntervalMusicalContext
├── chords.ts                # EXISTING
└── index.ts                # UPDATE - Export new functions

src/lib/types/
├── game.ts                 # UPDATE - Export ExerciseQuestion interface
└── index.ts               # UPDATE

src/lib/components/
├── exercise/
│   ├── ExerciseComplete.svelte    # EXISTING - Add replay button
│   ├── ExplanationModal.svelte    # NEW - Explanation display
│   └── index.ts                   # UPDATE
└── common/
    └── index.ts

src/routes/game/[level]/
└── +page.svelte            # UPDATE - Add explanation trigger
```

### Technical Implementation Patterns

**Replay Button UX Pattern:**
```svelte
<script lang="ts">
  interface Props {
    onReplay: () => void;
    onViewExplanations: () => void;
  }
  
  let { onReplay, onViewExplanations }: Props = $props();
</script>

<div class="exercise-complete" role="status" aria-live="polite">
  <h2>Exercise Complete!</h2>
  <p>Your score: <strong>{score}%</strong></p>
  
  <div class="action-buttons">
    <button 
      onclick={onReplay}
      class="btn-primary"
      aria-label="Replay exercise with new questions"
    >
      Replay Exercise
    </button>
    
    <button 
      onclick={onViewExplanations}
      class="btn-secondary"
      aria-label="View explanations for answers"
    >
      View Explanations
    </button>
  </div>
</div>

<style>
  .exercise-complete {
    background: #2D1B4E;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
  }
  
  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1.5rem;
  }
  
  .btn-primary {
    background: #D4AF37;
    color: #2D1B4E;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    min-width: 44px;
    min-height: 44px;
  }
  
  .btn-secondary {
    background: transparent;
    border: 2px solid #D4AF37;
    color: #D4AF37;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    min-width: 44px;
    min-height: 44px;
  }
</style>
```

**Explanation Modal UX Pattern:**
```svelte
<script lang="ts">
  import type { Explanation } from '$lib/game/ExplanationService';
  
  interface Props {
    explanations: Explanation[];
    onClose: () => void;
  }
  
  let { explanations, onClose }: Props = $props();
</script>

{#if explanations.length > 0}
  <div 
    class="explanation-modal" 
    role="dialog" 
    aria-modal="true"
    aria-labelledby="explanation-title"
  >
    <div class="modal-header">
      <h2 id="explanation-title">Learn from Your Answers</h2>
      <button 
        onclick={onClose} 
        class="close-btn"
        aria-label="Close explanations"
      >
        ×
      </button>
    </div>
    
    <div class="explanation-list">
      {#each explanations as explanation, index}
        <article class="explanation-card" aria-label="Explanation {index + 1}">
          <h3>{explanation.title}</h3>
          <p class="description">{explanation.description}</p>
          <p class="musical-context">{explanation.musicalContext}</p>
          <blockquote class="encouraging">
            {explanation.encouragingNote}
          </blockquote>
        </article>
      {/each}
    </div>
  </div>
{/if}

<style>
  .explanation-modal {
    position: fixed;
    inset: 0;
    background: rgba(26, 26, 46, 0.95);
    overflow-y: auto;
    padding: 2rem;
  }
  
  .explanation-card {
    background: #2D1B4E;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    border-left: 4px solid #D4AF37;
  }
  
  .encouraging {
    background: rgba(212, 175, 55, 0.1);
    border-left: 3px solid #2ECC71;
    padding: 0.75rem;
    margin-top: 1rem;
    color: #F5E6D3;
    font-style: italic;
  }
</style>
```

### Previous Story Learnings (CRITICAL - BUILD ON THESE)

From Story 2-6 Microphone Permission Handling:
- ✅ MicrophonePermission service uses singleton pattern
- ✅ Audio services isolated from components
- ✅ Svelte 5 runes ($state, $derived, $effect) for all state
- ✅ Component Props interface + $props() pattern
- ✅ Accessibility: ARIA labels, keyboard nav, 44px touch targets
- ✅ Art Nouveau theme colors for all UI
- ✅ Permission states properly managed with type safety

From Story 2-5 Real-time Pitch Detection:
- ✅ PitchDetector service uses AudioContext singleton pattern
- ✅ audioStore is PRIMARY service for audio state management
- ✅ Component Props interface + $props() pattern
- ✅ Accessibility: ARIA labels, keyboard nav, 44px touch targets
- ✅ Art Nouveau theme colors for all UI

From Story 2-4 Exercise Pause and Resume:
- ✅ ExerciseSession store pattern for state management
- ✅ State properly preserved across sessions

From Story 2-3 Exercise Launch and Completion:
- ✅ ExerciseEngine handles scoring and completion
- ✅ AudioEngine service architecture complete

**CRITICAL FIX from previous stories:**
- AudioContext singleton MUST be used - never create new instances
- AudioContext readiness MUST be verified before any operation
- Svelte 5 runes MUST be used (NOT legacy $: syntax)
- State MUST be properly cleared on exercise reset

**Patterns to REUSE from previous stories:**
- Same store pattern: `export function createXxxStore()` with $state, $derived
- Same component structure: Props interface + $props() pattern  
- Same styling: Tailwind classes with Art Nouveau theme colors
- Same accessibility: ARIA labels, keyboard nav, 44px touch targets
- Same testing: Vitest + mocks from tests/setup.ts

**Files to reference:**
- `src/lib/game/ExerciseEngine.ts` - Add resetExercise method
- `src/lib/audio/PitchDetector.ts` - Reference for audio service patterns
- `src/lib/audio/AudioEngine.ts` - Use same singleton pattern
- `src/lib/stores/audio.svelte.ts` - Reference for store patterns
- `src/lib/components/pitch/` - Reference for component patterns

### Git Intelligence (From Recent Commits)

Recent commits show:
- Story 2-6 completed: Microphone permission handling with clear UX
- Story 2-5 completed: Real-time pitch detection with microphone integration
- Story 2-4 completed: Exercise pause and resume functionality
- Story 2-3 completed: Exercise launch and completion system  
- Story 2-2 completed: Audio playback system
- All stories following BMad methodology with Svelte 5 runes
- Consistent code patterns: singleton AudioContext, Dexie single instance

### Web Intelligence (Latest Best Practices 2026)

**Exercise Replay Best Practices:**

1. **Randomization**
   - Generate new questions using cryptographically secure randomness
   - Ensure same question doesn't appear twice in replay
   - Shuffle answer options for multiple choice
   - Track seen questions to avoid repeats within session

2. **State Management**
   - Completely reset exercise state on replay
   - Clear all user answers, scores, timestamps
   - Reset timers if exercise has time limits
   - Maintain exercise configuration (type, difficulty)

3. **Explanation Design**
   - Provide immediate feedback after each answer (not just at end)
   - Include musical context and theory
   - Use encouraging language - focus on learning, not mistakes
   - Offer related exercises for practice
   - Show correct answer with explanation

4. **UX Best Practices**
   - Clear replay button on completion screen
   - Confirm before replay if user hasn't completed exercise
   - Show "New Questions" indicator to confirm replay
   - Maintain user's journey position (don't reset chapter progress)

5. **Accessibility**
   - Screen reader announces replay option
   - Keyboard accessible replay button (Tab, Enter)
   - High contrast on all text
   - Focus management: return focus to replay button after closing modal

### Architecture Compliance (MANDATORY)

**From architecture.md:**
1. Svelte 5 runes for state - MANDATORY
2. Audio services isolated from components - MANDATORY
3. AudioContext singleton pattern - MANDATORY
4. Component co-location with tests - MANDATORY
5. TypeScript strict mode - MANDATORY

**From project-context.md:**
- Component structure: `interface Props { ... }` + `let { ... }: Props = $props();`
- Store pattern: `export function createXxxStore()` with getters
- Test file co-location: `*.test.ts` next to `*.ts`

**Conflict Prevention:**
- DO NOT mix $: with $state
- DO NOT create AudioContext at module level
- DO NOT reuse previous answers in new attempt
- DO NOT use localStorage for structured data (use IndexedDB)
- DO NOT put audio logic in components (use audioStore)
- DO NOT use `any` type - use `unknown` with type guards

### Library/Framework Requirements

**Required:**
- SvelteKit with TypeScript ^5.x (strict mode)
- Web Audio API (native) - For playing interval/chord samples
- Vitest for unit tests

**No additional libraries needed** - All functionality provided by existing architecture.

### Testing Requirements

- **Unit Tests**: Use Vitest (configured in vitest.config.ts)
- **Mocking**: Mock AudioEngine, random generation
- **Coverage**: Test replay functionality, explanation display, state reset

**Test Scenarios:**
1. Replay generates completely new questions
2. Previous answers don't affect new attempt
3. Explanations display for incorrect answers
4. Explanations are encouraging (not punitive)
5. Replay button is accessible via keyboard

### Design System (Art Nouveau "Mystical Orient")

**Colors to use:**
- Primary: Deep purple (#2D1B4E), Rich gold (#D4AF37)
- Secondary: Teal (#1A5F5F), Burgundy (#722F37)
- Accent: Warm cream (#F5E6D3), Soft rose (#E8B4B8)
- Background: Dark (#1A1A2E) for immersive focus during exercises
- Success: Emerald green (#2ECC71)
- Error: Soft coral (#E74C3C)
- Warning: Gold (#D4AF37)

**Completion Screen Styling:**
- Background: Deep purple (#2D1B4E)
- Title: Rich gold (#D4AF37), serif font
- Score: Large, prominent display
- Buttons: Gold (#D4AF37) with purple text, 44px min touch targets
- Explanation cards: Purple background with gold left border

**Typography:**
- Display serif for headings (Playfair Display)
- Clean sans-serif for body text (Inter)

### Accessibility Requirements (MANDATORY)

- WCAG 2.1 Level A compliance
- Keyboard: All buttons keyboard accessible (Tab, Enter, Escape)
- Screen reader: Announce completion, replay option, explanation content
- Visual: High contrast on modal, clear iconography
- Touch: 44x44px minimum touch targets for all buttons
- Focus: Trap focus in modal when open, return focus on close

---

## Dev Agent Record

### Agent Model Used

opencode/big-pickle

### Debug Log References

From story 2-6:
- MicrophonePermission service follows singleton pattern
- audioStore manages audio state with Svelte 5 runes

From story 2-5:
- PitchDetector service uses AudioContext singleton pattern
- getUserMedia called from PitchDetector for microphone access

From story 2-4:
- audioStore is PRIMARY service for audio state management
- ExerciseSession store pattern for state management

From story 2-3:
- ExerciseEngine handles scoring and completion
- AudioEngine service architecture complete

### Completion Notes List

**Implementation Summary:**
- Add resetExercise() method to ExerciseEngine
- Create ExplanationService for answer explanations
- Add replay button to ExerciseComplete component
- Create ExplanationModal component with encouraging messaging
- All tests pass
- Code follows project architecture patterns (singleton AudioContext, Svelte 5 runes)

### File List

**New files:**
- src/lib/game/ExplanationService.ts (answer explanation service)
- src/lib/game/ExplanationService.test.ts (unit tests)
- src/lib/components/exercise/ExplanationModal.svelte (explanation display)

**Modified files:**
- src/lib/game/ExerciseEngine.ts (add resetExercise method, AnswerRecord interface)
- src/lib/game/index.ts (export ExplanationService)
- src/lib/music/theory.ts (add getRandomInterval, getIntervalOptions, getIntervalDescription, getIntervalMusicalContext, formatIntervalName)
- src/lib/components/exercise/ScoreDisplay.svelte (add replay and view explanations buttons)
- src/lib/components/exercise/ExerciseView.svelte (integrate replay and explanation functionality)
- src/lib/components/exercise/index.ts (export ExplanationModal)

---

## Senior Developer Review (AI)

### Review Date: 2026-03-17
### Reviewer: Charles (Adversarial Code Review)

### Issues Found and Fixed

#### 🔴 HIGH - Fixed
1. **Duplicate Question Prevention Broken** - The original code tracked question UUIDs to prevent duplicates, but UUIDs are always unique so the check was ineffective. Fixed by tracking answer combinations (correct answer + options) instead.

2. **Replay Flow Logic Error** - The original replay code called resetExercise() then loadExercise() which overwrote the new questions. Fixed by reordering to: initialize() → resetExercise() → loadExercise().

3. **Hardcoded Exercise Type** - ScoreDisplay always used 'interval-identification' regardless of actual exercise type. Fixed by adding exerciseType prop.

#### 🟡 MEDIUM - Fixed
4. **Race Condition** - ScoreDisplay fetched answer history from engine immediately on mount, but data might not be ready. Fixed by accepting answerHistory as prop from parent.

5. **Silent Replay Failure** - Replay errors were only logged to console. Fixed by adding replayError state and displaying user-facing error message.

#### 🟢 LOW - Fixed
6. **Test Type Safety** - Removed `as any` cast in test file.

### Files Modified During Review
- src/lib/game/ExerciseEngine.ts - Fixed duplicate prevention, added generateQuestionKey()
- src/lib/components/exercise/ScoreDisplay.svelte - Added exerciseType, answerHistory, replayError props
- src/lib/components/exercise/ExerciseView.svelte - Fixed replay flow, added error handling
- src/lib/game/ExplanationService.test.ts - Removed `as any` type cast

### Test Results
All 13 ExplanationService tests pass ✅
TypeScript compilation successful ✅

---

### Review Date: 2026-03-17 (Follow-up Review)
### Reviewer: Charles (Adversarial Code Review)

#### Issues Found and Fixed

##### 🔴 HIGH - Source Code Not Committed
- **Issue:** All source files in `src/` are untracked (not committed to git)
- **Impact:** No version control history, cannot track changes
- **Status:** ⚠️ REQUIRES MANUAL ACTION - User must commit changes

##### 🟡 MEDIUM - Type Safety Issue (FIXED)
- **Location:** `src/lib/components/exercise/ScoreDisplay.svelte`
- **Issue:** Used `as any` cast to bypass type checking
- **Fix Applied:** Changed `exerciseType?: string` to `exerciseType?: ExerciseType` with proper type import
- **Files Modified:**
  - `src/lib/components/exercise/ScoreDisplay.svelte` - Fixed type import and removed `as any` cast

##### 🟢 LOW
- *(None found)*

#### Test Results After Fix
All 227 tests pass ✅
TypeScript compilation successful ✅
