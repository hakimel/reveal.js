import { extend, queryAll, closest, getMimeTypeFromFile, encodeRFC3986URI } from '../utils/util.js'
import { isMobile } from '../utils/device.js'

import fitty from 'fitty';

/**
 * Handles loading, unloading and playback of slide
 * content such as images, videos and iframes.
 */
export default class SlideContent {

	allowedToPlayAudio = null;

	constructor( Reveal ) {

		this.Reveal = Reveal;

		this.startEmbeddedMedia = this.startEmbeddedMedia.bind( this );
		this.startEmbeddedIframe = this.startEmbeddedIframe.bind( this );
		this.preventIframeAutoFocus = this.preventIframeAutoFocus.bind( this );
		this.ensureMobileMediaPlaying = this.ensureMobileMediaPlaying.bind( this );

		this.failedAudioPlaybackTargets = new Set();
		this.failedVideoPlaybackTargets = new Set();
		this.failedMutedVideoPlaybackTargets = new Set();

		this.renderMediaPlayButton();

	}

	renderMediaPlayButton() {

		this.mediaPlayButton = document.createElement( 'button' );
		this.mediaPlayButton.className = 'r-overlay-button r-media-play-button';
		this.mediaPlayButton.addEventListener( 'click', () => {
			this.resetTemporarilyMutedMedia();

			const failedTargets = new Set( [
				...this.failedAudioPlaybackTargets,
				...this.failedVideoPlaybackTargets,
				...this.failedMutedVideoPlaybackTargets
			] );

			failedTargets.forEach( target => {
				this.startEmbeddedMedia( { target: target } );
			} );

			this.clearMediaPlaybackErrors();
		} );

	}

	/**
	 * Should the given element be preloaded?
	 * Decides based on local element attributes and global config.
	 *
	 * @param {HTMLElement} element
	 */
	shouldPreload( element ) {

		if( this.Reveal.isScrollView() ) {
			return true;
		}

		// Prefer an explicit global preload setting
		let preload = this.Reveal.getConfig().preloadIframes;

		// If no global setting is available, fall back on the element's
		// own preload setting
		if( typeof preload !== 'boolean' ) {
			preload = element.hasAttribute( 'data-preload' );
		}

		return preload;
	}

