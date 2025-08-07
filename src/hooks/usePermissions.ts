// hooks/usePermissions.js
import { useAuth } from '@/hooks/auth'
import { useMemo } from 'react'

const usePermissions = () => {
    const { user } = useAuth()

    const currentTenantId = user?.tenant_id

    const permissions = useMemo(() => {
        if (!user || !user.permissions) return []

        // Super admin has all permissions regardless of tenant
        if (user.roles?.some(role => role.name === 'super_admin')) {
            return user.permissions
        }

        if (!currentTenantId) return []

        // Filter permissions for current tenant
        return user.permissions.filter(perm => perm.tenant_id === currentTenantId)
    }, [user, currentTenantId])


    const currentTenantRoles = useMemo(() => {
        if (!user || !user.roles) return []

        // Super admin has all roles regardless of tenant
        if (user.roles.some(role => role.name === 'super_admin')) {
            return user.roles
        }

        if (!currentTenantId) return []

        return user.roles.filter(role => role.tenant_id === currentTenantId)
    }, [user, currentTenantId])


    const hasPermission = (permission) => {
        return permissions.some(perm => perm.name === permission)
    }

    const hasAnyPermission = (permissionArray) => {
        if (!Array.isArray(permissionArray)) return false
        return permissionArray.some(permission => hasPermission(permission))
    }

    const hasAllPermissions = (permissionArray) => {
        if (!Array.isArray(permissionArray)) return false
        return permissionArray.every(permission => hasPermission(permission))
    }

    const hasRole = (roleName) => {
        return currentTenantRoles.some(role => role.name === roleName)
    }

    const hasAnyRole = (roleArray) => {
        if (!Array.isArray(roleArray)) return false
        return roleArray.some(roleName => hasRole(roleName))
    }

    const can = (permission) => hasPermission(permission)

    const cannot = (permission) => !hasPermission(permission)

    const getCurrentTenant = () => {
        if (!user || !user.organisations || !currentTenantId) return null

        return user.organisations.find(org => org.id === currentTenantId)
    }

    const switchTenant = (tenantId) => {
        // This would typically trigger an API call to switch tenant context
        // Implementation depends on your auth system
        console.warn('switchTenant should be implemented in your auth context')
    }

    return {
        // Current tenant info
        currentTenantId,
        currentTenant: getCurrentTenant(),

        // Permissions for current tenant
        permissions,
        currentTenantRoles,

        // Permission checks
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        can,
        cannot,

        // Role checks
        hasRole,
        hasAnyRole,

        // Convenience methods
        isAdmin: () => hasRole('administrator') || hasRole('admin'),
        isSuperAdmin: () => hasRole('super_admin'),
        isMember: () => hasRole('member'),

        // Common permission shortcuts
        canManageSettings: () => hasPermission('settings:manage'),
        canManageUsers: () => hasPermission('users:manage'),
        canViewReports: () => hasPermission('reports:view'),
        canManageRoles: () => hasPermission('roles:manage'),
        canManagePermissions: () => hasPermission('permissions:manage'),

        // Utility functions
        switchTenant,

        // Debug info (remove in production)
        debug: {
            user,
            currentTenantId,
            permissions,
            currentTenantRoles
        }
    }
}

export default usePermissions
