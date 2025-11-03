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
                LINED: 'lined',
                HERO: 'hero',
                CHECKLIST: 'checklist',
                ROADMAP: 'roadmap',
                PRICING: 'pricing',
				STATS: 'stats',
				NAVBAR: 'navbar',
				FOOTER: 'footer',
				ACCORDION: 'accordion',
				CAROUSEL: 'carousel',
				OFFCANVAS: 'drawer',
				SIDEDRAWER: 'drawer',
				DRAWER: 'drawer',
				MODAL: 'modal',
				DIALOG: 'modal'
        };

	const DEFAULT_ICONS = [
	        'lucide:cloud',
	        'lucide:bar-chart-3',
	        'lucide:shield-check',
	        'lucide:laptop-minimal',
	        'lucide:headset',
	        'lucide:network'
	];

	// Global footer configuration (when using ::: smartart ... FOOTER with global: true)
	let GLOBAL_SMARTART_FOOTER = null;

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

	/* Grid Layouts - Responsive with Proper Gaps and Overflow Prevention */
	.reveal .smartart[data-layout="horizontal"] .smartart__grid {
	        display: flex;
	        flex-wrap: wrap;
	        gap: clamp(0.75rem, 1.5vw, 1.25rem);
	        justify-content: center;
	        flex: 1 1 auto;
	        overflow: hidden;
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

	/* Typography - Fluid Scaling with Flex Constraints */
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
	        margin-bottom: clamp(0.75rem, 1.5vh, 1.25rem);
	}

	/* Card Component - Flexible Height with Auto-Scaling */
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

	/* Icon Proportions - Compact Sizing */
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
	        max-width: 1.5rem;
	        max-height: 1.5rem;
	}

	/* Card Content Typography - Compact Scaling */
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

	/* CTA Button - Compact Proportions */
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
	        border-radius: clamp(0.6rem, 1vw, 0.9rem);
	        box-shadow: 0 20px 35px -28px rgba(15, 23, 42, 0.38);
	        overflow: hidden;
	}
	.reveal .smartart[data-layout="lined"] .smartart__list-item {
	        display: flex;
	        align-items: center;
	        gap: clamp(0.75rem, 1.5vw, 1.25rem);
	        padding: clamp(0.9rem, 1.5vh, 1.25rem) clamp(1rem, 2vw, 1.75rem);
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
	        width: clamp(2.25rem, 3.5vw, 2.75rem);
	        height: clamp(2.25rem, 3.5vw, 2.75rem);
	        border-radius: clamp(0.55rem, 0.9vw, 0.75rem);
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
	        max-width: 1.5rem;
	        max-height: 1.5rem;
	}

	/* List Content */
	.reveal .smartart__list-content {
	        flex: 1 1 auto;
	        min-width: 0;
	}
	.reveal .smartart__list-title {
	        font-size: clamp(0.95rem, 1.3vw + 0.15rem, 1.2rem);
	        font-weight: 600;
	        margin: 0;
	        color: inherit;
	        line-height: 1.3;
	}
	.reveal .smartart__list-description {
	        margin: clamp(0.25rem, 0.5vh, 0.4rem) 0 0;
	        color: color-mix(in srgb, currentColor 70%, transparent);
	        font-size: clamp(0.8rem, 1vw + 0.05rem, 0.95rem);
	        line-height: 1.5;
	}
	.reveal .smartart__list-meta {
	        flex: 0 0 auto;
	        margin-left: clamp(0.75rem, 1.5vw, 1.25rem);
	        font-size: clamp(0.8rem, 1vw, 0.95rem);
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
	   HERO LAYOUT - BOOTSTRAP-STYLE HERO SECTIONS
	   ================================================ */

	/* ================================================
	   NAVBAR LAYOUT - FULL-WIDTH TOP BANNER
	   ================================================ */
	.reveal .smartart[data-layout="navbar"] {
	        --smartart-navbar-height: clamp(48px, 8vh, 72px);
	        --smartart-navbar-bg: var(--r-link-color, #137fec);
	        --smartart-navbar-fg: #ffffff;
	        width: 100%;
	        max-width: 100%;
	        padding: 0;
	        margin: 0;
	        border-radius: 0;
	        background: var(--smartart-navbar-bg);
	        color: var(--smartart-navbar-fg);
	        min-height: var(--smartart-navbar-height);
	        display: flex;
	        align-items: center;
	        box-shadow: 0 6px 16px -8px rgba(0,0,0,0.25);
	        box-sizing: border-box;
	}

	.reveal .smartart__navbar-inner {
	        width: 100%;
	        padding: 0 clamp(1rem, 3vw, 2rem);
	        display: flex;
	        flex-direction: column;
	        gap: clamp(2px, 0.6vh, 6px);
	        align-items: center;
	        justify-content: center;
	}

	.reveal .smartart[data-layout="navbar"][data-align="left"] .smartart__navbar-inner { align-items: flex-start; }
	.reveal .smartart[data-layout="navbar"][data-align="right"] .smartart__navbar-inner { align-items: flex-end; }

	.reveal .smartart__navbar-title {
	        margin: 0;
	        font-weight: 700;
	        line-height: 1.2;
	        font-size: clamp(1rem, 2.1vw, 1.5rem);
	}

	.reveal .smartart__navbar-subtitle {
	        margin: 0;
	        opacity: 0.9;
	        line-height: 1.4;
	        font-size: clamp(0.8rem, 1.4vw, 1rem);
	}

	/* Ensure slide content sits below the navbar when present */
	.reveal section[data-has-navbar="true"] { 
	        padding-top: calc(var(--smartart-navbar-height, 64px) + clamp(6px, 1vh, 12px));
	}

	/* ================================================
	   FOOTER LAYOUT - SLIDE CORNER BRANDING
	   ================================================ */
	.reveal .smartart[data-layout="footer"] {
	        --smartart-footer-height: clamp(20px, 4vh, 32px);
	        position: absolute;
	        left: clamp(8px, 1.6vw, 16px);
	        bottom: clamp(6px, 1.2vh, 12px);
	        padding: 0;
	        margin: 0;
	        background: transparent;
	        box-shadow: none;
	        width: auto;
	        max-width: none;
	        display: inline-flex;
	        align-items: center;
	        gap: .4rem;
	        pointer-events: none; /* container ignores clicks */
	        z-index: 5;
	}

	.reveal .smartart__footer { display: inline-flex; align-items: center; gap: .4rem; pointer-events: auto; }
	.reveal .smartart__footer-logo { display: inline-flex; align-items: center; }
	.reveal .smartart__footer-logo img { height: var(--smartart-footer-height); width: auto; display: block; }

	/* Alignment options */
	.reveal .smartart[data-layout="footer"][data-align="center"] { left: 50%; right: auto; transform: translateX(-50%); }
	.reveal .smartart[data-layout="footer"][data-align="right"] { left: auto; right: clamp(8px, 1.6vw, 16px); transform: none; }

	/* Dark background subtle lift */
	.reveal .has-dark-background .smartart[data-layout="footer"] .smartart__footer-logo img {
	        filter: drop-shadow(0 0 2px rgba(0,0,0,.6));
	}

	/* ================================================
	   ACCORDION LAYOUT - COLLAPSIBLE SECTIONS
	   ================================================ */
	.reveal .smartart[data-layout="accordion"] {
	        width: 100%;
	        max-width: min(96%, 900px);
	        margin: 0 auto;
	}
	.reveal .smartart__accordion {
	        border: 1px solid color-mix(in srgb, currentColor 14%, transparent);
	        border-radius: 10px;
	        overflow: hidden;
	        background: color-mix(in srgb, var(--r-background-color, #f8fafc) 65%, #ffffff 35%);

	}
	.reveal .smartart__accordion-item + .smartart__accordion-item { border-top: 1px solid color-mix(in srgb, currentColor 12%, transparent); }
	.reveal .smartart__accordion-header {
	        margin: 0;
	}
	.reveal .smartart__accordion-button {
	        appearance: none;
	        width: 100%;
	        text-align: left;
	        padding: clamp(0.9rem, 1.6vh, 1.2rem) clamp(1rem, 2.5vw, 1.5rem);
	        background: transparent;
	        border: 0;
	        font-weight: 700;
	        font-size: clamp(0.95rem, 1.3vw + 0.15rem, 1.15rem);
	        line-height: 1.3;
	        display: flex;
	        align-items: center;
	        gap: 0.75rem;
	        cursor: pointer;
	}
	.reveal .smartart__accordion-icon {
	        margin-left: auto;
	        transition: transform 0.2s ease;
	}
	.reveal .smartart__accordion-button[aria-expanded="true"] .smartart__accordion-icon { transform: rotate(90deg); }
	.reveal .smartart__accordion-panel {
	        overflow: hidden;
	        max-height: 0;
	        transition: max-height 0.25s ease;
	}
	.reveal .smartart__accordion-panel-inner {
	        padding: 0 1.5rem 1rem 1.5rem;
	        color: color-mix(in srgb, currentColor 78%, transparent);
	        font-size: clamp(0.85rem, 1vw, 1rem);
	        line-height: 1.6;
	        text-align: left;
	}

	/* Dark theme adjustments */
	.reveal .has-dark-background .smartart[data-layout="accordion"] .smartart__accordion { 
	        background: rgba(15, 23, 42, 0.86);
	        border-color: rgba(148, 163, 184, 0.22);
	}
	.reveal .has-dark-background .smartart__accordion-panel-inner { color: rgba(226,232,240,0.8); }

	/* ================================================
	   CAROUSEL LAYOUT - IMAGE SLIDER
	   ================================================ */
	.reveal .smartart[data-layout="carousel"] {
	        width: 100%;
	        max-width: min(96%, 1100px);
	        margin: 0 auto;
	}
	.reveal .smartart__carousel {
	        position: relative;
	        overflow: hidden;
	        border-radius: 10px;
	        background: color-mix(in srgb, var(--r-background-color, #f1f5f9) 60%, #fff 40%);
	        height: var(--smartart-carousel-height, clamp(240px, 48vh, 520px));
	}
	.reveal .smartart__carousel-track {
	        display: flex;
	        height: 100%;
	        transition: transform 400ms ease;
	}
	.reveal .smartart__carousel-slide {
	        position: relative;
	        min-width: 100%;
	        height: 100%;
	}
	.reveal .smartart__carousel-slide img {
	        width: 100%;
	        height: 100%;
	        object-fit: cover;
	        display: block;
	}
	.reveal .smartart__carousel-caption {
	        position: absolute;
	        left: 0; right: 0; bottom: 0;
	        background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.6) 100%);
	        color: #fff;
	        padding: 1rem 1.25rem;
	}
	.reveal .smartart__carousel-caption h3 { margin: 0 0 0.25rem; font-size: clamp(1rem, 1.6vw, 1.4rem); }
	.reveal .smartart__carousel-caption p { margin: 0; opacity: 0.9; font-size: clamp(0.85rem, 1.2vw, 1rem); }

	/* Controls */
	.reveal .smartart__carousel-control {
	        position: absolute;
	        top: 50%; transform: translateY(-50%);
	        background: rgba(0,0,0,0.35);
	        color: #fff;
	        border: 0;
	        width: 42px; height: 42px;
	        border-radius: 999px;
	        cursor: pointer;
	        display: grid; place-items: center;
	}
	.reveal .smartart__carousel-control:hover { background: rgba(0,0,0,0.5); }
	.reveal .smartart__carousel-control[disabled] { opacity: 0.5; cursor: default; }
	.reveal .smartart__carousel-control--prev { left: 10px; }
	.reveal .smartart__carousel-control--next { right: 10px; }

	/* Indicators */
	.reveal .smartart__carousel-indicators {
	        position: absolute; left: 0; right: 0; bottom: 8px;
	        display: flex; justify-content: center; gap: 6px;
	}
	.reveal .smartart__carousel-indicators button {
	        width: 8px; height: 8px; border-radius: 999px; border: 0;
	        background: rgba(255,255,255,0.5);
	        padding: 0; cursor: pointer;
	}
	.reveal .smartart__carousel-indicators button[aria-current="true"] { background: #fff; }

	/* Dark background optimization */
	.reveal .has-dark-background .smartart[data-layout="carousel"] .smartart__carousel { background: rgba(15,23,42,0.6); }

	/* ================================================
	   DRAWER LAYOUT - OFFCANVAS SIDEDRAWER
	   ================================================ */
	.reveal .smartart[data-layout="drawer"] {
	        width: 100%;
	        max-width: min(96%, 1100px);
	        margin: 0 auto;
	}
	.reveal .smartart__drawer-toggle { /* inline button */
	        display: inline-flex;
	        align-items: center; justify-content: center; gap: .4rem;
	        padding: .55rem 1rem; border-radius: .55rem; border: 2px solid #137fec;
	        background: #137fec; color: #fff !important; text-decoration: none;
	        font-weight: 600; cursor: pointer;
	}
	.reveal .smartart__drawer-toggle:hover { background:#0f6bd1; border-color:#0f6bd1; }

	.reveal .smartart__drawer-backdrop, .smartart__drawer-backdrop {
		position: fixed; inset: 0; background: rgba(0,0,0,.45);
	        opacity: 0; pointer-events: none; transition: opacity .25s ease; z-index: 1000;
	}
	.reveal .smartart__drawer-backdrop.is-visible, .smartart__drawer-backdrop.is-visible { opacity: 1; pointer-events: auto; }

	.reveal .smartart__drawer-panel, .smartart__drawer-panel {
		position: fixed; background: color-mix(in srgb, var(--r-background-color,#f8fafc) 75%, #fff 25%);
	        color: var(--r-main-color, #111827);
	        z-index: 1001; box-shadow: 0 20px 40px rgba(0,0,0,0.35);
	        border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
	        border-radius: 10px; overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain;
	        transition: transform .3s ease;
	}
	/* Positions */
	.reveal .smartart__drawer-panel[data-position="start"],
	.reveal .smartart__drawer-panel[data-position="left"],
	.smartart__drawer-panel[data-position="start"],
	.smartart__drawer-panel[data-position="left"] { top:0; bottom:0; left:0; width: var(--smartart-drawer-size, 320px); height: 100vh; transform: translateX(-100%); }
	.reveal .smartart__drawer-panel[data-position="end"],
	.reveal .smartart__drawer-panel[data-position="right"],
	.smartart__drawer-panel[data-position="end"],
	.smartart__drawer-panel[data-position="right"] { top:0; bottom:0; right:0; width: var(--smartart-drawer-size, 320px); height: 100vh; transform: translateX(100%); }
	.reveal .smartart__drawer-panel[data-position="top"],
	.smartart__drawer-panel[data-position="top"] { top:0; left:0; right:0; height: var(--smartart-drawer-size, 45vh); transform: translateY(-100%); }
	.reveal .smartart__drawer-panel[data-position="bottom"],
	.smartart__drawer-panel[data-position="bottom"] { bottom:0; left:0; right:0; height: var(--smartart-drawer-size, 45vh); transform: translateY(100%); }

	.reveal .smartart__drawer-panel.is-open[data-position="start"],
	.reveal .smartart__drawer-panel.is-open[data-position="left"],
	.reveal .smartart__drawer-panel.is-open[data-position="end"],
	.reveal .smartart__drawer-panel.is-open[data-position="right"],
	.reveal .smartart__drawer-panel.is-open[data-position="top"],
	.reveal .smartart__drawer-panel.is-open[data-position="bottom"],
	.smartart__drawer-panel.is-open[data-position] { transform: translate(0,0); }

	/* Drawer inner */
	.reveal .smartart__drawer-header, .smartart__drawer-header { display:flex; align-items:center; justify-content:space-between; padding: 1rem 1rem .5rem 1rem; position: sticky; top:0; background: inherit; z-index: 1; }
	.reveal .smartart__drawer-title, .smartart__drawer-title { margin:0; font-weight:700; font-size: clamp(1rem, 1.6vw, 1.25rem); }
	.reveal .smartart__drawer-close, .smartart__drawer-close { background: transparent; border:0; width:38px; height:38px; border-radius:10px; cursor:pointer; display:grid; place-items:center; }
	.reveal .smartart__drawer-close:hover, .smartart__drawer-close:hover { background: color-mix(in srgb, currentColor 10%, transparent); }
	.reveal .smartart__drawer-body, .smartart__drawer-body { padding: .25rem 1rem 1rem 1rem; display:flex; flex-direction:column; gap:.75rem; }

	/* LLM Runner integration: make runner use available width in the drawer */
	.smartart__drawer-panel .llm-runner-wrapper { max-width: none !important; width: 100% !important; margin: 0 !important; }
	.smartart__drawer-panel .llm-runner-actions { padding-left: 0; padding-right: 0; }
	.smartart__drawer-panel .llm-runner-output { font-family: 'Montserrat', Arial, Helvetica, sans-serif; font-size: 1rem; line-height: 1.65; white-space: pre-wrap; word-break: break-word; }

	/* When a panel is marked wide, expand its logical width via CSS var */
	.smartart__drawer-panel.smartart--wide { --smartart-drawer-size: clamp(520px, 70vw, 1100px); }
	.reveal .smartart__drawer-list, .smartart__drawer-list { list-style:none; margin:0; padding:0; }
	.reveal .smartart__drawer-list li, .smartart__drawer-list li { padding: .5rem 0; border-bottom: 1px solid color-mix(in srgb, currentColor 12%, transparent); }
	.reveal .smartart__drawer-list li:last-child, .smartart__drawer-list li:last-child { border-bottom: 0; }
	.smartart__drawer-list li strong { display:block; font-size: clamp(.95rem, 1.2vw, 1.05rem); margin-bottom:.25rem; }
	.smartart__drawer-list li div { color: color-mix(in srgb, currentColor 70%, transparent); font-size: .95em; margin-bottom: .35rem; }
	.smartart__drawer-panel .smartart__cta { display:inline-flex; align-items:center; justify-content:center; gap:.35rem; background:#137fec; color:#fff !important; padding:.45rem .9rem; border-radius:.55rem; font-weight:600; text-decoration:none; border:2px solid #137fec; }
	.smartart__drawer-panel .smartart__cta:hover { background:#0f6bd1; border-color:#0f6bd1; }

	/* Dark background adjustments */
	.reveal .has-dark-background .smartart__drawer-panel { background: rgba(15,23,42,0.9); color:#f8fafc; border-color: rgba(148,163,184,0.25); }
	.reveal .has-dark-background .smartart__drawer-toggle { box-shadow:none; }

	/* ================================================
	   Drawer Form Elements - Bootstrap-like comfort
	   ================================================ */
	.smartart__drawer-panel form, .smartart__drawer-body form { display:flex; flex-direction:column; gap: .75rem; }
	.smartart__drawer-panel label { display:block; font-weight:600; font-size: .95rem; margin-bottom: .35rem; }
	.smartart__drawer-panel input[type="text"],
	.smartart__drawer-panel input[type="email"],
	.smartart__drawer-panel input[type="number"],
	.smartart__drawer-panel input[type="search"],
	.smartart__drawer-panel input[type="password"],
	.smartart__drawer-panel select,
	.smartart__drawer-panel textarea {
	        width: 100%;
	        padding: .6rem .75rem;
	        border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
	        border-radius: .6rem;
	        background: color-mix(in srgb, var(--r-background-color, #ffffff) 85%, #fff 15%);
	        color: inherit;
	        font-size: 1rem;
	        line-height: 1.4;
	        min-height: 42px;
	        box-sizing: border-box;
	        transition: border-color .15s ease, box-shadow .15s ease;
	}
	.smartart__drawer-panel textarea { min-height: 120px; resize: vertical; }
	.smartart__drawer-panel input:focus,
	.smartart__drawer-panel select:focus,
	.smartart__drawer-panel textarea:focus {
	        outline: none;
	        border-color: #137fec;
	        box-shadow: 0 0 0 3px rgba(19,127,236,.15);
	}
	.smartart__drawer-panel input::placeholder,
	.smartart__drawer-panel textarea::placeholder { color: color-mix(in srgb, currentColor 55%, transparent); }
	.smartart__drawer-panel input[disabled],
	.smartart__drawer-panel select[disabled],
	.smartart__drawer-panel textarea[disabled] { background: color-mix(in srgb, currentColor 6%, transparent); opacity:.7; cursor: not-allowed; }

	/* Input group */
	.smartart__input-group { display:flex; align-items: stretch; width: 100%; }
	.smartart__input-group > .smartart__input-group-text { flex: 0 0 auto; display:grid; place-items:center; padding: .6rem .75rem; background: color-mix(in srgb, currentColor 8%, transparent); border: 1px solid color-mix(in srgb, currentColor 18%, transparent); color: inherit; }
	.smartart__input-group > input,
	.smartart__input-group > select,
	.smartart__input-group > textarea { flex: 1 1 auto; border-left: 0; }
	.smartart__input-group > input:first-child,
	.smartart__input-group > select:first-child,
	.smartart__input-group > textarea:first-child { border-left: 1px solid color-mix(in srgb, currentColor 18%, transparent); }
	.smartart__input-group > .smartart__input-group-text:first-child { border-top-left-radius: .6rem; border-bottom-left-radius: .6rem; }
	.smartart__input-group > .smartart__input-group-text:last-child { border-top-right-radius: .6rem; border-bottom-right-radius: .6rem; border-left:0; }

	/* Actions */
	.smartart__drawer-actions { display:flex; gap:.5rem; flex-wrap:wrap; margin-top:.25rem; }
	.smartart__btn { display:inline-flex; align-items:center; justify-content:center; gap:.35rem; padding:.55rem 1rem; border-radius:.6rem; border:2px solid #137fec; background:#137fec; color:#fff !important; font-weight:600; text-decoration:none; cursor:pointer; }
	.smartart__btn:hover { background:#0f6bd1; border-color:#0f6bd1; }
	.smartart__btn--secondary { background:transparent; color:#137fec !important; }
	.smartart__btn--secondary:hover { background: rgba(19,127,236,.08); }

	/* Dark theme tweaks for forms */
	.reveal .has-dark-background .smartart__drawer-panel input,
	.reveal .has-dark-background .smartart__drawer-panel select,
	.reveal .has-dark-background .smartart__drawer-panel textarea { background: rgba(15,23,42,.75); border-color: rgba(148,163,184,.25); color:#f8fafc; }
	.reveal .has-dark-background .smartart__input-group > .smartart__input-group-text { background: rgba(148,163,184,.15); border-color: rgba(148,163,184,.25); color:#e2e8f0; }

	/* === XShadcn-lite skin (adapts to AdaptiveX theme) === */
	.smartart__drawer-panel.smartart--xshadcn,
	.smartart__drawer-panel.smartart--xshadcn .smartart__drawer-body {
		--primary: var(--ax-purple, #6B3FA0);
		--ring: var(--ax-purple, #6B3FA0);
		--border: color-mix(in srgb, currentColor 18%, transparent);
		--background: var(--r-background-color, #ffffff);
		--foreground: var(--r-main-color, #111827);
	}

	.smartart__drawer-panel.smartart--xshadcn label { 
		font-weight: 600; 
		font-size: .9rem; 
		margin-bottom: .35rem; 
		color: color-mix(in srgb, var(--foreground) 92%, transparent);
	}

	.smartart__drawer-panel.smartart--xshadcn input[type="text"],
	.smartart__drawer-panel.smartart--xshadcn input[type="email"],
	.smartart__drawer-panel.smartart--xshadcn input[type="number"],
	.smartart__drawer-panel.smartart--xshadcn input[type="search"],
	.smartart__drawer-panel.smartart--xshadcn input[type="password"],
	.smartart__drawer-panel.smartart--xshadcn select,
	.smartart__drawer-panel.smartart--xshadcn textarea {
		appearance: none;
		background: var(--background);
		color: var(--foreground);
		border: 1px solid var(--border);
		border-radius: .6rem;
		padding: .6rem .75rem;
		line-height: 1.4;
		box-shadow: 0 1px 0 rgba(0,0,0,0.02) inset;
		transition: box-shadow .15s ease, border-color .15s ease, background .15s ease;
	}

	.smartart__drawer-panel.smartart--xshadcn textarea { min-height: 120px; resize: vertical; }

	.smartart__drawer-panel.smartart--xshadcn input:focus,
	.smartart__drawer-panel.smartart--xshadcn select:focus,
	.smartart__drawer-panel.smartart--xshadcn textarea:focus {
		outline: none;
		border-color: color-mix(in srgb, var(--ring) 75%, transparent);
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--ring) 55%, transparent);
		background: color-mix(in srgb, var(--background) 98%, transparent);
	}

	.smartart__drawer-panel.smartart--xshadcn input::placeholder,
	.smartart__drawer-panel.smartart--xshadcn textarea::placeholder { 
		color: color-mix(in srgb, var(--foreground) 45%, transparent); 
	}

	.smartart__drawer-panel.smartart--xshadcn .smartart__input-group > .smartart__input-group-text {
		background: color-mix(in srgb, var(--background) 94%, transparent);
		border-color: var(--border);
	}

	.smartart__drawer-panel.smartart--xshadcn .smartart__btn { 
		background: var(--primary); 
		border-color: var(--primary);
	}
	.smartart__drawer-panel.smartart--xshadcn .smartart__btn:hover { 
		background: color-mix(in srgb, var(--primary) 85%, transparent); 
		border-color: color-mix(in srgb, var(--primary) 85%, transparent); 
	}

	/* Dark background harmonization */
	.reveal .has-dark-background .smartart__drawer-panel.smartart--xshadcn { 
		--background: rgba(15,23,42,.85); 
		--foreground: #f8fafc; 
		--border: rgba(148,163,184,.25); 
	}

	/* ================================================
	   MODAL - Bootstrap 5 style, AdaptiveX tinted
	   ================================================ */
	.reveal .smartart[data-layout="modal"] { width: 100%; max-width: min(96%, 1100px); margin: 0 auto; }
	.reveal .smartart__modal-toggle { display:inline-flex; align-items:center; justify-content:center; gap:.4rem; padding:.55rem 1rem; border-radius:.55rem; border:2px solid #137fec; background:#137fec; color:#fff !important; text-decoration:none; font-weight:600; cursor:pointer; }
	.reveal .smartart__modal-toggle:hover { background:#0f6bd1; border-color:#0f6bd1; }

	.reveal .smartart__modal-backdrop, .smartart__modal-backdrop { position:fixed; inset:0; background: rgba(0,0,0,.5); opacity:0; pointer-events:none; transition: opacity .2s ease; z-index: 1100; }
	.reveal .smartart__modal-backdrop.is-visible, .smartart__modal-backdrop.is-visible { opacity:1; pointer-events:auto; }

	.reveal .smartart__modal, .smartart__modal { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; z-index:1101; pointer-events:none; }
	.reveal .smartart__modal-dialog, .smartart__modal-dialog { width: var(--smartart-modal-width, clamp(320px, 60vw, 920px)); max-width: 96vw; max-height: 88vh; background: color-mix(in srgb, var(--r-background-color,#f8fafc) 85%, #fff 15%); color: var(--r-main-color, #111827); border:1px solid color-mix(in srgb, currentColor 12%, transparent); border-radius: 12px; box-shadow: 0 24px 48px rgba(0,0,0,0.35); transform: translateY(-10px) scale(.98); opacity: 0; transition: transform .22s ease, opacity .22s ease; overflow: hidden; pointer-events:auto; }
	.reveal .smartart__modal.is-open .smartart__modal-dialog, .smartart__modal.is-open .smartart__modal-dialog { transform: translateY(0) scale(1); opacity: 1; }

	.reveal .smartart__modal-header, .smartart__modal-header { display:flex; align-items:center; justify-content:space-between; gap:.75rem; padding: 1rem 1rem .5rem 1rem; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent); }
	.reveal .smartart__modal-title, .smartart__modal-title { margin:0; font-weight:700; font-size: clamp(1rem, 1.6vw, 1.25rem); }
	.reveal .smartart__modal-close, .smartart__modal-close { background:transparent; border:0; width:38px; height:38px; border-radius:10px; cursor:pointer; display:grid; place-items:center; }
	.reveal .smartart__modal-close:hover, .smartart__modal-close:hover { background: color-mix(in srgb, currentColor 10%, transparent); }

	.reveal .smartart__modal-body, .smartart__modal-body { padding: 1rem; overflow:auto; max-height: calc(88vh - 3.25rem - 3.25rem); display:flex; flex-direction:column; gap:.75rem; }
	.reveal .smartart__modal-footer, .smartart__modal-footer { padding: .75rem 1rem 1rem 1rem; display:flex; gap:.5rem; flex-wrap: wrap; justify-content:flex-end; border-top: 1px solid color-mix(in srgb, currentColor 10%, transparent); }

	.reveal .smartart__modal-list, .smartart__modal-list { list-style:none; margin:0; padding:0; }
	.reveal .smartart__modal-list li, .smartart__modal-list li { padding: .5rem 0; border-bottom: 1px solid color-mix(in srgb, currentColor 12%, transparent); }
	.reveal .smartart__modal-list li:last-child, .smartart__modal-list li:last-child { border-bottom:0; }
	.smartart__modal-list li strong { display:block; font-size: clamp(.95rem, 1.2vw, 1.05rem); margin-bottom:.25rem; }
	.smartart__modal-list li div { color: color-mix(in srgb, currentColor 70%, transparent); font-size:.95em; margin-bottom:.35rem; }

	/* Dark adjustments */
	.reveal .has-dark-background .smartart__modal-dialog { background: rgba(15,23,42,0.92); color:#f8fafc; border-color: rgba(148,163,184,0.25); }

	/* xshadcn-lite comfort for forms inside modal as well */
	.smartart__modal-dialog.smartart--xshadcn input[type="text"],
	.smartart__modal-dialog.smartart--xshadcn input[type="email"],
	.smartart__modal-dialog.smartart--xshadcn input[type="number"],
	.smartart__modal-dialog.smartart--xshadcn input[type="search"],
	.smartart__modal-dialog.smartart--xshadcn input[type="password"],
	.smartart__modal-dialog.smartart--xshadcn select,
	.smartart__modal-dialog.smartart--xshadcn textarea { width:100%; padding:.6rem .75rem; border:1px solid color-mix(in srgb, currentColor 18%, transparent); border-radius:.6rem; background: color-mix(in srgb, var(--r-background-color, #ffffff) 85%, #fff 15%); color: inherit; font-size:1rem; line-height:1.4; min-height:42px; box-sizing:border-box; transition: border-color .15s ease, box-shadow .15s ease; }
	.smartart__modal-dialog.smartart--xshadcn textarea { min-height: 120px; resize: vertical; }
	.smartart__modal-dialog.smartart--xshadcn input:focus,
	.smartart__modal-dialog.smartart--xshadcn select:focus,
	.smartart__modal-dialog.smartart--xshadcn textarea:focus { outline:none; border-color:#137fec; box-shadow: 0 0 0 3px rgba(19,127,236,.15); }
	.smartart__modal-dialog.smartart--xshadcn .smartart__btn { background:#137fec; border-color:#137fec; color:#fff !important; }
	.smartart__modal-dialog.smartart--xshadcn .smartart__btn:hover { background:#0f6bd1; border-color:#0f6bd1; }

	/* Utility: modal size variants similar to Bootstrap */
	.smartart__modal-dialog[data-size="sm"] { --smartart-modal-width: clamp(280px, 40vw, 600px); }
	.smartart__modal-dialog[data-size="lg"] { --smartart-modal-width: clamp(520px, 70vw, 1100px); }
	.smartart__modal-dialog[data-size="xl"] { --smartart-modal-width: clamp(720px, 84vw, 1400px); }
	.smartart__modal-dialog[data-size="fullscreen"] { --smartart-modal-width: 96vw; max-height: 96vh; border-radius: 0; }

	/* Card variant for carousel */
	.reveal .smartart[data-layout="carousel"][data-variant="cards"] .smartart__carousel-slide {
	        display: grid;
	        place-items: center;
	}
	.reveal .smartart__carousel-card {
	        display: flex;
	        flex-direction: column;
	        gap: clamp(0.5rem, 1vh, 0.75rem);
	        width: min(92%, 820px);
	        margin: 0 auto;
	        padding: clamp(1rem, 2vh, 1.5rem) clamp(1rem, 3vw, 2rem);
	        background: color-mix(in srgb, var(--r-background-color, #f8fafc) 65%, #ffffff 35%);
	        border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
	        border-radius: clamp(0.6rem, 1vw, 0.9rem);
	        box-shadow: 0 20px 35px -24px rgba(15, 23, 42, 0.35);
	        text-align: left;
	}
	.reveal .smartart__carousel-card-header { display: flex; align-items: center; gap: 0.75rem; }
	.reveal .smartart__carousel-card-icon { width: 42px; height: 42px; border-radius: 10px; display: grid; place-items: center; background: rgba(19,127,236,0.14); }
	.reveal .smartart__carousel-card-icon img { width: 24px; height: 24px; }
	.reveal .smartart__carousel-card-title { margin: 0; font-size: clamp(1.1rem, 2vw, 1.4rem); }
	.reveal .smartart__carousel-card-body { margin: 0; color: color-mix(in srgb, currentColor 72%, transparent); font-size: clamp(0.9rem, 1.2vw, 1rem); line-height: 1.6; }
	.reveal .smartart__carousel-card-actions { margin-top: 0.5rem; }

	/* Dark tweaks */
	.reveal .has-dark-background .smartart__carousel-card { background: rgba(15, 23, 42, 0.86); border-color: rgba(148,163,184,0.22); box-shadow: 0 18px 36px -22px rgba(0,0,0,0.7); }

	/* Hero Container */
	.reveal .smartart[data-layout="hero"] {
	        padding: clamp(1.5rem, 3vh, 2.5rem) clamp(1rem, 3vw, 3rem);
	}

	/* Hero Grid - Two Column Responsive */
	.reveal .smartart__hero-grid {
	        display: grid;
	        grid-template-columns: 1fr 1fr;
	        gap: clamp(2rem, 4vw, 4rem);
	        align-items: center;
	        flex: 1 1 auto;
	        overflow: hidden;
	}

	/* Hero Content (Left Column) */
	.reveal .smartart__hero-content {
	        display: flex;
	        flex-direction: column;
	        gap: clamp(1rem, 2vh, 1.5rem);
	        justify-content: center;
	}

	/* Hero Heading - Large Display */
	.reveal .smartart__hero-heading {
	        font-size: clamp(2rem, 5vw, 3rem);
	        font-weight: 700;
	        line-height: 1.2;
	        margin: 0;
	        color: var(--r-main-color, #111827);
	}

	/* Hero Intro - Lead Paragraph */
	.reveal .smartart__hero-intro {
	        font-size: clamp(1rem, 2vw, 1.25rem);
	        line-height: 1.6;
	        margin: 0;
	        color: var(--r-muted-foreground, rgba(55, 65, 81, 0.85));
	        max-width: 100%;
	}

	/* Hero Actions - Button Container */
	.reveal .smartart__hero-actions {
	        display: flex;
	        flex-wrap: wrap;
	        gap: clamp(0.75rem, 1.5vw, 1rem);
	        margin-top: clamp(0.5rem, 1vh, 0.75rem);
	}

	/* Hero CTA - Primary Button */
	.reveal .smartart__hero-cta {
	        display: inline-flex;
	        align-items: center;
	        justify-content: center;
	        padding: clamp(0.75rem, 1.2vh, 1rem) clamp(1.5rem, 2.5vw, 2rem);
	        background: #137fec;
	        color: #ffffff !important;
	        font-size: clamp(0.9rem, 1vw + 0.1rem, 1.1rem);
	        font-weight: 600;
	        text-decoration: none;
	        border-radius: clamp(0.5rem, 0.8vw, 0.65rem);
	        transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
	        box-shadow: 0 10px 20px -10px rgba(19, 127, 236, 0.5);
	        white-space: nowrap;
	        border: 2px solid #137fec;
	}

	.reveal .smartart__hero-cta:hover {
	        background: #0f6bd1;
	        border-color: #0f6bd1;
	        transform: translateY(-2px);
	        box-shadow: 0 12px 24px -8px rgba(19, 127, 236, 0.6);
	}

	/* Hero CTA - Secondary/Outline Button */
	.reveal .smartart__hero-cta--secondary {
	        background: transparent;
	        color: #137fec !important;
	        border: 2px solid #137fec;
	        box-shadow: none;
	}

	.reveal .smartart__hero-cta--secondary:hover {
	        background: rgba(19, 127, 236, 0.08);
	        border-color: #0f6bd1;
	        color: #0f6bd1 !important;
	        box-shadow: 0 8px 16px -8px rgba(19, 127, 236, 0.3);
	}

	/* Hero Image Container (Right Column) */
	.reveal .smartart__hero-image {
	        display: flex;
	        align-items: center;
	        justify-content: center;
	        overflow: hidden;
	}

	.reveal .smartart__hero-image img {
	        width: 100%;
	        height: auto;
	        max-width: 100%;
	        max-height: 60vh;
	        object-fit: cover;
	        border-radius: clamp(0.75rem, 1vw, 1rem);
	        box-shadow: 0 20px 40px -20px rgba(15, 23, 42, 0.4);
	        transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.reveal .smartart__hero-image img:hover {
	        transform: scale(1.02);
	        box-shadow: 0 24px 48px -16px rgba(15, 23, 42, 0.45);
	}

	/* Dark Theme Support for Hero */
	.reveal .has-dark-background .smartart__hero-heading {
	        color: #f8fafc;
	}

	.reveal .has-dark-background .smartart__hero-intro {
	        color: rgba(226, 232, 240, 0.8);
	}

	.reveal .has-dark-background .smartart__hero-image img {
	        box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.7);
	}

	.reveal .has-dark-background .smartart__hero-image img:hover {
	        box-shadow: 0 24px 48px -16px rgba(0, 0, 0, 0.75);
	}

	.reveal .has-dark-background .smartart__hero-cta {
	        box-shadow: 0 10px 20px -10px rgba(19, 127, 236, 0.7);
	}

	.reveal .has-dark-background .smartart__hero-cta:hover {
	        box-shadow: 0 12px 24px -8px rgba(19, 127, 236, 0.8);
	}

	.reveal .has-dark-background .smartart__hero-cta--secondary {
	        border-color: rgba(148, 163, 184, 0.5);
	        color: rgba(226, 232, 240, 0.9) !important;
	}

	.reveal .has-dark-background .smartart__hero-cta--secondary:hover {
	        background: rgba(148, 163, 184, 0.15);
	        border-color: rgba(148, 163, 184, 0.7);
	        color: #f8fafc !important;
	}

	/* Hero Background-Image Variant - Full Viewport */
	/* Reveal.js handles backgrounds via data-background-image attributes */

	/* Ensure sections with hero components take full height */
	.reveal .slides section:has(.smartart--hero) {
	        height: 100% !important;
	        display: flex !important;
	        align-items: center !important;
	        justify-content: center !important;
	}

	.reveal .smartart--hero {
	        display: flex;
	        align-items: center;
	        justify-content: center;
	        width: 100%;
	        min-height: 100%;
	}

	.reveal .smartart__hero-content-centered {
	        position: relative;
	        z-index: 1;
	        text-align: center;
	        width: 100%;
	        max-width: 800px;
	        padding: clamp(2rem, 4vh, 3rem) clamp(1.5rem, 3vw, 2rem);
	        color: #ffffff;
	        margin: 0 auto;
	        background: rgba(0, 0, 0, 0.5);
	        border-radius: clamp(1rem, 2vw, 2rem);
	        backdrop-filter: blur(8px);
	        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.reveal .smartart__hero-heading-centered {
	        font-size: clamp(2.5rem, 6vw, 4rem);
	        font-weight: 700;
	        line-height: 1.1;
	        margin: 0 0 clamp(1rem, 2vh, 1.5rem);
	        color: #ffffff;
	        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 0.5);
	}

	.reveal .smartart__hero-subtitle {
	        font-size: clamp(1.1rem, 2.2vw, 1.5rem);
	        line-height: 1.6;
	        margin: 0 0 clamp(1.5rem, 3vh, 2rem);
	        color: rgba(255, 255, 255, 0.95);
	        text-shadow: 0 1px 8px rgba(0, 0, 0, 0.6), 0 1px 3px rgba(0, 0, 0, 0.4);
	}

	.reveal .smartart__hero-cta-centered {
	        display: inline-flex;
	        align-items: center;
	        justify-content: center;
	        gap: 0.5rem;
	        background: #6B46C1;
	        color: #ffffff !important;
	        padding: clamp(0.8rem, 1.5vh, 1rem) clamp(1.5rem, 3vw, 2rem);
	        border-radius: clamp(0.5rem, 1vw, 0.75rem);
	        font-size: clamp(1rem, 1.8vw, 1.25rem);
	        font-weight: 600;
	        text-decoration: none;
	        transition: all 0.3s ease;
	        box-shadow: 0 4px 14px 0 rgba(107, 70, 193, 0.4);
	        border: 2px solid #6B46C1;
	}

	.reveal .smartart__hero-cta-centered:hover {
	        background: #5a3ba1;
	        border-color: #5a3ba1;
	        transform: translateY(-2px);
	        box-shadow: 0 6px 20px 0 rgba(107, 70, 193, 0.5);
	}

	/* Mobile Responsive for Background Hero */
	@media (max-width: 768px) {
	        .reveal .smartart__hero-heading-centered {
	                font-size: 2rem;
	        }

	        .reveal .smartart__hero-subtitle {
	                font-size: 1.1rem;
	        }

	        .reveal .smartart__hero-cta-centered {
	                padding: 0.75rem 1.5rem;
	                font-size: 1rem;
	        }
	}

	@media (max-width: 480px) {
	        .reveal .smartart__hero-heading-centered {
	                font-size: 1.75rem;
	        }

	        .reveal .smartart__hero-subtitle {
	                font-size: 1rem;
	        }

	        .reveal .smartart__hero-cta-centered {
	                padding: 0.7rem 1.25rem;
	                font-size: 0.95rem;
	        }
	}

	/* ================================================
	   CHECKLIST LAYOUT - INTERACTIVE CHECKBOX LISTS
	   ================================================ */

	/* Checklist Container */
	.reveal .smartart[data-layout="checklist"] {
	        padding: clamp(1rem, 2vh, 1.5rem) clamp(1rem, 2.5vw, 2rem);
	}

	/* Checklist Grid - Vertical Stack */
	.reveal .smartart__checklist {
	        display: flex;
	        flex-direction: column;
	        gap: clamp(0.5rem, 1vh, 0.75rem);
	        flex: 1 1 auto;
	        overflow: hidden;
	}

	/* Checklist Item - Label Container */
	.reveal .smartart__checklist-item {
	        display: flex;
	        align-items: center;
	        gap: clamp(0.75rem, 1.5vw, 1rem);
	        padding: clamp(0.75rem, 1.5vh, 1rem) clamp(1rem, 2vw, 1.25rem);
	        background: color-mix(in srgb, var(--r-background-color, #ffffff) 50%, transparent);
	        border: 1px solid rgba(148, 163, 184, 0.3);
	        border-radius: clamp(0.5rem, 0.8vw, 0.75rem);
	        transition: all 0.2s ease;
	        cursor: pointer;
	        box-sizing: border-box;
	}

	.reveal .smartart__checklist-item:hover {
	        background: color-mix(in srgb, var(--r-background-color, #f1f5f9) 70%, transparent);
	        border-color: rgba(148, 163, 184, 0.4);
	}

	/* Checked State Styling */
	.reveal .smartart__checklist-item:has(input:checked) {
	        background: rgba(19, 127, 236, 0.1);
	        border-color: rgba(19, 127, 236, 0.5);
	}

	.reveal .smartart__checklist-item:has(input:checked):hover {
	        background: rgba(19, 127, 236, 0.15);
	        border-color: rgba(19, 127, 236, 0.6);
	}

	/* Checkbox Input - Custom Styled */
	.reveal .smartart__checklist-checkbox {
	        flex: 0 0 auto;
	        width: 24px;
	        height: 24px;
	        margin: 0;
	        appearance: none;
	        -webkit-appearance: none;
	        -moz-appearance: none;
	        background: transparent;
	        border: 2px solid rgba(148, 163, 184, 0.5);
	        border-radius: 0.375rem;
	        cursor: pointer;
	        transition: all 0.2s ease;
	        position: relative;
	        display: inline-flex;
	        align-items: center;
	        justify-content: center;
	}

	.reveal .smartart__checklist-checkbox:hover {
	        border-color: rgba(19, 127, 236, 0.6);
	        background: rgba(19, 127, 236, 0.05);
	}

	.reveal .smartart__checklist-checkbox:focus {
	        outline: 2px solid rgba(19, 127, 236, 0.4);
	        outline-offset: 2px;
	}

	/* Checked State - Blue Background with Checkmark */
	.reveal .smartart__checklist-checkbox:checked {
	        background: #137fec;
	        border-color: #137fec;
	        background-image: url('data:image/svg+xml,%3csvg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"%3e%3cpolyline points="20 6 9 17 4 12"%3e%3c/polyline%3e%3c/svg%3e');
	        background-repeat: no-repeat;
	        background-position: center;
	        background-size: 18px;
	}

	.reveal .smartart__checklist-checkbox:checked:hover {
	        background-color: #0f6bd1;
	        border-color: #0f6bd1;
	}

	/* Checkbox Label Text */
	.reveal .smartart__checklist-label {
	        flex: 1 1 auto;
	        font-size: clamp(0.85rem, 1vw, 1rem);
	        line-height: 1.5;
	        color: inherit;
	        user-select: none;
	        cursor: pointer;
	}

	/* Dark Theme Support for Checklist */
	.reveal .has-dark-background .smartart__checklist-item {
	        background: rgba(15, 23, 42, 0.5);
	        border-color: rgba(148, 163, 184, 0.2);
	}

	.reveal .has-dark-background .smartart__checklist-item:hover {
	        background: rgba(15, 23, 42, 0.7);
	        border-color: rgba(148, 163, 184, 0.3);
	}

	.reveal .has-dark-background .smartart__checklist-item:has(input:checked) {
	        background: rgba(19, 127, 236, 0.2);
	        border-color: rgba(19, 127, 236, 0.6);
	}

	.reveal .has-dark-background .smartart__checklist-item:has(input:checked):hover {
	        background: rgba(19, 127, 236, 0.25);
	        border-color: rgba(19, 127, 236, 0.7);
	}

	.reveal .has-dark-background .smartart__checklist-checkbox {
	        border-color: rgba(148, 163, 184, 0.4);
	}

	.reveal .has-dark-background .smartart__checklist-checkbox:hover {
	        border-color: rgba(19, 127, 236, 0.7);
	        background: rgba(19, 127, 236, 0.1);
	}

	/* ================================================
	   PRICING LAYOUT - COMPARISON/PRICING CARDS
	   ================================================ */

	/* Pricing Container */
	.reveal .smartart[data-layout="pricing"] {
	        padding: clamp(0.75rem, 1.5vh, 1rem) clamp(1rem, 2.5vw, 2rem);
	        max-height: 75vh;
	        display: flex;
	        flex-direction: column;
	        overflow: hidden;
	}

	/* Pricing Grid - 3 Column Responsive */
	.reveal .smartart__pricing-grid {
	        display: grid;
	        grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
	        grid-template-rows: 1fr;
	        gap: clamp(0.75rem, 1.5vw, 1rem);
	        flex: 1 1 auto;
	        overflow: hidden;
	        align-content: start;
	        align-items: stretch;
	        max-height: 65vh;
	}

	/* Individual Pricing Card */
	.reveal .smartart__pricing-card {
	        display: flex;
	        flex-direction: column;
	        background: color-mix(in srgb, var(--r-background-color, #ffffff) 80%, transparent);
	        border: 1px solid rgba(148, 163, 184, 0.3);
	        border-radius: clamp(0.75rem, 1vw, 1rem);
	        padding: clamp(1.25rem, 2vh, 1.5rem) clamp(1rem, 1.8vw, 1.25rem);
	        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	        transition: transform 0.3s ease, box-shadow 0.3s ease;
	        position: relative;
	        overflow: hidden;
	        box-sizing: border-box;
	        min-height: 0;
	        max-height: 100%;
	}

	.reveal .smartart__pricing-card:hover {
	        transform: translateY(-4px);
	        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
	}

	/* Featured/Highlighted Plan */
	.reveal .smartart__pricing-card--featured {
	        border: 2px solid #137fec;
	        box-shadow: 0 20px 40px rgba(19, 127, 236, 0.3);
	}

	.reveal .smartart__pricing-card--featured:hover {
	        box-shadow: 0 24px 48px rgba(19, 127, 236, 0.35);
	}

	/* Popular Badge - Diagonal Ribbon */
	.reveal .smartart__pricing-badge {
	        position: absolute;
	        top: 16px;
	        right: -25px;
	        background: #f59e0b;
	        color: #ffffff;
	        font-size: clamp(0.65rem, 0.8vw, 0.75rem);
	        font-weight: 700;
	        text-transform: uppercase;
	        padding: 6px 0;
	        width: 100px;
	        text-align: center;
	        transform: rotate(45deg);
	        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	        z-index: 10;
	}

	/* Card Header Section */
	.reveal .smartart__pricing-header {
	        display: flex;
	        flex-direction: column;
	        gap: clamp(0.4rem, 0.6vh, 0.6rem);
	        margin-bottom: clamp(0.75rem, 1.2vh, 1rem);
	        padding-bottom: clamp(0.5rem, 0.8vh, 0.75rem);
	        flex-shrink: 0;
	}

	/* Plan Name */
	.reveal .smartart__pricing-title {
	        font-size: clamp(1rem, 1.3vw, 1.2rem);
	        font-weight: 700;
	        margin: 0 0 clamp(0.3rem, 0.5vh, 0.5rem);
	        color: inherit;
	        line-height: 1.3;
	}

	/* Price Wrapper */
	.reveal .smartart__pricing-price-wrapper {
	        display: flex;
	        align-items: baseline;
	        gap: 0.25rem;
	        margin: clamp(0.3rem, 0.6vh, 0.5rem) 0;
	}

	/* Price Amount */
	.reveal .smartart__pricing-price {
	        font-size: clamp(2rem, 3.5vw, 2.5rem);
	        font-weight: 800;
	        color: inherit;
	        line-height: 1;
	}

	/* Price Period */
	.reveal .smartart__pricing-period {
	        font-size: clamp(0.75rem, 0.9vw, 0.9rem);
	        font-weight: 400;
	        color: color-mix(in srgb, currentColor 60%, transparent);
	}

	/* Description Text */
	.reveal .smartart__pricing-description {
	        font-size: clamp(0.75rem, 0.85vw, 0.85rem);
	        line-height: 1.4;
	        color: color-mix(in srgb, currentColor 70%, transparent);
	        margin: 0;
	        max-height: 3em;
	        overflow: hidden;
	        text-overflow: ellipsis;
	}

	/* CTA Button */
	.reveal .smartart__pricing-cta {
	        display: flex;
	        align-items: center;
	        justify-content: center;
	        padding: clamp(0.65rem, 1vh, 0.85rem) clamp(1rem, 1.8vw, 1.25rem);
	        font-size: clamp(0.8rem, 0.95vw, 0.9rem);
	        font-weight: 600;
	        text-decoration: none;
	        border-radius: clamp(0.5rem, 0.8vw, 0.65rem);
	        transition: all 0.2s ease;
	        white-space: nowrap;
	        flex-shrink: 0;
	        margin: clamp(0.75rem, 1.2vh, 1rem) 0 clamp(0.5rem, 0.8vh, 0.75rem);
	        width: 100%;
	        text-align: center;
	}

	/* Featured Button - Primary Blue */
	.reveal .smartart__pricing-cta--primary {
	        background: #137fec;
	        color: #ffffff !important;
	        border: 2px solid #137fec;
	        box-shadow: 0 8px 16px -8px rgba(19, 127, 236, 0.5);
	}

	.reveal .smartart__pricing-cta--primary:hover {
	        background: #0f6bd1;
	        border-color: #0f6bd1;
	        transform: translateY(-1px);
	        box-shadow: 0 10px 20px -6px rgba(19, 127, 236, 0.6);
	}

	/* Standard Button - Light Gray */
	.reveal .smartart__pricing-cta--secondary {
	        background: color-mix(in srgb, currentColor 8%, transparent);
	        color: inherit !important;
	        border: 2px solid color-mix(in srgb, currentColor 20%, transparent);
	        box-shadow: none;
	}

	.reveal .smartart__pricing-cta--secondary:hover {
	        background: color-mix(in srgb, currentColor 12%, transparent);
	        border-color: color-mix(in srgb, currentColor 30%, transparent);
	        transform: translateY(-1px);
	        box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
	}

	/* Features List */
	.reveal .smartart__pricing-features {
	        list-style: none;
	        margin: 0;
	        padding: 0;
	        padding-top: clamp(0.75rem, 1.2vh, 1rem);
	        border-top: 1px solid color-mix(in srgb, currentColor 15%, transparent);
	        display: flex;
	        flex-direction: column;
	        gap: clamp(0.6rem, 1vh, 0.8rem);
	        flex: 1 1 auto;
	        max-height: 25vh;
	        overflow-y: auto;
	        overflow-x: hidden;
	}

	/* Individual Feature Item */
	.reveal .smartart__pricing-feature {
	        display: flex;
	        align-items: center;
	        gap: clamp(0.6rem, 1vw, 0.75rem);
	        font-size: clamp(0.75rem, 0.9vw, 0.875rem);
	        line-height: 1.5;
	        color: color-mix(in srgb, currentColor 80%, transparent);
	}

	/* Custom scrollbar for feature lists */
	.reveal .smartart__pricing-features::-webkit-scrollbar {
	        width: 4px;
	}
	.reveal .smartart__pricing-features::-webkit-scrollbar-thumb {
	        background: rgba(148, 163, 184, 0.4);
	        border-radius: 2px;
	}
	.reveal .smartart__pricing-features::-webkit-scrollbar-track {
	        background: transparent;
	}

	/* Checkmark Icon */
	.reveal .smartart__pricing-icon {
	        width: clamp(16px, 1.2vw, 18px);
	        height: clamp(16px, 1.2vw, 18px);
	        flex-shrink: 0;
	        color: #10b981;
	        filter: brightness(0) saturate(100%) invert(61%) sepia(78%) saturate(450%) hue-rotate(102deg) brightness(95%) contrast(92%);
	        opacity: 0.9;
	}

	/* Dark Theme Support for Pricing */
	.reveal .has-dark-background .smartart__pricing-card {
	        background: rgba(15, 23, 42, 0.5);
	        border-color: rgba(148, 163, 184, 0.2);
	}

	.reveal .has-dark-background .smartart__pricing-card:hover {
	        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
	}

	.reveal .has-dark-background .smartart__pricing-card--featured {
	        border-color: #137fec;
	        box-shadow: 0 20px 40px rgba(19, 127, 236, 0.4);
	}

	.reveal .has-dark-background .smartart__pricing-card--featured:hover {
	        box-shadow: 0 24px 48px rgba(19, 127, 236, 0.45);
	}

	.reveal .has-dark-background .smartart__pricing-description {
	        color: rgba(226, 232, 240, 0.7);
	}

	.reveal .has-dark-background .smartart__pricing-period {
	        color: rgba(226, 232, 240, 0.6);
	}

	.reveal .has-dark-background .smartart__pricing-cta--secondary {
	        background: rgba(148, 163, 184, 0.2);
	        border-color: rgba(148, 163, 184, 0.3);
	}

	.reveal .has-dark-background .smartart__pricing-cta--secondary:hover {
	        background: rgba(148, 163, 184, 0.3);
	        border-color: rgba(148, 163, 184, 0.4);
	}

	.reveal .has-dark-background .smartart__pricing-features {
	        border-color: rgba(148, 163, 184, 0.2);
	}

	.reveal .has-dark-background .smartart__pricing-feature {
	        color: rgba(226, 232, 240, 0.85);
	}

	/* Dark theme scrollbar for pricing features */
	.reveal .has-dark-background .smartart__pricing-features::-webkit-scrollbar-thumb {
	        background: rgba(226, 232, 240, 0.3);
	}

	/* ================================================
	   ROADMAP LAYOUT - TIMELINE/MILESTONE VISUALIZATION
	   ================================================ */

	/* Roadmap Container */
	.reveal .smartart[data-layout="roadmap"] {
	        padding: clamp(1rem, 2vh, 1.5rem) clamp(1rem, 2.5vw, 2rem);
	}

	/* Main Roadmap Container */
	.reveal .smartart__roadmap {
	        display: flex;
	        flex-direction: column;
	        gap: clamp(2rem, 4vh, 3rem);
	        flex: 1 1 auto;
	        overflow: hidden;
	        position: relative;
	}

	/* Timeline Bar - Horizontal (Desktop) */
	.reveal .smartart__roadmap-timeline {
	        position: relative;
	        height: 2px;
	        background: rgba(148, 163, 184, 0.3);
	        border-radius: 1px;
	        margin: clamp(1.5rem, 3vh, 2rem) 0;
	}

	/* Progress Fill on Timeline */
	.reveal .smartart__roadmap-progress {
	        position: absolute;
	        left: 0;
	        top: 0;
	        height: 100%;
	        background: #137fec;
	        border-radius: 1px;
	        transition: width 0.6s ease;
	}

	/* Roadmap Items Container */
	.reveal .smartart__roadmap-items {
	        display: grid;
	        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	        gap: clamp(1.5rem, 3vw, 2.5rem);
	        position: relative;
	}

	/* Individual Milestone Item */
	.reveal .smartart__roadmap-item {
	        display: flex;
	        flex-direction: column;
	        align-items: center;
	        position: relative;
	}

	/* Alternate positioning for desktop */
	.reveal .smartart__roadmap-item--odd .smartart__roadmap-card {
	        margin-bottom: clamp(3rem, 5vh, 4rem);
	}

	.reveal .smartart__roadmap-item--even .smartart__roadmap-card {
	        margin-top: clamp(3rem, 5vh, 4rem);
	}

	/* Timeline Dot */
	.reveal .smartart__roadmap-dot {
	        width: 20px;
	        height: 20px;
	        border-radius: 50%;
	        border: 3px solid transparent;
	        background: transparent;
	        box-shadow: 0 0 0 4px var(--r-background-color, #ffffff);
	        position: absolute;
	        z-index: 2;
	        transition: all 0.3s ease;
	}

	.reveal .smartart__roadmap-item--odd .smartart__roadmap-dot {
	        bottom: calc(50% - 10px + clamp(1.5rem, 2.5vh, 2rem));
	}

	.reveal .smartart__roadmap-item--even .smartart__roadmap-dot {
	        top: calc(50% - 10px + clamp(1.5rem, 2.5vh, 2rem));
	}

	/* Dot Status States */
	.reveal .smartart__roadmap-dot--completed {
	        background: #137fec;
	        border-color: #137fec;
	}

	.reveal .smartart__roadmap-dot--progress {
	        background: #f59e0b;
	        border-color: #f59e0b;
	}

	.reveal .smartart__roadmap-dot--planned {
	        background: transparent;
	        border-color: #94a3b8;
	}

	/* Milestone Card */
	.reveal .smartart__roadmap-card {
	        background: color-mix(in srgb, var(--r-background-color, #ffffff) 60%, transparent);
	        border: 1px solid rgba(148, 163, 184, 0.25);
	        border-radius: clamp(0.5rem, 0.8vw, 0.75rem);
	        padding: clamp(0.75rem, 1.5vh, 1rem);
	        box-shadow: 0 10px 25px -15px rgba(15, 23, 42, 0.3);
	        transition: all 0.3s ease;
	        position: relative;
	        max-width: 280px;
	        width: 100%;
	}

	.reveal .smartart__roadmap-card:hover {
	        transform: translateY(-4px);
	        box-shadow: 0 15px 35px -12px rgba(15, 23, 42, 0.4);
	}

	/* Status Badge */
	.reveal .smartart__roadmap-badge {
	        display: inline-block;
	        padding: 0.25rem 0.5rem;
	        border-radius: 0.375rem;
	        font-size: 0.65rem;
	        font-weight: 600;
	        text-transform: uppercase;
	        letter-spacing: 0.025em;
	        margin-bottom: clamp(0.5rem, 1vh, 0.75rem);
	}

	.reveal .smartart__roadmap-badge--completed {
	        background: rgba(19, 127, 236, 0.15);
	        color: #137fec;
	}

	.reveal .smartart__roadmap-badge--progress {
	        background: rgba(245, 158, 11, 0.15);
	        color: #f59e0b;
	}

	.reveal .smartart__roadmap-badge--planned {
	        background: rgba(148, 163, 184, 0.15);
	        color: #64748b;
	}

	/* Roadmap Icon */
	.reveal .smartart__roadmap-icon {
	        width: clamp(2rem, 3vw, 2.5rem);
	        height: clamp(2rem, 3vw, 2.5rem);
	        margin-bottom: clamp(0.5rem, 1vh, 0.75rem);
	        display: flex;
	        align-items: center;
	        justify-content: center;
	}

	.reveal .smartart__roadmap-icon img,
	.reveal .smartart__roadmap-icon svg {
	        width: 100%;
	        height: 100%;
	}

	.reveal .smartart__roadmap-item--completed .smartart__roadmap-icon {
	        color: #137fec;
	}

	.reveal .smartart__roadmap-item--progress .smartart__roadmap-icon {
	        color: #f59e0b;
	}

	.reveal .smartart__roadmap-item--planned .smartart__roadmap-icon {
	        color: #94a3b8;
	}

	/* Roadmap Title */
	.reveal .smartart__roadmap-title {
	        font-size: clamp(0.9rem, 1.2vw, 1.1rem);
	        font-weight: 700;
	        margin: 0 0 clamp(0.3rem, 0.6vh, 0.5rem);
	        color: inherit;
	        line-height: 1.3;
	}

	/* Roadmap Description */
	.reveal .smartart__roadmap-description {
	        font-size: clamp(0.75rem, 0.9vw, 0.85rem);
	        line-height: 1.5;
	        color: color-mix(in srgb, currentColor 70%, transparent);
	        margin: 0;
	}

	/* Pointer Arrow from Card to Dot - Desktop Only */
	.reveal .smartart__roadmap-arrow {
	        display: none;
	}

	/* Dark Theme Support for Roadmap */
	.reveal .has-dark-background .smartart__roadmap-timeline {
	        background: rgba(148, 163, 184, 0.2);
	}

	.reveal .has-dark-background .smartart__roadmap-dot {
	        box-shadow: 0 0 0 4px #0f172a;
	}

	.reveal .has-dark-background .smartart__roadmap-card {
	        background: rgba(15, 23, 42, 0.6);
	        border-color: rgba(148, 163, 184, 0.2);
	        box-shadow: 0 10px 25px -15px rgba(0, 0, 0, 0.5);
	}

	.reveal .has-dark-background .smartart__roadmap-card:hover {
	        box-shadow: 0 15px 35px -12px rgba(0, 0, 0, 0.6);
	}

	.reveal .has-dark-background .smartart__roadmap-description {
	        color: rgba(226, 232, 240, 0.7);
	}

	/* Mobile Layout - Vertical Timeline */
	@media screen and (max-width: 768px) {
	        .reveal .smartart__roadmap {
	                padding-left: 2.5rem;
	                gap: 1.5rem;
	        }

	        .reveal .smartart__roadmap-timeline {
	                position: absolute;
	                left: 12px;
	                top: 0;
	                bottom: 0;
	                width: 2px;
	                height: 100%;
	                margin: 0;
	        }

	        .reveal .smartart__roadmap-progress {
	                width: 100% !important;
	                height: var(--roadmap-progress-height, 0%);
	        }

	        .reveal .smartart__roadmap-items {
	                display: flex;
	                flex-direction: column;
	                gap: 1.5rem;
	        }

	        .reveal .smartart__roadmap-item {
	                flex-direction: row;
	                align-items: flex-start;
	                position: relative;
	        }

	        .reveal .smartart__roadmap-item--odd .smartart__roadmap-card,
	        .reveal .smartart__roadmap-item--even .smartart__roadmap-card {
	                margin: 0;
	        }

	        .reveal .smartart__roadmap-dot {
	                position: absolute;
	                left: -2.5rem;
	                top: 0.5rem;
	                width: 24px;
	                height: 24px;
	        }

	        .reveal .smartart__roadmap-item--odd .smartart__roadmap-dot,
	        .reveal .smartart__roadmap-item--even .smartart__roadmap-dot {
	                position: absolute;
	                left: -2.5rem;
	                top: 0.5rem;
	                bottom: auto;
	        }

	        .reveal .smartart__roadmap-card {
	                max-width: 100%;
	        }

	        .reveal .smartart__roadmap-arrow {
	                display: none;
	        }
	}

	/* ================================================
	   STATS/DASHBOARD LAYOUT - METRIC CARDS
	   ================================================ */

	/* Stats Container */
	.reveal .smartart[data-layout="stats"] {
	        padding: clamp(0.75rem, 1.5vh, 1rem) clamp(1rem, 2.5vw, 2rem);
	        max-height: 75vh;
	        display: flex;
	        flex-direction: column;
	        overflow: hidden;
	}

	/* Stats Grid - Responsive 3 Column */
	.reveal .smartart__stats-grid {
	        display: grid;
	        grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
	        gap: clamp(1rem, 2vw, 1.5rem);
	        flex: 1 1 auto;
	        overflow: hidden;
	        align-content: start;
	        align-items: stretch;
	}

	/* Individual Stat Card */
	.reveal .smartart__stat-card {
	        display: flex;
	        flex-direction: column;
	        background: color-mix(in srgb, var(--r-background-color, #ffffff) 80%, transparent);
	        border: 1px solid rgba(148, 163, 184, 0.25);
	        border-radius: clamp(0.75rem, 1vw, 1rem);
	        padding: clamp(1.25rem, 2vh, 1.75rem) clamp(1.25rem, 2vw, 1.5rem);
	        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
	        transition: all 0.3s ease;
	        position: relative;
	        overflow: hidden;
	        box-sizing: border-box;
	}

	.reveal .smartart__stat-card:hover {
	        transform: translateY(-4px);
	        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
	        border-color: rgba(148, 163, 184, 0.35);
	}

	/* Stat Card Header - Label and Icon */
	.reveal .smartart__stat-header {
	        display: flex;
	        justify-content: space-between;
	        align-items: flex-start;
	        margin-bottom: clamp(0.75rem, 1.2vh, 1rem);
	        gap: 0.75rem;
	}

	/* Stat Label */
	.reveal .smartart__stat-label {
	        font-size: clamp(0.85rem, 1vw, 0.95rem);
	        font-weight: 600;
	        color: color-mix(in srgb, currentColor 70%, transparent);
	        line-height: 1.3;
	        margin: 0;
	        flex: 1 1 auto;
	}

	/* Stat Icon Container - Top Right */
	.reveal .smartart__stat-icon {
	        width: clamp(2.5rem, 4vw, 3rem);
	        height: clamp(2.5rem, 4vw, 3rem);
	        border-radius: clamp(0.6rem, 0.9vw, 0.75rem);
	        display: inline-flex;
	        align-items: center;
	        justify-content: center;
	        flex-shrink: 0;
	        transition: transform 0.2s ease;
	}

	.reveal .smartart__stat-card:hover .smartart__stat-icon {
	        transform: scale(1.05);
	}

	.reveal .smartart__stat-icon img,
	.reveal .smartart__stat-icon svg {
	        width: 55%;
	        height: 55%;
	        max-width: 1.5rem;
	        max-height: 1.5rem;
	        filter: brightness(0) saturate(100%) invert(100%);
	}

	/* Icon Color Variants */
	.reveal .smartart__stat-icon--blue {
	        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
	}

	.reveal .smartart__stat-icon--green {
	        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
	}

	.reveal .smartart__stat-icon--purple {
	        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
	}

	.reveal .smartart__stat-icon--orange {
	        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
	}

	.reveal .smartart__stat-icon--red {
	        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
	}

	.reveal .smartart__stat-icon--teal {
	        background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
	}

	/* Stat Value - Large Number */
	.reveal .smartart__stat-value {
	        font-size: clamp(2rem, 4vw, 2.75rem);
	        font-weight: 800;
	        color: inherit;
	        line-height: 1.1;
	        margin: clamp(0.5rem, 1vh, 0.75rem) 0;
	}

	/* Stat Description/Trend */
	.reveal .smartart__stat-description {
	        display: flex;
	        align-items: center;
	        gap: 0.4rem;
	        font-size: clamp(0.8rem, 0.9vw, 0.9rem);
	        line-height: 1.4;
	        color: color-mix(in srgb, currentColor 65%, transparent);
	        margin-top: auto;
	}

	/* Trend Indicator */
	.reveal .smartart__stat-trend {
	        display: inline-flex;
	        align-items: center;
	        gap: 0.25rem;
	        font-weight: 600;
	        padding: 0.15rem 0.4rem;
	        border-radius: 0.35rem;
	        font-size: clamp(0.75rem, 0.85vw, 0.85rem);
	}

	.reveal .smartart__stat-trend--up {
	        color: #059669;
	        background: rgba(16, 185, 129, 0.1);
	}

	.reveal .smartart__stat-trend--down {
	        color: #dc2626;
	        background: rgba(239, 68, 68, 0.1);
	}

	.reveal .smartart__stat-trend--neutral {
	        color: color-mix(in srgb, currentColor 60%, transparent);
	        background: rgba(148, 163, 184, 0.1);
	}

	/* Trend Arrow */
	.reveal .smartart__stat-trend-arrow {
	        font-size: 1em;
	        line-height: 1;
	}

	/* Dark Theme Support for Stats */
	.reveal .has-dark-background .smartart__stat-card {
	        background: rgba(15, 23, 42, 0.5);
	        border-color: rgba(148, 163, 184, 0.2);
	        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
	}

	.reveal .has-dark-background .smartart__stat-card:hover {
	        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
	        border-color: rgba(148, 163, 184, 0.3);
	}

	.reveal .has-dark-background .smartart__stat-label {
	        color: rgba(226, 232, 240, 0.75);
	}

	.reveal .has-dark-background .smartart__stat-description {
	        color: rgba(226, 232, 240, 0.65);
	}

	.reveal .has-dark-background .smartart__stat-trend--up {
	        color: #34d399;
	        background: rgba(16, 185, 129, 0.15);
	}

	.reveal .has-dark-background .smartart__stat-trend--down {
	        color: #f87171;
	        background: rgba(239, 68, 68, 0.15);
	}

	.reveal .has-dark-background .smartart__stat-trend--neutral {
	        color: rgba(226, 232, 240, 0.6);
	        background: rgba(148, 163, 184, 0.15);
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
	                padding: 1.25rem 1rem;
	        }
	}

	/* Small Tablets and Large Phones */
	@media screen and (max-width: 768px) {
	        .reveal .smartart {
	                padding: 1rem clamp(0.75rem, 3vw, 1.5rem);
	        }
	        .reveal .smartart[data-layout="horizontal"] .smartart__card {
	                flex: 1 1 100%;
	                max-width: 100%;
	        }
	        .reveal .smartart[data-layout="grid"] .smartart__grid,
	        .reveal .smartart[data-layout="vertical"] .smartart__grid,
	        .reveal .smartart:not([data-layout]) .smartart__grid {
	                grid-template-columns: 1fr;
	                gap: 1rem;
	        }
	        .reveal .smartart__heading {
	                font-size: 1.75rem;
	        }
	        .reveal .smartart__intro {
	                font-size: 0.95rem;
	        }
	        .reveal .smartart__card {
	                min-height: auto;
	        }
	        .reveal .smartart[data-layout="lined"] .smartart__list-item {
	                flex-direction: row;
	                gap: 0.9rem;
	        }
	        .reveal .smartart__list-meta {
	                margin-left: 0.75rem;
	        }

	        /* Hero - Stack Vertically on Mobile */
	        .reveal .smartart__hero-grid {
	                grid-template-columns: 1fr;
	                gap: 1.5rem;
	        }
	        .reveal .smartart__hero-image {
	                order: -1; /* Image on top */
	        }
	        .reveal .smartart__hero-heading {
	                font-size: 1.75rem;
	        }
	        .reveal .smartart__hero-intro {
	                font-size: 1rem;
	        }
	        .reveal .smartart__hero-actions {
	                flex-direction: column;
	                align-items: stretch;
	        }
	        .reveal .smartart__hero-cta {
	                width: 100%;
	                justify-content: center;
	        }

	        /* Pricing - Stack to Single Column on Mobile */
	        .reveal .smartart__pricing-grid {
	                grid-template-columns: 1fr;
	        }
	        .reveal .smartart__pricing-badge {
	                font-size: 0.65rem;
	                width: 90px;
	                right: -22px;
	        }

	        /* Stats - Stack to Single Column on Mobile */
	        .reveal .smartart__stats-grid {
	                grid-template-columns: 1fr;
	        }
	}

	/* Mobile Phones - Single Column, Compact */
	@media screen and (max-width: 480px) {
	        .reveal .smartart {
	                padding: 0.75rem 1rem;
	        }
	        .reveal .smartart__heading {
	                font-size: 1.5rem;
	                margin-bottom: 0.5rem;
	        }
	        .reveal .smartart__intro {
	                font-size: 0.9rem;
	                margin-bottom: 1.25rem;
	        }
	        .reveal .smartart__card {
	                padding: 1rem 0.9rem;
	        }
	        .reveal .smartart__icon {
	                width: 2.5rem;
	                height: 2.5rem;
	                margin-bottom: 0.75rem;
	        }
	        .reveal .smartart__title {
	                font-size: 1.05rem;
	        }
	        .reveal .smartart__description {
	                font-size: 0.85rem;
	                margin-bottom: 0.9rem;
	        }
	        .reveal .smartart__cta {
	                padding: 0.5rem 0.9rem;
	                font-size: 0.85rem;
	        }
	        .reveal .smartart[data-layout="lined"] .smartart__list-item {
	                padding: 0.9rem 1rem;
	                gap: 0.75rem;
	        }
	        .reveal .smartart__list-icon {
	                width: 2.25rem;
	                height: 2.25rem;
	        }
	        .reveal .smartart__list-title {
	                font-size: 0.95rem;
	        }
	        .reveal .smartart__list-description {
	                font-size: 0.8rem;
	        }
	        .reveal .smartart__list-meta {
	                font-size: 0.8rem;
	                margin-left: 0.5rem;
	        }

	        /* Hero - Compact Mobile */
	        .reveal .smartart__hero-heading {
	                font-size: 1.5rem;
	        }
	        .reveal .smartart__hero-intro {
	                font-size: 0.9rem;
	        }
	        .reveal .smartart__hero-cta {
	                padding: 0.65rem 1.25rem;
	                font-size: 0.85rem;
	        }
	        .reveal .smartart__hero-image img {
	                max-height: 50vh;
	        }
	}

	/* Height-Based Media Queries - Prevent Vertical Overflow */
	@media screen and (max-height: 768px) {
	        .reveal .smartart {
	                padding: 0.75rem clamp(0.75rem, 2vw, 1.5rem);
	        }
	        .reveal .smartart__heading {
	                font-size: clamp(1.4rem, 2vw, 2rem);
	                margin-bottom: 0.5rem;
	        }
	        .reveal .smartart__intro {
	                margin-bottom: 1.25rem;
	                font-size: 0.95rem;
	        }
	        .reveal .smartart__card {
	                padding: 1rem 1.25rem;
	        }
	        .reveal .smartart__icon {
	                width: 2.5rem;
	                height: 2.5rem;
	                margin-bottom: 0.8rem;
	        }
	        .reveal .smartart__title {
	                font-size: 1.1rem;
	                margin-bottom: 0.4rem;
	        }
	        .reveal .smartart__description {
	                font-size: 0.9rem;
	                margin-bottom: 0.9rem;
	        }
	        .reveal .smartart[data-layout="lined"] .smartart__list-item {
	                padding: 0.9rem 1.25rem;
	        }
	}

	@media screen and (max-height: 600px) {
	        .reveal .smartart {
	                padding: 0.5rem 1rem;
	        }
	        .reveal .smartart__heading {
	                font-size: 1.4rem;
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
	                line-height: 1.45;
	        }
	        .reveal .smartart__cta {
	                padding: 0.45rem 0.85rem;
	                font-size: 0.8rem;
	        }
	        .reveal .smartart[data-layout="lined"] .smartart__list-item {
	                padding: 0.75rem 1rem;
	                gap: 0.75rem;
	        }
	        .reveal .smartart__list-icon {
	                width: 2rem;
	                height: 2rem;
	        }
	        .reveal .smartart__list-title {
	                font-size: 0.9rem;
	        }
	        .reveal .smartart__list-description {
	                font-size: 0.8rem;
	                margin-top: 0.25rem;
	        }
	}

	/* Height-Based Media Queries - Pricing Layout Specific */
	@media screen and (max-height: 800px) {
	        .reveal .smartart[data-layout="pricing"] {
	                max-height: 70vh;
	        }
	        .reveal .smartart__pricing-grid {
	                max-height: 60vh;
	        }
	        .reveal .smartart__pricing-card {
	                padding: 0.75rem;
	        }
	        .reveal .smartart__pricing-price {
	                font-size: 2rem;
	        }
	        .reveal .smartart__pricing-features {
	                max-height: 22vh;
	        }
	}

	@media screen and (max-height: 700px) {
	        .reveal .smartart[data-layout="pricing"] {
	                max-height: 65vh;
	        }
	        .reveal .smartart__pricing-grid {
	                max-height: 55vh;
	        }
	        .reveal .smartart__pricing-card {
	                padding: 0.65rem;
	        }
	        .reveal .smartart__pricing-title {
	                font-size: 1rem;
	        }
	        .reveal .smartart__pricing-price {
	                font-size: 1.8rem;
	        }
	        .reveal .smartart__pricing-description {
	                font-size: 0.7rem;
	                max-height: 2.5em;
	        }
	        .reveal .smartart__pricing-cta {
	                padding: 0.45rem 0.65rem;
	                font-size: 0.7rem;
	                margin: 0.4rem 0;
	        }
	        .reveal .smartart__pricing-features {
	                max-height: 20vh;
	                gap: 0.35rem;
	        }
	        .reveal .smartart__pricing-feature {
	                font-size: 0.65rem;
	                line-height: 1.2;
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
	        let image = '';
	        let link = '';
	        let global = false;
	        let background = '';
	        let color = '';
	        let height = '';
	        let align = '';
	        let subtitle = '';
	        let cta = '';
			let cta2 = '';
			let multiple = '';
	        // Carousel options
	        let interval = '';
	        let autoplay = '';
	        let loop = '';
	        let indicators = '';
	        let controls = '';
			let variant = '';
			let cards = '';
			// Drawer options
			let position = '';
			let size = '';
			let backdrop = '';
			let keyboard = '';
			let autostart = '';
			let toggle = '';
	        const itemSegments = [];
	
	        if( firstItemCandidate ) {
	                const sanitizedFirst = firstItemCandidate.replace( /^[-*+]\s+/, '' );
	                const introMatch = sanitizedFirst.match( /^(?:intro|summary|description)\s*:\s*(.+)$/i );
	                const imageMatch = sanitizedFirst.match( /^image\s*:\s*(.+)$/i );
	                const logoMatch = sanitizedFirst.match( /^logo\s*:\s*(.+)$/i );
	                const backgroundMatch = sanitizedFirst.match( /^background\s*:\s*(.+)$/i );
	                const subtitleMatch = sanitizedFirst.match( /^subtitle\s*:\s*(.+)$/i );
	                const colorMatch = sanitizedFirst.match( /^color\s*:\s*(.+)$/i );
			        const heightMatch = sanitizedFirst.match( /^height\s*:\s*(.+)$/i );
	                const alignMatch = sanitizedFirst.match( /^align\s*:\s*(left|center|right)\s*$/i );
	                const ctaMatch = sanitizedFirst.match( /^cta\s*:\s*(.+)$/i );
	                const cta2Match = sanitizedFirst.match( /^cta2\s*:\s*(.+)$/i );
	                const linkMatch = sanitizedFirst.match( /^(?:link|href|url)\s*:\s*(.+)$/i );
	                const globalMatch = sanitizedFirst.match( /^global\s*:\s*(true|false)\s*$/i );
	                const multipleMatch = sanitizedFirst.match( /^multiple\s*:\s*(true|false)\s*$/i );
	                const intervalMatch = sanitizedFirst.match( /^interval\s*:\s*(\d+)(ms|s)?\s*$/i );
	                const autoplayMatch = sanitizedFirst.match( /^autoplay\s*:\s*(true|false)\s*$/i );
	                const loopMatch = sanitizedFirst.match( /^loop\s*:\s*(true|false)\s*$/i );
	                const indicatorsMatch = sanitizedFirst.match( /^indicators\s*:\s*(true|false)\s*$/i );
			        const controlsMatch = sanitizedFirst.match( /^controls\s*:\s*(true|false)\s*$/i );
			        const variantMatch = sanitizedFirst.match( /^(?:variant|mode)\s*:\s*(\w+)\s*$/i );
			        const cardsMatch = sanitizedFirst.match( /^cards\s*:\s*(true|false)\s*$/i );
			        const positionMatch = sanitizedFirst.match( /^position\s*:\s*(start|end|left|right|top|bottom)\s*$/i );
			        const sizeMatch = sanitizedFirst.match( /^size\s*:\s*(.+)$/i );
			        const backdropMatch = sanitizedFirst.match( /^backdrop\s*:\s*(true|false)\s*$/i );
			        const keyboardMatch = sanitizedFirst.match( /^keyboard\s*:\s*(true|false)\s*$/i );
			        const autostartMatch = sanitizedFirst.match( /^autostart\s*:\s*(true|false)\s*$/i );
			        const toggleMatch = sanitizedFirst.match( /^toggle\s*:\s*(.+)$/i );

	                if( introMatch ) {
	                        intro = introMatch[ 1 ].trim();
	                }
	                else if( imageMatch ) {
	                        image = imageMatch[ 1 ].trim();
	                }
	                else if( logoMatch ) {
	                        image = logoMatch[ 1 ].trim();
	                }
	                else if( backgroundMatch ) {
	                        background = backgroundMatch[ 1 ].trim();
	                }
	                else if( subtitleMatch ) {
	                        subtitle = subtitleMatch[ 1 ].trim();
	                }
	                else if( colorMatch ) {
	                        color = colorMatch[ 1 ].trim();
	                }
	                else if( heightMatch ) {
	                        height = heightMatch[ 1 ].trim();
	                }
	                else if( alignMatch ) {
	                        align = alignMatch[ 1 ].toLowerCase();
	                }
	                else if( ctaMatch ) {
	                        cta = ctaMatch[ 1 ].trim();
	                }
	                else if( cta2Match ) {
	                        cta2 = cta2Match[ 1 ].trim();
	                }
	                else if( linkMatch ) {
	                        link = linkMatch[ 1 ].trim();
	                }
	                else if( globalMatch ) {
	                        global = globalMatch[1].toLowerCase() === 'true';
	                }
	                else if( multipleMatch ) {
	                        multiple = multipleMatch[ 1 ].toLowerCase() === 'true';
	                }
	                else if( intervalMatch ) {
	                        const num = parseInt(intervalMatch[1],10);
	                        const unit = (intervalMatch[2]||'ms').toLowerCase();
	                        interval = unit === 's' ? num*1000 : num;
	                }
	                else if( autoplayMatch ) {
	                        autoplay = autoplayMatch[1].toLowerCase() === 'true';
	                }
	                else if( loopMatch ) {
	                        loop = loopMatch[1].toLowerCase() === 'true';
	                }
	                else if( indicatorsMatch ) {
	                        indicators = indicatorsMatch[1].toLowerCase() === 'true';
	                }
			        else if( controlsMatch ) {
	                        controls = controlsMatch[1].toLowerCase() === 'true';
	                }
			        else if( variantMatch ) {
			                variant = variantMatch[1].toLowerCase();
			        }
			        else if( cardsMatch ) {
			                cards = cardsMatch[1].toLowerCase() === 'true';
			        }
			        else if( positionMatch ) { position = positionMatch[1].toLowerCase(); }
			        else if( sizeMatch ) { size = sizeMatch[1].trim(); }
			        else if( backdropMatch ) { backdrop = backdropMatch[1].toLowerCase()==='true'; }
			        else if( keyboardMatch ) { keyboard = keyboardMatch[1].toLowerCase()==='true'; }
			        else if( autostartMatch ) { autostart = autostartMatch[1].toLowerCase()==='true'; }
			        else if( toggleMatch ) { toggle = toggleMatch[1].trim(); }
	                else {
	                        itemSegments.push( sanitizedFirst );
	                }
	        }
	
	        detailLines.forEach( line => {
	                const sanitized = line.replace( /^[-*+]\s+/, '' );
	                const introMatch = sanitized.match( /^(?:intro|summary|description)\s*:\s*(.+)$/i );
	                const imageMatch = sanitized.match( /^image\s*:\s*(.+)$/i );
	                const logoMatch = sanitized.match( /^logo\s*:\s*(.+)$/i );
	                const backgroundMatch = sanitized.match( /^background\s*:\s*(.+)$/i );
	                const subtitleMatch = sanitized.match( /^subtitle\s*:\s*(.+)$/i );
	                const colorMatch = sanitized.match( /^color\s*:\s*(.+)$/i );
	                const heightMatch = sanitized.match( /^height\s*:\s*(.+)$/i );
	                const alignMatch = sanitized.match( /^align\s*:\s*(left|center|right)\s*$/i );
	                const ctaMatch = sanitized.match( /^cta\s*:\s*(.+)$/i );
	                const cta2Match = sanitized.match( /^cta2\s*:\s*(.+)$/i );
	                const linkMatch = sanitized.match( /^(?:link|href|url)\s*:\s*(.+)$/i );
	                const globalMatch = sanitized.match( /^global\s*:\s*(true|false)\s*$/i );
	                const multipleMatch = sanitized.match( /^multiple\s*:\s*(true|false)\s*$/i );
	                const intervalMatch = sanitized.match( /^interval\s*:\s*(\d+)(ms|s)?\s*$/i );
	                const autoplayMatch = sanitized.match( /^autoplay\s*:\s*(true|false)\s*$/i );
	                const loopMatch = sanitized.match( /^loop\s*:\s*(true|false)\s*$/i );
	                const indicatorsMatch = sanitized.match( /^indicators\s*:\s*(true|false)\s*$/i );
			        const controlsMatch = sanitized.match( /^controls\s*:\s*(true|false)\s*$/i );
			        const variantMatch = sanitized.match( /^(?:variant|mode)\s*:\s*(\w+)\s*$/i );
			        const cardsMatch = sanitized.match( /^cards\s*:\s*(true|false)\s*$/i );
			        const positionMatch = sanitized.match( /^position\s*:\s*(start|end|left|right|top|bottom)\s*$/i );
			        const sizeMatch = sanitized.match( /^size\s*:\s*(.+)$/i );
			        const backdropMatch = sanitized.match( /^backdrop\s*:\s*(true|false)\s*$/i );
			        const keyboardMatch = sanitized.match( /^keyboard\s*:\s*(true|false)\s*$/i );
			        const autostartMatch = sanitized.match( /^autostart\s*:\s*(true|false)\s*$/i );
			        const toggleMatch = sanitized.match( /^toggle\s*:\s*(.+)$/i );

	                if( introMatch ) {
	                        intro = introMatch[ 1 ].trim();
	                        return;
	                }
	                if( imageMatch ) {
	                        image = imageMatch[ 1 ].trim();
	                        return;
	                }
	                if( logoMatch ) {
	                        image = logoMatch[ 1 ].trim();
	                        return;
	                }
	                if( backgroundMatch ) {
	                        background = backgroundMatch[ 1 ].trim();
	                        return;
	                }
	                if( subtitleMatch ) {
	                        subtitle = subtitleMatch[ 1 ].trim();
	                        return;
	                }
	                if( colorMatch ) {
	                        color = colorMatch[ 1 ].trim();
	                        return;
	                }
	                if( heightMatch ) {
	                        height = heightMatch[ 1 ].trim();
	                        return;
	                }
	                if( alignMatch ) {
	                        align = alignMatch[ 1 ].toLowerCase();
	                        return;
	                }
	                if( ctaMatch ) {
	                        cta = ctaMatch[ 1 ].trim();
	                        return;
	                }
	                if( cta2Match ) {
	                        cta2 = cta2Match[ 1 ].trim();
	                        return;
	                }
	                if( linkMatch ) { link = linkMatch[1].trim(); return; }
	                if( globalMatch ) { global = globalMatch[1].toLowerCase()==='true'; return; }
	                if( multipleMatch ) {
	                        multiple = multipleMatch[ 1 ].toLowerCase() === 'true';
	                        return;
	                }
	                if( intervalMatch ) { interval = (intervalMatch[2]||'ms').toLowerCase()==='s' ? parseInt(intervalMatch[1],10)*1000 : parseInt(intervalMatch[1],10); return; }
	                if( autoplayMatch ) { autoplay = autoplayMatch[1].toLowerCase()==='true'; return; }
	                if( loopMatch ) { loop = loopMatch[1].toLowerCase()==='true'; return; }
	                if( indicatorsMatch ) { indicators = indicatorsMatch[1].toLowerCase()==='true'; return; }
			        if( controlsMatch ) { controls = controlsMatch[1].toLowerCase()==='true'; return; }
			        if( variantMatch ) { variant = variantMatch[1].toLowerCase(); return; }
			        if( cardsMatch ) { cards = cardsMatch[1].toLowerCase()==='true'; return; }
			        if( positionMatch ) { position = positionMatch[1].toLowerCase(); return; }
			        if( sizeMatch ) { size = sizeMatch[1].trim(); return; }
			        if( backdropMatch ) { backdrop = backdropMatch[1].toLowerCase()==='true'; return; }
			        if( keyboardMatch ) { keyboard = keyboardMatch[1].toLowerCase()==='true'; return; }
			        if( autostartMatch ) { autostart = autostartMatch[1].toLowerCase()==='true'; return; }
			        if( toggleMatch ) { toggle = toggleMatch[1].trim(); return; }

	                itemSegments.push( sanitized );
	        } );

	
			const rawItems = itemSegments
	                .flatMap( segment => splitSegment( segment, layout ) )
	                .map( segment => segment.trim() )
	                .filter( Boolean );

			const items = rawItems.map( ( raw, index ) => parseItem( raw, index, layout, { variant, cards } ) ).filter( Boolean );

	        // Allow some layouts to have zero items
	        const layoutsAllowingNoItems = new Set(['hero', 'navbar', 'footer']);
	        if( !layoutsAllowingNoItems.has( layout ) && items.length === 0 ) {
	                return null;
	        }

	        // Process unsplash: prefix for images
	        if( image && /^unsplash:/i.test( image ) ) {
	                const keyword = image.replace( /^unsplash:/i, '' ).trim();
	                image = `https://source.unsplash.com/800x600/?${encodeURIComponent( keyword )}`;
	        }

			return {
	                heading,
	                intro,
	                orientation,
	                layout,
	                items,
	                image,
	                link,
	                background,
	                color,
	                height,
	                align,
	                subtitle,
	                cta,
	                cta2,
	                global,
	                multiple,
	                interval,
	                autoplay,
	                loop,
	                indicators,
			        controls,
			        variant,
			        cards,
			        position,
			        size,
			        backdrop,
			        keyboard,
			        autostart,
			        toggle
	        };
	}

	function splitSegment( segment, layout ) {
	        const cleaned = segment.trim();
	        if( !cleaned ) return [];

	        if( layout === 'checklist' ) {
	                // For checklist, each item is a single line (no splitting)
	                return [ cleaned ];
	        }

	        if( layout === 'roadmap' ) {
	                // For roadmap, each item is a single line (no splitting)
	                return [ cleaned ];
	        }

		if( layout === 'carousel' ) {
			// Each carousel item is a line
			return [ cleaned ];
		}

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

	function parseItem( raw, index, layout, ctx ) {
	        ctx = ctx || {};
	        const item = {
	                title: '',
	                description: '',
	                icon: '',
	                ctaLabel: '',
			ctaUrl: '',
	                checked: false,
	                status: '',
	                featured: false,
	                price: '',
	                features: [],
	                value: '',
	                iconColor: '',
	                open: false,
			id: '',
			image: '',
			alt: ''
	        };
		// Carousel items
		if( layout === 'carousel' ) {
			const variant = (ctx.variant||'').toLowerCase();
			const isCards = ctx.cards === true || variant === 'cards';

			if( isCards ) {
				// Text card format: Title | Description | [CTA Label] | [URL] | [icon=...] | [image=...]
				const segments = raw.split(/\|/).map(s=>s.trim()).filter(Boolean);
				segments.forEach(seg => {
					const kv = seg.match(/^(\w+)\s*=\s*(.+)$/);
					if( kv ) {
						const key = kv[1].toLowerCase();
						const val = kv[2].trim();
						if( key === 'icon' ) item.icon = val;
						else if( key === 'image' || key === 'src' ) item.image = val;
						else if( key === 'title' ) item.title = val;
						else if( key === 'text' || key === 'description' ) item.description = val;
						else if( key === 'cta' ) item.ctaLabel = val;
						else if( key === 'link' || key === 'url' || key === 'href' ) item.ctaUrl = val;
						else if( key === 'alt' ) item.alt = val;
					} else {
						if( !item.title ) item.title = seg;
						else if( !item.description ) item.description = seg;
						else if( !item.ctaLabel ) item.ctaLabel = seg;
						else if( !item.ctaUrl ) item.ctaUrl = seg;
					}
				});
				if( !item.alt ) item.alt = item.title || `Slide ${index+1}`;
				return item.title || item.description ? item : null;
			}

			// Image slide format: image | caption | subcaption OR key=value pairs
			const segments = raw.split(/\|/).map(s=>s.trim()).filter(Boolean);

			if( segments.length === 1 ) {
				// Could be a bare URL or key=value
				const kv = segments[0].match(/^(\w+)\s*=\s*(.+)$/);
				if( kv ) {
					const key = kv[1].toLowerCase();
					const val = kv[2].trim();
					if( key === 'image' || key === 'src' || key === 'url' ) item.image = val;
					else if( key === 'alt' ) item.alt = val;
					else if( key === 'title' ) item.title = val;
					else if( key === 'caption' ) item.title = val;
					else if( key === 'text' || key === 'description' ) item.description = val;
					else if( key === 'link' || key === 'href' ) item.ctaUrl = val;
				} else {
					// Assume it's an image URL
					item.image = segments[0];
				}
			} else {
				// First non-kv treated as image if it looks like URL
				segments.forEach(seg => {
					const kv = seg.match(/^(\w+)\s*=\s*(.+)$/);
					if( kv ) {
						const key = kv[1].toLowerCase();
						const val = kv[2].trim();
						if( key === 'image' || key === 'src' || key === 'url' ) item.image = val;
						else if( key === 'alt' ) item.alt = val;
						else if( key === 'link' || key === 'href' ) item.ctaUrl = val;
						else if( key === 'title' || key === 'caption' ) item.title = val;
						else if( key === 'text' || key === 'description' ) item.description = val;
					} else {
						if( !item.image && /^(https?:|data:|\.\/|\/.+|[^\s]+\.(jpg|jpeg|png|gif|webp|svg))/.test(seg) ) item.image = seg;
						else if( !item.title ) item.title = seg;
						else if( !item.description ) item.description = seg;
					}
				});
			}
			if( !item.alt ) item.alt = item.title || `Slide ${index+1}`;
			return item.image ? item : null;
		}
	        // Handle drawer items: Title | Description | [CTA] | [URL]
	        if( layout === 'drawer' || layout === 'modal' ) {
	                const segments = raw.split(/\|/).map(p=>p.trim()).filter(Boolean);
	                if( segments.length >= 1 ) item.title = segments[0];
	                if( segments.length >= 2 ) item.description = segments[1];
	                if( segments.length >= 3 ) item.ctaLabel = segments[2];
	                if( segments.length >= 4 ) item.ctaUrl = segments[3];
	                return (item.title || item.description) ? item : null;
	        }

	        // Handle accordion items: [*] Title | Content (supports id=...)
	        if( layout === 'accordion' ) {
	                // Default-open marker
	                const openMatch = raw.match(/^\[\s*\*\s*\]\s*(.+)$/);
	                if( openMatch ) {
	                        item.open = true;
	                        raw = openMatch[1].trim();
	                }
	                const segments = raw.split(/\|/).map(p=>p.trim()).filter(Boolean);
	                if( segments.length >= 1 ) item.title = segments[0];
	                if( segments.length >= 2 ) item.description = segments.slice(1).join(' | ');

	                // Extract key=value pairs from any trailing segments
	                segments.forEach(seg => {
	                        const m = seg.match(/^(\w+)\s*=\s*(.+)$/);
	                        if( m ) {
	                                const key = m[1].toLowerCase();
	                                const val = m[2].trim();
	                                if( key === 'id' ) item.id = val;
	                                if( key === 'icon' ) item.icon = val;
	                        }
	                });

	                if( !item.id ) item.id = `acc-${Date.now()}-${index}`;
	                return item.title ? item : null;
	        }

	        // Handle checklist items
	        if( layout === 'checklist' ) {
	                // Match checkbox syntax: [x], [X], [ ], or no bracket
	                const checkboxMatch = raw.match( /^\[\s*([xX\s]?)\s*\]\s*(.+)$/ );
	                if( checkboxMatch ) {
	                        item.checked = /[xX]/.test( checkboxMatch[ 1 ] );
	                        item.title = checkboxMatch[ 2 ].trim();
	                } else {
	                        // No checkbox marker, treat as unchecked
	                        item.checked = false;
	                        item.title = raw.trim();
	                }
	                return item.title ? item : null;
	        }

	        // Handle pricing items with featured marker [*] or [!]
	        if( layout === 'pricing' ) {
	                const featuredMatch = raw.match( /^\[\s*([*!])\s*\]\s*(.+)$/ );
	                if( featuredMatch ) {
	                        item.featured = true;
	                        raw = featuredMatch[ 2 ].trim();
	                }

	                // Parse pricing format: Plan Name | Price | Description | CTA Label | Features
	                const segments = raw.split( /\|/ ).map( part => part.trim() ).filter( part => part.length > 0 );

	                if( segments.length >= 2 ) {
	                        item.title = segments[ 0 ];
	                        item.price = segments[ 1 ];
	                        if( segments.length >= 3 ) item.description = segments[ 2 ];
	                        if( segments.length >= 4 ) item.ctaLabel = segments[ 3 ];
	                        if( segments.length >= 5 ) {
	                                // Features are semicolon-separated
	                                item.features = segments[ 4 ].split( /\s*;\s*/ ).map( f => f.trim() ).filter( Boolean );
	                        }
	                }

	                if( item.ctaLabel && !item.ctaUrl ) item.ctaUrl = '#';
	                return item.title && item.price ? item : null;
	        }

	        // Handle stats items: Label | Value | Description | icon=... | color=...
	        if( layout === 'stats' ) {
	                const segments = raw.split( /\|/ ).map( part => part.trim() ).filter( part => part.length > 0 );

	                if( segments.length >= 2 ) {
	                        item.title = segments[ 0 ];
	                        item.value = segments[ 1 ];
	                        if( segments.length >= 3 ) item.description = segments[ 2 ];

	                        // Process any key=value pairs in remaining segments
	                        for( let i = 3; i < segments.length; i++ ) {
	                                const kvMatch = segments[ i ].match( /^(\w+)\s*=\s*(.+)$/ );
	                                if( kvMatch ) {
	                                        const key = kvMatch[ 1 ].toLowerCase();
	                                        const value = kvMatch[ 2 ].trim();
	                                        if( key === 'icon' ) item.icon = value;
	                                        else if( key === 'color' ) item.iconColor = value;
	                                }
	                        }
	                }

	                // If no icon specified, use default
	                if( !item.icon ) item.icon = defaultIcon( index );

	                return item.title && item.value ? item : null;
	        }

	        // Handle roadmap items with status markers
	        if( layout === 'roadmap' ) {
	                // Match status syntax: [x]/[X] (completed), [~]/[>] (in progress), [ ]/[-] (planned)
	                const statusMatch = raw.match( /^\[\s*([xX~>\s-]?)\s*\]\s*(.+)$/ );
	                let remainingText = raw;

	                if( statusMatch ) {
	                        const marker = statusMatch[ 1 ].trim();
	                        remainingText = statusMatch[ 2 ].trim();

	                        if( /[xX]/.test( marker ) ) {
	                                item.status = 'completed';
	                        } else if( /[~>]/.test( marker ) ) {
	                                item.status = 'progress';
	                        } else {
	                                item.status = 'planned';
	                        }
	                } else {
	                        // No status marker, treat as planned
	                        item.status = 'planned';
	                }

	                // Parse the remaining text with pipe separators
	                const parts = remainingText.split( /\|/ ).map( part => part.trim() ).filter( Boolean );

	                parts.forEach( ( part, idx ) => {
	                        const kvMatch = part.match( /^(\w+)\s*=\s*(.+)$/ );
	                        if( kvMatch ) {
	                                assignKeyValue( item, kvMatch[ 1 ], kvMatch[ 2 ] );
	                        } else {
	                                if( idx === 0 && !item.title ) item.title = part;
	                                else if( idx === 1 && !item.description ) item.description = part;
	                        }
	                } );

	                return item.title ? item : null;
	        }

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
	        if( !item.icon && layout !== 'lined' && layout !== 'checklist' && layout !== 'roadmap' ) item.icon = defaultIcon( index );

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

	function buildHero( data ) {
	        const container = document.createElement( 'div' );
	        container.className = 'smartart smartart--hero';
	        container.dataset.layout = 'hero';
	        container.dataset.smartartGenerated = 'true';

	        // Check if this is a background-image variant (background parameter present)
	        if( data.background ) {
	                // Full-viewport background image variant using reveal.js native backgrounds
	                const content = document.createElement( 'div' );
	                content.className = 'smartart__hero-content-centered';

	                if( data.heading ) {
	                        const heading = document.createElement( 'h2' );
	                        heading.className = 'smartart__hero-heading-centered';
	                        heading.textContent = data.heading;
	                        content.appendChild( heading );
	                }


	                // Support both 'subtitle' and 'intro' for the subtitle text
	                const subtitleText = data.subtitle || data.intro;
	                if( subtitleText ) {
	                        const subtitle = document.createElement( 'p' );
	                        subtitle.className = 'smartart__hero-subtitle';
	                        subtitle.textContent = subtitleText;
	                        content.appendChild( subtitle );
	                }

	                if( data.cta ) {
	                        const ctaParts = data.cta.split( '|' ).map( part => part.trim() );
	                        const ctaLabel = ctaParts[ 0 ] || 'Learn More';
	                        const ctaUrl = ctaParts[ 1 ] || '#';

	                        const cta = document.createElement( 'a' );
	                        cta.className = 'smartart__hero-cta-centered';
	                        cta.textContent = ctaLabel;
	                        cta.href = ctaUrl;
	                        cta.target = /^https?:/i.test( ctaUrl ) ? '_blank' : '_self';
	                        cta.rel = 'noreferrer noopener';
	                        content.appendChild( cta );
	                }

	                container.appendChild( content );

	                // Store background info as data attributes for post-processing
	                container.dataset.backgroundUrl = data.background;
	                if (data.backgroundOpacity) {
	                        container.dataset.backgroundOpacity = data.backgroundOpacity;
	                }

	                return container;
	        }

	        // Original two-column variant (image parameter)
	        const grid = document.createElement( 'div' );
	        grid.className = 'smartart__hero-grid';

	        // Left Column - Content
	        const content = document.createElement( 'div' );
	        content.className = 'smartart__hero-content';

	        if( data.heading ) {
	                const heading = document.createElement( 'h1' );
	                heading.className = 'smartart__hero-heading';
	                heading.textContent = data.heading;
	                content.appendChild( heading );
	        }

	        if( data.intro ) {
	                const intro = document.createElement( 'p' );
	                intro.className = 'smartart__hero-intro';
	                intro.textContent = data.intro;
	                content.appendChild( intro );
	        }

	        // CTA Buttons
	        if( data.cta || data.cta2 ) {
	                const actions = document.createElement( 'div' );
	                actions.className = 'smartart__hero-actions';

	                if( data.cta ) {
	                        const ctaParts = data.cta.split( '|' ).map( part => part.trim() );
	                        const ctaLabel = ctaParts[ 0 ] || 'Learn More';
	                        const ctaUrl = ctaParts[ 1 ] || '#';

	                        const cta = document.createElement( 'a' );
	                        cta.className = 'smartart__hero-cta';
	                        cta.textContent = ctaLabel;
	                        cta.href = ctaUrl;
	                        cta.target = /^https?:/i.test( ctaUrl ) ? '_blank' : '_self';
	                        cta.rel = 'noreferrer noopener';
	                        actions.appendChild( cta );
	                }

	                if( data.cta2 ) {
	                        const cta2Parts = data.cta2.split( '|' ).map( part => part.trim() );
	                        const cta2Label = cta2Parts[ 0 ] || 'Learn More';
	                        const cta2Url = cta2Parts[ 1 ] || '#';

	                        const cta2 = document.createElement( 'a' );
	                        cta2.className = 'smartart__hero-cta smartart__hero-cta--secondary';
	                        cta2.textContent = cta2Label;
	                        cta2.href = cta2Url;
	                        cta2.target = /^https?:/i.test( cta2Url ) ? '_blank' : '_self';
	                        cta2.rel = 'noreferrer noopener';
	                        actions.appendChild( cta2 );
	                }

	                content.appendChild( actions );
	        }

	        grid.appendChild( content );

	        // Right Column - Image
	        if( data.image ) {
	                const imageWrapper = document.createElement( 'div' );
	                imageWrapper.className = 'smartart__hero-image';

	                const img = document.createElement( 'img' );
	                img.src = data.image;
	                img.alt = data.heading || 'Hero image';
	                img.loading = 'lazy';

	                imageWrapper.appendChild( img );
	                grid.appendChild( imageWrapper );
	        }

	        container.appendChild( grid );

	        return container;
	}

function buildNavbar( data ) {
	const container = document.createElement( 'div' );
	container.className = 'smartart smartart--navbar';
	container.dataset.layout = 'navbar';
	container.dataset.smartartGenerated = 'true';

	// Apply custom background/foreground and height via CSS variables
	if( data.background ) container.style.setProperty( '--smartart-navbar-bg', data.background );
	if( data.color ) container.style.setProperty( '--smartart-navbar-fg', data.color );
	if( data.height ) container.style.setProperty( '--smartart-navbar-height', data.height );
	if( data.align ) container.dataset.align = data.align;

	const inner = document.createElement( 'div' );
	inner.className = 'smartart__navbar-inner';

	if( data.heading ) {
		const title = document.createElement( 'div' );
		title.className = 'smartart__navbar-title';
		title.textContent = data.heading;
		inner.appendChild( title );
	}

	const subtitleText = data.subtitle || data.intro;
	if( subtitleText ) {
		const subtitle = document.createElement( 'div' );
		subtitle.className = 'smartart__navbar-subtitle';
		subtitle.textContent = subtitleText;
		inner.appendChild( subtitle );
	}

	container.appendChild( inner );
	return container;
}

function buildFooter( data ) {
	const container = document.createElement('div');
	container.className = 'smartart smartart--footer';
	container.dataset.layout = 'footer';
	container.dataset.smartartGenerated = 'true';
	if( data.align ) container.dataset.align = data.align;
	if( data.height ) container.style.setProperty('--smartart-footer-height', data.height);

	const inner = document.createElement('div');
	inner.className = 'smartart__footer';

	const logoWrap = document.createElement( data.link ? 'a' : 'div' );
	logoWrap.className = 'smartart__footer-logo';
	if( data.link ) {
		logoWrap.href = data.link;
		logoWrap.target = /^https?:/i.test(data.link) ? '_blank' : '_self';
		logoWrap.rel = 'noreferrer noopener';
	}

	if( data.image ) {
		const img = document.createElement('img');
		img.src = data.image;
		img.alt = data.subtitle || data.heading || 'Logo';
		img.loading = 'lazy';
		logoWrap.appendChild(img);
	}

	inner.appendChild(logoWrap);
	container.appendChild(inner);
	return container;
}

function buildAccordion( data ) {
	const container = document.createElement('div');
	container.className = 'smartart';
	container.dataset.layout = 'accordion';
	container.dataset.smartartGenerated = 'true';

	if( data.heading ) {
		const heading = document.createElement('h2');
		heading.className = 'smartart__heading';
		heading.textContent = data.heading;
		container.appendChild( heading );
	}

	if( data.intro ) {
		const intro = document.createElement('p');
		intro.className = 'smartart__intro';
		intro.textContent = data.intro;
		container.appendChild( intro );
	}

	const acc = document.createElement('div');
	acc.className = 'smartart__accordion';
	if( data.multiple ) acc.setAttribute('data-allow-multiple', 'true');

	data.items.forEach((item, index) => {
		const itemEl = document.createElement('div');
		itemEl.className = 'smartart__accordion-item';

		const header = document.createElement('h3');
		header.className = 'smartart__accordion-header';

		const button = document.createElement('button');
		button.className = 'smartart__accordion-button';
		const btnId = `${item.id}-btn`;
		const panelId = `${item.id}-panel`;
		button.id = btnId;
		button.setAttribute('aria-controls', panelId);
		button.setAttribute('aria-expanded', String(!!item.open));

		// Button content: title + chevron
		const titleSpan = document.createElement('span');
		titleSpan.textContent = item.title || `Item ${index+1}`;
		button.appendChild(titleSpan);

		const icon = document.createElement('span');
		icon.className = 'smartart__accordion-icon';
		icon.textContent = '›';
		button.appendChild(icon);

		header.appendChild(button);

		const panel = document.createElement('div');
		panel.className = 'smartart__accordion-panel';
		panel.id = panelId;
		panel.setAttribute('role', 'region');
		panel.setAttribute('aria-labelledby', btnId);

		const inner = document.createElement('div');
		inner.className = 'smartart__accordion-panel-inner';
		inner.textContent = item.description || '';
		panel.appendChild(inner);

		// Toggle behavior
		button.addEventListener('click', () => {
			const isOpen = button.getAttribute('aria-expanded') === 'true';
			const allowMultiple = acc.hasAttribute('data-allow-multiple');

			if( !allowMultiple ) {
				// Close other open panels
				acc.querySelectorAll('.smartart__accordion-button[aria-expanded="true"]').forEach(btn => {
					if( btn !== button ) {
						btn.setAttribute('aria-expanded', 'false');
						const pid = btn.getAttribute('aria-controls');
						const pp = pid && document.getElementById(pid);
						if( pp ) pp.style.maxHeight = '0px';
					}
				});
			}

			button.setAttribute('aria-expanded', String(!isOpen));
			panel.style.maxHeight = !isOpen ? (panel.querySelector('.smartart__accordion-panel-inner')?.scrollHeight + 'px') : '0px';
		});

		itemEl.appendChild(header);
		itemEl.appendChild(panel);
		acc.appendChild(itemEl);

		// Initialize open state after in-DOM for proper measurement
		if( item.open ) {
			const h = inner.scrollHeight;
			panel.style.maxHeight = h + 'px';
		}
	});

	container.appendChild(acc);
	return container;
}

function buildCarousel( data ) {
	const container = document.createElement('div');
	container.className = 'smartart';
	container.dataset.layout = 'carousel';
	container.dataset.smartartGenerated = 'true';
	if( data.cards === true || (data.variant||'').toLowerCase() === 'cards' ) {
		container.dataset.variant = 'cards';
	}

	if( data.heading ) {
		const h = document.createElement('h2');
		h.className = 'smartart__heading';
		h.textContent = data.heading;
		container.appendChild(h);
	}
	if( data.intro ) {
		const p = document.createElement('p');
		p.className = 'smartart__intro';
		p.textContent = data.intro;
		container.appendChild(p);
	}

	const carousel = document.createElement('div');
	carousel.className = 'smartart__carousel';
	carousel.setAttribute('role', 'region');
	carousel.setAttribute('aria-roledescription', 'carousel');
	carousel.tabIndex = 0; // focusable for keyboard
	if( data.height ) carousel.style.setProperty('--smartart-carousel-height', data.height);

	const track = document.createElement('div');
	track.className = 'smartart__carousel-track';
	carousel.appendChild(track);

	const slides = [];
	data.items.forEach((item, idx) => {
		const slide = document.createElement('div');
		slide.className = 'smartart__carousel-slide';
		slide.setAttribute('aria-roledescription', 'slide');
		slide.dataset.index = String(idx);

		const isCards = container.dataset.variant === 'cards';
		if( isCards ) {
			// Build a text card within the slide
			const card = document.createElement('div');
			card.className = 'smartart__carousel-card';
			const header = document.createElement('div');
			header.className = 'smartart__carousel-card-header';
			if( item.icon ) {
				const iw = document.createElement('div');
				iw.className = 'smartart__carousel-card-icon';
				const ic = document.createElement('img');
				ic.src = iconToUrl(item.icon);
				ic.alt = '';
				ic.loading = 'lazy';
				iw.appendChild(ic);
				header.appendChild(iw);
			}
			if( item.title ) {
				const t = document.createElement('h3');
				t.className = 'smartart__carousel-card-title';
				t.textContent = item.title;
				header.appendChild(t);
			}
			card.appendChild(header);

			if( item.image ) {
				// Optional small illustration at top
				const pic = document.createElement('img');
				pic.src = item.image;
				pic.alt = item.alt || '';
				pic.style.maxHeight = '200px';
				pic.style.objectFit = 'cover';
				pic.style.borderRadius = '10px';
				pic.style.width = '100%';
				card.appendChild(pic);
			}

			if( item.description ) {
				const d = document.createElement('p');
				d.className = 'smartart__carousel-card-body';
				d.textContent = item.description;
				card.appendChild(d);
			}

			if( item.ctaLabel ) {
				const actions = document.createElement('div');
				actions.className = 'smartart__carousel-card-actions';
				const a = document.createElement('a');
				a.className = 'smartart__cta';
				a.textContent = item.ctaLabel;
				a.href = item.ctaUrl || '#';
				a.target = /^https?:/i.test(item.ctaUrl) ? '_blank' : '_self';
				a.rel = 'noreferrer noopener';
				actions.appendChild(a);
				card.appendChild(actions);
			}

			slide.appendChild(card);
		}
		else {
			const img = document.createElement('img');
			img.src = item.image;
			img.alt = item.alt || item.title || `Slide ${idx+1}`;
			img.loading = 'lazy';
			slide.appendChild(img);

			if( item.title || item.description ) {
				const cap = document.createElement('div');
				cap.className = 'smartart__carousel-caption';
				if( item.title ) {
					const t = document.createElement('h3');
					t.textContent = item.title;
					cap.appendChild(t);
				}
				if( item.description ) {
					const d = document.createElement('p');
					d.textContent = item.description;
					cap.appendChild(d);
				}
				slide.appendChild(cap);
			}
		}

		track.appendChild(slide);
		slides.push(slide);
	});

	// Controls/indicators options
	const showControls = data.controls !== '' ? !!data.controls : true;
	const showIndicators = data.indicators !== '' ? !!data.indicators : true;
	const loop = data.loop !== '' ? !!data.loop : true;
	const autoplay = data.autoplay !== '' ? !!data.autoplay : false;
	const interval = (typeof data.interval === 'number' && !isNaN(data.interval)) ? data.interval : 5000;

	// Indicators
	let indicatorsEl = null;
	if( showIndicators ) {
		indicatorsEl = document.createElement('div');
		indicatorsEl.className = 'smartart__carousel-indicators';
		data.items.forEach((_, i) => {
			const btn = document.createElement('button');
			btn.type = 'button';
			btn.setAttribute('aria-label', `Go to slide ${i+1}`);
			btn.addEventListener('click', () => goTo(i));
			indicatorsEl.appendChild(btn);
		});
		carousel.appendChild(indicatorsEl);
	}

	// Controls
	let prevBtn = null, nextBtn = null;
	if( showControls ) {
		prevBtn = document.createElement('button');
		prevBtn.className = 'smartart__carousel-control smartart__carousel-control--prev';
		prevBtn.setAttribute('aria-label', 'Previous slide');
		prevBtn.innerHTML = '&#10094;';
		prevBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); prev(); });
		prevBtn.addEventListener('pointerdown', (e) => { e.stopPropagation(); });

		nextBtn = document.createElement('button');
		nextBtn.className = 'smartart__carousel-control smartart__carousel-control--next';
		nextBtn.setAttribute('aria-label', 'Next slide');
		nextBtn.innerHTML = '&#10095;';
		nextBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); next(); });
		nextBtn.addEventListener('pointerdown', (e) => { e.stopPropagation(); });

		carousel.appendChild(prevBtn);
		carousel.appendChild(nextBtn);
	}

	// State and behavior
	let index = 0;
	let timer = null;

	function update() {
		const clamped = Math.max(0, Math.min(index, slides.length-1));
		index = clamped;
		const width = carousel.clientWidth || 0;
		track.style.transform = `translateX(${-(index * width)}px)`;
		slides.forEach((s, i) => {
			const active = i === index;
			s.setAttribute('aria-hidden', active ? 'false' : 'true');
			if( active ) s.setAttribute('aria-current', 'true'); else s.removeAttribute('aria-current');
		});
		if( indicatorsEl ) {
			const buttons = Array.from(indicatorsEl.querySelectorAll('button'));
			buttons.forEach((b,i)=>{
				if( i === index ) b.setAttribute('aria-current','true'); else b.removeAttribute('aria-current');
			});
		}
		if( showControls && !loop ) {
			if( prevBtn ) prevBtn.disabled = index === 0;
			if( nextBtn ) nextBtn.disabled = index === slides.length-1;
		}
	}

	function goTo(i) {
		if( i < 0 ) index = loop ? (slides.length-1) : 0;
		else if( i >= slides.length ) index = loop ? 0 : (slides.length-1);
		else index = i;
		update();
	}
	function next() { goTo(index+1); }
	function prev() { goTo(index-1); }

	// Keyboard
	carousel.addEventListener('keydown', (e) => {
		if( e.key === 'ArrowRight' ) { e.preventDefault(); e.stopPropagation(); next(); }
		else if( e.key === 'ArrowLeft' ) { e.preventDefault(); e.stopPropagation(); prev(); }
	});

	// Touch/Swipe
	let startX = 0, dragging = false;
	carousel.addEventListener('pointerdown', e => { dragging = true; startX = e.clientX; e.stopPropagation(); carousel.setPointerCapture && carousel.setPointerCapture(e.pointerId); });
	carousel.addEventListener('pointerup', e => {
		if(!dragging) return; dragging = false;
		const dx = e.clientX - startX;
		if( Math.abs(dx) > 30 ) { dx < 0 ? next() : prev(); }
		e.stopPropagation();
	});
	carousel.addEventListener('pointermove', e => { if(dragging) e.stopPropagation(); });

	// Autoplay
	function startAuto() { if( autoplay && slides.length>1 ) { stopAuto(); timer = setInterval(()=> next(), interval); } }
	function stopAuto() { if( timer ) { clearInterval(timer); timer = null; } }
	carousel.addEventListener('mouseenter', stopAuto);
	carousel.addEventListener('mouseleave', startAuto);
	document.addEventListener('visibilitychange', () => { if( document.hidden ) stopAuto(); else startAuto(); });

	// Init after insertion so sizes are measurable
	container.appendChild(carousel);
	const init = () => { update(); startAuto(); };
	if( document.readyState === 'complete' ) requestAnimationFrame(init);
	else window.addEventListener('load', () => requestAnimationFrame(init), { once: true });
	window.addEventListener('resize', () => requestAnimationFrame(update));
	return container;
}


function buildDrawer( data ) {
	const container = document.createElement('div');
	container.className = 'smartart';
	container.dataset.layout = 'drawer';
	container.dataset.smartartGenerated = 'true';

	if( data.heading ) {
		const h = document.createElement('h2');
		h.className = 'smartart__heading';
		h.textContent = data.heading;
		container.appendChild(h);
	}
	if( data.intro ) {
		const p = document.createElement('p');
		p.className = 'smartart__intro';
		p.textContent = data.intro;
		container.appendChild(p);
	}

	const toggleLabel = data.toggle || 'Open';
	const pos = (data.position || 'end').toLowerCase();
	const size = data.size || '320px';
	const hasBackdrop = (data.backdrop !== '' ? !!data.backdrop : true);
	const escEnabled = (data.keyboard !== '' ? !!data.keyboard : true);
	const autoStart = !!data.autostart;

	const btn = document.createElement('button');
	btn.className = 'smartart__drawer-toggle';
	btn.type = 'button';
	btn.textContent = toggleLabel;
	container.appendChild(btn);

	// Backdrop + panel should be attached to body to avoid being affected by Reveal transforms
	const backdrop = document.createElement('div');
	backdrop.className = 'smartart__drawer-backdrop';

	const panel = document.createElement('div');
	panel.className = 'smartart__drawer-panel';
	panel.setAttribute('role','dialog');
	panel.setAttribute('aria-modal','true');
	panel.dataset.position = pos;
	panel.style.setProperty('--smartart-drawer-size', size);

	// Opt into the xshadcn-lite skin for better form visuals
	panel.classList.add('smartart--xshadcn');
	// If the XShadcn plugin is available, also tag as an xshadcn container
	try {
		if (window.Reveal && typeof window.Reveal.getPlugin === 'function' && window.Reveal.getPlugin('xshadcn')) {
			panel.classList.add('xshadcn-container');
		}
	} catch(err) { /* non-fatal */ }

	// Header
	const header = document.createElement('div');
	header.className = 'smartart__drawer-header';
	if( data.heading ) {
		const title = document.createElement('h3');
		title.className = 'smartart__drawer-title';
		title.textContent = data.heading;
		header.appendChild(title);
	}
	const closeBtn = document.createElement('button');
	closeBtn.className = 'smartart__drawer-close';
	closeBtn.setAttribute('aria-label','Close');
	closeBtn.innerHTML = '&#10005;';
	header.appendChild(closeBtn);
	panel.appendChild(header);

	// Body
	const body = document.createElement('div');
	body.className = 'smartart__drawer-body';
	if( data.items && data.items.length ) {
		const list = document.createElement('ul');
		list.className = 'smartart__drawer-list';
		data.items.forEach(raw => {
			const li = document.createElement('li');
			if( raw.title ) {
				const t = document.createElement('strong');
				t.textContent = raw.title;
				li.appendChild(t);
			}
			if( raw.description ) {
				const d = document.createElement('div');
				d.textContent = raw.description;
				li.appendChild(d);
			}
			if( raw.ctaLabel ) {
				const a = document.createElement('a');
				a.href = raw.ctaUrl || '#';
				a.target = /^https?:/i.test(raw.ctaUrl) ? '_blank' : '_self';
				a.rel = 'noreferrer noopener';
				a.className = 'smartart__cta';
				a.textContent = raw.ctaLabel;
				li.appendChild(a);
			}
			list.appendChild(li);
		});
		body.appendChild(list);
	}
	panel.appendChild(body);

	// Progressive enhancement: when content (like forms) is inserted later
	// into the drawer body, normalize inputs so they adopt the xshadcn skin
	// without requiring React components.
	(function enhanceForms(root){
		const decorate = (scope)=>{
			// If xshadcn skin is active, nothing else to do; our CSS targets descendants
			// but we ensure reasonable defaults even without it.
			scope.querySelectorAll('input, select, textarea').forEach(el=>{
				// Avoid clobbering existing custom styles
				el.style.boxSizing = el.style.boxSizing || 'border-box';
				if(!el.hasAttribute('data-smartart-skinned')) {
					el.setAttribute('data-smartart-skinned','true');
				}
			});
		};
		decorate(body);
		const mo = new MutationObserver(muts => {
			for (const m of muts) {
				if (m.type === 'childList' && (m.addedNodes && m.addedNodes.length)) {
					m.addedNodes.forEach(n=>{ if(n.nodeType===1) decorate(n); });
				}
			}
		});
		mo.observe(body, { childList:true, subtree:true });
	})(body);

	// Append overlay pieces to document body so position:fixed anchors to viewport
	(document.body || container).appendChild(backdrop);
	(document.body || container).appendChild(panel);

	// Behavior
	let lastFocused = null;
	function open() {
		lastFocused = document.activeElement;
		panel.classList.add('is-open');
		if( hasBackdrop ) backdrop.classList.add('is-visible');
		// If LLM Runner is present and no explicit custom size was provided,
		// expand the panel for better reading width.
		try {
			const hasRunner = !!panel.querySelector('.llm-runner-wrapper');
			const usingDefaultSize = (size === '320px' || size === undefined || size === null);
			if (hasRunner && usingDefaultSize) {
				panel.classList.add('smartart--wide');
				// Inline style for --smartart-drawer-size was set earlier; override it
				// so the width actually expands even with inline precedence.
				panel.style.setProperty('--smartart-drawer-size', 'clamp(520px, 70vw, 1100px)');
			}
		} catch(_) { /* non-fatal */ }
		// focus first focusable in panel
		requestAnimationFrame(()=>{
			const focusable = panel.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
			(focusable||closeBtn).focus();
		});
	}
	function close() {
		panel.classList.remove('is-open');
		backdrop.classList.remove('is-visible');
		if( lastFocused && lastFocused.focus ) lastFocused.focus();
	}

	btn.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); open(); });
	closeBtn.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); close(); });
	if( hasBackdrop ) backdrop.addEventListener('click', (e)=>{ e.stopPropagation(); close(); });
	panel.addEventListener('click', e=> e.stopPropagation());
	panel.addEventListener('keydown', e=> { if( e.key === 'Escape' && escEnabled ) { e.preventDefault(); e.stopPropagation(); close(); } });

	if( autoStart ) {
		// Open shortly after render
		setTimeout(open, 120);
	}

	return container;
}

function buildModal( data ) {
	const container = document.createElement('div');
	container.className = 'smartart';
	container.dataset.layout = 'modal';
	container.dataset.smartartGenerated = 'true';

	if( data.heading ) {
		const h = document.createElement('h2');
		h.className = 'smartart__heading';
		h.textContent = data.heading;
		container.appendChild(h);
	}
	if( data.intro ) {
		const p = document.createElement('p');
		p.className = 'smartart__intro';
		p.textContent = data.intro;
		container.appendChild(p);
	}

	const toggleLabel = data.toggle || 'Open';
	const size = (data.size || '').toLowerCase(); // supports sm|lg|xl|fullscreen or CSS width
	const hasBackdrop = (data.backdrop !== '' ? !!data.backdrop : true);
	const escEnabled = (data.keyboard !== '' ? !!data.keyboard : true);
	const autoStart = !!data.autostart;

	const btn = document.createElement('button');
	btn.className = 'smartart__modal-toggle';
	btn.type = 'button';
	btn.textContent = toggleLabel;
	container.appendChild(btn);

	// Backdrop + modal container appended to body for correct stacking/positioning
	const backdrop = document.createElement('div');
	backdrop.className = 'smartart__modal-backdrop';

	const modal = document.createElement('div');
	modal.className = 'smartart__modal';
	modal.setAttribute('role','dialog');
	modal.setAttribute('aria-modal','true');

	const dialog = document.createElement('div');
	dialog.className = 'smartart__modal-dialog smartart--xshadcn';
	// Tag as xshadcn container if plugin present
	try {
		if (window.Reveal && typeof window.Reveal.getPlugin === 'function' && window.Reveal.getPlugin('xshadcn')) {
			dialog.classList.add('xshadcn-container');
		}
	} catch(_) { /* non-fatal */ }
	if( size ) {
		if( /(sm|lg|xl|fullscreen)/.test(size) ) dialog.dataset.size = size;
		else dialog.style.setProperty('--smartart-modal-width', size);
	}

	const header = document.createElement('div');
	header.className = 'smartart__modal-header';
	if( data.heading ) {
		const title = document.createElement('h3');
		title.className = 'smartart__modal-title';
		title.textContent = data.heading;
		header.appendChild(title);
	}
	const closeBtn = document.createElement('button');
	closeBtn.className = 'smartart__modal-close';
	closeBtn.setAttribute('aria-label','Close');
	closeBtn.innerHTML = '&#10005;';
	header.appendChild(closeBtn);
	dialog.appendChild(header);

	const body = document.createElement('div');
	body.className = 'smartart__modal-body';
	if( data.items && data.items.length ) {
		const list = document.createElement('ul');
		list.className = 'smartart__modal-list';
		data.items.forEach(raw => {
			const li = document.createElement('li');
			if( raw.title ) {
				const t = document.createElement('strong');
				t.textContent = raw.title;
				li.appendChild(t);
			}
			if( raw.description ) {
				const d = document.createElement('div');
				d.textContent = raw.description;
				li.appendChild(d);
			}
			if( raw.ctaLabel ) {
				const a = document.createElement('a');
				a.href = raw.ctaUrl || '#';
				a.target = /^https?:/i.test(raw.ctaUrl) ? '_blank' : '_self';
				a.rel = 'noreferrer noopener';
				a.className = 'smartart__btn';
				a.textContent = raw.ctaLabel;
				li.appendChild(a);
			}
			list.appendChild(li);
		});
		body.appendChild(list);
	}
	dialog.appendChild(body);

	// Optional footer actions if CTA/CTA2 were provided at block level
	if( data.cta || data.cta2 ) {
		const footer = document.createElement('div');
		footer.className = 'smartart__modal-footer';
		if( data.cta ) {
			const [label, url] = data.cta.split('|').map(s=>s.trim());
			const a = document.createElement('a');
			a.href = url || '#';
			a.target = /^https?:/i.test(url) ? '_blank' : '_self';
			a.rel = 'noreferrer noopener';
			a.className = 'smartart__btn';
			a.textContent = label || 'OK';
			footer.appendChild(a);
		}
		if( data.cta2 ) {
			const [label2, url2] = data.cta2.split('|').map(s=>s.trim());
			const a2 = document.createElement('a');
			a2.href = url2 || '#';
			a2.target = /^https?:/i.test(url2) ? '_blank' : '_self';
			a2.rel = 'noreferrer noopener';
			a2.className = 'smartart__btn smartart__btn--secondary';
			a2.textContent = label2 || 'Cancel';
			footer.appendChild(a2);
		}
		dialog.appendChild(footer);
	}

	modal.appendChild(dialog);
	function attach() {
		const host = document.body || container;
		if (hasBackdrop && backdrop.parentNode !== host) host.appendChild(backdrop);
		if (modal.parentNode !== host) host.appendChild(modal);
	}

	// Behavior
	let lastFocused = null;
	function open() {
		attach();
		lastFocused = document.activeElement;
		modal.classList.add('is-open');
		if( hasBackdrop ) backdrop.classList.add('is-visible');
		// Focus first focusable
		requestAnimationFrame(()=>{
			const focusable = dialog.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
			(focusable||closeBtn).focus();
		});
	}
	function close() {
		modal.classList.remove('is-open');
		if( hasBackdrop ) backdrop.classList.remove('is-visible');
		// Detach nodes to avoid any overlay stacking/pointer-events edge cases
		try {
			if (modal.parentNode) modal.parentNode.removeChild(modal);
			if (hasBackdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
		} catch(_) { /* non-fatal */ }
		if( lastFocused && lastFocused.focus ) lastFocused.focus();
	}

	btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); open(); });
	closeBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); close(); });
	if( hasBackdrop ) backdrop.addEventListener('click', e => { e.stopPropagation(); close(); });
	dialog.addEventListener('click', e => e.stopPropagation());
	dialog.addEventListener('keydown', e => { if( e.key === 'Escape' && escEnabled ) { e.preventDefault(); e.stopPropagation(); close(); }});

	if( autoStart ) setTimeout(open, 120);

	return container;
}

	function buildChecklist( data ) {
	        const container = document.createElement( 'div' );
	        container.className = 'smartart';
	        container.dataset.layout = 'checklist';
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

	        const checklist = document.createElement( 'div' );
	        checklist.className = 'smartart__checklist';

	        // Support for fragments: progressive reveal with auto-check
	        const useFragments = data.fragments !== false; // Default to true
	        const fragmentAnimation = data.fragmentAnimation || 'fade-up'; // Default animation
	        const autoCheck = data.autoCheck !== false; // Auto-check on reveal (default true)

	        data.items.forEach( ( item, index ) => {
	                const label = document.createElement( 'label' );
	                label.className = 'smartart__checklist-item';

	                // Add fragment classes for progressive reveal
	                if( useFragments ) {
	                        label.classList.add( 'fragment', fragmentAnimation );
	                        // Set fragment index to ensure proper order
	                        label.dataset.fragmentIndex = index;
	                }

	                const checkbox = document.createElement( 'input' );
	                checkbox.type = 'checkbox';
	                checkbox.className = 'smartart__checklist-checkbox';
	                checkbox.checked = item.checked || false;
	                checkbox.setAttribute( 'aria-label', item.title );

	                const labelText = document.createElement( 'span' );
	                labelText.className = 'smartart__checklist-label';
	                labelText.textContent = item.title;

	                label.appendChild( checkbox );
	                label.appendChild( labelText );
	                checklist.appendChild( label );
	        } );

	        container.appendChild( checklist );

	        // Set up fragment event listener for auto-checking
	        if( useFragments && autoCheck ) {
	                // Store reference for cleanup
	                container.dataset.hasFragmentListener = 'true';
	        }

	        return container;
	}

	function parsePrice( priceString ) {
	        // Match patterns like "$9/month", "$29", "Contact Us"
	        const match = priceString.match( /^(\$?\d+(?:\.\d{2})?)(.*)$/ );
	        if( match ) {
	                return {
	                        amount: match[ 1 ],
	                        period: match[ 2 ].trim() // e.g., "/month", "/year"
	                };
	        }
	        return {
	                amount: priceString, // e.g., "Contact Us", "Custom"
	                period: ''
	        };
	}

	function buildPricing( data ) {
	        const container = document.createElement( 'div' );
	        container.className = 'smartart';
	        container.dataset.layout = 'pricing';
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
	        grid.className = 'smartart__pricing-grid';

	        data.items.forEach( ( item, index ) => {
	                const card = document.createElement( 'div' );
	                card.className = 'smartart__pricing-card';
	                if( item.featured ) {
	                        card.classList.add( 'smartart__pricing-card--featured' );
	                }

	                // Popular badge for featured plans
	                if( item.featured ) {
	                        const badge = document.createElement( 'div' );
	                        badge.className = 'smartart__pricing-badge';
	                        badge.textContent = 'Popular';
	                        card.appendChild( badge );
	                }

	                // Card header
	                const header = document.createElement( 'div' );
	                header.className = 'smartart__pricing-header';

	                // Plan name
	                if( item.title ) {
	                        const title = document.createElement( 'h3' );
	                        title.className = 'smartart__pricing-title';
	                        title.textContent = item.title;
	                        header.appendChild( title );
	                }

	                // Price
	                if( item.price ) {
	                        const priceWrapper = document.createElement( 'div' );
	                        priceWrapper.className = 'smartart__pricing-price-wrapper';

	                        const parsedPrice = parsePrice( item.price );

	                        const priceAmount = document.createElement( 'span' );
	                        priceAmount.className = 'smartart__pricing-price';
	                        priceAmount.textContent = parsedPrice.amount;
	                        priceWrapper.appendChild( priceAmount );

	                        if( parsedPrice.period ) {
	                                const pricePeriod = document.createElement( 'span' );
	                                pricePeriod.className = 'smartart__pricing-period';
	                                pricePeriod.textContent = parsedPrice.period;
	                                priceWrapper.appendChild( pricePeriod );
	                        }

	                        header.appendChild( priceWrapper );
	                }

	                // Description
	                if( item.description ) {
	                        const description = document.createElement( 'p' );
	                        description.className = 'smartart__pricing-description';
	                        description.textContent = item.description;
	                        header.appendChild( description );
	                }

	                card.appendChild( header );

	                // CTA Button
	                if( item.ctaLabel ) {
	                        const cta = document.createElement( 'a' );
	                        cta.className = 'smartart__pricing-cta';
	                        cta.classList.add( item.featured ? 'smartart__pricing-cta--primary' : 'smartart__pricing-cta--secondary' );
	                        cta.textContent = item.ctaLabel;
	                        cta.href = item.ctaUrl || '#';
	                        cta.target = /^https?:/i.test( item.ctaUrl ) ? '_blank' : '_self';
	                        cta.rel = 'noreferrer noopener';
	                        card.appendChild( cta );
	                }

	                // Features list
	                if( item.features && item.features.length > 0 ) {
	                        const featuresList = document.createElement( 'ul' );
	                        featuresList.className = 'smartart__pricing-features';

	                        item.features.forEach( feature => {
	                                const featureItem = document.createElement( 'li' );
	                                featureItem.className = 'smartart__pricing-feature';

	                                const icon = document.createElement( 'img' );
	                                icon.className = 'smartart__pricing-icon';
	                                icon.src = 'https://api.iconify.design/lucide:check-circle.svg';
	                                icon.alt = 'Included';
	                                icon.loading = 'lazy';

	                                const featureText = document.createElement( 'span' );
	                                featureText.textContent = feature;

	                                featureItem.appendChild( icon );
	                                featureItem.appendChild( featureText );
	                                featuresList.appendChild( featureItem );
	                        } );

	                        card.appendChild( featuresList );
	                }

	                grid.appendChild( card );
	        } );

	        container.appendChild( grid );

	        return container;
	}

	function buildStats( data ) {
	        const container = document.createElement( 'div' );
	        container.className = 'smartart';
	        container.dataset.layout = 'stats';
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
	        grid.className = 'smartart__stats-grid';

	        const iconColors = ['blue', 'green', 'purple', 'orange', 'teal', 'red'];

	        data.items.forEach( ( item, index ) => {
	                const card = document.createElement( 'div' );
	                card.className = 'smartart__stat-card';

	                // Header with label and icon
	                const header = document.createElement( 'div' );
	                header.className = 'smartart__stat-header';

	                // Label
	                if( item.title ) {
	                        const label = document.createElement( 'p' );
	                        label.className = 'smartart__stat-label';
	                        label.textContent = item.title;
	                        header.appendChild( label );
	                }

	                // Icon (top right)
	                if( item.icon ) {
	                        const iconWrapper = document.createElement( 'div' );
	                        iconWrapper.className = 'smartart__stat-icon';

	                        // Auto-assign color or use specified color
	                        const colorClass = item.iconColor || iconColors[ index % iconColors.length ];
	                        iconWrapper.classList.add( `smartart__stat-icon--${colorClass}` );

	                        const icon = document.createElement( 'img' );
	                        icon.src = iconToUrl( item.icon );
	                        icon.alt = item.title ? `${ item.title } icon` : 'Stat icon';
	                        icon.loading = 'lazy';
	                        iconWrapper.appendChild( icon );
	                        header.appendChild( iconWrapper );
	                }

	                card.appendChild( header );

	                // Value (large number)
	                if( item.value ) {
	                        const value = document.createElement( 'div' );
	                        value.className = 'smartart__stat-value';
	                        value.textContent = item.value;
	                        card.appendChild( value );
	                }

	                // Description/Trend
	                if( item.description ) {
	                        const description = document.createElement( 'div' );
	                        description.className = 'smartart__stat-description';

	                        // Parse trend indicators
	                        const trendMatch = item.description.match( /^(.*?)(\↑|\[up\]|\↓|\[down\]|)(.*?)$/i );

	                        if( trendMatch ) {
	                                const beforeTrend = trendMatch[ 1 ].trim();
	                                const trendIndicator = trendMatch[ 2 ].trim();
	                                const afterTrend = trendMatch[ 3 ].trim();

	                                // Determine trend type
	                                let trendType = 'neutral';
	                                let trendArrow = '';

	                                if( trendIndicator === '↑' || trendIndicator.toLowerCase() === '[up]' ) {
	                                        trendType = 'up';
	                                        trendArrow = '↑';
	                                } else if( trendIndicator === '↓' || trendIndicator.toLowerCase() === '[down]' ) {
	                                        trendType = 'down';
	                                        trendArrow = '↓';
	                                }

	                                // Build description with trend
	                                if( beforeTrend ) {
	                                        const textBefore = document.createElement( 'span' );
	                                        textBefore.textContent = beforeTrend + ' ';
	                                        description.appendChild( textBefore );
	                                }

	                                if( trendType !== 'neutral' && afterTrend ) {
	                                        const trend = document.createElement( 'span' );
	                                        trend.className = `smartart__stat-trend smartart__stat-trend--${trendType}`;

	                                        if( trendArrow ) {
	                                                const arrow = document.createElement( 'span' );
	                                                arrow.className = 'smartart__stat-trend-arrow';
	                                                arrow.textContent = trendArrow;
	                                                trend.appendChild( arrow );
	                                        }

	                                        const trendText = document.createElement( 'span' );
	                                        trendText.textContent = afterTrend;
	                                        trend.appendChild( trendText );

	                                        description.appendChild( trend );
	                                } else if( afterTrend ) {
	                                        const textAfter = document.createElement( 'span' );
	                                        textAfter.textContent = afterTrend;
	                                        description.appendChild( textAfter );
	                                }

	                                // If no trend indicator found, just show full text
	                                if( !beforeTrend && !trendArrow && !afterTrend ) {
	                                        description.textContent = item.description;
	                                }
	                        } else {
	                                description.textContent = item.description;
	                        }

	                        card.appendChild( description );
	                }

	                grid.appendChild( card );
	        } );

	        container.appendChild( grid );

	        return container;
	}

	function buildRoadmap( data ) {
	        const container = document.createElement( 'div' );
	        container.className = 'smartart';
	        container.dataset.layout = 'roadmap';
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

	        // Calculate progress percentage
	        const totalItems = data.items.length;
	        const completedItems = data.items.filter( item => item.status === 'completed' ).length;
	        const progressPercent = totalItems > 0 ? Math.round( ( completedItems / totalItems ) * 100 ) : 0;

	        const roadmap = document.createElement( 'div' );
	        roadmap.className = 'smartart__roadmap';

	        // Timeline bar with progress indicator
	        const timeline = document.createElement( 'div' );
	        timeline.className = 'smartart__roadmap-timeline';

	        const progress = document.createElement( 'div' );
	        progress.className = 'smartart__roadmap-progress';
	        progress.style.width = `${ progressPercent }%`;

	        timeline.appendChild( progress );
	        roadmap.appendChild( timeline );

	        // Roadmap items container
	        const items = document.createElement( 'div' );
	        items.className = 'smartart__roadmap-items';

	        data.items.forEach( ( item, index ) => {
	                const itemWrapper = document.createElement( 'div' );
	                const isOdd = ( index % 2 ) === 0;
	                itemWrapper.className = `smartart__roadmap-item smartart__roadmap-item--${ isOdd ? 'odd' : 'even' } smartart__roadmap-item--${ item.status }`;

	                // Timeline dot
	                const dot = document.createElement( 'div' );
	                dot.className = `smartart__roadmap-dot smartart__roadmap-dot--${ item.status }`;

	                // Milestone card
	                const card = document.createElement( 'div' );
	                card.className = 'smartart__roadmap-card';

	                // Status badge
	                const badge = document.createElement( 'span' );
	                badge.className = `smartart__roadmap-badge smartart__roadmap-badge--${ item.status }`;
	                const statusText = item.status === 'completed' ? 'Completed' :
	                                   item.status === 'progress' ? 'In Progress' : 'Planned';
	                badge.textContent = statusText;
	                card.appendChild( badge );

	                // Icon (optional)
	                if( item.icon ) {
	                        const iconWrapper = document.createElement( 'div' );
	                        iconWrapper.className = 'smartart__roadmap-icon';
	                        const icon = document.createElement( 'img' );
	                        icon.src = iconToUrl( item.icon );
	                        icon.alt = item.title ? `${ item.title } icon` : 'Milestone icon';
	                        icon.loading = 'lazy';
	                        iconWrapper.appendChild( icon );
	                        card.appendChild( iconWrapper );
	                }

	                // Title
	                if( item.title ) {
	                        const title = document.createElement( 'h3' );
	                        title.className = 'smartart__roadmap-title';
	                        title.textContent = item.title;
	                        card.appendChild( title );
	                }

	                // Description
	                if( item.description ) {
	                        const description = document.createElement( 'p' );
	                        description.className = 'smartart__roadmap-description';
	                        description.textContent = item.description;
	                        card.appendChild( description );
	                }

	                // Arrow (desktop only, styled in CSS)
	                const arrow = document.createElement( 'div' );
	                arrow.className = 'smartart__roadmap-arrow';

	                itemWrapper.appendChild( dot );
	                itemWrapper.appendChild( card );
	                itemWrapper.appendChild( arrow );
	                items.appendChild( itemWrapper );
	        } );

	        roadmap.appendChild( items );
	        container.appendChild( roadmap );

	        return container;
	}

	function buildSmartArt( data ) {
	        const layout = data.layout || orientationToLayout( data.orientation );

	        // Use specialized builder for NAVBAR layout
	        if( layout === 'navbar' ) {
	                return buildNavbar( data );
	        }

		// Use specialized builder for HERO layout
	        if( layout === 'hero' ) {
	                return buildHero( data );
	        }

	        // Use specialized builder for CHECKLIST layout
	        if( layout === 'checklist' ) {
	                return buildChecklist( data );
	        }

	        // Use specialized builder for PRICING layout
	        if( layout === 'pricing' ) {
	                return buildPricing( data );
	        }

	        // Use specialized builder for STATS layout
	        if( layout === 'stats' ) {
	                return buildStats( data );
	        }

		// Use specialized builder for ROADMAP layout
	        if( layout === 'roadmap' ) {
	                return buildRoadmap( data );
	        }

		// Use specialized builder for ACCORDION layout
		if( layout === 'accordion' ) {
			return buildAccordion( data );
		}

		// Use specialized builder for CAROUSEL layout
		if( layout === 'carousel' ) {
			return buildCarousel( data );
		}

		// Use specialized builder for DRAWER layout
		if( layout === 'drawer' ) {
			return buildDrawer( data );
		}

		// Use specialized builder for MODAL layout
		if( layout === 'modal' ) {
			return buildModal( data );
		}

		// Use specialized builder for FOOTER layout
		if( layout === 'footer' ) {
			return buildFooter( data );
		}

	        // Use specialized builder for ACCORDION layout
	        if( layout === 'accordion' ) {
	                return buildAccordion( data );
	        }

	        const container = document.createElement( 'div' );
	        container.className = 'smartart';
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

	                // Check if this element starts a smartart block
	                if( !/:::\s*smartart/i.test( text ) ) return;

	                // Handle case where markdown splits the block across multiple elements
	                let combinedText = text;
	                const elementsToReplace = [ element ];

	                // If the opening element doesn't contain closing :::, collect siblings
	                if( !/:::\s*$/.test( text.trim() ) ) {
	                        let sibling = element.nextElementSibling;
	                        while( sibling ) {
	                                const siblingText = sibling.textContent || '';
	                                combinedText += '\n' + siblingText;
	                                elementsToReplace.push( sibling );

	                                // Stop when we find the closing :::
	                                if( /:::\s*$/.test( siblingText.trim() ) ) break;

	                                sibling = sibling.nextElementSibling;
	                        }
	                }

	                const parsed = parseBlock( combinedText );
	                if( !parsed ) return;


	                // Build component
	                const smartArt = buildSmartArt( parsed );

	                // Special handling for NAVBAR: insert at top of current section
					if( parsed.layout === 'navbar' && smartArt ) {
	                        // Find the top-most section ancestor within .slides
	                        let section = element.closest('section');
	                        let topSection = section;
	                        while( topSection && topSection.parentElement && topSection.parentElement.tagName && topSection.parentElement.tagName.toLowerCase() === 'section' ) {
	                                topSection = topSection.parentElement;
	                        }

	                        const targetSection = section || topSection || (root.closest && root.closest('section')) || root;

	                        if( targetSection && targetSection.firstChild ) {
	                                targetSection.insertBefore( smartArt, targetSection.firstChild );
	                        }
	                        else if( targetSection ) {
	                                targetSection.appendChild( smartArt );
	                        }
	                        // Mark both the nearest and top section (if different) to offset content below navbar
				if( targetSection && targetSection.setAttribute ) {
	                                targetSection.setAttribute('data-has-navbar', 'true');
					// Propagate custom navbar height to the section so padding matches
					const h = smartArt.style.getPropertyValue('--smartart-navbar-height');
					if( h ) targetSection.style.setProperty('--smartart-navbar-height', h);
	                        }
				if( topSection && topSection !== targetSection && topSection.setAttribute ) {
	                                topSection.setAttribute('data-has-navbar', 'true');
					const h = smartArt.style.getPropertyValue('--smartart-navbar-height');
					if( h ) topSection.style.setProperty('--smartart-navbar-height', h);
	                        }
	                        // Remove the original placeholder elements
	                        elementsToReplace.forEach( el => el.remove() );
	                        return;
	                }

	                // Special handling for FOOTER: anchor to slide corner; support global injection
					if( parsed.layout === 'footer' && smartArt ) {
	                        // If marked global, store config and attach to all sections
			if( parsed.global ) {
				GLOBAL_SMARTART_FOOTER = parsed;
				// Attach across all sections, skipping those that already have a footer
				const allSections = (root.getRootNode ? root.getRootNode() : document).querySelectorAll ? (document.querySelectorAll('.reveal .slides section')) : [];
				allSections.forEach(sec => {
					// Avoid adding to nested sections if they already contain a footer
					if( sec.querySelector(':scope > .smartart[data-layout="footer"]') ) return;
					const f = buildFooter( GLOBAL_SMARTART_FOOTER );
					f.dataset.global = 'true';
					sec.appendChild( f );
				});
				// Remove the original placeholder elements
				elementsToReplace.forEach( el => el.remove() );
				return;
			}

			// Local footer: attach to the nearest leaf section
			const section = element.closest('section');
			const targetSection = section || (root.closest && root.closest('section')) || root;
			if( targetSection ) {
				targetSection.appendChild( smartArt );
			}
			elementsToReplace.forEach( el => el.remove() );
			return;
		}

	                // Default: Replace the first element and remove the rest
	                element.replaceWith( smartArt );
	                elementsToReplace.slice( 1 ).forEach( el => el.remove() );
	        } );

	        // Post-process hero components to apply backgrounds to their parent sections
	        setTimeout(() => {
	                const heroComponents = root.querySelectorAll('.smartart--hero[data-background-url]');
	                heroComponents.forEach(hero => {
	                        const section = hero.closest('section');
	                        if (section && hero.dataset.backgroundUrl) {
	                                section.setAttribute('data-background-image', hero.dataset.backgroundUrl);
	                                section.setAttribute('data-background-size', 'cover');
	                                section.setAttribute('data-background-position', 'center');

	                                if (hero.dataset.backgroundOpacity) {
	                                        section.setAttribute('data-background-opacity', hero.dataset.backgroundOpacity);
	                                }

	                                // Clean up data attributes
	                                delete hero.dataset.backgroundUrl;
	                                delete hero.dataset.backgroundOpacity;
	                        }
	                });

	                // Initialize accordion open states after DOM insertion
	                const accordions = root.querySelectorAll('.smartart[data-layout="accordion"] .smartart__accordion');
	                accordions.forEach(acc => {
	                        acc.querySelectorAll('.smartart__accordion-button').forEach(btn => {
	                                const expanded = btn.getAttribute('aria-expanded') === 'true';
	                                const panelId = btn.getAttribute('aria-controls');
	                                const panel = panelId ? acc.querySelector(`#${CSS && CSS.escape ? CSS.escape(panelId) : panelId}`) : null;
	                                if( panel ) {
	                                        if( expanded ) {
	                                                const inner = panel.querySelector('.smartart__accordion-panel-inner');
	                                                const h = (inner ? inner.scrollHeight : panel.scrollHeight) || 0;
	                                                panel.style.maxHeight = h + 'px';
	                                        }
	                                        else {
	                                                panel.style.maxHeight = '0px';
	                                        }
	                                }
	                        });
	                });
	        }, 120);
	}

	const SmartArtPlugin = {
	        id: 'smartart',
	        init: function( reveal ) {
	                injectStyles();

	                const process = () => {
	                        renderWithin( reveal.getSlidesElement() || reveal.getRevealElement() );

	                        // After processing, sync reveal.js to update backgrounds
	                        setTimeout(() => {
	                                if (reveal && reveal.sync) {
	                                        reveal.sync();
	                                }
	                        }, 150);
	                };

	                reveal.on( 'ready', event => {
	                        process();
	                        if( event && event.currentSlide ) renderWithin( event.currentSlide );
	                        // Ensure global footer (if configured) is attached across the deck
	                        if( GLOBAL_SMARTART_FOOTER ) {
	                                const allSections = (reveal.getSlidesElement() || document).querySelectorAll('section');
	                                allSections.forEach(sec => {
	                                        if( sec.querySelector(':scope > .smartart[data-layout="footer"]') ) return;
	                                        const f = buildFooter( GLOBAL_SMARTART_FOOTER );
	                                        f.dataset.global = 'true';
	                                        sec.appendChild( f );
	                                });
	                        }
	                } );

	                reveal.on( 'slidechanged', event => {
	                        if( event && event.currentSlide ) renderWithin( event.currentSlide );
	                        // Ensure current slide has global footer if configured
	                        if( GLOBAL_SMARTART_FOOTER && event && event.currentSlide && !event.currentSlide.querySelector(':scope > .smartart[data-layout="footer"]') ) {
	                                const f = buildFooter( GLOBAL_SMARTART_FOOTER );
	                                f.dataset.global = 'true';
	                                event.currentSlide.appendChild( f );
	                        }
	                        // Close any open drawers when changing slides
	                        const openPanels = document.querySelectorAll('.smartart__drawer-panel.is-open');
	                        openPanels.forEach(p => p.classList.remove('is-open'));
	                        const backdrops = document.querySelectorAll('.smartart__drawer-backdrop.is-visible');
	                        backdrops.forEach(b => b.classList.remove('is-visible'));
	                        // Close any open modals when changing slides
	                        const openModals = document.querySelectorAll('.smartart__modal.is-open');
	                        openModals.forEach(m => m.classList.remove('is-open'));
	                        const modalBackdrops = document.querySelectorAll('.smartart__modal-backdrop.is-visible');
	                        modalBackdrops.forEach(b => b.classList.remove('is-visible'));
	                } );

	                // Fragment event handler for checklist auto-check
	                reveal.on( 'fragmentshown', event => {
	                        const fragment = event.fragment;
	                        // Check if this fragment is a checklist item
	                        if( fragment && fragment.classList.contains('smartart__checklist-item') ) {
	                                const checkbox = fragment.querySelector('.smartart__checklist-checkbox');
	                                if( checkbox ) {
	                                        // Auto-check with a smooth animation
	                                        setTimeout(() => {
	                                                checkbox.checked = true;
	                                        }, 200);
	                                }
	                        }
	                } );

	                // Fragment hidden handler to uncheck when going backwards
	                reveal.on( 'fragmenthidden', event => {
	                        const fragment = event.fragment;
	                        if( fragment && fragment.classList.contains('smartart__checklist-item') ) {
	                                const checkbox = fragment.querySelector('.smartart__checklist-checkbox');
	                                if( checkbox ) {
	                                        checkbox.checked = false;
	                                }
	                        }
	                } );

	                // Defer processing until reveal.js signals ready
	        }
	};

	return SmartArtPlugin;
}));
