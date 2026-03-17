// Music theory utilities for intervals, notes, and chords

import type { Note, NoteName, Accidental, Octave, Interval, IntervalName, Chord, ChordType } from '../types';

/**
 * All note names in chromatic order
 */
const NOTE_NAMES: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/**
 * Map of note names to their semitone values (C = 0)
 */
const NOTE_TO_SEMITONE: Record<NoteName, number> = {
	'C': 0,
	'D': 2,
	'E': 4,
	'F': 5,
	'G': 7,
	'A': 9,
	'B': 11
};

/**
 * Get semitone value for a note
 */
export function getSemitone(note: Note): number {
	let semitone = NOTE_TO_SEMITONE[note.name];
	
	// Apply accidental
	if (note.accidental === '#') {
		semitone += 1;
	} else if (note.accidental === 'b') {
		semitone -= 1;
	}
	
	// Apply octave (12 semitones per octave)
	semitone += (note.octave - 2) * 12;
	
	return semitone;
}

/**
 * Calculate interval between two notes
 */
export function getInterval(note1: Note, note2: Note): Interval {
	const semitone1 = getSemitone(note1);
	const semitone2 = getSemitone(note2);
	const semitones = Math.abs(semitone2 - semitone1) % 12;
	
	const intervalName = semitonesToIntervalName(semitones);
	
	return {
		name: intervalName,
		semitones
	};
}

/**
 * Convert semitones to interval name
 */
function semitonesToIntervalName(semitones: number): IntervalName {
	switch (semitones) {
		case 0: return 'unison';
		case 1: return 'minor2';
		case 2: return 'major2';
		case 3: return 'minor3';
		case 4: return 'major3';
		case 5: return 'perfect4';
		case 6: return 'tritone';
		case 7: return 'perfect5';
		case 8: return 'minor6';
		case 9: return 'major6';
		case 10: return 'minor7';
		case 11: return 'major7';
		default: return 'octave';
	}
}

/**
 * Get interval by name
 */
export function getIntervalByName(name: IntervalName): Interval {
	const intervals: Record<IntervalName, Interval> = {
		'unison': { name: 'unison', semitones: 0 },
		'minor2': { name: 'minor2', semitones: 1 },
		'major2': { name: 'major2', semitones: 2 },
		'minor3': { name: 'minor3', semitones: 3 },
		'major3': { name: 'major3', semitones: 4 },
		'perfect4': { name: 'perfect4', semitones: 5 },
		'tritone': { name: 'tritone', semitones: 6 },
		'perfect5': { name: 'perfect5', semitones: 7 },
		'minor6': { name: 'minor6', semitones: 8 },
		'major6': { name: 'major6', semitones: 9 },
		'minor7': { name: 'minor7', semitones: 10 },
		'major7': { name: 'major7', semitones: 11 },
		'octave': { name: 'octave', semitones: 12 }
	};
	
	return intervals[name];
}

/**
 * Get all notes in a chord
 */
export function getChordNotes(root: Note, type: ChordType): Note[] {
	const rootSemitone = getSemitone(root);
	
	const chordIntervals: Record<ChordType, number[]> = {
		'major': [0, 4, 7],
		'minor': [0, 3, 7],
		'diminished': [0, 3, 6],
		'augmented': [0, 4, 8],
		'dominant7': [0, 4, 7, 10],
		'major7': [0, 4, 7, 11],
		'minor7': [0, 3, 7, 10]
	};
	
	const intervals = chordIntervals[type];
	
	return intervals.map(interval => {
		const semitone = (rootSemitone + interval) % 12;
		return semitoneToNote(semitone, root.octave);
	});
}

/**
 * Convert semitone to note
 */
function semitoneToNote(semitone: number, octave: Octave): Note {
	const normalizedSemitone = ((semitone % 12) + 12) % 12;
	const newOctave = octave + Math.floor(semitone / 12);
	
	const noteMap: { semitone: number; name: NoteName; accidental: Accidental }[] = [
		{ semitone: 0, name: 'C', accidental: '' },
		{ semitone: 1, name: 'C', accidental: '#' },
		{ semitone: 2, name: 'D', accidental: '' },
		{ semitone: 3, name: 'D', accidental: '#' },
		{ semitone: 4, name: 'E', accidental: '' },
		{ semitone: 5, name: 'F', accidental: '' },
		{ semitone: 6, name: 'F', accidental: '#' },
		{ semitone: 7, name: 'G', accidental: '' },
		{ semitone: 8, name: 'G', accidental: '#' },
		{ semitone: 9, name: 'A', accidental: '' },
		{ semitone: 10, name: 'A', accidental: '#' },
		{ semitone: 11, name: 'B', accidental: '' }
	];
	
	const noteInfo = noteMap.find(n => n.semitone === normalizedSemitone)!;
	
	return {
		name: noteInfo.name,
		accidental: noteInfo.accidental,
		octave: newOctave as Octave
	};
}

