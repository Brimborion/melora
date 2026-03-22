---
title: "Sprint Backlog - Chapter 1 Level 1"
description: "Sequential implementation order for Chapter 1 Level 1 exercises"
version: 1.0
date: 2026-03-22
status: draft
sprintNumber: 1
chapter: 1
level: 1
---

# Sprint Backlog - Chapter 1 Level 1

## Overview

This document defines the sequential implementation order for all exercises in Chapter 1, Level 1. Each exercise is implemented one after another following the pedagogical lesson structure.

**Prerequisites:**
- Story 2.2: Audio Playback System (Tone.js + Salamander) ✅ Complete
- Story 2.5: Real-time Pitch Detection ✅ Complete

---

## Sequential Implementation Order

| # | Task ID | Lesson Part | Exercise | Type | Description |
|---|---------|-------------|----------|------|-------------|
| 1 | TASK-1.1 | L1-PartB | Ex1 | Audiation | Harmonic Interval Audiation (Octave) |
| 2 | TASK-1.2 | L2-PartB | Ex2 | Discrimination | Melodic Identification (Fifth/Octave) |
| 3 | TASK-1.3 | L2-PartC | Ex4 | Singing | Introduction to Resolution (V→I) |
| 4 | TASK-1.4 | L2-PartD | Ex6 | Singing | Ascending Fifth Singing |
| 5 | TASK-1.5 | L2-PartE | Ex5 | Singing | Descending Fifth Singing |
| 6 | TASK-1.6 | L3-PartB | Ex3 | Discrimination | Harmonic Identification (Fifth/Octave/Unison) |
| 7 | TASK-1.7 | L3-PartC | Ex1 | Audiation | Harmonic Interval Audiation (Fifth) |
| 8 | TASK-1.8 | L4-PartB | Ex2 | Discrimination | Melodic Identification (Third/Fifth/Octave) |
| 9 | TASK-1.9 | L4-PartC | Ex6 | Singing | Ascending Third Singing |
| 10 | TASK-1.10 | L4-PartD | Ex5 | Singing | Descending Third Singing |
| 11 | TASK-1.11 | L5-PartB | Ex3 | Discrimination | Harmonic Identification (Third/Fifth/Octave/Unison) |
| 12 | TASK-1.12 | L5-PartC | Ex1 | Audiation | Harmonic Interval Audiation (Third) |
| 13 | TASK-1.13 | L6-PhaseA | Ex7 | Assessment | Melodic Recognition |
| 14 | TASK-1.14 | L6-PhaseB | Ex8 | Assessment | Harmonic Recognition |
| 15 | TASK-1.15 | L6-PhaseC | Ex9 | Application | Interval in Melody |

---

## Detailed Task Specifications

### TASK-1.1: Lesson 1 - Part B - Exercise 1 (Audiation - Octave)

**Status:** Pending  
**Story:** Story 2.8  
**Exercise:** Ex1 - Harmonic Interval Audiation  
**Target interval:** Octave

**Lesson Reference:** Lesson 1, Part B

**Specific Requirements:**
- Target intervals: Octave only (Unison for reference)
- Starting notes: C, F, G, D, A
- 5 fixed patterns per exercise session

**Pattern Table:**

| # | Low note | High note | Pattern |
|---|----------|------------|---------|
| 1 | C | C (octave) | Octave |
| 2 | F | F (octave) | Octave |
| 3 | G | G (octave) | Octave |
| 4 | D | D (octave) | Octave |
| 5 | A | A (octave) | Octave |

**Implementation Steps:**
1. Create `Ex1Audiation.svelte` component
2. Implement audiation procedure (Steps 1-12 from exercises.md)
3. Add Play/Replay controls
4. Integrate with ToneAudioEngine
5. Add visual feedback for audiation stages
6. Write unit tests

---

### TASK-1.2: Lesson 2 - Part B - Exercise 2 (Melodic Identification - Fifth/Octave)

