# AGENTS.md - Agent Coding Guidelines for Melora

Melora is a music ear training web application built with Svelte 5, TypeScript, Tone.js, and IndexedDB.

## Build Commands

```bash
# Development
npm run dev              # Start Vite dev server
npm run build            # Build for production (SPA with static adapter)
npm run preview          # Preview production build

# Type Checking
npm run check            # Run svelte-check (types + svelte)
npm run check:watch      # Watch mode for type checking

# Testing
npm run test             # Run all tests (vitest)
npm run test -- src/lib/game/ExerciseEngine.test.ts   # Run single test file
npm run test -- --grep "pattern"                      # Run tests matching pattern
npm run test:watch       # Watch mode for tests
```

## Project Structure

```
src/
├── lib/
│   ├── audio/          # Audio engine (Tone.js integration)
│   ├── components/     # Svelte components (PascalCase)
│   │   ├── audio/
│   │   ├── exercise/
│   │   ├── library/
│   │   ├── permission/
│   │   ├── pitch/
│   │   ├── profile/
│   │   └── settings/
│   ├── db/             # IndexedDB (Dexie)
│   ├── game/           # Game logic, scoring, exercises
│   ├── music/          # Music theory (intervals, notes)
│   ├── stores/         # Svelte 5 runes-based stores
│   └── types/          # TypeScript interfaces
├── routes/             # SvelteKit routes (kebab-case)
└── app.css             # Tailwind + custom styles
```

## Code Style

### TypeScript

- **Strict mode** is enabled in `tsconfig.json`
- Use explicit types for function parameters and return types
- Use `type` for unions/intersections, `interface` for objects
- Avoid `any` - use `unknown` if type is truly unknown

```typescript
// Good
function playNote(note: Note, duration: Tone.Unit.Time = '2n'): Promise<void>

// Avoid
function playNote(note, duration = '2n') // Missing types
```

### Svelte 5

Use runes for reactive state:

```svelte
<script lang="ts">
  import type { Level } from '$lib/types/game';

  interface Props {
    level: Level;
    onComplete?: (score: number) => void;
  }

  let { level, onComplete }: Props = $props();

  let count = $state(0);
  let computed = $derived(count * 2);

  $effect(() => {
    console.log('Count changed:', count);
  });
</script>
```

### Imports

- Use `$lib` alias for project imports
- Group imports: external → $lib → local components
- Use index files for barrel exports

```typescript
import * as Tone from 'tone';
import type { Note } from '$lib/types';
import { exerciseStore } from '$lib/stores/exercise.svelte';
import QuestionDisplay from './QuestionDisplay.svelte';
```

### Naming Conventions

- **Components**: PascalCase (`ExerciseView.svelte`)
- **TypeScript interfaces**: PascalCase (`ExerciseQuestion`)
- **Functions/variables**: camelCase (`getScore()`, `currentQuestion`)
- **Constants**: SCREAMING_SNAKE_CASE for config values
- **Files**: camelCase (`.ts`), PascalCase (`.svelte`)

### Error Handling

- Use try/catch for async operations
- Log errors with `console.error` for debugging
- Display user-friendly messages in UI

```typescript
try {
  await exerciseEngine.saveResult();
} catch (error) {
  console.error('Error saving score:', error);
  // Show user feedback
}
```

### Testing

- Test files: `*.test.ts` in same directory as source
- Use Vitest with jsdom environment
- Test patterns: `describe`, `it`, `expect`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('ExerciseEngine', () => {
  let engine: ExerciseEngine;

  beforeEach(() => {
    engine = new ExerciseEngine();
  });

  it('should calculate score correctly', () => {
    engine.submitAnswer(true);
    engine.submitAnswer(false);
    expect(engine.getScore()).toBe(50);
  });
});
```

### CSS / Styling

- Uses Tailwind CSS v4
- Custom styles in `<style>` blocks for component-specific styles
- Follow existing color scheme: `#1A1A2E` (background), `#D4AF37` (accent), `#F5E6D3` (text)

### Accessibility

- Use semantic HTML (`<main>`, `<header>`, `<button>`)
- Include `aria-label` on interactive elements
- Ensure keyboard navigation works
- Minimum touch target size: 44px

```svelte
<button 
  class="pause-button"
  onclick={handlePause}
  aria-label="Pause exercise"
>
```

### Database (Dexie/IndexedDB)

- Database schema defined in `src/lib/db/database.ts`
- Use async/await for all DB operations
- Handle errors gracefully for offline scenarios

### Audio (Tone.js)

- Audio context must start after user interaction (autoplay policy)
- Use `ensureReady()` before playback
- Handle loading states for sample libraries
