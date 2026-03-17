# Story 2.6: Microphone Permission Handling

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want the app to clearly request and handle microphone permissions,
so that I can use pitch detection features.

## Acceptance Criteria

1. **Given** the user accesses a feature requiring microphone
   **When** they have not yet granted permission
   **Then** a clear permission request dialog appears

2. **Given** the user denies microphone permission
   **When** they try to use pitch detection
   **Then** a helpful message explains how to enable it in browser settings

3. **Given** the browser suspends the audio context
   **When** the user interacts with the app
   **Then** the audio context is automatically resumed
   **And** the user can continue without errors

## Tasks / Subtasks

- [x] Task 1 (AC: #1) - Implement permission request dialog with clear UX
  - [x] Subtask 1.1 - Create MicrophonePermission service for permission handling
  - [x] Subtask 1.2 - Build permission request modal component with clear messaging
  - [x] Subtask 1.3 - Handle permission granted state transitions
- [x] Task 2 (AC: #2) - Handle permission denial with helpful guidance
  - [x] Subtask 2.1 - Create permission denied fallback UI
  - [x] Subtask 2.2 - Add browser settings guidance for enabling microphone
  - [x] Subtask 2.3 - Add re-request permission option
- [x] Task 3 (AC: #3) - Handle suspended audio context automatically
  - [x] Subtask 3.1 - Implement AudioContext state monitoring
  - [x] Subtask 3.2 - Create automatic resume on user interaction
  - [x] Subtask 3.3 - Add notification to user when context resumes

---

## Dev Notes

### Architecture Requirements (MANDATORY - DO NOT DEVIATE)

**MicrophonePermission Service Architecture:**
- **MUST** create new file: `src/lib/audio/MicrophonePermission.ts`
- **MUST** use Svelte 5 runes for all state management
- **MUST** use navigator.mediaDevices.getUserMedia() for permission requests
- **MUST** handle all permission states: granted, denied, prompt
- **MUST** use Permissions API (where supported) for checking current state

**CRITICAL: Permission Handling Pattern:**
```typescript
// ✅ CORRECT - Permission request with proper error handling
import { getAudioContext } from './AudioEngine';

export type PermissionState = 'granted' | 'denied' | 'prompt' | 'checking';

let permissionState = $state<PermissionState>('prompt');

export async function checkMicrophonePermission(): Promise<PermissionState> {
  try {
    // Use Permissions API if available (Chrome, Edge, Opera)
    if (navigator.permissions) {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      permissionState = result.state;
      
      // Listen for permission changes
      result.addEventListener('change', () => {
        permissionState = result.state;
      });
      
      return result.state;
    }
    
    // Fallback: try to get stream to check permission
    // This will prompt if permission is 'prompt'
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop()); // Release immediately
    permissionState = 'granted';
    return 'granted';
  } catch (error) {
    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        permissionState = 'denied';
        return 'denied';
      }
    }
    permissionState = 'denied';
    return 'denied';
  }
}

export async function requestMicrophonePermission(): Promise<boolean> {
  permissionState = 'checking';
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Keep stream for later use by PitchDetector
    stream.getTracks().forEach(track => track.stop()); // Release - will request again when needed
    permissionState = 'granted';
    return true;
  } catch (error) {
    if (error instanceof DOMException) {
      switch (error.name) {
        case 'NotAllowedError':
        case 'PermissionDeniedError':
          permissionState = 'denied';
          break;
        case 'NotFoundError':
          // No microphone found
          permissionState = 'denied';
          break;
        case 'OverconstrainedError':
          // Requested constraints can't be met
          permissionState = 'denied';
          break;
        default:
          permissionState = 'denied';
      }
    }
    return false;
  }
}
```

**AudioContext Suspended State Handling:**
```typescript
// ✅ CORRECT - Handle suspended audio context
import { getAudioContext } from './AudioEngine';

let isAudioContextSuspended = $state(false);

export function setupAudioContextStateMonitoring(): void {
  const audioContext = getAudioContext();
  
  // Check initial state
  isAudioContextSuspended = audioContext.state === 'suspended';
  
  // Listen for state changes
  audioContext.onstatechange = () => {
    isAudioContextSuspended = audioContext.state === 'suspended';
  };
}

export async function resumeAudioContextIfNeeded(): Promise<boolean> {
  const audioContext = getAudioContext();
  
  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
      isAudioContextSuspended = false;
      return true;
    } catch (error) {
      console.error('Failed to resume AudioContext:', error);
      return false;
    }
  }
  
  return true;
}

// Auto-resume on user interaction
export function setupAutoResumeOnInteraction(): void {
  const events = ['click', 'keydown', 'touchstart'];
  
  const resumeHandler = async () => {
    await resumeAudioContextIfNeeded();
  };
  
  // Use once option to avoid memory leaks
  events.forEach(event => {
    document.addEventListener(event, resumeHandler, { once: true });
  });
}
```

**Project Structure:**
```
src/lib/audio/
├── AudioEngine.ts           # EXISTING - Do not modify
├── SampleLibrary.ts         # EXISTING - Do not modify
├── PitchDetector.ts         # EXISTING - From story 2-5
├── MicrophonePermission.ts  # NEW - Permission handling service
└── index.ts                 # UPDATE - Export MicrophonePermission

src/lib/stores/
├── audio.svelte.ts          # EXISTING - Add permission state
├── pitch.svelte.ts          # EXISTING - From story 2-5
└── index.ts                 # UPDATE - Export new store

src/lib/components/
├── permission/
│   ├── PermissionModal.svelte      # NEW - Permission request dialog
│   ├── PermissionDenied.svelte     # NEW - Denial fallback UI
│   └── index.ts                    # NEW
└── pitch/
    ├── PitchDisplay.svelte         # EXISTING - From story 2-5
    ├── PitchVisualizer.svelte      # EXISTING - From story 2-5
    └── index.ts                    # EXISTING
```

### Technical Implementation Patterns

**Permission Modal UX Pattern:**
```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';
  
  interface Props {
    isOpen: boolean;
    onRequestPermission: () => Promise<void>;
    onClose: () => void;
    children: Snippet;
  }
  
  let { isOpen, onRequestPermission, onClose, children }: Props = $props();
  let isLoading = $state(false);
  
  async function handleRequest() {
    isLoading = true;
    await onRequestPermission();
    isLoading = false;
  }
</script>

{#if isOpen}
  <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="permission-title">
    <div class="modal-content">
      <h2 id="permission-title">Microphone Access Needed</h2>
      <p>To detect your singing pitch, we need access to your microphone.</p>
      
      <div class="button-group">
        <button 
          onclick={handleRequest} 
          disabled={isLoading}
          class="btn-primary"
        >
          {isLoading ? 'Requesting...' : 'Allow Microphone'}
        </button>
        <button onclick={onClose} class="btn-secondary">
          Not Now
        </button>
      </div>
    </div>
  </div>
{/if}
```

**Permission Denied Fallback UX Pattern:**
```svelte
<script lang="ts">
  interface Props {
    onRequestAgain: () => void;
  }
  
  let { onRequestAgain }: Props = $props();
</script>

<div class="permission-denied" role="alert">
  <h2>Microphone Access Denied</h2>
  
  <p>To use pitch detection, please enable microphone access in your browser settings.</p>
  
  <div class="instructions">
    <h3>How to enable:</h3>
    <ul>
      <li><strong>Chrome:</strong> Click the lock/camera icon in address bar → Permissions → Microphone → Allow</li>
      <li><strong>Firefox:</strong> Click the shield icon → Permissions → Microphone → Allow</li>
      <li><strong>Safari:</strong> Safari → Settings → Privacy → Microphone → Enable for this site</li>
    </ul>
  </div>
  
  <button onclick={onRequestAgain} class="btn-primary">
    Try Again
  </button>
</div>
```

### Previous Story Learnings (CRITICAL - BUILD ON THESE)

From Story 2-5 Real-time Pitch Detection:
- ✅ PitchDetector service uses AudioContext singleton pattern
- ✅ PitchDetector implements getUserMedia for microphone access
- ✅ audioStore is PRIMARY service for audio state management
- ✅ Svelte 5 runes ($state, $derived, $effect) for all state
- ✅ Component Props interface + $props() pattern
- ✅ Accessibility: ARIA labels, keyboard nav, 44px touch targets
- ✅ Art Nouveau theme colors for all UI

**CRITICAL FIX from previous stories:**
- AudioContext singleton MUST be used - never create new instances
- AudioContext readiness MUST be verified before any operation
- Svelte 5 runes MUST be used (NOT legacy $: syntax)
- Permission requests MUST happen at point of use (not preemptively)

**Patterns to REUSE from previous stories:**
- Same store pattern: `export function createXxxStore()` with $state, $derived
- Same component structure: Props interface + $props() pattern  
- Same styling: Tailwind classes with Art Nouveau theme colors
- Same accessibility: ARIA labels, keyboard nav, 44px touch targets
- Same testing: Vitest + mocks from tests/setup.ts

**Files to reference:**
- `src/lib/audio/PitchDetector.ts` - Understand existing microphone usage
- `src/lib/audio/AudioEngine.ts` - Use same singleton pattern
- `src/lib/stores/audio.svelte.ts` - Add permission state to existing audioStore
- `src/lib/components/pitch/` - Reference for component patterns

### Git Intelligence (From Recent Commits)

Recent commits show:
- Story 2-5 completed: Real-time pitch detection with microphone integration
- Story 2-4 completed: Exercise pause and resume functionality
- Story 2-3 completed: Exercise launch and completion system  
- Story 2-2 completed: Audio playback system
- All stories following BMad methodology with Svelte 5 runes
- Consistent code patterns: singleton AudioContext, Dexie single instance

### Web Intelligence (Latest Best Practices 2026)

**Microphone Permission Best Practices:**

1. **Permissions API (Modern Browsers)**
   - Use `navigator.permissions.query({ name: 'microphone' })` to check state
   - Works in Chrome, Edge, Opera (not Safari/Firefox fully)
   - Returns: 'granted', 'denied', or 'prompt'
   - Listen for 'change' event for state updates

2. **getUserMedia Error Handling**
   - NotAllowedError: User denied permission
   - NotFoundError: No microphone found
   - OverconstrainedError: Requested constraints can't be met
   - AbortError: User cancelled (rare)

3. **One-Time Permissions (Modern Behavior)**
   - Modern browsers treat all permissions as one-time
   - Cannot "prime" permissions by checking early
   - Must request at point of user interaction
   - User can reset from URL bar in Chrome M116+

4. **Audio Context Suspended State**
   - AudioContext starts in 'suspended' state (browser autoplay policy)
   - Must resume() on user gesture
   - State can change to 'suspended' after tab becomes visible again
   - Monitor 'onstatechange' for automatic handling

5. **Device Enumeration**
   - Call enumerateDevices() AFTER successful getUserMedia (privacy requirement)
   - Cache device list in localStorage for persistence
   - Allow user to select preferred device

6. **UX Best Practices**
   - Request at point of use, not preemptively
   - Explain WHY microphone is needed
   - Provide clear error messages with recovery steps
   - Offer alternative (non-microphone) features when possible

**Browser-Specific Notes:**
- Chrome: URL bar indicator for active mic, permissions can be reset
- Firefox: Different permission persistence than Chrome
- Safari: Least persistent, OS-level permissions prominent, may need restart

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
- DO NOT request microphone permission preemptively (must be on user gesture)
- DO NOT use localStorage for structured data (use IndexedDB)
- DO NOT put audio logic in components (use audioStore)
- DO NOT use `any` type - use `unknown` with type guards

### Library/Framework Requirements

**Required:**
- SvelteKit with TypeScript ^5.x (strict mode)
- Web Audio API (native) - No external libraries required
- Vitest for unit tests

**No additional libraries needed** - All functionality provided by native browser APIs.

### Testing Requirements

- **Unit Tests**: Use Vitest (configured in vitest.config.ts)
- **Mocking**: Mock navigator.mediaDevices, navigator.permissions
- **Coverage**: Test permission states, error handling, context resume

**Test Scenarios:**
1. Permission granted flow works correctly
2. Permission denied shows fallback UI
3. Browser settings guidance is displayed
4. AudioContext resumes automatically on interaction
5. Permission state persists correctly across component lifecycle

### Design System (Art Nouveau "Mystical Orient")

**Colors to use:**
- Primary: Deep purple (#2D1B4E), Rich gold (#D4AF37)
- Secondary: Teal (#1A5F5F), Burgundy (#722F37)
- Accent: Warm cream (#F5E6D3), Soft rose (#E8B4B8)
- Background: Dark (#1A1A2E) for immersive focus during exercises
- Success: Emerald green (#2ECC71)
- Error: Soft coral (#E74C3C)
- Warning: Gold (#D4AF37)

**Permission Modal Styling:**
- Modal overlay: Semi-transparent dark (#1A1A2E with 80% opacity)
- Modal content: Deep purple (#2D1B4E) background
- Title: Rich gold (#D4AF37), serif font
- Body text: Warm cream (#F5E6D3)
- Primary button: Gold (#D4AF37) with purple text
- Secondary button: Transparent with gold border

**Typography:**
- Display serif for headings (Playfair Display)
- Clean sans-serif for body text (Inter)

### Accessibility Requirements (MANDATORY)

- WCAG 2.1 Level A compliance
- Keyboard: All permission dialogs keyboard accessible (Tab, Enter, Escape)
- Screen reader: Announce permission request, denial state, recovery steps
- Visual: High contrast on modal, clear iconography
- Touch: 44x44px minimum touch targets for all buttons
- Focus: Trap focus in modal when open, return focus on close

---

## Dev Agent Record

### Agent Model Used

opencode/big-pickle

### Debug Log References

From story 2-5:
- pitchStore manages pitch detection state using Svelte 5 runes
- AudioContext singleton pattern from AudioEngine must be reused
- getUserMedia called from PitchDetector for microphone access

From story 2-4:
- audioStore is PRIMARY service for audio state management
- ExerciseSession store pattern for state management

From story 2-3:
- ExerciseEngine handles scoring and completion
- AudioEngine service architecture complete

### Completion Notes List

**Implementation Summary:**
- Created MicrophonePermission service with Permissions API integration
- Implemented permission request modal with clear UX messaging
- Created permission denied fallback with browser settings guidance
- Added AudioContext state monitoring for suspended state handling
- Integrated with existing audioStore for permission state
- All tests pass
- Code follows project architecture patterns (singleton AudioContext, Svelte 5 runes)

### File List

**New files:**
- src/lib/audio/MicrophonePermission.ts (permission handling service)
- src/lib/audio/MicrophonePermission.test.ts (unit tests)
- src/lib/stores/permission.svelte.ts (permission state management)
- src/lib/components/permission/PermissionModal.svelte (permission request modal)
- src/lib/components/permission/PermissionDenied.svelte (denial fallback UI)
- src/lib/components/permission/AudioContextNotification.svelte (context resume notification)
- src/lib/components/permission/index.ts (barrel export)

**Modified files:**
- src/lib/audio/index.ts (added MicrophonePermission exports)
- src/lib/stores/index.ts (added permissionStore export)