**Status:** Pending  
**Story:** Story 2.9  
**Exercise:** Ex2 - Melodic Identification (Alternation)  
**Target intervals:** Fifth, Octave

**Lesson Reference:** Lesson 2, Part B

**Specific Requirements:**
- Alternation pattern: L-H-L or H-L-H
- Target intervals: Fifth, Octave
- 8 fixed patterns per exercise session

**Pattern Table:**

| # | Notes | Pattern | Answer |
|---|-------|---------|--------|
| 1 | C - G - C | L-H-L | Fifth |
| 2 | C - C (octave) - C | L-H-L | Octave |
| 3 | F - F (octave) - F | L-H-L | Octave |
| 4 | G - D - G | L-H-L | Fifth |
| 5 | D - D (octave) - D | H-L-H | Octave |
| 6 | A - E - A | H-L-H | Fifth |
| 7 | E - B - E | L-H-L | Fifth |
| 8 | C - G - C | L-H-L | Fifth |

**Implementation Steps:**
1. Create `Ex2MelodicIdentification.svelte` component
2. Implement L-H-L and H-L-H pattern playback
3. Add multiple choice answer buttons (Fifth, Octave)
4. Add feedback mechanism
5. Add Play/Replay controls
6. Write unit tests

---

### TASK-1.3: Lesson 2 - Part C - Exercise 4 (Introduction to Resolution)

**Status:** Pending  
**Story:** Story 2.9, Story 2.11  
**Exercise:** Ex4 - Introduction to Resolution  
**Target:** V → I harmonic resolution

**Lesson Reference:** Lesson 2, Part C

**Specific Requirements:**
- User sings the root note to complete V → I resolution
- 5 fixed patterns per exercise session

**Pattern Table:**

| # | Melody played | User action | Expected answer |
|---|---------------|-------------|-----------------|
| 1 | C - E - G - G | Sing C | Root (C) |
| 2 | C - C - G - G | Sing C | Root (C) |
| 3 | F - A - C - C | Sing F | Root (F) |
| 4 | G - G - D - D | Sing G | Root (G) |
| 5 | D - A - D - D | Sing G | Fifth (G) |

**Implementation Steps:**
1. Create `Ex4Resolution.svelte` component
2. Implement melody playback with pause before resolution
3. Add pitch detection for user singing
4. Add real-time pitch visualization
5. Play resolution after user sings
6. Add feedback for accuracy
7. Write unit tests

---

### TASK-1.4: Lesson 2 - Part D - Exercise 6 (Ascending Fifth Singing)

**Status:** Pending  
**Story:** Story 2.9  
**Exercise:** Ex6 - Ascending Interval Singing  
**Target interval:** Ascending Fifth

**Lesson Reference:** Lesson 2, Part D

**Specific Requirements:**
- Interval: Ascending Fifth
- User sings C-G-C pattern
- 4 fixed patterns per exercise session

**Pattern Table:**

| # | Starting note | Singing pattern | Expected |
|---|---------------|-----------------|----------|
| 1 | C | C-G-C | Ascending Fifth |
| 2 | F | F-C-F | Ascending Fourth |
| 3 | G | G-D-G | Ascending Fourth |
| 4 | D | D-A-D | Ascending Fourth |

**Implementation Steps:**
1. Create `Ex6AscendingSinging.svelte` component
2. Play starting note
3. Enable pitch detection for user singing
4. Validate pitch accuracy (±50 cents)
5. Play full ascending pattern for confirmation
6. Add pitch visualization
7. Write unit tests

---

### TASK-1.5: Lesson 2 - Part E - Exercise 5 (Descending Fifth Singing)

**Status:** Pending  
**Story:** Story 2.9  
**Exercise:** Ex5 - Descending Interval Singing  
**Target interval:** Descending Fifth

**Lesson Reference:** Lesson 2, Part E

