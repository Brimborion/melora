# Story 1.0: Project Setup from Starter Template

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to initialize the project using the SvelteKit starter template,
so that I can have a ready-to-develop base with all dependencies installed.

## Acceptance Criteria

1. **Given** the architecture specifies SvelteKit with TypeScript
   **When** the developer runs the setup command (`pnpx sv create melora --template=minimal --types=ts`)
   **Then** the project is created with all dependencies
   **And** the project compiles without errors

2. **Given** the project is created
   **When** the developer configures Tailwind CSS and vite-plugin-pwa
   **Then** the PWA is functional with offline capability
   **And** Dexie is installed for IndexedDB

3. **Given** the project structure is set up
   **When** the developer follows the architecture patterns (AudioContext singleton, Dexie single instance, Svelte 5 runes)
   **Then** the foundation is ready for story implementation
   **And** no technical debt is introduced

## Tasks / Subtasks

- [x] Initialize SvelteKit project with TypeScript (AC: 1)
  - [x] Run `pnpx sv create melora --template=minimal --types=ts`
  - [x] Verify project compiles without errors
  - [x] Install dependencies and verify `pnpm dev` runs
- [x] Configure Tailwind CSS with Art Nouveau theme (AC: 2)
  - [x] Install Tailwind CSS with PostCSS and Autoprefixer
  - [x] Configure custom color system (Deep purple #2D1B4E, Rich gold #D4AF37, etc.)
  - [x] Set up typography (Playfair Display for headings, Inter for body)
  - [x] Configure responsive breakpoints (mobile: 320-767px, tablet: 768-1023px, desktop: 1024px+)
- [x] Configure PWA with vite-plugin-pwa (AC: 2)
  - [x] Install and configure vite-plugin-pwa
  - [x] Set up service worker for offline caching
  - [x] Configure PWA manifest (icons, name, theme colors)
  - [x] Verify offline functionality works
- [x] Install and configure Dexie for IndexedDB (AC: 2)
  - [x] Install Dexie ^4.x
  - [x] Create single Dexie instance at `src/lib/db/database.ts`
  - [x] Set up database schema for user preferences, scores, progress
- [x] Configure project structure following architecture (AC: 3)
  - [x] Create folder structure: `src/lib/audio/`, `src/lib/db/`, `src/lib/game/`, `src/lib/music/`, `src/lib/stores/`, `src/lib/types/`
  - [x] Configure AudioContext singleton pattern (NOT at module level)
  - [x] Set up Svelte 5 runes state management (NOT legacy $:)
  - [x] Verify all patterns compile without TypeScript errors

## Dev Notes

- **Technical Stack (from Architecture):**
  - Framework: SvelteKit with TypeScript ^5.x (strict mode)
  - Build Tool: Vite ^6.x
  - PWA: vite-plugin-pwa ^1.x
  - Database: Dexie ^4.x (IndexedDB wrapper) - single instance pattern
  - State Management: Svelte 5 Runes ($state, $derived, $effect)
  - Testing: Vitest ^3.x, Playwright ^1.50.x
  - Styling: Tailwind CSS with custom Art Nouveau design system

- **Project Structure Requirements (MUST follow):**
  - `src/lib/audio/` - Audio engine, sample library (AudioContext singleton)
  - `src/lib/db/` - Dexie database, repositories
  - `src/lib/game/` - Game logic, levels, scoring
  - `src/lib/music/` - Music theory utilities
  - `src/lib/stores/` - Svelte stores (state with runes)
  - `src/lib/types/` - TypeScript types
  - `src/routes/` - SvelteKit routing
  - `static/audio/` - Piano samples (pre-cached for offline)
  - `tests/` - E2E tests (Playwright)

- **Required Patterns (CRITICAL - must implement correctly):**
  - AudioContext singleton pattern (NEVER create at module level - must use lazy initialization)
  - Audio services isolated from Svelte components
  - Single Dexie instance export from `src/lib/db/database.ts`
  - Svelte 5 runes syntax (NOT legacy $: reactive statements)

- **Design System - Art Nouveau "Mystical Orient":**
  - Primary: Deep purple (#2D1B4E), Rich gold (#D4AF37)
  - Secondary: Teal (#1A5F5F), Burgundy (#722F37)
  - Accent: Warm cream (#F5E6D3), Soft rose (#E8B4B8)
  - Success: Emerald green (#2ECC71)
  - Error: Soft coral (#E74C3C)
  - Dark background (#1A1A2E) for immersive focus during exercises

- **Accessibility Requirements:**
  - WCAG 2.1 Level A compliance
  - Keyboard navigation with visual focus indicators
  - Screen reader support with complete ARIA implementation
  - Minimum 4.5:1 color contrast ratios
  - Minimum 44x44px touch targets

- **Testing Standards Summary:**
  - Unit tests: Vitest ^3.x
  - E2E tests: Playwright ^1.50.x
  - Store tests for state management
  - Audio service tests (mocked AudioContext)

### Project Structure Notes

- Follow the unified project structure defined in architecture
- Use TypeScript strict mode throughout
- All paths should be relative to project root
- No duplicate functionality - reuse existing patterns

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic-1-User-Setup--Preferences]
- [Source: _bmad-output/planning-artifacts/architecture.md#Technical-Stack]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project-Structure]
- [Source: _bmad-output/planning-artifacts/architecture.md#Required-Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Design-Requirements]

## Dev Agent Record

### Agent Model Used

OpenCode (big-pickle model)

### Debug Log References

N/A - First implementation story

### Completion Notes List

**Implementation completed on 2026-03-02:**

1. **SvelteKit Project Initialization**
   - Created SvelteKit project with TypeScript template
   - Configured adapter-static for SPA mode
   - Added +layout.ts with ssr=false for client-side routing
   - Project compiles and builds successfully

2. **Tailwind CSS Configuration**
   - Installed @tailwindcss/vite plugin
   - Created app.css with Art Nouveau "Mystical Orient" theme
   - Configured custom colors: Deep purple (#2D1B4E), Rich gold (#D4AF37), etc.
   - Added Google Fonts: Playfair Display (headings), Inter (body)
   - Build verification passed

3. **PWA Configuration**
   - Installed vite-plugin-pwa with workbox
   - Configured service worker for offline caching
   - Created PWA manifest with app name, theme colors, icons
   - Pre-caching configured for fonts and static assets

4. **Dexie Database Setup**
   - Installed Dexie 4.x
   - Created single MeloraDB instance at src/lib/db/database.ts
   - Schema: progress, preferences, sessions tables
   - Created type definitions for GameProgress, UserPreferences, GameSession

5. **Project Structure & Architecture**
   - Created folder structure: audio/, db/, game/, music/, stores/, types/
   - Implemented AudioContext singleton with lazy initialization (not module level)
   - Created Svelte 5 runes-based stores (game.svelte.ts, preferences.svelte.ts)
   - Added TypeScript types for music and game modules
   - All patterns compile without TypeScript errors

6. **Testing Setup**
   - Installed Vitest, @testing-library/svelte, jsdom, fake-indexeddb
   - Created vitest.config.ts and tests/setup.ts with mocks
   - Installed Playwright for E2E testing
   - Created playwright.config.ts

### File List

New files created:
- src/app.css (Tailwind with Art Nouveau theme)
- src/routes/+layout.ts (SSR disable for SPA)
- src/lib/db/database.ts (Dexie single instance)
- src/lib/db/index.ts (barrel export)
- src/lib/types/music.ts (music type definitions)
- src/lib/types/game.ts (game type definitions)
- src/lib/types/index.ts (types barrel export)
- src/lib/audio/AudioEngine.ts (AudioContext singleton)
- src/lib/audio/SampleLibrary.ts (audio sample loader)
- src/lib/audio/index.ts (audio barrel export)
- src/lib/game/levels.ts (level definitions)
- src/lib/game/scoring.ts (scoring system)
- src/lib/game/scoring.test.ts (scoring unit tests - 27 tests)
- src/lib/game/index.ts (game barrel export)
- src/lib/music/theory.ts (music theory utilities)
- src/lib/music/theory.test.ts (music theory unit tests - 19 tests)
- src/lib/music/index.ts (music barrel export)
- src/lib/stores/game.svelte.ts (game state with runes)
- src/lib/stores/preferences.svelte.ts (preferences with runes)
- src/lib/stores/index.ts (stores barrel export)
- static/icon-192.svg (PWA icon)
- static/icon-512.svg (PWA icon)
- vite.config.ts (added Tailwind & PWA plugins)
- svelte.config.js (adapter-static for SPA)
- vitest.config.ts (test configuration)
- tests/setup.ts (test mocks)
- playwright.config.ts (E2E configuration)
- package.json (added test scripts and dependencies)

Template-generated files (also created):
- README.md (SvelteKit template)
- src/app.html (SvelteKit template)
- src/lib/index.ts (SvelteKit barrel export)
- src/lib/assets/favicon.svg (SvelteKit template)
- src/app.d.ts (SvelteKit type definitions)
- tsconfig.json (TypeScript config)
- pnpm-lock.yaml (pnpm lock file)
- pnpm-workspace.yaml (pnpm workspace)

Modified files:
- src/routes/+layout.svelte (added CSS import, fonts)
- package.json (dependencies added)

## Change Log

- 2026-03-02: Project setup complete - SvelteKit with TypeScript, Tailwind CSS, PWA, Dexie, and architecture patterns implemented
- 2026-03-02: Code review fixes - Added unit tests (46 tests passing), updated File List with template files
- 2026-03-17: Code review (AI) - Fixed unused CSS, added review follow-ups

## Review Follow-ups (AI)

### Issues Fixed
- [x] Removed unused CSS selector `.placeholder-content` in src/routes/+page.svelte

### Known Issues (Deferred)
- [ ] **Piano samples missing**: The story claims `static/audio/piano/` contains pre-cached samples, but the folder is empty. This is a gap that will need to be addressed before audio playback can function. (Note: AudioEngine and SampleLibrary are implemented but require actual audio files to work.)

### Notes
- Story 1-0 implementation is complete but source files are untracked in git (not committed)
- Files from later stories (2.1-2.6) are present in src/ - this is expected as development continued
- 214 unit tests passing
- TypeScript compiles with 0 errors, 7 warnings (accessibility)
