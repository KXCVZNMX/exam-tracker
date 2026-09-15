import { describe, it, expect } from 'vitest';
import { truncateByWidth } from '$lib/util/general';

describe('truncateByWidth', () => {
	it('returns the input unchanged when it fits', () => {
		expect(truncateByWidth('ab', 100)).toBe('ab');
	});

	it('truncates ASCII text and appends an ellipsis', () => {
		expect(truncateByWidth('abcdefghij', 5)).toBe('ab...');
	});

	it('counts CJK characters as double width', () => {
		expect(truncateByWidth('一二三四', 6)).toBe('一...');
	});
});
