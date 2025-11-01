/*!
 * reveal.js SmartArt plugin
 */
(function( root, factory ) {
        if( typeof exports === 'object' && typeof module !== 'undefined' ) {
                module.exports = factory();
        }
        else if( typeof define === 'function' && define.amd ) {
                define( factory );
        }
        else {
                root.RevealSmartArt = factory();
        }
}( this, function() {
        const ORIENTATION_MAP = {
                TB: 'vertical',
                BT: 'vertical',
                LR: 'horizontal',
                RL: 'horizontal',
                GRID: 'grid',
                AUTO: 'grid',
                LINED: 'lined'
        };
	
	const DEFAULT_ICONS = [
	        'lucide:cloud',
	        'lucide:bar-chart-3',
	        'lucide:shield-check',
	        'lucide:laptop-minimal',
	        'lucide:headset',
	        'lucide:network'
	];
	
	const STYLE_ELEMENT_ID = 'reveal-smartart-styles';
	
	function injectStyles() {
	        if( document.getElementById( STYLE_ELEMENT_ID ) ) return;
	
	        const style = document.createElement( 'style' );
	        style.id = STYLE_ELEMENT_ID;
	        style.textContent = `
	.reveal .smartart {
	        width: min(100%, 960px);
	        margin: 0 auto;
	        padding: 1.5rem clamp(0.5rem, 2vw, 2rem);
	        color: var(--r-main-color, #111827);
	}
	.reveal .smartart[data-layout="horizontal"] .smartart__grid {
	        display: flex;
	        flex-wrap: wrap;
	        gap: 1.5rem;
	}
	.reveal .smartart[data-layout="horizontal"] .smartart__card {
	        flex: 1 1 clamp(240px, 30vw, 320px);
	}
	.reveal .smartart[data-layout="vertical"] .smartart__grid {
	        display: grid;
	        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
	        gap: 1.5rem;
	}
	.reveal .smartart[data-layout="grid"] .smartart__grid,
	.reveal .smartart:not([data-layout]) .smartart__grid {
	        display: grid;
	        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
	        gap: 1.5rem;
	}
	.reveal .smartart__heading {
	        text-align: center;
	        margin-bottom: 0.75rem;
	        font-size: clamp(2rem, 3vw, 2.8rem);
	        font-weight: 700;
	}
	.reveal .smartart__intro {
	        max-width: 52ch;
	        margin: 0.5rem auto 2.5rem;
	        text-align: center;
	        color: var(--r-muted-foreground, rgba(55, 65, 81, 0.85));
	        font-size: clamp(1rem, 1.1vw, 1.125rem);
	        line-height: 1.6;
	}
	.reveal .smartart[data-layout="lined"] .smartart__intro {
	        margin-bottom: 1.75rem;
	}
	.reveal .smartart__card {
	        display: flex;
	        flex-direction: column;
	        justify-content: flex-start;
	        background: color-mix(in srgb, var(--r-background-color, #f6f7f8) 65%, #ffffff 35%);
	        border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
	        border-radius: 0.85rem;
	        padding: 1.75rem 1.5rem;
	        box-shadow: 0 20px 35px -24px rgba(15, 23, 42, 0.4);
	        transition: transform 0.2s ease, box-shadow 0.2s ease;
	        min-height: 240px;
	}
	.reveal .smartart__card:hover {
	        transform: translateY(-6px);
	        box-shadow: 0 26px 46px -22px rgba(15, 23, 42, 0.45);
	}
	.reveal .smartart__icon {
	        width: 3rem;
	        height: 3rem;
	        border-radius: 0.85rem;
	        display: inline-flex;
	        align-items: center;
	        justify-content: center;
	        margin-bottom: 1.4rem;
	        background: rgba(19, 127, 236, 0.16);
	        color: #137fec;
	}
	.reveal .smartart__icon img,
	.reveal .smartart__icon svg {
	        width: 1.75rem;
	        height: 1.75rem;
	}
	.reveal .smartart__title {
	        font-size: clamp(1.15rem, 2vw, 1.4rem);
	        font-weight: 700;
	        margin: 0 0 0.6rem;
	        color: inherit;
	}
	.reveal .smartart__description {
	        font-size: clamp(0.95rem, 1.2vw, 1.05rem);
	        line-height: 1.6;
	        color: color-mix(in srgb, currentColor 72%, transparent);
	        margin-bottom: 1.5rem;
	}
	.reveal .smartart__cta {
	        margin-top: auto;
	        display: inline-flex;
	        align-items: center;
	        justify-content: center;
	        gap: 0.35rem;
	        background: #137fec;
	        color: #ffffff !important;
	        padding: 0.65rem 1.1rem;
	        border-radius: 0.55rem;
	        font-size: 0.9rem;
	        font-weight: 600;
	        text-decoration: none;
	        transition: background 0.2s ease, transform 0.2s ease;
	        box-shadow: 0 8px 16px -8px rgba(19, 127, 236, 0.5);
	}
	.reveal .smartart__cta:hover {
	        background: #0f6bd1;
	        transform: translateY(-1px);
	}
	.reveal .smartart[data-layout="lined"] .smartart__list {
	        list-style: none;
	        margin: 0;
	        padding: 0;
	        background: color-mix(in srgb, var(--r-background-color, #f9fafb) 65%, #ffffff 35%);
	        border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
	        border-radius: 0.85rem;
	        box-shadow: 0 20px 35px -28px rgba(15, 23, 42, 0.38);
	        overflow: hidden;
	}
	.reveal .smartart[data-layout="lined"] .smartart__list-item {
	        display: flex;
	        align-items: center;
	        gap: 1rem;
	        padding: 1.25rem clamp(1rem, 2vw, 1.75rem);
	        transition: background 0.2s ease;
	}
	.reveal .smartart[data-layout="lined"] .smartart__list-item + .smartart__list-item {
	        border-top: 1px solid color-mix(in srgb, currentColor 10%, transparent);
	}
	.reveal .smartart[data-layout="lined"] .smartart__list-item:hover {
	        background: color-mix(in srgb, var(--r-background-color, #f1f5f9) 55%, transparent);
	}
	.reveal .smartart__list-icon {
	        flex: 0 0 auto;
	        width: 2.75rem;
	        height: 2.75rem;
	        border-radius: 0.75rem;
	        display: inline-flex;
	        align-items: center;
	        justify-content: center;
	        background: rgba(19, 127, 236, 0.14);
	        color: #137fec;
	}
	.reveal .smartart__list-icon img,
	.reveal .smartart__list-icon svg {
	        width: 1.5rem;
	        height: 1.5rem;
	}
	.reveal .smartart__list-content {
	        flex: 1 1 auto;
	}
	.reveal .smartart__list-title {
	        font-size: clamp(1.05rem, 1.8vw, 1.25rem);
	        font-weight: 600;
	        margin: 0;
	        color: inherit;
	}
	.reveal .smartart__list-description {
	        margin: 0.35rem 0 0;
	        color: color-mix(in srgb, currentColor 70%, transparent);
	        font-size: clamp(0.9rem, 1.1vw, 1rem);
	        line-height: 1.55;
	}
	.reveal .smartart__list-meta {
	        flex: 0 0 auto;
	        margin-left: clamp(0.75rem, 2vw, 1.5rem);
	        font-size: 0.95rem;
	        font-weight: 600;
	        color: color-mix(in srgb, currentColor 65%, transparent);
	}
	.reveal .has-dark-background .smartart[data-layout="lined"] .smartart__list {
	        background: rgba(15, 23, 42, 0.82);
	        border-color: rgba(148, 163, 184, 0.2);
	        box-shadow: 0 16px 32px -26px rgba(15, 23, 42, 0.8);
	}
	.reveal .has-dark-background .smartart__list-item + .smartart__list-item {
	        border-color: rgba(148, 163, 184, 0.18);
	}
	.reveal .has-dark-background .smartart__list-description {
	        color: rgba(226, 232, 240, 0.72);
	}
	.reveal .has-dark-background .smartart {
	        color: #f8fafc;
	}
	.reveal .has-dark-background .smartart__intro {
	        color: rgba(226, 232, 240, 0.75);
	}
	.reveal .has-dark-background .smartart__card {
	        background: rgba(15, 23, 42, 0.84);
	        border-color: rgba(148, 163, 184, 0.2);
	        box-shadow: 0 16px 32px -20px rgba(15, 23, 42, 0.9);
	}
	.reveal .has-dark-background .smartart__cta {
	        box-shadow: 0 8px 18px -8px rgba(19, 127, 236, 0.65);
	}
	`;
	
	        document.head.appendChild( style );
	}
	
	function orientationToLayout( orientation ) {
	        const layout = ORIENTATION_MAP[ orientation ];
	        return layout || 'grid';
	}
	
	function defaultIcon( index ) {
	        return DEFAULT_ICONS[ index % DEFAULT_ICONS.length ];
	}
	
	function iconToUrl( icon ) {
	        const token = icon.includes( ':' ) ? icon : `lucide:${ icon }`;
	        return `https://api.iconify.design/${ token }.svg`;
	}
	
	function parseBlock( text ) {
	        const match = text.trim().match( /^:::\s*smartart\s+([\s\S]+?)\s*:::\s*$/i );
	        if( !match ) return null;
	
	        const body = match[ 1 ].trim();
	        if( !body ) return null;
	
	        const lines = body.split( /\n+/ ).map( line => line.trim() ).filter( Boolean );
	        if( lines.length === 0 ) return null;
	
	        const firstLineTokens = lines[ 0 ].split( /\s+/ ).filter( Boolean );
	        const orientationIndex = firstLineTokens.findIndex( token => ORIENTATION_MAP[ token.toUpperCase() ] );
	        const orientation = orientationIndex >= 0 ? firstLineTokens[ orientationIndex ].toUpperCase() : 'TB';
	        const layout = orientationToLayout( orientation );
	        const headingTokens = orientationIndex >= 0 ? firstLineTokens.slice( 0, orientationIndex ) : firstLineTokens;
	        const remainderTokens = orientationIndex >= 0 ? firstLineTokens.slice( orientationIndex + 1 ) : [];
	
	        const heading = headingTokens.join( ' ' ).trim();
	        const firstItemCandidate = remainderTokens.join( ' ' ).trim();
	
	        const detailLines = lines.slice( 1 );
	        let intro = '';
	        const itemSegments = [];
	
	        detailLines.forEach( line => {
	                const sanitized = line.replace( /^[-*+]\s+/, '' );
	                const introMatch = sanitized.match( /^(?:intro|summary|description)\s*:\s*(.+)$/i );
	                if( introMatch ) {
	                        intro = introMatch[ 1 ].trim();
	                        return;
	                }
	
	                itemSegments.push( sanitized );
	        } );
	
	        if( firstItemCandidate ) itemSegments.unshift( firstItemCandidate );
	
	        const rawItems = itemSegments
	                .flatMap( segment => splitSegment( segment, layout ) )
	                .map( segment => segment.trim() )
	                .filter( Boolean );
	
	        const items = rawItems.map( ( raw, index ) => parseItem( raw, index, layout ) ).filter( Boolean );
	
	        if( items.length === 0 ) {
	                return null;
	        }
	
	        return {
	                heading,
	                intro,
	                orientation,
	                layout,
	                items
	        };
	}
	
	function splitSegment( segment, layout ) {
	        const cleaned = segment.trim();
	        if( !cleaned ) return [];
	
	        if( layout === 'lined' ) {
	                const bulletless = cleaned.replace( /^[-*+]\s+/, '' );
	                if( /;/.test( bulletless ) ) {
	                        return bulletless.split( /\s*;\s*/ );
	                }
	                if( /\w\s*=/.test( bulletless ) || bulletless.includes( '|' ) ) {
	                        return [ bulletless ];
	                }
	                const matches = bulletless.match( /"[^"]+"|[^\s]+/g ) || [];
	                if( matches.length > 0 ) {
	                        return matches.map( token => token.replace( /^"|"$/g, '' ) );
	                }
	                return [ bulletless ];
	        }
	
	        return segment.split( /\s*;\s*/ );
	}
	
	function parseItem( raw, index, layout ) {
	        const item = {
	                title: '',
	                description: '',
	                icon: '',
	                ctaLabel: '',
	                ctaUrl: ''
	        };
	
	        const segments = raw.split( /\|/ ).map( part => part.trim() ).filter( part => part.length > 0 );
	
	        if( segments.length === 1 ) {
	                const single = segments[ 0 ];
	                const kvMatch = single.match( /^(\w+)\s*=\s*(.+)$/ );
	                if( kvMatch ) {
	                        assignKeyValue( item, kvMatch[ 1 ], kvMatch[ 2 ] );
	                }
	                else {
	                        const colonIndex = single.indexOf( ':' );
	                        if( colonIndex > 0 && !/^https?:/i.test( single ) ) {
	                                item.title = single.slice( 0, colonIndex ).trim();
	                                item.description = single.slice( colonIndex + 1 ).trim();
	                        }
	                        else {
	                                item.title = single.trim();
	                        }
	                }
	        }
	        else {
	                segments.forEach( ( segment, order ) => {
	                        const kvMatch = segment.match( /^(\w+)\s*=\s*(.+)$/ );
	                        if( kvMatch ) {
	                                assignKeyValue( item, kvMatch[ 1 ], kvMatch[ 2 ] );
	                        }
	                        else {
	                                if( !item.title ) item.title = segment;
	                                else if( !item.description ) item.description = segment;
	                                else if( !item.ctaLabel ) item.ctaLabel = segment;
	                                else if( !item.ctaUrl ) item.ctaUrl = segment;
	                        }
	                } );
	        }
	
	        if( item.ctaLabel && !item.ctaUrl ) item.ctaUrl = '#';
	        if( !item.icon && layout !== 'lined' ) item.icon = defaultIcon( index );
	
	        if( !item.title ) return null;
	
	        return item;
	}
	
	function assignKeyValue( item, key, value ) {
	        const normalizedKey = key.trim().toLowerCase();
	        const normalizedValue = value.trim();
	
	        if( normalizedKey === 'icon' ) item.icon = normalizedValue;
	        else if( normalizedKey === 'title' ) item.title = normalizedValue;
	        else if( normalizedKey === 'description' || normalizedKey === 'text' || normalizedKey === 'copy' ) item.description = normalizedValue;
	        else if( normalizedKey === 'cta' || normalizedKey === 'label' || normalizedKey === 'action' ) item.ctaLabel = normalizedValue;
	        else if( normalizedKey === 'url' || normalizedKey === 'href' || normalizedKey === 'link' ) item.ctaUrl = normalizedValue;
	}
	
	function createCard( item ) {
	        const card = document.createElement( 'div' );
	        card.className = 'smartart__card';
	        card.setAttribute( 'role', 'group' );
	
	        if( item.icon ) {
	                const iconWrapper = document.createElement( 'div' );
	                iconWrapper.className = 'smartart__icon';
	                const icon = document.createElement( 'img' );
	                icon.src = iconToUrl( item.icon );
	                icon.alt = item.title ? `${ item.title } icon` : 'Service icon';
	                icon.loading = 'lazy';
	                iconWrapper.appendChild( icon );
	                card.appendChild( iconWrapper );
	        }
	
	        if( item.title ) {
	                const title = document.createElement( 'h3' );
	                title.className = 'smartart__title';
	                title.textContent = item.title;
	                card.appendChild( title );
	        }
	
	        if( item.description ) {
	                const description = document.createElement( 'p' );
	                description.className = 'smartart__description';
	                description.textContent = item.description;
	                card.appendChild( description );
	        }
	
	        if( item.ctaLabel ) {
	                const cta = document.createElement( 'a' );
	                cta.className = 'smartart__cta';
	                cta.textContent = item.ctaLabel;
	                cta.href = item.ctaUrl || '#';
	                cta.target = /^https?:/i.test( item.ctaUrl ) ? '_blank' : '_self';
	                cta.rel = 'noreferrer noopener';
	                card.appendChild( cta );
	        }
	
	        return card;
	}
	
	function createListItem( item ) {
	        const listItem = document.createElement( 'li' );
	        listItem.className = 'smartart__list-item';
	        listItem.setAttribute( 'role', 'listitem' );
	
	        if( item.icon ) {
	                const iconWrapper = document.createElement( 'div' );
	                iconWrapper.className = 'smartart__list-icon';
	                const icon = document.createElement( 'img' );
	                icon.src = iconToUrl( item.icon );
	                icon.alt = item.title ? `${ item.title } icon` : 'List icon';
	                icon.loading = 'lazy';
	                iconWrapper.appendChild( icon );
	                listItem.appendChild( iconWrapper );
	        }
	
	        const content = document.createElement( 'div' );
	        content.className = 'smartart__list-content';
	
	        if( item.title ) {
	                const title = document.createElement( 'p' );
	                title.className = 'smartart__list-title';
	                title.textContent = item.title;
	                content.appendChild( title );
	        }
	
	        if( item.description ) {
	                const description = document.createElement( 'p' );
	                description.className = 'smartart__list-description';
	                description.textContent = item.description;
	                content.appendChild( description );
	        }
	
	        listItem.appendChild( content );
	
	        if( item.ctaLabel ) {
	                const meta = document.createElement( 'a' );
	                meta.className = 'smartart__list-meta';
	                meta.textContent = item.ctaLabel;
	                meta.href = item.ctaUrl || '#';
	                meta.target = /^https?:/i.test( item.ctaUrl ) ? '_blank' : '_self';
	                meta.rel = 'noreferrer noopener';
	                listItem.appendChild( meta );
	        }
	
	        return listItem;
	}
	
	function buildSmartArt( data ) {
	        const container = document.createElement( 'div' );
	        container.className = 'smartart';
	        const layout = data.layout || orientationToLayout( data.orientation );
	        container.dataset.layout = layout;
	        container.dataset.smartartGenerated = 'true';
	
	        if( data.heading ) {
	                const heading = document.createElement( 'h2' );
	                heading.className = 'smartart__heading';
	                heading.textContent = data.heading;
	                container.appendChild( heading );
	        }
	
	        if( data.intro ) {
	                const intro = document.createElement( 'p' );
	                intro.className = 'smartart__intro';
	                intro.textContent = data.intro;
	                container.appendChild( intro );
	        }
	
	        if( layout === 'lined' ) {
	                const list = document.createElement( 'ul' );
	                list.className = 'smartart__list';
	                list.setAttribute( 'role', 'list' );
	                data.items.forEach( ( item, index ) => {
	                        if( !item.icon ) item.icon = defaultIcon( index );
	                        list.appendChild( createListItem( item ) );
	                } );
	                container.appendChild( list );
	        }
	        else {
	                const grid = document.createElement( 'div' );
	                grid.className = 'smartart__grid';
	                data.items.forEach( item => {
	                        grid.appendChild( createCard( item ) );
	                } );
	                container.appendChild( grid );
	        }
	
	        return container;
	}
	
	function renderWithin( root ) {
	        if( !root || !root.querySelectorAll ) return;
	
	        const candidates = root.querySelectorAll( 'p, li, blockquote, pre' );
	
	        candidates.forEach( element => {
	                if( element.closest( '[data-smartart-generated="true"]' ) ) return;
	                const text = element.textContent || '';
	                if( !/:::\s*smartart/i.test( text ) ) return;
	
	                const parsed = parseBlock( text );
	                if( !parsed ) return;
	
	                const smartArt = buildSmartArt( parsed );
	                element.replaceWith( smartArt );
	        } );
	}
	
	const SmartArtPlugin = {
	        id: 'smartart',
	        init: function( reveal ) {
	                injectStyles();
	
	                const process = () => renderWithin( reveal.getSlidesElement() || reveal.getRevealElement() );
	
	                reveal.on( 'ready', event => {
	                        process();
	                        if( event && event.currentSlide ) renderWithin( event.currentSlide );
	                } );
	
	                reveal.on( 'slidechanged', event => {
	                        if( event && event.currentSlide ) renderWithin( event.currentSlide );
	                } );
	
	                // Process immediately in case the deck is already ready
	                process();
	        }
	};
	
	return SmartArtPlugin;
}));
