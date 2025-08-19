import { useState, useCallback } from 'react'
import axios from '@/lib/axios'
import { useToast } from '@/hooks/use-toast'
import { isApiErrorResponse } from '@/types/api-error'
import { OrganizationSettings } from '@/types/organisation'

export interface BasicInfoData {
    name: string
    domain: string
    address: {
        street_address: string
        suburb: string
        city: string
        province: string
        postal_code: string
    }
}

export const useOrganisationSettings = () => {
    const [organizationSettings, setOrganizationSettings] = useState<OrganizationSettings | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchOrganizationSettings = useCallback(async (organizationId: number) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.get(`/api/tenants/${organizationId}/settings`)
            const data = response.data
            setOrganizationSettings(data)
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
            const response = await axios.put(`/api/tenants/${organizationId}/settings`, updatedSettings)
            const data = response.data
            setOrganizationSettings(data)
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

    const updateBasicInfo = async (organizationId: number, data: BasicInfoData | FormData) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.post(`/api/tenants/${organizationId}/basic-info`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            const updatedData = response.data
            setOrganizationSettings(prev => {
                if (!prev) return null
                return {
                    ...prev,
                    name: updatedData.name,
                    domain: updatedData.domain,
                    address: updatedData.address,
                    ...(updatedData.logo_url !== undefined && {
                        logo_url: updatedData.logo_url,
                    }),
                }
            })

            toast({
                title: 'Success!',
                description: 'Organization information updated successfully.',
                variant: 'default',
            })
            return updatedData
        } catch (error: unknown) {
            let errorMessage = 'Failed to update organization information'
            if (isApiErrorResponse(error)) {
                errorMessage = error.response?.data?.message || errorMessage
                if (!error.response?.data?.errors) {
                    setError(errorMessage)
                }
            } else if (error instanceof Error) {
                errorMessage = error.message
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
        organizationSettings,
        isLoading,
        error,
        fetchOrganizationSettings,
        updateSettings,
        updateBasicInfo,
    }
}
