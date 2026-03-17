# Story 2.5: Real-time Pitch Detection

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to sing notes and have the app detect my pitch,
so that I can practice vocal ear training.

## Acceptance Criteria

1. **Given** the user grants microphone permission
   **When** they start pitch detection
   **Then** the app detects their sung note within 500ms
   **And** displays the detected pitch with ±50 cents accuracy

2. **Given** the user is singing
   **When** the detected pitch matches the target
   **Then** the app provides positive feedback
   **And** if not matching, shows encouraging guidance

## Tasks / Subtasks

- [x] Task 1 (AC: #1) - Implement pitch detection with 500ms latency
  - [x] Subtask 1.1 - Create PitchDetector service with autocorrelation algorithm
  - [x] Subtask 1.2 - Implement frequency-to-note conversion (±50 cents accuracy)
  - [x] Subtask 1.3 - Handle microphone permission request flow

- [x] Task 2 (AC: #2) - Display detected pitch with real-time feedback
  - [x] Subtask 2.1 - Create pitch visualization component
  - [x] Subtask 2.2 - Implement pitch matching logic with encouraging feedback

---

## Dev Notes

### Architecture Requirements (MANDATORY - DO NOT DEVIATE)

**PitchDetector Service Architecture:**
- **MUST** create new file: `src/lib/audio/PitchDetector.ts`
- **MUST** use Svelte 5 runes for all state management
- **MUST** implement autocorrelation algorithm for pitch detection
- **MUST** use AnalyserNode from Web Audio API
- **MUST** convert frequency to note with ±50 cents accuracy (A4 = 440 Hz reference)

**CRITICAL: AudioContext Singleton Pattern:**
```typescript
// ✅ CORRECT - Singleton pattern for AudioContext
let audioContext: AudioContext | null = null;
let analyserNode: AnalyserNode | null = null;
let microphoneStream: MediaStream | null = null;

export async function initializePitchDetection(): Promise<void> {
  audioContext = getAudioContext(); // Use existing singleton
  
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  microphoneStream = stream;
  
  const source = audioContext.createMediaStreamSource(stream);
  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 2048;
  analyserNode.smoothingTimeConstant = 0.8;
  
  source.connect(analyserNode);
}

export function getPitch(): { frequency: number; note: string; cents: number } | null {
  if (!analyserNode) return null;
  
  const buffer = new Float32Array(analyserNode.fftSize);
  analyserNode.getFloatTimeDomainData(buffer);
  
  const frequency = autoCorrelate(buffer, audioContext!.sampleRate);
  if (frequency === -1) return null;
  
  const noteInfo = frequencyToNote(frequency);
  return { frequency, ...noteInfo };
}
```

**Project Structure:**
```
src/lib/audio/
├── AudioEngine.ts           # EXISTING - Do not modify
├── SampleLibrary.ts        # EXISTING - Do not modify
├── PitchDetector.ts        # NEW - Real-time pitch detection
└── index.ts               # UPDATE - Export PitchDetector

src/lib/stores/
├── audio.svelte.ts         # EXISTING - Add pitch detection state
└── index.ts               # UPDATE - Export new store

src/lib/components/
├── pitch/
│   ├── PitchDisplay.svelte    # NEW - Shows detected pitch
│   ├── PitchVisualizer.svelte # NEW - Visual feedback
│   └── index.ts              # NEW
```

### Technical Implementation Patterns

**Pitch Detection Algorithm - Autocorrelation:**
```typescript
// Autocorrelation-based pitch detection
function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
  // Calculate RMS to check if signal is loud enough
  let rms = 0;
  for (let i = 0; i < buffer.length; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / buffer.length);
  
  if (rms < 0.01) return -1; // Signal too quiet
  
  // Find the best correlation period
  const SIZE = buffer.length;
  const MAX_SAMPLES = Math.floor(SIZE / 2);
  const correlations = new Float32Array(MAX_SAMPLES);
  
  for (let lag = 0; lag < MAX_SAMPLES; lag++) {
    let correlation = 0;
    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs((buffer[i]) - (buffer[i + lag]));
    }
    correlation = 1 - (correlation / MAX_SAMPLES);
    correlations[lag] = correlation;
  }
  
  // Find the first major peak after position 0
  let bestLag = -1;
  let bestCorrelation = 0;
  
  // Skip the first few samples (too high frequency)
  for (let lag = 20; lag < MAX_SAMPLES; lag++) {
    if (correlations[lag] > bestCorrelation) {
      bestCorrelation = correlations[lag];
      bestLag = lag;
    }
    // If correlation dropped significantly, we've passed the peak
    if (bestCorrelation > 0.9 && correlations[lag] < bestCorrelation - 0.2) {
      break;
    }
  }
  
  if (bestLag === -1 || bestCorrelation < 0.5) return -1;
  
  // Parabolic interpolation for better precision
  const betterLag = parabolicInterpolation(correlations, bestLag);
  
  return sampleRate / betterLag;
}

function parabolicInterpolation(correlations: Float32Array, lag: number): number {
  if (lag <= 0 || lag >= correlations.length - 1) return lag;
  
  const a = correlations[lag - 1];
  const b = correlations[lag];
  const c = correlations[lag + 1];
  
  const adjustment = (a - c) / (2 * (a - 2 * b + c));
  return lag + adjustment;
}
```

**Frequency to Note Conversion (±50 cents):**
```typescript
const NOTE_STRINGS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const A4_FREQUENCY = 440;
const A4_NOTE_NUMBER = 69;

function frequencyToNote(frequency: number): { note: string; octave: number; cents: number } {
  // Calculate MIDI note number from frequency
  const noteNumber = 12 * (Math.log2(frequency / A4_FREQUENCY)) + A4_NOTE_NUMBER;
  
  // Round to nearest note
  const roundedNote = Math.round(noteNumber);
  
  // Calculate cents deviation (how far from perfect pitch)
  const cents = Math.round(1200 * (Math.log2(frequency / frequencyFromNoteNumber(roundedNote))));
  
  const noteName = NOTE_STRINGS[roundedNote % 12];
  const octave = Math.floor(roundedNote / 12) - 1;
  
  return { note: noteName, octave, cents };
}

function frequencyFromNoteNumber(noteNumber: number): number {
  return A4_FREQUENCY * Math.pow(2, (noteNumber - A4_NOTE_NUMBER) / 12);
}
```

**Microphone Permission Flow:**
```typescript
// Handle microphone permission with graceful degradation
async function requestMicrophonePermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Permission granted - stream will be used by PitchDetector
    return true;
  } catch (error) {
    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError') {
        // User denied permission - show guidance
        console.log('Microphone permission denied');
      } else if (error.name === 'NotFoundError') {
        // No microphone found
        console.log('No microphone found');
      }
    }
    return false;
  }
}
```

### Previous Story Learnings (CRITICAL - BUILD ON THESE)

From Story 2-4 Exercise Pause and Resume:
- ✅ ExerciseSession store pattern fully implemented with Svelte 5 runes
- ✅ AudioEngine integration working via audioStore
- ✅ All audio services use singleton AudioContext pattern
- ✅ IndexedDB persistence working for exercise state
- ✅ Component patterns: Props interface + $props() pattern

From Story 2-3 Exercise Launch and Completion:
- ✅ ExerciseEngine handles scoring and completion
- ✅ AudioEngine service architecture complete
- ✅ Accessibility patterns confirmed: ARIA labels, keyboard nav, 44px touch targets

**CRITICAL FIX from previous stories:**
- AudioContext singleton MUST be used - never create new instances
- AudioContext readiness MUST be verified before any operation
- Svelte 5 runes MUST be used (NOT legacy $: syntax)

**Patterns to REUSE from previous stories:**
- Same store pattern: `export function createXxxStore()` with $state, $derived
- Same component structure: Props interface + $props() pattern  
- Same styling: Tailwind classes with Art Nouveau theme colors
- Same accessibility: ARIA labels, keyboard nav, 44px touch targets
- Same testing: Vitest + mocks from tests/setup.ts

**Files to reference:**
- `src/lib/audio/AudioEngine.ts` - Use same singleton pattern
- `src/lib/stores/audio.svelte.ts` - Add pitch state to existing audioStore
- `src/lib/components/exercise/` - Reference for component patterns

### Git Intelligence (From Recent Commits)

Recent commits show:
- Story 2-4 completed: Exercise pause and resume functionality
- Story 2-3 completed: Exercise launch and completion system  
- Story 2-2 completed: Audio playback system
- Story 2-1 completed: Exercise library access
- All stories following BMad methodology with Svelte 5 runes
- Consistent code patterns: singleton AudioContext, Dexie single instance

### Web Intelligence (Latest Best Practices)

**Pitch Detection Algorithm Selection:**
- **Autocorrelation** recommended for vocals/singing (robust for monophonic signals)
- **YIN Algorithm** alternative - better for noisy environments, fewer octave errors
- Use **parabolic interpolation** for improved precision (±1 cent)
- Set **RMS threshold** (~0.01) to filter quiet/noisy signals

**Performance Requirements (from architecture.md):**
- Pitch detection latency: < 500ms ✓
- User interaction response: < 100ms ✓
- Use requestAnimationFrame for smooth real-time updates

**Browser API Best Practices:**
- Use `navigator.mediaDevices.getUserMedia()` for microphone access
- Handle browser autoplay policies - AudioContext starts suspended
- Handle suspended AudioContext after page visibility changes
- Clean up microphone stream on component destroy

**Pitch Display Best Practices:**
- Show current note (e.g., "A4")
- Show cents deviation (-50 to +50)
- Visual feedback: green when in tune, red/yellow when off
- Show target note vs detected note for exercises

**Reference Libraries:**
- `@milcktoast/pitch-detector` (MIT licensed) - ES6 module, AudioWorklet support
- `cwilso/PitchDetect` - Original reference implementation (autocorrelation)

### Architecture Compliance (MANDATORY)

**From architecture.md:**
1. Svelte 5 runes for state - MANDATORY
2. Dexie single instance for persistence - MANDATORY (if storing pitch history)
3. Audio services isolated from components - MANDATORY
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

### Library/Framework Requirements

**Required:**
- SvelteKit with TypeScript ^5.x (strict mode)
- Web Audio API (native) - No external pitch detection libraries required for MVP
- Dexie ^4.x for pitch history persistence (if needed)
- Vitest for unit tests

**Optional (for future enhancement):**
- @milcktoast/pitch-detector - Consider for better accuracy post-MVP

### Testing Requirements

- **Unit Tests**: Use Vitest (configured in vitest.config.ts)
- **Mocking**: Mock Web Audio API, navigator.mediaDevices
- **Coverage**: Test pitch detection, frequency-to-note conversion, cents accuracy
- **Integration**: Test with real microphone input (if possible in test env)

**Test Scenarios:**
1. Autocorrelation detects frequency within ±1 Hz for pure tones
2. Frequency-to-note converts correctly (±50 cents)
3. RMS threshold filters quiet signals
4. Microphone permission denial handled gracefully
5. Cleanup stops microphone stream properly

### Design System (Art Nouveau "Mystical Orient")

**Colors to use:**
- Primary: Deep purple (#2D1B4E), Rich gold (#D4AF37)
- Secondary: Teal (#1A5F5F), Burgundy (#722F37)
- Accent: Warm cream (#F5E6D3), Soft rose (#E8B4B8)
- Background: Dark (#1A1A2E) for immersive focus during exercises
- Success: Emerald green (#2ECC71)
- Error: Soft coral (#E74C3C)
- Warning: Gold (#D4AF37)

**Pitch Display Styling:**
- Note name: Large cream (#F5E6D3) text, serif font
- Cents deviation: Smaller text, green (+) / red (-)
- Visual indicator: Animated pitch meter (vertical bar)
- Target note: Gold border when matching

**Typography:**
- Display serif for headings (Playfair Display)
- Clean sans-serif for body text (Inter)

### Accessibility Requirements (MANDATORY)

- WCAG 2.1 Level A compliance
- Keyboard: Start/stop pitch detection with keyboard (Space or Enter)
- Screen reader: Announce detected pitch, pitch match/mismatch
- Visual: High contrast pitch indicator, color-blind friendly symbols
- Touch: 44x44px minimum touch targets
- Audio: Provide audio feedback for pitch match (optional)

---

## Dev Agent Record

### Agent Model Used

opencode/big-pickle

### Debug Log References

From story 2-4:
- audioStore is PRIMARY service for audio state management
- AudioContext singleton pattern from AudioEngine must be reused

From story 2-3:
- ExerciseSession store is PRIMARY source for exercise state
- AudioEngine handles all audio playback

From story 2-2:
- AudioEngine is PRIMARY service for exercise audio playback

### Completion Notes List

**Implementation Summary:**
- Created PitchDetector service with autocorrelation algorithm for real-time pitch detection
- Implemented frequency-to-note conversion with ±50 cents accuracy (A4 = 440Hz)
- Added microphone permission request flow with graceful error handling
- Created pitchStore for state management using Svelte 5 runes
- Created PitchDisplay and PitchVisualizer components for pitch visualization
- All 201 tests pass (16 new tests for PitchDetector, 7 for pitchStore)
- Code follows project architecture patterns (singleton AudioContext, Svelte 5 runes)

### File List

**New files:**
- src/lib/audio/PitchDetector.ts (pitch detection service)
- src/lib/audio/PitchDetector.test.ts (unit tests)
- src/lib/stores/pitch.svelte.ts (pitch state management)
- src/lib/stores/pitch.test.ts (store tests)
- src/lib/components/pitch/PitchDisplay.svelte (pitch display component)
- src/lib/components/pitch/PitchVisualizer.svelte (visual feedback component)
- src/lib/components/pitch/index.ts (barrel export)
- src/routes/practice/+page.svelte (pitch practice page)

**Modified files:**
- src/lib/audio/index.ts (added PitchDetector exports)
- src/lib/stores/index.ts (added pitchStore export)
- src/routes/+layout.svelte (added Practice nav link)
- src/routes/+page.svelte (updated Perfect Pitch section)

---

## Change Log

- 2026-03-16: Implemented Story 2-5 Real-time Pitch Detection
  - Added PitchDetector service with autocorrelation algorithm
  - Added frequency-to-note conversion (±50 cents accuracy)
  - Added microphone permission handling
  - Created pitch visualization components
  - Added comprehensive unit tests (23 new tests)
  - Status: ready-for-review

- 2026-03-16: Code Review Fixes Applied
  - Added pitch practice page at /practice (integrates PitchDisplay + PitchVisualizer)
  - Added Practice link to navigation bar
  - Added latency verification test (confirms <500ms requirement)
  - Added autocorrelation algorithm accuracy tests
  - Fixed CSS variable naming to match design system
  - Status: done (after review fixes)

---

## Senior Developer Review

### Review Date: 2026-03-16
### Reviewer: BMad Code Review Agent

**Initial Issues Found:**
- MEDIUM: Pitch components not integrated into any route/page (FIXED)
- MEDIUM: No explicit 500ms latency verification (FIXED - added test)
- MEDIUM: No test for autocorrelation algorithm accuracy (FIXED - added tests)
- LOW: CSS variable naming inconsistency (FIXED)

**Resolution:**
All issues fixed automatically. The code is now production-ready.

**Test Results:**
- 205 tests passing (up from 201)
- New tests verify latency requirement and algorithm accuracy

**Files Modified During Review:**
- Created: src/routes/practice/+page.svelte
- Modified: src/routes/+layout.svelte (nav link)
- Modified: src/lib/audio/PitchDetector.test.ts (added tests)
- Modified: src/lib/components/pitch/*.svelte (CSS fixes)
