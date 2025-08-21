import { useState, useEffect } from 'react'
import { Organisation } from '@/types/organisation'
import axios from '@/lib/axios'
import { useToast } from './use-toast'
import { isApiErrorResponse } from '@/types/api-error'

export const useOrganisationCore = () => {
    const [organisations, setOrganisations] = useState<Organisation[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingOrganisation, setEditingOrganisation] = useState<Organisation | null>(null)
    const [currentView, setCurrentView] = useState('list')
    const [selectedOrganisation, setSelectedOrganisation] = useState<Organisation | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const fetchOrganisations = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('/api/tenants')
            setOrganisations(response.data)
            return response.data
        } catch (error) {
            let errorMessage = 'Failed to fetch organisations'

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

    useEffect(() => {
        fetchOrganisations()
    }, [])

    const filteredOrganisations = organisations.filter(
        organisation =>
            organisation?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            organisation?.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            organisation?.users?.some(user =>
                user?.email?.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
    )

    const handleCreateOrganisation = () => {
        setEditingOrganisation(null)
        setIsModalOpen(true)
    }

    const handleEditOrganisation = (organisation: Organisation) => {
        setEditingOrganisation(organisation)
        setIsModalOpen(true)
    }

    const handleViewOrganisation = (organisation: Organisation) => {
        setSelectedOrganisation(organisation)
        setCurrentView('detail')
    }

    const handleBackToList = () => {
        setCurrentView('list')
        setSelectedOrganisation(null)
    }

    const handleDeleteOrganisation = async (organisationId: number) => {
        setIsLoading(true)
        try {
            await axios.delete(`/api/tenants/${organisationId}`)
            await fetchOrganisations() // Refresh the list

            if (selectedOrganisation && selectedOrganisation.id === organisationId) {
                handleBackToList()
            }

            toast({
                title: 'Success',
                description: 'Organisation deleted successfully',
                variant: 'default',
            })
        } catch (error) {
            let errorMessage = 'Failed to delete organisation'

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

    const handleSaveOrganisation = async (organisationData: Partial<Organisation>) => {
        setIsLoading(true)
        try {
            let response

            if (editingOrganisation) {
                if (organisationData.logo instanceof File) {
                    const formData = createFormData(organisationData, true)
                    response = await axios.post(`/api/tenants/${editingOrganisation.id}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    })
                } else {
                    const { logo, logo_preview, ...dataWithoutLogo } = organisationData
                    response = await axios.put(`/api/tenants/${editingOrganisation.id}`, dataWithoutLogo)
                }
            } else {
                // Create new organisation
                if (organisationData.logo instanceof File) {
                    const formData = createFormData(organisationData, false)
                    response = await axios.post('/api/tenants', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    })
                } else {
                    const { logo, logo_preview, ...dataWithoutLogo } = organisationData
                    response = await axios.post('/api/tenants', dataWithoutLogo)
                }
            }

            await fetchOrganisations()
            setIsModalOpen(false)

            toast({
                title: 'Success',
                description: `Organisation ${editingOrganisation ? 'updated' : 'created'} successfully`,
                variant: 'default',
            })
        } catch (error) {
            let errorMessage = 'Failed to save organisation'

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

    const createFormData = (data: Partial<Organisation>, isUpdate: boolean) => {
        const formData = new FormData()

        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'logo' && key !== 'logo_preview') {
                if (key === 'address' && typeof value === 'object' && value !== null) {
                    Object.entries(value).forEach(([addressKey, addressValue]) => {
                        formData.append(`address[${addressKey}]`, String(addressValue))
                    })
                } else if (key === 'administrators' && Array.isArray(value)) {
                    value.forEach((admin, index) => {
                        Object.entries(admin).forEach(([adminKey, adminValue]) => {
                            formData.append(`administrators[${index}][${adminKey}]`, String(adminValue))
                        })
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
        organisations,
        searchTerm,
        setSearchTerm,
        isModalOpen,
        setIsModalOpen,
        editingOrganisation,
        currentView,
        selectedOrganisation,
        filteredOrganisations,
        handleCreateOrganisation,
        setEditingOrganisation,
        handleEditOrganisation,
        handleViewOrganisation,
        handleBackToList,
        handleDeleteOrganisation,
        handleSaveOrganisation,
        isLoading,
        refetchOrganisations: fetchOrganisations,
    }
}
