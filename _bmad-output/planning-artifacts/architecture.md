---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: [
  "/home/charles/Dev/melora/_bmad-output/planning-artifacts/prd.md",
  "/home/charles/Dev/melora/_bmad-output/planning-artifacts/product-brief-melora-2026-02-22.md",
  "/home/charles/Dev/melora/_bmad-output/planning-artifacts/ux-design-specification.md",
  "/home/charles/Dev/melora/_bmad-output/project-context.md"
]
workflowType: 'architecture'
project_name: 'melora'
user_name: 'Charles'
date: '2026-03-01'
lastStep: 8
status: 'complete'
completedAt: '2026-03-01'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- 53 FR organized in 7 categories
- User Management (FR3-FR7): Preferences, profile, account deletion
- Exercise Management (FR8-FR15): Library, filtering, launch, completion
- **Audio Processing (FR16-FR22)**: Pitch detection via Web Audio API (±50 cents), real-time analysis, multiple instrument support
- Progress Tracking (FR23-FR30): Scores, statistics, personalization, offline storage with IndexedDB
- Game Experience (FR31-FR38): Journey map, chapter unlocking, badges, achievements
- Content Management (FR39-FR45): Chapter/level loading, musical contexts, pedagogical progression
- System Management (FR46-FR53): Accessibility (WCAG), browser capabilities, caching, PWA

**Non-Functional Requirements:**
- **Performance**: Pitch detection <500ms latency, user interaction <100ms, 60fps animations, initial load <<2s
- **Accessibility**: WCAG 2.1 Level A - full keyboard navigation, ARIA labels, 4.5:1 contrast ratio
- **Reliability**: 99.9% offline uptime, local data persistence, automatic sync when reconnected
- **Audio**: Automatic handling of suspended audio contexts, permission management

**Scale & Complexity:**
- Primary domain: Web/PWA (Progressive Web App)
- Complexity level: Medium
- Estimated architectural components: 10-15 core components

### Technical Constraints & Dependencies

- **Platform**: Web-based PWA (Chrome 90+, Firefox 88+, Safari 14+)
- **Audio**: Web Audio API required, microphone permission for pitch detection
- **Storage**: 100% local - IndexedDB for progress, no backend server
- **Offline**: Service Workers for complete offline capability
- **Single developer**: Architecture must be maintainable by one person

### Cross-Cutting Concerns Identified

1. **Audio Pipeline**: Real-time pitch detection, sample playback, audio context management - affects multiple features
2. **Offline Mode**: Service Worker caching, IndexedDB sync - impacts all data operations
3. **Accessibility**: ARIA implementation, keyboard navigation - must be integrated across all components
4. **State Management**: User progress, chapter unlocking, scores - shared across components
5. **Design System**: Tailwind CSS custom components - reusable across all UI

## Starter Template Evaluation

### Primary Technology Domain

**Web/PWA Application** based on project requirements:
- Service Workers for offline capability
- IndexedDB for local storage
- Web Audio API for pitch detection

### Technical Preferences Found (Project Context)

Existing technical preferences documented in `project-context.md`:

| Technology | Version | Purpose |
|------------|---------|---------|
| Svelte | ^5.x | UI Framework (runes: `$state`, `$derived`, `$effect`) |
| TypeScript | ^5.x | Type-safe JavaScript |
| Vite | ^6.x | Build tool & dev server |
| vite-plugin-pwa | ^1.x | Service Worker + Manifest |
| dexie | ^4.x | IndexedDB wrapper |
| Vitest | ^3.x | Testing |
| Playwright | ^1.50.x | E2E testing |
| **Tone.js** | **^15.x** | **Audio engine with Salamander sampler** |
| **Salamander Sound Library** | **CC-BY-3.0** | **High-quality piano samples** |

### Selected Starter: SvelteKit

**Rationale:**
- Project already uses SvelteKit framework (as documented in project context)
- No external starter needed - stack is pre-defined
- Single developer constraint: familiar, maintainable stack

**Initialization Command:**

```bash
# Using npm
npx sv create melora --template=minimal --types=ts

# Using pnpm (recommended)
pnpx sv create melora --template=minimal --types=ts
```

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- TypeScript ^5.x with strict mode enabled
- No implicit any, explicit return types required

**Styling Solution:**
- Tailwind CSS (as specified in UX spec)
- Custom Art Nouveau design system

**Build Tooling:**
- Vite ^6.x for development and build
- HMR for development experience

**Testing Framework:**
- Vitest for unit/component tests
- Playwright for E2E tests
- fake-indexeddb for IndexedDB mocking