	/**
	 * Called when the given slide is within the configured view
	 * distance. Shows the slide element and loads any content
	 * that is set to load lazily (data-src).
	 *
	 * @param {HTMLElement} slide Slide to show
	 */
	load( slide, options = {} ) {

		// Show the slide element
		const displayValue = this.Reveal.getConfig().display;
		if( displayValue.includes('!important') ) {
			const value = displayValue.replace(/\s*!important\s*$/, '').trim();
			slide.style.setProperty('display', value, 'important');
		} else {
			slide.style.display = displayValue;
		}

		// Media and iframe elements with data-src attributes
		queryAll( slide, 'img[data-src], video[data-src], audio[data-src], iframe[data-src]' ).forEach( element => {
			const isIframe = element.tagName === 'IFRAME';
			if( !isIframe || this.shouldPreload( element ) ) {
				element.setAttribute( 'src', element.getAttribute( 'data-src' ) );
				element.setAttribute( 'data-lazy-loaded', '' );
				element.removeAttribute( 'data-src' );

				if( isIframe ) {
					element.addEventListener( 'load', this.preventIframeAutoFocus );
				}
			}
		} );

		// Media elements with <source> children
		queryAll( slide, 'video, audio' ).forEach( media => {
			let sources = 0;

			queryAll( media, 'source[data-src]' ).forEach( source => {
				source.setAttribute( 'src', source.getAttribute( 'data-src' ) );
				source.removeAttribute( 'data-src' );
				source.setAttribute( 'data-lazy-loaded', '' );
				sources += 1;
			} );

			// Enable inline video playback in mobile Safari
			if( isMobile && media.tagName === 'VIDEO' ) {
				media.setAttribute( 'playsinline', '' );
			}

			// If we rewrote sources for this video/audio element, we need
			// to manually tell it to load from its new origin
			if( sources > 0 ) {
				media.load();
			}
		} );


		// Show the corresponding background element
		let background = slide.slideBackgroundElement;
		if( background ) {
			background.style.display = 'block';

			let backgroundContent = slide.slideBackgroundContentElement;
			let backgroundIframe = slide.getAttribute( 'data-background-iframe' );

			// If the background contains media, load it
			if( background.hasAttribute( 'data-loaded' ) === false ) {
				background.setAttribute( 'data-loaded', 'true' );

				let backgroundImage = slide.getAttribute( 'data-background-image' ),
					backgroundVideo = slide.getAttribute( 'data-background-video' ),
					backgroundVideoLoop = slide.hasAttribute( 'data-background-video-loop' ),
					backgroundVideoMuted = slide.hasAttribute( 'data-background-video-muted' );

				// Images
				if( backgroundImage ) {
					// base64
					if(  /^data:/.test( backgroundImage.trim() ) ) {
						backgroundContent.style.backgroundImage = `url(${backgroundImage.trim()})`;
					}
					// URL(s)
					else {
						backgroundContent.style.backgroundImage = backgroundImage.split( ',' ).map( background => {
							// Decode URL(s) that are already encoded first
							let decoded = decodeURI(background.trim());
							return `url(${encodeRFC3986URI(decoded)})`;
						}).join( ',' );
					}
				}
				// Videos
				else if ( backgroundVideo ) {
					let video = document.createElement( 'video' );

					if( backgroundVideoLoop ) {
						video.setAttribute( 'loop', '' );
					}

					if( backgroundVideoMuted || this.Reveal.isSpeakerNotes() ) {
						video.muted = true;
					}

					// Enable inline playback in mobile Safari
					if( isMobile ) {
						video.setAttribute( 'playsinline', '' );
					}

					// Support comma separated lists of video sources
					backgroundVideo.split( ',' ).forEach( source => {
						const sourceElement = document.createElement( 'source' );
						sourceElement.setAttribute( 'src', source );

						let type = getMimeTypeFromFile( source );
						if( type ) {
							sourceElement.setAttribute( 'type', type );
						}

						video.appendChild( sourceElement );
					} );

					backgroundContent.appendChild( video );
				}
				// Iframes
				else if( backgroundIframe && options.excludeIframes !== true ) {
					let iframe = document.createElement( 'iframe' );
					iframe.setAttribute( 'allowfullscreen', '' );
					iframe.setAttribute( 'mozallowfullscreen', '' );
					iframe.setAttribute( 'webkitallowfullscreen', '' );
					iframe.setAttribute( 'allow', 'autoplay' );

					iframe.setAttribute( 'data-src', backgroundIframe );

					iframe.style.width  = '100%';
					iframe.style.height = '100%';
					iframe.style.maxHeight = '100%';
					iframe.style.maxWidth = '100%';

					backgroundContent.appendChild( iframe );
				}
			}

			// Start loading preloadable iframes
			let backgroundIframeElement = backgroundContent.querySelector( 'iframe[data-src]' );
			if( backgroundIframeElement ) {

				// Check if this iframe is eligible to be preloaded
				if( this.shouldPreload( background ) && !/autoplay=(1|true|yes)/gi.test( backgroundIframe ) ) {
					if( backgroundIframeElement.getAttribute( 'src' ) !== backgroundIframe ) {
						backgroundIframeElement.setAttribute( 'src', backgroundIframe );
					}
				}

			}

		}

		this.layout( slide );

	}

