// Audio utility functions for Melora

import type { Note, NoteName, Accidental, Octave } from '../types';

/**
 * Convert a note to its frequency in Hz
 * Uses A4 = 440Hz as reference (standard tuning)
 * Formula: f = 440 * 2^((n-69)/12) where n is the MIDI note number
 */
export function noteToFrequency(note: Note): number {
	const midiNumber = noteToMidi(note);
	return 440 * Math.pow(2, (midiNumber - 69) / 12);
}

/**
 * Convert a note to its MIDI note number
 * C4 = 60, A4 = 69
 */
export function noteToMidi(note: Note): number {
	const noteOffsets: Record<NoteName, number> = {
		'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
	};
	
	const accidentalOffsets: Record<Accidental, number> = {
		'': 0, '#': 1, 'b': -1
	};
	
	const baseNote = noteOffsets[note.name];
	const accidental = accidentalOffsets[note.accidental];
	const octaveOffset = (note.octave - 4) * 12; // C4 = 60
	
	return 60 + baseNote + accidental + octaveOffset;
}

/**
 * Convert frequency to MIDI note number
 */
export function frequencyToMidi(frequency: number): number {
	return Math.round(69 + 12 * Math.log2(frequency / 440));
}

/**
 * Convert MIDI note number to note
 */
export function midiToNote(midiNumber: number): Note {
	const noteNames: NoteName[] = ['C', 'C', 'D', 'D', 'E', 'F', 'F', 'G', 'G', 'A', 'A', 'B'];
	const accidentals: Accidental[] = ['', '#', '', '#', '', '', '#', '', '#', '', '#', ''];
	
	const noteIndex = midiNumber % 12;
	const octave = Math.floor(midiNumber / 12) - 1;
	
	return {
		name: noteNames[noteIndex],
		accidental: accidentals[noteIndex],
		octave: octave as Octave
	};
}

/**
 * Get note name from frequency
 */
export function frequencyToNoteName(frequency: number): string {
	const midi = frequencyToMidi(frequency);
	const note = midiToNote(midi);
	return `${note.name}${note.accidental}${note.octave}`;
}

/**
 * Calculate the interval between two notes in semitones
 */
export function calculateInterval(note1: Note, note2: Note): number {
	return Math.abs(noteToMidi(note1) - noteToMidi(note2));
}

/**
 * Check if a note is within the supported piano range (E2 to E5)
 */
export function isNoteInRange(note: Note): boolean {
	const midi = noteToMidi(note);
	const e2Midi = noteToMidi({ name: 'E', accidental: '', octave: 2 as Octave });
	const e5Midi = noteToMidi({ name: 'E', accidental: '', octave: 5 as Octave });
	return midi >= e2Midi && midi <= e5Midi;
}

/**
 * Get all notes in the piano range (E2 to E5)
 */
export function getPianoRange(): Note[] {
	const notes: Note[] = [];
	const noteNames: NoteName[] = ['C', 'C', 'D', 'D', 'E', 'F', 'F', 'G', 'G', 'A', 'A', 'B'];
	const accidentals: Accidental[] = ['', '#', '', '#', '', '', '#', '', '#', '', '#', ''];
	
	for (let octave = 2; octave <= 5; octave++) {
		for (let i = 0; i < 12; i++) {
			// Skip notes below E2
			if (octave === 2 && i < 4) continue;
			// Skip notes above E5
			if (octave === 5 && i > 4) break;
			
			notes.push({
				name: noteNames[i],
				accidental: accidentals[i],
				octave: octave as Octave
			});
		}
	}
	
	return notes;
}

/**
 * Format a note for display
 */
export function formatNote(note: Note): string {
	return `${note.name}${note.accidental}${note.octave}`;
}

/**
 * Parse a note string (e.g., "C4", "F#3", "Bb5") into a Note object
 */
export function parseNote(noteString: string): Note | null {
	const match = noteString.match(/^([A-G])([#b]?)(-?\d+)$/);
	if (!match) return null;
	
	const [, name, accidental, octaveStr] = match;
	const octave = parseInt(octaveStr, 10) as Octave;
	
	// Validate octave range (2-7 to match Salamander Sound Library)
	if (octave < 2 || octave > 7) return null;
	
	return {
		name: name as NoteName,
		accidental: (accidental || '') as Accidental,
		octave
	};
}

/**
 * Get chord notes for a given root and chord type
 */
export function getChordNotes(
	root: Note, 
	type: 'major' | 'minor' | 'diminished' | 'augmented' | 'dominant7' | 'major7' | 'minor7'
): Note[] {
	const rootMidi = noteToMidi(root);
	
	const intervals: Record<typeof type, number[]> = {
		'major': [0, 4, 7],
		'minor': [0, 3, 7],
		'diminished': [0, 3, 6],
		'augmented': [0, 4, 8],
		'dominant7': [0, 4, 7, 10],
		'major7': [0, 4, 7, 11],
		'minor7': [0, 3, 7, 10]
	};
	
	return intervals[type].map(interval => midiToNote(rootMidi + interval));
}
