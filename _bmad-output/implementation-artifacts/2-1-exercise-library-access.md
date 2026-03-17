# Story 2.1: Exercise Library Access

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to browse and access the exercise library,
so that I can discover available ear training exercises.

## Acceptance Criteria

1. **Given** the user opens the app
   **When** they navigate to the exercise library
   **Then** they see a list of available exercises organized by type
   **And** each exercise shows its name, difficulty level, and chapter

2. **Given** the user is viewing the exercise library
   **When** they filter by exercise type (intervals, chords, melodies)
   **Then** only exercises matching the selected type are displayed
   **And** the filter persists during the session

## Tasks / Subtasks

- [x] Create exercise library page route (AC: 1, 2)
  - [x] Create library route at src/routes/library/+page.svelte
  - [x] Add navigation link from main layout to library
- [x] Build exercise list component (AC: 1)
  - [x] Create ExerciseList.svelte component
  - [x] Display exercise name, difficulty, and chapter
  - [x] Use existing levels from src/lib/game/levels.ts
- [x] Implement filtering by exercise type (AC: 2)
  - [x] Create ExerciseFilter.svelte component
  - [x] Filter types: intervals, chords, melodies
  - [x] Persist filter in local state during session
- [x] Integrate with existing game store (AC: 1, 2)
  - [x] Use existing game.svelte.ts store
  - [x] Display user progress per exercise
- [x] Add accessibility support (AC: 1, 2)
  - [x] ARIA labels for exercise cards
  - [x] Keyboard navigation for filters
  - [x] Screen reader announcements for filter changes

## Dev Notes

### Architecture Requirements (MANDATORY - DO NOT DEVIATE)

**Database Layer:**
- **MUST** use Dexie single instance from `src/lib/db/database.ts`
- **MUST** use existing `progress` table to show completion status
- **MUST** use existing `levels` from `src/lib/game/levels.ts`

**State Management:**
- **MUST** use Svelte 5 runes ($state, $derived, $effect) - NEVER legacy $:
- **MUST** extend or create library-specific store:
  ```typescript
  // Create src/lib/stores/library.svelte.ts
  export function createLibraryStore() {
    let selectedFilter = $state<'all' | 'intervals' | 'chords' | 'melodies'>('all');
    let exercises = $derived(filteredExercises(selectedFilter));
    
    return {
      get selectedFilter() { return selectedFilter; },
      setFilter: (filter) => { selectedFilter = filter; }
    };
  }
  ```

**Routing:**
- **MUST** use SvelteKit file-based routing
- Library route: `src/routes/library/+page.svelte`
- Navigation: Add link from main layout (next to Profile, Settings)

**Component Structure:**
```
src/lib/components/
├── library/
│   ├── ExerciseList.svelte      # Main exercise grid/list
│   ├── ExerciseCard.svelte      # Individual exercise display
│   ├── ExerciseFilter.svelte    # Filter buttons
│   └── ExerciseProgress.svelte  # Show user progress per exercise
```

### Technical Implementation Patterns

**Exercise Type Mapping:**
- From levels.ts `exerciseType` field:
  - `'interval-identification'` → 'intervals'
  - `'chord-identification'` → 'chords'
  - `'melody-identification'` → 'melodies'

**Data Flow:**
1. Library page loads → calls libraryStore.loadExercises()
2. exercises derived from levels + progress data
3. Filter selection updates derived exercises
4. Components render filtered list

**Level Data (already exists in src/lib/game/levels.ts):**
- Level IDs: '1-1', '1-2', '1-3', '1-4', '2-1', '2-2', '2-3', '3-1', '3-2'
- exerciseType: 'interval-identification', 'chord-identification', 'melody-identification'
- difficulty: 'beginner', 'intermediate', 'advanced'
- chapter: 1, 2, 3
- unlocked: boolean (depends on previous progress)

### File Structure to Create/Modify

**New files:**
- `src/routes/library/+page.svelte` - Library page
- `src/lib/components/library/ExerciseList.svelte` - Exercise grid
- `src/lib/components/library/ExerciseCard.svelte` - Exercise card
- `src/lib/components/library/ExerciseFilter.svelte` - Filter buttons
- `src/lib/components/library/ExerciseProgress.svelte` - Progress indicator
- `src/lib/stores/library.svelte.ts` - Library state store
- `src/lib/stores/library.test.ts` - Unit tests