	/**
	 * Applies JS-dependent layout helpers for the scope.
	 */
	layout( scopeElement ) {

		// Autosize text with the r-fit-text class based on the
		// size of its container. This needs to happen after the
		// slide is visible in order to measure the text.
		Array.from( scopeElement.querySelectorAll( '.r-fit-text' ) ).forEach( element => {
			fitty( element, {
				minSize: 24,
				maxSize: this.Reveal.getConfig().height * 0.8,
				observeMutations: false,
				observeWindow: false
			} );
		} );

	}

	/**
	 * Unloads and hides the given slide. This is called when the
	 * slide is moved outside of the configured view distance.
	 *
	 * @param {HTMLElement} slide
	 */
	unload( slide ) {

		// Hide the slide element
		slide.style.display = 'none';

		// Hide the corresponding background element
		let background = this.Reveal.getSlideBackground( slide );
		if( background ) {
			background.style.display = 'none';

			// Unload any background iframes
			queryAll( background, 'iframe[src]' ).forEach( element => {
				element.removeAttribute( 'src' );
			} );
		}

		// Reset lazy-loaded media elements with src attributes
		queryAll( slide, 'video[data-lazy-loaded][src], audio[data-lazy-loaded][src], iframe[data-lazy-loaded][src]' ).forEach( element => {
			element.setAttribute( 'data-src', element.getAttribute( 'src' ) );
			element.removeAttribute( 'src' );
		} );

		// Reset lazy-loaded media elements with <source> children
		queryAll( slide, 'video[data-lazy-loaded] source[src], audio source[src]' ).forEach( source => {
			source.setAttribute( 'data-src', source.getAttribute( 'src' ) );
			source.removeAttribute( 'src' );
		} );

	}

	/**
	 * Enforces origin-specific format rules for embedded media.
	 */
	formatEmbeddedContent() {

		let _appendParamToIframeSource = ( sourceAttribute, sourceURL, param ) => {
			queryAll( this.Reveal.getSlidesElement(), 'iframe['+ sourceAttribute +'*="'+ sourceURL +'"]' ).forEach( el => {
				let src = el.getAttribute( sourceAttribute );
				if( src && src.indexOf( param ) === -1 ) {
					el.setAttribute( sourceAttribute, src + ( !/\?/.test( src ) ? '?' : '&' ) + param );
				}
			});
		};

		// YouTube frames must include "?enablejsapi=1"
		_appendParamToIframeSource( 'src', 'youtube.com/embed/', 'enablejsapi=1' );
		_appendParamToIframeSource( 'data-src', 'youtube.com/embed/', 'enablejsapi=1' );

		// Vimeo frames must include "?api=1"
		_appendParamToIframeSource( 'src', 'player.vimeo.com/', 'api=1' );
		_appendParamToIframeSource( 'data-src', 'player.vimeo.com/', 'api=1' );

	}

