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
        LINED: 'lined',
        HERO: 'hero',
        CHECKLIST: 'checklist',
        ROADMAP: 'roadmap',
        PRICING: 'pricing',
        STATS: 'stats'
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
   HERO LAYOUT - BOOTSTRAP-STYLE HERO SECTIONS
   ================================================ */

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
        background-image: url('data:image/svg+xml,%3csvg viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg"%3e%3cpath d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"/%3e%3c/svg%3e');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 16px;
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
        let cta = '';
        let cta2 = '';
        const itemSegments = [];

        if( firstItemCandidate ) {
                const sanitizedFirst = firstItemCandidate.replace( /^[-*+]\s+/, '' );
                const introMatch = sanitizedFirst.match( /^(?:intro|summary|description)\s*:\s*(.+)$/i );
                const imageMatch = sanitizedFirst.match( /^image\s*:\s*(.+)$/i );
                const ctaMatch = sanitizedFirst.match( /^cta\s*:\s*(.+)$/i );
                const cta2Match = sanitizedFirst.match( /^cta2\s*:\s*(.+)$/i );

                if( introMatch ) {
                        intro = introMatch[ 1 ].trim();
                }
                else if( imageMatch ) {
                        image = imageMatch[ 1 ].trim();
                }
                else if( ctaMatch ) {
                        cta = ctaMatch[ 1 ].trim();
                }
                else if( cta2Match ) {
                        cta2 = cta2Match[ 1 ].trim();
                }
                else {
                        itemSegments.push( sanitizedFirst );
                }
        }

        detailLines.forEach( line => {
                // For checklist layout, preserve checkbox markers
                let sanitized;
                if( layout === 'checklist' ) {
                        sanitized = line.replace( /^[-*+]\s+/, '' );
                } else {
                        sanitized = line.replace( /^[-*+]\s+/, '' );
                }

                const introMatch = sanitized.match( /^(?:intro|summary|description)\s*:\s*(.+)$/i );
                const imageMatch = sanitized.match( /^image\s*:\s*(.+)$/i );
                const ctaMatch = sanitized.match( /^cta\s*:\s*(.+)$/i );
                const cta2Match = sanitized.match( /^cta2\s*:\s*(.+)$/i );

                if( introMatch ) {
                        intro = introMatch[ 1 ].trim();
                        return;
                }
                if( imageMatch ) {
                        image = imageMatch[ 1 ].trim();
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

                itemSegments.push( sanitized );
        } );

        const rawItems = itemSegments
                .flatMap( segment => splitSegment( segment, layout ) )
                .map( segment => segment.trim() )
                .filter( Boolean );

        const items = rawItems.map( ( raw, index ) => parseItem( raw, index, layout ) ).filter( Boolean );

        // For HERO layout, we don't require items (hero content can be just heading, intro, image, and CTAs)
        if( layout !== 'hero' && items.length === 0 ) {
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
                cta,
                cta2
        };
}

function splitSegment( segment, layout ) {
        const cleaned = segment.trim();
        if( !cleaned ) return [];

        if( layout === 'checklist' ) {
                // For checklist, each item is a single line (no splitting)
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

function parseItem( raw, index, layout ) {
        const item = {
                title: '',
                description: '',
                icon: '',
                ctaLabel: '',
                ctaUrl: '',
                checked: false,
                featured: false,
                price: '',
                features: [],
                value: '',
                iconColor: ''
        };

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
        if( !item.icon && layout !== 'lined' && layout !== 'checklist' ) item.icon = defaultIcon( index );

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
        container.className = 'smartart';
        container.dataset.layout = 'hero';
        container.dataset.smartartGenerated = 'true';

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

        data.items.forEach( ( item, index ) => {
                const label = document.createElement( 'label' );
                label.className = 'smartart__checklist-item';

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

function buildSmartArt( data ) {
        const layout = data.layout || orientationToLayout( data.orientation );

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

                const smartArt = buildSmartArt( parsed );

                // Replace the first element and remove the rest
                element.replaceWith( smartArt );
                elementsToReplace.slice( 1 ).forEach( el => el.remove() );
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
