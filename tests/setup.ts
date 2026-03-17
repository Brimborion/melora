// Test setup file for Vitest
import 'fake-indexeddb/auto';
import { beforeAll, vi } from 'vitest';

// Store the real indexedDB before any stubs
const realIndexedDB = globalThis.indexedDB;

// Mock Web Audio API
class MockAudioContext {
	state = 'running';
	sampleRate = 44100;
	constructor() {}
	
	createBufferSource() {
		return {
			buffer: null,
			connect: () => {},
			disconnect: () => {},
			start: () => {},
			stop: () => {}
		};
	}
	
	createGain() {
		return {
			connect: () => {},
			disconnect: () => {},
			gain: { value: 1 }
		};
	}
	
	createOscillator() {
		return {
			connect: () => {},
			disconnect: () => {},
			start: () => {},
			stop: () => {},
			type: 'sine',
			frequency: { value: 440 }
		};
	}
	
	decodeAudioData() {
		return Promise.resolve({
			duration: 1,
			length: 44100,
			numberOfChannels: 2,
			sampleRate: 44100,
			getChannelData: () => new Float32Array(44100)
		});
	}
	
	get destination() {
		return {};
	}
	
	async resume() {
		return Promise.resolve();
	}
	
	close() {
		return Promise.resolve();
	}
}

// Stub global objects
vi.stubGlobal('AudioContext', MockAudioContext);
vi.stubGlobal('webkitAudioContext', MockAudioContext);

// Mock localStorage
const mockLocalStorage = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn()
};
vi.stubGlobal('localStorage', mockLocalStorage);

// Note: Don't stub indexedDB - fake-indexeddb handles it
// The comment was misleading - fake-indexeddb auto-patches indexedDB

// Mock window.matchMedia
vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
	matches: false,
	media: query,
	onchange: null,
	addListener: vi.fn(),
	removeListener: vi.fn(),
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
	dispatchEvent: vi.fn(),
})));

// Mock Service Worker
vi.stubGlobal('navigator', {
	...navigator,
	serviceWorker: {
		register: vi.fn().mockResolvedValue({}),
		getRegistration: vi.fn().mockResolvedValue(undefined)
	}
});
