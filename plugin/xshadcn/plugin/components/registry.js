/**
 * Component Registry for XShadcn Plugin
 * Wraps shadcn/ui components for use in Reveal.js presentations
 */

import React from 'react';
import * as Components from './index.js';

// Map of available components
export const ComponentRegistry = {
  // Core Components
  Button: Components.Button,
  Card: Components.Card,
  Badge: Components.Badge,
  Alert: Components.Alert,
  
  // Form Components
  Input: Components.Input,
  Textarea: Components.Textarea,
  Select: Components.Select,
  Checkbox: Components.Checkbox,
  RadioGroup: Components.RadioGroup,
  Switch: Components.Switch,
  Slider: Components.Slider,
  
  // Data Display
  Table: Components.Table,
  DataTable: Components.DataTable,
  Chart: Components.Chart,
  Progress: Components.Progress,
  
  // Feedback
  Toast: Components.Toast,
  Dialog: Components.Dialog,
  Sheet: Components.Sheet,
  Popover: Components.Popover,
  Tooltip: Components.Tooltip,
  
  // Navigation
  Tabs: Components.Tabs,
  Breadcrumb: Components.Breadcrumb,
  NavigationMenu: Components.NavigationMenu,
  
  // Layout
  Separator: Components.Separator,
  AspectRatio: Components.AspectRatio,
  ScrollArea: Components.ScrollArea,
  Accordion: Components.Accordion,
  Collapsible: Components.Collapsible,
  
  // Typography
  Heading: Components.Heading,
  Paragraph: Components.Paragraph,
  Blockquote: Components.Blockquote,
  Code: Components.Code,
  
  // Custom Presentation Components
  LiveCode: Components.LiveCode,
  Terminal: Components.Terminal,
  Browser: Components.Browser,
  Mockup: Components.Mockup,
  Timeline: Components.Timeline,
  Metrics: Components.Metrics,
  ComparisonTable: Components.ComparisonTable,
  FeatureGrid: Components.FeatureGrid,
  PricingCard: Components.PricingCard,
  TestimonialCard: Components.TestimonialCard,
  StatCard: Components.StatCard
};

// Component presets for quick use
export const ComponentPresets = {
  Button: {
    primary: { variant: 'default', size: 'default' },
    secondary: { variant: 'secondary', size: 'default' },
    danger: { variant: 'destructive', size: 'default' },
    large: { variant: 'default', size: 'lg' },
    small: { variant: 'default', size: 'sm' },
    ghost: { variant: 'ghost', size: 'default' },
    outline: { variant: 'outline', size: 'default' }
  },
  Card: {
    default: { className: 'w-full max-w-md' },
    wide: { className: 'w-full max-w-2xl' },
    narrow: { className: 'w-full max-w-sm' },
    feature: { className: 'w-full max-w-lg p-6' },
    metric: { className: 'w-full max-w-xs' }
  },
  Alert: {
    info: { variant: 'default' },
    success: { variant: 'default', className: 'border-green-500 bg-green-50' },
    warning: { variant: 'default', className: 'border-yellow-500 bg-yellow-50' },
    error: { variant: 'destructive' }
  },
  Badge: {
    default: { variant: 'default' },
    secondary: { variant: 'secondary' },
    success: { variant: 'default', className: 'bg-green-500' },
    warning: { variant: 'default', className: 'bg-yellow-500' },
    danger: { variant: 'destructive' }
  },
  Progress: {
    default: { className: 'w-full' },
    thin: { className: 'w-full h-1' },
    thick: { className: 'w-full h-4' }
  },
  Chart: {
    line: { type: 'line', height: 300 },
    bar: { type: 'bar', height: 300 },
    pie: { type: 'pie', height: 300 },
    area: { type: 'area', height: 300 },
    radar: { type: 'radar', height: 300 }
  }
};

// Helper hook for component state management
export function useComponentState(componentId, initialState = {}) {
  const [state, setState] = React.useState(initialState);
  
  React.useEffect(() => {
    // Register component state globally if needed
    if (window.__xshadcnRegisterComponent) {
      window.__xshadcnRegisterComponent(componentId, state, setState);
    }
    
    return () => {
      if (window.__xshadcnUnregisterComponent) {
        window.__xshadcnUnregisterComponent(componentId);
      }
    };
  }, [componentId]);
  
  return [state, setState];
}

// Helper hook for global state access
export function useGlobalState(key) {
  const [value, setValue] = React.useState(() => {
    const globalState = window.__xshadcnGetState ? window.__xshadcnGetState() : {};
    return globalState[key];
  });
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      const globalState = window.__xshadcnGetState ? window.__xshadcnGetState() : {};
      if (globalState[key] !== value) {
        setValue(globalState[key]);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [key, value]);
  
  const setGlobalValue = React.useCallback((newValue) => {
    if (window.__xshadcnSetState) {
      window.__xshadcnSetState(key, newValue);
    }
    setValue(newValue);
  }, [key]);
  
  return [value, setGlobalValue];
}

// Helper function to get preset configuration
export function getPresetConfig(component, preset) {
  return ComponentPresets[component]?.[preset] || {};
}

// Re-export utilities
export { Components };
export { cn } from './utils.js';
