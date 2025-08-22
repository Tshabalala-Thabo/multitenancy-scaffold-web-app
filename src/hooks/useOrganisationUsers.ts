import axios from '@/lib/axios'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/auth'
import { useState, useCallback, useEffect, useRef } from 'react'
import { isApiErrorResponse } from '@/types/api-error'

// Updated interface to match API response
export interface ApiRole {
    id: number
    tenant_id: number
    name: string
    guard_name: string
    is_custom: number
    created_at: string
    updated_at: string
    pivot: {
        model_type: string
        model_id: number
        role_id: number
        tenant_id: number
    }
}

export interface ApiOrganisationUser {
    id: number
    name: string
    last_name: string
    email: string
    email_verified_at: string | null
    created_at: string
    updated_at: string
    current_tenant_id: number
    pivot: {
        tenant_id: number
        user_id: number
        created_at: string
        updated_at: string
    }
    roles: ApiRole[]
}

// Transformed interface for UI consumption
export interface OrganisationUser {
    id: number
    name: string
    last_name: string
    email: string
    avatar_url?: string
    roles: string[]
    join_date: string
    last_activity?: string
    status?: 'active' | 'pending' | 'inactive' | 'suspended'
}

export const useOrganisationUsers = () => {
    const { user } = useAuth()
    const [users, setUsers] = useState<OrganisationUser[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()
    const hasInitialized = useRef(false)

    const organisationId = user?.tenant_id

    // Transform API data to UI format
    const transformApiUser = (apiUser: ApiOrganisationUser): OrganisationUser => {
        return {
            id: apiUser.id,
            name: apiUser.name,
            last_name: apiUser.last_name,
            email: apiUser.email,
            avatar_url: '/placeholder.svg?height=32&width=32', // Default avatar
            roles: apiUser.roles.map(role => role.name),
            join_date: apiUser.pivot.created_at,
            last_activity: apiUser.updated_at,
            status: undefined, // Leave undefined as requested
        }
    }

    const fetchOrganisationUsers = useCallback(async (orgId?: number) => {
        const targetOrgId = orgId || organisationId
        if (!targetOrgId) return []

        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.get(`/api/tenants/${targetOrgId}/users`)
            const apiUsers: ApiOrganisationUser[] = response.data

            // Transform API data to UI format
            const transformedUsers = apiUsers.map(transformApiUser)

            setUsers(transformedUsers)
            return transformedUsers
        } catch (err: unknown) {
            let errorMessage = 'Failed to fetch users'
            if (isApiErrorResponse(err)) {
                errorMessage = err.response?.data?.message || errorMessage
                if (!err.response?.data?.errors) {
                    setError(errorMessage)
                }
            } else if (err instanceof Error) {
                errorMessage = err.message
                setError(errorMessage)
            }
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
            return []
        } finally {
            setIsLoading(false)
        }
    }, [organisationId, toast])

    // Auto-fetch users when user is authenticated and has tenant_id
    useEffect(() => {
        if (organisationId && !hasInitialized.current) {
            hasInitialized.current = true
            fetchOrganisationUsers()
        }
    }, [organisationId, fetchOrganisationUsers])

    // Reset when organizationId changes (if user switches organizations)
    useEffect(() => {
        hasInitialized.current = false
        setUsers([])
        setError(null)
    }, [organisationId])

    const inviteUser = async (email: string, role: string = 'member') => {
        if (!organisationId) {
            toast({
                title: 'Error',
                description: 'No organization found. Please ensure you are logged in.',
                variant: 'destructive',
            })
            return
        }

        setIsLoading(true)
        try {
            const response = await axios.post(`/api/tenants/${organisationId}/users/invite`, {
                email,
                role,
            })

            toast({
                title: 'Success!',
                description: 'User invitation sent successfully.',
                variant: 'default',
            })

            // Refresh users list
            await fetchOrganisationUsers()
            return response.data
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to invite user'
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const updateUserRole = async (userId: number, role: string) => {
        if (!organisationId) {
            toast({
                title: 'Error',
                description: 'No organization found. Please ensure you are logged in.',
                variant: 'destructive',
            })
            return
        }

        setIsLoading(true)
        try {
            const response = await axios.put(`/api/tenants/${organisationId}/users/${userId}`, {
                role,
            })

            toast({
                title: 'Success!',
                description: 'User role updated successfully.',
                variant: 'default',
            })

            // Update user roles in state
            setUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, roles: [role] } : user
            ))

            return response.data
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update user role'
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const removeUser = async (userId: number) => {
        if (!organisationId) {
            toast({
                title: 'Error',
                description: 'No organization found. Please ensure you are logged in.',
                variant: 'destructive',
            })
            return
        }

        setIsLoading(true)
        try {
            await axios.delete(`/api/tenants/${organisationId}/users/${userId}`)

            toast({
                title: 'Success!',
                description: 'User removed from organization successfully.',
                variant: 'default',
            })

            setUsers(prev => prev.filter(user => user.id !== userId))
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to remove user'
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const banUser = async (userId: number, reason?: string) => {
        if (!organisationId) {
            toast({
                title: 'Error',
                description: 'No organization found. Please ensure you are in a valid organisation.',
                variant: 'destructive',
            })
            return
        }

        setIsLoading(true)
        try {
            const payload: { reason?: string } = {}
            if (reason) {
                payload.reason = reason
            }

            const response = await axios.post(`/api/tenants/${organisationId}/users/${userId}/ban`, payload)

            toast({
                title: 'Success!',
                description: 'User has been banned from the organisation.',
                variant: 'default',
            })

            // Refresh users list to reflect the ban
            await fetchOrganisationUsers()
            return response.data
        } catch (err: unknown) {
            let errorMessage = 'Failed to ban user'

            if (isApiErrorResponse(err)) {
                errorMessage = err.response?.data?.message || errorMessage
                if (!err.response?.data?.errors) {
                    setError(errorMessage)
                }
            } else if (err instanceof Error) {
                errorMessage = err.message
                setError(errorMessage)
            }
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return {
        users,
        isLoading,
        error,
        organisationId,
        fetchOrganisationUsers,
        inviteUser,
        updateUserRole,
        removeUser,
        banUser,
        refetch: () => fetchOrganisationUsers(),
    }
}
