---
project_name: 'melora'
user_name: 'Charles'
date: '2026-02-21'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'code_quality_rules', 'anti_patterns']
existing_patterns_found: 0
status: 'complete'
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Project Overview

**Melora** is a music ear training application designed as a progressive game with levels that guide players in developing their harmonic and melodic musical ear.

**Key Constraints:**
- Local-only resources (no backend or external services)
- PWA with full offline capability
- All components and features must be tested before validation

---

## Technology Stack & Versions

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| Svelte | ^5.x | UI Framework (uses runes: `$state`, `$derived`, `$effect`) |
| TypeScript | ^5.x | Type-safe JavaScript |
| Vite | ^6.x | Build tool & dev server |

### PWA & Storage

| Technology | Version | Purpose |
|------------|---------|---------|
| vite-plugin-pwa | ^1.x | Service Worker + Manifest generation |
| dexie | ^4.x | IndexedDB wrapper (TypeScript-first) |

### Audio

| Technology | Format | Purpose |
|------------|--------|---------|
| Web Audio API | Native | Audio playback engine |
| WebM/Opus | .webm | Audio samples (optimized compression) |

### Testing

| Technology | Version | Purpose |
|------------|---------|---------|
| Vitest | ^3.x | Component/unit testing |
| @testing-library/svelte | ^6.x | Svelte testing utilities |
| Playwright | ^1.50.x | E2E testing |
| fake-indexeddb | ^6.x | IndexedDB mocking for unit tests |

### Code Quality

| Technology | Version | Purpose |
|------------|---------|---------|
| ESLint | ^9.x | Linting |
| Prettier | ^3.x | Code formatting |
| eslint-plugin-svelte | ^3.x | Svelte-specific linting |

### Runtime Constraints

- **Node.js**: >= 20.x (LTS)
- **Package Manager**: pnpm (recommended) or npm

### Architecture Constraints

- **No external services** - All resources must be local (no backend, no external APIs)
- **SPA-only** - No SSR/SSG, configure `prerender: { entries: [] }` in svelte.config.js
- **PWA Offline** - Full offline capability required

### Audio Architecture

- **Sample-based** - Realistic instrument sounds (not synthesis)
- **Note range**: E2 to E5 (37 notes per instrument)
- **Instruments**: Piano (primary, pre-cached), others lazy-loaded
- **Isolation**: Audio logic in dedicated services, NOT in Svelte components

---

## Critical Implementation Rules

### TypeScript Configuration

- **Strict mode**: `strict: true` in tsconfig.json — no implicit any, strict null checks
- **No `any`**: Use `unknown` when type is genuinely unknown, then narrow with type guards
- **Explicit return types**: Required for all public functions and methods

### Svelte 5 Runes (Critical)

Svelte 5 introduces runes — agents MUST use these instead of legacy reactivity:

```typescript
// ✅ CORRECT - Svelte 5 runes
let count = $state(0);
let doubled = $derived(count * 2);
$effect(() => console.log(`Count changed to ${count}`));

// ❌ WRONG - Legacy Svelte 4 syntax
let count = 0;
$: doubled = count * 2;
```

### Import/Export Patterns

```typescript
// ✅ Named exports preferred
export function playNote(note: Note): void { ... }
export type { Note, Interval, Chord };

// ✅ Barrel exports for modules
// src/lib/audio/index.ts
export { AudioEngine } from './AudioEngine';
export { SampleLibrary } from './SampleLibrary';

// ❌ Avoid default exports for utilities
export default playNote; // NO
```

### Error Handling

```typescript
// ✅ Result pattern for operations that can fail
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function loadSample(note: Note): Promise<Result<AudioBuffer>> {
  try {
    const buffer = await fetchSample(note);
    return { success: true, data: buffer };
  } catch (e) {
    return { success: false, error: e as Error };
  }
}

// ❌ Don't throw for expected failures
throw new Error('Sample not found'); // NO for expected cases
```

### Type Definitions for Domain

```typescript
// ✅ Domain types in src/lib/types/
export type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Accidental = '#' | 'b' | '';
export type Octave = 2 | 3 | 4 | 5;

export interface Note {
  name: NoteName;
  accidental: Accidental;
  octave: Octave;
}

// ✅ Branded types for safety
export type LevelId = string & { readonly __brand: 'LevelId' };
export type SessionId = string & { readonly __brand: 'SessionId' };
```

