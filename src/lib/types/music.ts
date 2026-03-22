// Music types for Melora

// Note names
export type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

// Accidentals
export type Accidental = '' | '#' | 'b';

// Octaves (E2 to C8 range, matching Salamander Sound Library)
export type Octave = 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Musical note representation
 */
export interface Note {
	name: NoteName;
	accidental: Accidental;
	octave: Octave;
}

/**
 * Interval between two notes
 */
export type IntervalName = 
	| 'unison' | 'minor2' | 'major2' | 'minor3' | 'major3' 
	| 'perfect4' | 'tritone' | 'perfect5' | 'minor6' | 'major6' 
	| 'minor7' | 'major7' | 'octave';

export interface Interval {
	name: IntervalName;
	semitones: number;
}

/**
 * Chord types
 */
export type ChordType = 'major' | 'minor' | 'diminished' | 'augmented' | 'dominant7' | 'major7' | 'minor7';

export interface Chord {
	root: Note;
	type: ChordType;
}

/**
 * Musical key
 */
export type KeyName = 'C' | 'G' | 'D' | 'A' | 'E' | 'B' | 'F#' | 'Gb' | 'Db' | 'Ab' | 'Eb' | 'Bb' | 'F';

export interface MusicalKey {
	name: KeyName;
	sharps: number; // positive for sharps, negative for flats
}
