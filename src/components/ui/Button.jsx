import React from 'react';

/**
 * Reusable Button Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label or nested elements
 * @param {'primary' | 'secondary' | 'danger' | 'ghost'} [props.variant='primary'] - Button style variant
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Button size
 * @param {boolean} [props.isLoading=false] - Shows loading spinner if true
 * @param {boolean} [props.disabled=false] - Disables the button
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...rest
}) {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-br from-green-500 to-green-700 text-white hover:from-green-400 hover:to-green-600 hover:shadow-lg hover:shadow-green-900/20 active:scale-95',
    secondary: 'bg-transparent text-green-400 border border-green-700/30 hover:bg-green-900/10 hover:border-green-600/50 active:scale-95',
    danger: 'bg-gradient-to-br from-red-600 to-red-800 text-white hover:from-red-500 hover:to-red-700 hover:shadow-lg hover:shadow-red-900/20 active:scale-95',
    ghost: 'bg-transparent text-gray-400 hover:bg-green-900/10 hover:text-green-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {isLoading && (
        <span className="w-4 h-4 mr-2 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />
      )}
      {children}
    </button>
  );
}
