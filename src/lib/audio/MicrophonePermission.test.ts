// Unit tests for MicrophonePermission service

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock navigator.mediaDevices
const mockGetUserMedia = vi.fn();
const mockEnumerateDevices = vi.fn();

vi.stubGlobal('navigator', {
	mediaDevices: {
		getUserMedia: mockGetUserMedia,
		enumerateDevices: mockEnumerateDevices
	}
});

// Mock AudioEngine
vi.mock('$lib/audio/AudioEngine', () => ({
	getAudioContext: vi.fn(() => ({
		state: 'running',
		resume: vi.fn().mockResolvedValue(undefined),
		onstatechange: null
	}))
}));

describe('MicrophonePermission', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetUserMedia.mockReset();
		mockEnumerateDevices.mockReset();
	});

	describe('checkMicrophonePermission', () => {
		it('should return granted when permission is already granted', async () => {
			// Setup: mock getUserMedia to succeed (simulating granted)
			mockGetUserMedia.mockResolvedValue({
				getTracks: () => [{ stop: vi.fn() }]
			});

			// Import after mocking
			const { checkMicrophonePermission } = await import('$lib/audio/MicrophonePermission');
			
			const result = await checkMicrophonePermission();
			
			expect(result).toBe('granted');
		});

		it('should return denied when permission is denied', async () => {
			// Setup: mock getUserMedia to throw NotAllowedError
			mockGetUserMedia.mockRejectedValue(
				new DOMException('Permission denied', 'NotAllowedError')
			);

			const { checkMicrophonePermission } = await import('$lib/audio/MicrophonePermission');
			
			const result = await checkMicrophonePermission();
			
			expect(result).toBe('denied');
		});

		it('should return denied when no microphone is found', async () => {
			// Setup: mock getUserMedia to throw NotFoundError
			mockGetUserMedia.mockRejectedValue(
				new DOMException('No microphone found', 'NotFoundError')
			);

			const { checkMicrophonePermission } = await import('$lib/audio/MicrophonePermission');
			
			const result = await checkMicrophonePermission();
			
			expect(result).toBe('denied');
		});
	});

	describe('requestMicrophonePermission', () => {
		it('should return true when permission is granted', async () => {
			// Setup: mock getUserMedia to succeed
			mockGetUserMedia.mockResolvedValue({
				getTracks: () => [{ stop: vi.fn() }]
			});

			const { requestMicrophonePermission } = await import('$lib/audio/MicrophonePermission');
			
			const result = await requestMicrophonePermission();
			
			expect(result).toBe(true);
		});

		it('should return false when permission is denied', async () => {
			// Setup: mock getUserMedia to throw NotAllowedError
			mockGetUserMedia.mockRejectedValue(
				new DOMException('Permission denied', 'NotAllowedError')
			);

			const { requestMicrophonePermission } = await import('$lib/audio/MicrophonePermission');
			
			const result = await requestMicrophonePermission();
			
			expect(result).toBe(false);
		});

		it('should return false when constraints cannot be met', async () => {
			// Setup: mock getUserMedia to throw OverconstrainedError
			mockGetUserMedia.mockRejectedValue(
				new DOMException('Constraints not satisfied', 'OverconstrainedError')
			);

			const { requestMicrophonePermission } = await import('$lib/audio/MicrophonePermission');
			
			const result = await requestMicrophonePermission();
			
			expect(result).toBe(false);
		});
	});

	describe('getBrowserName', () => {
		it('should return Chrome for Chrome user agent', async () => {
			// Save original userAgent
			const originalUserAgent = navigator.userAgent;
			Object.defineProperty(navigator, 'userAgent', {
				value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
				configurable: true
			});

			const { getBrowserName } = await import('$lib/audio/MicrophonePermission');
			
			expect(getBrowserName()).toBe('Chrome');

			// Restore
			Object.defineProperty(navigator, 'userAgent', {
				value: originalUserAgent,
				configurable: true
			});
		});

		it('should return Firefox for Firefox user agent', async () => {
			const originalUserAgent = navigator.userAgent;
			Object.defineProperty(navigator, 'userAgent', {
				value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
				configurable: true
			});

			const { getBrowserName } = await import('$lib/audio/MicrophonePermission');
			
			expect(getBrowserName()).toBe('Firefox');

			Object.defineProperty(navigator, 'userAgent', {
				value: originalUserAgent,
				configurable: true
			});
		});

		it('should return Safari for Safari user agent', async () => {
			const originalUserAgent = navigator.userAgent;
			Object.defineProperty(navigator, 'userAgent', {
				value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
				configurable: true
			});

			const { getBrowserName } = await import('$lib/audio/MicrophonePermission');
			
			expect(getBrowserName()).toBe('Safari');

			Object.defineProperty(navigator, 'userAgent', {
				value: originalUserAgent,
				configurable: true
			});
		});
	});

	describe('resumeAudioContextIfNeeded', () => {
		// Note: AudioContext resume tests require complex mocking
		// The actual functionality is tested via integration tests
		// These are covered by the existing pitch and audio tests
		it.todo('should handle AudioContext resume scenarios');
	});
});
