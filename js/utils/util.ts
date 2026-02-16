/**
 * Extend object a with the properties of object b.
 * If there's a conflict, object b takes precedence.
 *
 * @param {object} a
 * @param {object} b
 */
export const extend = (a: Record<string, any>, b: Record<string, any>) => {
	for (let i in b) {
		a[i] = b[i];
	}

	return a;
};

/**
 * querySelectorAll but returns an Array.
 */
export const queryAll = (el: Element | Document, selector: string): Element[] => {
	return Array.from(el.querySelectorAll(selector));
};

/**
 * classList.toggle() with cross browser support
 */
export const toggleClass = (el: Element, className: string, value: boolean) => {
	if (value) {
		el.classList.add(className);
	} else {
		el.classList.remove(className);
	}
};

type DeserializedValue = string | number | boolean | null;

/**
 * Utility for deserializing a value.
 *
 * @param {*} value
 * @return {*}
 */
export const deserialize = (value: string): DeserializedValue => {
	if (typeof value === 'string') {
		if (value === 'null') return null;
		else if (value === 'true') return true;
		else if (value === 'false') return false;
		else if (value.match(/^-?[\d\.]+$/)) return parseFloat(value);
	}

	return value;
};

/**
 * Measures the distance in pixels between point a
 * and point b.
 *
 * @param {object} a point with x/y properties
 * @param {object} b point with x/y properties
 *
 * @return {number}
 */
export const distanceBetween = (
	a: { x: number; y: number },
	b: { x: number; y: number }
): number => {
	let dx = a.x - b.x,
		dy = a.y - b.y;

	return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Applies a CSS transform to the target element.
 *
 * @param {HTMLElement} element
 * @param {string} transform
 */
export const transformElement = (element: HTMLElement, transform: string) => {
	element.style.transform = transform;
};

/**
 * Element.matches with IE support.
 *
 * @param {HTMLElement} target The element to match
 * @param {String} selector The CSS selector to match
 * the element against
 *
 * @return {Boolean}
 */
export const matches = (target: any, selector: string): boolean => {
	let matchesMethod = target.matches || target.matchesSelector || target.msMatchesSelector;

	return !!(matchesMethod && matchesMethod.call(target, selector));
};

/**
 * Find the closest parent that matches the given
 * selector.
 *
 * @param {HTMLElement} target The child element
 * @param {String} selector The CSS selector to match
 * the parents against
 *
 * @return {HTMLElement} The matched parent or null
 * if no matching parent was found
 */
export const closest = (target: Element | null, selector: string): Element | null => {
	// Native Element.closest
	if (target && typeof target.closest === 'function') {
		return target.closest(selector);
	}

	// Polyfill
	while (target) {
		if (matches(target, selector)) {
			return target;
		}

		// Keep searching
		target = target.parentElement;
	}

	return null;
};

/**
 * Handling the fullscreen functionality via the fullscreen API
 *
 * @see http://fullscreen.spec.whatwg.org/
 * @see https://developer.mozilla.org/en-US/docs/DOM/Using_fullscreen_mode
 */
export const enterFullscreen = (element?: Element) => {
	element = element || document.documentElement;

	// Check which implementation is available
	let requestMethod =
		(element as any).requestFullscreen ||
		(element as any).webkitRequestFullscreen ||
		(element as any).webkitRequestFullScreen ||
		(element as any).mozRequestFullScreen ||
		(element as any).msRequestFullscreen;

	if (requestMethod) {
		requestMethod.apply(element);
	}
};

/**
 * Creates an HTML element and returns a reference to it.
 * If the element already exists the existing instance will
 * be returned.
 *
 * @param {HTMLElement} container
 * @param {string} tagname
 * @param {string} classname
 * @param {string} innerHTML
 *
 * @return {HTMLElement}
 */
export const createSingletonNode = (
	container: Element,
	tagname: string,
	classname: string,
	innerHTML: string = ''
): Element => {
	// Find all nodes matching the description
	let nodes = container.querySelectorAll('.' + classname);

	// Check all matches to find one which is a direct child of
	// the specified container
	for (let i = 0; i < nodes.length; i++) {
		let testNode = nodes[i];
		if (testNode.parentNode === container) {
			return testNode;
		}
	}

	// If no node was found, create it now
	let node = document.createElement(tagname);
	node.className = classname;
	node.innerHTML = innerHTML;
	container.appendChild(node);

	return node;
};

/**
 * Injects the given CSS styles into the DOM.
 *
 * @param {string} value
 */
export const createStyleSheet = (value: string): HTMLStyleElement => {
	let tag = document.createElement('style');

	if (value && value.length > 0) {
		tag.appendChild(document.createTextNode(value));
	}

	document.head.appendChild(tag);

	return tag;
};

/**
 * Returns a key:value hash of all query params.
 */
export const getQueryHash = (): Record<string, DeserializedValue> => {
	let query: Record<string, DeserializedValue> = {};

	location.search.replace(/[A-Z0-9]+?=([\w\.%-]*)/gi, (a: string) => {
		const key = a.split('=').shift();
		const value = a.split('=').pop();
		if (key && value !== undefined) {
			query[key] = value;
		}
		return a;
	});

	// Basic deserialization
	for (let i in query) {
		let value = query[i];

		query[i] = deserialize(unescape(value as string));
	}

	// Do not accept new dependencies via query config to avoid
	// the potential of malicious script injection
	if (typeof query['dependencies'] !== 'undefined') delete query['dependencies'];

	return query;
};

/**
 * Returns the remaining height within the parent of the
 * target element.
 *
 * remaining height = [ configured parent height ] - [ current parent height ]
 *
 * @param {HTMLElement} element
 * @param {number} [height]
 */
export const getRemainingHeight = (element: HTMLElement | null, height: number = 0): number => {
	if (element) {
		let newHeight: number,
			oldHeight = element.style.height;

		// Change the .stretch element height to 0 in order find the height of all
		// the other elements
		element.style.height = '0px';

		// In Overview mode, the parent (.slide) height is set of 700px.
		// Restore it temporarily to its natural height.
		if (element.parentElement) {
			element.parentElement.style.height = 'auto';
		}

		newHeight = height - (element.parentElement?.offsetHeight || 0);

		// Restore the old height, just in case
		element.style.height = oldHeight + 'px';

		// Clear the parent (.slide) height. .removeProperty works in IE9+
		if (element.parentElement) {
			element.parentElement.style.removeProperty('height');
		}

		return newHeight;
	}

	return height;
};

const fileExtensionToMimeMap: Record<string, string> = {
	mp4: 'video/mp4',
	m4a: 'video/mp4',
	ogv: 'video/ogg',
	mpeg: 'video/mpeg',
	webm: 'video/webm',
};

/**
 * Guess the MIME type for common file formats.
 */
export const getMimeTypeFromFile = (filename: string = ''): string | undefined => {
	const extension = filename.split('.').pop();
	return extension ? fileExtensionToMimeMap[extension] : undefined;
};

/**
 * Encodes a string for RFC3986-compliant URL format.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI#encoding_for_rfc3986
 *
 * @param {string} url
 */
export const encodeRFC3986URI = (url: string = ''): string => {
	return encodeURI(url)
		.replace(/%5B/g, '[')
		.replace(/%5D/g, ']')
		.replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
};
