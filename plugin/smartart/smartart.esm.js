/*!
 * reveal.js SmartArt plugin
 */

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
/* ================================================
   SMARTART PLUGIN - RESPONSIVE STYLES
   ================================================ */

/* Base Container - Fluid Width with Viewport Height Constraints */
.reveal .smartart {
        width: 100%;
        max-width: min(96%, 1100px);
        max-height: 85vh;
        margin: 0 auto;
        padding: clamp(0.75rem, 1.5vh, 1.5rem) clamp(0.75rem, 2vw, 2rem);
        box-sizing: border-box;
        color: var(--r-main-color, #111827);
        display: flex;
        flex-direction: column;
        overflow: hidden;
}

/* Grid Layouts - Responsive with Proper Gaps */
.reveal .smartart[data-layout="horizontal"] .smartart__grid {
        display: flex;
        flex-wrap: wrap;
        gap: clamp(0.75rem, 1.5vw, 1.25rem);
        justify-content: center;
        flex: 1 1 auto;
        overflow: hidden;
        align-content: start;
}
.reveal .smartart[data-layout="horizontal"] .smartart__card {
        flex: 1 1 clamp(220px, 28vw, 300px);
        max-width: 320px;
}
.reveal .smartart[data-layout="vertical"] .smartart__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
        gap: clamp(0.75rem, 1.5vw, 1.25rem);
        flex: 1 1 auto;
        overflow: hidden;
        align-content: start;
}
.reveal .smartart[data-layout="grid"] .smartart__grid,
.reveal .smartart:not([data-layout]) .smartart__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
        gap: clamp(0.75rem, 1.5vw, 1.25rem);
        flex: 1 1 auto;
        overflow: hidden;
        align-content: start;
}

/* Typography - Fluid Scaling */
.reveal .smartart__heading {
        text-align: center;
        margin-bottom: clamp(0.4rem, 0.8vh, 0.6rem);
        font-size: clamp(1.4rem, 2vw + 0.3rem, 2.2rem);
        font-weight: 700;
        line-height: 1.2;
        flex-shrink: 0;
}
.reveal .smartart__intro {
        max-width: min(90%, 52ch);
        margin: clamp(0.3rem, 0.6vh, 0.5rem) auto clamp(0.75rem, 1.5vh, 1.25rem);
        text-align: center;
        color: var(--r-muted-foreground, rgba(55, 65, 81, 0.85));
        font-size: clamp(0.85rem, 0.9vw + 0.15rem, 1rem);
        line-height: 1.5;
        flex-shrink: 0;
}
.reveal .smartart[data-layout="lined"] .smartart__intro {
        margin-bottom: clamp(0.9rem, 1.5vh, 1.25rem);
}

