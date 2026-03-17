# Story 1.4: Account Deletion

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to delete my account and all associated data,
so that I can remove my personal information from the app.

## Acceptance Criteria

1. **Given** the user is in settings
   **When** they navigate to account deletion
   **Then** they see a confirmation dialog explaining what will be deleted

2. **Given** the user confirms deletion
   **When** the deletion process completes
   **Then** all local data (progress, preferences, scores) is cleared
   **And** the user is returned to the initial setup screen

## Tasks / Subtasks

- [x] Add account deletion section to settings page (AC: 1, 2)
  - [x] Create AccountDeletionSection.svelte component
  - [x] Add account deletion link/nav item in settings
- [x] Implement data deletion logic (AC: 2)
  - [x] Add deleteAccount method to preferences store
  - [x] Clear progress table
  - [x] Clear sessions table
  - [x] Clear preferences table
  - [x] Reset IndexedDB database
- [x] Add confirmation workflow (AC: 1)
  - [x] Use existing ConfirmationDialog component from story 1.3
  - [x] Show warning message about data loss
  - [x] Require explicit confirmation
- [x] Handle post-deletion redirect (AC: 2)
  - [x] Redirect to /setup after successful deletion
  - [x] Clear any client-side state
- [x] Add tests
  - [x] Unit tests for deleteAccount method
  - [x] Integration tests for deletion flow (verified via store tests)

## Dev Notes

### Architecture Requirements (MANDATORY - DO NOT DEVIATE)

**Database Layer:**
- **MUST** use Dexie single instance from `src/lib/db/database.ts`
- **MUST** clear all three tables on deletion:
  ```typescript
  // Database has these tables:
  - progress: GameProgress[] (level progress, scores)
  - preferences: UserPreferences[] (user settings)
  - sessions: GameSession[] (exercise history)
  ```
- **MUST** also reset/clear IndexedDB database entirely:
  ```typescript
  // Delete entire database after clearing tables
  await db.delete();
  db = new MeloraDB(); // Recreate fresh instance
  ```

**State Management:**
- **MUST** use Svelte 5 runes ($state, $derived, $effect) - NEVER legacy $:
- **MUST** update preferences store with deleteAccount method:
  ```typescript
  // Add to preferences.svelte.ts
  async function deleteAccount() {
    // Clear all tables
    await db.progress.clear();
    await db.preferences.clear();
    await db.sessions.clear();
    // Delete and recreate database
    await db.delete();
    // Reset local state
    preferences = createDefaultPreferences();
  }
  ```

**Routing:**
- **MUST** use SvelteKit file-based routing
- **MUST** redirect to `/setup` after deletion (see story 1.1)
- Use `goto('/setup')` from `$app/navigation`

**UI Components:**
- **MUST** reuse existing ConfirmationDialog from `src/lib/components/settings/ConfirmationDialog.svelte` (story 1.3)
- Settings page: `src/routes/settings/+page.svelte` (modify existing)

### Project Structure Notes

- Alignment with existing settings page structure
- Reuse ConfirmationDialog pattern from story 1.3
- Follow accessibility patterns established in story 1.3

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic-1-Story-1.4-Account-Deletion]
- [Source: _bmad-output/planning-artifacts/architecture.md]
- [Source: _bmad-output/planning-artifacts/prd.md]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md]
- [Source: _bmad-output/implementation-artifacts/1-1-initial-user-setup.md]
- [Source: _bmad-output/implementation-artifacts/1-2-profile-viewing.md]
- [Source: _bmad-output/implementation-artifacts/1-3-preference-modification.md]
- [Source: _bmad-output/project-context.md]
- [Source: src/lib/db/database.ts]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

- Implemented deleteAccount method in preferences store
- Created AccountDeletionSection component with confirmation dialog
- Added unit tests for deleteAccount functionality
- All 90 tests passing

### Completion Notes List

- Created AccountDeletionSection.svelte component
- Added deleteAccount method to preferences store that clears all tables (progress, preferences, sessions)
- Confirmation dialog uses existing ConfirmationDialog component from story 1.3
- Redirects to /setup after successful deletion
- Added 5 unit tests for deleteAccount functionality

### Code Review Fixes (2026-03-05)

- Added `await db.delete()` to deleteAccount method per architecture requirements
- Modified database.ts to support database recreation after deletion
- Added 6th test to verify database deletion and recreation
- All 91 tests passing

### File List

**New files:**
- src/lib/components/settings/AccountDeletionSection.svelte - Account deletion UI
- src/lib/stores/account-deletion.test.ts - Unit tests for deleteAccount

**Modified files:**
- src/lib/stores/preferences.svelte.ts - Add deleteAccount method
- src/lib/components/settings/SettingsPage.svelte - Add account deletion section
- src/lib/db/database.ts - Add database recreation support after deletion

## Change Log

- 2026-03-05: Initial implementation - Account deletion with confirmation dialog and data clearing
- 2026-03-05: [Code-Review-Fix] Added db.delete() and recreation of database instance per architecture requirements
