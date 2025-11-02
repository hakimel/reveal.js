/**
 * XShadcn Plugin for Reveal.js
 * Enables shadcn/ui components in presentations using React Portals
 * 
 * @author Your Name
 * @version 1.0.0
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createPortal } from 'react-dom';
import { ComponentRegistry } from './components/registry.js';
import { ThemeProvider } from './components/theme-provider.js';

const Plugin = () => {
  let deck;
  let reactRoot = null;
  let componentInstances = new Map();
  let activePortals = new Map();
  
  // Default configuration
  const defaultConfig = {
    theme: 'light', // 'light', 'dark', 'system'
    defaultAnimation: 'fade', // 'fade', 'slide', 'zoom', 'none'
    animationDuration: 300,
    interactive: true, // Allow user interaction with components
    dataBinding: true, // Enable data binding between components
    globalState: {}, // Shared state across all components
    debug: false
  };

  let config = {};
  let globalStore = {};

  /**
   * Initialize the plugin
   */
  function init(reveal) {
    deck = reveal;
    config = { ...defaultConfig, ...deck.getConfig().xshadcn };
    globalStore = { ...config.globalState };

    if (config.debug) {
      console.log('XShadcn Plugin initialized with config:', config);
    }

    // Inject Tailwind CSS and shadcn styles
    injectStyles();

    // Create React root container
    createReactContainer();

    // Wait for Portal Manager to be ready before processing slides
    // This ensures window.__xshadcnSetPortals is available
    setTimeout(() => {
      // Process all slides with shadcn components
      processSlides();
    }, 0);

    // Set up event listeners
    deck.on('slidechanged', onSlideChanged);
    deck.on('ready', onReady);
    deck.on('fragmentshown', onFragmentShown);
    deck.on('fragmenthidden', onFragmentHidden);

    return Promise.resolve();
  }

  /**
   * Inject required styles
   */
  function injectStyles() {
    // Check if Tailwind is already loaded
    if (!document.querySelector('#xshadcn-tailwind')) {
      const tailwindLink = document.createElement('link');
      tailwindLink.id = 'xshadcn-tailwind';
      tailwindLink.rel = 'stylesheet';
      tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css';
      document.head.appendChild(tailwindLink);
    }

    // Add custom styles for shadcn components
    if (!document.querySelector('#xshadcn-styles')) {
      const style = document.createElement('style');
      style.id = 'xshadcn-styles';
      style.textContent = `
        /* CSS Variables for shadcn/ui */
        :root {
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          --card: 0 0% 100%;
          --card-foreground: 222.2 84% 4.9%;
          --popover: 0 0% 100%;
          --popover-foreground: 222.2 84% 4.9%;
          --primary: 222.2 47.4% 11.2%;
          --primary-foreground: 210 40% 98%;
          --secondary: 210 40% 96.1%;
          --secondary-foreground: 222.2 47.4% 11.2%;
          --muted: 210 40% 96.1%;
          --muted-foreground: 215.4 16.3% 46.9%;
          --accent: 210 40% 96.1%;
          --accent-foreground: 222.2 47.4% 11.2%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 40% 98%;
          --border: 214.3 31.8% 91.4%;
          --input: 214.3 31.8% 91.4%;
          --ring: 222.2 84% 4.9%;
          --radius: 0.5rem;
        }

        .dark {
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
          --card: 222.2 84% 4.9%;
          --card-foreground: 210 40% 98%;
          --popover: 222.2 84% 4.9%;
          --popover-foreground: 210 40% 98%;
          --primary: 210 40% 98%;
          --primary-foreground: 222.2 47.4% 11.2%;
          --secondary: 217.2 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;
          --muted: 217.2 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;
          --accent: 217.2 32.6% 17.5%;
          --accent-foreground: 210 40% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 40% 98%;
          --border: 217.2 32.6% 17.5%;
          --input: 217.2 32.6% 17.5%;
          --ring: 212.7 26.8% 83.9%;
        }

        /* Component containers */
        .xshadcn-container {
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.5;
          pointer-events: auto;
        }

        /* Ensure components are interactive */
        .xshadcn-inline {
          position: relative;
          z-index: 10;
        }

        /* Ensure child elements are interactive */
        .xshadcn-container * {
          pointer-events: auto;
        }

        .xshadcn-overlay {
          position: absolute;
          z-index: 100;
          pointer-events: auto;
        }

        .xshadcn-fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1000;
          pointer-events: auto;
        }

        /* Animation classes */
        .xshadcn-fade-enter {
          opacity: 0;
        }
        
        .xshadcn-fade-enter-active {
          opacity: 1;
          transition: opacity var(--animation-duration, 300ms) ease-in-out;
        }

        .xshadcn-slide-enter {
          transform: translateY(20px);
          opacity: 0;
        }
        
        .xshadcn-slide-enter-active {
          transform: translateY(0);
          opacity: 1;
          transition: all var(--animation-duration, 300ms) ease-out;
        }

        .xshadcn-zoom-enter {
          transform: scale(0.9);
          opacity: 0;
        }
        
        .xshadcn-zoom-enter-active {
          transform: scale(1);
          opacity: 1;
          transition: all var(--animation-duration, 300ms) ease-out;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Create the React root container
   */
  function createReactContainer() {
    const container = document.createElement('div');
    container.id = 'xshadcn-react-root';
    container.style.display = 'none';
    document.body.appendChild(container);

    reactRoot = ReactDOM.createRoot(container);
    
    reactRoot.render(
      <React.StrictMode>
        <ThemeProvider defaultTheme={config.theme}>
          <PortalManager />
        </ThemeProvider>
      </React.StrictMode>
    );
  }

  /**
   * Portal Manager Component
   */
  function PortalManager() {
    const [portals, setPortals] = React.useState([]);
    const [sharedState, setSharedState] = React.useState(globalStore);

    React.useEffect(() => {
      // Store functions for external updates
      window.__xshadcnSetPortals = setPortals;
      window.__xshadcnGetState = () => sharedState;
      window.__xshadcnSetState = (key, value) => {
        setSharedState(prev => ({ ...prev, [key]: value }));
        globalStore[key] = value;
      };
      
      return () => {
        delete window.__xshadcnSetPortals;
        delete window.__xshadcnGetState;
        delete window.__xshadcnSetState;
      };
    }, [sharedState]);

    return (
      <>
        {portals.map((portal, index) => (
          <React.Fragment key={`portal-${index}`}>
            {portal}
          </React.Fragment>
        ))}
      </>
    );
  }

  /**
   * Process all slides and prepare components
   */
  function processSlides() {
    const slides = deck.getSlides();
    
    slides.forEach((slide, slideIndex) => {
      // Look for inline components
      const inlineComponents = slide.querySelectorAll('[data-xshadcn]');
      
      inlineComponents.forEach((element, componentIndex) => {
        try {
          const componentConfig = parseComponentConfig(element.getAttribute('data-xshadcn'));
          prepareComponent(element, componentConfig, slideIndex, componentIndex, 'inline');
        } catch (error) {
          console.error(`Error processing component on slide ${slideIndex}:`, error);
        }
      });

      // Look for slide-level components
      const slideComponent = slide.getAttribute('data-xshadcn-slide');
      if (slideComponent) {
        try {
          const componentConfig = parseComponentConfig(slideComponent);
          prepareSlideComponent(slide, componentConfig, slideIndex);
        } catch (error) {
          console.error(`Error processing slide component on slide ${slideIndex}:`, error);
        }
      }
    });
  }

  /**
   * Parse component configuration
   */
  function parseComponentConfig(data) {
    // Support JSON format and shorthand
    if (data.startsWith('{')) {
      return JSON.parse(data);
    } else {
      // Shorthand format: "button" or "card:primary"
      const [component, variant] = data.split(':');
      // Capitalize first letter to match component registry
      const componentName = component.charAt(0).toUpperCase() + component.slice(1);
      return {
        component: componentName,
        variant,
        props: {}
      };
    }
  }

  /**
   * Prepare an inline component
   */
  function prepareComponent(element, config, slideIndex, componentIndex, type = 'inline') {
    const componentId = `${slideIndex}-${componentIndex}`;
    
    // Create container for the component
    const container = document.createElement('div');
    container.className = `xshadcn-container xshadcn-${type}`;
    container.style.cssText = `--animation-duration: ${config.animationDuration || defaultConfig.animationDuration}ms;`;
    
    // Handle different insertion types
    if (type === 'inline') {
      // Replace the original element with the container
      element.replaceWith(container);
      
      // Preserve any text content as children
      if (element.textContent) {
        config.props = config.props || {};
        config.props.children = element.textContent;
      }
    } else {
      // Append to slide for overlay/fullscreen
      element.appendChild(container);
    }
    
    // Store component instance
    componentInstances.set(componentId, {
      container,
      config,
      slideIndex,
      componentIndex,
      type,
      mounted: false,
      fragment: element.classList.contains('fragment')
    });

    // Mount immediately if not a fragment
    if (!element.classList.contains('fragment')) {
      mountComponent(componentId);
    }
  }

  /**
   * Prepare a slide-level component
   */
  function prepareSlideComponent(slide, config, slideIndex) {
    const componentId = `slide-${slideIndex}`;
    
    // Create container
    const container = document.createElement('div');
    container.className = 'xshadcn-container xshadcn-slide';
    container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      --animation-duration: ${config.animationDuration || defaultConfig.animationDuration}ms;
    `;
    
    // Insert as first child
    slide.insertBefore(container, slide.firstChild);
    
    // Store component instance
    componentInstances.set(componentId, {
      container,
      config,
      slideIndex,
      type: 'slide',
      mounted: false
    });
  }

  /**
   * Mount a component
   */
  function mountComponent(componentId) {
    const instance = componentInstances.get(componentId);
    if (!instance || instance.mounted) return;

    const { container, config } = instance;
    const Component = ComponentRegistry[config.component];

    if (!Component) {
      console.error(`Unknown component: ${config.component}`);
      return;
    }

    // Create portal with component
    const portal = createPortal(
      <ComponentWrapper
        component={Component}
        config={config}
        componentId={componentId}
        animation={config.animation || defaultConfig.defaultAnimation}
        interactive={config.interactive !== undefined ? config.interactive : defaultConfig.interactive}
        onMount={() => handleComponentMount(componentId)}
        onUnmount={() => handleComponentUnmount(componentId)}
        onStateChange={(key, value) => updateGlobalState(key, value)}
        globalState={window.__xshadcnGetState ? window.__xshadcnGetState() : globalStore}
      />,
      container,
      componentId
    );

    activePortals.set(componentId, portal);
    instance.mounted = true;

    updatePortals();
  }

  /**
   * Component Wrapper
   */
  function ComponentWrapper({ 
    component: Component, 
    config, 
    componentId,
    animation,
    interactive,
    onMount, 
    onUnmount,
    onStateChange,
    globalState
  }) {
    const [isVisible, setIsVisible] = React.useState(false);
    const [localState, setLocalState] = React.useState({});

    React.useEffect(() => {
      onMount();
      
      // Trigger animation after mount
      if (animation && animation !== 'none') {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      } else {
        setIsVisible(true);
      }

      return () => {
        onUnmount();
      };
    }, []);

    const animationClass = React.useMemo(() => {
      if (!animation || animation === 'none') return '';
      return isVisible ? `xshadcn-${animation}-enter-active` : `xshadcn-${animation}-enter`;
    }, [animation, isVisible]);

    const componentProps = React.useMemo(() => ({
      ...config.props,
      variant: config.variant,
      className: `${config.props?.className || ''} ${animationClass}`.trim(),
      disabled: !interactive && config.component !== 'Card' && config.component !== 'Badge',
      onStateChange: (key, value) => {
        setLocalState(prev => ({ ...prev, [key]: value }));
        if (config.bindToGlobal) {
          onStateChange(key, value);
        }
      },
      localState,
      globalState,
      componentId
    }), [config, animationClass, interactive, localState, globalState, componentId]);

    return <Component {...componentProps} />;
  }

  /**
   * Unmount a component
   */
  function unmountComponent(componentId) {
    const instance = componentInstances.get(componentId);
    if (!instance || !instance.mounted) return;

    activePortals.delete(componentId);
    instance.mounted = false;
    
    updatePortals();
  }

  /**
   * Update the portal list in React
   */
  function updatePortals() {
    if (window.__xshadcnSetPortals) {
      const portalsArray = Array.from(activePortals.values());
      window.__xshadcnSetPortals(portalsArray);
    }
  }

  /**
   * Update global state
   */
  function updateGlobalState(key, value) {
    if (window.__xshadcnSetState) {
      window.__xshadcnSetState(key, value);
    } else {
      globalStore[key] = value;
    }
    
    if (config.debug) {
      console.log('Global state updated:', key, value);
    }
  }

  /**
   * Handle component mount
   */
  function handleComponentMount(componentId) {
    if (config.debug) {
      console.log('Component mounted:', componentId);
    }
    
    // Dispatch custom event
    deck.dispatchEvent({
      type: 'xshadcn-mounted',
      data: { componentId }
    });
  }

  /**
   * Handle component unmount
   */
  function handleComponentUnmount(componentId) {
    if (config.debug) {
      console.log('Component unmounted:', componentId);
    }
    
    // Dispatch custom event
    deck.dispatchEvent({
      type: 'xshadcn-unmounted',
      data: { componentId }
    });
  }

  /**
   * Handle slide change event
   */
  function onSlideChanged(event) {
    const { currentSlide, previousSlide } = event;
    const currentIndex = deck.getSlides().indexOf(currentSlide);
    
    // Mount components for current slide
    componentInstances.forEach((instance, componentId) => {
      if (instance.slideIndex === currentIndex && !instance.mounted && !instance.fragment) {
        mountComponent(componentId);
      }
    });

    // Optionally unmount components from previous slide
    if (config.unmountOnExit && previousSlide) {
      const previousIndex = deck.getSlides().indexOf(previousSlide);
      componentInstances.forEach((instance, componentId) => {
        if (instance.slideIndex === previousIndex && instance.mounted) {
          unmountComponent(componentId);
        }
      });
    }
  }

  /**
   * Handle ready event
   */
  function onReady() {
    const currentSlide = deck.getCurrentSlide();
    if (currentSlide) {
      const currentIndex = deck.getSlides().indexOf(currentSlide);
      componentInstances.forEach((instance, componentId) => {
        if (instance.slideIndex === currentIndex && !instance.mounted && !instance.fragment) {
          mountComponent(componentId);
        }
      });
    }
  }

  /**
   * Handle fragment shown event
   */
  function onFragmentShown(event) {
    const fragment = event.fragment;
    const slideIndex = deck.getSlides().indexOf(event.fragment.closest('section'));
    
    // Mount fragment components
    componentInstances.forEach((instance, componentId) => {
      if (instance.slideIndex === slideIndex && instance.fragment && !instance.mounted) {
        const container = instance.container;
        if (fragment.contains(container) || fragment === container.parentElement) {
          mountComponent(componentId);
        }
      }
    });
  }

  /**
   * Handle fragment hidden event
   */
  function onFragmentHidden(event) {
    const fragment = event.fragment;
    const slideIndex = deck.getSlides().indexOf(event.fragment.closest('section'));
    
    // Unmount fragment components
    componentInstances.forEach((instance, componentId) => {
      if (instance.slideIndex === slideIndex && instance.fragment && instance.mounted) {
        const container = instance.container;
        if (fragment.contains(container) || fragment === container.parentElement) {
          unmountComponent(componentId);
        }
      }
    });
  }

  /**
   * Public API method to update component props
   */
  function updateComponentProps(componentId, newProps) {
    const instance = componentInstances.get(componentId);
    if (instance) {
      instance.config.props = { ...instance.config.props, ...newProps };
      if (instance.mounted) {
        unmountComponent(componentId);
        mountComponent(componentId);
      }
    }
  }

  /**
   * Public API method to get global state
   */
  function getGlobalState(key) {
    const state = window.__xshadcnGetState ? window.__xshadcnGetState() : globalStore;
    return key ? state[key] : state;
  }

  /**
   * Public API method to set global state
   */
  function setGlobalState(key, value) {
    updateGlobalState(key, value);
  }

  /**
   * Destroy the plugin
   */
  function destroy() {
    // Remove event listeners
    deck.off('slidechanged', onSlideChanged);
    deck.off('ready', onReady);
    deck.off('fragmentshown', onFragmentShown);
    deck.off('fragmenthidden', onFragmentHidden);

    // Unmount all components
    componentInstances.forEach((instance, componentId) => {
      if (instance.mounted) {
        unmountComponent(componentId);
      }
      instance.container.remove();
    });

    // Clean up React root
    if (reactRoot) {
      reactRoot.unmount();
      document.getElementById('xshadcn-react-root')?.remove();
    }

    // Clear maps
    componentInstances.clear();
    activePortals.clear();
  }

  return {
    id: 'xshadcn',
    init,
    destroy,
    // Public API
    mountComponent,
    unmountComponent,
    updateComponentProps,
    getGlobalState,
    setGlobalState
  };
};

export default Plugin;
