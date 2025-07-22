import { useState, useEffect } from 'react';
import { Tenant } from '@/types/tenant';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';

export const useTenant = () => {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
    const [currentView, setCurrentView] = useState('list');
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const router = useRouter();

    const fetchTenants = async () => {
        try {
            const response = await axios.get('/api/tenants');
            setTenants(response.data);
        } catch (error) {
            console.error('Failed to fetch tenants', error);
        }
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    const filteredTenants = tenants.filter(
        (tenant) =>
            tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.administrators.some((admin) => admin.admin_email.toLowerCase().includes(searchTerm.toLowerCase())),
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
            if (editingTenant) {
                const response = await axios.put(`/api/tenants/${editingTenant.id}`, tenantData);
                const updatedTenant = response.data;
                const updatedTenants = tenants.map((t) => (t.id === editingTenant.id ? updatedTenant : t));
                setTenants(updatedTenants);
                if (selectedTenant && selectedTenant.id === editingTenant.id) {
                    setSelectedTenant(updatedTenant);
                }
            } else {
                const response = await axios.post('/api/tenants', tenantData);
                const newTenant = response.data;
                setTenants([...tenants, newTenant]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save tenant', error);
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
