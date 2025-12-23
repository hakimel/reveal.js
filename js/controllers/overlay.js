/**
 * Handles the display of reveal.js' overlay elements used
 * to preview iframes, images & videos.
 */
export default class Overlay {

	constructor( Reveal ) {

		this.Reveal = Reveal;

		this.onSlidesClicked = this.onSlidesClicked.bind( this );

		this.iframeTriggerSelector = null;
		this.mediaTriggerSelector = '[data-preview-image], [data-preview-video]';

		this.stateProps = ['previewIframe', 'previewImage', 'previewVideo', 'previewFit'];
		this.state = {};

	}

	update() {

		// Enable link previews globally
		if( this.Reveal.getConfig().previewLinks ) {
			this.iframeTriggerSelector = 'a[href]:not([data-preview-link=false]), [data-preview-link]:not(a):not([data-preview-link=false])';
		}
		// Enable link previews for individual elements
		else {
			this.iframeTriggerSelector = '[data-preview-link]:not([data-preview-link=false])';
		}

		const hasLinkPreviews = this.Reveal.getSlidesElement().querySelectorAll( this.iframeTriggerSelector ).length > 0;
		const hasMediaPreviews = this.Reveal.getSlidesElement().querySelectorAll( this.mediaTriggerSelector ).length > 0;

		// Only add the listener when there are previewable elements in the slides
		if( hasLinkPreviews || hasMediaPreviews ) {
			this.Reveal.getSlidesElement().addEventListener( 'click', this.onSlidesClicked, false );
		}
		else {
			this.Reveal.getSlidesElement().removeEventListener( 'click', this.onSlidesClicked, false );
		}

	}

	createOverlay( className ) {

		this.dom = document.createElement( 'div' );
		this.dom.classList.add( 'r-overlay' );
		this.dom.classList.add( className );

		this.viewport = document.createElement( 'div' );
		this.viewport.classList.add( 'r-overlay-viewport' );

		this.dom.appendChild( this.viewport );
		this.Reveal.getRevealElement().appendChild( this.dom );

	}

	/**
	 * Opens a lightbox that previews the target URL.
	 *
	 * @param {string} url - url for lightbox iframe src
	 */
	previewIframe( url ) {

		this.close();

		this.state = { previewIframe: url };

		this.createOverlay( 'r-overlay-preview' );
		this.dom.dataset.state = 'loading';

		this.viewport.innerHTML =
			`<header class="r-overlay-header">
				<a class="r-overlay-header-button r-overlay-external" href="${url}" target="_blank"><span class="icon"></span></a>
				<button class="r-overlay-header-button r-overlay-close"><span class="icon"></span></button>
			</header>
			<div class="r-overlay-spinner"></div>
			<div class="r-overlay-content">
				<iframe src="${url}"></iframe>
				<small class="r-overlay-content-inner">
					<span class="r-overlay-error x-frame-error">Unable to load iframe. This is likely due to the site's policy (x-frame-options).</span>
				</small>
			</div>`;

		this.dom.querySelector( 'iframe' ).addEventListener( 'load', event => {
			this.dom.dataset.state = 'loaded';
		}, false );

		this.dom.querySelector( '.r-overlay-close' ).addEventListener( 'click', event => {
			this.close();
			event.preventDefault();
		}, false );

		this.dom.querySelector( '.r-overlay-external' ).addEventListener( 'click', event => {
			this.close();
		}, false );

		this.Reveal.dispatchEvent({ type: 'previewiframe', data: { url } });

	}

	/**
	 * Opens a lightbox window that provides a larger view of the
	 * given image/video.
	 *
	 * @param {string} url - url to the image/video to preview
	 * @param {image|video} mediaType
	 * @param {string} [fitMode] - the fit mode to use for the preview
	 */
	previewMedia( url, mediaType, fitMode ) {

		if( mediaType !== 'image' && mediaType !== 'video' ) {
			console.warn( 'Please specify a valid media type to preview (image|video)' );
			return;
		}

		this.close();

		fitMode = fitMode || 'scale-down';

		this.createOverlay( 'r-overlay-preview' );
		this.dom.dataset.state = 'loading';
		this.dom.dataset.previewFit = fitMode;

		this.viewport.innerHTML =
			`<header class="r-overlay-header">
				<button class="r-overlay-header-button r-overlay-close">Esc <span class="icon"></span></button>
			</header>
			<div class="r-overlay-spinner"></div>
			<div class="r-overlay-content"></div>`;

		const contentElement = this.dom.querySelector( '.r-overlay-content' );

		if( mediaType === 'image' ) {

			this.state = { previewImage: url, previewFit: fitMode }

			const img = document.createElement( 'img', {} );
			img.src = url;
			contentElement.appendChild( img );

			img.addEventListener( 'load', () => {
				this.dom.dataset.state = 'loaded';
			}, false );

			img.addEventListener( 'error', () => {
				this.dom.dataset.state = 'error';
				contentElement.innerHTML =
						`<span class="r-overlay-error">Unable to load image.</span>`
			}, false );

			// Hide image overlays when clicking outside the overlay
			this.dom.style.cursor = 'zoom-out';
			this.dom.addEventListener( 'click', ( event ) => {
				this.close();
			}, false );

			this.Reveal.dispatchEvent({ type: 'previewimage', data: { url } });

		}
		else if( mediaType === 'video' ) {

			this.state = { previewVideo: url, previewFit: fitMode }

			const video = document.createElement( 'video' );
			video.autoplay = this.dom.dataset.previewAutoplay === 'false' ? false : true;
			video.controls = this.dom.dataset.previewControls === 'false' ? false : true;
			video.loop = this.dom.dataset.previewLoop === 'true' ? true : false;
			video.muted = this.dom.dataset.previewMuted === 'true' ? true : false;
			video.playsInline = true;
			video.src = url;
			contentElement.appendChild( video );

			video.addEventListener( 'loadeddata', () => {
				this.dom.dataset.state = 'loaded';
			}, false );

			video.addEventListener( 'error', () => {
				this.dom.dataset.state = 'error';
				contentElement.innerHTML =
					`<span class="r-overlay-error">Unable to load video.</span>`;
			}, false );

			this.Reveal.dispatchEvent({ type: 'previewvideo', data: { url } });

		}
		else {
			throw new Error( 'Please specify a valid media type to preview' );
		}

		this.dom.querySelector( '.r-overlay-close' ).addEventListener( 'click', ( event ) => {
			this.close();
			event.preventDefault();
		}, false );

	}

