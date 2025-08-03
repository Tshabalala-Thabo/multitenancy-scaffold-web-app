import { useState } from 'react'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { useToast } from './use-toast'
import { useAuth } from './auth'

export const useOrganisationUser = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()
    const router = useRouter()
    const { mutate } = useAuth()

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
        } catch (error) {
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
        joinOrganisation,
        switchOrganisation,
        leaveOrganisation,
        isLoading,
        error,
    }
}

export default useOrganisationUser
