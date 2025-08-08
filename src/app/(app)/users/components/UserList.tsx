"use client"

import { useState } from "react"
import type { OrgUser, OrgRole } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, Filter, UserPlus, UserMinus, Ban, Trash2, UserCheck, UserX } from "lucide-react"
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
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

interface UserListProps {
    users: OrgUser[]
    orgRoles: OrgRole[]
    orgId: number
}

export function UserList({ users: initialUsers, orgRoles, orgId }: UserListProps) {
    const [users, setUsers] = useState(initialUsers)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUsers, setSelectedUsers] = useState<number[]>([])
    const [isChangeRolesDialogOpen, setIsChangeRolesDialogOpen] = useState(false)
    const [isBanUserDialogOpen, setIsBanUserDialogOpen] = useState(false)
    const [currentUserForAction, setCurrentUserForAction] = useState<OrgUser | null>(null)
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])
    const [banReason, setBanReason] = useState("")

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleSelectAll = (checked: boolean) => {
        setSelectedUsers(checked ? users.map((user) => user.id) : [])
    }

    const handleSelectUser = (userId: number, checked: boolean) => {
        setSelectedUsers((prev) => (checked ? [...prev, userId] : prev.filter((id) => id !== userId)))
    }

    const handlePromoteToAdmin = async (user: OrgUser) => {
        // Simulate API call
        toast({ title: "Promoting user...", description: `Promoting ${user.name} to Admin.` })
        await new Promise((resolve) => setTimeout(resolve, 500))
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, roles: [...new Set([...u.roles, "admin"])] } : u)))
        toast({ title: "Success", description: `${user.name} has been promoted to Admin.` })
    }

    const handleDemoteFromAdmin = async (user: OrgUser) => {
        // Simulate API call
        toast({ title: "Demoting user...", description: `Demoting ${user.name} from Admin.` })
        await new Promise((resolve) => setTimeout(resolve, 500))
        setUsers((prev) =>
            prev.map((u) => (u.id === user.id ? { ...u, roles: u.roles.filter((role) => role !== "admin") } : u)),
        )
        toast({ title: "Success", description: `${user.name} has been demoted from Admin.` })
    }

    const handleChangeRoles = (user: OrgUser) => {
        setCurrentUserForAction(user)
        setSelectedRoles(user.roles)
        setIsChangeRolesDialogOpen(true)
    }

    const submitChangeRoles = async () => {
        if (!currentUserForAction) return
        // Simulate API call
        toast({ title: "Updating roles...", description: `Updating roles for ${currentUserForAction.name}.` })
        await new Promise((resolve) => setTimeout(resolve, 500))
        setUsers((prev) => prev.map((u) => (u.id === currentUserForAction.id ? { ...u, roles: selectedRoles } : u)))
        toast({ title: "Success", description: `Roles for ${currentUserForAction.name} updated.` })
        setIsChangeRolesDialogOpen(false)
        setCurrentUserForAction(null)
        setSelectedRoles([])
    }

    const handleSuspendUser = async (user: OrgUser) => {
        // Simulate API call
        toast({ title: "Suspending user...", description: `Suspending ${user.name}.` })
        await new Promise((resolve) => setTimeout(resolve, 500))
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: "suspended" } : u)))
        toast({ title: "Success", description: `${user.name} has been suspended.` })
    }

    const handleUnsuspendUser = async (user: OrgUser) => {
        // Simulate API call
        toast({ title: "Unsuspending user...", description: `Unsuspending ${user.name}.` })
        await new Promise((resolve) => setTimeout(resolve, 500))
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: "active" } : u)))
        toast({ title: "Success", description: `${user.name} has been unsuspended.` })
    }

    const handleRemoveUser = async (user: OrgUser) => {
        // Simulate API call
        toast({ title: "Removing user...", description: `Removing ${user.name}.` })
        await new Promise((resolve) => setTimeout(resolve, 500))
        setUsers((prev) => prev.filter((u) => u.id !== user.id))
        toast({ title: "Success", description: `${user.name} has been removed.` })
    }

    const handleBanUser = (user: OrgUser) => {
        setCurrentUserForAction(user)
        setIsBanUserDialogOpen(true)
    }

    const submitBanUser = async () => {
        if (!currentUserForAction) return
        // Simulate API call
        toast({ title: "Banning user...", description: `Banning ${currentUserForAction.name}. Reason: ${banReason}` })
        await new Promise((resolve) => setTimeout(resolve, 500))
        setUsers((prev) => prev.map((u) => (u.id === currentUserForAction.id ? { ...u, status: "banned" } : u)))
        toast({ title: "Success", description: `${currentUserForAction.name} has been banned.` })
        setIsBanUserDialogOpen(false)
        setCurrentUserForAction(null)
        setBanReason("")
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
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-1 bg-transparent">
                            <Filter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
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
                            <TableHead className="w-[40px]">
                                <Checkbox
                                    checked={selectedUsers.length === users.length && users.length > 0}
                                    onCheckedChange={handleSelectAll}
                                    aria-label="Select all users"
                                />
                            </TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Roles</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead>Last Activity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedUsers.includes(user.id)}
                                        onCheckedChange={(checked: boolean) => handleSelectUser(user.id, checked)}
                                        aria-label={`Select user ${user.name}`}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={user.avatar_url || "/placeholder.svg?height=32&width=32&query=User avatar"}
                                                alt={user.name}
                                            />
                                            <AvatarFallback>
                                                {user.name.charAt(0)}
                                                {user.last_name.charAt(0)}
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
                                        {user.roles.map((role) => (
                                            <Badge key={role} variant="secondary">
                                                {role}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>{new Date(user.join_date).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(user.last_activity).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            user.status === "active" ? "default" : user.status === "suspended" ? "outline" : "destructive"
                                        }
                                    >
                                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="User actions">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            {user.roles.includes("admin") ? (
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
                                            {user.status === "suspended" ? (
                                                <DropdownMenuItem onClick={() => handleUnsuspendUser(user)}>
                                                    <UserCheck className="mr-2 h-4 w-4" /> Unsuspend User
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem onClick={() => handleSuspendUser(user)}>
                                                    <UserX className="mr-2 h-4 w-4" /> Suspend User
                                                </DropdownMenuItem>
                                            )}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Remove User
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently remove {user.name} from the
                                                            organization.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleRemoveUser(user)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                            <DropdownMenuItem onClick={() => handleBanUser(user)}>
                                                <Ban className="mr-2 h-4 w-4" /> Ban User
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Change Roles Dialog */}
            <Dialog open={isChangeRolesDialogOpen} onOpenChange={setIsChangeRolesDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Change Roles for {currentUserForAction?.name}</DialogTitle>
                        <DialogDescription>Select the roles for this user within the organization.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="roles" className="text-right">
                                Roles
                            </Label>
                            <div className="col-span-3 space-y-2">
                                {orgRoles.map((role) => (
                                    <div key={role.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`role-${role.id}`}
                                            checked={selectedRoles.includes(role.name)}
                                            onCheckedChange={(checked: boolean) => {
                                                setSelectedRoles((prev) =>
                                                    checked ? [...prev, role.name] : prev.filter((r) => r !== role.name),
                                                )
                                            }}
                                        />
                                        <Label htmlFor={`role-${role.id}`}>{role.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsChangeRolesDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={submitChangeRoles}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Ban User Dialog */}
            <Dialog open={isBanUserDialogOpen} onOpenChange={setIsBanUserDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Ban User: {currentUserForAction?.name}</DialogTitle>
                        <DialogDescription>
                            Permanently ban this user from the organization. Please provide a reason.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="ban-reason">Reason for Ban</Label>
                            <Textarea
                                id="ban-reason"
                                placeholder="e.g., Violation of terms of service, spamming"
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBanUserDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={submitBanUser}>
                            Ban User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
