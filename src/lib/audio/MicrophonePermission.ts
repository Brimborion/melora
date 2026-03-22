// MicrophonePermission service for handling microphone permissions
// Uses Permissions API and getUserMedia for permission management

import * as Tone from 'tone';

/**
 * Permission states for microphone access
 */
export type PermissionState = 'granted' | 'denied' | 'prompt' | 'checking';

/**
 * Module-level permission state (not using Svelte runes - this is a pure TS service)
 */
let permissionState: PermissionState = 'prompt';
let isAudioContextSuspended = false;
let permissionChangeListeners: Array<(state: PermissionState) => void> = [];

/**
 * Get the current permission state
 */
export function getPermissionState(): PermissionState {
	return permissionState;
}

/**
 * Set the permission state (internal use)
 */
function setPermissionState(state: PermissionState): void {
	permissionState = state;
}

/**
 * Check microphone permission using Permissions API or getUserMedia fallback
 */
export async function checkMicrophonePermission(): Promise<PermissionState> {
	permissionState = 'checking';
	
	try {
		// Use Permissions API if available (Chrome, Edge, Opera)
		if (navigator.permissions) {
			try {
				const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
				permissionState = result.state;
				
				// Listen for permission changes
				result.addEventListener('change', () => {
					permissionState = result.state;
					notifyPermissionChange(result.state);
				});
				
				return result.state;
			} catch {
				// Permissions API might not support 'microphone' in all browsers
				// Fall through to getUserMedia
			}
		}
		
		// Fallback: try to get stream to check permission
		// This will prompt if permission is 'prompt'
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		stream.getTracks().forEach(track => track.stop()); // Release immediately
		permissionState = 'granted';
		return 'granted';
	} catch (error) {
		if (error instanceof DOMException) {
			if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
				permissionState = 'denied';
				return 'denied';
			}
			if (error.name === 'NotFoundError') {
				// No microphone found
				permissionState = 'denied';
				return 'denied';
			}
			if (error.name === 'OverconstrainedError') {
				// Requested constraints can't be met
				permissionState = 'denied';
				return 'denied';
			}
		}
		permissionState = 'denied';
		return 'denied';
	}
}

/**
 * Request microphone permission
 * @returns Promise<boolean> - true if permission granted
 */
export async function requestMicrophonePermission(): Promise<boolean> {
	permissionState = 'checking';
	
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		// Keep stream for later use - we'll request again when needed
		// This is because modern browsers treat permissions as one-time
		stream.getTracks().forEach(track => track.stop());
		permissionState = 'granted';
		notifyPermissionChange('granted');
		return true;
	} catch (error) {
		if (error instanceof DOMException) {
			switch (error.name) {
				case 'NotAllowedError':
				case 'PermissionDeniedError':
					permissionState = 'denied';
					break;
				case 'NotFoundError':
					// No microphone found
					permissionState = 'denied';
					break;
				case 'OverconstrainedError':
					// Requested constraints can't be met
					permissionState = 'denied';
					break;
				default:
					permissionState = 'denied';
			}
		} else {
			permissionState = 'denied';
		}
		notifyPermissionChange(permissionState);
		return false;
	}
}

/**
 * Get the MediaStream for microphone access
 * Call this when you actually need to use the microphone
 */
export async function getMicrophoneStream(): Promise<MediaStream | null> {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		return stream;
	} catch (error) {
		console.error('Failed to get microphone stream:', error);
		return null;
	}
}

/**
 * Setup AudioContext state monitoring
 * Monitors for suspended state changes
 */
export function setupAudioContextStateMonitoring(): void {
	const audioContext = Tone.getContext().rawContext as AudioContext;
	
	// Check initial state
	isAudioContextSuspended = audioContext.state === 'suspended';
	
	// Listen for state changes
	audioContext.onstatechange = () => {
		isAudioContextSuspended = audioContext.state === 'suspended';
	};
}

/**
 * Get current AudioContext suspended state
 */
export function getIsAudioContextSuspended(): boolean {
	return isAudioContextSuspended;
}

/**
 * Resume AudioContext if it's suspended
 * @returns Promise<boolean> - true if successfully resumed or already running
 */
export async function resumeAudioContextIfNeeded(): Promise<boolean> {
	const audioContext = Tone.getContext().rawContext as AudioContext;
	
	if (audioContext.state === 'suspended') {
		try {
			await Tone.start();
			isAudioContextSuspended = false;
			return true;
		} catch (error) {
			console.error('Failed to resume AudioContext:', error);
			return false;
		}
	}
	
	return true;
}

/**
 * Setup auto-resume on user interaction
 * Adds one-time event listeners for click, keydown, touchstart
 */
export function setupAutoResumeOnInteraction(): void {
	const events = ['click', 'keydown', 'touchstart'] as const;
	
	const resumeHandler = async () => {
		const resumed = await resumeAudioContextIfNeeded();
		if (resumed) {
			console.log('AudioContext auto-resumed on user interaction');
		}
	};
	
	// Use once option to avoid memory leaks
	events.forEach(event => {
		document.addEventListener(event, resumeHandler, { once: true });
	});
}

/**
 * Subscribe to permission state changes
 */
export function onPermissionChange(callback: (state: PermissionState) => void): () => void {
	permissionChangeListeners.push(callback);
	
	// Return unsubscribe function
	return () => {
		const index = permissionChangeListeners.indexOf(callback);
		if (index > -1) {
			permissionChangeListeners.splice(index, 1);
		}
	};
}

/**
 * Notify all listeners of permission change
 */
function notifyPermissionChange(state: PermissionState): void {
	permissionChangeListeners.forEach(callback => callback(state));
}

/**
 * Check if the browser supports the Permissions API for microphone
 */
export function supportsPermissionsAPI(): boolean {
	return navigator.permissions !== undefined;
}

/**
 * Get browser name for guidance display
 */
export function getBrowserName(): string {
	const ua = navigator.userAgent;
	
	if (ua.includes('Chrome')) return 'Chrome';
	if (ua.includes('Firefox')) return 'Firefox';
	if (ua.includes('Safari')) return 'Safari';
	if (ua.includes('Edge')) return 'Edge';
	
	return 'your browser';
}
