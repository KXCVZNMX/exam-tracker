import { describe, expect, it } from 'vitest';
import { renderMarkdown } from './renderMarkdown';

describe('renderMarkdown', () => {
	it('renders headings, emphasis, links, and inline code', () => {
		const html = renderMarkdown(
			'# Heading 1\n\n## Heading 2\n\n### Heading 3\n\n**bold** *italic* ***both*** ~~deleted~~ [link](https://example.com) `code`'
		);

		expect(html).toContain('<h1>Heading 1</h1>');
		expect(html).toContain('<h2>Heading 2</h2>');
		expect(html).toContain('<h3>Heading 3</h3>');
		expect(html).toContain('<strong>bold</strong>');
		expect(html).toContain('<em>italic</em>');
		expect(html).toContain('<em><strong>both</strong></em>');
		expect(html).toContain('<del>deleted</del>');
		expect(html).toContain('<a href="https://example.com">link</a>');
		expect(html).toContain('<code>code</code>');
	});

	it('renders blockquotes, lists, code blocks, and tables', () => {
		const html = renderMarkdown(
			'> quoted text\n\n- unordered\n- list\n\n1. ordered\n2. list\n\n- [x] complete\n- [ ] pending\n\n```ts\nconst answer = 42;\n```\n\n| A | B |\n|---|---|\n| 1 | 2 |'
		);

		expect(html).toContain('<blockquote>');
		expect(html).toContain('<li>unordered</li>');
		expect(html).toContain('<ol>');
		expect(html).toContain('type="checkbox"');
		expect(html).toContain('<pre><code class="language-ts">');
		expect(html).toContain('<table>');
		expect(html).toContain('<td>1</td>');
	});

	it('renders inline and display KaTeX math', () => {
		const html = renderMarkdown('The formula is $x^2$ and the fraction is $$\\frac{a}{b}$$.');

		expect(html).toContain('class="katex"');
		expect(html).toContain('class="katex-display"');
		// DOMPurify removes KaTeX's annotation metadata while preserving the rendered math.
		expect(html).toContain('class="mord mathnormal"');
		expect(html).toContain('class="mfrac"');
	});

	it('returns an empty string for empty input', () => {
		expect(renderMarkdown('')).toBe('');
	});
});