**Code Organization:**
- SvelteKit routing (`src/routes/`)
- Library pattern (`src/lib/`)
- Component co-location with tests

**Development Experience:**
- Hot module replacement
- TypeScript IntelliSense
- ESLint + Prettier configured

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- State Management: Svelte 5 Runes
- PWA Caching: Stale While Revalidate

**Important Decisions (Shape Architecture):**
- Hosting: Vercel
- Offline Strategy: Salamander samples cached via Service Worker, other assets pre-cached

**Deferred Decisions (Post-MVP):**
- Multi-instrument support (lazy-load after MVP)
- Advanced analytics (local-only MVP)

### Data Architecture

**Database:** Dexie (IndexedDB wrapper)
- Version: ^4.x
- Single instance pattern (export `db` from `src/lib/db/database.ts`)
- Schema: progress, preferences, sessions tables
- Migrations handled via version increment

**Data Validation:** TypeScript strict mode
- No `any` types - use `unknown` with type guards
- Explicit return types required for all public functions

### Authentication & Security

**Not applicable** - Local-only PWA, no authentication required
- All user data stored locally in IndexedDB
- No external API calls
- Microphone permission handled by browser

### API & Communication Patterns

**Not applicable** - No backend API
- All resources local
- Service Worker handles caching
- No rate limiting needed

### Frontend Architecture

**State Management:** Svelte 5 Runes
- `$state` for reactive state
- `$derived` for computed values
- `$effect` for side effects
- Pattern: Custom stores as classes with runes

**Component Architecture:**
- Props via `$props()` in Svelte 5
- Component co-location with tests
- Barrel exports from `src/lib/`

**Routing:**
- SvelteKit file-based routing
- Dynamic routes for levels: `src/routes/game/[level]/`

### Infrastructure & Deployment

**Hosting:** Vercel
- Free tier sufficient for PWA
- Automatic CI/CD from Git
- PWA manifest + Service Worker support

**CI/CD:**
- Git-based deployment
- Vercel automatically builds from main branch

**Environment:**
- No environment variables required (local-only)
- No secrets needed

**Offline Strategy:**

**Salamander Sound Library (CDN-hosted):**
- Samples loaded from: `https://tonejs.github.io/audio/salamander/`
- Service Worker caches Salamander samples after first load
- CacheFirst strategy with 30-day expiration
- Offline-first: After initial load, app works fully offline

```typescript
// vite.config.ts - PWA configuration
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    sveltekit(),
    VitePWA({
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/tonejs\.github\.io\/audio\/salamander\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'salamander-samples',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          }
        ]
      }
    })
  ]
});
```

**Note:** Tone.js requires `Tone.start()` after user interaction (autoplay policy). This is handled automatically in ToneAudioEngine.

### Decision Impact Analysis

**Implementation Sequence:**
1. Initialize SvelteKit project
2. Configure PWA with vite-plugin-pwa
3. Set up Dexie database schema
4. Create audio services
5. Build UI components
6. Implement game logic with runes
7. Deploy to Vercel

**Cross-Component Dependencies:**
- AudioEngine requires AudioContext singleton
- Dexie requires single instance export
- Game store depends on both AudioEngine and Dexie

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
5 areas where AI agents could make different choices

### Naming Patterns

**Code Naming Conventions (from project context):**

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `LevelSelector.svelte` |
| Services/Classes | PascalCase | `AudioEngine` |
| Functions | camelCase | `playNote()` |
| Variables | camelCase | `currentLevel` |
| Constants | SCREAMING_SNAKE | `MAX_LEVELS` |
| Types/Interfaces | PascalCase | `Note`, `GameSession` |
| Test files | `.test.ts` co-located | `AudioEngine.test.ts` |

### Structure Patterns

**Project Organization:**

```
src/
├── lib/
│   ├── audio/           # Audio engine, sample library
│   ├── db/              # Dexie database, repositories
│   ├── game/            # Game logic, levels, scoring
│   ├── music/           # Music theory utilities
│   ├── stores/          # Svelte stores (state)
│   ├── types/           # TypeScript types
│   └── utils/           # Helper functions
├── routes/              # SvelteKit routing
├── static/audio/        # Audio assets (Salamander loaded from CDN)
└── tests/               # E2E tests (Playwright)
```

### Audio Patterns (Critical)

**Tone.js + Salamander Pattern (REQUIRED):**

