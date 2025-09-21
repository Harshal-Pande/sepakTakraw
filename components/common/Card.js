import { Card as ShadcnCard } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function Card({ 
  children, 
  className, 
  variant = 'default',
  hover = false,
  ...props 
}) {
  const variants = {
    default: 'bg-card-gradient border border-gray-200',
    elevated: 'bg-white shadow-lg border-0',
    outlined: 'bg-transparent border-2 border-primary-blue',
    gold: 'bg-primary-gold text-primary-blue border-0',
    blue: 'bg-primary-blue text-white border-0',
  }

  return (
    <ShadcnCard
      className={cn(
        'transition-all duration-200',
        variants[variant],
        hover && 'hover:shadow-lg hover:scale-105',
        className
      )}
      {...props}
    >
      {children}
    </ShadcnCard>
  )
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={cn('p-6 pb-0', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p
      className={cn('text-sm text-muted-foreground mt-2', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function CardContent({ children, className, ...props }) {
  return (
    <div
      className={cn('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  )
}
