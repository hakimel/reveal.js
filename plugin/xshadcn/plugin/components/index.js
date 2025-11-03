/**
 * shadcn/ui Components for XShadcn Plugin
 * Implementations of core UI components
 */

import React from 'react';
import { cn } from './utils.js';
import { useGlobalState } from './registry.js';

// ============= Core Components =============

// Button Component
export const Button = React.forwardRef(({ 
  className,
  variant = 'default',
  size = 'default',
  children,
  onClick,
  disabled,
  componentId,
  onStateChange,
  ...props 
}, ref) => {
  const [clickCount, setClickCount] = React.useState(0);

  const handleClick = (e) => {
    if (disabled) return;
    
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (onStateChange) {
      onStateChange(`button_${componentId}_clicks`, newCount);
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  const variants = {
    default: 'bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90',
    destructive: 'bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90',
    outline: 'border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
    ghost: 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50',
    link: 'text-slate-900 underline-offset-4 hover:underline dark:text-slate-50'
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  };

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
      {clickCount > 0 && size !== 'icon' && (
        <span className="ml-2 text-xs opacity-60">({clickCount})</span>
      )}
    </button>
  );
});
Button.displayName = 'Button';

// Card Component
export const Card = ({ className, children, componentId, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, ...props }) => (
  <div
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
);

export const CardTitle = ({ className, ...props }) => (
  <h3
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
);

export const CardDescription = ({ className, ...props }) => (
  <p
    className={cn('text-sm text-slate-500 dark:text-slate-400', className)}
    {...props}
  />
);

export const CardContent = ({ className, ...props }) => (
  <div className={cn('p-6 pt-0', className)} {...props} />
);

export const CardFooter = ({ className, ...props }) => (
  <div
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
);

// Badge Component
export const Badge = ({ 
  className, 
  variant = 'default', 
  children, 
  ...props 
}) => {
  const variants = {
    default: 'border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80',
    secondary: 'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
    destructive: 'border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80',
    outline: 'text-slate-950 dark:text-slate-50'
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:focus:ring-slate-300',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Alert Component
export const Alert = ({ 
  className, 
  variant = 'default', 
  children,
  componentId,
  ...props 
}) => {
  const variants = {
    default: 'bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50',
    destructive: 'border-red-500/50 text-red-600 dark:border-red-500 dark:border-red-900/50 dark:text-red-300'
  };

  return (
    <div
      className={cn(
        'relative w-full rounded-lg border border-slate-200 p-4 dark:border-slate-800',
        variants[variant],
        className
      )}
      role="alert"
      {...props}
    >
      {children}
    </div>
  );
};

export const AlertTitle = ({ className, ...props }) => (
  <h5
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
);

export const AlertDescription = ({ className, ...props }) => (
  <div
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
);

// ============= Form Components =============

// Input Component
export const Input = React.forwardRef(({ 
  className, 
  type, 
  componentId,
  onStateChange,
  placeholder,
  ...props 
}, ref) => {
  const [value, setValue] = React.useState('');

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    if (onStateChange) {
      onStateChange(`input_${componentId}_value`, newValue);
    }
    
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300',
        className
      )}
      ref={ref}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      {...props}
    />
  );
});
Input.displayName = 'Input';

// Switch Component
export const Switch = React.forwardRef(({ 
  className,
  componentId,
  onStateChange,
  disabled,
  ...props 
}, ref) => {
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    if (disabled) return;
    
    const newValue = !checked;
    setChecked(newValue);
    
    if (onStateChange) {
      onStateChange(`switch_${componentId}_checked`, newValue);
    }
  };

  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={handleChange}
      disabled={disabled}
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-slate-900 dark:bg-slate-50' : 'bg-slate-200 dark:bg-slate-800',
        className
      )}
      ref={ref}
      {...props}
    >
      <span
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0',
          !checked && 'dark:bg-slate-950'
        )}
      />
    </button>
  );
});
Switch.displayName = 'Switch';