```typescript
// ✅ CORRECT - Tone.js Sampler with Salamander
import * as Tone from 'tone';

export class ToneAudioEngine {
  private sampler: Tone.Sampler | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    await Tone.start();
    
    this.sampler = new Tone.Sampler({
      urls: {
        C2: 'C2.mp3', D2: 'D2.mp3', E2: 'E2.mp3', F2: 'F2.mp3',
        G2: 'G2.mp3', A2: 'A2.mp3', B2: 'B2.mp3',
        C3: 'C3.mp3', D3: 'D3.mp3', E3: 'E3.mp3', F3: 'F3.mp3',
        G3: 'G3.mp3', A3: 'A3.mp3', B3: 'B3.mp3',
        C4: 'C4.mp3', D4: 'D4.mp3', E4: 'E4.mp3', F4: 'F4.mp3',
        G4: 'G4.mp3', A4: 'A4.mp3', B4: 'B4.mp3',
        C5: 'C5.mp3', D5: 'D5.mp3', E5: 'E5.mp3'
      },
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
      onload: () => {
        console.log('Salamander samples loaded');
        this.initialized = true;
      }
    }).toDestination();
  }

  async playNote(note: string, duration: string = '8n'): Promise<void> {
    if (!this.sampler) {
      throw new Error('AudioEngine not initialized');
    }
    await Tone.start();
    this.sampler.triggerAttackRelease(note, duration);
  }
}

// ❌ WRONG - Native Web Audio API for sample playback
const audioContext = new AudioContext();
const buffer = await fetch('/audio/C4.webm');
```

**Pitch Detection (unchanged):**
- Continues to use native Web Audio API directly
- `PitchDetector` remains unchanged

**Audio Service Isolation:**
- All audio logic in `src/lib/audio/` services
- NEVER in Svelte components
- Handle suspended state via `Tone.start()`

**Salamander License:**
- CC-BY-3.0 - Attribution required
- Add credits in app (settings/about): "Salamander Sound Library by Alexander Holm"

### State Management Patterns

**Svelte 5 Runes (REQUIRED):**

```typescript
// ✅ CORRECT - Svelte 5 runes
let count = $state(0);
let doubled = $derived(count * 2);
$effect(() => console.log(`Count: ${count}`));

// ❌ WRONG - Legacy Svelte 4 syntax
let count = 0;
$: doubled = count * 2;
```

### Database Patterns

**Dexie Single Instance:**

```typescript
// ✅ CORRECT - Single exported instance
// src/lib/db/database.ts
export const db = new MeloraDB();

// ❌ WRONG - Multiple instances
const db1 = new MeloraDB();
const db2 = new MeloraDB(); // CONFLIT!
```

### Enforcement Guidelines

**All AI Agents MUST:**

1. Read `project-context.md` before implementing
2. Follow naming conventions exactly
3. Use Svelte 5 runes, not legacy reactivity
4. Use single `db` instance from `src/lib/db/`
5. Keep audio logic in services, not components
6. Use **Tone.js** for audio playback (NOT native Web Audio API)
7. Include **Salamander attribution** in app credits (CC-BY-3.0)
8. Test with fake-indexeddb for unit tests

### Pattern Examples

**Good Examples:**
- `export class ToneAudioEngine` with Tone.Sampler
- `let score = $state(0)` in Svelte components
- `import { db } from '$lib/db/database'` for all DB access
- Salamander attribution in app credits

**Anti-Patterns:**
- Using native Web Audio API for sample playback
- Creating AudioContext at module level
- Mixing `$state` with `$:` reactive statements
- Using localStorage for structured data
- Multiple Dexie instances

## Project Structure & Boundaries

### Complete Project Directory Structure

```
melora/
├── .github/workflows/           # CI/CD
├── src/
│   ├── lib/
│   │   ├── audio/
│   │   │   ├── ToneAudioEngine.ts    # Tone.js + Salamander audio service
│   │   │   ├── PitchDetector.ts      # Pitch detection (Web Audio API)
│   │   │   └── index.ts              # Barrel export
│   │   ├── db/
│   │   │   ├── database.ts          # Dexie single instance
│   │   │   ├── repositories/        # Data access
│   │   │   └── index.ts
│   │   ├── game/
│   │   │   ├── GameEngine.ts        # Game logic
│   │   │   ├── Scoring.ts          # Score calculation
│   │   │   ├── Progress.ts         # Progress tracking
│   │   │   └── index.ts
│   │   ├── music/
│   │   │   ├── intervals.ts         # Interval utilities
│   │   │   ├── chords.ts           # Chord utilities
│   │   │   ├── scales.ts           # Scale utilities
│   │   │   └── index.ts
│   │   ├── stores/                  # Svelte stores
│   │   │   └── game.svelte.ts      # Game state with runes
│   │   ├── types/
│   │   │   ├── note.ts             # Note types
│   │   │   ├── game.ts             # Game types
│   │   │   └── index.ts
│   │   └── utils/
│   │       └── index.ts
│   ├── routes/
│   │   ├── +layout.svelte          # App layout
│   │   ├── +page.svelte           # Home/Journey map
│   │   ├── game/
│   │   │   └── [level]/
│   │   │       └── +page.svelte   # Level page
│   │   └── settings/
│   │       └── +page.svelte       # Settings page
│   ├── static/
│   │   ├── audio/
│   │   │   └── piano/             # Piano samples (E2-E5)
│   │   └── icons/                 # PWA icons
│   ├── app.html
│   └── sw.ts                      # Service Worker
├── tests/
│   ├── unit/                      # Vitest unit tests
│   ├── components/               # Component tests
│   └── e2e/                      # Playwright E2E
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
└── tailwind.config.js
```

