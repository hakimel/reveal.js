const UA = navigator.userAgent;

export const isMobile =
  /(iphone|ipod|ipad|android)/gi.test(UA) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); // iPadOS

export const isChrome = /chrome/i.test(UA) && !/edge/i.test(UA);

export const isAndroid = /android/gi.test(UA);
