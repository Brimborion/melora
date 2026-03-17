---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-02b-vision", "step-02c-executive-summary", "step-03-success", "step-04-journeys", "step-05-domain", "step-06-innovation", "step-07-project-type", "step-08-scoping", "step-09-functional", "step-10-nonfunctional", "step-11-polish"]
inputDocuments: ["/home/charles/Dev/melora/_bmad-output/planning-artifacts/product-brief-melora-2026-02-22.md", "/home/charles/Dev/melora/_bmad-output/project-context.md", "/home/charles/Dev/melora/_bmad-output/brainstorming/brainstorming-session-2026-02-22.md"]
documentCounts: {"briefCount": 1, "researchCount": 0, "brainstormingCount": 1, "projectDocsCount": 2}
classification: {"projectType": "web_app", "domain": "edtech", "complexity": "medium", "projectContext": "greenfield"}
workflowType: "prd"
---

## Executive Summary

### Product Vision

Melora transforms ear training from a tedious technical process into an engaging learning journey through a multicultural musical landscape. The application develops true aural music literacy - the ability to read, write, and understand music through listening alone.

### Differentiator

**Unique Value Proposition:** Innovative combination of gamification with musical contexts, and 5-minute micro-experiences that transform ear training into an engaging journey.

**Key Differentiators:**
- **Contextual Approach:** chapters representing different musical universes
- **Gamification:** Journey map, visual progression, rewards (badges, achievements)
- **Micro-Experiences:** Maximum 5-minute sessions with immediate sense of accomplishment
- **Accessibility:** Full support for blind users (WCAG Level A)

### Target Users

**Primary Personas:**
- **Quentin (16 years old):** Teenage guitarist looking to progress quickly with an engaging interface
- **Gaëlle (23 years old):** Music student needing a structured tool for her studies

---

## Success Criteria

### User Success

**User Outcomes:**
- **Mode Recognition:** 80% of users correctly identify the musical mode within 30 seconds
- **Harmonic Understanding:** 80% of users recognize harmonic progressions in 5 exercises
- **Musical Memorization:** 80% of users complete melodic/dictation exercises with 80% accuracy
- **Musical Transcription:** 80% of users correctly transcribe simple melodies
- **Harmonic Application:** 80% of users can apply learned concepts to understand harmony in songs they hear
- **Confidence Achievement:** Users reach their defined personal confidence level

**Success Moments:**
- **Aha Moments:** 80% of users report improved musical understanding after 14 sessions
- **Harmonic Resolution:** 80% of users intuitively resolve harmonic questions
- **Musical Navigation:** Users can intuitively navigate melodic and harmonic landscapes

### Business Success

**User Growth:**
- **Monthly Growth:** 2 new users per month
- **Cumulative Growth:** 10 active users after 6 months
- **Active Sessions:** 10 active sessions per day

**Engagement:**
- **Average Usage Time:** 10 minutes per session
- **Frequency:** 6 days per week
- **Daily Retention:** 90% of daily active users (DAU/MAU)

**Organic Growth:**
- **Recommendation Rate:** 50% of users recommend Melora
- **Organic Growth:** 20% monthly growth

**Progression:**
- **Chapter Completion Rate:** 80% of users complete each chapter
- **Score Improvement:** 80% average score improvement
- **Time to Mastery:** Average time to master a concept

### Technical Success

**Personal Success Metrics:**
- **Personal Usage:** 100% daily usage by creator
- **Personal Satisfaction:** 7/10 satisfaction rating
- **Successful Sharing:** 10 musicians actively using Melora

### Measurable Outcomes

**Usage Metrics:**
- **Weekly Sessions:** 10 sessions per week
- **Session Length:** 5-15 minutes (optimal for engagement)

**Business Metrics:**
- **Active Users:** 10 after 6 months
- **Active Sessions:** 10 per day

---

## Product Scope

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solution MVP - Solving the fundamental problem of tedious ear training with a minimal yet effective solution

**Resource Requirements:** 1 full-stack developer, 1 UX/UI designer, 1 pedagogical expert (consultant)

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Quentin: Basic interval recognition with immediate feedback
- Gaëlle: Structured exercises for music studies with progress tracking

**Must-Have Capabilities:**
- Basic ear training exercises (intervals, simple chords)
- Clean interface with visible progression
- Pitch detection via Web Audio API (piano only)
- Local progress storage with IndexedDB
- WCAG Level A accessibility
- PWA with offline capability

### Post-MVP Features