### Requirements to Structure Mapping

| FR Category | Directory | Key Files |
|-------------|-----------|-----------|
| Audio Processing | `src/lib/audio/` | ToneAudioEngine (Salamander), PitchDetector |
| Progress Tracking | `src/lib/db/` | database.ts, repositories |
| Game Experience | `src/lib/game/` | GameEngine, Scoring, Progress |
| Music Theory | `src/lib/music/` | intervals, chords, scales |
| User Management | `src/routes/settings/` | Settings page |
| UI Components | `src/routes/` | Pages per feature |

### Architectural Boundaries

**Audio Service Boundary:**
- ToneAudioEngine does NOT access Svelte components
- Communication via returned promises
- Tone.js manages AudioContext (via `Tone.start()`)
- PitchDetector uses native Web Audio API directly

**Database Boundary:**
- Single access point: `db` exported from `$lib/db`
- Repositories encapsulate data logic
- No direct table access from components

**State Boundary:**
- Stores use Svelte 5 runes
- Components use `$props()` to receive data
- Unidirectional communication

### Integration Points

**Internal Communication:**
- Audio services: Promise-based API
- Database: Repository pattern
- State: Svelte 5 runes with getter/setter

**External Integrations:**
- Salamander Sound Library: CDN-hosted samples (CC-BY-3.0)
- No external APIs

**Data Flow:**
```
User Action → Component → Store/Service → ToneAudioEngine (Salamander samples)
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
- ✅ Svelte 5 runes + TypeScript strict - fully compatible
- ✅ Dexie ^4.x + vite-plugin-pwa ^1.x - versions align
- ✅ PWA offline strategy with Service Worker - coherent with local-only constraint

**Pattern Consistency:**
- ✅ Audio singleton pattern aligns with AudioEngine service architecture
- ✅ Svelte 5 runes pattern consistent across all components
- ✅ Dexie single instance pattern aligns with database boundary

**Structure Alignment:**
- ✅ Project structure supports all architectural decisions
- ✅ Boundaries properly defined (audio, database, state)
- ✅ Integration points mapped to directories

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**
| FR Category | Architectural Support |
|-------------|---------------------|
| Audio (FR16-22) | `src/lib/audio/` - AudioEngine, PitchDetector |
| Progress (FR23-30) | `src/lib/db/` + `src/lib/game/` |
| Game (FR31-38) | `src/lib/game/` + stores |
| Content (FR39-45) | `src/lib/music/` |
| System (FR46-53) | PWA config + Service Worker |

**Non-Functional Requirements Coverage:**
- ✅ Performance: Vite build, lazy loading
- ✅ Accessibility: WCAG Level A via ARIA, keyboard nav
- ✅ Reliability: IndexedDB persistence, Service Worker cache

### Implementation Readiness Validation ✅

**Decision Completeness:** All critical decisions documented with versions
**Structure Completeness:** Complete directory tree defined
**Pattern Completeness:** All conflict points addressed

### Gap Analysis Results

**No critical gaps identified** - Architecture is complete and coherent.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High - All decisions validated and coherent

**Key Strengths:**
- Local-only architecture simplifies deployment
- Svelte 5 runes provide modern reactive system
- Dexie provides type-safe IndexedDB access
- Clear boundaries prevent agent conflicts
- Project context already documents all critical patterns

**Areas for Future Enhancement:**
- Multi-instrument support (post-MVP)
- Advanced analytics dashboard (post-MVP)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions
- Read `project-context.md` before any implementation

**First Implementation Priority:**
```bash
# Initialize SvelteKit project
pnpx sv create melora --template=minimal --types=ts
```
