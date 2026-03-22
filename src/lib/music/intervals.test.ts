// Unit tests for interval utilities
// Part of Story 2-8: Level 1 - Interval Recognition (Unison & Octave)

import { describe, it, expect } from 'vitest';
import {
	UNISON_OCTAVE_INTERVALS,
	INTERVALS,
	getRandomIntervalInSet,
	getRandomRootNote,
	getTargetNote,
	getIntervalDisplayName,
	generateIntervalQuestion,
	generateAudiationQuestion,
	checkIntervalAnswer,
	type IntervalQuestion,
	type AudiationQuestion,
} from '$lib/music/intervals';

describe('Interval Utilities', () => {
	describe('UNISON_OCTAVE_INTERVALS', () => {
		it('should contain P1 and P8 intervals', () => {
			expect(UNISON_OCTAVE_INTERVALS).toContain('P1');
			expect(UNISON_OCTAVE_INTERVALS).toContain('P8');
			expect(UNISON_OCTAVE_INTERVALS).toHaveLength(2);
		});
	});

	describe('INTERVALS', () => {
		it('should have correct semitone values', () => {
			expect(INTERVALS.P1.semitones).toBe(0);
			expect(INTERVALS.P8.semitones).toBe(12);
			expect(INTERVALS.P5.semitones).toBe(7);
			expect(INTERVALS.M3.semitones).toBe(4);
		});

		it('should have correct names', () => {
			expect(INTERVALS.P1.name).toBe('Unison');
			expect(INTERVALS.P8.name).toBe('Octave');
		});
	});

	describe('getRandomIntervalInSet', () => {
		it('should return a random interval from the provided set', () => {
			const result = getRandomIntervalInSet(['P1', 'P8']);
			expect(['P1', 'P8']).toContain(result);
		});

		it('should work with single-item arrays', () => {
			const result = getRandomIntervalInSet(['P1']);
			expect(result).toBe('P1');
		});

		it('should only return intervals from the provided set', () => {
			// Run multiple times to verify it always returns from the set
			for (let i = 0; i < 10; i++) {
				const result = getRandomIntervalInSet(UNISON_OCTAVE_INTERVALS);
				expect(UNISON_OCTAVE_INTERVALS).toContain(result);
			}
		});
	});

	describe('getRandomRootNote', () => {
		it('should return a note in range C3-C5', () => {
			for (let i = 0; i < 20; i++) {
				const note = getRandomRootNote();
				expect(note).toMatch(/^[A-G][3-5]$/);
			}
		});

		it('should return valid note names', () => {
			const validNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
			for (let i = 0; i < 20; i++) {
				const note = getRandomRootNote();
				const noteName = note.slice(0, -1);
				expect(validNotes).toContain(noteName);
			}
		});

		it('should return valid octaves', () => {
			const validOctaves = [3, 4, 5];
			for (let i = 0; i < 20; i++) {
				const note = getRandomRootNote();
				const octave = parseInt(note.slice(-1), 10);
				expect(validOctaves).toContain(octave);
			}
		});
	});

	describe('getTargetNote', () => {
		it('should return the same note for Unison (P1)', () => {
			expect(getTargetNote('C4', 'P1')).toBe('C4');
			expect(getTargetNote('G3', 'P1')).toBe('G3');
			expect(getTargetNote('A5', 'P1')).toBe('A5');
		});

		it('should return octave for P8', () => {
			const result = getTargetNote('C4', 'P8');
			expect(result).toBe('C5');
		});

		it('should handle octave wrapping correctly', () => {
			// B4 + 12 semitones = B5
			expect(getTargetNote('B4', 'P8')).toBe('B5');
			// G4 + 12 semitones = G5
			expect(getTargetNote('G4', 'P8')).toBe('G5');
		});

		it('should handle edge cases with octave boundaries', () => {
			// C5 + 12 semitones should not go below octave 2
			const result = getTargetNote('C5', 'P8');
			expect(result).toMatch(/^[A-G][2-8]$/);
		});
	});

	describe('getIntervalDisplayName', () => {
		it('should return Unison for P1', () => {
			expect(getIntervalDisplayName('P1')).toBe('Unison');
		});

		it('should return Octave for P8', () => {
			expect(getIntervalDisplayName('P8')).toBe('Octave');
		});

		it('should return Perfect Fifth for P5', () => {
			expect(getIntervalDisplayName('P5')).toBe('Perfect Fifth');
		});

		it('should return the key for unknown intervals', () => {
			expect(getIntervalDisplayName('UNKNOWN')).toBe('UNKNOWN');
		});
	});

	describe('generateIntervalQuestion', () => {
		it('should generate a valid interval question', () => {
			const question = generateIntervalQuestion();
			
			expect(question).toBeDefined();
			expect(question.type).toBe('interval');
			expect(['P1', 'P8']).toContain(question.interval);
			expect(['Unison', 'Octave']).toContain(question.intervalName);
			expect(['harmonic', 'melodic']).toContain(question.playbackType);
			expect(question.rootNote).toMatch(/^[A-G][3-5]$/);
			expect(question.targetNote).toMatch(/^[A-G][2-8]$/);
			expect(question.options).toEqual(['Unison', 'Octave']);
			expect(question.correctAnswer).toBe(question.intervalName);
		});

		it('should generate unique IDs', () => {
			const q1 = generateIntervalQuestion();
			const q2 = generateIntervalQuestion();
			expect(q1.id).not.toBe(q2.id);
		});

		it('should always have correct answer match the interval', () => {
			for (let i = 0; i < 20; i++) {
				const question = generateIntervalQuestion();
				if (question.interval === 'P1') {
					expect(question.correctAnswer).toBe('Unison');
				} else if (question.interval === 'P8') {
					expect(question.correctAnswer).toBe('Octave');
				}
			}
		});
	});

	describe('generateAudiationQuestion', () => {
		it('should generate a valid audiation question', () => {
			const question = generateAudiationQuestion();
			
			expect(question).toBeDefined();
			expect(question.type).toBe('audiation');
			expect(question.rootNote).toMatch(/^[A-G][3-5]$/);
			expect(question.targetNote).toMatch(/^[A-G][2-8]$/);
			expect(question.expectedAction).toBe('imagine');
		});

		it('should always generate octave as target', () => {
			for (let i = 0; i < 10; i++) {
				const question = generateAudiationQuestion();
				// Parse the notes and verify target is octave above root
				const rootNote = question.rootNote;
				const targetNote = question.targetNote;
				const rootOctave = parseInt(rootNote.slice(-1), 10);
				const targetOctave = parseInt(targetNote.slice(-1), 10);
				expect(targetOctave - rootOctave).toBe(1);
			}
		});
	});

	describe('checkIntervalAnswer', () => {
		it('should return true for correct Unison answer', () => {
			const question: IntervalQuestion = {
				id: '1',
				type: 'interval',
				interval: 'P1',
				intervalName: 'Unison',
				playbackType: 'harmonic',
				rootNote: 'C4',
				targetNote: 'C4',
				options: ['Unison', 'Octave'],
				correctAnswer: 'Unison',
			};
			
			expect(checkIntervalAnswer(question, 'Unison')).toBe(true);
			expect(checkIntervalAnswer(question, 'unison')).toBe(true);
		});

		it('should return true for correct Octave answer', () => {
			const question: IntervalQuestion = {
				id: '1',
				type: 'interval',
				interval: 'P8',
				intervalName: 'Octave',
				playbackType: 'melodic',
				rootNote: 'C4',
				targetNote: 'C5',
				options: ['Unison', 'Octave'],
				correctAnswer: 'Octave',
			};
			
			expect(checkIntervalAnswer(question, 'Octave')).toBe(true);
			expect(checkIntervalAnswer(question, 'octave')).toBe(true);
		});

		it('should return false for incorrect answers', () => {
			const question: IntervalQuestion = {
				id: '1',
				type: 'interval',
				interval: 'P1',
				intervalName: 'Unison',
				playbackType: 'harmonic',
				rootNote: 'C4',
				targetNote: 'C4',
				options: ['Unison', 'Octave'],
				correctAnswer: 'Unison',
			};
			
			expect(checkIntervalAnswer(question, 'Octave')).toBe(false);
			expect(checkIntervalAnswer(question, 'Fifth')).toBe(false);
		});
	});
});
