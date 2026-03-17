// PitchDetector service for real-time pitch detection
// Uses autocorrelation algorithm for pitch detection from microphone input

/**
 * Pitch information returned by the detector
 */
export interface PitchInfo {
	frequency: number;
	note: string;
	octave: number;
	cents: number; // Deviation from perfect pitch (-50 to +50)
}

/**
 * Result type for operations that can fail
 */
type Result<T, E = Error> = 
	| { success: true; data: T }
	| { success: false; error: E };

/**
 * Note names in chromatic scale
 */
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

/**
 * A4 frequency reference (standard tuning)
 */
const A4_FREQUENCY = 440;

/**
 * MIDI note number for A4
 */
const A4_NOTE_NUMBER = 69;

/**
 * RMS threshold for detecting silence
 */
const RMS_THRESHOLD = 0.01;

/**
 * Minimum correlation value to accept a detected pitch
 */
const MIN_CORRELATION = 0.5;

/**
 * FFT size for analysis
 */
const FFT_SIZE = 2048;

/**
 * Smoothing time constant for analyser
 */
const SMOOTHING_CONSTANT = 0.8;

/**
 * PitchDetector class for real-time pitch detection
 * Implements autocorrelation algorithm for monophonic pitch detection
 */
export class PitchDetector {
	private audioContext: AudioContext | null = null;
	private analyserNode: AnalyserNode | null = null;
	private microphoneStream: MediaStream | null = null;
	private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
	private animationFrameId: number | null = null;
	private _isActive = false;
	private _isPermissionGranted = false;
	private _lastPitch: PitchInfo | null = null;

	/**
	 * Check if pitch detection is currently active
	 */
	get isActive(): boolean {
		return this._isActive;
	}

	/**
	 * Check if microphone permission has been granted
	 */
	get isPermissionGranted(): boolean {
		return this._isPermissionGranted;
	}

	/**
	 * Get the last detected pitch
	 */
	get lastPitch(): PitchInfo | null {
		return this._lastPitch;
	}

