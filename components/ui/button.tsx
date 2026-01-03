'use client'

import { cn } from '@/lib/utils'
import { forwardRef, ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  className?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          'btn',
          `btn-${variant}`,
          size === 'sm' && 'px-3 py-1 text-xs',
          size === 'lg' && 'px-8 py-3 text-base',
          className
        )}
        data-loading={isLoading}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
