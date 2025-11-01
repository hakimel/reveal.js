/*!
 * reveal.js SmartArt plugin
 */

const ORIENTATION_MAP = {
        TB: 'vertical',
        BT: 'vertical',
        LR: 'horizontal',
        RL: 'horizontal',
        GRID: 'grid',
        AUTO: 'grid'
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
        width: min(100%, 980px);
        margin: 0 auto;
        padding: clamp(1rem, 1.8vw, 2rem) clamp(0.75rem, 2.2vw, 2.25rem);
        color: var(--r-main-color, #111827);
        box-sizing: border-box;
        overflow: visible;
}
.reveal .smartart__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(clamp(180px, 28vw, 320px), 1fr));
        gap: clamp(1rem, 2vw, 1.75rem);
        align-items: stretch;
        width: 100%;
        margin: 0 auto;
}
.reveal .smartart[data-layout="horizontal"] .smartart__grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: stretch;
        gap: clamp(1rem, 2vw, 1.5rem);
}
.reveal .smartart[data-layout="horizontal"] .smartart__card {
        flex: 1 1 clamp(180px, 32vw, 320px);
        max-width: clamp(220px, 34vw, 360px);
}
.reveal .smartart[data-layout="vertical"] .smartart__grid,
.reveal .smartart[data-layout="grid"] .smartart__grid,
.reveal .smartart:not([data-layout]) .smartart__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(clamp(180px, 28vw, 320px), 1fr));
}
.reveal .smartart__heading {
        text-align: center;
        margin-bottom: clamp(0.5rem, 1.5vw, 0.9rem);
        font-size: clamp(2rem, 3vw, 2.8rem);
        font-weight: 700;
        line-height: 1.15;
}
.reveal .smartart__intro {
        max-width: min(65ch, 100%);
        margin: 0.75rem auto clamp(1.5rem, 3vw, 2.5rem);
        text-align: center;
        color: var(--r-muted-foreground, rgba(55, 65, 81, 0.8));
        font-size: clamp(1rem, 1.1vw, 1.125rem);
        line-height: 1.6;
}
.reveal .smartart__card {
        display: flex;
        flex-direction: column;
        gap: clamp(0.65rem, 1.6vw, 1rem);
        justify-content: flex-start;
        background: color-mix(in srgb, var(--r-background-color, #f6f7f8) 60%, #ffffff 40%);
        border: 1px solid color-mix(in srgb, currentColor 14%, transparent);
        border-radius: 0.9rem;
        padding: clamp(1.25rem, 2vw, 1.8rem) clamp(1.1rem, 2vw, 1.75rem);
        box-shadow: 0 18px 35px -26px rgba(15, 23, 42, 0.5);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        min-height: clamp(210px, 34vh, 320px);
        max-width: 100%;
        box-sizing: border-box;
        word-break: break-word;
}
.reveal .smartart__card:hover {
        transform: translateY(-4px);
        box-shadow: 0 26px 46px -24px rgba(15, 23, 42, 0.45);
}
.reveal .smartart__icon {
        width: clamp(2.6rem, 6vw, 3.2rem);
        height: clamp(2.6rem, 6vw, 3.2rem);
        border-radius: 0.9rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-bottom: clamp(0.4rem, 1.2vw, 0.9rem);
        background: rgba(19, 127, 236, 0.16);
        color: #137fec;
}
.reveal .smartart__icon img,
.reveal .smartart__icon svg {
        width: clamp(1.4rem, 4vw, 1.85rem);
        height: clamp(1.4rem, 4vw, 1.85rem);
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
}
.reveal .smartart__title {
        font-size: clamp(1.1rem, 1.9vw, 1.4rem);
        font-weight: 700;
        margin: 0;
        color: inherit;
        line-height: 1.25;
}
.reveal .smartart__description {
        font-size: clamp(0.95rem, 1.3vw, 1.05rem);
        line-height: 1.65;
        color: color-mix(in srgb, currentColor 70%, transparent);
        margin: 0 0 clamp(0.6rem, 1.8vw, 1.3rem);
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
        border-radius: 0.6rem;
        font-size: 0.9rem;
        font-weight: 600;
        text-decoration: none;
        transition: background 0.2s ease, transform 0.2s ease;
        box-shadow: 0 8px 16px -8px rgba(19, 127, 236, 0.5);
        align-self: flex-start;
}
.reveal .smartart__cta:hover {
        background: #0f6bd1;
        transform: translateY(-1px);
}
.reveal .has-dark-background .smartart {
        color: #f8fafc;
}
.reveal .has-dark-background .smartart__intro {
        color: rgba(226, 232, 240, 0.78);
}
.reveal .has-dark-background .smartart__card {
        background: rgba(15, 23, 42, 0.86);
        border-color: rgba(148, 163, 184, 0.22);
        box-shadow: 0 16px 32px -22px rgba(15, 23, 42, 0.9);
}
.reveal .has-dark-background .smartart__cta {
        box-shadow: 0 8px 18px -8px rgba(19, 127, 236, 0.65);
}
@media (max-width: 720px) {
        .reveal .smartart {
                padding: clamp(0.75rem, 2.5vw, 1.5rem) clamp(0.75rem, 4vw, 1.5rem);
        }
        .reveal .smartart__grid {
                grid-template-columns: repeat(auto-fit, minmax(clamp(160px, 70vw, 280px), 1fr));
        }
        .reveal .smartart[data-layout="horizontal"] .smartart__card {
                flex: 1 1 clamp(160px, 80vw, 320px);
                max-width: 100%;
        }
}
@media (max-width: 520px) {
        .reveal .smartart__heading {
                font-size: clamp(1.6rem, 7vw, 2.2rem);
        }
        .reveal .smartart__intro {
                font-size: clamp(0.95rem, 3.6vw, 1.05rem);
        }
        .reveal .smartart__grid {
                gap: clamp(0.85rem, 4vw, 1.25rem);
        }
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
        const headingTokens = orientationIndex >= 0 ? firstLineTokens.slice( 0, orientationIndex ) : firstLineTokens;
        const remainderTokens = orientationIndex >= 0 ? firstLineTokens.slice( orientationIndex + 1 ) : [];

        const heading = headingTokens.join( ' ' ).trim();
        const firstItemCandidate = remainderTokens.join( ' ' ).trim();

        const detailLines = lines.slice( 1 );
        let intro = '';
        const itemSegments = [];

        detailLines.forEach( line => {
                const introMatch = line.match( /^(?:intro|summary|description)\s*:\s*(.+)$/i );
                if( introMatch ) {
                        intro = introMatch[ 1 ].trim();
                        return;
                }

                itemSegments.push( line );
        } );

        if( firstItemCandidate ) itemSegments.unshift( firstItemCandidate );

        const rawItems = itemSegments
                .flatMap( segment => segment.split( /\s*;\s*/ ) )
                .map( segment => segment.trim() )
                .filter( Boolean );

        const items = rawItems.map( ( raw, index ) => parseItem( raw, index ) ).filter( Boolean );

        if( items.length === 0 ) {
                return null;
        }

        return {
                heading,
                intro,
                orientation,
                items
        };
}

function parseItem( raw, index ) {
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
                        const words = single.split( /\s+/ );
                        item.title = words.shift() || '';
                        item.description = words.join( ' ' ).trim();
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
        if( !item.icon ) item.icon = defaultIcon( index );

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

function buildSmartArt( data ) {
        const container = document.createElement( 'div' );
        container.className = 'smartart';
        container.dataset.layout = orientationToLayout( data.orientation );
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

        const grid = document.createElement( 'div' );
        grid.className = 'smartart__grid';
        data.items.forEach( item => {
                grid.appendChild( createCard( item ) );
        } );
        container.appendChild( grid );

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

export default () => SmartArtPlugin;
