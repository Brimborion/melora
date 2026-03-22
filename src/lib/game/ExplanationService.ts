// Explanation Service - Provides encouraging explanations for exercise answers
// Handles musical context and learning guidance for users

import { 
	getIntervalDescription, 
	getIntervalMusicalContext, 
	formatIntervalName 
} from '$lib/music/theory';
import type { ExerciseType } from '$lib/types/game';

/**
 * Explanation interface
 */
export interface Explanation {
	id: string;
	exerciseType: ExerciseType;
	correctAnswer: string;
	userAnswer: string;
	wasCorrect: boolean;
	title: string;
	description: string;
	musicalContext: string;
	encouragingNote: string;
	relatedLevels?: string[];
}

/**
 * Get encouraging note based on performance
 */
function getEncouragingNote(wasCorrect: boolean, score: number): string {
	if (wasCorrect) {
		const notes = [
			'Excellent work! Your ear is getting sharper!',
			'Perfect! Keep up the great practice!',
			'Brilliant! You\'re mastering this interval!',
			'Fantastic! Your musical ear is developing well!'
		];
		return notes[Math.floor(Math.random() * notes.length)];
	}
	
	// Encouraging notes for incorrect answers
	if (score >= 70) {
		const notes = [
			'Great effort! You\'re almost there. Keep practicing!',
			'Good try! A little more practice and you\'ll nail it!',
			'Nice try! Your ear is improving with each attempt!',
			'Keep at it! Every practice makes you better!'
		];
		return notes[Math.floor(Math.random() * notes.length)];
	} else if (score >= 50) {
		const notes = [
			'Good effort! Keep practicing - you\'re making progress!',
			'Nice try! Regular practice will help you master this.',
			'Great start! The more you practice, the easier it becomes.',
			'Keep going! Your musical ear is developing with each exercise.'
		];
		return notes[Math.floor(Math.random() * notes.length)];
	} else {
		const notes = [
			'Don\'t give up! Even the best musicians started somewhere.',
			'Practice makes perfect! Keep at it and you\'ll improve.',
			'Every expert was once a beginner. Keep practicing!',
			'Your musical journey is just beginning. Stay patient!'
		];
		return notes[Math.floor(Math.random() * notes.length)];
	}
}

/**
 * Get related practice levels for further learning
 */
function getRelatedLevels(exerciseType: ExerciseType): string[] {
	switch (exerciseType) {
		case 'interval-identification':
			return ['2-8', '2-9', '2-10'];
		case 'interval-recognition-unison-octave':
			return ['2-9', '2-10', '2-11'];
		case 'audiation':
			return ['2-8', '2-9', '2-10'];
		case 'harmonic-identification':
			return ['2-8', '2-11', '2-12'];
		case 'melodic-identification':
			return ['2-8', '2-9', '2-12'];
		case 'note-identification':
			return ['2-1', '2-8', '2-9'];
		case 'chord-identification':
			return ['2-1', '2-2', '2-3'];
		case 'melody-repetition':
			return ['2-3', '2-4', '2-5'];
		case 'pitch-comparison':
			return ['2-5', '2-6', '2-8'];
		default:
			return ['2-1', '2-2', '2-3'];
	}
}

/**
 * Get explanation for an interval answer
 */
function getIntervalExplanation(
	correctAnswer: string,
	userAnswer: string,
	wasCorrect: boolean,
	score: number
): Explanation {
	const formattedCorrect = formatIntervalName(correctAnswer);
	const formattedUser = formatIntervalName(userAnswer);
	
	return {
		id: crypto.randomUUID(),
		exerciseType: 'interval-identification',
		correctAnswer: formattedCorrect,
		userAnswer: wasCorrect ? formattedCorrect : formattedUser,
		wasCorrect,
		title: wasCorrect 
			? `${formattedCorrect} - Correct!` 
			: `The answer was ${formattedCorrect}`,
		description: getIntervalDescription(correctAnswer),
		musicalContext: getIntervalMusicalContext(correctAnswer),
		encouragingNote: getEncouragingNote(wasCorrect, score),
		relatedLevels: getRelatedLevels('interval-identification')
	};
}

