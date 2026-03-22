// Interval utilities for Unison and Octave interval recognition
// Part of Story 2-8: Level 1 - Interval Recognition (Unison & Octave)

import type { NoteName, Accidental, Octave } from '../types';

/**
 * Supported intervals for Level 1 (Unison & Octave)
 */
export const UNISON_OCTAVE_INTERVALS = ['P1', 'P8'] as const;
export type UnisonOctaveInterval = typeof UNISON_OCTAVE_INTERVALS[number];

/**
 * Interval definitions with semitone values
 */
export const INTERVALS: Record<string, { name: string; semitones: number }> = {
	P1: { name: 'Unison', semitones: 0 },
	P8: { name: 'Octave', semitones: 12 },
	P5: { name: 'Perfect Fifth', semitones: 7 },
	M3: { name: 'Major Third', semitones: 4 },
	// Future intervals for other levels
	m3: { name: 'Minor Third', semitones: 3 },
	M2: { name: 'Major Second', semitones: 2 },
	m2: { name: 'Minor Second', semitones: 1 },
	P4: { name: 'Perfect Fourth', semitones: 5 },
};

/**
 * Note indexes for calculating target notes
 */
const NOTE_INDEXES: Record<NoteName, number> = {
	'C': 0,
	'D': 2,
	'E': 4,
	'F': 5,
	'G': 7,
	'A': 9,
	'B': 11,
};

/**
 * Index to note name mapping
 */
const INDEX_NOTES: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Get a random interval from a specific set of intervals
 * @param intervals - Array of interval keys (e.g., ['P1', 'P8'])
 * @returns Random interval key from the set
 */
export function getRandomIntervalInSet(intervals: readonly string[]): string {
	const index = Math.floor(Math.random() * intervals.length);
	return intervals[index];
}

/**
 * Get a random root note within comfortable singing range (C3-C5)
 * @returns Random note string (e.g., 'C4', 'F3', 'A5')
 */
export function getRandomRootNote(): string {
	const notes: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
	const octaves: Octave[] = [3, 4, 5];

	const note = notes[Math.floor(Math.random() * notes.length)];
	const octave = octaves[Math.floor(Math.random() * octaves.length)];

	return `${note}${octave}`;
}

/**
 * Calculate the target note given a root note and interval
 * @param rootNote - Root note string (e.g., 'C4')
 * @param interval - Interval key (e.g., 'P1', 'P8')
 * @returns Target note string (e.g., 'C5' for octave)
 */
export function getTargetNote(rootNote: string, interval: string): string {
	// Parse root note
	const note = rootNote.slice(0, -1) as NoteName;
	const octave = parseInt(rootNote.slice(-1), 10);

	// Get semitones for the interval
	const semitones = INTERVALS[interval]?.semitones ?? 0;

	// Calculate target note index and octave
	const rootIndex = NOTE_INDEXES[note] ?? 0;
	const targetIndex = (rootIndex + semitones) % 12;
	const targetOctave = octave + Math.floor((rootIndex + semitones) / 12);

	// Handle edge case where octave would be below 2
	const finalOctave = Math.max(2, Math.min(8, targetOctave)) as Octave;

	return `${INDEX_NOTES[targetIndex]}${finalOctave}`;
}

/**
 * Get display name for an interval
 * @param interval - Interval key (e.g., 'P1', 'P8')
 * @returns Human-readable name (e.g., 'Unison', 'Octave')
 */
export function getIntervalDisplayName(interval: string): string {
	return INTERVALS[interval]?.name ?? interval;
}

/**
 * Type for interval playback type
 */
export type IntervalType = 'harmonic' | 'melodic';

/**
 * Interval question interface
 */
export interface IntervalQuestion {
	id: string;
	type: 'interval';
	interval: string; // 'P1' or 'P8'
	intervalName: 'Unison' | 'Octave';
	playbackType: IntervalType; // harmonic or melodic
	rootNote: string; // e.g., 'C4'
	targetNote: string; // e.g., 'C5' for octave
	options: string[]; // ['Unison', 'Octave']
	correctAnswer: string;
}

/**
 * Audiation question interface for Exercise 1
 */
export interface AudiationQuestion {
	id: string;
	type: 'audiation';
	rootNote: string;
	targetNote: string; // Octave above
	expectedAction: 'imagine'; // User imagines the pitch
}

/**
 * Generate a random interval question for Unison/Octave
 * @returns IntervalQuestion with random interval, notes, and playback type
 */
export function generateIntervalQuestion(): IntervalQuestion {
	// Random interval from Unison/Octave set
	const interval = getRandomIntervalInSet(UNISON_OCTAVE_INTERVALS);

	// Random root note in comfortable range
	const rootNote = getRandomRootNote();

	// Calculate target note
	const targetNote = getTargetNote(rootNote, interval);

	// Random playback type (harmonic or melodic)
	const playbackType: IntervalType = Math.random() > 0.5 ? 'harmonic' : 'melodic';

	return {
		id: crypto.randomUUID(),
		type: 'interval',
		interval,
		intervalName: interval === 'P1' ? 'Unison' : 'Octave',
		playbackType,
		rootNote,
		targetNote,
		options: ['Unison', 'Octave'],
		correctAnswer: interval === 'P1' ? 'Unison' : 'Octave',
	};
}

/**
 * Generate an audiation question for Exercise 1
 * @returns AudiationQuestion for mental pitch matching
 */
export function generateAudiationQuestion(): AudiationQuestion {
	const rootNote = getRandomRootNote();
	const targetNote = getTargetNote(rootNote, 'P8');

	return {
		id: crypto.randomUUID(),
		type: 'audiation',
		rootNote,
		targetNote,
		expectedAction: 'imagine',
	};
}

/**
 * Check if an answer is correct for an interval question
 * @param question - The interval question
 * @param answer - User's answer
 * @returns Whether the answer was correct
 */
export function checkIntervalAnswer(question: IntervalQuestion, answer: string): boolean {
	return question.correctAnswer.toLowerCase() === answer.toLowerCase();
}
