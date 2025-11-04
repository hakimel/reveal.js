/**
 * XBackground Plugin for Reveal.js
 * Enables React-based animated backgrounds using React Portals
 * 
 * @author Your Name
 * @version 1.0.0
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createPortal } from 'react-dom';

// Import background components (you'll need to install/create these)
import { BackgroundRegistry } from './plugin/backgrounds/index.js';

const Plugin = () => {
  let deck;
  let reactRoot = null;
  let activePortals = new Map();
  let backgroundInstances = new Map();
  let layerEl = null; // global fullscreen layer for all xbackgrounds

  // Default configuration
  const defaultConfig = {
    selector: '[data-xbackground]',
    transition: 'fade',
    transitionDuration: 1000,
    lazy: true, // Lazy load backgrounds
    preload: 1, // Number of slides to preload ahead
    debug: false,
    baseColor: 'transparent', // fallback fill behind semi-transparent effects
    // Automatically set Reveal margin=0 for slides that use xbackgrounds
    // to remove letterboxing and ensure true full-bleed visuals.
    autoMarginZero: true
  };

  let config = {};
  let defaultMargin = 0.04;

  /**
   * Initialize the plugin
   */
  function init(reveal) {
    deck = reveal;
    config = { ...defaultConfig, ...deck.getConfig().xbackground };
    // Capture the deck's default margin so we can restore it when needed
    const deckConfig = deck.getConfig();
    defaultMargin = typeof deckConfig.margin === 'number' ? deckConfig.margin : defaultMargin;

    if (config.debug) {
      console.log('XBackground Plugin initialized with config:', config);
    }

  // Create global fullscreen layer and React root container
  injectStyles();
  createLayer();
    createReactContainer();

    // Process all slides with xbackground
    processSlides();

    // Set up event listeners
    deck.on('slidechanged', onSlideChanged);
    deck.on('ready', onReady);
    deck.on('overview-shown', onOverviewShown);
    deck.on('overview-hidden', onOverviewHidden);

    return Promise.resolve();
  }

  /**
   * Inject minimal CSS so backgrounds fill the viewport and content sits above
   */
  function injectStyles() {
    if (document.getElementById('xbackground-style')) return;
    const style = document.createElement('style');
    style.id = 'xbackground-style';
    style.textContent = `
      /* Global layer already positioned via JS; ensure containers fill layer */
      .xbackground-container { width: 100%; height: 100%; }
      .xbackground-wrapper { width: 100%; height: 100%; }
      /* Ensure slide content stays above backgrounds */
      .reveal .slides { z-index: 2; }
      #xbackground-layer { z-index: 1; }
      .reveal .backgrounds { z-index: 0; }
      .reveal section[data-xbackground] > * { position: relative; z-index: 2; }
    `;
    document.head.appendChild(style);
  }

  /**
   * Create a single, global fullscreen layer that sits outside transformed slides
   * so fixed positioning remains relative to the viewport and fills the screen.
   */
  function createLayer() {
    // Parent under the reveal root to stay within deck stacking context but outside .slides transforms
    const parent = (deck && deck.getRevealElement && deck.getRevealElement()) || document.body;
    layerEl = document.createElement('div');
    layerEl.id = 'xbackground-layer';
    Object.assign(layerEl.style, {
      position: 'fixed',
      // Inset to the viewport avoids rounding gaps and adapts to dynamic viewports
      inset: '0',
      zIndex: '1', // between reveal backgrounds (0) and slides (2)
      pointerEvents: 'none',
      overflow: 'hidden'
    });
    parent.appendChild(layerEl);
  }

  /**
   * Create the React root container
   */
  function createReactContainer() {
    // Create a hidden div for React root
    const container = document.createElement('div');
    container.id = 'xbackground-react-root';
    container.style.display = 'none';
    // Attach to DOM so it can be cleaned up on destroy
    (document.body || document.documentElement).appendChild(container);

    // Create React root
    reactRoot = ReactDOM.createRoot(container);
    
    // Render the portal manager
    reactRoot.render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(PortalManager, null)
      )
    );
  }

  function PortalManager() {
    const [portals, setPortals] = React.useState([]);

    React.useEffect(() => {
      // Store the setPortals function for external updates
      window.__xbackgroundSetPortals = setPortals;
      
      return () => {
        delete window.__xbackgroundSetPortals;
      };
    }, []);

    return React.createElement(
      React.Fragment,
      null,
      portals
    );
  }

  /**
   * Process all slides and prepare backgrounds
   */
  function processSlides() {
    const slides = deck.getSlides();
    
    slides.forEach((slide, index) => {
      const backgroundData = slide.getAttribute('data-xbackground');
      
      if (backgroundData) {
        try {
          const bgConfig = parseBackgroundConfig(backgroundData);
          prepareSlideBackground(slide, bgConfig, index);
        } catch (error) {
          console.error(`Error processing slide ${index} background:`, error);
        }
      }
    });
  }

  /**
   * Parse background configuration from data attribute
   */
  function parseBackgroundConfig(data) {
    // Support both JSON and simple string format
    if (data.startsWith('{')) {
      return JSON.parse(data);
    } else {
      // Simple format: "hyperspeed" or "aurora:slow"
      const [type, ...params] = data.split(':');
      return {
        type,
        config: params.length > 0 ? { preset: params[0] } : {}
      };
    }
  }

  /**
   * Prepare background for a slide
   */
  function prepareSlideBackground(slide, bgConfig, index) {
    // Create background container attached to global layer (not inside transformed slides)
    const bgContainer = document.createElement('div');
    bgContainer.className = 'xbackground-container';
    const slideBase = slide.getAttribute('data-background-color') || config.baseColor || 'transparent';
    bgContainer.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
      background: ${slideBase};
      opacity: 0;
      transition: opacity ${config.transitionDuration}ms ${config.transition};
    `;
    // Tag with slide index for debugging/inspection
    bgContainer.setAttribute('data-slide-index', String(index));
    // Append to global layer
    if (layerEl) layerEl.appendChild(bgContainer);
    
    // Store background configuration
    backgroundInstances.set(slide, {
      container: bgContainer,
      config: bgConfig,
      index: index,
      active: false,
      mounted: false
    });

    // If not lazy loading, mount immediately
    if (!config.lazy) {
      mountBackground(slide);
    }
  }

  /**
   * Mount a background component
  /**
   * Mount a background component
   */
  function mountBackground(slide) {
    const bgInstance = backgroundInstances.get(slide);
    if (!bgInstance || bgInstance.mounted) return;

    const { container, config: bgConfig } = bgInstance;
    const BackgroundComponent = BackgroundRegistry[bgConfig.type];

    if (!BackgroundComponent) {
      console.error(`Unknown background type: ${bgConfig.type}`);
      return;
    }

    const portalKey = `xbg-${bgInstance.index}`;

    const portal = createPortal(
      React.createElement(BackgroundWrapper, {
        component: BackgroundComponent,
        config: bgConfig.config,
        slideIndex: bgInstance.index,
        onMount: () => handleBackgroundMount(slide),
        onUnmount: () => handleBackgroundUnmount(slide)
      }),
      container,
      portalKey
    );

    // Store the portal
    activePortals.set(slide, portal);
    bgInstance.mounted = true;

    // Update React portals
    updatePortals();
  }

  function BackgroundWrapper({ component: Component, config, slideIndex, onMount, onUnmount }) {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      onMount();
      
      // Fade in after mount
      const id = requestAnimationFrame(() => {
        setIsVisible(true);
      });

      return () => {
        cancelAnimationFrame(id);
        onUnmount();
      };
    }, []);

    return React.createElement(
      'div',
      {
        className: 'xbackground-wrapper',
        style: {
          width: '100%',
          height: '100%',
          position: 'relative',
          top: 0,
          left: 0,
          pointerEvents: 'none'
        }
      },
      React.createElement(
        Component,
        Object.assign({}, config, { isVisible: isVisible, slideIndex: slideIndex })
      )
    );
  }

  /**
   * Unmount a background component
   */
  function unmountBackground(slide) {
    const bgInstance = backgroundInstances.get(slide);
    if (!bgInstance) return;
    activePortals.delete(slide);
    bgInstance.mounted = false;
    
    // Update React portals
    updatePortals();
  }

  /**
   * Update the portal list in React
   */
  function updatePortals() {
    if (window.__xbackgroundSetPortals) {
      const portalsArray = Array.from(activePortals.values());
      window.__xbackgroundSetPortals(portalsArray);
    }
  }

  /**
   * Handle background mount
   */
  function handleBackgroundMount(slide) {
    if (config.debug) {
      console.log('Background mounted for slide:', slide);
    }
  }

  /**
   * Handle background unmount
   */
  function handleBackgroundUnmount(slide) {
    if (config.debug) {
      console.log('Background unmounted for slide:', slide);
    }
  }

  /**
   * Handle slide change event
   */
  function onSlideChanged(event) {
    const { currentSlide, previousSlide } = event;

    // Deactivate previous slide background
    if (previousSlide) {
      deactivateBackground(previousSlide);
    }

    // Activate current slide background
    if (currentSlide) {
      activateBackground(currentSlide);
      // Auto-manage margin for xbackground slides to eliminate letterboxing
      applyMarginForSlide(currentSlide);

      // Preload upcoming slides if configured
      if (config.preload > 0) {
        preloadUpcomingBackgrounds(currentSlide);
      }
    }

    // Clean up distant slides if lazy loading
    if (config.lazy) {
      cleanupDistantBackgrounds(currentSlide);
    }
  }

  /**
   * Activate a slide's background
   */
  function activateBackground(slide) {
    const bgInstance = backgroundInstances.get(slide);
    if (!bgInstance) return;

    // Mount if not already mounted (lazy loading)
    if (!bgInstance.mounted) {
      mountBackground(slide);
    }

    // Fade in the background
    setTimeout(() => {
      bgInstance.container.style.opacity = '1';
      bgInstance.active = true;
    }, 50);
  }

  /**
   * Deactivate a slide's background
   */
  function deactivateBackground(slide) {
    const bgInstance = backgroundInstances.get(slide);
    if (!bgInstance) return;

    bgInstance.container.style.opacity = '0';
    bgInstance.active = false;
  }

  /**
   * Preload upcoming slide backgrounds
   */
  function preloadUpcomingBackgrounds(currentSlide) {
    const slides = deck.getSlides();
    const currentIndex = slides.indexOf(currentSlide);

    for (let i = 1; i <= config.preload; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex < slides.length) {
        const nextSlide = slides[nextIndex];
        const bgInstance = backgroundInstances.get(nextSlide);
        
        if (bgInstance && !bgInstance.mounted) {
          mountBackground(nextSlide);
        }
      }
    }
  }

  /**
   * Clean up distant slide backgrounds to save memory
   */
  function cleanupDistantBackgrounds(currentSlide) {
    const slides = deck.getSlides();
    const currentIndex = slides.indexOf(currentSlide);
    const keepRange = config.preload + 1;

    backgroundInstances.forEach((bgInstance, slide) => {
      const slideIndex = slides.indexOf(slide);
      const distance = Math.abs(slideIndex - currentIndex);

      if (distance > keepRange && bgInstance.mounted && !bgInstance.active) {
        unmountBackground(slide);
      }
    });
  }

  /**
   * Handle ready event
   */
  function onReady() {
    // Activate the first slide's background
    const currentSlide = deck.getCurrentSlide();
    if (currentSlide) {
      activateBackground(currentSlide);
      // Apply initial margin settings for current slide
      applyMarginForSlide(currentSlide);
    }
  }

  /**
   * Handle overview shown event
   */
  function onOverviewShown() {
    // Optionally show all backgrounds in overview mode
    if (config.showInOverview) {
      backgroundInstances.forEach((bgInstance, slide) => {
        if (!bgInstance.mounted) {
          mountBackground(slide);
        }
        bgInstance.container.style.opacity = '0.3'; // Dimmed in overview
      });
    }
  }

  /**
   * Handle overview hidden event
   */
  function onOverviewHidden() {
    // Restore normal background state
    const currentSlide = deck.getCurrentSlide();
    backgroundInstances.forEach((bgInstance, slide) => {
      if (slide === currentSlide) {
        bgInstance.container.style.opacity = '1';
      } else {
        bgInstance.container.style.opacity = '0';
      }
    });
  }

  /**
   * Destroy the plugin
   */
  function destroy() {
    // Remove event listeners
    deck.off('slidechanged', onSlideChanged);
    deck.off('ready', onReady);
    deck.off('overview-shown', onOverviewShown);
    deck.off('overview-hidden', onOverviewHidden);

    // Unmount all backgrounds
    backgroundInstances.forEach((bgInstance, slide) => {
      if (bgInstance.mounted) {
        unmountBackground(slide);
      }
      bgInstance.container.remove();
    });

    // Clean up React root
    if (reactRoot) {
      reactRoot.unmount();
      document.getElementById('xbackground-react-root')?.remove();
    }

    // Remove global layer
    if (layerEl && layerEl.parentNode) {
      layerEl.parentNode.removeChild(layerEl);
      layerEl = null;
    }

    // Clear maps
    backgroundInstances.clear();
    activePortals.clear();
  }

  /**
   * Apply margin=0 for slides using xbackgrounds (or explicitly flagged),
   * and restore the deck's default margin otherwise. Forces a layout refresh
   * so Reveal recalculates sizes immediately.
   */
  function applyMarginForSlide(slide) {
    if (!config.autoMarginZero) return;
    const hasXBackground = slide && slide.hasAttribute('data-xbackground');
    const explicitZero = slide && (slide.hasAttribute('data-margin-zero') || slide.getAttribute('data-margin-zero') === 'true');
    const targetMargin = (hasXBackground || explicitZero) ? 0 : defaultMargin;
    // Only reconfigure if different to avoid unnecessary layout churn
    if (deck.getConfig().margin !== targetMargin) {
      deck.configure({ margin: targetMargin });
      if (typeof deck.layout === 'function') {
        // Use rAF to ensure DOM has applied previous changes first
        requestAnimationFrame(() => deck.layout());
      }
    }
  }

  return {
    id: 'xbackground',
    init,
    destroy,
    // Expose API methods
    activateBackground,
    deactivateBackground,
    mountBackground,
    unmountBackground
  };
};

export default Plugin;
