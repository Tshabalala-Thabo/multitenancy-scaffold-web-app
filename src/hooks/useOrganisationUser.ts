import { useState, useCallback } from 'react'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { useToast } from './use-toast'
import { useAuth } from './auth'
import { OrganizationSettings } from '@/types/organisation'

export const useOrganisationUser = () => {
    const router = useRouter()
    const { mutate } = useAuth()
    const [organisationSettings, setOrganisationSettings] = useState<OrganizationSettings | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchOrganisationSettings = useCallback(async (organizationId: number) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await axios.get(`/api/tenants/${organizationId}/settings`)
            const data = response.data

            setOrganisationSettings(data)
            return data
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch organization settings'
            setError(errorMessage)
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
            return null
        } finally {
            setIsLoading(false)
        }
    }, [toast])

    const updateSettings = async (organizationId: number, updatedSettings: Partial<OrganizationSettings>) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await axios.put(
                `/api/tenants/${organizationId}/settings`,
                updatedSettings
            )

            const data = response.data

            setOrganisationSettings(data)
            toast({
                title: 'Success!',
                description: 'Organization settings updated successfully.',
                variant: 'default',
            })
            return data
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update organization settings'
            setError(errorMessage)
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    // Initial fetch can be done manually by calling fetchOrganisationSettings

    const joinOrganisation = async (organisationId: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await axios.post(`/api/tenants/${organisationId}/join`)

            toast({
                title: 'Success!',
                description: 'You have successfully joined the organization.',
                variant: 'default',
            })

            // Refresh the page to show the updated organization list
            await mutate()
            router.refresh()

            return response.data
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || 'Failed to join organization'

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const switchOrganisation = async (organisationId: number) => {
        try {
            await axios.post('/api/tenants/switch', { tenant_id: organisationId })
            await mutate()
            return true
        } catch (error: any) {
            console.error('Failed to switch organization:', error)
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to switch organization',
                variant: 'destructive',
            })
            return false
        }
    }

    const leaveOrganisation = async (organisationId: number) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await axios.post(`/api/tenants/${organisationId}/leave`)

            toast({
                title: 'Success!',
                description: 'You have successfully left the organization.',
                variant: 'default',
            })

            // Clear cache for this organization since user left

            // Refresh the page to show the updated organization list
            await mutate()
            router.refresh()

            return response.data
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || 'Failed to leave organization'

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return {
        // Settings related
        organisationSettings,
        fetchOrganisationSettings,
        updateSettings,

        // Organization actions
        joinOrganisation,
        switchOrganisation,
        leaveOrganisation,

        // State
        isLoading,
        error,
    }
}

export default useOrganisationUser