	previewImage( url, fitMode ) {

		this.previewMedia( url, 'image', fitMode );

	}

	previewVideo( url, fitMode ) {

		this.previewMedia( url, 'video', fitMode );

	}

	/**
	 * Open or close help overlay window.
	 *
	 * @param {Boolean} [override] Flag which overrides the
	 * toggle logic and forcibly sets the desired state. True means
	 * help is open, false means it's closed.
	 */
	toggleHelp( override ) {

		if( typeof override === 'boolean' ) {
			override ? this.showHelp() : this.close();
		}
		else {
			if( this.dom ) {
				this.close();
			}
			else {
				this.showHelp();
			}
		}
	}

	/**
	 * Opens an overlay window with help material.
	 */
	showHelp() {

		if( this.Reveal.getConfig().help ) {

			this.close();

			this.createOverlay( 'r-overlay-help' );

			let html = '<p class="title">Keyboard Shortcuts</p>';

			let shortcuts = this.Reveal.keyboard.getShortcuts(),
				bindings = this.Reveal.keyboard.getBindings();

			html += '<table><th>KEY</th><th>ACTION</th>';
			for( let key in shortcuts ) {
				html += `<tr><td>${key}</td><td>${shortcuts[ key ]}</td></tr>`;
			}

			// Add custom key bindings that have associated descriptions
			for( let binding in bindings ) {
				if( bindings[binding].key && bindings[binding].description ) {
					html += `<tr><td>${bindings[binding].key}</td><td>${bindings[binding].description}</td></tr>`;
				}
			}

			html += '</table>';

			this.viewport.innerHTML = `
				<header class="r-overlay-header">
					<button class="r-overlay-header-button r-overlay-close">Esc <span class="icon"></span></button>
				</header>
				<div class="r-overlay-content">
					<div class="r-overlay-help-content">${html}</div>
				</div>
			`;

			this.dom.querySelector( '.r-overlay-close' ).addEventListener( 'click', event => {
				this.close();
				event.preventDefault();
			}, false );

			this.Reveal.dispatchEvent({ type: 'showhelp' });

		}

	}

	isOpen() {

		return !!this.dom;

	}

	/**
	 * Closes any currently open overlay.
	 */
	close() {

		if( this.dom ) {
			this.dom.remove();
			this.dom = null;

			this.state = {};

			this.Reveal.dispatchEvent({ type: 'closeoverlay' });

			return true;
		}

		return false;

	}

	getState() {

		return this.state;

	}

	setState( state ) {

		// Ignore the incoming state if none of the preview related
		// props have changed
		if( this.stateProps.every( key => this.state[ key ] === state[ key ] ) ) {
			return;
		}

		if( state.previewIframe ) {
			this.previewIframe( state.previewIframe );
		}
		else if( state.previewImage ) {
			this.previewImage( state.previewImage, state.previewFit );
		}
		else if( state.previewVideo ) {
			this.previewVideo( state.previewVideo, state.previewFit );
		}
		else {
			this.close();
		}

	}

	onSlidesClicked( event ) {

		const target = event.target;

		const linkTarget = target.closest( this.iframeTriggerSelector );
		const mediaTarget = target.closest( this.mediaTriggerSelector );

		// Was an iframe lightbox trigger clicked?
		if( linkTarget ) {
			if( event.metaKey || event.shiftKey || event.altKey ) {
				// Let the browser handle meta keys naturally so users can cmd+click
				return;
			}
			let url = linkTarget.getAttribute( 'href' ) || linkTarget.getAttribute( 'data-preview-link' );
			if( url ) {
				this.previewIframe( url );
				event.preventDefault();
			}
		}
		// Was a media lightbox trigger clicked?
		else if( mediaTarget ) {
			if( mediaTarget.hasAttribute( 'data-preview-image' ) ) {
				let url = mediaTarget.dataset.previewImage || mediaTarget.getAttribute( 'src' );
				if( url ) {
					this.previewImage( url, mediaTarget.dataset.previewFit );
					event.preventDefault();
				}
			}
			else if( mediaTarget.hasAttribute( 'data-preview-video' ) ) {
				let url = mediaTarget.dataset.previewVideo || mediaTarget.getAttribute( 'src' );
				if( !url ) {
					let source = mediaTarget.querySelector( 'source' );
					if( source ) {
						url = source.getAttribute( 'src' );
					}
				}
				if( url ) {
					this.previewVideo( url, mediaTarget.dataset.previewFit );
					event.preventDefault();
				}
			}
		}

	}

	destroy() {

		this.close();

	}

}