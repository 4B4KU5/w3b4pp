import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
}

export function Card({ children, className, title }: CardProps) {
  return (
    <div className={cn('card', className)}>
      {title && (
        <h3 className="mb-4 text-xl font-semibold text-fg-primary">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}
