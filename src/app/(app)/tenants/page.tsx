'use client'

import { useTenant } from '@/hooks/useTenant'
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
import { TenantModal } from '@/components/TenantModal'
import { formatDate } from '@/utils/dateFormatter'

export default function TenantsPage() {
  const {
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
  } = useTenant()

  // List View Component
  const ListView = () => (
    <>
      <Header title="Tenants" />
      <div className="flex flex-1 flex-col gap-4 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tenant Management</CardTitle>
                <CardDescription>
                  Manage all tenants in your multi-tenant
                  application
                </CardDescription>
              </div>
              <Button onClick={handleCreateTenant}>
                <Plus className="mr-2 h-4 w-4" />
                Create Tenant
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tenants..."
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
                  {filteredTenants?.map(tenant => {
                    const adminUsers = tenant.users?.filter(
                      user =>
                        user.roles?.includes(
                          'administrator',
                        ),
                    )

                    return (
                      <TableRow key={tenant.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center overflow-hidden relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/30" />
                              {tenant.logo_url ? (
                                <img
                                  src={tenant.logo_url || '/placeholder.svg'}
                                  alt={tenant.name}
                                  className="relative w-8 h-8 object-contain rounded-lg"
                                />
                              ) : (
                                <Building2 className="relative h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold">
                                {tenant.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {tenant.domain}
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
                              tenant.status ===
                                'active'
                                ? 'default'
                                : 'secondary'
                            }>
                            {tenant.status ||
                              'not available'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {tenant.users?.length}
                        </TableCell>
                        <TableCell>
                          {formatDate(
                            tenant.created_at,
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
                                  handleViewTenant(
                                    tenant,
                                  )
                                }>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEditTenant(
                                    tenant,
                                  )
                                }>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteTenant(
                                    tenant.id,
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
    if (!selectedTenant) return null

    return (
      <>
        <Header
          title="Tenant Details"
          showBackButton
          onBackClick={handleBackToList}
          backButtonText="Back to Tenants"
        />

        <div className="flex flex-1 flex-col gap-6 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/30" />
                {selectedTenant.logo_url ? (
                  <img
                    src={selectedTenant.logo_url || '/placeholder.svg'}
                    alt={selectedTenant.name}
                    className="relative w-14 h-14 object-contain rounded-lg"
                  />
                ) : (
                  <Building2 className="relative h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedTenant.name}
                </h2>
                <p className="text-muted-foreground">
                  @{selectedTenant.slug}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={
                      selectedTenant.status === 'active'
                        ? 'default'
                        : 'secondary'
                    }>
                    {selectedTenant.status}
                  </Badge>
                  {selectedTenant.domain && (
                    <Badge variant="outline">
                      <Globe className="w-3 h-3 mr-1" />
                      {selectedTenant.domain}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={() => handleEditTenant(selectedTenant)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Tenant
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
                    {selectedTenant.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Slug
                  </label>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {selectedTenant.slug}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Domain
                  </label>
                  <p className="text-sm">
                    {selectedTenant.domain ? (
                      <code className="bg-muted px-2 py-1 rounded">
                        {selectedTenant.domain}
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
                        selectedTenant.status ===
                          'active'
                          ? 'default'
                          : 'secondary'
                      }>
                      {selectedTenant.status}
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
                  {selectedTenant.users?.filter(user => user.roles?.includes('administrator')).length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTenant.users?.filter(user => user.roles?.includes('administrator')).map(
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
                {selectedTenant.address && (
                  <>
                    <p className="text-sm">
                      {selectedTenant.address.street_address}
                    </p>
                    <p className="text-sm">
                      {selectedTenant.address.suburb}
                    </p>
                    <p className="text-sm">
                      {selectedTenant.address.city},{' '}
                      {selectedTenant.address.province}{' '}
                      {selectedTenant.address.postal_code}
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
                    {selectedTenant.users.length || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Created
                  </span>
                  <span className="text-sm font-medium">
                    {formatDate(selectedTenant.created_at)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Last Updated
                  </span>
                  <span className="text-sm font-medium">
                    {formatDate(selectedTenant.updated_at)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Last Activity
                  </span>
                  <span className="text-sm font-medium">
                    {formatDate(selectedTenant.last_activity)}
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
                Latest activities for this tenant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Tenant updated
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
                      {selectedTenant.users_count} • 3
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

      <TenantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTenant}
        tenant={editingTenant || undefined}
      />
    </main>
  )
}
