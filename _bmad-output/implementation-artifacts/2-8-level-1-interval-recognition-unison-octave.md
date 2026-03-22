# Story 2.8: Level 1 - Interval Recognition (Unison & Octave)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

---

## Tasks/Subtasks

### Phase 1: Core Utilities
- [x] Create `src/lib/music/intervals.ts` with interval utilities
- [x] Add `getRandomIntervalInSet()` function
- [x] Add `getRandomRootNote()` function
- [x] Add `getTargetNote()` function
- [x] Add `getIntervalDisplayName()` function
- [x] Update `src/lib/music/index.ts` to export new functions

### Phase 2: Type Definitions
- [x] Update `src/lib/types/game.ts` with new ExerciseTypes
- [x] Add `IntervalQuestion` and `AudiationQuestion` type definitions

### Phase 3: Exercise Engine
- [x] Create `src/lib/game/IntervalExercise.ts` with core logic
- [x] Implement interval question generation
- [x] Implement audiation question generation
- [x] Implement harmonic/melodic playback
- [x] Add answer checking and scoring

### Phase 4: UI Components
- [x] Create `IntervalOptions.svelte` component
- [x] Create Level 1 page at `src/routes/game/level-1/+page.svelte`
- [x] Update `AnswerInput.svelte` to handle new exercise types

### Phase 5: Integration
- [x] Update `levels.ts` with new Level 1 definition
- [x] Update `ExplanationService.ts` with interval explanations
- [x] Update `src/lib/game/index.ts` to export IntervalExercise
- [x] Update `src/lib/components/exercise/index.ts` to export new components

### Phase 6: Testing
- [x] Create `src/lib/music/intervals.test.ts` with comprehensive tests
- [x] All 25 unit tests pass

### Phase 7: Validation
- [x] Run all existing tests - 252 tests pass
- [x] Verify no regressions
- [x] Update story status to "review"

---

## Story

As a beginner user,
I want to learn to recognize Unison and Octave intervals,
so that I can develop my foundational ear training skills.

## Acceptance Criteria

1. **Given** the user starts Lesson 1
   **When** they hear a harmonic interval (two notes played simultaneously)
   **Then** the system plays Unison and Octave examples
   **And** the user can replay each example

2. **Given** the user is in Exercise 1 (Audiation)
   **When** the system plays a reference note
   **Then** the user imagines the octave note before hearing it
   **And** the system confirms correct audiation

3. **Given** the user is in Exercise 3 (Harmonic Identification)
   **When** the system plays Unison or Octave
   **Then** the user can correctly identify the interval
   **And** feedback is provided for each answer

**Lessons covered:** L1 (Unison and Octave)
**Exercises covered:** Ex1 (Audiation), Ex3 (Harmonic Identification), Ex7 (Melodic Recognition), Ex8 (Harmonic Recognition)

---

## Dev Notes

### Architecture Requirements (MANDATORY - DO NOT DEVIATE)

**Interval Exercise Engine Pattern:**
- **MUST** create new exercise type: `interval-recognition-unison-octave`
- **MUST** generate random intervals from: Unison (P1), Octave (P8)
- **MUST** support both harmonic (simultaneous) and melodic (successive) playback
- **MUST** use AudioEngine for playback (NOT create new AudioContext)

```typescript
// ✅ CORRECT - Interval recognition for Unison/Octave
import { getAudioContext } from '$lib/audio/AudioEngine';
import { playInterval } from '$lib/audio/SampleLibrary';
import { getRandomIntervalInSet, INTERVALS } from '$lib/music/intervals';

// Supported intervals for this story (FR54, FR55)
const UNISON_OCTAVE_INTERVALS = ['P1', 'P8']; // Perfect Unison, Perfect Octave

export type IntervalType = 'harmonic' | 'melodic';

export interface IntervalQuestion {
  id: string;
  type: 'interval';
  interval: string; // 'P1' or 'P8'
  intervalName: 'Unison' | 'Octave';
  playbackType: IntervalType; // harmonic or melodic
  rootNote: string; // e.g., 'C4'
  targetNote: string; // e.g., 'C5' for octave
  options: string[]; // ['Unison', 'Octave']
  correctAnswer: string;
}

function generateIntervalQuestion(): IntervalQuestion {
  const interval = getRandomIntervalInSet(UNISON_OCTAVE_INTERVALS);
  const rootNote = getRandomRootNote(); // Random starting note
  const playbackType: IntervalType = Math.random() > 0.5 ? 'harmonic' : 'melodic';
  
  // Calculate target note based on interval
  const targetNote = getTargetNote(rootNote, interval);
  
  return {
    id: crypto.randomUUID(),
    type: 'interval',
    interval,
    intervalName: interval === 'P1' ? 'Unison' : 'Octave',
    playbackType,
    rootNote,
    targetNote,
    options: ['Unison', 'Octave'],
    correctAnswer: interval === 'P1' ? 'Unison' : 'Octave',
  };
}
```

