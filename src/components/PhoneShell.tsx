import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import { WifiIcon, BatteryIcon, XIcon } from './Icons';

interface PhoneShellProps {
  children: ReactNode;
  title: string;
  onClose: () => void;
}

export const PhoneShell = ({ children, title, onClose }: PhoneShellProps): React.ReactNode => {
  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - 187,
    y: window.innerHeight / 2 - 406,
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const shellRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Prevent drag from starting if clicking on the close button itself
      if ((e.target as HTMLElement).closest('button')) {
        return;
      }
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    },
    [position],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.body.classList.add('dragging-phone');
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      document.body.classList.remove('dragging-phone');
    }

    return () => {
      document.body.classList.remove('dragging-phone');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Get current time for the phone display
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div
      ref={shellRef}
      className="fixed top-0 left-0 w-[375px] h-[812px] bg-[#1c1c1e] rounded-[40px] shadow-2xl border-[8px] border-black overflow-hidden flex flex-col z-50"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      {/* Phone Notch and Status Bar */}
      <div
        className="w-full h-[44px] bg-black text-white flex-shrink-0 cursor-grab relative"
        onMouseDown={handleMouseDown}
      >
        <div className="w-[150px] h-[30px] bg-black rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 z-10"></div>
        <div className="absolute top-0 left-0 right-0 h-[44px] flex justify-between items-center px-6 text-xs font-bold font-sans">
          <span className="w-1/3">{currentTime}</span>
          <span className="w-1/3 text-center">{title}</span>
          <div className="w-1/3 flex justify-end items-center gap-1.5">
            <WifiIcon className="w-4 h-4" />
            <BatteryIcon className="w-5 h-5 -mr-1" />
          </div>
        </div>
        {/* Close Button positioned inside the draggable header for better UX */}
        <button
          onClick={onClose}
          className="absolute top-1/2 -translate-y-1/2 right-2 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/40 z-20"
          aria-label="Close phone shell"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="w-full flex-grow bg-white overflow-y-auto relative">{children}</div>
    </div>
  );
};
