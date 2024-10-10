import React, { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'filled';
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, variant = 'default', size = 'md', type, ...props }, ref) => {
    const variants = {
      default: 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500',
      filled: 'bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-blue-500',
    };

    const sizes = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-2',
      lg: 'px-4 py-3 text-lg',
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={props.id}>
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'w-full rounded-md shadow-sm transition duration-150 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-opacity-50',
            variants[variant],
            sizes[size],
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };