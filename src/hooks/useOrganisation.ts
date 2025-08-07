import { useState, useEffect } from 'react'
import { Organisation } from '@/types/organisation'
import axios from '@/lib/axios'
import { useToast } from './use-toast'

export const useOrganisation = () => {
    const [organisations, setOrganisations] = useState<Organisation[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingOrganisation, setEditingOrganisation] =
        useState<Organisation | null>(null)
    const [currentView, setCurrentView] = useState('list')
    const [selectedOrganisation, setSelectedOrganisation] =
        useState<Organisation | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    //const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchOrganisations = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('/api/tenants')
            setOrganisations(response.data)
        } catch (error) {
            console.error('Failed to fetch organisations:', error)
            toast({
                title: 'Error',
                description:
                    error.response?.data?.message ||
                    'Failed to fetch organisations',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (organisations) {
            console.log('organisations', organisations)
        }
    }, [organisations])

    useEffect(() => {
        fetchOrganisations()
    }, [])

    const filteredOrganisations = organisations.filter(
        organisation =>
            organisation?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            organisation?.slug
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
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
        try {
            await axios.delete(`/api/tenants/${organisationId}`)
            setOrganisations(organisations.filter(t => t.id !== organisationId))
            if (
                selectedOrganisation &&
                selectedOrganisation.id === organisationId
            ) {
                handleBackToList()
            }
        } catch (error) {
            console.error('Failed to delete organisation', error)
        }
    }

    const handleSaveOrganisation = async (
        organisationData: Partial<Organisation>,
    ) => {
        try {
            let response

            if (editingOrganisation) {
                if (organisationData.logo instanceof File) {
                    const formData = new FormData()

                    Object.entries(organisationData).forEach(([key, value]) => {
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
                            } else if (
                                key === 'administrators' &&
                                Array.isArray(value)
                            ) {
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
                            } else if (
                                typeof value === 'object' &&
                                value !== null
                            ) {
                                formData.append(key, JSON.stringify(value))
                            } else {
                                formData.append(key, String(value))
                            }
                        }
                    })

                    formData.append('logo', organisationData.logo)
                    if (
                        'remove_logo' in organisationData &&
                        organisationData.remove_logo === true
                    ) {
                        formData.append('remove_logo', '1')
                    } else {
                        formData.append('remove_logo', '0')
                    }

                    formData.append('_method', 'PUT')

                    response = await axios.post(
                        `/api/tenants/${editingOrganisation.id}`,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        },
                    )
                } else {
                    const { ...dataWithoutLogo } = organisationData
                    response = await axios.put(
                        `/api/tenants/${editingOrganisation.id}`,
                        dataWithoutLogo,
                    )
                }

                const updatedOrganisation = response.data
                const updatedOrganisations = organisations.map(t =>
                    t.id === editingOrganisation.id ? updatedOrganisation : t,
                )
                setOrganisations(updatedOrganisations)
                if (
                    selectedOrganisation &&
                    selectedOrganisation.id === editingOrganisation.id
                ) {
                    setSelectedOrganisation(updatedOrganisation)
                }
            } else {
                if (organisationData.logo instanceof File) {
                    const formData = new FormData()

                    Object.entries(organisationData).forEach(([key, value]) => {
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
                            } else if (
                                key === 'administrators' &&
                                Array.isArray(value)
                            ) {
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
                            } else if (
                                typeof value === 'object' &&
                                value !== null
                            ) {
                                formData.append(key, JSON.stringify(value))
                            } else {
                                formData.append(key, String(value))
                            }
                        }
                    })

                    formData.append('logo', organisationData.logo)

                    response = await axios.post('/api/tenants', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                } else {
                    const { logo, logo_preview, ...dataWithoutLogo } =
                        (response = await axios.post(
                            '/api/tenants',
                            dataWithoutLogo,
                        ))
                }

                const newOrganisation = response.data
                setOrganisations([...organisations, newOrganisation])
            }

            setIsModalOpen(false)
        } catch (error) {
            console.error('Failed to save organisation', error)

            // Handle validation errors from the backend
            // if (error.response?.data?.errors) {
            //     setErrors(error.response.data.errors);
            // }
        }
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
        handleEditOrganisation,
        handleViewOrganisation,
        handleBackToList,
        handleDeleteOrganisation,
        handleSaveOrganisation,
        isLoading,
    }
}
