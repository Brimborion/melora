// Audio module exports
export { audioContextManager, getAudioContext, ensureAudioReady } from './AudioEngine';
export { sampleLibrary } from './SampleLibrary';
export * from './audioUtils';
export { PitchDetector, createPitchDetector } from './PitchDetector';
export type { PitchInfo } from './PitchDetector';
export * from './MicrophonePermission';