**Music Theory Utilities Required:**
- **MUST** add to `src/lib/music/intervals.ts`:
  - `getRandomIntervalInSet(intervals: string[]): string` - Get random from specific set
  - `getRandomRootNote(): string` - Random starting note (within comfortable singing range C3-C5)
  - `getTargetNote(rootNote: string, interval: string): string` - Calculate target note
  - `getIntervalDisplayName(interval: string): string` - 'P1' → 'Unison', 'P8' → 'Octave'

```typescript
// ✅ REQUIRED - Add to src/lib/music/intervals.ts
export const INTERVALS = {
  P1: { name: 'Unison', semitones: 0 },
  P8: { name: 'Octave', semitones: 12 },
  P5: { name: 'Perfect Fifth', semitones: 7 },
  M3: { name: 'Major Third', semitones: 4 },
  // ... other intervals for future stories
};

export function getRandomIntervalInSet(intervalKeys: string[]): string {
  return intervalKeys[Math.floor(Math.random() * intervalKeys.length)];
}

export function getRandomRootNote(): string {
  // C3 to C5 - comfortable singing range
  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const octaves = [3, 4, 5];
  const note = notes[Math.floor(Math.random() * notes.length)];
  const octave = octaves[Math.floor(Math.random() * octaves.length)];
  return `${note}${octave}`;
}

export function getTargetNote(rootNote: string, interval: string): string {
  // Parse root note and calculate target
  const note = rootNote.slice(0, -1);
  const octave = parseInt(rootNote.slice(-1));
  const semitones = INTERVALS[interval as keyof typeof INTERVALS]?.semitones || 0;
  
  // Simple calculation - in production use proper note math
  const rootIndex = NOTE_INDEXES[note];
  const targetIndex = (rootIndex + semitones) % 12;
  const targetOctave = octave + Math.floor((rootIndex + semitones) / 12);
  
  return `${INDEX_NOTES[targetIndex]}${targetOctave}`;
}
```

**Audiation Exercise Pattern (Exercise 1 - Ex1):**
- **MUST** implement mental pitch matching (no audio playback of target)
- **MUST** play reference note, pause, then play target note for confirmation
- **MUST** use encouraging feedback for attempts

```typescript
// ✅ CORRECT - Audiation exercise pattern
export interface AudiationQuestion {
  id: string;
  type: 'audiation';
  rootNote: string;
  targetNote: string; // Octave above
  expectedAction: 'imagine'; // User imagines the pitch
}

export async function playAudiationPrompt(
  question: AudiationQuestion,
  audioEngine: AudioEngine
): Promise<void> {
  // Step 1: Play reference note
  await audioEngine.playNote(question.rootNote);
  
  // Step 2: Pause for user to imagine (2-3 seconds)
  await delay(2500);
  
  // Step 3: Play target for confirmation
  await audioEngine.playNote(question.targetNote);
}

export function getAudiationFeedback(wasCorrect: boolean): string {
  if (wasCorrect) {
    return "Excellent! You imagined the pitch perfectly. The octave is the same note one register higher.";
  }
  return "Good effort! Try to feel the pitch in your mind before hearing it. The octave is the same note one register higher.";
}
```

