import { AdminCard } from '../common/AdminCard'
import { cn } from '@/lib/utils'

export function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  className,
  trend = 'up' 
}) {
  const changeColor = trend === 'up' ? 'text-green-600' : 'text-red-600'
  const changeBg = trend === 'up' ? 'bg-green-100' : 'bg-red-100'

  return (
    <AdminCard className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                changeBg,
                changeColor
              )}>
                {change}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-primary-blue/10 rounded-lg">
            <Icon className="w-6 h-6 text-primary-blue" />
          </div>
        )}
      </div>
    </AdminCard>
  )
}
