/**
 * Converts various color input formats to an {r:0,g:0,b:0} object.
 *
 * @param {string} color The string representation of a color
 * @example
 * colorToRgb('#000');
 * @example
 * colorToRgb('#000000');
 * @example
 * colorToRgb('rgb(0,0,0)');
 * @example
 * colorToRgb('rgba(0,0,0)');
 *
 * @return {{r: number, g: number, b: number, [a]: number}|null}
 */
export declare const colorToRgb: (color: string) => {
    r: number;
    g: number;
    b: number;
    a?: undefined;
} | {
    r: number;
    g: number;
    b: number;
    a: number;
} | null;
/**
 * Calculates brightness on a scale of 0-255.
 *
 * @param {string} color See colorToRgb for supported formats.
 * @see {@link colorToRgb}
 */
export declare const colorBrightness: (color: string | {
    r: number;
    g: number;
    b: number;
} | null) => number | null;
