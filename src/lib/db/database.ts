import Dexie, { type Table } from 'dexie';

/**
 * Melora Database Schema
 * Single Dexie instance for IndexedDB operations
 */

// User progress for each level
// TODO: Add userId field for multi-user support when needed
export interface GameProgress {
	id?: number;
	levelId: string;
	completed: boolean;
	bestScore: number;
	attempts: number;
	completedAt?: Date;
	updatedAt: Date;
}

// User preferences
export interface UserPreferences {
	id: string; // Primary key (use 'default' for single user)
	username: string;
	theme: 'light' | 'dark' | 'auto';
	audioVolume: number;
	musicEnabled: boolean;
	soundEffectsEnabled: boolean;
	highContrastMode: boolean;
	reducedMotion: boolean;
	textSize: 'small' | 'medium' | 'large';
	difficulty: 'beginner' | 'intermediate' | 'advanced';
	createdAt: Date;
	updatedAt: Date;
}

// Game sessions (for tracking history)
export interface GameSession {
	id?: number;
	levelId: string;
	startedAt: Date;
	endedAt?: Date;
	score: number;
	correctAnswers: number;
	totalQuestions: number;
	completed: boolean;
}

// Exercise session for pause/resume persistence
export interface ExerciseSession {
	id?: number;
	levelId: string;
	questionIndex: number;
	answers: Array<{ type: 'correct' | 'wrong'; answeredAt: Date }>;
	elapsedTime: number; // milliseconds
	pausedAt: Date;
	updatedAt: Date;
}

/**
 * MeloraDB - Single Dexie instance
 * Used for all IndexedDB operations in the app
 */
export class MeloraDB extends Dexie {
	progress!: Table<GameProgress>;
	preferences!: Table<UserPreferences>;
	sessions!: Table<GameSession>;
	exerciseSessions!: Table<ExerciseSession>;

	constructor() {
		super('melora');
		
		// Schema definition
		this.version(1).stores({
			progress: '++id, levelId, completed, completedAt',
			preferences: 'id',
			sessions: '++id, levelId, startedAt, completed'
		});
		
		// Migration to add textSize field
		this.version(2).stores({
			progress: '++id, levelId, completed, completedAt',
			preferences: 'id',
			sessions: '++id, levelId, startedAt, completed'
		}).upgrade(tx => {
			return tx.table('preferences').toCollection().modify(pref => {
				if (pref.textSize === undefined) {
					pref.textSize = 'medium';
				}
			});
		});
		
		// Migration to add exerciseSessions table for pause/resume
		this.version(3).stores({
			progress: '++id, levelId, completed, completedAt',
			preferences: 'id',
			sessions: '++id, levelId, startedAt, completed',
			exerciseSessions: '++id, levelId, pausedAt'
		});
	}
}

// Single database instance - exported for use throughout the app
// Uses an object wrapper so it can be recreated after deletion
let _dbInstance: MeloraDB = new MeloraDB();

export const db = {
	get progress() { return _dbInstance.progress; },
	get preferences() { return _dbInstance.preferences; },
	get sessions() { return _dbInstance.sessions; },
	get exerciseSessions() { return _dbInstance.exerciseSessions; },
	
	async clear() {
		await _dbInstance.progress.clear();
		await _dbInstance.preferences.clear();
		await _dbInstance.sessions.clear();
		await _dbInstance.exerciseSessions.clear();
	},
	
	async delete() {
		await _dbInstance.delete();
		// Recreate fresh database instance after deletion
		_dbInstance = new MeloraDB();
	},
	
	get isOpen() { return _dbInstance.isOpen(); },
	get name() { return _dbInstance.name; },
	get version() { return _dbInstance.version; },
	
	async open() { return _dbInstance.open(); },
	async close() { return _dbInstance.close(); },
};

// Default preferences factory
export function createDefaultPreferences(): UserPreferences {
	return {
		id: 'default',
		username: 'Player',
		theme: 'dark',
		audioVolume: 0.8,
		musicEnabled: true,
		soundEffectsEnabled: true,
		highContrastMode: false,
		reducedMotion: false,
		textSize: 'medium',
		difficulty: 'beginner',
		createdAt: new Date(),
		updatedAt: new Date()
	};
}