**Files to modify:**
- `src/routes/+layout.svelte` - Add library navigation link
- `src/lib/types/game.ts` - Add ExerciseType to Level interface if needed

### Previous Story Learnings (CRITICAL - BUILD ON THESE)

From Epic 1 Stories:
- ✅ Dexie single instance pattern works correctly
- ✅ Svelte 5 runes properly used in stores
- ✅ Tailwind CSS with Art Nouveau theme configured
- ✅ Accessibility (ARIA, keyboard nav, 44px touch targets) implemented
- ✅ Tests run successfully with Vitest

**Patterns to REUSE:**
- Use same store pattern: `export function createXxxStore()` with $state
- Use same component structure: Props interface + $props() pattern
- Use same styling: Tailwind classes with custom theme colors
- Use same accessibility: ARIA labels, keyboard nav, 44px touch targets
- Use same testing: Vitest + component tests

**Files to reference:**
- `src/lib/stores/profile.svelte.ts` - Example of Svelte 5 runes store with $derived
- `src/lib/components/profile/ProfileHeader.svelte` - Example of component with $props()
- `src/lib/game/levels.ts` - Existing level definitions to use
- `src/routes/settings/+page.svelte` - Page structure example

### Accessibility Requirements (MANDATORY)

- WCAG 2.1 Level A compliance
- Keyboard navigation with visual focus indicators
- Screen reader support with complete ARIA implementation
- Minimum 4.5:1 color contrast ratios
- Minimum 44x44px touch targets
- Semantic HTML (header, main, section, article, nav)
- ARIA labels for all interactive elements
- Filter changes must be announced to screen readers (use aria-live region)
- Exercise cards must be navigable via keyboard (tab)

### Design System (Art Nouveau "Mystical Orient")

**Colors to use:**
- Primary: Deep purple (#2D1B4E), Rich gold (#D4AF37)
- Secondary: Teal (#1A5F5F), Burgundy (#722F37)
- Accent: Warm cream (#F5E6D3), Soft rose (#E8B4B8)
- Background: Dark (#1A1A2E) for immersive focus
- Success: Emerald green (#2ECC71)
- Error: Soft coral (#E74C3C)

**Typography:**
- Display serif for headings (Playfair Display)
- Clean sans-serif for body text (Inter)

**Component Styling:**
- Exercise cards: dark card with gold accent border
- Filter buttons: pill-shaped, gold when selected
- Progress indicators: teal fill on dark background

### Testing Requirements

- **Unit Tests**: Use Vitest (configured in vitest.config.ts)
- **Mocking**: Use mocks from tests/setup.ts
- **Coverage**: Test filter logic, exercise sorting, progress display

---

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

N/A - First story of Epic 2

### Completion Notes List

- Implemented exercise library page at /library route
- Created library.svelte.ts store using Svelte 5 runes for state management
- Created ExerciseFilter.svelte component with keyboard navigation and screen reader support
- Created ExerciseCard.svelte component displaying level info, difficulty, and progress
- Created ExerciseProgress.svelte component for progress visualization
- Created ExerciseList.svelte component with chapter grouping
- Added library navigation link to main layout (+layout.svelte)
- All tests pass (8 tests in library.test.ts)
- Build successful

### File List

**New files:**
- src/routes/library/+page.svelte - Library page route
- src/lib/stores/library.svelte.ts - Library state store using Svelte 5 runes
- src/lib/stores/library.test.ts - Unit tests for library store
- src/lib/components/library/ExerciseFilter.svelte - Filter buttons component
- src/lib/components/library/ExerciseCard.svelte - Exercise card component
- src/lib/components/library/ExerciseProgress.svelte - Progress indicator component
- src/lib/components/library/ExerciseList.svelte - Exercise list with chapter grouping

**Modified files:**
- src/routes/+layout.svelte - Added library navigation link

---

## Change Log

- 2026-03-15: Implemented complete exercise library feature with filtering, progress tracking, and accessibility support
- 2026-03-15: [Code Review] Fixed Svelte 5 $derived anti-pattern in ExerciseList.svelte and ExerciseCard.svelte (used $derived.by for complex logic)
- 2026-03-15: [Code Review] Implemented filter persistence via URL query params (AC2 requirement)
- 2026-03-15: [Code Review] Added error handling to loadProgress function
- 2026-03-15: [Code Review] Extracted COMPLETION_THRESHOLD constant to avoid magic numbers
