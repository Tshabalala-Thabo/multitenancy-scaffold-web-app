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
import { Plus, Search, MoreHorizontal, Edit, Eye, Trash2, Building2 } from 'lucide-react'
import { formatDate } from '@/utils/dateFormatter'
import { Organisation } from '@/types/organisation'

interface OrganisationListViewProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  handleCreateOrganisation: () => void
  handleEditOrganisation: (org: Organisation) => void
  handleViewOrganisation: (org: Organisation) => void
  handleDeleteOrganisation: (id: number) => void
  filteredOrganisations: Organisation[]
}

export const OrganisationListView = ({
  searchTerm,
  setSearchTerm,
  handleCreateOrganisation,
  handleEditOrganisation,
  handleViewOrganisation,
  handleDeleteOrganisation,
  filteredOrganisations
}: OrganisationListViewProps) => (
  <>
    <Header title="Organisations" />
    <div className="flex flex-1 flex-col gap-4 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Organisation Management</CardTitle>
              <CardDescription>
                Manage all organisations in your multi-tenant application
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
                onChange={e => setSearchTerm(e.target.value)}
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrganisations?.map(organisation => {
                  const adminUsers = organisation.users?.filter(
                    user => user.roles?.includes('administrator')
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
                          {adminUsers && adminUsers.length > 0 ? (
                            <>
                              <div className="font-medium">
                                {adminUsers[0].name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {adminUsers[0].email}
                              </div>
                              {adminUsers.length > 1 && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  +{adminUsers.length - 1} more
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              No administrators assigned
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={organisation.status === 'active' ? 'default' : 'secondary'}>
                          {organisation.status || 'not available'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {organisation.users?.length}
                      </TableCell>
                      <TableCell>
                        {formatDate(organisation.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewOrganisation(organisation)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditOrganisation(organisation)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteOrganisation(organisation.id)}
                              className="text-destructive"
                            >
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
