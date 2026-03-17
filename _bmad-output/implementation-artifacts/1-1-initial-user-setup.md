# Story 1.1: Initial User Setup

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a new user,
I want to set my initial preferences when first using the app,
so that I can have a personalized experience from the start.

## Acceptance Criteria

1. **Given** the user opens the app for the first time
   **When** they set their difficulty level and accessibility preferences
   **Then** the preferences are saved to local storage
   **And** future sessions use these saved preferences

2. **Given** the user has set initial preferences
   **When** they return to the app
   **Then** they see the main journey map with their chosen settings applied

3. **Given** the user is on the initial setup screen
   **When** they select difficulty level (beginner, intermediate, advanced)
   **Then** the preference is saved
   **And** the setting persists across sessions

4. **Given** the user is on the initial setup screen
   **When** they configure accessibility options (high contrast, reduced motion)
   **Then** the UI adapts immediately
   **And** settings persist across sessions

5. **Given** the user completes initial setup
   **When** they tap "Start" or "Begin"
   **Then** they are navigated to the journey map
   **And** the app is ready for first exercise

## Tasks / Subtasks

- [x] Create initial setup screen UI component (AC: 1, 2)
  - [x] Create OnboardingPage.svelte component
  - [x] Add difficulty selection buttons (beginner, intermediate, advanced)
  - [x] Add accessibility toggle switches (high contrast, reduced motion)
  - [x] Add welcome message and app introduction
- [x] Implement preferences save/load logic (AC: 1, 2, 3, 4)
  - [x] Use existing Dexie preferences table from story 1.0
  - [x] Create new user with default preferences if not exists
  - [x] Load preferences on app start
  - [x] Save preferences on change
- [x] Create navigation to journey map (AC: 5)
  - [x] Add route handling for initial setup (/setup)
  - [x] Add route handling for main app (/ or /game)
  - [x] Implement conditional routing based on preferences existence
- [x] Add unit tests for preferences store (AC: 1, 2, 3, 4)
- [x] Add integration tests for setup flow (AC: 5)

## Dev Notes

### Architecture Requirements (from Story 1.0)
- **Database**: Use Dexie single instance at `src/lib/db/database.ts`
- **State Management**: Use Svelte 5 runes ($state, $derived, $effect) - NOT legacy $:
- **AudioContext**: Must use lazy initialization pattern (NOT module level)
- **Styling**: Tailwind CSS with Art Nouveau theme (colors from app.css)

### Technical Implementation Notes
- **Dexie Tables**: Use `db.preferences` table for storing user settings
- **Preferences Schema** (from story 1.0):
  ```typescript
  interface UserPreferences {
    id: string; // Primary key (use 'default' for single user)
    username: string;
    theme: 'light' | 'dark' | 'auto';
    audioVolume: number;
    musicEnabled: boolean;
    soundEffectsEnabled: boolean;
    highContrastMode: boolean;
    reducedMotion: boolean;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    createdAt: Date;
    updatedAt: Date;
  }
  ```
- **Routing**: Use SvelteKit file-based routing in `src/routes/`
- **Components**: Place in `src/lib/components/` following project structure

### Testing Requirements
- **Unit Tests**: Use Vitest (configured in vitest.config.ts)
- **Mocking**: Use mocks from tests/setup.ts
- **Coverage**: Follow testing standards from project-context.md

### File Structure to Create/Modify
- `src/routes/setup/+page.svelte` - Initial setup page
- `src/lib/stores/preferences.svelte.ts` - Enhance existing preferences store
- `src/lib/components/` - Add new UI components
- Tests alongside source files (*.test.ts)

### Previous Story Learnings (from 1.0)
- AudioContext singleton pattern is correctly implemented with lazy initialization
- Dexie single instance is working correctly
- Svelte 5 runes are properly used in stores
- Tests run successfully with Vitest (59 tests passing as of 2026-03-02)
- Build passes without TypeScript errors

### Accessibility Requirements
- WCAG 2.1 Level A compliance
- Keyboard navigation with visual focus indicators
- Screen reader support with complete ARIA implementation
- Minimum 4.5:1 color contrast ratios
- Minimum 44x44px touch targets

### Design System (Art Nouveau "Mystical Orient")
- Primary: Deep purple (#2D1B4E), Rich gold (#D4AF37)
- Secondary: Teal (#1A5F5F), Burgundy (#722F37)
- Accent: Warm cream (#F5E6D3), Soft rose (#E8B4B8)
- Dark background (#1A1A2E) for immersive focus

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic-1-User-Setup--Preferences]
- [Source: _bmad-output/planning-artifacts/architecture.md]
- [Source: _bmad-output/planning-artifacts/prd.md]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md]
- [Source: _bmad-output/implementation-artifacts/1-0-project-setup-from-starter-template.md]

## Dev Agent Record

### Agent Model Used

OpenCode (big-pickle model)

### Debug Log References

N/A

### Completion Notes List

- Created initial setup page at `src/routes/setup/+page.svelte` with multi-step form
- Created `InitialSetup.svelte` component that orchestrates the setup flow
- Created `DifficultySelector.svelte` with beginner/intermediate/advanced options
- Created `AccessibilitySettings.svelte` with high contrast and reduced motion toggles
- Enhanced `preferences.svelte.ts` to handle structuredClone for Svelte 5 proxies
- Updated `src/routes/+page.svelte` to check preferences and redirect to /setup for new users
- Updated `src/routes/+layout.svelte` to apply accessibility settings on app load
- Added unit tests for preferences store (13 tests, all passing)
- Added integration tests for setup flow (11 tests, all passing)
- Added accessibility support (ARIA attributes, keyboard navigation, 44px touch targets)
- All acceptance criteria satisfied:
  - AC1: Preferences saved to IndexedDB and persist across sessions
  - AC2: Returning users see journey map with saved preferences
  - AC3: Difficulty selection persists correctly
  - AC4: Accessibility settings apply immediately and persist
  - AC5: Navigation to journey map on "Start Learning" click

### File List

New files created:
- `src/routes/setup/+page.svelte` - Initial setup page with multi-step form
- `src/lib/components/InitialSetup.svelte` - Main setup form component
- `src/lib/components/DifficultySelector.svelte` - Difficulty level selector
- `src/lib/components/AccessibilitySettings.svelte` - Accessibility toggles
- `src/lib/stores/preferences.test.ts` - Unit tests for preferences store
- `src/lib/stores/preferences.integration.test.ts` - Integration tests for setup flow (added during review)

Files modified:
- `src/lib/stores/preferences.svelte.ts` - Added getSnapshot helper for Svelte 5 proxies
- `src/routes/+page.svelte` - Added preferences check and redirect logic
- `src/routes/+layout.svelte` - Added accessibility settings application
- `tests/setup.ts` - Fixed IndexedDB mocking for tests

## Change Log

- 2026-03-02: Implemented initial user setup flow with difficulty selection and accessibility options
