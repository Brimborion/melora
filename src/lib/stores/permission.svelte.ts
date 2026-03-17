// Permission store using Svelte 5 runes
// Manages microphone permission state across the application

import {
	checkMicrophonePermission,
	requestMicrophonePermission,
	setupAudioContextStateMonitoring,
	setupAutoResumeOnInteraction,
	getIsAudioContextSuspended,
	resumeAudioContextIfNeeded,
	onPermissionChange,
	getPermissionState,
	type PermissionState
} from '$lib/audio/MicrophonePermission';

/**
 * Create the permission store
 * Manages microphone permission state and provides actions
 */
export function createPermissionStore() {
	// State using Svelte 5 runes
	let permissionState = $state<PermissionState>('prompt');
	let isAudioContextSuspended = $state(false);
	let showPermissionModal = $state(false);
	let showPermissionDenied = $state(false);
	let showContextResumedNotification = $state(false);
	let isRequesting = $state(false);
	let previousSuspendedState = $state(false);
	
	// Initialize and setup monitoring
	function initialize(): void {
		// Check initial permission state
		checkMicrophonePermission().then(state => {
			permissionState = state;
			updateUIFromPermissionState(state);
		});
		
		// Setup AudioContext monitoring
		setupAudioContextStateMonitoring();
		
		// Setup auto-resume on user interaction
		setupAutoResumeOnInteraction();
		
		// Subscribe to permission changes
		onPermissionChange((state: PermissionState) => {
			permissionState = state;
			updateUIFromPermissionState(state);
		});
		
		// Check AudioContext state periodically
		setInterval(() => {
			const currentSuspended = getIsAudioContextSuspended();
			
			// Check if state changed from suspended to running
			if (previousSuspendedState && !currentSuspended) {
				// Context resumed!
				showContextResumedNotification = true;
				
				// Auto-dismiss after 3 seconds
				setTimeout(() => {
					showContextResumedNotification = false;
				}, 3000);
			}
			
			previousSuspendedState = currentSuspended;
			isAudioContextSuspended = currentSuspended;
		}, 500);
	}
	
	// Update UI state based on permission state
	function updateUIFromPermissionState(state: PermissionState): void {
		switch (state) {
			case 'granted':
				showPermissionModal = false;
				showPermissionDenied = false;
				break;
			case 'denied':
				showPermissionModal = false;
				showPermissionDenied = true;
				break;
			case 'prompt':
				showPermissionModal = true;
				showPermissionDenied = false;
				break;
			case 'checking':
				// Keep current UI state while checking
				break;
		}
	}
	
	// Request microphone permission
	async function requestPermission(): Promise<boolean> {
		isRequesting = true;
		showContextResumedNotification = false;
		
		try {
			const granted = await requestMicrophonePermission();
			
			if (granted) {
				permissionState = 'granted';
				showPermissionModal = false;
				showPermissionDenied = false;
			} else {
				permissionState = 'denied';
				showPermissionDenied = true;
			}
			
			return granted;
		} finally {
			isRequesting = false;
		}
	}
	
	// Check permission without requesting
	async function checkPermission(): Promise<PermissionState> {
		const state = await checkMicrophonePermission();
		permissionState = state;
		updateUIFromPermissionState(state);
		return state;
	}
	
	// Open permission modal
	function openModal(): void {
		if (permissionState === 'denied') {
			showPermissionDenied = true;
		} else {
			showPermissionModal = true;
		}
	}
	
	// Close permission modal
	function closeModal(): void {
		showPermissionModal = false;
	}
	
	// Try again after permission denied
	function tryAgain(): void {
		showPermissionDenied = false;
		showPermissionModal = true;
	}
	
	// Dismiss context resumed notification
	function dismissContextNotification(): void {
		showContextResumedNotification = false;
	}

	// Show context resumed notification
	function showNotification(): void {
		showContextResumedNotification = true;
	}
	
	// Resume audio context manually
	async function resumeContext(): Promise<boolean> {
		const resumed = await resumeAudioContextIfNeeded();
		if (resumed) {
			isAudioContextSuspended = false;
		}
		return resumed;
	}
	
	// Check if permission is granted
	let isGranted = $derived(permissionState === 'granted');
	
	// Check if permission is denied
	let isDenied = $derived(permissionState === 'denied');
	
	// Check if permission is pending (prompt or checking)
	let isPending = $derived(permissionState === 'prompt' || permissionState === 'checking');
	
	// Derived: should show any permission UI
	let shouldShowUI = $derived(showPermissionModal || showPermissionDenied);
	
	// Initialize on creation
	initialize();
	
	return {
		// Getters
		get permissionState() { return permissionState; },
		get isAudioContextSuspended() { return isAudioContextSuspended; },
		get showPermissionModal() { return showPermissionModal; },
		get showPermissionDenied() { return showPermissionDenied; },
		get showContextResumedNotification() { return showContextResumedNotification; },
		get isRequesting() { return isRequesting; },
		get isGranted() { return isGranted; },
		get isDenied() { return isDenied; },
		get isPending() { return isPending; },
		get shouldShowUI() { return shouldShowUI; },
		
		// Actions
		requestPermission,
		checkPermission,
		openModal,
		closeModal,
		tryAgain,
		resumeContext,
		dismissContextNotification,
		showNotification,
		setNotification: (show: boolean) => { showContextResumedNotification = show; }
	};
}

// Export singleton instance
export const permissionStore = createPermissionStore();
