# Story 1.2: Profile Viewing

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to view my profile and statistics,
so that I can see my progress and achievements at a glance.

## Acceptance Criteria

1. **Given** the user has completed exercises
   **When** they navigate to their profile
   **Then** they see their total exercises completed, average score, and current streak

2. **Given** the user views their profile
   **When** they scroll to statistics
   **Then** they see weekly progress, chapter completion status, and badges earned

## Tasks / Subtasks

- [x] Create profile page route (AC: 1, 2)
  - [x] Create profile route at src/routes/profile/+page.svelte
  - [x] Add navigation link from main app to profile
- [x] Build profile header component (AC: 1)
  - [x] Create ProfileHeader.svelte component
  - [x] Display total exercises completed
  - [x] Display average score percentage
  - [x] Display current streak (days)
- [x] Build statistics section (AC: 2)
  - [x] Create StatsSection.svelte component
  - [x] Implement weekly progress calculation
  - [x] Display chapter completion status
  - [x] Display earned badges
- [x] Integrate with database (AC: 1, 2)
  - [x] Query progress table for exercise counts
  - [x] Query progress table for score averages (bestScore field)
  - [x] Query progress table for streak calculation
- [x] Add tests
  - [x] Unit tests for stats calculations
  - [x] Component tests for profile display

## Dev Notes

### Architecture Requirements (MANDATORY - DO NOT DEVIATE)

**Database Layer:**
- **MUST** use Dexie single instance from `src/lib/db/database.ts`
- **MUST** use the existing `preferences` table (created in story 1.1)
- **MUST** use `progress` table for tracking completed exercises (already exists):
  ```typescript
  interface GameProgress {
    id?: number;
    levelId: string;
    completed: boolean;
    bestScore: number;
    attempts: number;
    completedAt?: Date;
    updatedAt: Date;
  }
  ```
- **NOTE:** The `sessions` table exists but is not used for profile stats - using progress table with bestScore instead

**State Management:**
- **MUST** use Svelte 5 runes ($state, $derived, $effect) - NEVER legacy $:
- **MUST** create profile store at `src/lib/stores/profile.svelte.ts`:
  ```typescript
  export function createProfileStore() {
    let totalExercises = $state(0);
    let averageScore = $state(0);
    let currentStreak = $state(0);
    let weeklyProgress = $state<DayProgress[]>([]);
    let chapterProgress = $state<ChapterProgress[]>([]);
    let badges = $state<Badge[]>([]);
    
    return {
      get totalExercises() { return totalExercises; },
      // ... other getters
      loadStats: async () => { /* load from Dexie */ }
    };
  }
  ```

**Routing:**
- **MUST** use SvelteKit file-based routing
- Profile route: `src/routes/profile/+page.svelte`
- Navigation: Add link from main layout or journey map

### Technical Implementation Patterns

**Component Structure:**
```
src/lib/components/
├── profile/
│   ├── ProfileHeader.svelte      # User stats summary
│   ├── StatsSection.svelte        # Detailed statistics
│   ├── StreakDisplay.svelte       # Current streak indicator
│   ├── ChapterProgress.svelte     # Chapter completion
│   └── BadgeDisplay.svelte        # Earned badges
```

**Data Flow:**
1. Profile page loads → calls profileStore.loadStats()
2. loadStats() queries Dexie tables (progress, sessions)
3. Calculates aggregates: total exercises, average score, streak
4. Returns data to components via getters

**Key Calculations:**
- **Total Exercises**: COUNT of progress records WHERE userId matches
- **Average Score**: AVG of score field from progress table
- **Current Streak**: COUNT of consecutive days with at least 1 exercise completed
- **Weekly Progress**: Array of 7 days with exercise count per day
- **Chapter Progress**: COUNT of completed levels per chapter

### File Structure to Create/Modify

**New files:**
- `src/routes/profile/+page.svelte` - Profile page
- `src/lib/components/profile/ProfileHeader.svelte` - Stats summary
- `src/lib/components/profile/StatsSection.svelte` - Detailed stats
- `src/lib/components/profile/StreakDisplay.svelte` - Streak component
- `src/lib/components/profile/ChapterProgress.svelte` - Chapter completion
- `src/lib/components/profile/BadgeDisplay.svelte` - Badges
- `src/lib/stores/profile.svelte.ts` - Profile state store
- `src/lib/stores/profile.test.ts` - Unit tests