**Project Structure:**
```
src/lib/music/
├── intervals.ts             # UPDATE - Add getRandomIntervalInSet, getRandomRootNote, getTargetNote
├── chords.ts               # EXISTING
├── scales.ts               # EXISTING
└── index.ts               # UPDATE - Export new functions

src/lib/game/
├── ExerciseEngine.ts      # UPDATE - Add interval-recognition-unison-octave exercise type
├── IntervalExercise.ts    # NEW - Interval recognition specific logic
├── ExplanationService.ts  # EXISTING (from 2-7) - Update for interval explanations
├── Scoring.ts             # EXISTING - Update scoring for interval accuracy
├── Progress.ts            # EXISTING
└── index.ts              # UPDATE - Export new modules

src/lib/audio/
├── AudioEngine.ts         # EXISTING - Verify playInterval method exists
├── SampleLibrary.ts       # EXISTING - Verify note playback
└── index.ts              # UPDATE if needed

src/lib/components/exercise/
├── IntervalExercise.svelte    # NEW - Main exercise component
├── AudiationExercise.svelte   # NEW - Exercise 1 specific
├── HarmonicIDExercise.svelte  # NEW - Exercise 3 specific
├── MelodicIDExercise.svelte   # NEW - Exercise 7/8
├── IntervalOptions.svelte     # NEW - Answer buttons (Unison/Octave)
└── index.ts                  # UPDATE - Export new components

src/lib/types/
├── game.ts               # UPDATE - Add IntervalQuestion, AudiationQuestion types
└── index.ts             # UPDATE

src/routes/game/level-1/
└── +page.svelte         # NEW - Level 1 page (Lesson 1)
```

### Technical Implementation Patterns

**Answer Button Component (Unison/Octave):**
```svelte
<script lang="ts">
  interface Props {
    options: string[]; // ['Unison', 'Octave']
    onAnswer: (answer: string) => void;
    disabled?: boolean;
  }
  
  let { options, onAnswer, disabled = false }: Props = $props();
</script>

<div class="interval-options" role="group" aria-label="Select interval answer">
  {#each options as option}
    <button
      onclick={() => onAnswer(option)}
      disabled={disabled}
      class="interval-btn"
      aria-label={option}
    >
      {option}
    </button>
  {/each}
</div>

<style>
  .interval-options {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    margin: 2rem 0;
  }
  
  .interval-btn {
    min-width: 140px;
    min-height: 80px;
    background: #2D1B4E;
    border: 2px solid #D4AF37;
    border-radius: 12px;
    color: #F5E6D3;
    font-size: 1.25rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .interval-btn:hover:not(:disabled) {
    background: #D4AF37;
    color: #2D1B4E;
    transform: translateY(-2px);
  }
  
  .interval-btn:focus {
    outline: 3px solid #D4AF37;
    outline-offset: 2px;
  }
  
  .interval-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
```

**Harmonic Interval Playback:**
```typescript
// ✅ CORRECT - Harmonic (simultaneous) playback
async function playHarmonicInterval(
  audioEngine: AudioEngine,
  rootNote: string,
  targetNote: string
): Promise<void> {
  // Both notes play together
  await Promise.all([
    audioEngine.playNote(rootNote),
    audioEngine.playNote(targetNote),
  ]);
}

// ✅ CORRECT - Melodic (successive) playback
async function playMelodicInterval(
  audioEngine: AudioEngine,
  rootNote: string,
  targetNote: string,
  ascending: boolean = true
): Promise<void> {
  const [first, second] = ascending 
    ? [rootNote, targetNote] 
    : [targetNote, rootNote];
  
  await audioEngine.playNote(first);
  await delay(500); // Brief pause between notes
  await audioEngine.playNote(second);
}
```

### Previous Story Learnings (CRITICAL - BUILD ON THESE)

From Story 2-7 (Exercise Replay and Explanations):
- ✅ ExerciseEngine has `resetExercise()` method
- ✅ ExplanationService provides encouraging, non-punitive messaging
- ✅ Exercise complete screen has replay functionality
- ✅ State properly cleared on exercise reset
- ✅ ExerciseEngine generates new random questions on reset

From Story 2-6 (Microphone Permission Handling):
- ✅ MicrophonePermission service uses singleton pattern
- ✅ Audio services isolated from components
- ✅ Svelte 5 runes ($state, $derived, $effect) for all state
- ✅ Component Props interface + $props() pattern
- ✅ Accessibility: ARIA labels, keyboard nav, 44px touch targets
- ✅ Art Nouveau theme colors for all UI

From Story 2-5 (Real-time Pitch Detection):
- ✅ PitchDetector service uses AudioContext singleton pattern
- ✅ audioStore is PRIMARY service for audio state management

