import axios from '@/lib/axios'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Organisation } from '@/types/organisation'
import { useOrganisationCore } from './useOrganisationCore'

export const useOrganisationSuperAdmin = () => {
    const {
        organizations,
        fetchOrganizations,
        isLoading: coreLoading,
    } = useOrganisationCore()
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingOrganization, setEditingOrganization] =
        useState<Organisation | null>(null)
    const [currentView, setCurrentView] = useState('list')
    const [selectedOrganization, setSelectedOrganization] =
        useState<Organisation | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const filteredOrganizations = organizations.filter(
        organization =>
            organization?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            organization?.slug
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            organization?.users?.some(user =>
                user?.email?.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
    )

    const handleCreateOrganization = () => {
        setEditingOrganization(null)
        setIsModalOpen(true)
    }

    const handleEditOrganization = (organization: Organisation) => {
        setEditingOrganization(organization)
        setIsModalOpen(true)
    }

    const handleViewOrganization = (organization: Organisation) => {
        setSelectedOrganization(organization)
        setCurrentView('detail')
    }

    const handleBackToList = () => {
        setCurrentView('list')
        setSelectedOrganization(null)
    }

    const handleDeleteOrganization = async (organizationId: number) => {
        setIsLoading(true)
        try {
            await axios.delete(`/api/tenants/${organizationId}`)
            await fetchOrganizations() // Refresh the list

            if (
                selectedOrganization &&
                selectedOrganization.id === organizationId
            ) {
                handleBackToList()
            }

            toast({
                title: 'Success',
                description: 'Organization deleted successfully',
                variant: 'default',
            })
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    error.response?.data?.message ||
                    'Failed to delete organization',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }



    return {
        organizations,
        searchTerm,
        setSearchTerm,
        isModalOpen,
        setIsModalOpen,
        editingOrganization,
        currentView,
        selectedOrganization,
        filteredOrganizations,
        handleCreateOrganization,
        handleEditOrganization,
        handleViewOrganization,
        handleBackToList,
        handleDeleteOrganization,
        isLoading: isLoading || coreLoading,
        refetchOrganizations: fetchOrganizations,
    }
}