	/**
	 * Start playback of any embedded content inside of
	 * the given element.
	 *
	 * @param {HTMLElement} element
	 */
	startEmbeddedContent( element ) {

		if( element ) {

			const isSpeakerNotesWindow = this.Reveal.isSpeakerNotes();

			// Restart GIFs
			queryAll( element, 'img[src$=".gif"]' ).forEach( el => {
				// Setting the same unchanged source like this was confirmed
				// to work in Chrome, FF & Safari
				el.setAttribute( 'src', el.getAttribute( 'src' ) );
			} );

			// HTML5 media elements
			queryAll( element, 'video, audio' ).forEach( el => {
				if( closest( el, '.fragment' ) && !closest( el, '.fragment.visible' ) ) {
					return;
				}

				// Prefer an explicit global autoplay setting
				let autoplay = this.Reveal.getConfig().autoPlayMedia;

				// If no global setting is available, fall back on the element's
				// own autoplay setting
				if( typeof autoplay !== 'boolean' ) {
					autoplay = el.hasAttribute( 'data-autoplay' ) || !!closest( el, '.slide-background' );
				}

				if( autoplay && typeof el.play === 'function' ) {

					// In the speaker view we only auto-play muted media
					if( isSpeakerNotesWindow && !el.muted ) return;

					// If the media is ready, start playback
					if( el.readyState > 1 ) {
						this.startEmbeddedMedia( { target: el } );
					}
					// Mobile devices never fire a loaded event so instead
					// of waiting, we initiate playback
					else if( isMobile ) {
						el.addEventListener( 'canplay', this.ensureMobileMediaPlaying );

						this.playMediaElement( el );
					}
					// If the media isn't loaded, wait before playing
					else {
						el.removeEventListener( 'loadeddata', this.startEmbeddedMedia ); // remove first to avoid dupes
						el.addEventListener( 'loadeddata', this.startEmbeddedMedia );
					}

				}
			} );

			// Don't play iframe content in the speaker view since we can't
			// guarantee that it's muted
			if( !isSpeakerNotesWindow ) {

				// Normal iframes
				queryAll( element, 'iframe[src]' ).forEach( el => {
					if( closest( el, '.fragment' ) && !closest( el, '.fragment.visible' ) ) {
						return;
					}

					this.startEmbeddedIframe( { target: el } );
				} );

				// Lazy loading iframes
				queryAll( element, 'iframe[data-src]' ).forEach( el => {
					if( closest( el, '.fragment' ) && !closest( el, '.fragment.visible' ) ) {
						return;
					}

					if( el.getAttribute( 'src' ) !== el.getAttribute( 'data-src' ) ) {
						el.removeEventListener( 'load', this.startEmbeddedIframe ); // remove first to avoid dupes
						el.addEventListener( 'load', this.startEmbeddedIframe );
						el.setAttribute( 'src', el.getAttribute( 'data-src' ) );
					}
				} );

			}

		}

	}

	/**
	 * Ensure that an HTMLMediaElement is playing on mobile devices.
	 *
	 * This is a workaround for a bug in mobile Safari where
	 * the media fails to display if many videos are started
	 * at the same moment. When this happens, Mobile Safari
	 * reports the video is playing, and the current time
	 * advances, but nothing is visible.
	 *
	 * @param {Event} event
	 */
	ensureMobileMediaPlaying( event ) {

		const el = event.target;

		// Ignore this check incompatible browsers
		if( typeof el.getVideoPlaybackQuality !== 'function' ) {
			return;
		}

		setTimeout( () => {

			const playing = el.paused === false;
			const totalFrames = el.getVideoPlaybackQuality().totalVideoFrames;

			if( playing && totalFrames === 0 ) {
				el.load();
				el.play();
			}

		}, 1000 );

	}

	/**
	 * Starts playing an embedded video/audio element after
	 * it has finished loading.
	 *
	 * @param {object} event
	 */
	startEmbeddedMedia( event ) {

		let isAttachedToDOM = !!closest( event.target, 'html' ),
			isVisible  		= !!closest( event.target, '.present' );

		if( isAttachedToDOM && isVisible ) {
			// Don't restart if media is already playing
			if( event.target.paused || event.target.ended ) {
				event.target.currentTime = 0;
				this.playMediaElement( event.target );
			}
		}

		event.target.removeEventListener( 'loadeddata', this.startEmbeddedMedia );

	}