**Phase 2 (Post-MVP):**
- More instruments (guitar, violin)
- Additional musical universes (chapters 2-3)
- Enhanced gamification with reward system
- Advanced statistics and reports

**Phase 3 (Expansion):**
- All chapters and levels (complete pedagogical vision)
- Complete universe with musical contexts and challenges
- Community and shared challenges
- Advanced customization

### Risk Mitigation Strategy

**Technical Risks:** Start with a single instrument, use polyfills for Safari, extensive cross-browser testing
**Market Risks:** User testing with real musicians, validate pedagogical approach
**Resource Risks:** Minimum feature set with basic piano-only exercises

---

## User Journeys

### Quentin (16 years old - Teenage Guitarist)

**Goals:** Learn to recognize notes, progress quickly, engaging interface

**User Journey:**
1. **Discovery:** Downloads the app, attracted by the concept
2. **First Session:** Completes his first interval exercise in 5 minutes
3. **Progress:** Views his progress on the map, unlocks chapter 2
4. **Engagement:** Returns daily for daily challenges, earns rewards
5. **Mastery:** Achieves his note recognition goal in 3 months

### Gaëlle (23 years old - Music Student)

**Goals:** Structured tool for studies, progress tracking, accessibility

**User Journey:**
1. **Discovery:** Searches for an ear training tool to complement her studies
2. **Setup:** Configures her initial difficulty level
3. **Study:** Uses structured exercises to prepare for exams
4. **Analysis:** Analyzes her weekly progress statistics
5. **Accessibility:** Uses the app without visual interface thanks to screen reader support

---

## Domain Requirements

### EdTech Specific Requirements

**Accessibility (WCAG 2.1 Level A):**
- Full support for blind users
- Complete keyboard navigation
- ARIA labels for all interactive elements
- WCAG-compliant contrast

**Local Storage:**
- All resources local only (no backend)
- IndexedDB for progress storage
- No user data on external servers

**Privacy:**
- No personal data collected or stored externally
- Explicit consent for microphone usage

---

## Innovation Analysis

### Innovative Features

**Gamification System:**
- Illustrated journey map with visual progression path
- Reward system (achievements, mastery badges)
- User profile customization

**Musical Contexts:**
- Chapters representing different musical universes
- Progression by universe (triad -> pentatonic → hexatonic → tonal → modal)
- Contexts: folk, blues, Celtic, classical, modal, jazz

**Micro-Experiences:**
- Maximum 5-minute sessions
- Immediate sense of accomplishment
- Daily challenges to maintain engagement

---

## Project-Type Requirements

### Web App Specific Requirements

**Browser Support:**
- Chrome 90+, Firefox 88+, Safari 14+
- Web Audio API with full pitch detection support
- Service Workers for PWA

**PWA Features:**
- Native installation (Web App Manifest)
- Complete offline mode
- Push notifications for training reminders

**Responsive Design:**
- Mobile-first with touch optimization
- Desktop with keyboard and mouse support
- Tablet supported

---

## Functional Requirements

### User Management

- FR3: Users can modify their personal preferences
- FR4: Users can view their profile and statistics
- FR6: Users can delete their account
- FR7: Users can choose their initial difficulty level

### Exercise Management

- FR8: Users can access the exercise library
- FR9: Users can filter exercises by type and difficulty
- FR10: Users can launch a training exercise
- FR11: Users can pause and resume an exercise
- FR12: Users can complete an exercise and see their score
- FR13: Users can replay an exercise to improve their score
- FR14: Users can access answer explanations
- FR15: Users can rate an exercise's difficulty

### Audio Processing

- FR16: System can detect pitch sung by the user (±50 cents accuracy)
- FR17: System can analyze the accuracy of notes sung in real-time
- FR18: System can play notes and chords via Web Audio API
- FR19: System can handle multiple audio instruments (piano, guitar, etc.)
- FR20: System can adjust volume and audio balance
- FR21: System can manage user microphone permissions
- FR22: System can detect and handle suspended audio context states

### Progress Tracking

- FR23: System can record scores of completed exercises
- FR24: System can calculate weekly progress statistics
- FR25: System can identify user's strengths and weaknesses
- FR26: System can generate personalized progress reports
- FR27: System can suggest exercises based on performance
- FR28: System can save progress in offline mode
- FR29: System can sync progress when connection is restored
- FR30: System can track chapter and level completion

### Game Experience

- FR31: Users can navigate the musical journey map
- FR32: Users can unlock new chapters by progressing
- FR33: Users can earn rewards (badges, achievements)
- FR34: Users can view their progress on the map
- FR35: Users can access daily challenges
- FR36: Users can customize their profile
- FR37: Users can share their accomplishments
- FR38: Users can access integrated tutorials

