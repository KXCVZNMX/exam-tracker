function getCharWidth(char: string): number {
	if (char.length > 1) {
		let total = 0;
		for (const c of char) total += getCharWidth(c);
		return total;
	}

	const code = char.codePointAt(0)!;

	if (
		(code >= 0x4e00 && code <= 0x9fff) || // CJK
		(code >= 0x3040 && code <= 0x30ff) || // Hiragana / Katakana
		(code >= 0xac00 && code <= 0xd7af) || // Hangul
		(code >= 0xff01 && code <= 0xff60) || // Fullwidth forms
		(code >= 0x1f300 && code <= 0x1faff) // Emoji (approximation)
	) {
		return 2;
	} else if (code >= 0x41 && code <= 0x5a) {
		return 1.5;
	}

	return 1;
}

export function truncateByWidth(input: string, maxWidth: number, ellipsis = '...'): string {
	let width = 0;
	let result = '';

	const ellipsisWidth = getCharWidth(ellipsis);

	for (const char of input) {
		const charWidth = getCharWidth(char);

		if (width + charWidth + ellipsisWidth > maxWidth) {
			return result + ellipsis;
		}

		width += charWidth;
		result += char;
	}

	return result;
}