/**
 * Create a chord from root and type
 */
export function createChord(root: Note, type: ChordType): Chord {
	return { root, type };
}

/**
 * Get all note names
 */
export function getNoteNames(): NoteName[] {
	return [...NOTE_NAMES];
}

/**
 * All interval names for randomization
 */
const INTERVAL_NAMES: IntervalName[] = [
	'unison', 'minor2', 'major2', 'minor3', 'major3',
	'perfect4', 'tritone', 'perfect5', 'minor6', 'major6',
	'minor7', 'major7', 'octave'
];

/**
 * Get a random interval name
 */
export function getRandomInterval(): IntervalName {
	const index = Math.floor(Math.random() * INTERVAL_NAMES.length);
	return INTERVAL_NAMES[index];
}

/**
 * Get interval options for multiple choice questions
 */
export function getIntervalOptions(): string[] {
	// Return a shuffled copy of interval names
	const options = [...INTERVAL_NAMES];
	for (let i = options.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[options[i], options[j]] = [options[j], options[i]];
	}
	return options;
}

/**
 * Get human-readable interval description
 */
export function getIntervalDescription(intervalName: string): string {
	const descriptions: Record<string, string> = {
		'unison': 'Two notes played at the same pitch. This is the same note repeated.',
		'minor2': 'A half-step difference. Think of the first two notes in "Jaws" theme.',
		'major2': 'A whole step. Common in many melodies like "Happy Birthday" (first two notes).',
		'minor3': 'A sad or melancholic interval. The opening of "Greensleeves".',
		'major3': 'A happy, bright interval. Think of the first two notes of "Kumbaya".',
		'perfect4': 'A strong, stable interval. "Here Comes the Bride" starts with this.',
		'tritone': 'The "devil in music" - three whole steps. Creates tension and unease.',
		'perfect5': 'Very consonant and stable. The "Star Wars" theme begins with this.',
		'minor6': 'A slightly melancholic interval. Think of the theme from "Love Story".',
		'major6': 'A bright, cheerful interval. "My Bonnie Lies Over the Ocean" begins here.',
		'minor7': 'A jazzy, bluesy sound. The first two notes of "Somewhere".',
		'major7': 'Creates tension wanting to resolve. The "Superman" theme starts here.',
		'octave': 'The same note, one register higher or lower. "Somewhere Over the Rainbow".'
	};
	return descriptions[intervalName] || `The ${intervalName} interval.`;
}

/**
 * Get musical context for an interval
 */
export function getIntervalMusicalContext(intervalName: string): string {
	const contexts: Record<string, string> = {
		'unison': 'Often used in drone music and monophonic melodies. Creates unity and stability.',
		'minor2': 'Creates a sense of unease or mystery. Common in horror movies.',
		'major2': 'Foundation of the major scale. Very common in Western music.',
		'minor3': 'Defines minor chords. The "sad" quality in music comes from this interval.',
		'major3': 'Defines major chords. Creates brightness and happiness in music.',
		'perfect4': 'Used in power chords. Very stable, often resolves to a fifth.',
		'tritone': 'The most dissonant interval. Used for dramatic tension and evil-sounding music.',
		'perfect5': 'The most consonant interval after unison and octave. Foundation of power chords.',
		'minor6': 'Adds a touch of melancholy to otherwise major-sounding passages.',
		'major6': 'Common in jazz and classical. Adds sophistication to melodies.',
		'minor7': 'Dominant 7th chord foundation. Essential in blues and jazz.',
		'major7': 'Creates a dreamy, jazzy sound. Common in bossa nova and smooth jazz.',
		'octave': 'Doubles a melody an octave higher or lower. Adds richness without changing pitch.'
	};
	return contexts[intervalName] || 'An important interval in music theory.';
}

/**
 * Format interval name for display (convert snake_case to Title Case)
 */
export function formatIntervalName(intervalName: string): string {
	return intervalName
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, str => str.toUpperCase())
		.trim();
}
