// AudioUtils tests
import { describe, it, expect } from 'vitest';
import {
	noteToFrequency,
	noteToMidi,
	midiToNote,
	frequencyToMidi,
	frequencyToNoteName,
	calculateInterval,
	isNoteInRange,
	getPianoRange,
	formatNote,
	parseNote,
	getChordNotes
} from '../audioUtils';
import type { Note } from '$lib/types';

describe('audioUtils', () => {
	describe('noteToMidi', () => {
		it('should convert C4 to MIDI 60', () => {
			const note: Note = { name: 'C', accidental: '', octave: 4 };
			expect(noteToMidi(note)).toBe(60);
		});

		it('should convert A4 to MIDI 69', () => {
			const note: Note = { name: 'A', accidental: '', octave: 4 };
			expect(noteToMidi(note)).toBe(69);
		});

		it('should convert E2 to MIDI 40', () => {
			const note: Note = { name: 'E', accidental: '', octave: 2 };
			expect(noteToMidi(note)).toBe(40);
		});

		it('should handle sharps', () => {
			const note: Note = { name: 'C', accidental: '#', octave: 4 };
			expect(noteToMidi(note)).toBe(61);
		});

		it('should handle flats', () => {
			const note: Note = { name: 'D', accidental: 'b', octave: 4 };
			expect(noteToMidi(note)).toBe(61);
		});
	});

	describe('noteToFrequency', () => {
		it('should convert A4 to 440Hz', () => {
			const note: Note = { name: 'A', accidental: '', octave: 4 };
			expect(noteToFrequency(note)).toBeCloseTo(440, 1);
		});

		it('should convert C4 (Middle C) to approximately 261.63Hz', () => {
			const note: Note = { name: 'C', accidental: '', octave: 4 };
			expect(noteToFrequency(note)).toBeCloseTo(261.63, 1);
		});
	});

	describe('midiToNote', () => {
		it('should convert MIDI 60 to C4', () => {
			const note = midiToNote(60);
			expect(note.name).toBe('C');
			expect(note.accidental).toBe('');
			expect(note.octave).toBe(4);
		});

		it('should convert MIDI 69 to A4', () => {
			const note = midiToNote(69);
			expect(note.name).toBe('A');
			expect(note.accidental).toBe('');
			expect(note.octave).toBe(4);
		});
	});

	describe('frequencyToMidi', () => {
		it('should convert 440Hz to MIDI 69', () => {
			expect(frequencyToMidi(440)).toBe(69);
		});

		it('should convert 261.63Hz to MIDI 60', () => {
			expect(frequencyToMidi(261.63)).toBe(60);
		});
	});

	describe('calculateInterval', () => {
		it('should calculate perfect fifth as 7 semitones', () => {
			const note1: Note = { name: 'C', accidental: '', octave: 4 };
			const note2: Note = { name: 'G', accidental: '', octave: 4 };
			expect(calculateInterval(note1, note2)).toBe(7);
		});

		it('should calculate octave as 12 semitones', () => {
			const note1: Note = { name: 'C', accidental: '', octave: 4 };
			const note2: Note = { name: 'C', accidental: '', octave: 5 };
			expect(calculateInterval(note1, note2)).toBe(12);
		});

		it('should return absolute value', () => {
			const note1: Note = { name: 'G', accidental: '', octave: 4 };
			const note2: Note = { name: 'C', accidental: '', octave: 4 };
			expect(calculateInterval(note1, note2)).toBe(7);
		});
	});

	describe('isNoteInRange', () => {
		it('should return true for E2', () => {
			const note: Note = { name: 'E', accidental: '', octave: 2 };
			expect(isNoteInRange(note)).toBe(true);
		});

		it('should return true for E5', () => {
			const note: Note = { name: 'E', accidental: '', octave: 5 };
			expect(isNoteInRange(note)).toBe(true);
		});

		it('should return false for D2 (below E2)', () => {
			const note: Note = { name: 'D', accidental: '', octave: 2 };
			expect(isNoteInRange(note)).toBe(false);
		});

		it('should return false for F5 (above E5)', () => {
			const note: Note = { name: 'F', accidental: '', octave: 5 };
			expect(isNoteInRange(note)).toBe(false);
		});
	});

	describe('getPianoRange', () => {
		it('should return notes from E2 to E5', () => {
			const range = getPianoRange();
			expect(range.length).toBeGreaterThan(0);
			expect(range[0].name).toBe('E');
			expect(range[0].octave).toBe(2);
		});

		it('should include all notes in range', () => {
			const range = getPianoRange();
			// Should have 37 notes (E2 to E5)
			expect(range.length).toBe(37);
		});
	});

	describe('formatNote', () => {
		it('should format C4 as "C4"', () => {
			const note: Note = { name: 'C', accidental: '', octave: 4 };
			expect(formatNote(note)).toBe('C4');
		});

		it('should format C#4 as "C#4"', () => {
			const note: Note = { name: 'C', accidental: '#', octave: 4 };
			expect(formatNote(note)).toBe('C#4');
		});

		it('should format Bb5 as "Bb5"', () => {
			const note: Note = { name: 'B', accidental: 'b', octave: 5 };
			expect(formatNote(note)).toBe('Bb5');
		});
	});

	describe('parseNote', () => {
		it('should parse "C4" to Note', () => {
			const note = parseNote('C4');
			expect(note).not.toBeNull();
			expect(note!.name).toBe('C');
			expect(note!.accidental).toBe('');
			expect(note!.octave).toBe(4);
		});

		it('should parse "F#3" to Note', () => {
			const note = parseNote('F#3');
			expect(note).not.toBeNull();
			expect(note!.name).toBe('F');
			expect(note!.accidental).toBe('#');
			expect(note!.octave).toBe(3);
		});

		it('should parse "Bb5" to Note', () => {
			const note = parseNote('Bb5');
			expect(note).not.toBeNull();
			expect(note!.name).toBe('B');
			expect(note!.accidental).toBe('b');
			expect(note!.octave).toBe(5);
		});

		it('should return null for invalid note string', () => {
			expect(parseNote('X4')).toBeNull();
			expect(parseNote('C')).toBeNull();
			expect(parseNote('C10')).toBeNull();
		});
	});

	describe('getChordNotes', () => {
		it('should return C major chord (C, E, G)', () => {
			const root: Note = { name: 'C', accidental: '', octave: 4 };
			const notes = getChordNotes(root, 'major');
			
			expect(notes.length).toBe(3);
			expect(notes[0].name).toBe('C');
			expect(notes[1].name).toBe('E');
			expect(notes[2].name).toBe('G');
		});

		it('should return C minor chord (C, Eb, G)', () => {
			const root: Note = { name: 'C', accidental: '', octave: 4 };
			const notes = getChordNotes(root, 'minor');
			
			expect(notes.length).toBe(3);
			expect(notes[0].name).toBe('C');
			// MIDI 63 = D# (enharmonic to Eb) - function returns sharps
			expect(notes[1].name).toBe('D');
			expect(notes[1].accidental).toBe('#');
			expect(notes[2].name).toBe('G');
		});

		it('should return C dominant 7 chord', () => {
			const root: Note = { name: 'C', accidental: '', octave: 4 };
			const notes = getChordNotes(root, 'dominant7');
			
			expect(notes.length).toBe(4);
			// MIDI 70 = A# (enharmonic to Bb) - function returns sharps
			expect(notes[3].name).toBe('A');
			expect(notes[3].accidental).toBe('#');
		});
	});
});