**Specific Requirements:**
- Interval: Descending Fifth
- User sings G-C-G pattern
- 4 fixed patterns per exercise session

**Pattern Table:**

| # | Starting note | Singing pattern | Expected |
|---|---------------|-----------------|----------|
| 1 | G | G-C-G | Descending Fourth |
| 2 | D | D-G-D | Descending Fourth |
| 3 | A | A-E-A | Descending Fourth |
| 4 | E | E-B-E | Descending Fourth |

**Implementation Steps:**
1. Create `Ex5DescendingSinging.svelte` component
2. Play starting note
3. Enable pitch detection for user singing
4. Validate pitch accuracy (±50 cents)
5. Play full descending pattern for confirmation
6. Add pitch visualization
7. Write unit tests

---

### TASK-1.6: Lesson 3 - Part B - Exercise 3 (Harmonic Identification - Fifth/Octave/Unison)

**Status:** Pending  
**Story:** Story 2.8, Story 2.9  
**Exercise:** Ex3 - Harmonic Identification (Alternation)  
**Target intervals:** Fifth, Octave, Unison

**Lesson Reference:** Lesson 3, Part B

**Specific Requirements:**
- Alternation pattern: L-H-L or H-L-H
- Target intervals: Fifth, Octave, Unison
- 8 fixed patterns per exercise session

**Pattern Table:**

| # | Notes | Pattern | Answer |
|---|-------|---------|--------|
| 1 | C - G - C | L-H-L | Fifth |
| 2 | C - c - C | L-H-L | Unison |
| 3 | C - G - G - G | L-H-L | Fifth |
| 4 | C - c (octave) - C | L-H-L | Octave |
| 5 | F - F - F | L-H-L | Unison |
| 6 | F - C - F | L-H-L | Fifth |
| 7 | G - g (octave) - G | H-L-H | Octave |
| 8 | G - D - G | L-H-L | Fifth |

**Implementation Steps:**
1. Create `Ex3HarmonicIdentification.svelte` component
2. Implement harmonic + melodic alternation
3. Add multiple choice buttons (Fifth, Octave, Unison)
4. Add feedback mechanism
5. Add Play/Replay controls
6. Write unit tests

---

### TASK-1.7: Lesson 3 - Part C - Exercise 1 (Audiation - Fifth)

**Status:** Pending  
**Story:** Story 2.9  
**Exercise:** Ex1 - Harmonic Interval Audiation  
**Target interval:** Fifth

**Lesson Reference:** Lesson 3, Part C

**Specific Requirements:**
- Target intervals: Fifth only
- Starting notes: C, F, G, D, A
- 5 fixed patterns per exercise session

**Pattern Table:**

| # | Low note | High note | Pattern |
|---|----------|------------|---------|
| 1 | C | G | Fifth |
| 2 | F | C | Fourth |
| 3 | G | D | Fourth |
| 4 | D | A | Fourth |
| 5 | A | E | Fourth |

**Implementation Steps:**
1. Reuse `Ex1Audiation.svelte` component
2. Configure for Fifth interval
3. Update pattern table
4. Write unit tests

---

### TASK-1.8: Lesson 4 - Part B - Exercise 2 (Melodic Identification - Third/Fifth/Octave)

**Status:** Pending  
**Story:** Story 2.10  
**Exercise:** Ex2 - Melodic Identification (Alternation)  
**Target intervals:** Third, Fifth, Octave

**Lesson Reference:** Lesson 4, Part B

**Specific Requirements:**
- Alternation pattern: L-H-L
- Target intervals: Third, Fifth, Octave
- 8 fixed patterns per exercise session

**Pattern Table:**

