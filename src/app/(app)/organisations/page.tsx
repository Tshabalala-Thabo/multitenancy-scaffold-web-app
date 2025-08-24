'use client'

import { useState } from 'react'
import usePermissions from '@/hooks/usePermissions'
import { Organisation } from '@/types/organisation'
import { OrganisationForm } from '@/components/OrganisationForm'
import { useOrganisationCore } from '@/hooks/useOrganisationCore'
import { OrganisationListView } from './components/OrganisationListView'
import { UserOrganisationView } from './components/UserOrganisationView'
import { OrganisationDetailView } from './components/OrganisationDetailView'

export default function OrganisationsPage() {
    const [currentView, setCurrentView] = useState('list')
    const [selectedOrganisation, setSelectedOrganisation] =
        useState<Organisation | null>(null)

    const {
        searchTerm,
        setSearchTerm,
        isModalOpen,
        setIsModalOpen,
        filteredOrganisations,
        handleSaveOrganisation,
        editingOrganisation,
        setEditingOrganisation,
        isLoading
    } = useOrganisationCore()

    const { isSuperAdmin } = usePermissions()

    const handleViewOrganisation = (organisation: Organisation) => {
        setSelectedOrganisation(organisation)
        setCurrentView('detail')
    }

    const handleBackToList = () => {
        setCurrentView('list')
        setSelectedOrganisation(null)
    }

    const handleCreateOrganisation = () => {
        setEditingOrganisation(null)
        setIsModalOpen(true)
    }

    const handleEditOrganisation = (organisation: Organisation) => {
        setEditingOrganisation(organisation)
        setIsModalOpen(true)
    }

    return (
        <main>
            {isSuperAdmin() ? (
                currentView === 'list' ? (
                    <OrganisationListView
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filteredOrganisations={filteredOrganisations}
                        handleCreateOrganisation={handleCreateOrganisation}
                        handleEditOrganisation={handleEditOrganisation}
                        handleViewOrganisation={handleViewOrganisation}
                        handleDeleteOrganisation={() => {}} // TODO : handle delete
                    />
                ) : (
                    <OrganisationDetailView
                        selectedOrganisation={selectedOrganisation || undefined}
                        handleEditOrganisation={handleEditOrganisation}
                        handleBackToList={handleBackToList}
                    />
                )
            ) : (
                <UserOrganisationView
                    organisations={filteredOrganisations}
                    isLoading={isLoading}
                />
            )}

            <OrganisationForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveOrganisation}
                organisation={editingOrganisation || undefined}
            />
        </main>
    )
}
