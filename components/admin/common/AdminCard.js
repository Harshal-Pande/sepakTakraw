import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function AdminCard({ 
  className, 
  children, 
  title, 
  description, 
  header,
  content,
  footer,
  ...props 
}) {
  return (
    <Card className={cn("bg-white text-gray-900 shadow-sm border border-gray-200", className)} {...props}>
      {header && <CardHeader>{header}</CardHeader>}
      {title && (
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-gray-600">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      {content && <CardContent>{content}</CardContent>}
      {children}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}
