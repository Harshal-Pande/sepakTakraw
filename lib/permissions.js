export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EDITOR: 'editor'
}

export const RESOURCES = {
  NEWS: 'news',
  EVENTS: 'events', 
  RESULTS: 'results',
  GENERAL_BODY: 'general_body',
  ELECTIONS: 'elections',
  MYAS: 'myas_compliance',
  ANTI_DOP: 'anti_dop_guidelines',
  RTI: 'rti',
  HISTORY: 'history',
  CONTACT: 'contact',
  HERO_IMAGES: 'hero_images',
  FILES: 'files',
  USERS: 'users',
  SETTINGS: 'settings'
}

export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete'
}

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: {
    // Full access to everything
    '*': [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  [ROLES.ADMIN]: {
    // Content management + user read
    [RESOURCES.NEWS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
    [RESOURCES.EVENTS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
    [RESOURCES.RESULTS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
    [RESOURCES.GENERAL_BODY]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
    [RESOURCES.ELECTIONS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
    [RESOURCES.MYAS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
    [RESOURCES.ANTI_DOP]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
    [RESOURCES.RTI]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
    [RESOURCES.HISTORY]: [ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.CONTACT]: [ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.HERO_IMAGES]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
    [RESOURCES.FILES]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
    [RESOURCES.USERS]: [ACTIONS.READ],
    [RESOURCES.SETTINGS]: [ACTIONS.READ]
  },
  [ROLES.EDITOR]: {
    // Content only
    [RESOURCES.NEWS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.EVENTS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.RESULTS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.GENERAL_BODY]: [ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.ELECTIONS]: [ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.MYAS]: [ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.ANTI_DOP]: [ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.RTI]: [ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.HISTORY]: [ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.CONTACT]: [ACTIONS.READ],
    [RESOURCES.HERO_IMAGES]: [ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.FILES]: [ACTIONS.CREATE, ACTIONS.READ]
  }
}

export const hasPermission = (userRole, resource, action) => {
  const rolePermissions = ROLE_PERMISSIONS[userRole]
  
  if (!rolePermissions) return false
  
  // Super admin has all permissions
  if (rolePermissions['*']) return true
  
  const resourcePermissions = rolePermissions[resource]
  if (!resourcePermissions) return false
  
  return resourcePermissions.includes(action)
}

export const checkPermission = (user, resource, action) => {
  if (!user || !user.role) return false
  return hasPermission(user.role, resource, action)
}
