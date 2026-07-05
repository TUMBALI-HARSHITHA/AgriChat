import React from 'react';

/**
 * Reusable Input Component
 * 
 * @param {Object} props
 * @param {string} props.id - Input unique identifier
 * @param {string} props.name - Input name attribute
 * @param {string} [props.type='text'] - Input type (text, password, email, etc.)
 * @param {string} [props.value] - Controlled input value
 * @param {function} [props.onChange] - Change handler function
 * @param {string} [props.label] - Label text displayed above the input
 * @param {string} [props.placeholder] - Placeholder text
 * @param {boolean} [props.required=false] - Mark input as required
 * @param {string} [props.error] - Error message to display below the input
 * @param {React.ReactNode} [props.icon] - Icon element displayed inside the input on the left
 * @param {React.ReactNode} [props.rightElement] - Element displayed inside the input on the right (e.g. eye toggle button)
 * @param {string} [props.className=''] - Additional CSS classes for the input
 */
export default function Input({
  id,
  name,
  type = 'text',
  value,
  onChange,
  label,
  placeholder,
  required = false,
  error,
  icon,
  rightElement,
  className = '',
  ...rest
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          style={{
            paddingLeft: icon ? '2.75rem' : '1rem',
            paddingRight: rightElement ? '2.75rem' : '1rem',
          }}
          className={[
            'w-full py-3 rounded-xl bg-[#0a0f0a] border text-white text-sm placeholder-gray-700 outline-none transition-all',
            error ? 'border-red-500/50 focus:border-red-500' : 'border-green-900/40 focus:border-green-600/60 focus:ring-1 focus:ring-green-600/20',
            className
          ].join(' ')}
          {...rest}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <span className="text-xs text-red-400">{error}</span>
      )}
    </div>
  );
}
