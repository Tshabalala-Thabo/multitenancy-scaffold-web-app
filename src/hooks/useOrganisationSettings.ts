import { useState, useCallback } from 'react'
import axios from '@/lib/axios'
import { useToast } from '@/hooks/use-toast'
import { isApiErrorResponse } from '@/types/api-error'
import { OrganisationSettings } from '@/types/organisation'

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

export interface AccessControlData {
    privacy_setting: 'public' | 'private'
    two_factor_auth_required: boolean
    password_policy: {
        min_length: number
        requires_uppercase: boolean
        requires_lowercase: boolean
        requires_number: boolean
        requires_symbol: boolean
    }
}

export const useOrganisationSettings = () => {
    const [organisationSettings, setOrganisationSettings] = useState<OrganisationSettings | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchOrganizationSettings = useCallback(async (organizationId: number) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.get(`/api/tenants/${organizationId}/settings`)
            const data = response.data
            setOrganisationSettings(data)
            return data
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch organisation settings'
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

    const updateSettings = async (organisationId: number, updatedSettings: Partial<OrganisationSettings>) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.put(`/api/tenants/${organisationId}/settings`, updatedSettings)
            const data = response.data
            setOrganisationSettings(data)
            toast({
                title: 'Success!',
                description: 'Organization settings updated successfully.',
                variant: 'default',
            })
            return data
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update organisation settings'
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

    const updateBasicInfo = async (organisationId: number, data: BasicInfoData | FormData) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.post(`/api/tenants/${organisationId}/basic-info`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            const updatedData = response.data
            setOrganisationSettings(prev => {
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
                description: 'Organisation information updated successfully.',
                variant: 'default',
            })
            return updatedData
        } catch (error: unknown) {
            let errorMessage = 'Failed to update organisation information'
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

    const updateAccessControl = async (
        organizationId: number,
        data: AccessControlData,
    ) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await axios.put(
                `/api/tenants/${organizationId}/access-control`,
                data,
            )

            const updatedData = response.data

            setOrganisationSettings(prev => {
                if (!prev) return null
                return {
                    ...prev,
                    privacy_setting: updatedData.privacy_setting,
                    two_factor_auth_required: updatedData.two_factor_auth_required,
                    password_policy: {
                        ...prev.password_policy,
                        ...updatedData.password_policy,
                    },
                }
            })

            toast({
                title: 'Success!',
                description: 'Access control settings updated successfully.',
                variant: 'default',
            })

        } catch (error: unknown) {
            let errorMessage = 'Failed to update access control settings'

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
        } finally {
            setIsLoading(false)
        }

    }
    return {
        updateAccessControl,
        isLoading,
        error,
        fetchOrganizationSettings,
        updateSettings,
        updateBasicInfo,
    }
}