From Story 2-4 (Exercise Pause and Resume):
- ✅ ExerciseSession store pattern for state management
- ✅ State properly preserved across sessions

From Story 2-3 (Exercise Launch and Completion):
- ✅ ExerciseEngine handles scoring and completion
- ✅ AudioEngine service architecture complete

**CRITICAL FIX from previous stories:**
- AudioContext singleton MUST be used - never create new instances
- AudioContext readiness MUST be verified before any operation
- Svelte 5 runes MUST be used (NOT legacy $: syntax)
- State MUST be properly cleared on exercise reset
- Questions MUST be truly random - avoid repeats within session

**Patterns to REUSE from previous stories:**
- Same store pattern: `export function createXxxStore()` with $state, $derived
- Same component structure: Props interface + $props() pattern  
- Same styling: Tailwind classes with Art Nouveau theme colors
- Same accessibility: ARIA labels, keyboard nav, 44px touch targets
- Same testing: Vitest + mocks from tests/setup.ts
- ExplanationService from 2-7 for answer explanations

**Files to reference:**
- `src/lib/game/ExerciseEngine.ts` - Add new exercise type handler
- `src/lib/game/ExplanationService.ts` - Add interval explanations
- `src/lib/audio/PitchDetector.ts` - Reference for audio service patterns
- `src/lib/audio/AudioEngine.ts` - Use same singleton pattern
- `src/lib/music/intervals.ts` - Add interval utilities
- `src/lib/components/exercise/` - Reference for component patterns

### Git Intelligence (From Recent Commits)

Recent commits show:
- Story 2-7 completed: Exercise replay and explanations
- Story 2-6 completed: Microphone permission handling
- Story 2-5 completed: Real-time pitch detection
- Story 2-4 completed: Exercise pause/resume
- All stories following BMad methodology with Svelte 5 runes
- Consistent code patterns: singleton AudioContext, Dexie single instance
- Code review fixes applied: duplicate prevention, type safety

### Web Intelligence (Latest Best Practices 2026)

**Interval Recognition Best Practices:**

1. **Pitch Range Selection**
   - Use comfortable singing range (C3-C5 for most users)
   - Avoid extreme high/low notes that are hard to match
   - Consider transposition for users who struggle

2. **Interval Teaching Approach**
   - Unison: "Same note" - easiest to recognize
   - Octave: "Same note, higher/lower" - next easiest
   - Provide clear audio examples before asking for identification

3. **Audiation Training (Exercise 1)**
   - Play reference note
   - Allow 2-3 seconds for mental imagery
   - Play target for confirmation
   - Positive reinforcement regardless of accuracy

4. **Harmonic vs Melodic**
   - Harmonic: Both notes together - easier for beginners
   - Melodic: Notes in sequence - harder, build up to this
   - Alternate between types for comprehensive training

5. **Accessibility**
   - Screen reader announces interval options clearly
   - Keyboard navigation between answer buttons
   - Visual feedback with color + icons + text
   - All audio has visual representation (note names)

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
- DO NOT use localStorage for structured data (use IndexedDB)
- DO NOT put audio logic in components (use audioStore)
- DO NOT use `any` type - use `unknown` with type guards
- DO NOT reuse previous questions in same session

### Library/Framework Requirements

**Required:**
- SvelteKit with TypeScript ^5.x (strict mode)
- Web Audio API (native) - For playing interval samples
- Dexie ^4.x - For storing progress/scores

**No additional libraries needed** - All functionality provided by existing architecture.

### Testing Requirements

- **Unit Tests**: Use Vitest (configured in vitest.config.ts)
- **Mocking**: Mock AudioEngine, random generation
- **Coverage**: Test interval generation, audio playback, scoring

**Test Scenarios:**
1. Unison/Octave intervals generate correctly
2. Harmonic playback plays both notes simultaneously
3. Melodic playback plays notes successively
4. User can identify Unison vs Octave
5. Audiation exercise plays reference then target
6. Score calculated correctly (100% for all correct)
7. Progress saved to IndexedDB

### Design System (Art Nouveau "Mystical Orient")

