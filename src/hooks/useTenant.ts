import { useState, useEffect } from 'react';
import { Tenant } from '@/types/tenant';
import axios from '@/lib/axios';

export const useTenant = () => {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
    const [currentView, setCurrentView] = useState('list');
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

    const fetchTenants = async () => {
        try {
            const response = await axios.get('/api/tenants');
            setTenants(response.data);
        } catch (error) {
            console.error('Failed to fetch tenants', error);
        }
    };

    useEffect(() => {
        if (tenants) {
            console.log("tenants", tenants)
        }
    }, [tenants])

    useEffect(() => {
        fetchTenants();
    }, []);

    const filteredTenants = tenants.filter((tenant) =>
        tenant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant?.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant?.users?.some((user) => user?.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleCreateTenant = () => {
        setEditingTenant(null);
        setIsModalOpen(true);
    };

    const handleEditTenant = (tenant: Tenant) => {
        setEditingTenant(tenant);
        setIsModalOpen(true);
    };

    const handleViewTenant = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setCurrentView('detail');
    };

    const handleBackToList = () => {
        setCurrentView('list');
        setSelectedTenant(null);
    };

    const handleDeleteTenant = async (tenantId: number) => {
        try {
            await axios.delete(`/api/tenants/${tenantId}`);
            setTenants(tenants.filter((t) => t.id !== tenantId));
            if (selectedTenant && selectedTenant.id === tenantId) {
                handleBackToList();
            }
        } catch (error) {
            console.error('Failed to delete tenant', error);
        }
    };

    const handleSaveTenant = async (tenantData: Partial<Tenant>) => {
        try {
            let response;

            if (editingTenant) {
                if (tenantData.logo instanceof File) {
                    const formData = new FormData();

                    Object.entries(tenantData).forEach(([key, value]) => {
                        if (key !== 'logo' && key !== 'logo_preview') {
                            if (key === 'address' && typeof value === 'object' && value !== null) {
                                Object.entries(value).forEach(([addressKey, addressValue]) => {
                                    formData.append(`address[${addressKey}]`, String(addressValue));
                                });
                            } else if (key === 'administrators' && Array.isArray(value)) {
                                value.forEach((admin, index) => {
                                    Object.entries(admin).forEach(([adminKey, adminValue]) => {
                                        formData.append(`administrators[${index}][${adminKey}]`, String(adminValue));
                                    });
                                });
                            } else if (typeof value === 'object' && value !== null) {
                                formData.append(key, JSON.stringify(value));
                            } else {
                                formData.append(key, String(value));
                            }
                        }
                    });

                    formData.append('logo', tenantData.logo);

                    formData.append('_method', 'PUT');

                    response = await axios.post(`/api/tenants/${editingTenant.id}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                } else {
                    const { logo, logo_preview, ...dataWithoutLogo } = tenantData;
                    response = await axios.put(`/api/tenants/${editingTenant.id}`, dataWithoutLogo);
                }

                const updatedTenant = response.data;
                const updatedTenants = tenants.map((t) => (t.id === editingTenant.id ? updatedTenant : t));
                setTenants(updatedTenants);
                if (selectedTenant && selectedTenant.id === editingTenant.id) {
                    setSelectedTenant(updatedTenant);
                }
            } else {
                if (tenantData.logo instanceof File) {
                    const formData = new FormData();

                    Object.entries(tenantData).forEach(([key, value]) => {
                        if (key !== 'logo' && key !== 'logo_preview') {
                            if (key === 'address' && typeof value === 'object' && value !== null) {
                                Object.entries(value).forEach(([addressKey, addressValue]) => {
                                    formData.append(`address[${addressKey}]`, String(addressValue));
                                });
                            } else if (key === 'administrators' && Array.isArray(value)) {
                                value.forEach((admin, index) => {
                                    Object.entries(admin).forEach(([adminKey, adminValue]) => {
                                        formData.append(`administrators[${index}][${adminKey}]`, String(adminValue));
                                    });
                                });
                            } else if (typeof value === 'object' && value !== null) {
                                formData.append(key, JSON.stringify(value));
                            } else {
                                formData.append(key, String(value));
                            }
                        }
                    });

                    formData.append('logo', tenantData.logo);

                    response = await axios.post('/api/tenants', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                } else {
                    const { logo, logo_preview, ...dataWithoutLogo } = tenantData;
                    response = await axios.post('/api/tenants', dataWithoutLogo);
                }

                const newTenant = response.data;
                setTenants([...tenants, newTenant]);
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save tenant', error);

            // Handle validation errors from the backend
            // if (error.response?.data?.errors) {
            //     setErrors(error.response.data.errors);
            // }
        }
    };

    return {
        tenants,
        searchTerm,
        setSearchTerm,
        isModalOpen,
        setIsModalOpen,
        editingTenant,
        currentView,
        selectedTenant,
        filteredTenants,
        handleCreateTenant,
        handleEditTenant,
        handleViewTenant,
        handleBackToList,
        handleDeleteTenant,
        handleSaveTenant,
    };
};
