---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
inputDocuments: ["/home/charles/Dev/melora/_bmad-output/planning-artifacts/prd.md", "/home/charles/Dev/melora/_bmad-output/planning-artifacts/architecture.md", "/home/charles/Dev/melora/_bmad-output/planning-artifacts/ux-design-specification.md", "/home/charles/Dev/melora/_bmad-output/planning-artifacts/chapter-1-level-1.md"]
workflowStatus: "complete"
dateCompleted: "2026-03-15"
---

# melora - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for melora, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**User Management (FR3-FR7):**
- FR3: Users can modify their personal preferences
- FR4: Users can view their profile and statistics
- FR6: Users can delete their account
- FR7: Users can choose their initial difficulty level

**Exercise Management (FR8-FR15):**
- FR8: Users can access the exercise library
- FR9: Users can filter exercises by type and difficulty
- FR10: Users can launch a training exercise
- FR11: Users can pause and resume an exercise
- FR12: Users can complete an exercise and see their score
- FR13: Users can replay an exercise to improve their score
- FR14: Users can access answer explanations
- FR15: Users can rate an exercise's difficulty

**Audio Processing (FR16-FR22):**
- FR16: System can detect pitch sung by the user (±50 cents accuracy)
- FR17: System can analyze the accuracy of notes sung in real-time
- FR18: System can play notes and chords via Web Audio API
- FR19: System can handle multiple audio instruments (piano, guitar, etc.)
- FR20: System can adjust volume and audio balance
- FR21: System can manage user microphone permissions
- FR22: System can detect and handle suspended audio context states

**Progress Tracking (FR23-FR30):**
- FR23: System can record scores of completed exercises
- FR24: System can calculate weekly progress statistics
- FR25: System can identify user's strengths and weaknesses
- FR26: System can generate personalized progress reports
- FR27: System can suggest exercises based on performance
- FR28: System can save progress in offline mode
- FR29: System can sync progress when connection is restored
- FR30: System can track chapter and level completion

**Game Experience (FR31-FR38):**
- FR31: Users can navigate the musical journey map
- FR32: Users can unlock new chapters by progressing
- FR33: Users can earn rewards (badges, achievements)
- FR34: Users can view their progress on the map
- FR35: Users can access daily challenges
- FR36: Users can customize their profile
- FR37: Users can share their accomplishments
- FR38: Users can access integrated tutorials

**Content Management (FR39-FR45):**
- FR39: System can load exercises by chapter and level
- FR40: System can manage different musical contexts
- FR41: System can organize exercises by pedagogical progression
- FR42: System can add new exercises and content
- FR43: System can manage translations and localizations
- FR44: System can categorize exercises by type (intervals, chords, etc.)
- FR45: System can generate random exercises based on rules

**Level 1: Intervals & Triads (Chapter 1) (FR54-FR62):**
- FR54: System can present Level 1 exercises for interval recognition
- FR55: System can distinguish between Unison, Octave, Fifth, and Major Third
- FR56: System can play harmonic intervals (simultaneous notes)
- FR57: System can play melodic intervals (successive notes)
- FR58: System can guide users through audiation exercises
- FR59: System can evaluate user's interval identification accuracy
- FR60: System can teach V → I harmonic resolution
- FR61: System can provide ascending and descending interval singing exercises
- FR62: System can assess melodic recognition in context

**System Management (FR46-FR53):**
- FR46: System can manage accessibility preferences (WCAG Level A)
- FR47: System can detect and adapt to browser capabilities
- FR48: System can manage resource caching for offline mode
- FR49: System can manage updates and new versions
- FR50: System can manage permissions and data security
- FR51: System can manage performance and optimizations
- FR52: System can manage errors and automatic recovery
- FR53: System can manage push notifications (when reconnected)

### NonFunctional Requirements

**Performance:**
- Pitch detection latency: < 500ms for real-time pitch detection
- User interaction response: < 100ms for all user interactions
- Animation performance: 60fps constant for smooth animations
- Initial load time: << 2 seconds for first application load
- Service worker caching: All static assets cached for offline use
- Resource loading: < 1 second for cached resources

**Accessibility (WCAG 2.1 Level A):**
- Keyboard navigation: Full keyboard support with visual focus indicators
- Screen reader support: Complete ARIA implementation for all interactive elements
- Color contrast: Minimum 4.5:1 contrast ratios compliant with WCAG standards
- Alternative text: All images and visual elements have descriptive alt text
- Audio transcripts: All audio content has text transcripts
- High contrast mode: Support for high contrast display settings
- Text resizing: Support for text scaling up to 200%
- Focus management: Logical tab order and visible focus indicators

**Reliability:**
- Service worker reliability: 99.9% uptime for cached resources
- Offline data persistence: All user progress saved locally in IndexedDB
- Automatic sync: Progress synchronization when connection restored
- Graceful degradation: System continues to function with degraded features
- Automatic recovery: Automatic recovery from common errors
- User notification: Clear error messages with recovery instructions
- Audio context management: Automatic handling of suspended audio contexts
- Permission management: Clear microphone permission requests and error handling

### Additional Requirements

**From Architecture - Technical Stack:**
- Framework: SvelteKit with TypeScript ^5.x (strict mode)
- Build Tool: Vite ^6.x
- PWA: vite-plugin-pwa ^1.x
- Database: Dexie ^4.x (IndexedDB wrapper) - single instance pattern
- State Management: Svelte 5 Runes ($state, $derived, $effect)
- Testing: Vitest ^3.x, Playwright ^1.50.x
- Styling: Tailwind CSS with custom Art Nouveau design system

**From Architecture - Project Structure:**
- `src/lib/audio/` - Audio engine, sample library (AudioContext singleton)
- `src/lib/db/` - Dexie database, repositories
- `src/lib/game/` - Game logic, levels, scoring
- `src/lib/music/` - Music theory utilities
- `src/lib/stores/` - Svelte stores (state with runes)
- `src/lib/types/` - TypeScript types
- `src/routes/` - SvelteKit routing
- `static/audio/` - Piano samples (pre-cached for offline)
- `tests/` - E2E tests (Playwright)

**From Architecture - Required Patterns:**
- AudioContext singleton pattern (NEVER create at module level)
- Audio services isolated from Svelte components
- Single Dexie instance export from `src/lib/db/database.ts`
- Svelte 5 runes syntax (NOT legacy $: reactive statements)

