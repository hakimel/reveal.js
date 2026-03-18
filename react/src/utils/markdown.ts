import type { HTMLAttributes } from 'react';
import { Marked } from 'marked';
import { markedSmartypants } from 'marked-smartypants';
import type { MarkdownOptions } from '../types';

export const DEFAULT_SLIDE_SEPARATOR = '\r?\n---\r?\n';
export const DEFAULT_VERTICAL_SEPARATOR = null;
export const DEFAULT_NOTES_SEPARATOR = '^\\s*notes?:';
export const DEFAULT_ELEMENT_ATTRIBUTES_SEPARATOR = '\\.element\\s*?(.+?)$';
export const DEFAULT_SLIDE_ATTRIBUTES_SEPARATOR = '\\.slide:\\s*?(\\S.+?)$';

const CODE_LINE_NUMBER_REGEX = /\[\s*((\d*):)?\s*([\s\d,|-]*)\]/;

const HTML_ESCAPE_MAP: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
};

type MarkdownLeaf = {
	key: string;
	html: string;
};

export type MarkdownRenderNode =
	| {
			type: 'slide';
			key: string;
			slide: MarkdownLeaf;
	  }
	| {
			type: 'stack';
			key: string;
			slides: MarkdownLeaf[];
	  };

export function normalizeMarkdownSource(markdown: string) {
	const leadingWhitespace = markdown.match(/^\n?(\s*)/)?.[1].length ?? 0;
	const leadingTabs = markdown.match(/^\n?(\t*)/)?.[1].length ?? 0;

	if (leadingTabs > 0) {
		return markdown.replace(new RegExp(`\\n?\\t{${leadingTabs}}(.*)`, 'g'), (_match, line) => {
			return `\n${line}`;
		});
	}

	if (leadingWhitespace > 1) {
		return markdown.replace(new RegExp(`\\n? {${leadingWhitespace}}(.*)`, 'g'), (_match, line) => {
			return `\n${line}`;
		});
	}

	return markdown;
}

