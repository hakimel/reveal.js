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

  // Default configuration
  const defaultConfig = {
    selector: '[data-xbackground]',
    transition: 'fade',
    transitionDuration: 1000,
    lazy: true, // Lazy load backgrounds
    preload: 1, // Number of slides to preload ahead
    debug: false
  };

  let config = {};

  /**
   * Initialize the plugin
   */
  function init(reveal) {
    deck = reveal;
    config = { ...defaultConfig, ...deck.getConfig().xbackground };

    if (config.debug) {
      console.log('XBackground Plugin initialized with config:', config);
    }

    // Create React root container
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
   * Create the React root container
   */
  function createReactContainer() {
    // Create a hidden div for React root
    const container = document.createElement('div');
    container.id = 'xbackground-react-root';
    container.style.display = 'none';
    document.body.appendChild(container);

    // Create React root
    reactRoot = ReactDOM.createRoot(container);
    
    // Render the portal manager
    reactRoot.render(
      <React.StrictMode>
        <PortalManager />
      </React.StrictMode>
    );
  }

  /**
   * Portal Manager Component
   */
  function PortalManager() {
    const [portals, setPortals] = React.useState([]);

    React.useEffect(() => {
      // Store the setPortals function for external updates
      window.__xbackgroundSetPortals = setPortals;
      
      return () => {
        delete window.__xbackgroundSetPortals;
      };
    }, []);

    return (
      <>
        {portals.map(portal => portal)}
      </>
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
    // Create background container
    const bgContainer = document.createElement('div');
    bgContainer.className = 'xbackground-container';
    bgContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      pointer-events: none;
      opacity: 0;
      transition: opacity ${config.transitionDuration}ms ${config.transition};
    `;
    
    // Insert as first child of slide
    slide.insertBefore(bgContainer, slide.firstChild);
    
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

    // Create a unique key for this portal
    const portalKey = `slide-${bgInstance.index}`;

    // Create the portal
    const portal = createPortal(
      <BackgroundWrapper
        component={BackgroundComponent}
        config={bgConfig.config}
        slideIndex={bgInstance.index}
        onMount={() => handleBackgroundMount(slide)}
        onUnmount={() => handleBackgroundUnmount(slide)}
      />,
      container,
      portalKey
    );

    // Store the portal
    activePortals.set(slide, portal);
    bgInstance.mounted = true;

    // Update React portals
    updatePortals();
  }

  /**
   * Background Wrapper Component
   */
  function BackgroundWrapper({ component: Component, config, slideIndex, onMount, onUnmount }) {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      onMount();
      
      // Fade in after mount
      requestAnimationFrame(() => {
        setIsVisible(true);
      });

      return () => {
        onUnmount();
      };
    }, []);

    return (
      <div
        className="xbackground-wrapper"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          top: 0,
          left: 0
        }}
      >
        <Component {...config} isVisible={isVisible} slideIndex={slideIndex} />
      </div>
    );
  }

  /**
   * Unmount a background component
   */
  function unmountBackground(slide) {
    const bgInstance = backgroundInstances.get(slide);
    if (!bgInstance || !bgInstance.mounted) return;

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

    // Clear maps
    backgroundInstances.clear();
    activePortals.clear();
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