| # | Notes | Pattern | Answer |
|---|-------|---------|--------|
| 1 | C - E - C | L-H-L | Third |
| 2 | C - G - C | L-H-L | Fifth |
| 3 | C - E - E - E | L-H-L | Third |
| 4 | C - c (octave) - C | L-H-L | Octave |
| 5 | F - A - F | L-H-L | Third |
| 6 | F - C - F | L-H-L | Fifth |
| 7 | G - B - G | L-H-L | Third |
| 8 | G - D - G | L-H-L | Fifth |

**Implementation Steps:**
1. Reuse `Ex2MelodicIdentification.svelte` component
2. Add Third as possible answer
3. Update pattern table
4. Write unit tests

---

### TASK-1.9: Lesson 4 - Part C - Exercise 6 (Ascending Third Singing)

**Status:** Pending  
**Story:** Story 2.10  
**Exercise:** Ex6 - Ascending Interval Singing  
**Target interval:** Ascending Third

**Lesson Reference:** Lesson 4, Part C

**Specific Requirements:**
- Interval: Ascending Third
- User sings C-E-C pattern
- 3 fixed patterns per exercise session

**Pattern Table:**

| # | Starting note | Singing pattern | Expected |
|---|---------------|-----------------|----------|
| 1 | C | C-E-C | Ascending Third |
| 2 | F | F-A-F | Ascending Third |
| 3 | G | G-B-G | Ascending Third |

**Implementation Steps:**
1. Reuse `Ex6AscendingSinging.svelte` component
2. Configure for Third interval
3. Update pattern table
4. Write unit tests

---

### TASK-1.10: Lesson 4 - Part D - Exercise 5 (Descending Third Singing)

**Status:** Pending  
**Story:** Story 2.10  
**Exercise:** Ex5 - Descending Interval Singing  
**Target interval:** Descending Third

**Lesson Reference:** Lesson 4, Part D

**Specific Requirements:**
- Interval: Descending Third
- User sings E-C-E pattern
- 3 fixed patterns per exercise session

**Pattern Table:**

| # | Starting note | Singing pattern | Expected |
|---|---------------|-----------------|----------|
| 1 | E | E-C-E | Descending Third |
| 2 | A | A-F-A | Descending Third |
| 3 | B | B-G-B | Descending Third |

**Implementation Steps:**
1. Reuse `Ex5DescendingSinging.svelte` component
2. Configure for Third interval
3. Update pattern table
4. Write unit tests

---

### TASK-1.11: Lesson 5 - Part B - Exercise 3 (Harmonic Identification - All Intervals)

**Status:** Pending  
**Story:** Story 2.10  
**Exercise:** Ex3 - Harmonic Identification (Alternation)  
**Target intervals:** Third, Fifth, Octave, Unison

**Lesson Reference:** Lesson 5, Part B

**Specific Requirements:**
- Alternation pattern: L-H-L
- Target intervals: Third, Fifth, Octave, Unison
- 8 fixed patterns per exercise session

**Pattern Table:**

| # | Notes | Pattern | Answer |
|---|-------|---------|--------|
| 1 | C - E - C | L-H-L | Third |
| 2 | C - G - C | L-H-L | Fifth |
| 3 | C - c - C | L-H-L | Unison |
| 4 | C - c (octave) - C | L-H-L | Octave |
| 5 | F - A - F | L-H-L | Third |
| 6 | F - C - F | L-H-L | Fifth |
| 7 | F - F - F | L-H-L | Unison |
| 8 | G - B - G | L-H-L | Third |

**Implementation Steps:**
1. Reuse `Ex3HarmonicIdentification.svelte` component
2. Update pattern table with Third patterns
3. Add Third as possible answer
4. Write unit tests

---

### TASK-1.12: Lesson 5 - Part C - Exercise 1 (Audiation - Third)

**Status:** Pending  
**Story:** Story 2.10  
**Exercise:** Ex1 - Harmonic Interval Audiation  
**Target interval:** Third

**Lesson Reference:** Lesson 5, Part C

**Specific Requirements:**
- Target intervals: Third only
- Starting notes: C, F, G
- 3 fixed patterns per exercise session