	/**
	 * Plays the given HTMLMediaElement and handles any playback
	 * errors, such as the browser not allowing audio to play without
	 * user action.
	 *
	 * @param {HTMLElement} mediaElement
	 */
	playMediaElement( mediaElement ) {

		const promise = mediaElement.play();

		if( promise && typeof promise.catch === 'function' ) {
			promise
				.then( () => {
					if( !mediaElement.muted ) {
						this.allowedToPlayAudio = true;
					}
				} )
				.catch( ( error ) => {
					if( error.name === 'NotAllowedError' ) {
						this.allowedToPlayAudio = false;

						// If this is a video, we record the error and try to play it
						// muted as a fallback. The user will be presented with an unmute
						// button.
						if( mediaElement.tagName === 'VIDEO' ) {
							this.onVideoPlaybackNotAllowed( mediaElement );

							let isAttachedToDOM = !!closest( mediaElement, 'html' ),
								isVisible  		= !!closest( mediaElement, '.present' ),
								isMuted 		= mediaElement.muted;

							if( isAttachedToDOM && isVisible && !isMuted ) {
								mediaElement.setAttribute( 'data-muted-by-reveal', 'true' );
								mediaElement.muted = true;
								mediaElement.play().catch(() => {
									this.onMutedVideoPlaybackNotAllowed( mediaElement );
								});
							}
						}
						else if( mediaElement.tagName === 'AUDIO' ) {
							this.onAudioPlaybackNotAllowed( mediaElement );
						}
					}
				} );
		}

	}

	/**
	 * "Starts" the content of an embedded iframe using the
	 * postMessage API.
	 *
	 * @param {object} event
	 */
	startEmbeddedIframe( event ) {

		let iframe = event.target;

		this.preventIframeAutoFocus( event );

		if( iframe && iframe.contentWindow ) {

			let isAttachedToDOM = !!closest( event.target, 'html' ),
				isVisible  		= !!closest( event.target, '.present' );

			if( isAttachedToDOM && isVisible ) {

				// Prefer an explicit global autoplay setting
				let autoplay = this.Reveal.getConfig().autoPlayMedia;

				// If no global setting is available, fall back on the element's
				// own autoplay setting
				if( typeof autoplay !== 'boolean' ) {
					autoplay = iframe.hasAttribute( 'data-autoplay' ) || !!closest( iframe, '.slide-background' );
				}

				// YouTube postMessage API
				if( /youtube\.com\/embed\//.test( iframe.getAttribute( 'src' ) ) && autoplay ) {
					iframe.contentWindow.postMessage( '{"event":"command","func":"playVideo","args":""}', '*' );
				}
				// Vimeo postMessage API
				else if( /player\.vimeo\.com\//.test( iframe.getAttribute( 'src' ) ) && autoplay ) {
					iframe.contentWindow.postMessage( '{"method":"play"}', '*' );
				}
				// Generic postMessage API
				else {
					iframe.contentWindow.postMessage( 'slide:start', '*' );
				}

			}

		}

	}

	/**
	 * Stop playback of any embedded content inside of
	 * the targeted slide.
	 *
	 * @param {HTMLElement} element
	 */
	stopEmbeddedContent( element, options = {} ) {

		options = extend( {
			// Defaults
			unloadIframes: true
		}, options );

		if( element && element.parentNode ) {
			// HTML5 media elements
			queryAll( element, 'video, audio' ).forEach( el => {
				if( !el.hasAttribute( 'data-ignore' ) && typeof el.pause === 'function' ) {
					el.setAttribute('data-paused-by-reveal', '');
					el.pause();

					if( isMobile ) {
						el.removeEventListener( 'canplay', this.ensureMobileMediaPlaying );
					}
				}
			} );

			// Generic postMessage API for non-lazy loaded iframes
			queryAll( element, 'iframe' ).forEach( el => {
				if( el.contentWindow ) el.contentWindow.postMessage( 'slide:stop', '*' );
				el.removeEventListener( 'load', this.preventIframeAutoFocus );
				el.removeEventListener( 'load', this.startEmbeddedIframe );
			});

			// YouTube postMessage API
			queryAll( element, 'iframe[src*="youtube.com/embed/"]' ).forEach( el => {
				if( !el.hasAttribute( 'data-ignore' ) && el.contentWindow && typeof el.contentWindow.postMessage === 'function' ) {
					el.contentWindow.postMessage( '{"event":"command","func":"pauseVideo","args":""}', '*' );
				}
			});

			// Vimeo postMessage API
			queryAll( element, 'iframe[src*="player.vimeo.com/"]' ).forEach( el => {
				if( !el.hasAttribute( 'data-ignore' ) && el.contentWindow && typeof el.contentWindow.postMessage === 'function' ) {
					el.contentWindow.postMessage( '{"method":"pause"}', '*' );
				}
			});

			if( options.unloadIframes === true ) {
				// Unload lazy-loaded iframes
				queryAll( element, 'iframe[data-src]' ).forEach( el => {
					// Only removing the src doesn't actually unload the frame
					// in all browsers (Firefox) so we set it to blank first
					el.setAttribute( 'src', 'about:blank' );
					el.removeAttribute( 'src' );
				} );
			}
		}

	}

