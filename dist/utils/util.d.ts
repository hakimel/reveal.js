/**
 * Extend object a with the properties of object b.
 * If there's a conflict, object b takes precedence.
 *
 * @param {object} a
 * @param {object} b
 */
export declare const extend: (a: Record<string, any>, b: Record<string, any>) => Record<string, any>;
/**
 * querySelectorAll but returns an Array.
 */
export declare const queryAll: (el: Element | Document, selector: string) => Element[];
/**
 * classList.toggle() with cross browser support
 */
export declare const toggleClass: (el: Element, className: string, value: boolean) => void;
type DeserializedValue = string | number | boolean | null;
/**
 * Utility for deserializing a value.
 *
 * @param {*} value
 * @return {*}
 */
export declare const deserialize: (value: string) => DeserializedValue;
/**
 * Measures the distance in pixels between point a
 * and point b.
 *
 * @param {object} a point with x/y properties
 * @param {object} b point with x/y properties
 *
 * @return {number}
 */
export declare const distanceBetween: (a: {
    x: number;
    y: number;
}, b: {
    x: number;
    y: number;
}) => number;
/**
 * Applies a CSS transform to the target element.
 *
 * @param {HTMLElement} element
 * @param {string} transform
 */
export declare const transformElement: (element: HTMLElement, transform: string) => void;
/**
 * Element.matches with IE support.
 *
 * @param {HTMLElement} target The element to match
 * @param {String} selector The CSS selector to match
 * the element against
 *
 * @return {Boolean}
 */
export declare const matches: (target: any, selector: string) => boolean;
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
export declare const closest: (target: Element | null, selector: string) => Element | null;
/**
 * Handling the fullscreen functionality via the fullscreen API
 *
 * @see http://fullscreen.spec.whatwg.org/
 * @see https://developer.mozilla.org/en-US/docs/DOM/Using_fullscreen_mode
 */
export declare const enterFullscreen: (element?: Element) => void;
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
export declare const createSingletonNode: (container: Element, tagname: string, classname: string, innerHTML?: string) => Element;
/**
 * Injects the given CSS styles into the DOM.
 *
 * @param {string} value
 */
export declare const createStyleSheet: (value: string) => HTMLStyleElement;
/**
 * Returns a key:value hash of all query params.
 */
export declare const getQueryHash: () => Record<string, DeserializedValue>;
/**
 * Returns the remaining height within the parent of the
 * target element.
 *
 * remaining height = [ configured parent height ] - [ current parent height ]
 *
 * @param {HTMLElement} element
 * @param {number} [height]
 */
export declare const getRemainingHeight: (element: HTMLElement | null, height?: number) => number;
/**
 * Guess the MIME type for common file formats.
 */
export declare const getMimeTypeFromFile: (filename?: string) => string | undefined;
/**
 * Encodes a string for RFC3986-compliant URL format.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI#encoding_for_rfc3986
 *
 * @param {string} url
 */
export declare const encodeRFC3986URI: (url?: string) => string;
export {};