// Slider Component
export const Slider = ({ 
  className,
  min = 0,
  max = 100,
  step = 1,
  componentId,
  onStateChange,
  disabled,
  ...props 
}) => {
  const [value, setValue] = React.useState(50);

  const handleChange = (e) => {
    if (disabled) return;
    
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    
    if (onStateChange) {
      onStateChange(`slider_${componentId}_value`, newValue);
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
        {...props}
      />
      <div className="text-center mt-2 text-sm text-slate-600 dark:text-slate-400">
        {value}
      </div>
    </div>
  );
};

// ============= Data Display Components =============

// Progress Component
export const Progress = ({ 
  className,
  value = 0,
  max = 100,
  componentId,
  ...props 
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800',
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-slate-900 transition-all dark:bg-slate-50"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// Simple Chart Component (using SVG)
export const Chart = ({ 
  type = 'bar',
  data = [],
  height = 200,
  className,
  componentId,
  ...props 
}) => {
  const renderBarChart = () => {
    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = 100 / data.length;

    return (
      <svg 
        width="100%" 
        height={height} 
        className={cn('w-full', className)}
        {...props}
      >
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * height * 0.8;
          return (
            <g key={index}>
              <rect
                x={`${index * barWidth}%`}
                y={height - barHeight - 20}
                width={`${barWidth * 0.8}%`}
                height={barHeight}
                fill="currentColor"
                className="text-slate-600 dark:text-slate-400"
              />
              <text
                x={`${index * barWidth + barWidth * 0.4}%`}
                y={height - 5}
                textAnchor="middle"
                className="text-xs fill-current text-slate-600 dark:text-slate-400"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const renderLineChart = () => {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = height - (item.value / maxValue) * height * 0.8 - 20;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg 
        width="100%" 
        height={height} 
        className={cn('w-full', className)}
        {...props}
      >
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-600 dark:text-slate-400"
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = height - (item.value / maxValue) * height * 0.8 - 20;
          return (
            <circle
              key={index}
              cx={`${x}%`}
              cy={y}
              r="4"
              fill="currentColor"
              className="text-slate-600 dark:text-slate-400"
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className={cn('w-full', className)}>
      {type === 'bar' && renderBarChart()}
      {type === 'line' && renderLineChart()}
    </div>
  );
};

// ============= Custom Presentation Components =============

// Metrics Component
export const Metrics = ({ 
  title,
  value,
  change,
  className,
  componentId,
  ...props 
}) => {
  const isPositive = change && change > 0;

  return (
    <Card className={cn('p-6', className)} {...props}>
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      {change !== undefined && (
        <div className={cn(
          'text-sm mt-2',
          isPositive ? 'text-green-600' : 'text-red-600'
        )}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      )}
    </Card>
  );
};

// StatCard Component
export const StatCard = ({ 
  label,
  value,
  description,
  icon,
  trend,
  className,
  componentId,
  ...props 
}) => {
  return (
    <Card className={cn('p-6', className)} {...props}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={cn(
            'font-medium',
            trend > 0 ? 'text-green-600' : 'text-red-600'
          )}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-slate-500 dark:text-slate-400 ml-2">
            from last period
          </span>
        </div>
      )}
    </Card>
  );
};

// Terminal Component
export const Terminal = ({ 
  commands = [],
  className,
  componentId,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        'rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-50',
        className
      )}
      {...props}
    >
      <div className="flex items-center mb-3">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-3 text-xs text-slate-400">terminal</div>
      </div>
      <div className="space-y-1">
        {commands.map((cmd, index) => (
          <div key={index}>
            {cmd.prompt && (
              <span className="text-green-400">$ </span>
            )}
            <span className={cmd.type === 'output' ? 'text-slate-400' : ''}>
              {cmd.text}
            </span>
          </div>
        ))}
        <div>
          <span className="text-green-400">$ </span>
          <span className="inline-block w-2 h-4 bg-slate-50 animate-pulse"></span>
        </div>
      </div>
    </div>
  );
};

// Timeline Component
export const Timeline = ({ 
  events = [],
  className,
  componentId,
  ...props 
}) => {
  return (
    <div className={cn('relative', className)} {...props}>
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
      {events.map((event, index) => (
        <div key={index} className="relative flex items-start mb-8">
          <div className="absolute left-4 w-2 h-2 bg-slate-600 rounded-full -translate-x-1/2"></div>
          <div className="ml-12">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {event.date}
            </div>
            <div className="font-semibold mt-1">{event.title}</div>
            {event.description && (
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {event.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Export placeholder components (to be implemented)
export const Textarea = Input;
export const Select = Input;
export const Checkbox = Switch;
export const RadioGroup = Switch;
export const Table = Card;
export const DataTable = Card;
export const Toast = Alert;
export const Dialog = Card;
export const Sheet = Card;
export const Popover = Card;
export const Tooltip = Badge;
export const Tabs = Card;
export const Breadcrumb = Card;
export const NavigationMenu = Card;
export const Separator = () => <hr className="border-slate-200 dark:border-slate-800" />;
export const AspectRatio = Card;
export const ScrollArea = Card;
// Accordion Component - Matching shadcn/ui design exactly
export const Accordion = ({
  items = [],
  type = 'single',
  defaultValue,
  className,
  componentId,
  variant = 'default',
  collapsible = true,
  ...props
}) => {
  const [openItems, setOpenItems] = React.useState(() => {
    if (defaultValue) {
      return type === 'single' ? [defaultValue] : [defaultValue].flat();
    }
    return [];
  });

  const toggleItem = (value) => {
    if (type === 'single') {
      // In single mode with collapsible, clicking open item closes it
      if (collapsible) {
        setOpenItems(prev => prev.includes(value) ? [] : [value]);
      } else {
        setOpenItems([value]);
      }
    } else {
      // Multiple mode
      setOpenItems(prev =>
        prev.includes(value)
          ? prev.filter(v => v !== value)
          : [...prev, value]
      );
    }
  };

  return (
    <div
      className={cn('w-full', className)}
      {...props}
    >
      {items.map((item, index) => {
        const value = item.value || `item-${index}`;
        const isOpen = openItems.includes(value);

        return (
          <div
            key={value}
            className="border-b border-slate-200 dark:border-slate-800"
          >
            {/* AccordionHeader wrapper */}
            <h3 className="flex">
              <button
                onClick={() => toggleItem(value)}
                className={cn(
                  'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all text-left',
                  'hover:underline',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2',
                  'dark:focus-visible:ring-slate-300 dark:ring-offset-slate-950',
                  '[&[data-state=open]>svg]:rotate-180'
                )}
                data-state={isOpen ? 'open' : 'closed'}
                aria-expanded={isOpen}
              >
                {item.title}
                {/* ChevronDown icon */}
                <svg
                  className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-200"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </h3>
            {/* AccordionContent wrapper */}
            <div
              className={cn(
                'overflow-hidden text-sm transition-all duration-200 ease-out'
              )}
              data-state={isOpen ? 'open' : 'closed'}
              style={{
                maxHeight: isOpen ? '1000px' : '0',
                opacity: isOpen ? 1 : 0
              }}
            >
              <div className="pb-4 pt-0 text-slate-600 dark:text-slate-400">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Collapsible = Card;
export const Heading = ({ level = 2, children, className, ...props }) => {
  const Tag = `h${level}`;
  return <Tag className={cn('font-bold', className)} {...props}>{children}</Tag>;
};
export const Paragraph = ({ children, className, ...props }) => (
  <p className={cn('text-slate-600 dark:text-slate-400', className)} {...props}>{children}</p>
);
export const Blockquote = ({ children, className, ...props }) => (
  <blockquote className={cn('border-l-4 border-slate-200 pl-4 italic', className)} {...props}>{children}</blockquote>
);
export const Code = ({ children, className, ...props }) => (
  <code className={cn('bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-sm', className)} {...props}>{children}</code>
);
export const LiveCode = Terminal;
export const Browser = Card;
export const Mockup = Card;
export const ComparisonTable = Table;
export const FeatureGrid = Card;
export const PricingCard = Card;
export const TestimonialCard = Card;
