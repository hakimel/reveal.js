/**
 * DotGrid Background Component
 * Wrapper for the reactbits.dev dot-grid background
 */

import React from 'react';
import { useBackgroundAnimation, getPresetConfig } from '../index.js';

const DotGrid = ({
  spacing = 30,
  dotSize = 3,
  pulseSpeed = 0.5,
  preset,
  isVisible,
  slideIndex,
  ...props
}) => {
  const containerRef = React.useRef(null);
  const { elapsed } = useBackgroundAnimation(isVisible);

  // Apply preset if provided
  const config = React.useMemo(() => {
    const presetConfig = preset ? getPresetConfig('dot-grid', preset) : {};
    return {
      spacing: presetConfig.spacing ?? spacing,
      dotSize: presetConfig.dotSize ?? dotSize,
      pulseSpeed: presetConfig.pulseSpeed ?? pulseSpeed
    };
  }, [spacing, dotSize, pulseSpeed, preset]);

  // Calculate grid dimensions
  const [gridDimensions, setGridDimensions] = React.useState({ rows: 0, cols: 0 });

  React.useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      setGridDimensions({
        cols: Math.ceil(width / config.spacing),
        rows: Math.ceil(height / config.spacing)
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [config.spacing]);

  // Generate dots
  const dots = React.useMemo(() => {
    const dotsArray = [];
    for (let row = 0; row < gridDimensions.rows; row++) {
      for (let col = 0; col < gridDimensions.cols; col++) {
        dotsArray.push({
          id: `${row}-${col}`,
          x: col * config.spacing,
          y: row * config.spacing,
          delay: (row + col) * 0.1
        });
      }
    }
    return dotsArray;
  }, [gridDimensions, config.spacing]);

  return (
    <div 
      ref={containerRef}
      className="xbg-dot-grid" 
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)',
        overflow: 'hidden'
      }}
      {...props}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <radialGradient id={`dot-gradient-${slideIndex}`}>
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          
          <filter id={`glow-${slideIndex}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {dots.map(dot => {
          const scale = Math.sin((elapsed * 0.001 * config.pulseSpeed + dot.delay)) * 0.3 + 1;
          const opacity = Math.sin((elapsed * 0.001 * config.pulseSpeed + dot.delay)) * 0.3 + 0.5;
          
          return (
            <circle
              key={dot.id}
              cx={dot.x}
              cy={dot.y}
              r={config.dotSize}
              fill={`url(#dot-gradient-${slideIndex})`}
              filter={`url(#glow-${slideIndex})`}
              opacity={opacity}
              transform={`scale(${scale})`}
              style={{
                transformOrigin: `${dot.x}px ${dot.y}px`,
                transition: isVisible ? 'none' : 'opacity 0.5s ease-out'
              }}
            />
          );
        })}
        
        {/* Add connection lines between nearby dots */}
        {dots.map((dot, i) => {
          return dots.slice(i + 1).map((otherDot, j) => {
            const distance = Math.sqrt(
              Math.pow(dot.x - otherDot.x, 2) + 
              Math.pow(dot.y - otherDot.y, 2)
            );
            
            if (distance < config.spacing * 1.5 && distance > 0) {
              const opacity = (1 - distance / (config.spacing * 1.5)) * 0.2 * 
                Math.sin((elapsed * 0.001 * config.pulseSpeed + dot.delay)) * 0.5 + 0.5;
              
              return (
                <line
                  key={`${dot.id}-${otherDot.id}`}
                  x1={dot.x}
                  y1={dot.y}
                  x2={otherDot.x}
                  y2={otherDot.y}
                  stroke="#4a9eff"
                  strokeWidth="0.5"
                  opacity={opacity}
                />
              );
            }
            return null;
          }).filter(Boolean);
        })}
      </svg>
    </div>
  );
};

export default DotGrid;