**Files to modify:**
- `src/lib/db/database.ts` - Add progress/sessions tables if needed
- `src/routes/+layout.svelte` - Add profile navigation link
- Tests and components as needed

### Previous Story Learnings (CRITICAL - BUILD ON THESE)

From story 1.1 (Initial User Setup):
- ✅ Dexie single instance pattern works correctly
- ✅ Svelte 5 runes properly used in stores
- ✅ Tailwind CSS with Art Nouveau theme configured
- ✅ Accessibility (ARIA, keyboard nav, 44px touch targets) implemented
- ✅ Tests run successfully with Vitest

**Patterns to REUSE:**
- Use same store pattern: `export function createProfileStore()` with $state
- Use same component structure: Props interface + $props() pattern
- Use same styling: Tailwind classes with custom theme colors
- Use same testing: Vitest + component tests

**Files to reference:**
- `src/lib/stores/preferences.svelte.ts` - Example of Svelte 5 runes store
- `src/lib/components/InitialSetup.svelte` - Example of component with $props()
- `src/lib/db/database.ts` - Dexie schema structure

### Accessibility Requirements (MANDATORY)

- WCAG 2.1 Level A compliance
- Keyboard navigation with visual focus indicators
- Screen reader support with complete ARIA implementation
- Minimum 4.5:1 color contrast ratios
- Minimum 44x44px touch targets
- Semantic HTML (header, main, section, article)
- ARIA labels for all interactive elements
- Profile data must be announced to screen readers

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

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic-1-Story-1.2-Profile-Viewing]
- [Source: _bmad-output/planning-artifacts/architecture.md]
- [Source: _bmad-output/planning-artifacts/prd.md]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md]
- [Source: _bmad-output/implementation-artifacts/1-1-initial-user-setup.md]
- [Source: _bmad-output/project-context.md]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

- Implemented profile store using Svelte 5 runes pattern consistent with preferences store
- Used Dexie database with existing progress and sessions tables
- Created modular profile components following component pattern from project-context.md
- Implemented streak calculation based on consecutive days with completed exercises
- Weekly progress shows last 7 days of activity
- Chapter progress derived from level IDs using prefix-based chapter mapping
- Badges awarded for: first exercise, perfect score, streaks, chapter completion

### Completion Notes List

- ✅ Created profile page at /profile route
- ✅ ProfileHeader displays total exercises, average score, and streak
- ✅ StatsSection shows weekly progress chart, chapter progress, and earned badges
- ✅ Navigation added to layout with profile link
- ✅ Database integration using existing tables (progress, sessions)
- ✅ Unit tests added for profile store calculations (13 tests, all passing)
- ✅ All 83 tests pass including regressions
- ✅ Build succeeds
- ✅ Type checking passes with no errors
- ✅ Accessibility: semantic HTML, ARIA labels, 44px touch targets

### File List

New files created:
- src/routes/profile/+page.svelte
- src/lib/components/profile/ProfileHeader.svelte
- src/lib/components/profile/StatsSection.svelte
- src/lib/components/profile/StreakDisplay.svelte
- src/lib/components/profile/ChapterProgress.svelte
- src/lib/components/profile/BadgeDisplay.svelte
- src/lib/stores/profile.svelte.ts
- src/lib/stores/profile.test.ts

Files modified:
- src/routes/+layout.svelte (added navigation)

## Change Log

### 2026-03-04 - Story Implementation Complete
- Created profile page route at /profile
- Implemented profile store with Svelte 5 runes
- Created profile components (ProfileHeader, StatsSection, StreakDisplay, ChapterProgress, BadgeDisplay)
- Added database integration for statistics
- Added unit tests for profile calculations (13 tests)
- All tests pass (83 total)
- Build succeeds
- Added navigation link to profile in layout

### 2026-03-04 - Code Review Fixes Applied
- Fixed critical bug: changed `.equals(1)` to `.filter(p => p.completed === true)` for boolean query
- Consolidated duplicate chapter name mappings into single constant
- Added comment explaining magic number 365 (max streak days)
- Added TODO for future multi-user support
- Updated story documentation to reflect actual implementation
