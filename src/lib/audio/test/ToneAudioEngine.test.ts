// ToneAudioEngine tests
// Tests for note mapping and Salamander Sound Library integration
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Tone.js before importing ToneAudioEngine
vi.mock('tone', () => ({
	default: {
		start: vi.fn().mockResolvedValue(undefined),
		getContext: vi.fn(() => ({
			rawContext: { state: 'running' }
		})),
		Volume: vi.fn(() => ({
			toDestination: vi.fn(),
			volume: { value: 0 }
		})),
		Sampler: vi.fn(() => ({
			connect: vi.fn().mockReturnThis(),
			triggerAttackRelease: vi.fn(),
			dispose: vi.fn()
		})),
		gainToDb: vi.fn(() => 0)
	}
}));

import { 
	noteToToneJS, 
	isNoteSupported, 
	getClosestNote,
	SALAMANDER_ATTRIBUTION 
} from '../ToneAudioEngine';
import type { Note } from '$lib/types';

describe('ToneAudioEngine', () => {
	describe('SALAMANDER_ATTRIBUTION', () => {
		it('should include CC-BY-3.0 license attribution', () => {
			expect(SALAMANDER_ATTRIBUTION).toContain('CC-BY-3.0');
			expect(SALAMANDER_ATTRIBUTION).toContain('Salamander Sound Library');
		});
	});

	describe('noteToToneJS', () => {
		it('should convert natural notes correctly', () => {
			const note: Note = { name: 'C', accidental: '', octave: 4 };
			expect(noteToToneJS(note)).toBe('C4');
		});

		it('should convert sharps to s notation', () => {
			const note: Note = { name: 'C', accidental: '#', octave: 4 };
			expect(noteToToneJS(note)).toBe('Cs4');
		});

		it('should convert F# correctly', () => {
			const note: Note = { name: 'F', accidental: '#', octave: 4 };
			expect(noteToToneJS(note)).toBe('Fs4');
		});

		it('should convert D# correctly', () => {
			const note: Note = { name: 'D', accidental: '#', octave: 3 };
			expect(noteToToneJS(note)).toBe('Ds3');
		});

		it('should handle flats', () => {
			const note: Note = { name: 'B', accidental: 'b', octave: 4 };
			expect(noteToToneJS(note)).toBe('Bb4');
		});
	});

	describe('isNoteSupported', () => {
		it('should return true for all notes (Tone.js handles pitch-shifting)', () => {
			const naturalNotes: Note[] = [
				{ name: 'C', accidental: '', octave: 4 },
				{ name: 'D', accidental: '', octave: 4 },
				{ name: 'E', accidental: '', octave: 4 },
				{ name: 'F', accidental: '', octave: 4 },
				{ name: 'G', accidental: '', octave: 4 },
				{ name: 'A', accidental: '', octave: 4 },
				{ name: 'B', accidental: '', octave: 4 },
			];

			for (const note of naturalNotes) {
				expect(isNoteSupported(note)).toBe(true);
			}
		});

		it('should return true for sharps and flats', () => {
			const sharpNote: Note = { name: 'C', accidental: '#', octave: 4 };
			const flatNote: Note = { name: 'B', accidental: 'b', octave: 4 };
			
			expect(isNoteSupported(sharpNote)).toBe(true);
			expect(isNoteSupported(flatNote)).toBe(true);
		});
	});

	describe('getClosestNote', () => {
		describe('notes directly in Salamander (A, C, D#, F#)', () => {
			it('should return A notes unchanged', () => {
				const note: Note = { name: 'A', accidental: '', octave: 4 };
				expect(getClosestNote(note)).toBe('A4');
			});

			it('should return C notes unchanged', () => {
				const note: Note = { name: 'C', accidental: '', octave: 4 };
				expect(getClosestNote(note)).toBe('C4');
			});

			it('should return D# notes unchanged (with # notation)', () => {
				const note: Note = { name: 'D', accidental: '#', octave: 4 };
				expect(getClosestNote(note)).toBe('D#4');
			});

			it('should return F# notes unchanged (with # notation)', () => {
				const note: Note = { name: 'F', accidental: '#', octave: 4 };
				expect(getClosestNote(note)).toBe('F#4');
			});
		});

		describe('notes requiring pitch-shifting', () => {
			it('should map B to C (one octave lower)', () => {
				const note: Note = { name: 'B', accidental: '', octave: 4 };
				expect(getClosestNote(note)).toBe('C3');
			});

			it('should map B2 to C of previous octave', () => {
				const note: Note = { name: 'B', accidental: '', octave: 2 };
				expect(getClosestNote(note)).toBe('C1');
			});

			it('should map D to D#', () => {
				const note: Note = { name: 'D', accidental: '', octave: 4 };
				expect(getClosestNote(note)).toBe('D#4');
			});

			it('should map E to F#', () => {
				const note: Note = { name: 'E', accidental: '', octave: 4 };
				expect(getClosestNote(note)).toBe('F#4');
			});

			it('should map F to F#', () => {
				const note: Note = { name: 'F', accidental: '', octave: 4 };
				expect(getClosestNote(note)).toBe('F#4');
			});

			it('should map G to F#', () => {
				const note: Note = { name: 'G', accidental: '', octave: 4 };
				expect(getClosestNote(note)).toBe('F#4');
			});
		});

		describe('edge cases', () => {
			it('should handle octave 2 notes', () => {
				const note: Note = { name: 'A', accidental: '', octave: 2 };
				expect(getClosestNote(note)).toBe('A2');
			});

			it('should handle octave 5 notes', () => {
				const note: Note = { name: 'C', accidental: '', octave: 5 };
				expect(getClosestNote(note)).toBe('C5');
			});

			it('should map B4 to C of previous octave', () => {
				const note: Note = { name: 'B', accidental: '', octave: 4 };
				expect(getClosestNote(note)).toBe('C3');
			});
		});
	});

	describe('Salamander note coverage', () => {
		// These tests verify the interval exercise can work with Salamander
		// Unison (same note) and Octave (same note, different octave) are the key intervals

		it('should support Unison intervals (same note)', () => {
			// For Unison, both root and target are the same note
			const note: Note = { name: 'C', accidental: '', octave: 4 };
			const mapped = getClosestNote(note);
			
			// Should be directly supported
			expect(mapped).toBe('C4');
		});

		it('should support Octave intervals (same note, different octave)', () => {
			// For Octave, we play the same note name in different octaves
			const root: Note = { name: 'C', accidental: '', octave: 4 };
			const octave: Note = { name: 'C', accidental: '', octave: 5 };
			
			const rootMapped = getClosestNote(root);
			const octaveMapped = getClosestNote(octave);
			
			// Both C4 and C5 are directly available in Salamander
			expect(rootMapped).toBe('C4');
			expect(octaveMapped).toBe('C5');
		});

		it('should support octave intervals with notes that need mapping', () => {
			// Some exercises might use E4 → E5 (an octave)
			const root: Note = { name: 'E', accidental: '', octave: 4 };
			const octave: Note = { name: 'E', accidental: '', octave: 5 };
			
			const rootMapped = getClosestNote(root);
			const octaveMapped = getClosestNote(octave);
			
			// E maps to F#
			expect(rootMapped).toBe('F#4');
			expect(octaveMapped).toBe('F#5');
		});
	});
});
