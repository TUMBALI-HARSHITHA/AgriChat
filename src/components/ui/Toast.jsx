import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Reusable Toast Component
 * 
 * @param {Object} props
 * @param {string} props.message - Toast body message text
 * @param {'success' | 'error' | 'info' | 'warning'} [props.type='info'] - Style status variant
 * @param {function} props.onClose - Callback triggered to close/dismiss the toast
 * @param {number} [props.duration=4000] - Duration in ms before auto-closing. 0 to disable.
 */
export default function Toast({
  message,
  type = 'info',
  onClose,
  duration = 4000,
}) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="text-green-400 shrink-0" size={18} />,
    error: <AlertCircle className="text-red-400 shrink-0" size={18} />,
    info: <Info className="text-blue-400 shrink-0" size={18} />,
    warning: <AlertTriangle className="text-amber-400 shrink-0" size={18} />,
  };

  const borders = {
    success: 'border-green-800/30 bg-green-950/40 text-green-200',
    error: 'border-red-800/30 bg-red-950/40 text-red-200',
    info: 'border-blue-800/30 bg-blue-950/40 text-blue-200',
    warning: 'border-amber-800/30 bg-amber-950/40 text-amber-200',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg animate-fadeInUp ${borders[type]}`}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button 
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-300 transition-colors p-0.5 rounded cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X size={14} />
      </button>
    </div>
  );
}