/**
 * Get explanation for Unison/Octave interval answers
 */
function getUnisonOctaveExplanation(
	correctAnswer: string,
	userAnswer: string,
	wasCorrect: boolean,
	score: number
): Explanation {
	const intervalDescriptions: Record<string, string> = {
		'Unison': 'Unison means two notes played at exactly the same pitch. Think of a choir singing the same note - no harmony, just pure unity.',
		'Octave': 'An octave is the same note one register higher or lower. The note has the same "color" but at a different pitch. Think of "Somewhere Over the Rainbow".'
	};

	const intervalContexts: Record<string, string> = {
		'Unison': 'Unison is the most consonant interval - it\'s literally the same pitch! It creates perfect unity in music and is often used for drone effects or group singing.',
		'Octave': 'Octaves are found everywhere in music. They add richness to melodies without changing the pitch relationship. Pianos span multiple octaves for this reason.'
	};

	const formattedCorrect = correctAnswer;
	const formattedUser = userAnswer;

	return {
		id: crypto.randomUUID(),
		exerciseType: 'interval-recognition-unison-octave',
		correctAnswer: formattedCorrect,
		userAnswer: wasCorrect ? formattedCorrect : formattedUser,
		wasCorrect,
		title: wasCorrect 
			? `${formattedCorrect} - Correct!` 
			: `The answer was ${formattedCorrect}`,
		description: intervalDescriptions[correctAnswer] || getIntervalDescription(correctAnswer.toLowerCase()),
		musicalContext: intervalContexts[correctAnswer] || getIntervalMusicalContext(correctAnswer.toLowerCase()),
		encouragingNote: getEncouragingNote(wasCorrect, score),
		relatedLevels: getRelatedLevels('interval-recognition-unison-octave')
	};
}

/**
 * Get explanation for a chord answer
 */
function getChordExplanation(
	correctAnswer: string,
	userAnswer: string,
	wasCorrect: boolean,
	score: number
): Explanation {
	const chordDescriptions: Record<string, string> = {
		'major': 'Major chords sound bright, happy, and stable. Think of the opening of "Joy to the World".',
		'minor': 'Minor chords sound sad, dark, or melancholic. Think of the opening of "Greensleeves".',
		'diminished': 'Diminished chords create tension and unease. They want to resolve to another chord.',
		'augmented': 'Augmented chords have a mysterious, dreamy quality. They create forward motion.',
		'dominant7': 'Dominant 7th chords have a bluesy, jazzy sound. Essential in jazz and blues.',
		'major7': 'Major 7th chords sound dreamy and sophisticated. Popular in smooth jazz.',
		'minor7': 'Minor 7th chords have a soft, mellow jazz sound.'
	};
	
	const chordContexts: Record<string, string> = {
		'major': 'Major chords form the foundation of Western music. Most pop songs use major chords.',
		'minor': 'Minor chords convey emotion and depth. They\'re essential for expressive music.',
		'diminished': 'Diminished chords are often used to create drama and tension in classical music.',
		'augmented': 'Augmented chords are used in film scores for mysterious or tense moments.',
		'dominant7': 'The dominant 7th is crucial in jazz - it creates tension that wants to resolve.',
		'major7': 'Major 7th chords add sophistication to jazz and R&B progressions.',
		'minor7': 'Minor 7th chords are the backbone of jazz harmony.'
	};
	
	const formattedCorrect = correctAnswer.charAt(0).toUpperCase() + correctAnswer.slice(1);
	const formattedUser = userAnswer.charAt(0).toUpperCase() + userAnswer.slice(1);
	
	return {
		id: crypto.randomUUID(),
		exerciseType: 'chord-identification',
		correctAnswer: formattedCorrect,
		userAnswer: wasCorrect ? formattedCorrect : formattedUser,
		wasCorrect,
		title: wasCorrect 
			? `${formattedCorrect} Chord - Correct!` 
			: `The answer was ${formattedCorrect}`,
		description: chordDescriptions[correctAnswer] || `${formattedCorrect} chord.`,
		musicalContext: chordContexts[correctAnswer] || '',
		encouragingNote: getEncouragingNote(wasCorrect, score),
		relatedLevels: getRelatedLevels('chord-identification')
	};
}

