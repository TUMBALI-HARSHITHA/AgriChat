import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Modal Component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility of the modal
 * @param {function} props.onClose - Function triggered when closing the modal
 * @param {string} [props.title] - Optional modal header title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} [props.footer] - Optional modal footer actions
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Max width size of the modal card
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  roundedClass = 'rounded-3xl',
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-x-hidden overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className={`relative z-10 w-full ${sizes[size]} glass border border-green-900/40 ${roundedClass} overflow-hidden shadow-2xl animate-fadeInUp w-full`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-green-900/20">
          <h3 className="text-base font-bold text-white leading-none">{title || 'Details'}</h3>
          <button 
            onClick={onClose}
            className={`text-gray-500 hover:text-gray-300 transition-colors p-1 ${roundedClass === 'rounded-none' ? 'rounded-none' : 'rounded-lg'} hover:bg-green-900/10 cursor-pointer`}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 text-sm text-gray-300 leading-relaxed max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-green-900/20 bg-green-950/20">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