### Web Audio API Typing

```typescript
// ✅ Proper typing for AudioContext
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

// ✅ Handle suspended state (browser autoplay policy)
async function resumeContext(ctx: AudioContext): Promise<void> {
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
}
```

---

## Framework-Specific Rules (SvelteKit)

### Project Structure

```
src/
├── lib/
│   ├── audio/           # Audio engine, sample library
│   ├── db/              # Dexie database, repositories
│   ├── game/            # Game logic, levels, scoring
│   ├── music/           # Music theory utilities (intervals, chords)
│   ├── stores/          # Svelte stores (state management)
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Helper functions
├── routes/
│   ├── +page.svelte     # Home page
│   ├── +layout.svelte   # App layout
│   └── game/
│       └── [level]/     # Dynamic level routes
├── static/
│   └── audio/
│       └── piano/       # Piano samples (E2-E5)
└── app.html
```

### Component Patterns

```svelte
<!-- ✅ Component with props interface -->
<script lang="ts">
  interface Props {
    level: Level;
    onComplete: (score: number) => void;
  }
  
  let { level, onComplete }: Props = $props();
  
  // Component state
  let currentScore = $state(0);
  let isPlaying = $state(false);
</script>

<!-- ❌ Don't use legacy props syntax -->
<script lang="ts">
  export let level: Level; // NO - legacy syntax
</script>
```

### Store Patterns

```typescript
// ✅ Custom store with typed state
// src/lib/stores/game.svelte.ts
export function createGameStore() {
  let currentLevel = $state<Level | null>(null);
  let score = $state(0);
  let isActive = $state(false);
  
  return {
    get currentLevel() { return currentLevel; },
    get score() { return score; },
    get isActive() { return isActive; },
    
    startLevel(level: Level) {
      currentLevel = level;
      isActive = true;
    },
    
    endSession() {
      isActive = false;
    }
  };
}

// Usage in components
const game = createGameStore();
```

### PWA Configuration

```typescript
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      includeAssets: ['audio/piano/**/*.webm'],
      manifest: {
        name: 'Melora',
        short_name: 'Melora',
        description: 'Music ear training game',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
});
```

### Service Worker (sw.ts)

```typescript
// src/sw.ts
import { precacheAndRoute } from 'workbox-precaching';

// Precache all assets including piano samples
precacheAndRoute(self.__WB_MANIFEST);

// Cache strategy for audio samples
self.addEventListener('install', (event) => {
  // Pre-cache piano samples on install
});
```

### Database Layer (Dexie)

```typescript
// src/lib/db/database.ts
import Dexie, { Table } from 'dexie';

// ✅ Single database instance
class MeloraDB extends Dexie {
  progress!: Table<GameProgress>;
  preferences!: Table<UserPreferences>;
  sessions!: Table<GameSession>;

  constructor() {
    super('melora');
    this.version(1).stores({
      progress: '++id, levelId, completedAt',
      preferences: 'id',
      sessions: '++id, levelId, startedAt'
    });
  }
}

export const db = new MeloraDB();

// ❌ Never create multiple instances
const db2 = new MeloraDB(); // NO
```

### Audio Service Isolation

```typescript
// ✅ Audio engine as a standalone service
// src/lib/audio/AudioEngine.ts
export class AudioEngine {
  private context: AudioContext | null = null;
  private sampleLibrary: SampleLibrary;
  
  constructor(sampleLibrary: SampleLibrary) {
    this.sampleLibrary = sampleLibrary;
  }
  
  async playNote(note: Note): Promise<void> {
    const ctx = this.getContext();
    await this.sampleLibrary.play(ctx, note);
  }
  
  private getContext(): AudioContext {
    if (!this.context) {
      this.context = new AudioContext();
    }
    return this.context;
  }
}

// ❌ Don't put audio logic in components
<!-- LevelComponent.svelte -->
<script>
  const audioCtx = new AudioContext(); // NO - not in components
</script>
```

---

## Testing Rules

### Test Organization

```
src/
├── lib/
│   └── audio/
│       ├── AudioEngine.ts
│       └── AudioEngine.test.ts      # Unit tests alongside source
tests/
├── unit/                            # Vitest unit tests
├── components/                      # Component tests
└── e2e/                             # Playwright E2E tests
playwright.config.ts
vitest.config.ts
```

