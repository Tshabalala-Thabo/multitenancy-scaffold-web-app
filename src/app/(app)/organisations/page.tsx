'use client'

import { useOrganisation } from '@/hooks/useOrganisation'
import { OrganisationForm } from '@/components/OrganisationForm'
import { OrganisationDetailView } from './components/OrganisationDetailView'
import { OrganisationListView } from './components/OrganisationListView'
import { UserOrganisationView } from './components/UserOrganisationView'
import { useAuth } from '@/hooks/auth'
import usePermissions from '@/hooks/usePermissions'

export default function OrganisationsPage() {
    const {
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
        isLoading
    } = useOrganisation()

    const { isSuperAdmin } = usePermissions()

    const { user } = useAuth()
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
                        handleDeleteOrganisation={handleDeleteOrganisation}
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
