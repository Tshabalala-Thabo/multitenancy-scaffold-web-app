import axios from '@/lib/axios'
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Organisation } from '@/types/organisation'

export const useOrganisationCore = () => {
    const [organizations, setOrganizations] = useState<Organisation[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const fetchOrganizations = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('/api/tenants')
            setOrganizations(response.data)
            return response.data
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to fetch organizations',
                variant: 'destructive',
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrganizations()
    }, [])

    return {
        organizations,
        fetchOrganizations,
        isLoading,
    }
}
