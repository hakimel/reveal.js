const UA = navigator.userAgent;
const testElement = document.createElement( 'div' );

export const isMobile = /(iphone|ipod|ipad|android)/gi.test( UA ) ||
						( navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 ); // iPadOS

export const isChrome = /chrome/i.test( UA ) && !/edge/i.test( UA );

export const isAndroid = /android/gi.test( UA );

// Flags if we should use zoom instead of transform to scale
// up slides. Zoom produces crisper results but has a lot of
// xbrowser quirks so we only use it in whitelisted browsers.
export const supportsZoom = 'zoom' in testElement.style && !isMobile &&
				( isChrome || /Version\/[\d\.]+.*Safari/.test( UA ) );