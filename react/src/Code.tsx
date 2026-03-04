import { useContext, useLayoutEffect, useMemo, useRef } from 'react';
import { RevealContext } from './context';
import type { CodeProps } from './types';

type HighlightPlugin = {
	highlightBlock?: (block: HTMLElement) => void;
};

function normalizeCode(code: string) {
	const lines = code.replace(/\r\n/g, '\n').split('\n');

	while (lines.length && lines[0].trim().length === 0) lines.shift();
	while (lines.length && lines[lines.length - 1].trim().length === 0) lines.pop();

	if (!lines.length) return '';

	const minIndent = lines
		.filter((line) => line.trim().length > 0)
		.reduce(
			(acc, line) => Math.min(acc, line.match(/^\s*/)?.[0].length ?? 0),
			Number.POSITIVE_INFINITY
		);

	return lines.map((line) => line.slice(minIndent)).join('\n');
}

function cleanupGeneratedFragments(block: HTMLElement) {
	const pre = block.parentElement;
	if (!pre) return;

	// RevealHighlight creates extra <code.fragment> nodes for each highlight step (e.g. "1|3").
	// Remove previously generated nodes before re-highlighting to avoid duplicate steps.
	Array.from(pre.children).forEach((child) => {
		if (
			child !== block &&
			child instanceof HTMLElement &&
			child.tagName === 'CODE' &&
			child.classList.contains('fragment')
		) {
			child.remove();
		}
	});
}

export function Code({
	children,
	code,
	language,
	trim = true,
	lineNumbers,
	startFrom,
	noEscape,
	codeClassName,
	codeStyle,
	codeProps,
	className,
	style,
	...rest
}: CodeProps) {
	const deck = useContext(RevealContext);
	const codeRef = useRef<HTMLElement>(null);
	const lastHighlightSignatureRef = useRef<string>('');

	const rawCode = typeof code === 'string' ? code : typeof children === 'string' ? children : '';
	const normalizedCode = useMemo(() => (trim ? normalizeCode(rawCode) : rawCode), [rawCode, trim]);
	const lineNumbersValue =
		lineNumbers === true
			? ''
			: lineNumbers === false || lineNumbers == null
				? undefined
				: String(lineNumbers);
	const codeClasses = [language, codeClassName].filter(Boolean).join(' ');
	const preClasses = ['code-wrapper', className].filter(Boolean).join(' ');

	useLayoutEffect(() => {
		const block = codeRef.current;
		if (!block || !deck) return;

		const plugin = deck.getPlugin?.('highlight') as HighlightPlugin | undefined;
		if (!plugin || typeof plugin.highlightBlock !== 'function') return;

		const highlightSignature = [
			normalizedCode,
			language || '',
			codeClassName || '',
			lineNumbersValue == null ? '__none__' : `lineNumbers:${lineNumbersValue}`,
			startFrom == null ? '' : String(startFrom),
			noEscape ? '1' : '0',
		].join('::');

		if (
			lastHighlightSignatureRef.current === highlightSignature &&
			block.getAttribute('data-highlighted') === 'yes'
		) {
			return;
		}

		cleanupGeneratedFragments(block);
		block.textContent = normalizedCode;
		block.removeAttribute('data-highlighted');
		block.classList.remove('hljs');
		block.classList.remove('has-highlights');

		// Restore source attributes before each highlight call since RevealHighlight mutates
		// data-line-numbers on the original block when it expands multi-step highlights.
		if (lineNumbersValue == null) block.removeAttribute('data-line-numbers');
		else block.setAttribute('data-line-numbers', lineNumbersValue);
		if (startFrom == null) block.removeAttribute('data-ln-start-from');
		else block.setAttribute('data-ln-start-from', String(startFrom));
		if (noEscape) block.setAttribute('data-noescape', '');
		else block.removeAttribute('data-noescape');

		plugin.highlightBlock(block);

		const slide = typeof block.closest === 'function' ? block.closest('section') : null;
		if (slide && typeof deck.syncSlide === 'function') {
			deck.syncSlide(slide as HTMLElement);
		}

		lastHighlightSignatureRef.current = highlightSignature;
	}, [deck, normalizedCode, language, codeClassName, lineNumbersValue, startFrom, noEscape]);

	return (
		<pre className={preClasses} style={style} {...rest}>
			<code
				{...codeProps}
				ref={codeRef}
				className={codeClasses || undefined}
				style={codeStyle}
				data-line-numbers={lineNumbersValue}
				data-ln-start-from={startFrom}
				data-noescape={noEscape ? '' : undefined}
			>
				{normalizedCode}
			</code>
		</pre>
	);
}