**Colors to use:**
- Primary: Deep purple (#2D1B4E), Rich gold (#D4AF37)
- Secondary: Teal (#1A5F5F), Burgundy (#722F37)
- Accent: Warm cream (#F5E6D3), Soft rose (#E8B4B8)
- Background: Dark (#1A1A2E) for immersive focus during exercises
- Success: Emerald green (#2ECC71)
- Error: Soft coral (#E74C3C)
- Warning: Gold (#D4AF37)

**Interval Exercise Styling:**
- Background: Dark (#1A1A2E)
- Answer buttons: Purple background, gold border, cream text
- Play button: Gold with purple icon
- Correct feedback: Green highlight
- Incorrect feedback: Coral with encouraging message

**Typography:**
- Display serif for headings (Playfair Display)
- Clean sans-serif for body text (Inter)

### Accessibility Requirements (MANDATORY)

- WCAG 2.1 Level A compliance
- Keyboard: All buttons keyboard accessible (Tab, Enter, Escape)
- Screen reader: Announce interval options, play button, feedback
- Visual: High contrast on all text
- Touch: 44x44px minimum touch targets for all buttons
- Audio: Visual representation of all audio (note names displayed)
- Focus: Clear focus indicators on all interactive elements

---

## Dev Agent Record

### Agent Model Used

opencode/big-pickle

### Debug Log References

From story 2-7:
- ExerciseEngine has resetExercise() method
- ExplanationService provides encouraging explanations

From story 2-6:
- MicrophonePermission service follows singleton pattern
- audioStore manages audio state with Svelte 5 runes

From story 2-5:
- PitchDetector service uses AudioContext singleton pattern

From story 2-4:
- ExerciseSession store pattern for state management

From story 2-3:
- ExerciseEngine handles scoring and completion
- AudioEngine service architecture complete

### Completion Notes List

**Implementation Summary:**
- Created comprehensive interval utilities in `src/lib/music/intervals.ts` supporting Unison and Octave interval recognition
- Implemented `IntervalExercise` engine with support for:
  - Harmonic intervals (simultaneous playback)
  - Melodic intervals (successive playback)
  - Audiation exercises (mental pitch matching)
- Created `IntervalOptions.svelte` component with Art Nouveau styling
- Built Level 1 page at `/game/level-1` with:
  - Question progression with progress tracking
  - Play/Replay functionality
  - Unison/Octave answer buttons with note hints
  - Feedback display with encouraging messages
  - Completion screen with score display
- Updated ExplanationService with Unison/Octave-specific explanations
- Added 25 unit tests for interval utilities - all passing
- All 252 tests pass with no regressions

**Key Technical Decisions:**
- Used AudioEngine/SampleLibrary for playback (not new AudioContext)
- Followed Svelte 5 runes pattern for all component state
- Used singleton pattern for audio context management
- Implemented proper error handling for audio playback
- Maintained accessibility (ARIA labels, keyboard navigation, 44px touch targets)
- Used Art Nouveau theme colors (#2D1B4E purple, #D4AF37 gold, #F5E6D3 cream)

**Code Quality:**
- 25 new unit tests added
- All 252 tests pass
- TypeScript strict mode compliance
- No new dependencies required

### File List

**New files created:**
- `src/lib/music/intervals.ts` - Interval utilities (getRandomIntervalInSet, getRandomRootNote, getTargetNote, getIntervalDisplayName, generateIntervalQuestion, generateAudiationQuestion, checkIntervalAnswer)
- `src/lib/music/intervals.test.ts` - Unit tests for interval utilities (25 tests)
- `src/lib/game/IntervalExercise.ts` - Core interval exercise engine
- `src/lib/components/exercise/IntervalOptions.svelte` - Answer button component for Unison/Octave
- `src/routes/game/level-1/+page.svelte` - Level 1 lesson page

**Modified files:**
- `src/lib/music/index.ts` - Added export for intervals module
- `src/lib/types/game.ts` - Added new ExerciseTypes: 'interval-recognition-unison-octave', 'audiation', 'harmonic-identification', 'melodic-identification'
- `src/lib/game/index.ts` - Added export for IntervalExercise
- `src/lib/game/levels.ts` - Added Level 1 definition for Unison/Octave
- `src/lib/game/ExplanationService.ts` - Added Unison/Octave explanations and new exercise type support
- `src/lib/components/exercise/index.ts` - Added export for IntervalOptions
- `src/lib/components/exercise/AnswerInput.svelte` - Added support for new exercise types

---

## Senior Developer Review

### Review Status: PENDING

_(To be completed after implementation)_