**From Architecture - Infrastructure:**
- Hosting: Vercel (free tier sufficient)
- Deployment: Git-based automatic CI/CD

**From UX - Design Requirements:**
- Art Nouveau "Mystical Orient" theme with Eastern/Middle-Eastern influences
- Mobile-first responsive design (touch-optimized)
- Desktop support (keyboard and mouse)
- Tablet supported
- Dark background (#1A1A2E) for immersive focus during exercises

**From UX - Color System:**
- Primary: Deep purple (#2D1B4E), Rich gold (#D4AF37)
- Secondary: Teal (#1A5F5F), Burgundy (#722F37)
- Accent: Warm cream (#F5E6D3), Soft rose (#E8B4B8)
- Success: Emerald green (#2ECC71)
- Error: Soft coral (#E74C3C)

**From UX - Typography:**
- Display serif for headings (Playfair Display)
- Clean sans-serif for body text (Inter)

**From UX - Breakpoints:**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

**From UX - Key Components to Build:**
- JourneyMap Component - Visual navigation through musical chapters
- ExerciseCard Component - Display exercise in lists
- AudioPlayer Component - Play musical audio samples
- AnswerButtons Component - Multiple choice answers
- PitchDetector Component - Visualize sung pitch in real-time
- ProgressBar Component - Show progress in exercise and chapter
- BadgeDisplay Component - Show achievements and rewards
- ChapterHeader Component - Thematic header for each musical chapter

**From UX - Interaction Requirements:**
- One-tap exercise launch
- Instant feedback (< 1 second after submission)
- Visible progression after each exercise
- 5-15 minute maximum session length
- Encouraging error messages (never punitive)
- Minimum 44x44px touch targets

**From Chapter 1 Level 1 - Pedagogical Requirements:**
- Level 1 focuses on interval recognition: Unison, Octave, Fifth, Major Third
- 6 Lessons: L1 (Unison/Octave), L2 (Melodic Fifth), L3 (Harmonic Fifth), L4 (Melodic Third), L5 (Harmonic Third), L6 (Assessment)
- 9 Exercises: Detailed descriptions available in [Level 1 - Exercise Specifications](#level-1---exercise-specifications)
- Learning Objectives: O1 (ear differentiation), O2 (major triad notes), O3 (V→I resolution), O4 (3-note melody)
- Audio patterns: Alternating L-H-L and H-L-H for melodic intervals
- Support both harmonic (simultaneous) and melodic (successive) intervals

**From PRD - MVP Scope:**
- Basic ear training exercises (intervals, simple chords)
- Clean interface with visible progression
- Pitch detection via Web Audio API (piano only for MVP)
- Local progress storage with IndexedDB
- WCAG Level A accessibility
- PWA with offline capability
- Single instrument (piano) for MVP

**From PRD - Post-MVP Features:**
- More instruments (guitar, violin)
- Additional musical universes (chapters 2-3)
- Enhanced gamification with reward system
- Advanced statistics and reports

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR3 | Epic 1 | Modify personal preferences |
| FR4 | Epic 1 | View profile and statistics |
| FR6 | Epic 1 | Delete account |
| FR7 | Epic 1 | Choose initial difficulty level |
| FR46 | Epic 1 | Manage accessibility preferences |
| FR47 | Epic 1 | Detect and adapt to browser capabilities |
| FR8 | Epic 2 | Access exercise library |
| FR9 | Epic 2 | Filter exercises by type and difficulty |
| FR10 | Epic 2 | Launch a training exercise |
| FR11 | Epic 2 | Pause and resume an exercise |
| FR12 | Epic 2 | Complete exercise and see score |
| FR13 | Epic 2 | Replay exercise to improve score |
| FR14 | Epic 2 | Access answer explanations |
| FR15 | Epic 2 | Rate exercise difficulty |
| FR16 | Epic 2 | Detect pitch sung by user (±50 cents) |
| FR17 | Epic 2 | Analyze accuracy of notes in real-time |
| FR18 | Epic 2 | Play notes and chords via Web Audio API |
| FR19 | Epic 2 | Handle multiple audio instruments |
| FR20 | Epic 2 | Adjust volume and audio balance |
| FR21 | Epic 2 | Manage microphone permissions |
| FR22 | Epic 2 | Handle suspended audio context states |
| FR23 | Epic 3 | Record scores of completed exercises |
| FR24 | Epic 3 | Calculate weekly progress statistics |
| FR25 | Epic 3 | Identify strengths and weaknesses |
| FR26 | Epic 3 | Generate personalized progress reports |
| FR27 | Epic 3 | Suggest exercises based on performance |
| FR28 | Epic 3 | Save progress in offline mode |
| FR29 | Epic 3 | Sync progress when connection restored |
| FR30 | Epic 3 | Track chapter and level completion |
| FR31 | Epic 4 | Navigate musical journey map |
| FR32 | Epic 4 | Unlock new chapters by progressing |
| FR33 | Epic 4 | Earn rewards (badges, achievements) |
| FR34 | Epic 4 | View progress on map |
| FR35 | Epic 4 | Access daily challenges |
| FR36 | Epic 4 | Customize profile |
| FR37 | Epic 4 | Share accomplishments |
| FR38 | Epic 4 | Access integrated tutorials |
| FR39 | Epic 5 | Load exercises by chapter and level |
| FR40 | Epic 5 | Manage musical contexts (chapters) |
| FR41 | Epic 5 | Organize by pedagogical progression |
| FR42 | Epic 5 | Add new exercises and content |
| FR43 | Epic 5 | Manage translations and localizations |
| FR44 | Epic 5 | Categorize by exercise type |
| FR45 | Epic 5 | Generate random exercises |
| FR46 | Epic 1 | Manage accessibility preferences |
| FR47 | Epic 1 | Detect and adapt to browser capabilities |
| FR48 | Epic 6 | Manage resource caching for offline |
| FR49 | Epic 6 | Manage updates and versions |
| FR50 | Epic 6 | Manage permissions and data security |
| FR51 | Epic 6 | Manage performance and optimizations |
| FR52 | Epic 6 | Manage errors and automatic recovery |
| FR53 | Epic 6 | Manage push notifications |
| FR54 | Epic 2 | Present Level 1 exercises for interval recognition |
| FR55 | Epic 2 | Distinguish Unison, Octave, Fifth, Major Third |
| FR56 | Epic 2 | Play harmonic intervals (simultaneous notes) |
| FR57 | Epic 2 | Play melodic intervals (successive notes) |
| FR58 | Epic 2 | Guide users through audiation exercises |
| FR59 | Epic 2 | Evaluate user's interval identification accuracy |
| FR60 | Epic 2 | Teach V → I harmonic resolution |
| FR61 | Epic 2 | Provide ascending/descending interval singing |
| FR62 | Epic 2 | Assess melodic recognition in context |

## Epic List

### Level 1 - Exercise Specifications

> **Source:** These exercise specifications are derived from [chapter-1-level-1.md](./chapter-1-level-1.md) and serve as the functional breakdown for implementation.

This section provides detailed, unit descriptions for each exercise in Chapter 1: Introduction to Intervals & Triads (Level 1).

---

#### Exercise 1: Harmonic Interval Recognition

**Exercise ID:** Ex1  
**Type:** Multiple choice identification  
**Objective:** Recognize harmonic intervals (Unison or Octave) by ear  

**Description:**  
The system plays two notes simultaneously (harmonic interval). The user identifies whether the interval is a Unison (same note) or Octave (same note, different octave).

**Mechanics:**
1. System plays two notes simultaneously (e.g., C4 + C5 for Octave, or C4 + C4 for Unison)
2. User listens to the harmonic interval
3. User selects: Unison or Octave
4. Feedback is provided (correct/incorrect)

**Parameters:**
- Target intervals: Unison, Octave (Lesson 1)
- Starting notes: Random (not predetermined)
- Occurrences: Randomly generated

**Pedagogical purpose:** Develops recognition of basic harmonic relationships. Foundation for interval identification.

**Stories covering this exercise:** 
- Story 2.8 (L1-PartB): Unison & Octave recognition
- Story 2.8 (L3-PartC): Fifth audiation
- Story 2.8 (L5-PartC): Third audiation

---

#### Exercise 2: Melodic Identification (Alternation)

**Exercise ID:** Ex2  
**Type:** Multiple choice identification  
**Objective:** Recognize melodic intervals through alternation patterns  

**Description:**  
The system plays a three-note pattern alternating Low-High-Low (L-H-L) or High-Low-High (H-L-H). The user identifies the interval between the outer notes.

**Mechanics:**
1. System plays note 1 (Low or High)
2. System plays note 2 (High or Low)
3. System plays note 1 again (alternating)
4. User selects: Unison, Second, Third, Fifth, or Octave

**Parameters:**
- Pattern: L-H-L or H-L-H (alternation)
- Target intervals: Fifth/Octave (Lesson 2), Third/Fifth/Octave (Lesson 4)
- Starting note varies by lesson

**Pedagogical purpose:** Teaches interval recognition in melodic (successive) context. Alternation pattern helps isolate the interval.

**Stories covering this exercise:** Story 2.9 (L2), Story 2.10 (L4)

---

#### Exercise 3: Harmonic Identification (Alternation)

**Exercise ID:** Ex3  
**Type:** Multiple choice identification  
**Objective:** Recognize harmonic intervals through alternation patterns  

**Description:**  
Similar to Ex2 but for harmonic intervals. Two notes are played simultaneously, then the pattern alternates between simultaneous and melodic presentations.

**Mechanics:**
1. System plays both notes simultaneously (harmonic)
2. System plays notes melodically (H-L-H or L-H-L pattern)
3. System plays both notes simultaneously again
4. User identifies: Unison, Second, Third, Fifth, or Octave

**Parameters:**
- Pattern: L-H-L or H-L-H alternation
- Target intervals: Fifth/Octave/Unison (Lesson 3), Third/Fifth/Octave/Unison (Lesson 5)
- Notes: Random from C, F, G, D, A

**Pedagogical purpose:** Develops harmonic interval recognition. The alternation between harmonic and melodic helps reinforce the interval's sound.

**Stories covering this exercise:** Story 2.8 (L1)

---

#### Exercise 4: Introduction to Resolution

**Exercise ID:** Ex4  
**Type:** Active singing  
**Objective:** Feel and produce the V → I harmonic resolution  

**Description:**  
The system plays a dominant chord or arpeggio that naturally wants to resolve to the tonic. The user sings the root note to complete the resolution.

**Mechanics:**
1. System plays melody containing V chord (e.g., C-E-G-G with G as dominant)
2. System pauses before resolution
3. User sings the tonic note (e.g., C)
4. System plays the resolution
5. User feels the satisfying V → I resolution

**Parameters:**
- Starting notes: C, F, G, D, A
- Patterns: C-E-G-G, C-C-G-G, F-A-C-C, G-G-D-D, D-A-D-D
- Target: Root note of the tonic chord

**Pedagogical purpose:** Introduces harmonic function and resolution. Builds understanding of tension and release in harmony.

**Stories covering this exercise:** Story 2.9 (L2), Story 2.11 (L2-L3)

---

#### Exercise 5: Descending Interval Singing

**Exercise ID:** Ex5  
**Type:** Active singing with pitch detection  
**Objective:** Accurately sing descending intervals  

**Description:**  
The system plays a starting note, then the user sings the descending interval (top note down to bottom note), and finally the system plays both notes to confirm.

**Mechanics:**
1. System plays starting note (e.g., G)
2. User sings the descending interval (e.g., G-C-G)
3. System evaluates pitch accuracy (±50 cents tolerance)
4. System plays full descending pattern for confirmation

**Parameters:**
- Interval: Fifth (L2), Third (L4)
- Starting notes: Random from available range
- Patterns: G-C-G (descending fifth), E-C-E (descending third)

**Pedagogical purpose:** Develops vocal accuracy for descending intervals. Builds muscle memory for interval distances.

**Stories covering this exercise:** Story 2.9 (L2), Story 2.10 (L4)

---

#### Exercise 6: Ascending Interval Singing

**Exercise ID:** Ex6  
**Type:** Active singing with pitch detection  
**Objective:** Accurately sing ascending intervals  

**Description:**  
The system plays a starting note, then the user sings the ascending interval (bottom note up to top note), and finally the system plays both notes to confirm.

**Mechanics:**
1. System plays starting note (e.g., C)
2. User sings the ascending interval (e.g., C-G-C)
3. System evaluates pitch accuracy (±50 cents tolerance)
4. System plays full ascending pattern for confirmation

**Parameters:**
- Interval: Fifth (L2), Third (L4)
- Starting notes: Random from available range
- Patterns: C-G-C (ascending fifth), C-E-C (ascending third)

**Pedagogical purpose:** Develops vocal accuracy for ascending intervals. Complements Exercise 5 for complete interval mastery.

**Stories covering this exercise:** Story 2.9 (L2), Story 2.10 (L4)

---

#### Exercise 7: Melodic Recognition

**Exercise ID:** Ex7  
**Type:** Multiple choice assessment  
**Objective:** Identify melodic intervals with varying starting notes  

**Description:**  
The system plays two notes melodically (one after another). The user identifies the interval. Unlike Ex2, starting notes vary randomly to test true recognition.

**Mechanics:**
1. System plays first note (random pitch within range)
2. System plays second note
3. User selects: Unison, Third, Fifth, or Octave

**Parameters:**
- Starting notes: Random (F, G, D, A)
- Target intervals: Third, Fifth, Octave, Unison
- Assessment mode: Varying starting notes

**Pedagogical purpose:** Assesses interval recognition without pattern hints. Tests true melodic interval perception.

**Stories covering this exercise:** Story 2.8 (L1), Story 2.12 (L6 Assessment)

---

#### Exercise 8: Harmonic Recognition

**Exercise ID:** Ex8  
**Type:** Multiple choice assessment  
**Objective:** Identify harmonic intervals with varying starting notes  

**Description:**  
The system plays two notes simultaneously (harmonic). The user identifies the interval. Unlike Ex3, starting notes vary randomly to test true recognition.

**Mechanics:**
1. System plays both notes simultaneously
2. User selects: Unison, Third, Fifth, or Octave

**Parameters:**
- Starting notes: Random (F, G, D, A)
- Target intervals: Third, Fifth, Octave, Unison
- Assessment mode: Simultaneous presentation

**Pedagogical purpose:** Assesses harmonic interval recognition. Tests ability to perceive simultaneous pitch relationships.

**Stories covering this exercise:** Story 2.8 (L1), Story 2.12 (L6 Assessment)

---

#### Exercise 9: Interval in a Melody

**Exercise ID:** Ex9  
**Type:** Melodic completion with singing  
**Objective:** Identify and sing the missing interval in a melodic context  

**Description:**  
The system plays the beginning of a melody (two notes) and the user must complete it with the third note that forms the correct interval for the phrase.

**Mechanics:**
1. System plays two notes of a pattern (e.g., C-E-...)
2. User sings the missing third note (e.g., G)
3. System evaluates pitch accuracy
4. System plays the complete melody

**Parameters:**
- Patterns: C-E-... (complete with G), F-A-... (complete with C), G-B-... (complete with D), D-F-... (complete with A), A-C-... (complete with E)
- Target: Forms complete major triad or fifth

**Pedagogical purpose:** Tests interval recognition in melodic context. Combines identification and production skills.

**Stories covering this exercise:** Story 2.12 (L6 Assessment)

---

### Epic 1: User Setup & Preferences
**Goal:** Users can configure their experience and manage their account settings.
**FRs covered:** FR3, FR4, FR6, FR7, FR46, FR47
**User Outcome:** Users can create their profile, set their difficulty level, customize accessibility options, and manage their account.

#### Story 1.0: Project Setup from Starter Template
**As a** developer,
**I want** to initialize the project using the SvelteKit starter template,
**So that** I can have a ready-to-develop base with all dependencies installed.

**Acceptance Criteria:**

**Given** the architecture specifies SvelteKit with TypeScript
**When** the developer runs the setup command (`pnpx sv create melora --template=minimal --types=ts`)
**Then** the project is created with all dependencies
**And** the project compiles without errors

**Given** the project is created
**When** the developer configures Tailwind CSS and vite-plugin-pwa
**Then** the PWA is functional with offline capability
**And** Dexie is installed for IndexedDB

**Given** the project structure is set up
**When** the developer follows the architecture patterns (AudioContext singleton, Dexie single instance, Svelte 5 runes)
**Then** the foundation is ready for story implementation
**And** no technical debt is introduced

#### Story 1.1: Initial User Setup
**As a** new user,
**I want** to set my initial preferences when first using the app,
**So that** I can have a personalized experience from the start.

**Acceptance Criteria:**

**Given** the user opens the app for the first time
**When** they set their difficulty level and accessibility preferences
**Then** the preferences are saved to local storage
**And** future sessions use these saved preferences

**Given** the user has set initial preferences
**When** they return to the app
**Then** they see the main journey map with their chosen settings applied

#### Story 1.2: Profile Viewing
**As a** user,
**I want** to view my profile and statistics,
**So that** I can see my progress and achievements at a glance.

**Acceptance Criteria:**

**Given** the user has completed exercises
**When** they navigate to their profile
**Then** they see their total exercises completed, average score, and current streak

**Given** the user views their profile
**When** they scroll to statistics
**Then** they see weekly progress, chapter completion status, and badges earned

#### Story 1.3: Preference Modification
**As a** user,
**I want** to modify my personal preferences anytime,
**So that** I can adjust the app to suit my changing needs.

**Acceptance Criteria:**

**Given** the user is in the settings page
**When** they change accessibility settings (high contrast, text size)
**Then** the changes apply immediately across the app

**Given** the user changes their difficulty level
**When** they confirm the change
**Then** subsequent exercises reflect the new difficulty

#### Story 1.4: Account Deletion
**As a** user,
**I want** to delete my account and all associated data,
**So that** I can remove my personal information from the app.

**Acceptance Criteria:**

**Given** the user is in settings
**When** they navigate to account deletion
**Then** they see a confirmation dialog explaining what will be deleted

**Given** the user confirms deletion
**When** the deletion process completes
**Then** all local data (progress, preferences, scores) is cleared
**And** the user is returned to the initial setup screen

### Epic 2: Exercise & Audio System
**Goal:** Users can complete ear training exercises with real-time audio feedback.
**FRs covered:** FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR54, FR55, FR56, FR57, FR58, FR59, FR60, FR61, FR62
**User Outcome:** Users can browse exercises, start/pause/resume exercises, hear audio samples, detect pitch, and receive immediate feedback. Level 1 specific: Users can recognize Unison, Octave, Fifth, and Major Third intervals through melodical and harmonic exercises.

#### Story 2.1: Exercise Library Access
**As a** user,
**I want** to browse and access the exercise library,
**So that** I can discover available ear training exercises.

**Acceptance Criteria:**

**Given** the user opens the app
**When** they navigate to the exercise library
**Then** they see a list of available exercises organized by type
**And** each exercise shows its name, difficulty level, and chapter

**Given** the user is viewing the exercise library
**When** they filter by exercise type (intervals, chords, melodies)
**Then** only exercises matching the selected type are displayed
**And** the filter persists during the session

#### Story 2.2: Audio Playback System (Tone.js + Salamander)
**As a** user,
**I want** to hear musical notes and chords played through the app,
**So that** I can identify musical elements by ear.

**Acceptance Criteria:**

**Given** the exercise requires playing a note
**When** the user taps the play button
**Then** the note plays via Tone.js with < 100ms response time
**And** the Salamander piano samples are used for high-quality audio

**Given** the user adjusts the volume slider
**When** they move the slider
**Then** the audio volume changes in real-time
**And** the volume preference is saved for future sessions

**Given** the user is on their first session
**When** they trigger audio for the first time
**Then** Tone.js requests AudioContext permission
**And** the Salamander samples begin loading
**And** a loading indicator shows progress

**Given** the user plays multiple notes quickly
**When** they trigger notes in succession
**Then** Tone.js handles polyphony efficiently
**And** notes overlap naturally

**Technical Implementation:**
- Use `Tone.Sampler` with Salamander samples
- Samples URL: `https://tonejs.github.io/audio/salamander/`
- Note range: E2 to E5 (matching original MVP)
- Attribution: CC-BY-3.0 (Salamander Sound Library by Alexander Holm)

**Dependencies:**
- `tone` package ^15.x

#### Story 2.3: Exercise Launch and Completion
**As a** user,
**I want** to launch and complete an exercise,
**So that** I can train my ear and receive feedback.

**Acceptance Criteria:**

**Given** the user selects an exercise from the library
**When** they tap to start
**Then** the exercise loads within 1 second
**And** instructions are displayed clearly

**Given** the user has answered all questions
**When** they complete the exercise
**Then** they see their score immediately
**And** the score is saved to their progress

#### Story 2.4: Exercise Pause and Resume
**As a** user,
**I want** to pause and resume an exercise,
**So that** I can take breaks without losing my progress.

**Acceptance Criteria:**

**Given** the user is in the middle of an exercise
**When** they tap the pause button
**Then** the exercise state is saved
**And** the user can resume from exactly where they left off

**Given** the user resumes a paused exercise
**When** they tap resume
**Then** all previous answers and progress are restored
**And** they continue from the same question

#### Story 2.5: Real-time Pitch Detection
**As a** user,
**I want** to sing notes and have the app detect my pitch,
**So that** I can practice vocal ear training.

**Acceptance Criteria:**

**Given** the user grants microphone permission
**When** they start pitch detection
**Then** the app detects their sung note within 500ms
**And** displays the detected pitch with ±50 cents accuracy

**Given** the user is singing
**When** the detected pitch matches the target
**Then** the app provides positive feedback
**And** if not matching, shows encouraging guidance

#### Story 2.6: Microphone Permission Handling
**As a** user,
**I want** the app to clearly request and handle microphone permissions,
**So that** I can use pitch detection features.

**Acceptance Criteria:**

**Given** the user accesses a feature requiring microphone
**When** they have not yet granted permission
**Then** a clear permission request dialog appears

**Given** the user denies microphone permission
**When** they try to use pitch detection
**Then** a helpful message explains how to enable it in browser settings

**Given** the browser suspends the audio context
**When** the user interacts with the app
**Then** the audio context is automatically resumed
**And** the user can continue without errors

#### Story 2.7: Exercise Replay and Explanations
**As a** user,
**I want** to replay exercises and see explanations,
**So that** I can improve my understanding.

**Acceptance Criteria:**

**Given** the user completed an exercise
**When** they tap replay
**Then** the exercise restarts with new random questions
**And** previous answers do not affect the new attempt

**Given** the user answers incorrectly
**When** they view the explanation
**Then** they see a clear explanation of the correct answer
**And** the explanation is encouraging, not punitive

#### Story 2.8: Level 1 - Interval Recognition (Unison & Octave)
**As a** beginner user,
**I want** to learn to recognize Unison and Octave intervals,
**So that** I can develop my foundational ear training skills.

**Acceptance Criteria:**

**Given** the user starts Lesson 1
**When** they hear a harmonic interval (two notes played simultaneously)
**Then** the system plays Unison and Octave examples
**And** the user can replay each example

**Given** the user is in Exercise 1 (Audiation)
**When** the system plays a reference note
**Then** the user imagines the octave note before hearing it
**And** the system confirms correct audiation

**Given** the user is in Exercise 3 (Harmonic Identification)
**When** the system plays Unison or Octave
**Then** the user can correctly identify the interval
**And** feedback is provided for each answer

**Lessons covered:** L1 (Unison and Octave), L3 (Harmonic Fifth - Part B)
**Exercises covered (Sequential Implementation Order):**
- **TASK-1.1** - [Exercise 1: Harmonic Interval Audiation](#exercise-1-harmonic-interval-audiation) (L1-PartB, Octave only)
- **TASK-1.6** - [Exercise 3: Harmonic Identification](#exercise-3-harmonic-identification-alternation) (L3-PartB, Fifth/Octave/Unison)
- **TASK-1.13** - [Exercise 7: Melodic Recognition](#exercise-7-melodic-recognition) (L6-PhaseA, Assessment)
- **TASK-1.14** - [Exercise 8: Harmonic Recognition](#exercise-8-harmonic-recognition) (L6-PhaseB, Assessment)

**Implementation Reference:** See [sprint-backlog-chapter-1-level-1.md](./sprint-backlog-chapter-1-level-1.md)

#### Story 2.9: Level 1 - Interval Recognition (Fifth)
**As a** user,
**I want** to learn to recognize the Perfect Fifth interval,
**So that** I can distinguish it from other intervals.

**Acceptance Criteria:**

**Given** the user starts Lesson 2
**When** they hear C followed by G
**Then** the system explains the "fifth" sensation (stability, completeness)

**Given** the user is in Exercise 2 (Melodic Identification)
**When** the system plays a melodic pattern
**Then** the user identifies if it's a Fifth or Octave
**And** the pattern alternates between Low-High-Low and High-Low-High

**Given** the user is in Exercise 4 (Introduction to Resolution)
**When** the system plays C-E-G-G (V-I cadence)
**Then** the user sings the root note C
**And** feels the V→I resolution

**Given** the user is in Exercise 5 & 6 (Descending/Ascending Singing)
**When** the system gives a starting note
**Then** the user sings the Fifth interval
**And** the system evaluates pitch accuracy

**Lessons covered:** L2 (The Melodic Fifth), L3 (The Harmonic Fifth)
**Exercises covered (Sequential Implementation Order):**
- **TASK-1.2** - [Exercise 2: Melodic Identification](#exercise-2-melodic-identification-alternation) (L2-PartB, Fifth/Octave)
- **TASK-1.3** - [Exercise 4: Introduction to Resolution](#exercise-4-introduction-to-resolution) (L2-PartC)
- **TASK-1.4** - [Exercise 6: Ascending Singing](#exercise-6-ascending-interval-singing) (L2-PartD, Fifth)
- **TASK-1.5** - [Exercise 5: Descending Singing](#exercise-5-descending-interval-singing) (L2-PartE, Fifth)
- **TASK-1.6** - [Exercise 3: Harmonic Identification](#exercise-3-harmonic-identification-alternation) (L3-PartB, Fifth/Octave/Unison)
- **TASK-1.7** - [Exercise 1: Audiation](#exercise-1-harmonic-interval-audiation) (L3-PartC, Fifth)

**Implementation Reference:** See [sprint-backlog-chapter-1-level-1.md](./sprint-backlog-chapter-1-level-1.md)

#### Story 2.10: Level 1 - Interval Recognition (Major Third)
**As a** user,
**I want** to learn to recognize the Major Third interval,
**So that** I can complete the basic interval recognition set.

**Acceptance Criteria:**

**Given** the user starts Lesson 4
**When** they hear C followed by E
**Then** the system explains the "joyful" sensation of the Major Third

**Given** the user is in Exercise 2 (Melodic Identification)
**When** the system plays Third/Fifth/Octave patterns
**Then** the user identifies the correct interval
**And** receives feedback on each answer

**Given** the user is in Exercise 5 & 6 (Singing)
**When** the system gives a starting note
**Then** the user sings the Major Third interval ascending and descending
**And** the system evaluates accuracy

**Lessons covered:** L4 (The Melodic Major Third), L5 (The Harmonic Major Third)
**Exercises covered (Sequential Implementation Order):**
- **TASK-1.8** - [Exercise 2: Melodic Identification](#exercise-2-melodic-identification-alternation) (L4-PartB, Third/Fifth/Octave)
- **TASK-1.9** - [Exercise 6: Ascending Singing](#exercise-6-ascending-interval-singing) (L4-PartC, Third)
- **TASK-1.10** - [Exercise 5: Descending Singing](#exercise-5-descending-interval-singing) (L4-PartD, Third)
- **TASK-1.11** - [Exercise 3: Harmonic Identification](#exercise-3-harmonic-identification-alternation) (L5-PartB, All intervals)
- **TASK-1.12** - [Exercise 1: Audiation](#exercise-1-harmonic-interval-audiation) (L5-PartC, Third)

**Implementation Reference:** See [sprint-backlog-chapter-1-level-1.md](./sprint-backlog-chapter-1-level-1.md)

#### Story 2.11: Level 1 - Harmonic Resolution (V→I)
**As a** user,
**I want** to understand harmonic resolution (V→I),
**So that** I can feel how chords resolve in music.

**Acceptance Criteria:**

**Given** the user is in Exercise 4
**When** the system plays C-E-G-G
**Then** the user identifies G as the note to sing
**And** feels the resolution from dominant to tonic

**Given** the system plays various V→I progressions
**When** the user sings the root note
**Then** the accuracy is evaluated
**And** encouraging feedback is provided

**Lessons covered:** L2 (The Melodic Fifth), L3 (The Harmonic Fifth)
**Exercises covered (Sequential Implementation Order):**
- **TASK-1.3** - [Exercise 4: Introduction to Resolution](#exercise-4-introduction-to-resolution) (L2-PartC)

**Implementation Reference:** See [sprint-backlog-chapter-1-level-1.md](./sprint-backlog-chapter-1-level-1.md)

#### Story 2.12: Level 1 - Assessment & Synthesis
**As a** user,
**I want** to complete the Level 1 assessment,
**So that** I can demonstrate my interval recognition skills.

**Acceptance Criteria:**

**Given** the user completes Lessons 1-5
**When** they start Lesson 6 (Synthesis)
**Then** they see Exercise 7, 8, and 9

**Given** the user is in Exercise 7 (Melodic Recognition)
**When** the system plays a melodic interval
**Then** the user identifies Third, Fifth, Octave, or Unison
**And** the starting note varies randomly

**Given** the user is in Exercise 8 (Harmonic Recognition)
**When** the system plays harmonic intervals
**Then** the user identifies the interval
**And** receives a final score

**Given** the user is in Exercise 9 (Interval in Melody)
**When** the system plays C-E-...
**Then** the user completes with G (forming a triad)
**And** demonstrates melodic context understanding

**Given** all exercises are completed
**When** the user finishes Level 1
**Then** the level is marked as complete
**And** progress is saved to IndexedDB
**And** Chapter 1 completion is tracked

**Lessons covered:** L6 (Synthesis - Assessment)
**Exercises covered (Sequential Implementation Order):**
- **TASK-1.13** - [Exercise 7: Melodic Recognition](#exercise-7-melodic-recognition) (L6-PhaseA)
- **TASK-1.14** - [Exercise 8: Harmonic Recognition](#exercise-8-harmonic-recognition) (L6-PhaseB)
- **TASK-1.15** - [Exercise 9: Interval in Melody](#exercise-9-interval-in-a-melody) (L6-PhaseC)

**Implementation Reference:** See [sprint-backlog-chapter-1-level-1.md](./sprint-backlog-chapter-1-level-1.md)

### Epic 3: Progress Tracking
**Goal:** Users can track their musical development and view detailed statistics.
**FRs covered:** FR23, FR24, FR25, FR26, FR27, FR28, FR29, FR30
**User Outcome:** Users can see their scores, view progress statistics, understand strengths/weaknesses, and receive personalized exercise suggestions.

#### Story 3.1: Score Recording
**As a** user,
**I want** my exercise scores to be automatically recorded,
**So that** I can track my performance over time.

**Acceptance Criteria:**

**Given** the user completes an exercise
**When** they submit their final answer
**Then** the score is calculated and saved to IndexedDB
**And** the save operation works offline

#### Story 3.2: Progress Statistics
**As a** user,
**I want** to view my weekly progress statistics,
**So that** I can see how my skills are developing.

**Acceptance Criteria:**

**Given** the user has completed multiple exercises
**When** they view their statistics
**Then** they see total exercises, average score, and time spent this week
**And** the data is calculated from local storage

#### Story 3.3: Strengths and Weaknesses Analysis
**As a** user,
**I want** to understand my strengths and weaknesses,
**So that** I can focus my training on areas needing improvement.

**Acceptance Criteria:**

**Given** the user has completed at least 10 exercises
**When** they view their analysis
**Then** exercises are categorized by performance (strong/weak areas)
**And** specific exercise types are identified

#### Story 3.4: Chapter and Level Completion Tracking
**As a** user,
**I want** to see my completion status for chapters and levels,
**So that** I know how far I've progressed.

**Acceptance Criteria:**

**Given** the user completes all exercises in a level
**When** the last exercise is submitted
**Then** the level is marked as complete
**And** the chapter progress is updated

#### Story 3.5: Offline Progress Saving
**As a** user,
**I want** my progress to be saved even without internet,
**So that** I can train offline.

**Acceptance Criteria:**

**Given** the user is offline
**When** they complete an exercise
**Then** all progress is saved to IndexedDB
**And** no error messages appear

#### Story 3.6: Progress Sync (Post-MVP)
**As a** user,
**I want** my progress to sync when I'm back online,
**So that** my data is preserved across devices.

**Acceptance Criteria:**

**Given** the user was offline and completed exercises
**When** the connection is restored
**Then** the app detects the restored connection
**And** indicates sync status to the user

### Epic 4: Gamification & Journey
**Goal:** Users can enjoy an engaging musical journey with rewards and progression.
**FRs covered:** FR31, FR32, FR33, FR34, FR35, FR36, FR37, FR38
**User Outcome:** Users can navigate the journey map, unlock chapters, earn badges, complete daily challenges, and share achievements.

#### Story 4.1: Journey Map Navigation
**As a** user,
**I want** to navigate the musical journey map,
**So that** I can see my progress and explore available content.

**Acceptance Criteria:**

**Given** the user opens the app
**When** they view the journey map
**Then** they see all chapters displayed
**And** completed, in-progress, and locked chapters are visually distinguished

**Given** the user taps on an available chapter
**When** they navigate to it
**Then** the chapter exercises are displayed

#### Story 4.2: Chapter Unlocking
**As a** user,
**I want** to unlock new chapters by progressing,
**So that** I have goals to work towards.

**Acceptance Criteria:**

**Given** the user completes enough exercises in Chapter 1
**When** they reach the required score threshold
**Then** Chapter 2 is unlocked
**And** a celebration animation plays

**Given** the user tries to access a locked chapter
**When** they tap on it
**Then** a message shows the requirements to unlock

#### Story 4.3: Rewards and Achievements
**As a** user,
**I want** to earn rewards and badges,
**So that** I feel motivated and recognized for my progress.

**Acceptance Criteria:**

**Given** the user achieves a milestone
**When** the condition is met
**Then** a badge is awarded
**And** a celebration animation plays

**Given** the user views their profile
**When** they scroll to achievements
**Then** they see all earned and locked badges

#### Story 4.4: Daily Challenges
**As a** user,
**I want** to access daily challenges,
**So that** I can maintain my engagement with regular practice.

**Acceptance Criteria:**

**Given** it's a new day
**When** the user opens the app
**Then** a daily challenge is available
**And** it resets at midnight local time

**Given** the user completes the daily challenge
**When** they submit their answers
**Then** they receive bonus points
**And** a streak counter is updated

#### Story 4.5: Profile Customization
**As a** user,
**I want** to customize my profile,
**So that** I can express my identity.

**Acceptance Criteria:**

**Given** the user is in profile settings
**When** they choose a display name
**Then** it appears throughout the app

**Given** the user selects an avatar
**When** they save the change
**Then** the avatar displays in their profile

#### Story 4.6: Tutorial Access
**As a** user,
**I want** to access integrated tutorials,
**So that** I can learn how to use the app.

**Acceptance Criteria:**

**Given** the user is new
**When** they open the app
**Then** a brief tutorial explains the main features

**Given** the user needs help
**When** they tap the help button
**Then** contextual help is displayed

### Epic 5: Content Management
**Goal:** The system can organize and deliver musical content across chapters.
**FRs covered:** FR39, FR40, FR41, FR42, FR43, FR44, FR45
**User Outcome:** Users can access exercises organized by chapter, difficulty, and musical context with proper pedagogical progression.

#### Story 5.1: Exercise Loading by Chapter/Level
**As a** user,
**I want** exercises to load based on chapter and level,
**So that** I can access appropriate content for my skill level.

**Acceptance Criteria:**

**Given** the user selects a chapter
**When** they choose a level
**Then** exercises for that level are loaded
**And** exercises are ordered by pedagogical progression

#### Story 5.2: Musical Context Management
**As a** user,
**I want** exercises organized by musical context,
**So that** I can learn within different musical styles.

**Acceptance Criteria:**

**Given** the user is in the folk chapter
**When** they view exercises
**Then** exercises use folk musical examples

**Given** the user progresses to jazz chapter
**When** they access exercises
**Then** jazz musical context is applied

#### Story 5.3: Exercise Categorization
**As a** user,
**I want** exercises categorized by type,
**So that** I can focus on specific skills.

**Acceptance Criteria:**

**Given** the user filters by "intervals"
**When** they apply the filter
**Then** only interval exercises are shown

**Given** the user filters by "chords"
**When** they apply the filter
**Then** only chord exercises are displayed

#### Story 5.4: Random Exercise Generation
**As a** user,
**I want** exercises to be randomly generated,
**So that** I can practice with varied content.

**Acceptance Criteria:**

**Given** the user starts an exercise
**When** questions are generated
**Then** questions are randomly selected from the pool
**And** the same exercise type has different variations each time

#### Story 5.5: Content Localization (Post-MVP)
**As a** user,
**I want** the app in my language,
**So that** I can understand all content.

**Acceptance Criteria:**

**Given** the user sets their language preference
**When** they select a language
**Then** all UI text updates to that language

### Epic 6: System Infrastructure
**Goal:** The application is reliable, performant, and works offline.
**FRs covered:** FR48, FR49, FR50, FR51, FR52, FR53
**User Outcome:** Users can use the app offline, receive automatic updates, and experience reliable performance with graceful error handling.

#### Story 6.1: Offline Resource Caching
**As a** user,
**I want** the app to work offline,
**So that** I can practice without internet.

**Acceptance Criteria:**

**Given** the user has used the app before
**When** they open it offline
**Then** all previously cached resources load
**And** the app is fully functional

**Given** the user is online
**When** they use the app
**Then** new resources are cached for offline use
**And** the cache is updated automatically

#### Story 6.2: App Updates
**As a** user,
**I want** the app to update automatically,
**So that** I always have the latest features.

**Acceptance Criteria:**

**Given** a new version is available
**When** the user next opens the app
**Then** the new version is loaded
**And** user progress is preserved

#### Story 6.3: Error Handling and Recovery
**As a** user,
**I want** the app to handle errors gracefully,
**So that** I can continue without frustration.

**Acceptance Criteria:**

**Given** an error occurs
**When** the error is handled
**Then** a clear, encouraging message is shown
**And** the user can continue their session

**Given** a recoverable error happens
**When** the recovery is attempted
**Then** the app automatically recovers
**And** the user may or may not notice the issue

#### Story 6.4: Performance Optimization
**As a** user,
**I want** the app to be fast and responsive,
**So that** I have a smooth experience.

**Acceptance Criteria:**

**Given** the user interacts with the app
**When** they tap any button
**Then** response time is under 100ms

**Given** animations are playing
**When** they run
**Then** they maintain 60fps

#### Story 6.5: Push Notifications (Post-MVP)
**As a** user,
**I want** to receive training reminders,
**So that** I don't miss my practice sessions.

**Acceptance Criteria:**

**Given** the user has enabled notifications
**When** it's time for a reminder
**Then** a notification is sent
**And** tapping it opens the app

---

## Summary

### Epic Count: 6

| Epic | Stories | FRs Covered |
|------|---------|--------------|
| Epic 1: User Setup & Preferences | 5 | FR3, FR4, FR6, FR7, FR46, FR47 |
| Epic 2: Exercise & Audio System | 7 | FR8-FR15, FR16-FR22 |
| Epic 3: Progress Tracking | 6 | FR23-FR30 |
| Epic 4: Gamification & Journey | 6 | FR31-FR38 |
| Epic 5: Content Management | 5 | FR39-FR45 |
| Epic 6: System Infrastructure | 5 | FR48-FR53 |

**Total Stories: 34**

**Post-MVP Stories标记:**
- Story 3.6: Progress Sync (Post-MVP)
- Story 5.5: Content Localization (Post-MVP)
- Story 6.5: Push Notifications (Post-MVP)

---

## Chapter 1 Level 1 - Sprint Implementation Reference

> **Reference Documents:**
> - [sprint-backlog-chapter-1-level-1.md](./sprint-backlog-chapter-1-level-1.md)
> - [sprint-status.yaml](../../implementation-artifacts/sprint-status.yaml)

### Sequential Task Order (15 Tasks)

| # | Task ID | Story | Exercise | Lesson Part | Status |
|---|---------|-------|----------|-------------|--------|
| 1 | TASK-1.1 | 2.8 | Ex1 (Audiation) | L1-PartB | ⬜ Pending |
| 2 | TASK-1.2 | 2.9 | Ex2 (Melodic ID) | L2-PartB | ⬜ Pending |
| 3 | TASK-1.3 | 2.9, 2.11 | Ex4 (Resolution) | L2-PartC | ⬜ Pending |
| 4 | TASK-1.4 | 2.9 | Ex6 (Ascending) | L2-PartD | ⬜ Pending |
| 5 | TASK-1.5 | 2.9 | Ex5 (Descending) | L2-PartE | ⬜ Pending |
| 6 | TASK-1.6 | 2.8, 2.9 | Ex3 (Harmonic ID) | L3-PartB | ⬜ Pending |
| 7 | TASK-1.7 | 2.9 | Ex1 (Audiation) | L3-PartC | ⬜ Pending |
| 8 | TASK-1.8 | 2.10 | Ex2 (Melodic ID) | L4-PartB | ⬜ Pending |
| 9 | TASK-1.9 | 2.10 | Ex6 (Ascending) | L4-PartC | ⬜ Pending |
| 10 | TASK-1.10 | 2.10 | Ex5 (Descending) | L4-PartD | ⬜ Pending |
| 11 | TASK-1.11 | 2.10 | Ex3 (Harmonic ID) | L5-PartB | ⬜ Pending |
| 12 | TASK-1.12 | 2.10 | Ex1 (Audiation) | L5-PartC | ⬜ Pending |
| 13 | TASK-1.13 | 2.12 | Ex7 (Melodic Rec) | L6-PhaseA | ⬜ Pending |
| 14 | TASK-1.14 | 2.12 | Ex8 (Harmonic Rec) | L6-PhaseB | ⬜ Pending |
| 15 | TASK-1.15 | 2.12 | Ex9 (In Melody) | L6-PhaseC | ⬜ Pending |

### Story to Task Mapping

| Story | Tasks |
|-------|-------|
| Story 2.8 | TASK-1.1, TASK-1.6, TASK-1.13, TASK-1.14 |
| Story 2.9 | TASK-1.2, TASK-1.3, TASK-1.4, TASK-1.5, TASK-1.6, TASK-1.7 |
| Story 2.10 | TASK-1.8, TASK-1.9, TASK-1.10, TASK-1.11, TASK-1.12 |
| Story 2.11 | TASK-1.3 |
| Story 2.12 | TASK-1.13, TASK-1.14, TASK-1.15 |

### Component Reuse Strategy

| Component | Used in Tasks | Reuse Type |
|-----------|--------------|------------|
| Ex1Audiation.svelte | TASK-1.1, TASK-1.7, TASK-1.12 | Full reuse (configurable) |
| Ex2MelodicIdentification.svelte | TASK-1.2, TASK-1.8 | Extended (add Third) |
| Ex3HarmonicIdentification.svelte | TASK-1.6, TASK-1.11 | Extended (add Third) |
| Ex4Resolution.svelte | TASK-1.3 | New |
| Ex5DescendingSinging.svelte | TASK-1.5, TASK-1.10 | Extended (add Third) |
| Ex6AscendingSinging.svelte | TASK-1.4, TASK-1.9 | Extended (add Third) |
| Ex7MelodicRecognition.svelte | TASK-1.13 | New |
| Ex8HarmonicRecognition.svelte | TASK-1.14 | New |
| Ex9IntervalInMelody.svelte | TASK-1.15 | New |

---

**All validations complete!** [C] Complete Workflow