### Test File Naming

```
AudioEngine.test.ts     # Unit tests for AudioEngine
LevelComponent.test.ts  # Component tests
game-flow.spec.ts       # E2E tests (Playwright convention)
```

### Unit Tests (Vitest)

```typescript
// ✅ Vitest test structure
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AudioEngine } from './AudioEngine';

// Mock Web Audio API
const mockAudioContext = {
  createBufferSource: vi.fn(),
  destination: {},
  resume: vi.fn(),
  state: 'running'
};

vi.stubGlobal('AudioContext', vi.fn(() => mockAudioContext));

describe('AudioEngine', () => {
  let engine: AudioEngine;
  
  beforeEach(() => {
    vi.clearAllMocks();
    engine = new AudioEngine();
  });
  
  it('should create AudioContext on first use', () => {
    engine.getContext();
    expect(AudioContext).toHaveBeenCalledOnce();
  });
});
```

### Mocking IndexedDB (Dexie)

```typescript
// ✅ Use fake-indexeddb for Dexie tests
import { describe, it, expect, beforeEach } from 'vitest';
import Dexie from 'dexie';
import 'fake-indexeddb/auto';

describe('GameProgress repository', () => {
  let db: MeloraDB;
  
  beforeEach(async () => {
    db = new MeloraDB();
    await db.progress.clear();
  });
  
  it('should save game progress', async () => {
    await db.progress.add({
      levelId: 'level-1',
      completed: true,
      bestScore: 100
    });
    
    const saved = await db.progress.where('levelId').equals('level-1').first();
    expect(saved?.bestScore).toBe(100);
  });
});
```

### Component Tests (Testing Library)

```typescript
// ✅ Svelte component testing
import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import LevelComponent from './LevelComponent.svelte';

describe('LevelComponent', () => {
  it('should display level title', () => {
    const { getByText } = render(LevelComponent, {
      props: { level: { id: 'level-1', title: 'Intervals' } }
    });
    
    expect(getByText('Intervals')).toBeInTheDocument();
  });
  
  it('should call onComplete when finished', async () => {
    const onComplete = vi.fn();
    const { getByRole } = render(LevelComponent, {
      props: { level: mockLevel, onComplete }
    });
    
    const button = getByRole('button', { name: /complete/i });
    await fireEvent.click(button);
    
    expect(onComplete).toHaveBeenCalledWith(expect.any(Number));
  });
});
```

### E2E Tests (Playwright)

```typescript
// ✅ Playwright E2E test
import { test, expect } from '@playwright/test';

test.describe('Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Reset IndexedDB before each test
    await page.goto('/');
    await page.evaluate(() => indexedDB.deleteDatabase('melora'));
  });
  
  test('should complete a level and save progress', async ({ page }) => {
    await page.goto('/');
    
    // Start game
    await page.click('[data-testid="start-game"]');
    
    // Complete level
    await page.click('[data-testid="answer-correct"]');
    
    // Verify score saved
    await expect(page.locator('[data-testid="score"]')).toContainText('100');
  });
  
  test('should play audio when note is triggered', async ({ page }) => {
    await page.goto('/game/level-1');
    
    // Check audio context is running after user interaction
    await page.click('[data-testid="play-note"]');
    
    const audioState = await page.evaluate(() => {
      return (window as any).__audioContext?.state;
    });
    
    expect(audioState).toBe('running');
  });
});
```

### Test Coverage Requirements

| Type | Minimum Coverage |
|------|------------------|
| **Branches** | 80% |
| **Functions** | 90% |
| **Lines** | 85% |
| **Statements** | 85% |

### Critical Test Rules

1. **All components** must have component tests before merge
2. **All user flows** must have E2E tests
3. **Audio-related tests** must mock Web Audio API in unit tests
4. **Database tests** must use fake-indexeddb, never real IndexedDB
5. **PWA functionality** tested via E2E only (service worker behavior)

