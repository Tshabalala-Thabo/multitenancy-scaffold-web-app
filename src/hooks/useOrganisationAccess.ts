import axios from '@/lib/axios'
import { useState } from 'react'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { isApiErrorResponse } from '@/types/api-error'

export const useOrganisationAccess = () => {
    const router = useRouter()
    const { mutate } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const joinOrganisation = async (organizationId: string) => {
        setIsLoading(true)
        try {
            await axios.post(`/api/tenants/${organizationId}/join`)

            toast({
                title: 'Success!',
                description: 'You have successfully joined the organization.',
                variant: 'default',
            })

            await mutate()
            router.refresh()
        } catch (error: unknown) {
            let errorMessage = 'Failed to join organization'

            if (isApiErrorResponse(error)) {
                errorMessage = error.response?.data?.message || errorMessage
            } else if (error instanceof Error) {
                errorMessage = error.message
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

    const leaveOrganisation = async (organizationId: number) => {
        setIsLoading(true)
        try {
            await axios.post(`/api/tenants/${organizationId}/leave`)

            toast({
                title: 'Success!',
                description: 'You have successfully left the organization.',
                variant: 'default',
            })

            await mutate()
            router.refresh()
        } catch (error: unknown) {
            let errorMessage = 'Failed to leave organization'

            if (isApiErrorResponse(error)) {
                errorMessage = error.response?.data?.message || errorMessage
            } else if (error instanceof Error) {
                errorMessage = error.message
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

    const switchOrganisation = async (organizationId: number) => {
        setIsLoading(true)
        try {
            await axios.post('/api/tenants/switch', {
                tenant_id: organizationId,
            })
            await mutate()
            return true
        } catch (error: unknown) {
            let errorMessage = 'Failed to switch organization'

            if (isApiErrorResponse(error)) {
                errorMessage = error.response?.data?.message || errorMessage
            } else if (error instanceof Error) {
                errorMessage = error.message
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
        joinOrganisation,
        leaveOrganisation,
        switchOrganisation,
        isLoading,
    }
}
