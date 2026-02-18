import { useState, useRef, useEffect, type ReactNode } from 'react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({ content, children, position = 'top', delay = 200 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current.getBoundingClientRect();
      const trigger = triggerRef.current.getBoundingClientRect();
      
      // Check if tooltip would overflow viewport and adjust
      if (position === 'top' && trigger.top - tooltip.height < 8) {
        setActualPosition('bottom');
      } else if (position === 'bottom' && trigger.bottom + tooltip.height > window.innerHeight - 8) {
        setActualPosition('top');
      } else if (position === 'left' && trigger.left - tooltip.width < 8) {
        setActualPosition('right');
      } else if (position === 'right' && trigger.right + tooltip.width > window.innerWidth - 8) {
        setActualPosition('left');
      } else {
        setActualPosition(position);
      }
    }
  }, [isVisible, position]);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-foreground/90 dark:border-t-card border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-foreground/90 dark:border-b-card border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-foreground/90 dark:border-l-card border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-foreground/90 dark:border-r-card border-y-transparent border-l-transparent',
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={triggerRef}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 ${positionClasses[actualPosition]} pointer-events-none`}
        >
          <div className="bg-foreground/90 dark:bg-card text-background dark:text-foreground text-xs px-3 py-2 rounded shadow-lg max-w-xs whitespace-normal">
            {content}
            <div className={`absolute border-4 ${arrowClasses[actualPosition]}`} />
          </div>
        </div>
      )}
    </div>
  );
}

// Helper icon for info tooltips
export function InfoTooltip({ content }: { content: ReactNode }) {
  return (
    <Tooltip content={content}>
      <button
        type="button"
        className="w-4 h-4 rounded-full border border-muted-foreground/40 text-muted-foreground hover:border-foreground hover:text-foreground dark:hover:border-orange dark:hover:text-orange transition-colors inline-flex items-center justify-center text-[10px] font-medium ml-1"
      >
        ?
      </button>
    </Tooltip>
  );
}

export default Tooltip;
