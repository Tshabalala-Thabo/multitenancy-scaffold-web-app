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

    const handleSaveOrganization = async (
        organizationData: Partial<Organisation>,
    ) => {
        setIsLoading(true)
        try {
            let response

            if (editingOrganization) {
                // Update existing organization
                if (organizationData.logo instanceof File) {
                    const formData = createFormData(organizationData, true)
                    response = await axios.post(
                        `/api/tenants/${editingOrganization.id}`,
                        formData,
                        {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        },
                    )
                } else {
                    const { logo, logo_preview, ...dataWithoutLogo } =
                        organizationData
                    response = await axios.put(
                        `/api/tenants/${editingOrganization.id}`,
                        dataWithoutLogo,
                    )
                }
            } else {
                // Create new organization
                if (organizationData.logo instanceof File) {
                    const formData = createFormData(organizationData, false)
                    response = await axios.post('/api/tenants', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    })
                } else {
                    const { logo, logo_preview, ...dataWithoutLogo } =
                        organizationData
                    response = await axios.post('/api/tenants', dataWithoutLogo)
                }
            }

            await fetchOrganizations() // Refresh the list
            setIsModalOpen(false)

            toast({
                title: 'Success',
                description: `Organization ${editingOrganization ? 'updated' : 'created'} successfully`,
                variant: 'default',
            })
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    error.response?.data?.message ||
                    'Failed to save organization',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }
    const createFormData = (data: Partial<Organisation>, isUpdate: boolean) => {
        const formData = new FormData()

        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'logo' && key !== 'logo_preview') {
                if (
                    key === 'address' &&
                    typeof value === 'object' &&
                    value !== null
                ) {
                    Object.entries(value).forEach(
                        ([addressKey, addressValue]) => {
                            formData.append(
                                `address[${addressKey}]`,
                                String(addressValue),
                            )
                        },
                    )
                } else if (key === 'administrators' && Array.isArray(value)) {
                    value.forEach((admin, index) => {
                        Object.entries(admin).forEach(
                            ([adminKey, adminValue]) => {
                                formData.append(
                                    `administrators[${index}][${adminKey}]`,
                                    String(adminValue),
                                )
                            },
                        )
                    })
                } else if (typeof value === 'object' && value !== null) {
                    formData.append(key, JSON.stringify(value))
                } else {
                    formData.append(key, String(value))
                }
            }
        })

        if (data.logo instanceof File) {
            formData.append('logo', data.logo)
        }

        if (isUpdate) {
            formData.append('_method', 'PUT')
            if ('remove_logo' in data && data.remove_logo === true) {
                formData.append('remove_logo', '1')
            } else {
                formData.append('remove_logo', '0')
            }
        }

        return formData
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
        handleSaveOrganization,
        isLoading: isLoading || coreLoading,
        refetchOrganizations: fetchOrganizations,
    }
}
