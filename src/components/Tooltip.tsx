import React, { useState, useRef, useEffect, ReactNode } from 'react';
import './Tooltip.css';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState(position);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let newPosition = position;
      
      // Check if tooltip fits in preferred position
      if (position === 'top' && triggerRect.top < tooltipRect.height + 10) {
        newPosition = 'bottom';
      } else if (position === 'bottom' && viewportHeight - triggerRect.bottom < tooltipRect.height + 10) {
        newPosition = 'top';
      } else if (position === 'left' && triggerRect.left < tooltipRect.width + 10) {
        newPosition = 'right';
      } else if (position === 'right' && viewportWidth - triggerRect.right < tooltipRect.width + 10) {
        newPosition = 'left';
      }
      
      setTooltipPosition(newPosition);
    }
  }, [isVisible, position]);
  
  return (
    <div 
      className="tooltip-wrapper"
      ref={triggerRef}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={`tooltip tooltip--${tooltipPosition}`}
          role="tooltip"
        >
          <div className="tooltip-inner">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