/* Card Component - Flexible Height, No Overflow */
.reveal .smartart__card {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        background: color-mix(in srgb, var(--r-background-color, #f6f7f8) 65%, #ffffff 35%);
        border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
        border-radius: clamp(0.5rem, 0.8vw, 0.75rem);
        padding: clamp(1rem, 1.5vh, 1.5rem) clamp(0.9rem, 1.5vw, 1.3rem);
        box-shadow: 0 20px 35px -24px rgba(15, 23, 42, 0.4);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        min-height: 0;
        height: auto;
        box-sizing: border-box;
        overflow: hidden;
}
.reveal .smartart__card:hover {
        transform: translateY(-4px);
        box-shadow: 0 24px 42px -20px rgba(15, 23, 42, 0.45);
}

/* Icon Proportions - Consistent Sizing */
.reveal .smartart__icon {
        width: clamp(2.25rem, 3.5vw, 2.75rem);
        height: clamp(2.25rem, 3.5vw, 2.75rem);
        border-radius: clamp(0.5rem, 0.8vw, 0.7rem);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-bottom: clamp(0.6rem, 1vh, 0.9rem);
        background: rgba(19, 127, 236, 0.16);
        color: #137fec;
        flex-shrink: 0;
}
.reveal .smartart__icon img,
.reveal .smartart__icon svg {
        width: 60%;
        height: 60%;
        max-width: 1.6rem;
        max-height: 1.6rem;
}

/* Card Content Typography */
.reveal .smartart__title {
        font-size: clamp(0.95rem, 1.3vw + 0.15rem, 1.2rem);
        font-weight: 700;
        margin: 0 0 clamp(0.3rem, 0.6vh, 0.5rem);
        color: inherit;
        line-height: 1.3;
        flex-shrink: 0;
}
.reveal .smartart__description {
        font-size: clamp(0.8rem, 0.9vw + 0.08rem, 0.95rem);
        line-height: 1.5;
        color: color-mix(in srgb, currentColor 72%, transparent);
        margin-bottom: clamp(0.6rem, 1vh, 0.9rem);
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
}

/* CTA Button - Balanced Proportions */
.reveal .smartart__cta {
        margin-top: auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.3rem;
        background: #137fec;
        color: #ffffff !important;
        padding: clamp(0.45rem, 0.8vh, 0.6rem) clamp(0.8rem, 1.5vw, 1.1rem);
        border-radius: clamp(0.4rem, 0.7vw, 0.55rem);
        font-size: clamp(0.75rem, 0.85vw + 0.05rem, 0.9rem);
        font-weight: 600;
        text-decoration: none;
        transition: background 0.2s ease, transform 0.15s ease;
        box-shadow: 0 8px 16px -8px rgba(19, 127, 236, 0.5);
        white-space: nowrap;
        flex-shrink: 0;
}
.reveal .smartart__cta:hover {
        background: #0f6bd1;
        transform: translateY(-1px);
        box-shadow: 0 10px 20px -6px rgba(19, 127, 236, 0.6);
}

/* Lined List Layout */
.reveal .smartart[data-layout="lined"] .smartart__list {
        list-style: none;
        margin: 0;
        padding: 0;
        background: color-mix(in srgb, var(--r-background-color, #f9fafb) 65%, #ffffff 35%);
        border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
        border-radius: clamp(0.5rem, 0.8vw, 0.75rem);
        box-shadow: 0 20px 35px -28px rgba(15, 23, 42, 0.38);
        overflow: hidden;
        flex: 1 1 auto;
}
.reveal .smartart[data-layout="lined"] .smartart__list-item {
        display: flex;
        align-items: center;
        gap: clamp(0.6rem, 1.2vw, 1rem);
        padding: clamp(0.75rem, 1.2vh, 1rem) clamp(0.9rem, 1.5vw, 1.3rem);
        transition: background 0.2s ease;
}
.reveal .smartart[data-layout="lined"] .smartart__list-item + .smartart__list-item {
        border-top: 1px solid color-mix(in srgb, currentColor 10%, transparent);
}
.reveal .smartart[data-layout="lined"] .smartart__list-item:hover {
        background: color-mix(in srgb, var(--r-background-color, #f1f5f9) 55%, transparent);
}

/* List Icon Proportions */
.reveal .smartart__list-icon {
        flex: 0 0 auto;
        width: clamp(2rem, 3vw, 2.5rem);
        height: clamp(2rem, 3vw, 2.5rem);
        border-radius: clamp(0.45rem, 0.7vw, 0.65rem);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: rgba(19, 127, 236, 0.14);
        color: #137fec;
}
.reveal .smartart__list-icon img,
.reveal .smartart__list-icon svg {
        width: 60%;
        height: 60%;
        max-width: 1.4rem;
        max-height: 1.4rem;
}

/* List Content */
.reveal .smartart__list-content {
        flex: 1 1 auto;
        min-width: 0;
}
.reveal .smartart__list-title {
        font-size: clamp(0.9rem, 1.2vw + 0.1rem, 1.1rem);
        font-weight: 600;
        margin: 0;
        color: inherit;
        line-height: 1.3;
}
.reveal .smartart__list-description {
        margin: clamp(0.2rem, 0.4vh, 0.3rem) 0 0;
        color: color-mix(in srgb, currentColor 70%, transparent);
        font-size: clamp(0.75rem, 0.9vw + 0.05rem, 0.9rem);
        line-height: 1.5;
}
.reveal .smartart__list-meta {
        flex: 0 0 auto;
        margin-left: clamp(0.6rem, 1.2vw, 1rem);
        font-size: clamp(0.75rem, 0.9vw, 0.9rem);
        font-weight: 600;
        color: color-mix(in srgb, currentColor 65%, transparent);
        white-space: nowrap;
}

/* Dark Theme Support */
.reveal .has-dark-background .smartart {
        color: #f8fafc;
}
.reveal .has-dark-background .smartart__intro {
        color: rgba(226, 232, 240, 0.78);
}
.reveal .has-dark-background .smartart__card {
        background: rgba(15, 23, 42, 0.86);
        border-color: rgba(148, 163, 184, 0.22);
        box-shadow: 0 18px 36px -22px rgba(0, 0, 0, 0.7);
}
.reveal .has-dark-background .smartart__card:hover {
        box-shadow: 0 22px 44px -18px rgba(0, 0, 0, 0.75);
}
.reveal .has-dark-background .smartart__description {
        color: rgba(226, 232, 240, 0.7);
}
.reveal .has-dark-background .smartart__cta {
        box-shadow: 0 8px 18px -8px rgba(19, 127, 236, 0.7);
}
.reveal .has-dark-background .smartart__cta:hover {
        box-shadow: 0 10px 22px -6px rgba(19, 127, 236, 0.8);
}
.reveal .has-dark-background .smartart[data-layout="lined"] .smartart__list {
        background: rgba(15, 23, 42, 0.84);
        border-color: rgba(148, 163, 184, 0.22);
        box-shadow: 0 18px 36px -28px rgba(0, 0, 0, 0.75);
}
.reveal .has-dark-background .smartart__list-item + .smartart__list-item {
        border-color: rgba(148, 163, 184, 0.2);
}
.reveal .has-dark-background .smartart__list-item:hover {
        background: rgba(15, 23, 42, 0.6);
}
.reveal .has-dark-background .smartart__list-description {
        color: rgba(226, 232, 240, 0.72);
}

/* ================================================
   RESPONSIVE BREAKPOINTS
   ================================================ */

/* Tablet and Below - Adjust Grid */
@media screen and (max-width: 1024px) {
        .reveal .smartart[data-layout="grid"] .smartart__grid,
        .reveal .smartart:not([data-layout]) .smartart__grid {
                grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
        }
        .reveal .smartart__card {
                padding: 1rem 0.9rem;
        }
}

/* Small Tablets and Large Phones */
@media screen and (max-width: 768px) {
        .reveal .smartart {
                padding: 0.75rem clamp(0.75rem, 3vw, 1.25rem);
        }
        .reveal .smartart[data-layout="horizontal"] .smartart__card {
                flex: 1 1 100%;
                max-width: 100%;
        }
        .reveal .smartart[data-layout="grid"] .smartart__grid,
        .reveal .smartart[data-layout="vertical"] .smartart__grid,
        .reveal .smartart:not([data-layout]) .smartart__grid {
                grid-template-columns: 1fr;
                gap: 0.75rem;
        }
        .reveal .smartart__heading {
                font-size: 1.5rem;
        }
        .reveal .smartart__intro {
                font-size: 0.9rem;
        }
        .reveal .smartart__card {
                min-height: 0;
        }
        .reveal .smartart[data-layout="lined"] .smartart__list-item {
                flex-direction: row;
                gap: 0.75rem;
        }
        .reveal .smartart__list-meta {
                margin-left: 0.6rem;
        }
}

/* Mobile Phones - Single Column, Compact */
@media screen and (max-width: 480px) {
        .reveal .smartart {
                padding: 0.6rem 0.9rem;
        }
        .reveal .smartart__heading {
                font-size: 1.3rem;
                margin-bottom: 0.4rem;
        }
        .reveal .smartart__intro {
                font-size: 0.85rem;
                margin-bottom: 0.9rem;
        }
        .reveal .smartart__card {
                padding: 0.9rem 0.8rem;
        }
        .reveal .smartart__icon {
                width: 2rem;
                height: 2rem;
                margin-bottom: 0.6rem;
        }
        .reveal .smartart__title {
                font-size: 0.95rem;
        }
        .reveal .smartart__description {
                font-size: 0.8rem;
                margin-bottom: 0.75rem;
        }
        .reveal .smartart__cta {
                padding: 0.45rem 0.8rem;
                font-size: 0.75rem;
        }
        .reveal .smartart[data-layout="lined"] .smartart__list-item {
                padding: 0.75rem 0.9rem;
                gap: 0.6rem;
        }
        .reveal .smartart__list-icon {
                width: 2rem;
                height: 2rem;
        }
        .reveal .smartart__list-title {
                font-size: 0.85rem;
        }
        .reveal .smartart__list-description {
                font-size: 0.75rem;
        }
        .reveal .smartart__list-meta {
                font-size: 0.75rem;
                margin-left: 0.5rem;
        }
}

/* Height-Based Media Queries - Prevent Vertical Overflow */
@media screen and (max-height: 768px) {
        .reveal .smartart {
                padding: 0.6rem clamp(0.75rem, 2vw, 1.25rem);
        }
        .reveal .smartart__heading {
                font-size: clamp(1.3rem, 2vw, 1.8rem);
                margin-bottom: 0.4rem;
        }
        .reveal .smartart__intro {
                margin-bottom: 0.9rem;
                font-size: 0.85rem;
        }
        .reveal .smartart__card {
                padding: 0.9rem 1rem;
        }
        .reveal .smartart__icon {
                width: 2.25rem;
                height: 2.25rem;
                margin-bottom: 0.6rem;
        }
        .reveal .smartart__title {
                font-size: 1rem;
                margin-bottom: 0.3rem;
        }
        .reveal .smartart__description {
                font-size: 0.85rem;
                margin-bottom: 0.75rem;
        }
        .reveal .smartart[data-layout="lined"] .smartart__list-item {
                padding: 0.75rem 1rem;
        }
}

@media screen and (max-height: 600px) {
        .reveal .smartart {
                padding: 0.5rem 0.9rem;
        }
        .reveal .smartart__heading {
                font-size: 1.2rem;
                margin-bottom: 0.3rem;
        }
        .reveal .smartart__intro {
                margin-bottom: 0.6rem;
                font-size: 0.8rem;
        }
        .reveal .smartart__card {
                padding: 0.75rem 0.85rem;
        }
        .reveal .smartart__icon {
                width: 2rem;
                height: 2rem;
                margin-bottom: 0.5rem;
        }
        .reveal .smartart__title {
                font-size: 0.9rem;
                margin-bottom: 0.25rem;
        }
        .reveal .smartart__description {
                font-size: 0.75rem;
                margin-bottom: 0.6rem;
                line-height: 1.4;
        }
        .reveal .smartart__cta {
                padding: 0.4rem 0.75rem;
                font-size: 0.7rem;
        }
        .reveal .smartart[data-layout="lined"] .smartart__list-item {
                padding: 0.6rem 0.85rem;
                gap: 0.6rem;
        }
        .reveal .smartart__list-icon {
                width: 1.85rem;
                height: 1.85rem;
        }
        .reveal .smartart__list-title {
                font-size: 0.85rem;
        }
        .reveal .smartart__list-description {
                font-size: 0.75rem;
                margin-top: 0.2rem;
        }
}

/* Print Styles */
@media print {
        .reveal .smartart__card {
                break-inside: avoid;
                page-break-inside: avoid;
        }
        .reveal .smartart__card:hover {
                transform: none;
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
        const layout = orientationToLayout( orientation );
        const headingTokens = orientationIndex >= 0 ? firstLineTokens.slice( 0, orientationIndex ) : firstLineTokens;
        const remainderTokens = orientationIndex >= 0 ? firstLineTokens.slice( orientationIndex + 1 ) : [];

        const heading = headingTokens.join( ' ' ).trim();
        const firstItemCandidate = remainderTokens.join( ' ' ).trim();

        const detailLines = lines.slice( 1 );
        let intro = '';
        const itemSegments = [];

        if( firstItemCandidate ) {
                const sanitizedFirst = firstItemCandidate.replace( /^[-*+]\s+/, '' );
                const introMatch = sanitizedFirst.match( /^(?:intro|summary|description)\s*:\s*(.+)$/i );
                if( introMatch ) {
                        intro = introMatch[ 1 ].trim();
                }
                else {
                        itemSegments.push( sanitizedFirst );
                }
        }

        detailLines.forEach( line => {
                const sanitized = line.replace( /^[-*+]\s+/, '' );
                const introMatch = sanitized.match( /^(?:intro|summary|description)\s*:\s*(.+)$/i );
                if( introMatch ) {
                        intro = introMatch[ 1 ].trim();
                        return;
                }

                itemSegments.push( sanitized );
        } );

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

export default SmartArtPlugin;
