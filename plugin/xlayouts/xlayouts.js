/**
 * Xlayouts - Advanced Grid System for Reveal.js
 * Version: 1.0.0
 * Author: Created for reveal.js presentations
 * Description: Bootstrap-inspired grid system optimized for presentations
 */

(function() {
    'use strict';

    const Plugin = {
        id: 'xlayouts',
        
        // Default configuration
        config: {
            enableAnimations: true,
            enableResponsive: true,
            defaultGutter: 'md',
            containerMaxWidth: '1200px',
            breakpoints: {
                sm: 576,
                md: 768,
                lg: 992,
                xl: 1200,
                xxl: 1400
            },
            animationDuration: 600,
            enableDebugGrid: false
        },

        init: function(reveal) {
            this.Reveal = reveal;
            
            // Merge user config with defaults
            const userConfig = reveal.getConfig().xlayouts || {};
            this.config = { ...this.config, ...userConfig };
            
            // Initialize components
            this.injectStyles();
            this.processSlides();
            this.setupEventListeners();
            this.registerHelpers();
            
            // Add debug mode if enabled
            if (this.config.enableDebugGrid) {
                this.enableDebugMode();
            }
            
            return Promise.resolve();
        },

        /**
         * Inject comprehensive CSS styles
         */
        injectStyles: function() {
            const styleId = 'xlayouts-styles';
            
            // Don't inject if already exists
            if (document.getElementById(styleId)) {
                return;
            }

            const styles = `
                /* ============================================
                   XLAYOUTS CORE STYLES
                   ============================================ */
                
                /* Reset for grid children */
                .reveal .xl-container *,
                .reveal .xl-grid *,
                .reveal [class*="xl-col"] * {
                    box-sizing: border-box;
                }
                
                /* ============================================
                   CONTAINERS
                   ============================================ */
                
                .reveal .xl-container {
                    width: 100%;
                    padding-right: var(--xl-gutter-x, 1rem);
                    padding-left: var(--xl-gutter-x, 1rem);
                    margin-right: auto;
                    margin-left: auto;
                    max-width: ${this.config.containerMaxWidth};
                }
                
                .reveal .xl-container-fluid {
                    width: 100%;
                    padding-right: var(--xl-gutter-x, 1rem);
                    padding-left: var(--xl-gutter-x, 1rem);
                }
                
                .reveal .xl-container-full {
                    width: 100%;
                    max-width: 100%;
                }
                
                /* ============================================
                   GRID SYSTEM
                   ============================================ */
                
                .reveal .xl-grid {
                    display: grid;
                    gap: var(--xl-gap, 1.5rem);
                    width: 100%;
                }
                
                /* Grid Templates */
                .reveal .xl-grid-1 { grid-template-columns: 1fr; }
                .reveal .xl-grid-2 { grid-template-columns: repeat(2, 1fr); }
                .reveal .xl-grid-3 { grid-template-columns: repeat(3, 1fr); }
                .reveal .xl-grid-4 { grid-template-columns: repeat(4, 1fr); }
                .reveal .xl-grid-5 { grid-template-columns: repeat(5, 1fr); }
                .reveal .xl-grid-6 { grid-template-columns: repeat(6, 1fr); }
                .reveal .xl-grid-12 { grid-template-columns: repeat(12, 1fr); }
                
                /* Auto-fit grids */
                .reveal .xl-grid-auto {
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                }
                
                .reveal .xl-grid-auto-sm {
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                }
                
                .reveal .xl-grid-auto-lg {
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                }
                
                /* ============================================
                   COLUMN SYSTEM (12-column based)
                   ============================================ */
                
                .reveal .xl-row {
                    display: grid;
                    grid-template-columns: repeat(12, 1fr);
                    gap: var(--xl-gap, 1.5rem);
                    width: 100%;
                }
                
                /* Column spans */
                .reveal .xl-col { grid-column: span 12; }
                .reveal .xl-col-1 { grid-column: span 1; }
                .reveal .xl-col-2 { grid-column: span 2; }
                .reveal .xl-col-3 { grid-column: span 3; }
                .reveal .xl-col-4 { grid-column: span 4; }
                .reveal .xl-col-5 { grid-column: span 5; }
                .reveal .xl-col-6 { grid-column: span 6; }
                .reveal .xl-col-7 { grid-column: span 7; }
                .reveal .xl-col-8 { grid-column: span 8; }
                .reveal .xl-col-9 { grid-column: span 9; }
                .reveal .xl-col-10 { grid-column: span 10; }
                .reveal .xl-col-11 { grid-column: span 11; }
                .reveal .xl-col-12 { grid-column: span 12; }
                
                /* Column offsets */
                .reveal .xl-offset-1 { grid-column-start: 2; }
                .reveal .xl-offset-2 { grid-column-start: 3; }
                .reveal .xl-offset-3 { grid-column-start: 4; }
                .reveal .xl-offset-4 { grid-column-start: 5; }
                .reveal .xl-offset-5 { grid-column-start: 6; }
                .reveal .xl-offset-6 { grid-column-start: 7; }
                
                /* ============================================
                   PREDEFINED LAYOUTS
                   ============================================ */
                
                /* Sidebar layouts */
                .reveal .xl-sidebar-left {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: var(--xl-gap, 2rem);
                }
                
                .reveal .xl-sidebar-right {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: var(--xl-gap, 2rem);
                }
                
                /* Focus layout */
                .reveal .xl-focus {
                    display: grid;
                    grid-template-columns: 1fr 3fr 1fr;
                    gap: var(--xl-gap, 1.5rem);
                }
                
                /* Comparison layout */
                .reveal .xl-comparison {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--xl-gap, 2rem);
                    align-items: start;
                }
                
                /* Timeline layout */
                .reveal .xl-timeline {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: var(--xl-gap, 1rem);
                    position: relative;
                    padding-top: 3rem;
                }
                
                .reveal .xl-timeline::before {
                    content: '';
                    position: absolute;
                    top: 1.5rem;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: currentColor;
                    opacity: 0.3;
                }
                
                .reveal .xl-timeline > * {
                    position: relative;
                }
                
                .reveal .xl-timeline > *::before {
                    content: '';
                    position: absolute;
                    top: -1.5rem;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: var(--r-main-color);
                    border: 2px solid var(--r-background-color);
                }
                
                /* Stats/Metrics layout */
                .reveal .xl-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: var(--xl-gap, 2rem);
                    text-align: center;
                }
                
                .reveal .xl-stats > * {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                
                .reveal .xl-stats .xl-stat-value {
                    font-size: 2.5em;
                    font-weight: bold;
                    line-height: 1.2;
                    margin-bottom: 0.25em;
                }
                
                .reveal .xl-stats .xl-stat-label {
                    font-size: 0.9em;
                    opacity: 0.8;
                }
                
                /* Matrix/Quadrant layout */
                .reveal .xl-matrix {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 1fr 1fr;
                    gap: var(--xl-gap, 2rem);
                    height: 60vh;
                    position: relative;
                }
                
                .reveal .xl-matrix::before,
                .reveal .xl-matrix::after {
                    content: '';
                    position: absolute;
                    background: currentColor;
                    opacity: 0.2;
                }
                
                .reveal .xl-matrix::before {
                    top: 50%;
                    left: 0;
                    right: 0;
                    height: 1px;
                }
                
                .reveal .xl-matrix::after {
                    left: 50%;
                    top: 0;
                    bottom: 0;
                    width: 1px;
                }
                
                /* Process/Steps layout */
                .reveal .xl-process {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: var(--xl-gap, 0.5rem);
                    align-items: center;
                }
                
                .reveal .xl-process > * {
                    position: relative;
                    padding: 1.5rem;
                    text-align: center;
                }
                
                .reveal .xl-process > *:not(:last-child)::after {
                    content: '→';
                    position: absolute;
                    right: -1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 1.5em;
                    opacity: 0.5;
                }
                
                /* ============================================
                   GUTTERS
                   ============================================ */
                
                .reveal .xl-g-0 { --xl-gap: 0; }
                .reveal .xl-g-1 { --xl-gap: 0.25rem; }
                .reveal .xl-g-2 { --xl-gap: 0.5rem; }
                .reveal .xl-g-3 { --xl-gap: 1rem; }
                .reveal .xl-g-4 { --xl-gap: 1.5rem; }
                .reveal .xl-g-5 { --xl-gap: 3rem; }
                
                /* Separate X and Y gutters */
                .reveal .xl-gx-0 { column-gap: 0; }
                .reveal .xl-gx-1 { column-gap: 0.25rem; }
                .reveal .xl-gx-2 { column-gap: 0.5rem; }
                .reveal .xl-gx-3 { column-gap: 1rem; }
                .reveal .xl-gx-4 { column-gap: 1.5rem; }
                .reveal .xl-gx-5 { column-gap: 3rem; }
                
                .reveal .xl-gy-0 { row-gap: 0; }
                .reveal .xl-gy-1 { row-gap: 0.25rem; }
                .reveal .xl-gy-2 { row-gap: 0.5rem; }
                .reveal .xl-gy-3 { row-gap: 1rem; }
                .reveal .xl-gy-4 { row-gap: 1.5rem; }
                .reveal .xl-gy-5 { row-gap: 3rem; }
                
                /* ============================================
                   ALIGNMENT UTILITIES
                   ============================================ */
                
                /* Justify content */
                .reveal .xl-justify-start { justify-content: start; }
                .reveal .xl-justify-center { justify-content: center; }
                .reveal .xl-justify-end { justify-content: end; }
                .reveal .xl-justify-between { justify-content: space-between; }
                .reveal .xl-justify-around { justify-content: space-around; }
                .reveal .xl-justify-evenly { justify-content: space-evenly; }
                
                /* Align items */
                .reveal .xl-align-start { align-items: start; }
                .reveal .xl-align-center { align-items: center; }
                .reveal .xl-align-end { align-items: end; }
                .reveal .xl-align-stretch { align-items: stretch; }
                
                /* Place items (for grid) */
                .reveal .xl-place-center { place-items: center; }
                .reveal .xl-place-start { place-items: start; }
                .reveal .xl-place-end { place-items: end; }
                
                /* Self alignment */
                .reveal .xl-self-start { align-self: start; }
                .reveal .xl-self-center { align-self: center; }
                .reveal .xl-self-end { align-self: end; }
                .reveal .xl-self-stretch { align-self: stretch; }
                
                /* ============================================
                   Z-INDEX SYSTEM
                   ============================================ */
                
                .reveal .xl-z-0 { z-index: 0; }
                .reveal .xl-z-10 { z-index: 10; }
                .reveal .xl-z-20 { z-index: 20; }
                .reveal .xl-z-30 { z-index: 30; }
                .reveal .xl-z-40 { z-index: 40; }
                .reveal .xl-z-50 { z-index: 50; }
                .reveal .xl-z-auto { z-index: auto; }
                .reveal .xl-z-modal { z-index: 1050; }
                .reveal .xl-z-popover { z-index: 1070; }
                .reveal .xl-z-tooltip { z-index: 1090; }
                
                /* ============================================
                   SPACING UTILITIES
                   ============================================ */
                
                /* Padding */
                .reveal .xl-p-0 { padding: 0; }
                .reveal .xl-p-1 { padding: 0.25rem; }
                .reveal .xl-p-2 { padding: 0.5rem; }
                .reveal .xl-p-3 { padding: 1rem; }
                .reveal .xl-p-4 { padding: 1.5rem; }
                .reveal .xl-p-5 { padding: 3rem; }
                
                /* Padding X-axis */
                .reveal .xl-px-0 { padding-left: 0; padding-right: 0; }
                .reveal .xl-px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
                .reveal .xl-px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
                .reveal .xl-px-3 { padding-left: 1rem; padding-right: 1rem; }
                .reveal .xl-px-4 { padding-left: 1.5rem; padding-right: 1.5rem; }
                .reveal .xl-px-5 { padding-left: 3rem; padding-right: 3rem; }
                
                /* Padding Y-axis */
                .reveal .xl-py-0 { padding-top: 0; padding-bottom: 0; }
                .reveal .xl-py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
                .reveal .xl-py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
                .reveal .xl-py-3 { padding-top: 1rem; padding-bottom: 1rem; }
                .reveal .xl-py-4 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
                .reveal .xl-py-5 { padding-top: 3rem; padding-bottom: 3rem; }
                
                /* Margin */
                .reveal .xl-m-0 { margin: 0; }
                .reveal .xl-m-1 { margin: 0.25rem; }
                .reveal .xl-m-2 { margin: 0.5rem; }
                .reveal .xl-m-3 { margin: 1rem; }
                .reveal .xl-m-4 { margin: 1.5rem; }
                .reveal .xl-m-5 { margin: 3rem; }
                .reveal .xl-m-auto { margin: auto; }
                
                /* Margin X-axis */
                .reveal .xl-mx-0 { margin-left: 0; margin-right: 0; }
                .reveal .xl-mx-1 { margin-left: 0.25rem; margin-right: 0.25rem; }
                .reveal .xl-mx-2 { margin-left: 0.5rem; margin-right: 0.5rem; }
                .reveal .xl-mx-3 { margin-left: 1rem; margin-right: 1rem; }
                .reveal .xl-mx-4 { margin-left: 1.5rem; margin-right: 1.5rem; }
                .reveal .xl-mx-5 { margin-left: 3rem; margin-right: 3rem; }
                .reveal .xl-mx-auto { margin-left: auto; margin-right: auto; }
                
                /* Margin Y-axis */
                .reveal .xl-my-0 { margin-top: 0; margin-bottom: 0; }
                .reveal .xl-my-1 { margin-top: 0.25rem; margin-bottom: 0.25rem; }
                .reveal .xl-my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
                .reveal .xl-my-3 { margin-top: 1rem; margin-bottom: 1rem; }
                .reveal .xl-my-4 { margin-top: 1.5rem; margin-bottom: 1.5rem; }
                .reveal .xl-my-5 { margin-top: 3rem; margin-bottom: 3rem; }
                .reveal .xl-my-auto { margin-top: auto; margin-bottom: auto; }
                
                /* ============================================
                   DISPLAY UTILITIES
                   ============================================ */
                
                .reveal .xl-d-none { display: none !important; }
                .reveal .xl-d-block { display: block !important; }
                .reveal .xl-d-inline { display: inline !important; }
                .reveal .xl-d-inline-block { display: inline-block !important; }
                .reveal .xl-d-grid { display: grid !important; }
                .reveal .xl-d-flex { display: flex !important; }
                
                /* ============================================
                   FLEX UTILITIES
                   ============================================ */
                
                .reveal .xl-flex-row { flex-direction: row; }
                .reveal .xl-flex-column { flex-direction: column; }
                .reveal .xl-flex-wrap { flex-wrap: wrap; }
                .reveal .xl-flex-nowrap { flex-wrap: nowrap; }
                .reveal .xl-flex-1 { flex: 1; }
                .reveal .xl-flex-auto { flex: auto; }
                .reveal .xl-flex-none { flex: none; }
                .reveal .xl-flex-grow-1 { flex-grow: 1; }
                .reveal .xl-flex-shrink-1 { flex-shrink: 1; }
                
                /* ============================================
                   WIDTH & HEIGHT UTILITIES
                   ============================================ */
                
                .reveal .xl-w-25 { width: 25%; }
                .reveal .xl-w-50 { width: 50%; }
                .reveal .xl-w-75 { width: 75%; }
                .reveal .xl-w-100 { width: 100%; }
                .reveal .xl-w-auto { width: auto; }
                
                .reveal .xl-h-25 { height: 25%; }
                .reveal .xl-h-50 { height: 50%; }
                .reveal .xl-h-75 { height: 75%; }
                .reveal .xl-h-100 { height: 100%; }
                .reveal .xl-h-auto { height: auto; }
                
                .reveal .xl-min-h-100 { min-height: 100%; }
                .reveal .xl-vh-100 { height: 100vh; }
                
                /* ============================================
                   TEXT UTILITIES
                   ============================================ */
                
                .reveal .xl-text-left { text-align: left; }
                .reveal .xl-text-center { text-align: center; }
                .reveal .xl-text-right { text-align: right; }
                .reveal .xl-text-justify { text-align: justify; }
                
                .reveal .xl-text-uppercase { text-transform: uppercase; }
                .reveal .xl-text-lowercase { text-transform: lowercase; }
                .reveal .xl-text-capitalize { text-transform: capitalize; }
                
                .reveal .xl-font-weight-light { font-weight: 300; }
                .reveal .xl-font-weight-normal { font-weight: 400; }
                .reveal .xl-font-weight-bold { font-weight: 700; }
                
                /* ============================================
                   POSITION UTILITIES
                   ============================================ */
                
                .reveal .xl-position-static { position: static; }
                .reveal .xl-position-relative { position: relative; }
                .reveal .xl-position-absolute { position: absolute; }
                .reveal .xl-position-fixed { position: fixed; }
                .reveal .xl-position-sticky { position: sticky; }
                
                /* ============================================
                   BORDER UTILITIES
                   ============================================ */
                
                .reveal .xl-border { border: 1px solid var(--r-main-color, #333); }
                .reveal .xl-border-0 { border: 0; }
                .reveal .xl-border-top { border-top: 1px solid var(--r-main-color, #333); }
                .reveal .xl-border-end { border-right: 1px solid var(--r-main-color, #333); }
                .reveal .xl-border-bottom { border-bottom: 1px solid var(--r-main-color, #333); }
                .reveal .xl-border-start { border-left: 1px solid var(--r-main-color, #333); }
                
                .reveal .xl-rounded { border-radius: 0.25rem; }
                .reveal .xl-rounded-0 { border-radius: 0; }
                .reveal .xl-rounded-1 { border-radius: 0.2rem; }
                .reveal .xl-rounded-2 { border-radius: 0.25rem; }
                .reveal .xl-rounded-3 { border-radius: 0.3rem; }
                .reveal .xl-rounded-circle { border-radius: 50%; }
                .reveal .xl-rounded-pill { border-radius: 50rem; }
                
                /* ============================================
                   ANIMATION CLASSES
                   ============================================ */
                
                .reveal .xl-animate-fade-in {
                    animation: xlFadeIn ${this.config.animationDuration}ms ease-out;
                }
                
                .reveal .xl-animate-slide-up {
                    animation: xlSlideUp ${this.config.animationDuration}ms ease-out;
                }
                
                .reveal .xl-animate-slide-left {
                    animation: xlSlideLeft ${this.config.animationDuration}ms ease-out;
                }
                
                .reveal .xl-animate-slide-right {
                    animation: xlSlideRight ${this.config.animationDuration}ms ease-out;
                }
                
                .reveal .xl-animate-scale {
                    animation: xlScale ${this.config.animationDuration}ms ease-out;
                }
                
                .reveal .xl-animate-stagger > * {
                    animation: xlFadeIn ${this.config.animationDuration}ms ease-out backwards;
                }
                
                .reveal .xl-animate-stagger > *:nth-child(1) { animation-delay: 100ms; }
                .reveal .xl-animate-stagger > *:nth-child(2) { animation-delay: 200ms; }
                .reveal .xl-animate-stagger > *:nth-child(3) { animation-delay: 300ms; }
                .reveal .xl-animate-stagger > *:nth-child(4) { animation-delay: 400ms; }
                .reveal .xl-animate-stagger > *:nth-child(5) { animation-delay: 500ms; }
                .reveal .xl-animate-stagger > *:nth-child(6) { animation-delay: 600ms; }
                
                /* Animations with fragments */
                .reveal .fragment.xl-fade-in {
                    opacity: 0;
                }
                
                .reveal .fragment.xl-fade-in.visible {
                    opacity: 1;
                    animation: xlFadeIn ${this.config.animationDuration}ms ease-out;
                }
                
                @keyframes xlFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes xlSlideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes xlSlideLeft {
                    from { transform: translateX(30px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes xlSlideRight {
                    from { transform: translateX(-30px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes xlScale {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                
                /* ============================================
                   CARD COMPONENT
                   ============================================ */
                
                .reveal .xl-card {
                    padding: 1.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    backdrop-filter: blur(10px);
                }
                
                .reveal .xl-card-highlight {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid var(--r-main-color);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                }
                
                .reveal .xl-card-header {
                    font-size: 1.2em;
                    font-weight: bold;
                    margin-bottom: 0.5em;
                    padding-bottom: 0.5em;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .reveal .xl-card-body {
                    padding: 0.5rem 0;
                }
                
                .reveal .xl-card-footer {
                    margin-top: 1rem;
                    padding-top: 0.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                /* ============================================
                   RESPONSIVE UTILITIES
                   ============================================ */
                
                /* Portrait mode adjustments */
                @media (orientation: portrait) {
                    .reveal .xl-portrait-stack > * {
                        grid-column: span 12 !important;
                    }
                    
                    .reveal .xl-portrait-hide {
                        display: none !important;
                    }
                }
                
                /* Landscape mode adjustments */
                @media (orientation: landscape) {
                    .reveal .xl-landscape-hide {
                        display: none !important;
                    }
                }
                
                /* Small screens */
                @media (max-width: 768px) {
                    .reveal .xl-sm-stack {
                        grid-template-columns: 1fr !important;
                    }
                    
                    .reveal .xl-sm-hide {
                        display: none !important;
                    }
                }
                
                /* ============================================
                   DEBUG MODE
                   ============================================ */
                
                .xl-debug * {
                    outline: 1px dashed rgba(255, 0, 0, 0.3);
                }
                
                .xl-debug .xl-container,
                .xl-debug .xl-grid,
                .xl-debug .xl-row {
                    outline: 2px solid rgba(0, 255, 0, 0.5);
                    position: relative;
                }
                
                .xl-debug .xl-container::before,
                .xl-debug .xl-grid::before,
                .xl-debug .xl-row::before {
                    content: attr(data-xl-debug);
                    position: absolute;
                    top: 0;
                    left: 0;
                    background: rgba(255, 255, 0, 0.9);
                    color: black;
                    padding: 2px 5px;
                    font-size: 11px;
                    z-index: 10000;
                    pointer-events: none;
                }
            `;

            const styleSheet = document.createElement('style');
            styleSheet.id = styleId;
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        },

        /**
         * Process all slides and enhance grid elements
         */
        processSlides: function() {
            const slides = this.Reveal.getSlides();
            
            slides.forEach((slide, index) => {
                // Process data attributes
                this.processDataAttributes(slide);
                
                // Auto-enhance semantic layouts
                this.enhanceSemanticLayouts(slide);
                
                // Setup animations
                if (this.config.enableAnimations) {
                    this.setupAnimations(slide);
                }
            });
        },

        /**
         * Process data-xl attributes
         */
        processDataAttributes: function(element) {
            // Process data-xl-grid
            const gridElements = element.querySelectorAll('[data-xl-grid]');
            gridElements.forEach(grid => {
                const gridType = grid.getAttribute('data-xl-grid');
                grid.classList.add('xl-grid', `xl-grid-${gridType}`);
                
                // Add debug info if enabled
                if (this.config.enableDebugGrid) {
                    grid.setAttribute('data-xl-debug', `Grid: ${gridType}`);
                }
            });

            // Process data-xl-col
            const colElements = element.querySelectorAll('[data-xl-col]');
            colElements.forEach(col => {
                const colSize = col.getAttribute('data-xl-col');
                col.classList.add(`xl-col-${colSize}`);
            });

            // Process data-xl-layout
            const layoutElements = element.querySelectorAll('[data-xl-layout]');
            layoutElements.forEach(layout => {
                const layoutType = layout.getAttribute('data-xl-layout');
                layout.classList.add(`xl-${layoutType}`);
                
                // Add specific enhancements based on layout type
                if (layoutType === 'stats') {
                    this.enhanceStatsLayout(layout);
                } else if (layoutType === 'timeline') {
                    this.enhanceTimelineLayout(layout);
                } else if (layoutType === 'comparison') {
                    this.enhanceComparisonLayout(layout);
                }
            });

            // Process data-xl-animate
            const animateElements = element.querySelectorAll('[data-xl-animate]');
            animateElements.forEach(el => {
                const animationType = el.getAttribute('data-xl-animate');
                
                if (animationType === 'stagger') {
                    el.classList.add('xl-animate-stagger');
                    // Add fragments to children if not already present
                    Array.from(el.children).forEach((child, i) => {
                        if (!child.classList.contains('fragment')) {
                            child.classList.add('fragment', 'xl-fade-in');
                            child.setAttribute('data-fragment-index', i);
                        }
                    });
                } else {
                    el.classList.add(`xl-animate-${animationType}`);
                }
            });

            // Process responsive attributes
            const responsiveElements = element.querySelectorAll('[data-xl-responsive]');
            responsiveElements.forEach(el => {
                const responsiveType = el.getAttribute('data-xl-responsive');
                el.classList.add(`xl-${responsiveType}`);
            });
        },

        /**
         * Enhance semantic layouts with additional functionality
         */
        enhanceSemanticLayouts: function(slide) {
            // Auto-detect comparison tables
            const comparisons = slide.querySelectorAll('.xl-comparison');
            comparisons.forEach(comp => {
                const items = comp.children;
                if (items.length > 0) {
                    // Find and highlight the recommended item
                    Array.from(items).forEach(item => {
                        if (item.hasAttribute('data-xl-highlight') || 
                            item.textContent.toLowerCase().includes('recommended')) {
                            item.classList.add('xl-card-highlight');
                        }
                    });
                }
            });
        },

        /**
         * Enhance stats layout with number animations
         */
        enhanceStatsLayout: function(container) {
            const stats = container.querySelectorAll('[data-xl-stat-value]');
            
            stats.forEach(stat => {
                const value = stat.getAttribute('data-xl-stat-value');
                const animated = stat.getAttribute('data-xl-animated') !== 'false';
                
                if (animated && value) {
                    // Store original value for animation
                    stat.setAttribute('data-xl-target', value);
                    
                    // Create stat structure
                    const wrapper = document.createElement('div');
                    wrapper.innerHTML = `
                        <div class="xl-stat-value">${value}</div>
                        <div class="xl-stat-label">${stat.textContent}</div>
                    `;
                    
                    stat.innerHTML = '';
                    stat.appendChild(wrapper);
                }
            });
        },

        /**
         * Enhance timeline layout
         */
        enhanceTimelineLayout: function(container) {
            const items = container.querySelectorAll('[data-xl-timeline-date]');
            
            items.forEach(item => {
                const date = item.getAttribute('data-xl-timeline-date');
                if (date && !item.querySelector('.xl-timeline-date')) {
                    const dateEl = document.createElement('div');
                    dateEl.className = 'xl-timeline-date';
                    dateEl.textContent = date;
                    dateEl.style.fontSize = '0.8em';
                    dateEl.style.opacity = '0.7';
                    dateEl.style.marginBottom = '0.5em';
                    item.insertBefore(dateEl, item.firstChild);
                }
            });
        },

        /**
         * Enhance comparison layout
         */
        enhanceComparisonLayout: function(container) {
            const items = container.querySelectorAll('[data-xl-comparison-item]');
            
            items.forEach(item => {
                if (!item.classList.contains('xl-card')) {
                    item.classList.add('xl-card');
                }
                
                // Check for highlight
                if (item.hasAttribute('data-xl-highlight')) {
                    item.classList.add('xl-card-highlight');
                }
                
                // Add header if title exists
                const title = item.querySelector('h3, h4, [data-xl-title]');
                if (title && !title.classList.contains('xl-card-header')) {
                    title.classList.add('xl-card-header');
                }
            });
        },

        /**
         * Setup animations for elements
         */
        setupAnimations: function(slide) {
            // Number counter animations for stats
            const statValues = slide.querySelectorAll('.xl-stats [data-xl-target]');
            
            if (statValues.length > 0) {
                // Create intersection observer for triggering animations
                const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.animateNumber(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });
                
                statValues.forEach(stat => observer.observe(stat));
            }
        },

        /**
         * Animate number counting up
         */
        animateNumber: function(element) {
            const target = element.getAttribute('data-xl-target');
            const valueEl = element.querySelector('.xl-stat-value');
            
            if (!valueEl || !target) return;
            
            // Parse target value
            const isPercentage = target.includes('%');
            const isDecimal = target.includes('.');
            const numericValue = parseFloat(target.replace(/[^0-9.-]/g, ''));
            
            if (isNaN(numericValue)) {
                valueEl.textContent = target;
                return;
            }
            
            // Animate
            const duration = this.config.animationDuration;
            const start = 0;
            const increment = numericValue / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(timer);
                }
                
                let display = isDecimal ? current.toFixed(1) : Math.floor(current);
                if (isPercentage) display += '%';
                if (target.includes('$')) display = '$' + display;
                if (target.includes('K')) display += 'K';
                if (target.includes('M')) display += 'M';
                
                valueEl.textContent = display;
            }, 16);
        },

        /**
         * Setup event listeners
         */
        setupEventListeners: function() {
            // Re-process on slide change
            this.Reveal.on('slidechanged', event => {
                this.processDataAttributes(event.currentSlide);
            });
            
            // Handle fragment animations
            this.Reveal.on('fragmentshown', event => {
                if (event.fragment.classList.contains('xl-fade-in')) {
                    event.fragment.classList.add('visible');
                }
            });
            
            this.Reveal.on('fragmenthidden', event => {
                if (event.fragment.classList.contains('xl-fade-in')) {
                    event.fragment.classList.remove('visible');
                }
            });
        },

        /**
         * Register helper functions for template usage
         */
        registerHelpers: function() {
            // Make utilities available globally for dynamic content
            window.Xlayouts = {
                createGrid: (columns, gap = 'md') => {
                    return `xl-grid xl-grid-${columns} xl-g-${gap}`;
                },
                
                createColumn: (span, offset = 0) => {
                    let classes = `xl-col-${span}`;
                    if (offset > 0) classes += ` xl-offset-${offset}`;
                    return classes;
                },
                
                createCard: (highlight = false) => {
                    return highlight ? 'xl-card xl-card-highlight' : 'xl-card';
                },
                
                createStats: (stats) => {
                    let html = '<div class="xl-stats">';
                    stats.forEach(stat => {
                        html += `
                            <div data-xl-stat-value="${stat.value}">
                                ${stat.label}
                            </div>
                        `;
                    });
                    html += '</div>';
                    return html;
                },
                
                createComparison: (items) => {
                    let html = '<div class="xl-comparison">';
                    items.forEach(item => {
                        html += `
                            <div class="xl-card" ${item.highlight ? 'data-xl-highlight' : ''}>
                                <div class="xl-card-header">${item.title}</div>
                                <div class="xl-card-body">${item.content}</div>
                            </div>
                        `;
                    });
                    html += '</div>';
                    return html;
                }
            };
        },

        /**
         * Enable debug mode
         */
        enableDebugMode: function() {
            document.body.classList.add('xl-debug');
            
            // Add debug panel
            const panel = document.createElement('div');
            panel.id = 'xl-debug-panel';
            panel.style.cssText = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 12px;
                z-index: 10000;
                max-width: 200px;
            `;
            
            panel.innerHTML = `
                <strong>Xlayouts Debug</strong><br>
                <span id="xl-debug-info">Grid system active</span><br>
                <button onclick="document.body.classList.toggle('xl-debug')">Toggle Outlines</button>
            `;
            
            document.body.appendChild(panel);
            
            // Update debug info on slide change
            this.Reveal.on('slidechanged', event => {
                const slide = event.currentSlide;
                const grids = slide.querySelectorAll('[class*="xl-grid"]').length;
                const cols = slide.querySelectorAll('[class*="xl-col"]').length;
                document.getElementById('xl-debug-info').textContent = 
                    `Grids: ${grids}, Columns: ${cols}`;
            });
        }
    };

    // Register the plugin with Reveal.js
    window.XlayoutsPlugin = Plugin;

    if (typeof window.Reveal !== 'undefined') {
        window.Reveal.registerPlugin('xlayouts', Plugin);
    }

})();