**Pattern Table:**

| # | Low note | High note | Pattern |
|---|----------|------------|---------|
| 1 | C | E | Third |
| 2 | F | A | Third |
| 3 | G | B | Third |

**Implementation Steps:**
1. Reuse `Ex1Audiation.svelte` component
2. Configure for Third interval
3. Update pattern table
4. Write unit tests

---

### TASK-1.13: Lesson 6 - Phase A - Exercise 7 (Melodic Recognition)

**Status:** Pending  
**Story:** Story 2.12  
**Exercise:** Ex7 - Melodic Recognition  
**Target:** Assessment with varying starting notes

**Lesson Reference:** Lesson 6, Phase A

**Specific Requirements:**
- Starting notes vary randomly (F, G, D, A)
- Target intervals: Third, Fifth, Octave, Unison
- 5 questions per assessment

**Pattern Table:**

| # | Notes | Answer |
|---|-------|--------|
| 1 | F - A | Third |
| 2 | G - D | Fifth |
| 3 | D - D (octave) | Octave |
| 4 | A - A | Unison |
| 5 | Random | Random |

**Implementation Steps:**
1. Create `Ex7MelodicRecognition.svelte` component
2. Implement varying starting notes
3. Add multiple choice buttons
4. Add scoring mechanism
5. Add completion screen
6. Write unit tests

---

### TASK-1.14: Lesson 6 - Phase B - Exercise 8 (Harmonic Recognition)

**Status:** Pending  
**Story:** Story 2.12  
**Exercise:** Ex8 - Harmonic Recognition  
**Target:** Assessment with varying starting notes

**Lesson Reference:** Lesson 6, Phase B

**Specific Requirements:**
- Starting notes vary randomly (F, G, D, A)
- Target intervals: Third, Fifth, Octave, Unison
- 5 questions per assessment

**Pattern Table:**

| # | Notes | Answer |
|---|-------|--------|
| 1 | F + A | Third |
| 2 | G + D | Fifth |
| 3 | D + D (octave) | Octave |
| 4 | A + A | Unison |
| 5 | Random | Random |

**Implementation Steps:**
1. Create `Ex8HarmonicRecognition.svelte` component
2. Implement harmonic intervals (simultaneous)
3. Add multiple choice buttons
4. Add scoring mechanism
5. Add completion screen
6. Write unit tests

---

### TASK-1.15: Lesson 6 - Phase C - Exercise 9 (Interval in Melody)

**Status:** Pending  
**Story:** Story 2.12  
**Exercise:** Ex9 - Interval in a Melody  
**Target:** Application - complete melody with singing

**Lesson Reference:** Lesson 6, Phase C

**Specific Requirements:**
- User sings the missing third note
- 5 patterns per assessment

**Pattern Table:**

| # | Melody | Starting note | User action | Expected |
|---|--------|---------------|-------------|----------|
| 1 | C - E - ... | C | Sing G | Complete triad (C-E-G) |
| 2 | F - A - ... | F | Sing C | Complete (F-A-C) |
| 3 | G - B - ... | G | Sing D | Complete (G-B-D) |
| 4 | D - F - ... | D | Sing A | Complete (D-F-A) |
| 5 | A - C - ... | A | Sing E | Complete (A-C-E) |

**Implementation Steps:**
1. Create `Ex9IntervalInMelody.svelte` component
2. Implement melody playback with gap
3. Add pitch detection for user singing
4. Validate pitch accuracy
5. Play complete melody after success
6. Add scoring mechanism
7. Write unit tests

---

## Component Architecture

