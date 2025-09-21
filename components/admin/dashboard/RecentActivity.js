import { AdminCard } from '../common/AdminCard'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

export function RecentActivity({ activities = [] }) {
  const getActionIcon = (action) => {
    switch (action) {
      case 'create':
        return '➕'
      case 'update':
        return '✏️'
      case 'delete':
        return '🗑️'
      case 'login':
        return '🔐'
      case 'logout':
        return '🚪'
      default:
        return '📝'
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'create':
        return 'text-green-600'
      case 'update':
        return 'text-blue-600'
      case 'delete':
        return 'text-red-600'
      case 'login':
        return 'text-purple-600'
      case 'logout':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  if (activities.length === 0) {
    return (
      <AdminCard title="Recent Activity">
        <div className="text-center py-8 text-gray-500">
          <p>No recent activity</p>
        </div>
      </AdminCard>
    )
  }

  return (
    <AdminCard title="Recent Activity">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <span className="text-lg">
                {getActionIcon(activity.action)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {activity.admin_users?.name || 'System'}
                </span>
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  getActionColor(activity.action)
                )}>
                  {activity.action}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {activity.resource_type} {activity.resource_id ? `#${activity.resource_id}` : ''}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  )
}
