# Story 1.3: Preference Modification

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to modify my personal preferences anytime,
so that I can adjust the app to suit my changing needs.

## Acceptance Criteria

1. **Given** the user is in the settings page
   **When** they change accessibility settings (high contrast, text size)
   **Then** the changes apply immediately across the app

2. **Given** the user changes their difficulty level
   **When** they confirm the change
   **Then** subsequent exercises reflect the new difficulty

## Tasks / Subtasks

- [x] Create settings page route (AC: 1, 2)
  - [x] Create settings route at src/routes/settings/+page.svelte
  - [x] Add navigation link from main layout to settings
- [x] Build accessibility settings section (AC: 1)
  - [x] Create AccessibilitySection.svelte component
  - [x] Implement high contrast mode toggle
  - [x] Implement text size adjustment (small, medium, large)
  - [x] Implement reduced motion toggle
- [x] Build difficulty settings section (AC: 2)
  - [x] Create DifficultySection.svelte component
  - [x] Implement difficulty level selector (beginner, intermediate, advanced)
  - [x] Add confirmation dialog for difficulty changes
  - [x] Ensure difficulty affects exercise selection
- [x] Integrate with preferences store (AC: 1, 2)
  - [x] Use existing preferences table from story 1.1
  - [x] Ensure real-time updates across the app
- [x] Add tests
  - [x] Unit tests for preferences store updates
  - [x] Component tests for settings display

## Dev Notes

### Architecture Requirements (MANDATORY - DO NOT DEVIATE)

**Database Layer:**
- **MUST** use Dexie single instance from `src/lib/db/database.ts`
- **MUST** use the existing `preferences` table (created in story 1.1):
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
    textSize: 'small' | 'medium' | 'large';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    createdAt: Date;
    updatedAt: Date;
  }
  ```
- **NOTE:** The preferences table already exists - add textSize field if needed via migration

**State Management:**
- **MUST** use Svelte 5 runes ($state, $derived, $effect) - NEVER legacy $:
- **MUST** use existing preferences store at `src/lib/stores/preferences.svelte.ts`:
  ```typescript
  // Extend existing store with new methods
  export function createPreferencesStore() {
    // Existing state
    let preferences = $state<UserPreferences | null>(null);
    let loaded = $state(false);
    
    // NEW: Add updatePreference method
    const updatePreference = async <K extends keyof UserPreferences>(
      key: K, 
      value: UserPreferences[K]
    ) => {
      if (!preferences) return;
      preferences[key] = value;
      await db.preferences.update(preferences.id!, { [key]: value, updatedAt: new Date() });
    };
    
    // NEW: Add difficulty change with confirmation
    const setDifficulty = async (difficulty: UserPreferences['difficulty']) => {
      await updatePreference('difficulty', difficulty);
    };
    
    return { /* existing exports */, updatePreference, setDifficulty };
  }
  ```

**Routing:**
- **MUST** use SvelteKit file-based routing
- Settings route: `src/routes/settings/+page.svelte`
- Navigation: Add gear icon/link from main layout or profile page

### Technical Implementation Patterns

**Component Structure:**
```
src/lib/components/
├── settings/
│   ├── SettingsPage.svelte         # Main settings container
│   ├── AccessibilitySection.svelte # Accessibility controls
│   ├── DifficultySection.svelte   # Difficulty selector
│   └── ConfirmationDialog.svelte   # Reusable confirmation modal
```

**Data Flow:**
1. Settings page loads → calls preferencesStore.load()
2. User changes setting → calls preferencesStore.updatePreference()
3. updatePreference() updates Dexie and local $state
4. Components using preferences via $derived auto-update via Svelte reactivity

**Key Implementation Details:**
- **Immediate UI updates**: Use $derived for computed values based on preferences
- **Difficulty change**: Show confirmation dialog before saving (warns about exercise impact)
- **Text size**: Apply as CSS variable or class on root element
- **High contrast**: Toggle CSS class on document body

### File Structure to Create/Modify

**New files:**
- `src/routes/settings/+page.svelte` - Settings page
- `src/lib/components/settings/SettingsPage.svelte` - Settings container
- `src/lib/components/settings/AccessibilitySection.svelte` - Accessibility controls
- `src/lib/components/settings/DifficultySection.svelte` - Difficulty selector
- `src/lib/components/settings/ConfirmationDialog.svelte` - Modal dialog
- `src/lib/stores/preferences.svelte.ts` - Add update methods (MODIFY existing)
- `src/lib/stores/preferences.test.ts` - Update tests

**Files to modify:**
- `src/lib/stores/preferences.svelte.ts` - Add updatePreference, setDifficulty methods
- `src/app.css` - Add text-size-* classes and high-contrast mode styles
- `src/routes/+layout.svelte` - Apply preference-based classes to root
- `src/routes/+layout.ts` - Load preferences on app start

### Previous Story Learnings (CRITICAL - BUILD ON THESE)

From story 1.2 (Profile Viewing):
- ✅ Dexie single instance pattern works correctly
- ✅ Svelte 5 runes properly used in stores
- ✅ Tailwind CSS with Art Nouveau theme configured
- ✅ Accessibility (ARIA, keyboard nav, 44px touch targets) implemented
- ✅ Tests run successfully with Vitest

From story 1.1 (Initial User Setup):
- ✅ Preferences table exists with core fields
- ✅ Initial setup flow saves preferences correctly
- ✅ Store pattern: `export function createPreferencesStore()` with $state
- ✅ Component pattern: Props interface + $props() in Svelte 5

**Patterns to REUSE:**
- Use same store pattern: `export function createPreferencesStore()` with $state
- Use same component structure: Props interface + $props() pattern
- Use same styling: Tailwind classes with custom theme colors
- Use same testing: Vitest + component tests

**Files to reference:**
- `src/lib/stores/preferences.svelte.ts` - Example of Svelte 5 runes store
- `src/lib/components/profile/ProfileHeader.svelte` - Example of component with $props()
- `src/lib/db/database.ts` - Dexie schema structure
- `src/routes/profile/+page.svelte` - Page structure example

### Accessibility Requirements (MANDATORY)

- WCAG 2.1 Level A compliance
- Keyboard navigation with visual focus indicators
- Screen reader support with complete ARIA implementation
- Minimum 4.5:1 color contrast ratios
- Minimum 44x44px touch targets
- Semantic HTML (header, main, section, article, label, select)
- ARIA labels for all interactive elements
- Settings changes must be announced to screen readers (use aria-live region)
- High contrast mode must meet WCAG AAA (7:1 contrast ratio)

### Design System (Art Nouveau "Mystical Orient")

**Colors to use:**
- Primary: Deep purple (#2D1B4E), Rich gold (#D4AF37)
- Secondary: Teal (#1A5F5F), Burgundy (#722F37)
- Accent: Warm cream (#F5E6D3), Soft rose (#E8B4B8)
- Background: Dark (#1A1A2E) for immersive focus
- Success: Emerald green (#2ECC71)
- Error: Soft coral (#E74C3C)

**High Contrast Mode Colors:**
- Background: Pure black (#000000)
- Text: Pure white (#FFFFFF)
- Accent: Bright yellow (#FFFF00)
- Focus indicator: Cyan outline (#00FFFF)

**Typography:**
- Display serif for headings (Playfair Display)
- Clean sans-serif for body text (Inter)
- Text sizes: small (0.875rem), medium (1rem), large (1.25rem)

**Text Size Implementation:**
```css
/* In app.css */
:root {
  --text-base: 1rem;
}

