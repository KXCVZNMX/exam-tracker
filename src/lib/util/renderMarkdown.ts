import { marked, Renderer } from 'marked';
import katex from 'katex';
import DOMPurify from 'isomorphic-dompurify';

export function renderMarkdown(source: string): string {
	let text = source;
	const mathBlocks: string[] = [];
	const placeholder = (math: string, displayMode: boolean) => {
		const index =
			mathBlocks.push(katex.renderToString(math.trim(), { displayMode, throwOnError: false })) - 1;
		return `@@KATEX_${index}@@`;
	};

	// Display math: $$ ... $$
	text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => placeholder(math, true));

	// Inline math: $ ... $
	text = text.replace(/\$([^$\n]+?)\$/g, (_, math) => placeholder(math, false));

	const escapeHtml = (value: string) =>
		value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	const renderer = new Renderer();
	renderer.html = ({ text: html }) => escapeHtml(html);
	const rendered = marked.parse(text, {
		async: false,
		renderer
	}) as string;

	return DOMPurify.sanitize(
		rendered.replace(/@@KATEX_(\d+)@@/g, (_, index) => mathBlocks[Number(index)])
	);
}