/**
 * Get default explanation for unknown exercise types
 */
function getDefaultExplanation(
	exerciseType: ExerciseType,
	correctAnswer: string,
	userAnswer: string,
	wasCorrect: boolean,
	score: number
): Explanation {
	return {
		id: crypto.randomUUID(),
		exerciseType,
		correctAnswer,
		userAnswer: wasCorrect ? correctAnswer : userAnswer,
		wasCorrect,
		title: wasCorrect ? 'Correct!' : `The answer was ${correctAnswer}`,
		description: 'Practice makes perfect! Keep working on your musical skills.',
		musicalContext: 'Regular ear training helps develop your musical abilities.',
		encouragingNote: getEncouragingNote(wasCorrect, score),
		relatedLevels: getRelatedLevels(exerciseType)
	};
}

/**
 * Get explanation for an exercise answer
 * 
 * @param exerciseType - Type of exercise (interval, chord, etc.)
 * @param correctAnswer - The correct answer
 * @param userAnswer - The user's answer
 * @param wasCorrect - Whether the user answered correctly
 * @param score - Current score percentage
 * @returns Explanation object with musical context and encouraging message
 */
export function getExplanation(
	exerciseType: ExerciseType,
	correctAnswer: string,
	userAnswer: string,
	wasCorrect: boolean,
	score: number
): Explanation {
	switch (exerciseType) {
		case 'interval-identification':
			return getIntervalExplanation(correctAnswer, userAnswer, wasCorrect, score);
		case 'interval-recognition-unison-octave':
		case 'audiation':
		case 'harmonic-identification':
		case 'melodic-identification':
			// Use Unison/Octave specific explanations for Level 1
			if (correctAnswer === 'Unison' || correctAnswer === 'Octave') {
				return getUnisonOctaveExplanation(correctAnswer, userAnswer, wasCorrect, score);
			}
			return getIntervalExplanation(correctAnswer, userAnswer, wasCorrect, score);
		case 'chord-identification':
			return getChordExplanation(correctAnswer, userAnswer, wasCorrect, score);
		default:
			return getDefaultExplanation(exerciseType, correctAnswer, userAnswer, wasCorrect, score);
	}
}

/**
 * Get explanations for multiple answers
 * 
 * @param answers - Array of answer records
 * @param exerciseType - Type of exercise
 * @param score - Current score percentage
 * @returns Array of explanations
 */
export function getExplanations(
	answers: Array<{ correctAnswer: string; userAnswer: string; wasCorrect: boolean }>,
	exerciseType: ExerciseType,
	score: number
): Explanation[] {
	return answers.map(answer => 
		getExplanation(
			exerciseType,
			answer.correctAnswer,
			answer.userAnswer,
			answer.wasCorrect,
			score
		)
	);
}

/**
 * Get explanations for incorrect answers only
 * 
 * @param answers - Array of answer records
 * @param exerciseType - Type of exercise
 * @param score - Current score percentage
 * @returns Array of explanations for incorrect answers
 */
export function getIncorrectAnswerExplanations(
	answers: Array<{ correctAnswer: string; userAnswer: string; wasCorrect: boolean }>,
	exerciseType: ExerciseType,
	score: number
): Explanation[] {
	const incorrectAnswers = answers.filter(a => !a.wasCorrect);
	return incorrectAnswers.map(answer => 
		getExplanation(
			exerciseType,
			answer.correctAnswer,
			answer.userAnswer,
			false,
			score
		)
	);
}
