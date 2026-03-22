// Audio module exports

// ToneAudioEngine (Tone.js + Salamander)
export { ToneAudioEngine, toneAudioEngine, noteToToneJS, isNoteSupported, SALAMANDER_ATTRIBUTION } from './ToneAudioEngine';

// Audio utilities
export * from './audioUtils';

// Pitch detection
export { PitchDetector, createPitchDetector } from './PitchDetector';
export type { PitchInfo } from './PitchDetector';

// Microphone permissions
export * from './MicrophonePermission';