	/**
	 * Checks whether media playback is blocked by the browser. This
	 * typically happens when media playback is initiated without a
	 * direct user interaction.
	 */
	isAllowedToPlayAudio() {

		return this.allowedToPlayAudio;

	}

	/**
	 * Shows a manual button in situations where autoamtic media playback
	 * is not allowed by the browser.
	 */
	showPlayOrUnmuteButton() {

		const audioTargets = this.failedAudioPlaybackTargets.size;
		const videoTargets = this.failedVideoPlaybackTargets.size;
		const mutedVideoTargets = this.failedMutedVideoPlaybackTargets.size;

		let label = 'Play media';

		if( mutedVideoTargets > 0 ) {
			label = 'Play video';
		}
		else if( videoTargets > 0 ) {
			label = 'Unmute video';
		}
		else if( audioTargets > 0 ) {
			label = 'Play audio';
		}

		this.mediaPlayButton.textContent = label;

		this.Reveal.getRevealElement().appendChild( this.mediaPlayButton );

	}

	onAudioPlaybackNotAllowed( target ) {

		this.failedAudioPlaybackTargets.add( target );
		this.showPlayOrUnmuteButton( target );

	}

	onVideoPlaybackNotAllowed( target ) {

		this.failedVideoPlaybackTargets.add( target );
		this.showPlayOrUnmuteButton();

	}

	onMutedVideoPlaybackNotAllowed( target ) {

		this.failedMutedVideoPlaybackTargets.add( target );
		this.showPlayOrUnmuteButton();

	}

	/**
	 * Videos may be temporarily muted by us to get around browser
	 * restrictions on automatic playback. This method rolls back
	 * all such temporary audio changes.
	 */
	resetTemporarilyMutedMedia() {

		const failedTargets = new Set( [
			...this.failedAudioPlaybackTargets,
			...this.failedVideoPlaybackTargets,
			...this.failedMutedVideoPlaybackTargets
		] );

		failedTargets.forEach( target => {
			if( target.hasAttribute( 'data-muted-by-reveal' ) ) {
				target.muted = false;
				target.removeAttribute( 'data-muted-by-reveal' );
			}
		} );

	}

	clearMediaPlaybackErrors() {

		this.resetTemporarilyMutedMedia();

		this.failedAudioPlaybackTargets.clear();
		this.failedVideoPlaybackTargets.clear();
		this.failedMutedVideoPlaybackTargets.clear();
		this.mediaPlayButton.remove();

	}

	/**
	 * Prevents iframes from automatically focusing themselves.
	 *
	 * @param {Event} event
	 */
	preventIframeAutoFocus( event ) {

		const iframe = event.target;

		if( iframe && this.Reveal.getConfig().preventIframeAutoFocus ) {

			let elapsed = 0;
			const interval = 100;
			const maxTime = 1000;
			const checkFocus = () => {
				if( document.activeElement === iframe ) {
					document.activeElement.blur();
				} else if( elapsed < maxTime ) {
					elapsed += interval;
					setTimeout( checkFocus, interval );
				}
			};

			setTimeout( checkFocus, interval );

		}

	}

	afterSlideChanged() {

		this.clearMediaPlaybackErrors();

	}

}