function escapeForHTML(input: string) {
	return input.replace(/([&<>'"])/g, (char) => HTML_ESCAPE_MAP[char]);
}

export function createMarkedInstance(options: MarkdownOptions = {}) {
	const { renderer: customRenderer, animateLists, smartypants, ...markedOptions } = options;

	const renderer =
		customRenderer ||
		({
			code({ text, lang }: { text: string; lang?: string }) {
				let language = lang || '';
				let lineNumberOffset = '';
				let lineNumbers = '';

				if (CODE_LINE_NUMBER_REGEX.test(language)) {
					const lineNumberOffsetMatch = language.match(CODE_LINE_NUMBER_REGEX)?.[2];
					if (lineNumberOffsetMatch) {
						lineNumberOffset = `data-ln-start-from="${lineNumberOffsetMatch.trim()}"`;
					}

					lineNumbers = language.match(CODE_LINE_NUMBER_REGEX)?.[3]?.trim() || '';
					lineNumbers = `data-line-numbers="${lineNumbers}"`;
					language = language.replace(CODE_LINE_NUMBER_REGEX, '').trim();
				}

				text = escapeForHTML(text);

				return `<pre><code ${lineNumbers} ${lineNumberOffset} class="${language}">${text}</code></pre>`;
			},
		} satisfies Record<string, unknown>);

	if (animateLists === true && !customRenderer) {
		(renderer as { listitem?: (this: any, token: any) => string }).listitem = function (
			this: { parser: { parseInline(tokens: unknown[]): string } },
			token: { tokens?: unknown[]; text?: string }
		) {
			const text = token.tokens ? this.parser.parseInline(token.tokens) : token.text || '';
			return `<li class="fragment">${text}</li>`;
		};
	}

	const markedInstance = new Marked();
	markedInstance.use({ renderer, ...markedOptions });

	if (smartypants) {
		markedInstance.use(markedSmartypants());
	}

	return markedInstance;
}

function ensureParsedMarkdown(result: string | Promise<string>) {
	if (typeof result === 'string') return result;

	throw new Error(
		'Async markdown parsing is not supported here because Reveal markdown parsing is synchronous.'
	);
}

function createSlideHtml(markdown: string, markedInstance: Marked, notesSeparator: string) {
	const notesMatch = markdown.split(new RegExp(notesSeparator, 'mgi'));
	let slideMarkdown = markdown;
	let notesHtml = '';

	if (notesMatch.length === 2) {
		slideMarkdown = notesMatch[0];
		notesHtml = `<aside class="notes">${ensureParsedMarkdown(
			markedInstance.parse(notesMatch[1].trim())
		)}</aside>`;
	}

	return `${ensureParsedMarkdown(markedInstance.parse(slideMarkdown))}${notesHtml}`;
}

export function buildMarkdownNodes(
	markdown: string,
	markedInstance: Marked,
	separator: string,
	verticalSeparator: string | null,
	notesSeparator: string
): MarkdownRenderNode[] {
	const separatorRegex = new RegExp(
		separator + (verticalSeparator ? `|${verticalSeparator}` : ''),
		'mg'
	);
	const horizontalSeparatorRegex = new RegExp(separator);

	let matches: RegExpExecArray | null;
	let lastIndex = 0;
	let isHorizontal = true;
	let wasHorizontal = true;
	const sectionStack: Array<string | string[]> = [];

	// This mirrors the core plugin's slidify pass so that horizontal and vertical
	// separators produce the exact same section nesting as reveal.js markdown does.
	while ((matches = separatorRegex.exec(markdown))) {
		isHorizontal = horizontalSeparatorRegex.test(matches[0]);

		if (!isHorizontal && wasHorizontal) {
			sectionStack.push([]);
		}

		const content = markdown.substring(lastIndex, matches.index);

		if (isHorizontal && wasHorizontal) {
			sectionStack.push(content);
		} else {
			(sectionStack[sectionStack.length - 1] as string[]).push(content);
		}

		lastIndex = separatorRegex.lastIndex;
		wasHorizontal = isHorizontal;
	}

	(wasHorizontal ? sectionStack : (sectionStack[sectionStack.length - 1] as string[])).push(
		markdown.substring(lastIndex)
	);

	return sectionStack.map((entry, horizontalIndex) => {
		if (Array.isArray(entry)) {
			return {
				type: 'stack' as const,
				key: `h${horizontalIndex}`,
				slides: entry.map((slideMarkdown, verticalIndex) => ({
					key: `h${horizontalIndex}-v${verticalIndex}`,
					html: createSlideHtml(slideMarkdown, markedInstance, notesSeparator),
				})),
			};
		}

		return {
			type: 'slide' as const,
			key: `h${horizontalIndex}`,
			slide: {
				key: `h${horizontalIndex}`,
				html: createSlideHtml(entry, markedInstance, notesSeparator),
			},
		};
	});
}

function addAttributeInElement(node: ChildNode, elementTarget: Element | null, separator: string) {
	if (!elementTarget || node.nodeType !== Node.COMMENT_NODE || node.nodeValue == null) {
		return false;
	}

	const markdownClassesInElementsRegex = new RegExp(separator, 'mg');
	const markdownClassRegex = new RegExp('([^"= ]+?)="([^"]+?)"|(data-[^"= ]+?)(?=[" ])', 'mg');
	let nodeValue = node.nodeValue;
	const matches = markdownClassesInElementsRegex.exec(nodeValue);

	if (!matches) return false;

	const classes = matches[1];
	nodeValue =
		nodeValue.substring(0, matches.index) +
		nodeValue.substring(markdownClassesInElementsRegex.lastIndex);
	node.nodeValue = nodeValue;

	let matchesClass: RegExpExecArray | null;
	while ((matchesClass = markdownClassRegex.exec(classes))) {
		if (matchesClass[2]) {
			elementTarget.setAttribute(matchesClass[1], matchesClass[2]);
		} else {
			elementTarget.setAttribute(matchesClass[3], '');
		}
	}

	return true;
}

export function addAttributes(
	section: HTMLElement,
	element: ChildNode | HTMLElement,
	previousElement: Element | null,
	separatorElementAttributes: string,
	separatorSectionAttributes: string
) {
	if ('childNodes' in element && element.childNodes.length > 0) {
		let previousParentElement: Element | null =
			element instanceof Element ? element : previousElement;

		for (let index = 0; index < element.childNodes.length; index += 1) {
			const childElement = element.childNodes[index];

			if (index > 0) {
				let previousIndex = index - 1;
				while (previousIndex >= 0) {
					const previousChildElement = element.childNodes[previousIndex];
					if (
						typeof (previousChildElement as Element).setAttribute === 'function' &&
						(previousChildElement as Element).tagName !== 'BR'
					) {
						previousParentElement = previousChildElement as Element;
						break;
					}
					previousIndex -= 1;
				}
			}

			let parentSection = section;
			if ((childElement as Element).nodeName === 'SECTION') {
				parentSection = childElement as HTMLElement;
				previousParentElement = childElement as Element;
			}

			if (
				typeof (childElement as Element).setAttribute === 'function' ||
				childElement.nodeType === Node.COMMENT_NODE
			) {
				addAttributes(
					parentSection,
					childElement as ChildNode | HTMLElement,
					previousParentElement,
					separatorElementAttributes,
					separatorSectionAttributes
				);
			}
		}
	}

	if (element.nodeType !== Node.COMMENT_NODE) return;

	let targetElement = previousElement;
	if (targetElement && (targetElement.tagName === 'UL' || targetElement.tagName === 'OL')) {
		targetElement = targetElement.lastElementChild || targetElement;
	}

	if (addAttributeInElement(element, targetElement, separatorElementAttributes) === false) {
		addAttributeInElement(element, section, separatorSectionAttributes);
	}
}

export function hashString(input: string) {
	let hash = 5381;

	for (let index = 0; index < input.length; index += 1) {
		hash = (hash * 33) ^ input.charCodeAt(index);
	}

	return (hash >>> 0).toString(36);
}

function serializeSignatureValue(value: unknown): unknown {
	if (
		value == null ||
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	) {
		return value;
	}

	if (Array.isArray(value)) {
		return value.map(serializeSignatureValue);
	}

	if (typeof value === 'object') {
		return Object.entries(value as Record<string, unknown>)
			.filter(([, entryValue]) => entryValue !== undefined && typeof entryValue !== 'function')
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([key, entryValue]) => [key, serializeSignatureValue(entryValue)]);
	}

	return String(value);
}

export function getSectionPropsSignature(attributes: HTMLAttributes<HTMLElement>) {
	return JSON.stringify(
		Object.entries(attributes)
			.filter(([, value]) => value !== undefined && typeof value !== 'function')
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([key, value]) => [key, serializeSignatureValue(value)])
	);
}

export function getErrorMessage(error: unknown) {
	if (error instanceof Error && error.message) return error.message;
	return String(error);
}
