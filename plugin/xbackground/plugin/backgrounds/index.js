/**
 * Background Registry
 * Central registry for all available background components
 */

import React from 'react';

// Lazy load background components for better performance
const Hyperspeed = React.lazy(() => import('./components/Hyperspeed.js'));
const Aurora = React.lazy(() => import('./components/Aurora.js'));
const DarkVeil = React.lazy(() => import('./components/DarkVeil.js'));
const Dither = React.lazy(() => import('./components/Dither.js'));
const DotGrid = React.lazy(() => import('./components/DotGrid.js'));
const FaultyTerminal = React.lazy(() => import('./components/FaultyTerminal.js'));
const Iridescence = React.lazy(() => import('./components/Iridescence.js'));
const LiquidEther = React.lazy(() => import('./components/LiquidEther.js'));

// Wrapper component to handle lazy loading and error boundaries
const BackgroundLoader = ({ component: Component, ...props }) => {
  return (
    <React.Suspense fallback={<div className="xbg-loading">Loading background...</div>}>
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    </React.Suspense>
  );
};

// Error boundary for individual backgrounds
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Background component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="xbg-error">Background failed to load</div>;
    }

    return this.props.children;
  }
}

// Export the registry with wrapped components
export const BackgroundRegistry = {
  hyperspeed: (props) => <BackgroundLoader component={Hyperspeed} {...props} />,
  aurora: (props) => <BackgroundLoader component={Aurora} {...props} />,
  'dark-veil': (props) => <BackgroundLoader component={DarkVeil} {...props} />,
  dither: (props) => <BackgroundLoader component={Dither} {...props} />,
  'dot-grid': (props) => <BackgroundLoader component={DotGrid} {...props} />,
  'faulty-terminal': (props) => <BackgroundLoader component={FaultyTerminal} {...props} />,
  iridescence: (props) => <BackgroundLoader component={Iridescence} {...props} />,
  'liquid-ether': (props) => <BackgroundLoader component={LiquidEther} {...props} />,
};

// Configuration presets for each background type
export const BackgroundPresets = {
  hyperspeed: {
    fast: { speed: 2, stars: 500, trails: true },
    normal: { speed: 1, stars: 300, trails: true },
    slow: { speed: 0.5, stars: 200, trails: false },
    dense: { speed: 1, stars: 1000, trails: true }
  },
  aurora: {
    vibrant: { intensity: 1, speed: 1, colors: ['#00ff00', '#0099ff', '#ff00ff'] },
    subtle: { intensity: 0.5, speed: 0.5, colors: ['#004d00', '#003366', '#660066'] },
    warm: { intensity: 0.7, speed: 0.7, colors: ['#ff6600', '#ff3300', '#ffcc00'] },
    cool: { intensity: 0.7, speed: 0.7, colors: ['#0066cc', '#00cccc', '#6600cc'] }
  },
  'dark-veil': {
    heavy: { opacity: 0.9, particleCount: 50, speed: 0.5 },
    medium: { opacity: 0.7, particleCount: 30, speed: 1 },
    light: { opacity: 0.5, particleCount: 20, speed: 1.5 }
  },
  dither: {
    fine: { pixelSize: 2, colorDepth: 256 },
    medium: { pixelSize: 4, colorDepth: 64 },
    coarse: { pixelSize: 8, colorDepth: 16 },
    retro: { pixelSize: 6, colorDepth: 8 }
  },
  'dot-grid': {
    dense: { spacing: 20, dotSize: 2, pulseSpeed: 1 },
    normal: { spacing: 30, dotSize: 3, pulseSpeed: 0.5 },
    sparse: { spacing: 50, dotSize: 4, pulseSpeed: 0.3 }
  },
  'faulty-terminal': {
    glitchy: { glitchFrequency: 0.1, scanlines: true, flicker: true },
    stable: { glitchFrequency: 0.01, scanlines: true, flicker: false },
    retro: { glitchFrequency: 0.05, scanlines: true, flicker: true, greenPhosphor: true }
  },
  iridescence: {
    rainbow: { hueRotationSpeed: 1, saturation: 100, lightness: 50 },
    pastel: { hueRotationSpeed: 0.5, saturation: 50, lightness: 70 },
    deep: { hueRotationSpeed: 0.3, saturation: 80, lightness: 30 }
  },
  'liquid-ether': {
    calm: { viscosity: 0.9, turbulence: 0.1, colorShift: 0.5 },
    flowing: { viscosity: 0.5, turbulence: 0.3, colorShift: 1 },
    turbulent: { viscosity: 0.3, turbulence: 0.7, colorShift: 2 }
  }
};

// Helper function to get preset configuration
export function getPresetConfig(type, preset) {
  return BackgroundPresets[type]?.[preset] || {};
}

// Helper hook for background components
export function useBackgroundAnimation(isVisible) {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const animationFrameRef = React.useRef();
  const startTimeRef = React.useRef();

  React.useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      startTimeRef.current = Date.now();
    } else {
      setIsAnimating(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible]);

  const requestFrame = React.useCallback((callback) => {
    if (isAnimating) {
      animationFrameRef.current = requestAnimationFrame(() => {
        const elapsed = Date.now() - startTimeRef.current;
        callback(elapsed);
        requestFrame(callback);
      });
    }
  }, [isAnimating]);

  return {
    isAnimating,
    requestFrame,
    elapsed: Date.now() - (startTimeRef.current || Date.now())
  };
}
