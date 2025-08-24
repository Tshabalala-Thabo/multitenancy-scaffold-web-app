import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import { Ban } from '@/types/user-bans'
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { isApiErrorResponse } from '@/types/api-error'

export const useUserBans = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [bans, setBans] = useState<Ban[]>([])
    const [isFetching, setIsFetching] = useState(false)
    const { toast } = useToast()
    const { user } = useAuth()
    const tenantId = user?.tenant_id

    const fetchBans = async () => {
        if (!tenantId) return

        setIsFetching(true)
        try {
            const response = await axios.get(`/api/tenants/${tenantId}/bans`)
            setBans(response.data || [])
        } catch (error: unknown) {
            let errorMessage = 'Failed to fetch user bans'

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
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        fetchBans()
    }, [tenantId])

    const banUser = async (userId: number, reason?: string) => {
        setIsLoading(true)
        try {
            await axios.post(`/api/tenants/${tenantId}/bans`, {
                user_id: userId,
                reason: reason || null,
            })

            toast({
                title: 'Success!',
                description: 'User has been banned successfully.',
                variant: 'default',
            })

            await fetchBans()
        } catch (error: unknown) {
            let errorMessage = 'Failed to ban user'

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
        } finally {
            setIsLoading(false)
        }
    }

    const unbanUser = async (userId: number, reason?: string) => {
        setIsLoading(true)
        try {
            await axios.post(`/api/tenants/${tenantId}/users/${userId}/unban`, {
                reason: reason || null,
            })

            toast({
                title: 'Success!',
                description: 'User has been unbanned successfully.',
                variant: 'default',
            })

            await fetchBans()
        } catch (error: unknown) {
            let errorMessage = 'Failed to unban user'

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
        } finally {
            setIsLoading(false)
        }
    }

    const updateBanReason = async (banId: number, reason: string) => {
        setIsLoading(true)
        try {
            await axios.patch(`/api/tenants/${tenantId}/bans/${banId}`, {
                reason: reason,
            })

            toast({
                title: 'Success!',
                description: 'Ban reason updated successfully.',
                variant: 'default',
            })

            await fetchBans()
        } catch (error: unknown) {
            let errorMessage = 'Failed to update ban reason'

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
        } finally {
            setIsLoading(false)
        }
    }

    const refreshBans = async () => {
        await fetchBans()
    }

    return {
        bans,
        banUser,
        unbanUser,
        updateBanReason,
        refreshBans,
        isLoading,
        isFetching,
    }
}