### Content Management

- FR39: System can load exercises by chapter and level
- FR40: System can manage different musical contexts (chapters)
- FR41: System can organize exercises by pedagogical progression
- FR42: System can add new exercises and content
- FR43: System can manage translations and localizations
- FR44: System can categorize exercises by type (intervals, chords, etc.)
- FR45: System can generate random exercises based on rules
- FR54: System can present Level 1 exercises for interval recognition
- FR55: System can distinguish between Unison, Octave, Fifth, and Major Third
- FR56: System can play harmonic intervals (simultaneous notes)
- FR57: System can play melodic intervals (successive notes)
- FR58: System can guide users through audiation exercises
- FR59: System can evaluate user's interval identification accuracy
- FR60: System can teach V → I harmonic resolution
- FR61: System can provide ascending and descending interval singing exercises
- FR62: System can assess melodic recognition in context

### Level 1: Intervals & Triads (Chapter 1)

**Level 1 Overview:**
This is the first level of Melora's ear training journey. It introduces fundamental intervals through structured lessons and exercises.

**Learning Objectives:**
- O1: Differentiate by ear: Unison, Octave, Fifth, Major third
- O2: Isolate the notes of a major triad (root, third, fifth)
- O3: Anticipate the resolution of a perfect cadence (V → I)
- O4: Memorize and transcribe a 3-note melody

**Lessons:**
- L1: Unison and Octave - Discovery and audiation
- L2: The Melodic Fifth - Sensations, identification, resolution, singing
- L3: The Harmonic Fifth - Comparison, identification, audiation
- L4: The Melodic Major Third - Sensations, identification, singing
- L5: The Harmonic Major Third - Comparison, identification, audiation
- L6: Synthesis - Assessment and evaluation

**Exercises:**
- Exercise 1: Harmonic Interval Audiation - Imagine each note before singing
- Exercise 2: Melodic Identification - Recognize melodic intervals
- Exercise 3: Harmonic Identification - Recognize harmonic intervals
- Exercise 4: Introduction to Resolution - Feel V → I resolution
- Exercise 5: Descending Interval Singing - Sing descending intervals
- Exercise 6: Ascending Interval Singing - Sing ascending intervals
- Exercise 7: Melodic Recognition - Identify melodic intervals
- Exercise 8: Harmonic Recognition - Identify harmonic intervals
- Exercise 9: Interval in a Melody - Identify intervals in context

### System Management

- FR46: System can manage accessibility preferences (WCAG Level A)
- FR47: System can detect and adapt to browser capabilities
- FR48: System can manage resource caching for offline mode
- FR49: System can manage updates and new versions
- FR50: System can manage permissions and data security
- FR51: System can manage performance and optimizations
- FR52: System can manage errors and automatic recovery
- FR53: System can manage push notifications (when reconnected)

---

## Non-Functional Requirements

### Performance

**Audio Processing:**
- **Pitch detection latency:** < 500ms for real-time pitch detection
- **User interaction response:** < 100ms for all user interactions
- **Animation performance:** 60fps constant for smooth animations
- **Initial load time:** << 2 seconds for first application load

**PWA Performance:**
- **Service worker caching:** All static assets cached for offline use
- **Resource loading:** < 1 second for cached resources

### Accessibility

**WCAG 2.1 Level A Compliance:**
- **Keyboard navigation:** Full keyboard support with visual focus indicators
- **Screen reader support:** Complete ARIA implementation for all interactive elements
- **Color contrast:** Minimum contrast ratios compliant with WCAG standards
- **Alternative text:** All images and visual elements have descriptive alt text
- **Audio transcripts:** All audio content has text transcripts

**Accessibility Features:**
- **High contrast mode:** Support for high contrast display settings
- **Text resizing:** Support for text scaling up to 200%
- **Focus management:** Logical tab order and visible focus indicators

### Reliability

**Offline Capability:**
- **Service worker reliability:** 99.9% uptime for cached resources
- **Offline data persistence:** All user progress saved locally
- **Automatic sync:** Progress synchronization when connection restored

**Error Handling:**
- **Graceful degradation:** System continues to function with degraded features
- **Automatic recovery:** Automatic recovery from common errors
- **User notification:** Clear error messages with recovery instructions

**Audio Reliability:**
- **Audio context management:** Automatic handling of suspended audio contexts
- **Permission management:** Clear microphone permission requests and error handling
