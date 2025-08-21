import axios from '@/lib/axios'
import { useToast } from '@/hooks/use-toast'
import { useState, useCallback } from 'react'

export interface OrganizationUser {
    id: number
    name: string
    email: string
    role: string
    status: 'active' | 'pending' | 'inactive'
    joined_at: string
    last_active?: string
}

export const useOrganisationUsers = () => {
    const [users, setUsers] = useState<OrganizationUser[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchOrganizationUsers = useCallback(async (organizationId: number) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.get(`/api/tenants/${organizationId}/users`)
            const data = response.data
            setUsers(data)
            return data
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch organization users'
            setError(errorMessage)
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
            return []
        } finally {
            setIsLoading(false)
        }
    }, [toast])

    const inviteUser = async (organizationId: number, email: string, role: string = 'member') => {
        setIsLoading(true)
        try {
            const response = await axios.post(`/api/tenants/${organizationId}/users/invite`, {
                email,
                role,
            })

            toast({
                title: 'Success!',
                description: 'User invitation sent successfully.',
                variant: 'default',
            })

            // Refresh users list
            await fetchOrganizationUsers(organizationId)
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

    const updateUserRole = async (organizationId: number, userId: number, role: string) => {
        setIsLoading(true)
        try {
            const response = await axios.put(`/api/tenants/${organizationId}/users/${userId}`, {
                role,
            })

            toast({
                title: 'Success!',
                description: 'User role updated successfully.',
                variant: 'default',
            })

            setUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, role } : user
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

    const removeUser = async (organizationId: number, userId: number) => {
        setIsLoading(true)
        try {
            await axios.delete(`/api/tenants/${organizationId}/users/${userId}`)

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

    return {
        users,
        isLoading,
        error,
        fetchOrganizationUsers,
        inviteUser,
        updateUserRole,
        removeUser,
    }
}