.text-size-small {
  --text-base: 0.875rem;
}

.text-size-large {
  --text-base: 1.25rem;
}

/* Apply via font-size: var(--text-base) */
```

### Difficulty Level Behavior

**Beginner:**
- Simple intervals (unison, octave, perfect fifth)
- Major/minor chords
- Slower pace
- More forgiving scoring

**Intermediate:**
- All intervals
- All basic chords
- Standard pace
- Normal scoring

**Advanced:**
- Complex intervals (tritone, minor sixth)
- Seventh chords
- Faster pace
- Strict scoring

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic-1-Story-1.3-Preference-Modification]
- [Source: _bmad-output/planning-artifacts/architecture.md]
- [Source: _bmad-output/planning-artifacts/prd.md]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md]
- [Source: _bmad-output/implementation-artifacts/1-1-initial-user-setup.md]
- [Source: _bmad-output/implementation-artifacts/1-2-profile-viewing.md]
- [Source: _bmad-output/project-context.md]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

- Implementation followed red-green-refactor cycle
- Added textSize field to UserPreferences interface with database migration
- Created SettingsPage with AccessibilitySection and DifficultySection components
- ConfirmationDialog component for difficulty changes
- Added navigation link in layout

### Completion Notes List

- Implemented complete settings page with accessibility controls
- High contrast mode toggles CSS class on document (WCAG AAA compliant)
- Text size changes applied via CSS variables on :root
- Reduced motion disables all CSS animations
- Difficulty selector shows confirmation dialog for changes
- Real-time updates across app via Svelte 5 runes reactivity
- All 85 tests passing

### File List

**New files:**
- src/routes/settings/+page.svelte - Settings page route
- src/lib/components/settings/SettingsPage.svelte - Main settings container
- src/lib/components/settings/AccessibilitySection.svelte - Accessibility controls
- src/lib/components/settings/DifficultySection.svelte - Difficulty selector
- src/lib/components/settings/ConfirmationDialog.svelte - Modal confirmation dialog

**Modified files:**
- src/lib/db/database.ts - Added textSize field and migration
- src/lib/stores/preferences.svelte.ts - Added setTextSize, setHighContrastMotion methods
-Mode, setReduced src/app.css - Added text-size-* classes and high contrast mode styles
- src/routes/+layout.svelte - Added settings navigation link, text-size class application, and preference loading in onMount
- src/lib/stores/preferences.test.ts - Added tests for setTextSize
- src/lib/game/levels.ts - Added getLevelsByDifficulty() and getUserDifficulty() for exercise filtering

## Change Log

- 2026-03-04: Initial implementation - Settings page with accessibility and difficulty sections
- 2026-03-05: Code review fixes
  - Added setHighContrastMode() and setReducedMotion() methods to preferences store
  - Updated AccessibilitySection to use new store methods
  - Added getLevelsByDifficulty() and getUserDifficulty() to levels.ts for exercise filtering
  - Updated story File List to reflect actual implementation (preference loading in +layout.svelte, not +layout.ts)
