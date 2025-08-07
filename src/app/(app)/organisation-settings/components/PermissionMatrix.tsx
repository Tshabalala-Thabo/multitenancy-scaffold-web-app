"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import type { Role, Permission } from "@/types/roles-and-permissions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
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
import { toast } from "@/hooks/use-toast"

interface PermissionMatrixProps {
    roles: Role[]
    allPermissions: Permission[]
    orgId: number
}

export function PermissionMatrix({ roles: initialRoles, allPermissions, orgId }: PermissionMatrixProps) {
    const [roles, setRoles] = useState(initialRoles)

    const groupedPermissions = allPermissions.reduce(
        (acc, perm) => {
            ;(acc[perm.category] = acc[perm.category] || []).push(perm)
            return acc
        },
        {} as Record<string, Permission[]>,
    )

    const permissionCategories = Object.keys(groupedPermissions)

    const handleEditRole = (role: Role) => {
        toast({ title: "Edit Role", description: `Navigating to edit role "${role.name}".` })
        // In a real app, navigate to an edit page: router.push(`/dashboard/${orgId}/roles/${role.id}/edit`)
    }

    const handleDeleteRole = async (roleId: number) => {
        toast({ title: "Deleting role...", description: `Deleting role ID: ${roleId}.` })
        await new Promise((resolve) => setTimeout(resolve, 500))
        setRoles((prev) => prev.filter((r) => r.id !== roleId))
        toast({ title: "Success", description: `Role ${roleId} deleted.` })
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="sticky left-0 bg-background z-10 min-w-[150px]">Role</TableHead>
                        {permissionCategories.map((category) => (
                            <TableHead key={category} className="text-center min-w-[120px]">
                                {category}
                            </TableHead>
                        ))}
                        <TableHead className="text-right sticky right-0 bg-background z-10 min-w-[80px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={permissionCategories.length + 2} className="h-24 text-center text-muted-foreground">
                                No roles found.
                            </TableCell>
                        </TableRow>
                    )}
                    {roles.map((role) => (
                        <TableRow key={role.id}>
                            <TableCell className="sticky left-0 bg-background font-medium">
                                {role.name}
                                {role.is_custom && (
                                    <Badge variant="outline" className="ml-2">
                                        Custom
                                    </Badge>
                                )}
                            </TableCell>
                            {permissionCategories.map((category) => (
                                <TableCell key={category} className="text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        {groupedPermissions[category]?.map((permission) => (
                                            <div key={permission.id} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`role-${role.id}-perm-${permission.id}`}
                                                    checked={role.permissions?.some((p) => p.id === permission.id)}
                                                    disabled // Permissions are managed via role edit, not directly in matrix
                                                    aria-label={`${role.name} has ${permission.name}`}
                                                />
                                                <Label htmlFor={`role-${role.id}-perm-${permission.id}`} className="text-xs">
                                                    {permission.name.split(":")[1]} {/* Show only action part */}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </TableCell>
                            ))}
                            <TableCell className="text-right sticky right-0 bg-background">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Role actions">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleEditRole(role)}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit Role
                                        </DropdownMenuItem>
                                        {role.is_custom && ( // Only allow deleting custom roles
                                            <>
                                                <DropdownMenuSeparator />
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete Role
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the custom role "{role.name}
                                                                ". Users assigned to this role will lose its permissions.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteRole(role.id)}>Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
