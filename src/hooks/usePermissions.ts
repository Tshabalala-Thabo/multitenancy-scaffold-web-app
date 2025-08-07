import { useAuth } from '@/hooks/auth'
import { useMemo } from 'react'

const usePermissions = () => {
    const { user } = useAuth()

    const currentTenantId = user?.tenant_id

    const permissions = useMemo(() => {
        if (!user || !user.permissions) return []

        if (user.roles?.some(role => role.name === 'super_admin')) {
            return user.permissions
        }

        if (!currentTenantId) return []

        return user.permissions.filter(perm => perm.tenant_id === currentTenantId)
    }, [user, currentTenantId])


    const currentTenantRoles = useMemo(() => {
        if (!user || !user.roles) return []

        if (user.roles.some(role => role.name === 'super_admin')) {
            return user.roles
        }

        if (!currentTenantId) return []

        return user.roles.filter(role => role.tenant_id === currentTenantId)
    }, [user, currentTenantId])


    const hasPermission = (permission: string) => {
        return permissions.some(perm => perm.name === permission)
    }

    const hasAnyPermission = (permissionArray: string[]) => {
        if (!Array.isArray(permissionArray)) return false
        return permissionArray.some(permission => hasPermission(permission))
    }

    const hasAllPermissions = (permissionArray: string[]) => {
        if (!Array.isArray(permissionArray)) return false
        return permissionArray.every(permission => hasPermission(permission))
    }

    const hasRole = (roleName: string) => {
        return currentTenantRoles.some(role => role.name === roleName)
    }

    const hasAnyRole = (roleArray: string[]) => {
        if (!Array.isArray(roleArray)) return false
        return roleArray.some(roleName => hasRole(roleName))
    }

    const can = (permission: string) => hasPermission(permission)

    const cannot = (permission: string) => !hasPermission(permission)

    const getCurrentTenant = () => {
        if (!user || !user.organisations || !currentTenantId) return null

        return user.organisations.find(org => org.id === currentTenantId)
    }

    return {
        currentTenantId,
        currentTenant: getCurrentTenant(),

        permissions,
        currentTenantRoles,

        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        can,
        cannot,

        hasRole,
        hasAnyRole,

        isAdmin: () => hasRole('administrator') || hasRole('admin'),
        isSuperAdmin: () => hasRole('super_admin'),
        isMember: () => hasRole('member'),

        canManageSettings: () => hasPermission('settings:manage'),
        canManageUsers: () => hasPermission('users:manage'),
        canViewReports: () => hasPermission('reports:view'),
        canManageRoles: () => hasPermission('roles:manage'),
        canManagePermissions: () => hasPermission('permissions:manage'),

        debug: {
            user,
            currentTenantId,
            permissions,
            currentTenantRoles
        }
    }
}

export default usePermissions
