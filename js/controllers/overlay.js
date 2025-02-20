/**
 * Handles the display of reveal.js' overlay elements used
 * to preview iframes, images & videos.
 */
export default class Overlay {

	constructor( Reveal ) {

		this.Reveal = Reveal;

		this.onSlidesClicked = this.onSlidesClicked.bind( this );

		this.linkPreviewSelector = null;
		this.mediaPreviewSelector = '[data-preview-image], [data-preview-video]';

	}

	update() {

		// Enable link previews globally
		if( this.Reveal.getConfig().previewLinks ) {
			this.linkPreviewSelector = 'a[href]:not([data-preview-link=false])';
		}
		// Enable link previews for individual elements
		else {
			this.linkPreviewSelector = '[data-preview-link]:not([data-preview-link=false])';
		}

		this.hasLinkPreviews = this.Reveal.getSlidesElement().querySelectorAll( this.linkPreviewSelector ).length > 0;
		this.hasMediaPreviews = this.Reveal.getSlidesElement().querySelectorAll( this.mediaPreviewSelector ).length > 0;

		// Only add the listener when there are previewable elements in the slides
		if( this.hasLinkPreviews || this.hasMediaPreviews ) {
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
	 * Opens a preview window for the target URL.
	 *
	 * @param {string} url - url for preview iframe src
	 */
	showIframePreview( url ) {

		this.close();

		this.createOverlay( 'r-overlay-preview' );
		this.dom.dataset.state = 'loading';

		this.viewport.innerHTML =
			`<header class="r-overlay-header">
				<a class="r-overlay-button r-overlay-external" href="${url}" target="_blank"><span class="icon"></span></a>
				<button class="r-overlay-button r-overlay-close"><span class="icon"></span></button>
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

		this.Reveal.dispatchEvent({ type: 'showiframepreview', data: { url } });

	}

	/**
	 * Opens a preview window that provides a larger view of the
	 * given image/video.
	 *
	 * @param {string} url - url to the image/video to preview
	 * @param {image|video} mediaType
	 * @param {HTMLElement} [trigger] - the element that triggered
	 * the preview
	 */
	showMediaPreview( url, mediaType, trigger ) {

		if( mediaType !== 'image' && mediaType !== 'video' ) {
			console.warn( 'Please specify a valid media type to preview (image|video)' );
			return;
		}

		this.close();

		this.createOverlay( 'r-overlay-preview' );
		this.dom.dataset.state = 'loading';
		this.dom.dataset.previewFit = trigger ? trigger.dataset.previewFit || 'scale-down' : 'scale-down';

		this.viewport.innerHTML =
			`<header class="r-overlay-header">
				<button class="r-overlay-button r-overlay-close">Esc <span class="icon"></span></button>
			</header>
			<div class="r-overlay-spinner"></div>
			<div class="r-overlay-content"></div>`;

		const contentElement = this.dom.querySelector( '.r-overlay-content' );

		if( mediaType === 'image' ) {

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

		}
		else if( mediaType === 'video' ) {

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

		}
		else {
			throw new Error( 'Please specify a valid media type to preview' );
		}

		this.dom.querySelector( '.r-overlay-close' ).addEventListener( 'click', ( event ) => {
			this.close();
			event.preventDefault();
		}, false );

		this.Reveal.dispatchEvent({ type: 'showmediapreview', data: { mediaType, url, trigger } });

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
					<button class="r-overlay-button r-overlay-close">Esc <span class="icon"></span></button>
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
			return true;
		}

		return false;

	}

	onSlidesClicked( event ) {

		const target = event.target;

		const linkTarget = target.closest( this.linkPreviewSelector );
		const mediaTarget = target.closest( this.mediaPreviewSelector );

		// Was a link preview clicked?
		if( linkTarget ) {
			let url = linkTarget.getAttribute( 'href' );
			if( url ) {
				this.showIframePreview( url );
				event.preventDefault();
			}
		}
		// Was a media preview clicked?
		else if( mediaTarget ) {
			if( mediaTarget.hasAttribute( 'data-preview-image' ) ) {
				let url = mediaTarget.dataset.previewImage || mediaTarget.getAttribute( 'src' );
				if( url ) {
					this.showMediaPreview( url, 'image', mediaTarget );
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
					this.showMediaPreview( url, 'video', mediaTarget );
					event.preventDefault();
				}
			}
		}

	}

	destroy() {

		this.close();

	}

}