### Test Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.ts', 'tests/**/*.test.ts'],
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/', '**/*.d.ts']
    }
  }
});
```

```typescript
// tests/setup.ts
import 'fake-indexeddb/auto';

// Mock Web Audio API
class MockAudioContext {
  state = 'running';
  createBufferSource() { return { connect: () => {}, start: () => {} }; }
  createGain() { return { connect: () => {}, gain: { value: 1 } }; }
  destination = {};
  resume() { return Promise.resolve(); }
}

vi.stubGlobal('AudioContext', MockAudioContext);
```

---

## Code Quality & Style Rules

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| **Components** | PascalCase | `LevelSelector.svelte`, `GameBoard.svelte` |
| **Services/Classes** | PascalCase | `AudioEngine`, `SampleLibrary` |
| **Functions** | camelCase | `playNote()`, `calculateScore()` |
| **Variables** | camelCase | `currentLevel`, `userScore` |
| **Constants** | SCREAMING_SNAKE_CASE | `MAX_LEVELS`, `DEFAULT_TEMPO` |
| **Types/Interfaces** | PascalCase | `Note`, `GameSession`, `LevelConfig` |
| **Type parameters** | Single uppercase or PascalCase | `T`, `TData`, `TResult` |
| **Files (util)** | kebab-case | `note-utils.ts`, `audio-helpers.ts` |
| **Test files** | source + `.test.ts` | `AudioEngine.test.ts` |

### File Organization

```
// ✅ Within each module folder:
audio/
├── index.ts              # Barrel export
├── AudioEngine.ts        # Main class
├── SampleLibrary.ts      # Related class
├── types.ts              # Module-specific types
└── AudioEngine.test.ts   # Tests alongside source
```

### ESLint Configuration

```javascript
// eslint.config.js
import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs['flat/recommended'],
  prettier,
  {
    rules: {
      // TypeScript specific
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      
      // Svelte specific
      'svelte/no-at-html-tags': 'error',
      'svelte/require-store-callbacks-use-set-param': 'warn',
      
      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always']
    }
  }
];
```

### Prettier Configuration

```json
// .prettierrc
{
  "useTabs": false,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-svelte"]
}
```

### Code Style Rules

```typescript
// ✅ Prefer early returns
function getLevelDifficulty(level: Level): Difficulty {
  if (level.isBonus) return 'bonus';
  if (level.score > 80) return 'mastered';
  if (level.score > 50) return 'intermediate';
  return 'beginner';
}

// ❌ Avoid deep nesting
function getLevelDifficulty(level: Level): Difficulty {
  if (!level.isBonus) {
    if (level.score > 80) {
      return 'mastered';
    } else if (level.score > 50) {
      return 'intermediate';
    } else {
      return 'beginner';
    }
  } else {
    return 'bonus';
  }
}
```

```typescript
// ✅ Use const assertions for readonly data
const NOTE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

// ✅ Prefer immutable patterns
const newLevels = [...oldLevels, newLevel]; // spread, not push

// ❌ Avoid mutations
oldLevels.push(newLevel); // NO
```

### Documentation Standards

```typescript
// ✅ JSDoc for public APIs
/**
 * Plays a musical note through the audio engine.
 * @param note - The note to play (includes name, accidental, octave)
 * @param options - Optional playback settings
 * @returns Promise that resolves when playback starts
 */
export async function playNote(
  note: Note,
  options?: PlayOptions
): Promise<void> {
  // ...
}

// ✅ Inline comments for non-obvious logic
// Web Audio API requires user interaction to start AudioContext
// This check handles the browser's autoplay policy
if (audioContext.state === 'suspended') {
  await audioContext.resume();
}

// ❌ Avoid obvious comments
const score = 0; // Set score to 0
```

### Import Organization

```typescript
// ✅ Import order: external → internal → types
// 1. External packages
import { writable } from 'svelte/store';
import Dexie from 'dexie';

// 2. Internal modules (use $lib alias)
import { AudioEngine } from '$lib/audio';
import type { Note, Level } from '$lib/types';

// 3. Relative imports
import { calculateInterval } from './music-utils';

// ❌ Mixed import order
import { calculateInterval } from './music-utils';
import Dexie from 'dexie';
import { AudioEngine } from '$lib/audio';
```

---

## Critical Anti-Patterns & Gotchas

### Audio-Specific Anti-Patterns

```typescript
// ❌ NEVER create AudioContext at module level
const audioContext = new AudioContext(); // NO - created before user interaction

// ✅ Create on user interaction
let audioContext: AudioContext | null = null;
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

// ❌ NEVER assume AudioContext is running
audioContext.createBufferSource().start(); // May fail if suspended

