'use client'

import { useOrganisation } from '@/hooks/useOrganisation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Header from '@/components/Header'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Building2,
  Mail,
  MapPin,
  Users,
  Calendar,
  Globe,
} from 'lucide-react'
import { OrganisationModal } from '@/components/OrganisationModal'
import { formatDate } from '@/utils/dateFormatter'

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
  } = useOrganisation()

  // List View Component
  const ListView = () => (
    <>
      <Header title="Organisations" />
      <div className="flex flex-1 flex-col gap-4 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Organisation Management</CardTitle>
                <CardDescription>
                  Manage all organisations in your multi-tenant
                  application
                </CardDescription>
              </div>
              <Button onClick={handleCreateOrganisation}>
                <Plus className="mr-2 h-4 w-4" />
                Create Organisation
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search organisations..."
                  value={searchTerm}
                  onChange={e =>
                    setSearchTerm(e.target.value)
                  }
                  className="pl-8"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Administrators</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrganisations?.map(organisation => {
                    const adminUsers = organisation.users?.filter(
                      user =>
                        user.roles?.includes(
                          'administrator',
                        ),
                    )

                    return (
                      <TableRow key={organisation.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center overflow-hidden relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/30" />
                              {organisation.logo_url ? (
                                <img
                                  src={organisation.logo_url || '/placeholder.svg'}
                                  alt={organisation.name}
                                  className="relative w-8 h-8 object-contain rounded-lg"
                                />
                              ) : (
                                <Building2 className="relative h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold">
                                {organisation.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {organisation.domain}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {adminUsers &&
                              adminUsers.length >
                              0 ? (
                              <>
                                <div className="font-medium">
                                  {
                                    adminUsers[0]
                                      .name
                                  }
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {
                                    adminUsers[0]
                                      .email
                                  }
                                </div>
                                {adminUsers.length >
                                  1 && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      +
                                      {adminUsers.length -
                                        1}{' '}
                                      more
                                    </div>
                                  )}
                              </>
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                No
                                administrators
                                assigned
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              organisation.status ===
                                'active'
                                ? 'default'
                                : 'secondary'
                            }>
                            {organisation.status ||
                              'not available'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {organisation.users?.length}
                        </TableCell>
                        <TableCell>
                          {formatDate(
                            organisation.created_at,
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleViewOrganisation(
                                    organisation,
                                  )
                                }>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEditOrganisation(
                                    organisation,
                                  )
                                }>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteOrganisation(
                                    organisation.id,
                                  )
                                }
                                className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )

  // Detail View Component
  const DetailView = () => {
    if (!selectedOrganisation) return null

    return (
      <>
        <Header
          title="Organisation Details"
          showBackButton
          onBackClick={handleBackToList}
          backButtonText="Back to Organisations"
        />

        <div className="flex flex-1 flex-col gap-6 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/30" />
                {selectedOrganisation.logo_url ? (
                  <img
                    src={selectedOrganisation.logo_url || '/placeholder.svg'}
                    alt={selectedOrganisation.name}
                    className="relative w-14 h-14 object-contain rounded-lg"
                  />
                ) : (
                  <Building2 className="relative h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedOrganisation.name}
                </h2>
                <p className="text-muted-foreground">
                  @{selectedOrganisation.slug}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={
                      selectedOrganisation.status === 'active'
                        ? 'default'
                        : 'secondary'
                    }>
                    {selectedOrganisation.status}
                  </Badge>
                  {selectedOrganisation.domain && (
                    <Badge variant="outline">
                      <Globe className="w-3 h-3 mr-1" />
                      {selectedOrganisation.domain}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={() => handleEditOrganisation(selectedOrganisation)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Organisation
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Name
                  </label>
                  <p className="text-sm">
                    {selectedOrganisation.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Slug
                  </label>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {selectedOrganisation.slug}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Domain
                  </label>
                  <p className="text-sm">
                    {selectedOrganisation.domain ? (
                      <code className="bg-muted px-2 py-1 rounded">
                        {selectedOrganisation.domain}
                      </code>
                    ) : (
                      <span className="text-muted-foreground">
                        Not configured
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        selectedOrganisation.status ===
                          'active'
                          ? 'default'
                          : 'secondary'
                      }>
                      {selectedOrganisation.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Administrator Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Administrators (
                  {selectedOrganisation.users?.filter(user => user.roles?.includes('administrator')).length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedOrganisation.users?.filter(user => user.roles?.includes('administrator')).map(
                  (admin, index) => (
                    <div
                      key={admin.id}
                      className={`space-y-2 ${index > 0 ? 'pt-4 border-t' : ''}`}>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Name
                        </label>
                        <p className="text-sm">
                          {admin.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Email
                        </label>
                        <p className="text-sm">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {selectedOrganisation.address && (
                  <>
                    <p className="text-sm">
                      {selectedOrganisation.address.street_address}
                    </p>
                    <p className="text-sm">
                      {selectedOrganisation.address.suburb}
                    </p>
                    <p className="text-sm">
                      {selectedOrganisation.address.city},{' '}
                      {selectedOrganisation.address.province}{' '}
                      {selectedOrganisation.address.postal_code}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Users
                  </span>
                  <span className="text-sm font-medium">
                    {selectedOrganisation.users.length || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Created
                  </span>
                  <span className="text-sm font-medium">
                    {formatDate(selectedOrganisation.created_at)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Last Updated
                  </span>
                  <span className="text-sm font-medium">
                    {formatDate(selectedOrganisation.updated_at)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Last Activity
                  </span>
                  <span className="text-sm font-medium">
                    {formatDate(selectedOrganisation.last_activity)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest activities for this organisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Organisation updated
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Domain configuration changed • 2
                      days ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      New user registered
                    </p>
                    <p className="text-xs text-muted-foreground">
                      User count increased to{' '}
                      {selectedOrganisation.users_count} • 3
                      days ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Administrator updated
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Contact information changed • 1 week
                      ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <main>
      {currentView === 'list' ? <ListView /> : <DetailView />}

      <OrganisationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveOrganisation}
        organisation={editingOrganisation || undefined}
      />
    </main>
  )
}