```
src/lib/components/exercises/
├── Ex1Audiation.svelte           # TASK-1.1, TASK-1.7, TASK-1.12
├── Ex2MelodicIdentification.svelte  # TASK-1.2, TASK-1.8
├── Ex3HarmonicIdentification.svelte # TASK-1.6, TASK-1.11
├── Ex4Resolution.svelte          # TASK-1.3
├── Ex5DescendingSinging.svelte   # TASK-1.5, TASK-1.10
├── Ex6AscendingSinging.svelte    # TASK-1.4, TASK-1.9
├── Ex7MelodicRecognition.svelte  # TASK-1.13
├── Ex8HarmonicRecognition.svelte # TASK-1.14
└── Ex9IntervalInMelody.svelte    # TASK-1.15
```

---

## Dependencies

### Story Dependencies

| Task | Depends On | Type |
|------|------------|------|
| TASK-1.1 | Story 2.2 (Audio) | Hard |
| TASK-1.2 | TASK-1.1 | Soft (reuses patterns) |
| TASK-1.3 | TASK-1.2 | Soft (sequential flow) |
| TASK-1.4 | TASK-1.3 | Soft (singing flow) |
| TASK-1.5 | TASK-1.4 | Soft (singing flow) |
| TASK-1.6 | TASK-1.5 | Soft (sequential flow) |
| TASK-1.7 | TASK-1.6 | Soft (reuses Ex1) |
| TASK-1.8 | TASK-1.7 | Soft (sequential flow) |
| TASK-1.9 | TASK-1.8 | Soft (singing flow) |
| TASK-1.10 | TASK-1.9 | Soft (singing flow) |
| TASK-1.11 | TASK-1.10 | Soft (sequential flow) |
| TASK-1.12 | TASK-1.11 | Soft (reuses Ex1) |
| TASK-1.13 | TASK-1.12 | Soft (sequential flow) |
| TASK-1.14 | TASK-1.13 | Soft (sequential flow) |
| TASK-1.15 | TASK-1.14 | Soft (sequential flow) |

### Shared Infrastructure Required

| Component | Used By | Status |
|-----------|---------|--------|
| ToneAudioEngine | All tasks | ✅ Complete |
| PitchDetector | TASK-1.3, TASK-1.4, TASK-1.5, TASK-1.9, TASK-1.10, TASK-1.15 | ✅ Complete |
| AnswerButtons | TASK-1.2, TASK-1.6, TASK-1.8, TASK-1.11, TASK-1.13, TASK-1.14 | To implement |
| PitchVisualizer | TASK-1.3, TASK-1.4, TASK-1.5, TASK-1.9, TASK-1.10, TASK-1.15 | To implement |

---

## Progress Tracking

| Task | Status | Completed Date |
|------|--------|---------------|
| TASK-1.1 | ⬜ Pending | - |
| TASK-1.2 | ⬜ Pending | - |
| TASK-1.3 | ⬜ Pending | - |
| TASK-1.4 | ⬜ Pending | - |
| TASK-1.5 | ⬜ Pending | - |
| TASK-1.6 | ⬜ Pending | - |
| TASK-1.7 | ⬜ Pending | - |
| TASK-1.8 | ⬜ Pending | - |
| TASK-1.9 | ⬜ Pending | - |
| TASK-1.10 | ⬜ Pending | - |
| TASK-1.11 | ⬜ Pending | - |
| TASK-1.12 | ⬜ Pending | - |
| TASK-1.13 | ⬜ Pending | - |
| TASK-1.14 | ⬜ Pending | - |
| TASK-1.15 | ⬜ Pending | - |

---

## Definition of Done

Each task must meet the following criteria:

- [ ] Component created following Svelte 5 Runes pattern
- [ ] TypeScript strict mode compliance
- [ ] Unit tests with Vitest (if applicable)
- [ ] Accessible (WCAG Level A)
- [ ] Touch-optimized (44x44px minimum targets)
- [ ] Works offline (PWA)
- [ ] Uses ToneAudioEngine for audio
- [ ] Visual feedback for user actions
- [ ] Error handling for microphone permissions
- [ ] Follows Art Nouveau "Mystical Orient" theme

---

*Generated: 2026-03-22*