// ✅ Always check and resume
async function ensureAudioReady(ctx: AudioContext): Promise<void> {
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
}
```

### PWA-Specific Anti-Patterns

```typescript
// ❌ Don't use localStorage for structured game data
localStorage.setItem('progress', JSON.stringify(complexData)); // Size limits, sync issues

// ✅ Use IndexedDB via Dexie for game data
await db.progress.add({ levelId, score, completedAt });

// ❌ Don't forget to handle offline state
fetch('/api/data'); // Will fail offline

// ✅ This is a local-only app - no network calls needed
// All resources are pre-cached by service worker
```

### Svelte 5 Anti-Patterns

```typescript
// ❌ Don't mix runes with legacy reactivity
let count = $state(0);
$: doubled = count * 2; // NO - mixing paradigms

// ✅ Use runes consistently
let count = $state(0);
let doubled = $derived(count * 2);

// ❌ Don't mutate arrays/objects directly
items.push(newItem); // NO - won't trigger reactivity in some cases

// ✅ Reassign for reactivity
items = [...items, newItem];

// ❌ Don't use $effect for derived values
$effect(() => {
  result = computeExpensive(a, b); // NO - use $derived
});

// ✅ Use $derived for computed values
let result = $derived(computeExpensive(a, b));
```

### IndexedDB/Dexie Anti-Patterns

```typescript
// ❌ Don't create multiple database instances
const db1 = new MeloraDB();
const db2 = new MeloraDB(); // NO - connection pool issues

// ✅ Export single instance
// database.ts
export const db = new MeloraDB();

// ❌ Don't forget to handle schema migrations
// When adding new tables, increment version
this.version(1).stores({ progress: '++id' }); // Old
this.version(2).stores({ progress: '++id', sessions: '++id' }); // New

// ✅ Plan schema carefully, test migrations
```

### Testing Anti-Patterns

```typescript
// ❌ Don't test implementation details
expect(component.querySelector('.internal-class')).toBeTruthy();

// ✅ Test user-facing behavior
expect(getByRole('button', { name: /play/i })).toBeInTheDocument();

// ❌ Don't share state between tests
let sharedData = {};
it('test 1', () => { sharedData.value = 1; });
it('test 2', () => { expect(sharedData.value).toBe(1); }); // Flaky!

// ✅ Isolate test state
beforeEach(() => {
  sharedData = {};
});

// ❌ Don't forget to reset IndexedDB in E2E tests
test('my test', async ({ page }) => {
  await page.goto('/'); // Previous data may exist
});

// ✅ Reset database state
test.beforeEach(async ({ page }) => {
  await page.evaluate(() => indexedDB.deleteDatabase('melora'));
});
```

### Performance Gotchas

```typescript
// ❌ Don't load all audio samples at once
await Promise.all(notes.map(n => loadSample(n))); // Blocking, memory heavy

// ✅ Load progressively
// Piano (primary instrument) pre-cached
// Other instruments lazy-loaded on demand

// ❌ Don't put heavy computations in reactive statements
let processed = $derived(expensiveTransform(largeData)); // Runs on every access

// ✅ Memoize or use $derived.by for complex computations
let processed = $derived.by(() => {
  // Computed once, cached until dependencies change
  return expensiveTransform(largeData);
});
```

### Browser Compatibility Notes

```typescript
// ⚠️ Web Audio API autoplay policy
// Browsers require user interaction before AudioContext can play
// Solution: Initialize on first click/tap, show "Tap to start" if needed

// ⚠️ IndexedDB private browsing mode
// Some browsers restrict IndexedDB in private mode
// Solution: Graceful degradation, warn user if unavailable

// ⚠️ Service Worker HTTPS requirement
// Service Workers only work on HTTPS or localhost
// Solution: Dev on localhost, deploy with HTTPS
```

### Critical Checklist for AI Agents

Before submitting code, verify:

- [ ] No AudioContext created at module level
- [ ] AudioContext.resume() called before playback
- [ ] Using Svelte 5 runes, not legacy reactivity
- [ ] IndexedDB accessed via single `db` instance
- [ ] Tests mock Web Audio API (unit) or use real browser (E2E)
- [ ] E2E tests reset IndexedDB between tests
- [ ] No external API calls (local-only app)
- [ ] PWA assets listed in vite-plugin-pwa config

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code in this project
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge during development

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

---

**Last Updated:** 2026-02-21
