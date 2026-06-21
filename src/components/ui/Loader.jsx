import React from 'react';

/**
 * Reusable Loader Component
 * 
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Spinner size
 * @param {'green' | 'white' | 'gray'} [props.color='green'] - Spinner color theme
 * @param {boolean} [props.fullscreen=false] - If true, displays overlaying the full viewport
 * @param {string} [props.text] - Optional loading description text below spinner
 */
export default function Loader({
  size = 'md',
  color = 'green',
  fullscreen = false,
  text,
}) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colors = {
    green: 'border-green-900/30 border-t-green-400',
    white: 'border-white/20 border-t-white',
    gray: 'border-gray-800 border-t-gray-400',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div 
        className={`rounded-full animate-spin ${sizes[size]} ${colors[color]}`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <span className="text-xs text-gray-500 font-semibold tracking-wider uppercase animate-pulse">{text}</span>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f0a]/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}