	/**
	 * Request microphone permission
	 * @returns Promise<boolean> - true if permission granted
	 */
	async requestMicrophonePermission(): Promise<boolean> {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			// Store the stream but don't connect yet - we'll do that in start()
			this.microphoneStream = stream;
			this._isPermissionGranted = true;
			return true;
		} catch (error) {
			if (error instanceof DOMException) {
				if (error.name === 'NotAllowedError') {
					console.log('Microphone permission denied');
				} else if (error.name === 'NotFoundError') {
					console.log('No microphone found');
				}
			}
			this._isPermissionGranted = false;
			return false;
		}
	}

	/**
	 * Start pitch detection
	 * Must be called after microphone permission is granted
	 */
	async start(): Promise<void> {
		if (!this.microphoneStream) {
			// Try to get permission first
			const granted = await this.requestMicrophonePermission();
			if (!granted) {
				throw new Error('Microphone permission not granted');
			}
		}

		if (this._isActive) {
			return; // Already running
		}

		// Get or create AudioContext using the singleton pattern
		const { getAudioContext } = await import('./AudioEngine');
		this.audioContext = getAudioContext();

		// Resume if suspended (browser autoplay policy)
		if (this.audioContext.state === 'suspended') {
			await this.audioContext.resume();
		}

		// Create analyser node
		this.analyserNode = this.audioContext.createAnalyser();
		this.analyserNode.fftSize = FFT_SIZE;
		this.analyserNode.smoothingTimeConstant = SMOOTHING_CONSTANT;

		// Connect microphone stream to analyser
		this.mediaStreamSource = this.audioContext.createMediaStreamSource(
			this.microphoneStream!
		);
		this.mediaStreamSource.connect(this.analyserNode);

		this._isActive = true;

		// Start the detection loop
		this.detectPitchLoop();
	}

	/**
	 * Stop pitch detection
	 */
	stop(): void {
		this._isActive = false;

		// Cancel animation frame
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}

		// Disconnect and clean up
		if (this.mediaStreamSource) {
			this.mediaStreamSource.disconnect();
			this.mediaStreamSource = null;
		}

		if (this.analyserNode) {
			this.analyserNode.disconnect();
			this.analyserNode = null;
		}

		// Stop microphone tracks
		if (this.microphoneStream) {
			this.microphoneStream.getTracks().forEach(track => track.stop());
			this.microphoneStream = null;
		}

		this._lastPitch = null;
	}

	/**
	 * Get current pitch information
	 * @returns PitchInfo or null if no valid pitch detected
	 */
	getPitch(): PitchInfo | null {
		if (!this.analyserNode || !this.audioContext) {
			return null;
		}

		const buffer = new Float32Array(this.analyserNode.fftSize);
		this.analyserNode.getFloatTimeDomainData(buffer);

		// Detect pitch using autocorrelation
		const frequency = this.autoCorrelate(buffer, this.audioContext.sampleRate);

		if (frequency === -1) {
			return null;
		}

		// Convert frequency to note information
		const noteInfo = this.frequencyToNote(frequency);
		this._lastPitch = {
			frequency,
			...noteInfo
		};

		return this._lastPitch;
	}

	/**
	 * Convert frequency to note information
	 * @param frequency - Frequency in Hz
	 * @returns Object with note name, octave, and cents deviation
	 */
	frequencyToNote(frequency: number): { note: string; octave: number; cents: number } {
		// Calculate MIDI note number from frequency
		const noteNumber = 12 * Math.log2(frequency / A4_FREQUENCY) + A4_NOTE_NUMBER;
		
		// Round to nearest note
		const roundedNote = Math.round(noteNumber);
		
		// Calculate cents deviation
		const perfectFrequency = this.frequencyFromNoteNumber(roundedNote);
		const cents = Math.round(1200 * Math.log2(frequency / perfectFrequency));
		
		const noteName = NOTE_NAMES[((roundedNote % 12) + 12) % 12];
		const octave = Math.floor(roundedNote / 12) - 1;
		
		return { note: noteName, octave, cents };
	}

	/**
	 * Calculate frequency from MIDI note number
	 */
	private frequencyFromNoteNumber(noteNumber: number): number {
		return A4_FREQUENCY * Math.pow(2, (noteNumber - A4_NOTE_NUMBER) / 12);
	}

	/**
	 * Autocorrelation-based pitch detection algorithm
	 * @param buffer - Audio sample buffer
	 * @param sampleRate - Sample rate in Hz
	 * @returns Detected frequency in Hz, or -1 if no pitch detected
	 */
	private autoCorrelate(buffer: Float32Array, sampleRate: number): number {
		// Calculate RMS to check if signal is loud enough
		let rms = 0;
		for (let i = 0; i < buffer.length; i++) {
			rms += buffer[i] * buffer[i];
		}
		rms = Math.sqrt(rms / buffer.length);
		
		if (rms < RMS_THRESHOLD) {
			return -1; // Signal too quiet
		}
		
		// Find the best correlation period using autocorrelation
		const SIZE = buffer.length;
		const MAX_SAMPLES = Math.floor(SIZE / 2);
		const correlations = new Float32Array(MAX_SAMPLES);
		
		for (let lag = 0; lag < MAX_SAMPLES; lag++) {
			let correlation = 0;
			for (let i = 0; i < MAX_SAMPLES; i++) {
				correlation += Math.abs(buffer[i] - buffer[i + lag]);
			}
			correlation = 1 - (correlation / MAX_SAMPLES);
			correlations[lag] = correlation;
		}
		
		// Find the first major peak after position 0
		let bestLag = -1;
		let bestCorrelation = 0;
		
		// Skip the first few samples (too high frequency)
		for (let lag = 20; lag < MAX_SAMPLES; lag++) {
			if (correlations[lag] > bestCorrelation) {
				bestCorrelation = correlations[lag];
				bestLag = lag;
			}
			// If correlation dropped significantly, we've passed the peak
			if (bestCorrelation > 0.9 && correlations[lag] < bestCorrelation - 0.2) {
				break;
			}
		}
		
		if (bestLag === -1 || bestCorrelation < MIN_CORRELATION) {
			return -1;
		}
		
		// Parabolic interpolation for better precision
		const betterLag = this.parabolicInterpolation(correlations, bestLag);
		
		return sampleRate / betterLag;
	}

	/**
	 * Parabolic interpolation for sub-sample accuracy
	 */
	private parabolicInterpolation(correlations: Float32Array, lag: number): number {
		if (lag <= 0 || lag >= correlations.length - 1) {
			return lag;
		}
		
		const a = correlations[lag - 1];
		const b = correlations[lag];
		const c = correlations[lag + 1];
		
		const adjustment = (a - c) / (2 * (a - 2 * b + c));
		return lag + adjustment;
	}

	/**
	 * Check if a detected pitch matches a target note
	 * @param targetNote - Target note name (e.g., "A")
	 * @param targetOctave - Target octave (e.g., 4)
	 * @param centsThreshold - Maximum cents deviation to consider a match (default: 50)
	 * @returns true if pitch matches target within threshold
	 */
	matchesTarget(
		targetNote: string, 
		targetOctave: number, 
		centsThreshold: number = 50
	): boolean {
		if (!this._lastPitch) {
			return false;
		}

		// Check note name and octave
		if (this._lastPitch.note !== targetNote || this._lastPitch.octave !== targetOctave) {
			return false;
		}

		// Check cents within threshold
		return Math.abs(this._lastPitch.cents) <= centsThreshold;
	}

	/**
	 * Continuous pitch detection loop using requestAnimationFrame
	 */
	private detectPitchLoop(): void {
		if (!this._isActive) {
			return;
		}

		// Get current pitch
		this.getPitch();

		// Schedule next detection (aiming for ~60fps)
		this.animationFrameId = requestAnimationFrame(() => {
			this.detectPitchLoop();
		});
	}
}

/**
 * Create a new PitchDetector instance
 */
export function createPitchDetector(): PitchDetector {
	return new PitchDetector();
}
