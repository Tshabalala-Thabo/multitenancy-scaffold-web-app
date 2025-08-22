'use client'

import { useState } from 'react'
import type { OrganisationUser } from '@/hooks/useOrganisationUsers'
import type { OrgRole } from '@/lib/types'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
    MoreHorizontal,
    Search,
    Filter,
    UserPlus,
    UserMinus,
    Ban,
    Trash2,
    UserCheck,
    UserX,
} from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/auth'
import { useOrganisationUsers } from '@/hooks/useOrganisationUsers'

interface UserListProps {
    users: OrganisationUser[]
    orgRoles: OrgRole[]
    orgId: number
}

export function UserList({ users, orgRoles, orgId }: UserListProps) {
    const { updateUserRole, removeUser, banUser, refetch } =
        useOrganisationUsers()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedUsers, setSelectedUsers] = useState<number[]>([])
    const [isChangeRolesDialogOpen, setIsChangeRolesDialogOpen] =
        useState(false)
    const [isBanUserDialogOpen, setIsBanUserDialogOpen] = useState(false)
    const [currentUserForAction, setCurrentUserForAction] =
        useState<OrganisationUser | null>(null)
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])
    const [banReason, setBanReason] = useState('')
    const [banConfirmText, setBanConfirmText] = useState('')
    const filteredUsers = users.filter(
        user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    const { user: currentUser } = useAuth()

    const handleSelectAll = (checked: boolean) => {
        setSelectedUsers(checked ? users.map(user => user.id) : [])
    }

    const handleSelectUser = (userId: number, checked: boolean) => {
        setSelectedUsers(prev =>
            checked ? [...prev, userId] : prev.filter(id => id !== userId),
        )
    }

    const handlePromoteToAdmin = async (user: OrganisationUser) => {
        try {
            toast({
                title: 'Promoting user...',
                description: `Promoting ${user.name} to Administrator.`,
            })
            await updateUserRole(user.id, 'administrator')
            // Refresh data to get updated state
            await refetch()
        } catch (error) {
            // Error toast is already handled in the hook
            console.error('Failed to promote user:', error)
        }
    }

    const handleDemoteFromAdmin = async (user: OrganisationUser) => {
        try {
            toast({
                title: 'Demoting user...',
                description: `Demoting ${user.name} from Administrator.`,
            })
            await updateUserRole(user.id, 'member')
            // Refresh data to get updated state
            await refetch()
        } catch (error) {
            // Error toast is already handled in the hook
            console.error('Failed to demote user:', error)
        }
    }

    const handleChangeRoles = (user: OrganisationUser) => {
        setCurrentUserForAction(user)
        setSelectedRoles(user.roles)
        setIsChangeRolesDialogOpen(true)
    }

    const submitChangeRoles = async () => {
        if (!currentUserForAction || selectedRoles.length === 0) return

        try {
            toast({
                title: 'Updating roles...',
                description: `Updating roles for ${currentUserForAction.name}.`,
            })
            // For now, we'll update with the first selected role since the API expects a single role
            // You may need to modify this based on your API's capability to handle multiple roles
            await updateUserRole(currentUserForAction.id, selectedRoles[0])
            await refetch()

            setIsChangeRolesDialogOpen(false)
            setCurrentUserForAction(null)
            setSelectedRoles([])
        } catch (error) {
            console.error('Failed to update user roles:', error)
        }
    }

    const handleSuspendUser = async (user: OrganisationUser) => {
        // This would need a new API endpoint for suspending users
        // For now, we'll show a placeholder toast
        toast({
            title: 'Feature not implemented',
            description: 'User suspension is not yet implemented.',
            variant: 'destructive',
        })
    }

    const handleUnsuspendUser = async (user: OrganisationUser) => {
        // This would need a new API endpoint for unsuspending users
        toast({
            title: 'Feature not implemented',
            description: 'User unsuspension is not yet implemented.',
            variant: 'destructive',
        })
    }

    const handleRemoveUser = async (user: OrganisationUser) => {
        try {
            toast({
                title: 'Removing user...',
                description: `Removing ${user.name} from organization.`,
            })
            await removeUser(user.id)
        } catch (error) {
            console.error('Failed to remove user:', error)
        }
    }

    const handleBanUser = (user: OrganisationUser) => {
        setCurrentUserForAction(user)
        setBanReason('')
        setIsBanUserDialogOpen(true)
    }

    const submitBanUser = async () => {
        if (!currentUserForAction) return

        toast({
            title: 'Banning user...',
            description: `Banning ${currentUserForAction.name} ${currentUserForAction.last_name} from the organization.`,
        })

        await banUser(currentUserForAction.id, banReason.trim() || undefined)

        setIsBanUserDialogOpen(false)
        setCurrentUserForAction(null)
        setBanReason('')
    }

    const getStatusVariant = (status?: string) => {
        switch (status) {
            case 'active':
                return 'default'
            case 'suspended':
                return 'outline'
            case 'inactive':
                return 'secondary'
            default:
                return 'secondary'
        }
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString()
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search users by name or email..."
                        className="w-full rounded-lg bg-background pl-8"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="gap-1 bg-transparent">
                            <Filter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Filter
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Active</DropdownMenuItem>
                        <DropdownMenuItem>Suspended</DropdownMenuItem>
                        <DropdownMenuItem>Banned</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {/*<TableHead className="w-[40px]">*/}
                            {/*    <Checkbox*/}
                            {/*        checked={selectedUsers.length === users.length && users.length > 0}*/}
                            {/*        onCheckedChange={handleSelectAll}*/}
                            {/*        aria-label="Select all users"*/}
                            {/*    />*/}
                            {/*</TableHead>*/}
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Roles</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead>Last Activity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="h-24 text-center text-muted-foreground">
                                    {searchTerm
                                        ? 'No users found matching your search.'
                                        : 'No users found.'}
                                </TableCell>
                            </TableRow>
                        )}
                        {filteredUsers.map(user => (
                            <TableRow key={user.id}>
                                {/*<TableCell>*/}
                                {/*    <Checkbox*/}
                                {/*        checked={selectedUsers.includes(user.id)}*/}
                                {/*        onCheckedChange={(checked: boolean) => handleSelectUser(user.id, checked)}*/}
                                {/*        aria-label={`Select user ${user.name}`}*/}
                                {/*    />*/}
                                {/*</TableCell>*/}
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={
                                                    user.avatar_url ||
                                                    '/placeholder.svg?height=32&width=32&query=User avatar'
                                                }
                                                alt={`${user.name} ${user.last_name}`}
                                            />
                                            <AvatarFallback>
                                                {user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                                {user.last_name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">
                                                {user.name} {user.last_name}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {user.roles.map(role => (
                                            <Badge
                                                key={role}
                                                variant="secondary">
                                                {role}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {formatDate(user.join_date)}
                                </TableCell>
                                <TableCell>
                                    {formatDate(user.last_activity)}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={getStatusVariant(user.status)}>
                                        {user.status
                                            ? user.status
                                                .charAt(0)
                                                .toUpperCase() +
                                            user.status.slice(1)
                                            : 'Unknown'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {currentUser.id === user?.id ? <div className="flex justify-end gap-2"><span className="text-muted-foreground">None</span></div> : (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                    aria-label="User actions"
                                                >
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />

                                                {user.roles.includes('administrator') ? (
                                                    <DropdownMenuItem onClick={() => handleDemoteFromAdmin(user)}>
                                                        <UserMinus className="mr-2 h-4 w-4" /> Demote from Admin
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem onClick={() => handlePromoteToAdmin(user)}>
                                                        <UserPlus className="mr-2 h-4 w-4" /> Promote to Admin
                                                    </DropdownMenuItem>
                                                )}

                                                <DropdownMenuItem onClick={() => handleChangeRoles(user)}>
                                                    <UserCheck className="mr-2 h-4 w-4" /> Change Roles
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem onClick={() => handleBanUser(user)}>
                                                    <Ban className="mr-2 h-4 w-4" /> Ban User
                                                </DropdownMenuItem>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={e => e.preventDefault()}>
                                                            <Trash2 className="mr-2 h-4 w-4" /> Remove User
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely
                                                                sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently
                                                                remove{' '}
                                                                {user.name} {user.last_name} from the organization.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleRemoveUser(user)}>
                                                                Continue
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Change Roles Dialog */}
            <Dialog
                open={isChangeRolesDialogOpen}
                onOpenChange={setIsChangeRolesDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            Change Roles for {currentUserForAction?.name}
                        </DialogTitle>
                        <DialogDescription>
                            Select the roles for this user within the
                            organization.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="roles" className="text-right">
                                Roles
                            </Label>
                            <div className="col-span-3 space-y-2">
                                {orgRoles.map(role => (
                                    <div
                                        key={role.id}
                                        className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`role-${role.id}`}
                                            checked={selectedRoles.includes(
                                                role.name,
                                            )}
                                            onCheckedChange={(
                                                checked: boolean,
                                            ) => {
                                                setSelectedRoles(prev =>
                                                    checked
                                                        ? [...prev, role.name]
                                                        : prev.filter(
                                                            r =>
                                                                r !==
                                                                role.name,
                                                        ),
                                                )
                                            }}
                                        />
                                        <Label
                                            htmlFor={`role-${role.id}`}
                                            className="text-sm">
                                            <div>
                                                <div className="font-medium">
                                                    {role.name}
                                                </div>
                                                {role.description && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {role.description}
                                                    </div>
                                                )}
                                            </div>
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsChangeRolesDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={submitChangeRoles}
                            disabled={selectedRoles.length === 0}>
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Ban User Dialog */}
            <Dialog
                open={isBanUserDialogOpen}
                onOpenChange={setIsBanUserDialogOpen}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            Ban User: {currentUserForAction?.name}{' '}
                            {currentUserForAction?.last_name}
                        </DialogTitle>
                        <DialogDescription>
                            Ban this user from the organization. You can optionally
                            provide a reason for the ban.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="ban-reason">Reason for Ban (Optional)</Label>
                            <Textarea
                                id="ban-reason"
                                placeholder="e.g., Violation of terms of service, inappropriate behavior, spam"
                                value={banReason}
                                onChange={e => setBanReason(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="ban-confirm">
                                Type <strong>
                                {`I want to ban ${currentUserForAction?.name} ${currentUserForAction?.last_name}`}
                            </strong> to confirm
                            </Label>
                            <Input
                                id="ban-confirm"
                                type="text"
                                value={banConfirmText}
                                onChange={e => setBanConfirmText(e.target.value)}
                                placeholder={`I want to ban ${currentUserForAction?.name} ${currentUserForAction?.last_name}`}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsBanUserDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={submitBanUser}
                            disabled={
                                banConfirmText !==
                                `I want to ban ${currentUserForAction?.name} ${currentUserForAction?.last_name}`
                            }
                        >
                            Ban User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}
