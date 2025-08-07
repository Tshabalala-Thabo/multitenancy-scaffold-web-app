"use client"

import { useState } from "react"
import type { PendingInvitation, UserInvitePayload } from "@/types/user-invitation"
import { Role } from '@/types/roles-and-permissions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Mail, XCircle, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface UserInvitationProps {
    pendingInvitations: PendingInvitation[]
    orgRoles: Role[]
    orgId: number
}

export function UserInvitation({ pendingInvitations: initialInvitations, orgRoles, orgId }: UserInvitationProps) {
    const [pendingInvitations, setPendingInvitations] = useState(initialInvitations)
    const [email, setEmail] = useState("")
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])
    const [invitationMessage, setInvitationMessage] = useState("")
    const [bulkEmails, setBulkEmails] = useState("")

    const handleInviteUser = async () => {
        if (!email || selectedRoles.length === 0) {
            toast({
                title: "Validation Error",
                description: "Email and at least one role are required.",
                variant: "destructive",
            })
            return
        }

        const payload: UserInvitePayload = {
            email,
            roles: selectedRoles,
            message: invitationMessage,
        }

        // Simulate API call
        toast({ title: "Sending invitation...", description: `Inviting ${email}.` })
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newInvitation: PendingInvitation = {
            id: Math.floor(Math.random() * 100000), // Mock ID
            email,
            roles: selectedRoles,
            invited_by: "Current Admin User", // Replace with actual user name
            invited_at: new Date().toISOString(),
            status: "pending",
        }
        setPendingInvitations((prev) => [...prev, newInvitation])
        setEmail("")
        setSelectedRoles([])
        setInvitationMessage("")
        toast({ title: "Success", description: `Invitation sent to ${email}.` })
    }

    const handleBulkInvite = async () => {
        const emails = bulkEmails
            .split(/[\n,;]+/)
            .map((e) => e.trim())
            .filter((e) => e)
        if (emails.length === 0 || selectedRoles.length === 0) {
            toast({
                title: "Validation Error",
                description: "Emails and at least one role are required for bulk invitation.",
                variant: "destructive",
            })
            return
        }

        const payloads: UserInvitePayload[] = emails.map((email) => ({
            email,
            roles: selectedRoles,
            message: invitationMessage,
        }))

        // Simulate API call for bulk invite
        toast({ title: "Sending bulk invitations...", description: `Inviting ${emails.length} users.` })
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const newInvitations: PendingInvitation[] = emails.map((email) => ({
            id: Math.floor(Math.random() * 100000), // Mock ID
            email,
            roles: selectedRoles,
            invited_by: "Current Admin User",
            invited_at: new Date().toISOString(),
            status: "pending",
        }))
        setPendingInvitations((prev) => [...prev, ...newInvitations])
        setBulkEmails("")
        setSelectedRoles([])
        setInvitationMessage("")
        toast({ title: "Success", description: `${emails.length} invitations sent.` })
    }

    const handleResendInvitation = async (invitationId: number) => {
        // Simulate API call
        toast({ title: "Resending invitation...", description: `Resending invitation for ID: ${invitationId}.` })
        await new Promise((resolve) => setTimeout(resolve, 500))
        toast({ title: "Success", description: `Invitation ${invitationId} resent.` })
    }

    const handleCancelInvitation = async (invitationId: number) => {
        // Simulate API call
        toast({ title: "Cancelling invitation...", description: `Cancelling invitation for ID: ${invitationId}.` })
        await new Promise((resolve) => setTimeout(resolve, 500))
        setPendingInvitations((prev) => prev.filter((inv) => inv.id !== invitationId))
        toast({ title: "Success", description: `Invitation ${invitationId} cancelled.` })
    }

    return (
        <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Single User Invitation</h3>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="roles-single">Assign Roles</Label>
                        <Select
                            onValueChange={(value) => setSelectedRoles(value ? [value] : [])} // Simplified for single select
                            value={selectedRoles.length > 0 ? selectedRoles[0] : ""}
                        >
                            <SelectTrigger id="roles-single">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {orgRoles.map((role) => (
                                    <SelectItem key={role.id} value={role.name}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="message-single">Custom Message (Optional)</Label>
                        <Textarea
                            id="message-single"
                            placeholder="Welcome to our organization!"
                            value={invitationMessage}
                            onChange={(e) => setInvitationMessage(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleInviteUser} className="w-full">
                        <Mail className="mr-2 h-4 w-4" /> Send Invitation
                    </Button>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Bulk User Invitation</h3>
                    <div className="grid gap-2">
                        <Label htmlFor="bulk-emails">Email Addresses (one per line or comma-separated)</Label>
                        <Textarea
                            id="bulk-emails"
                            placeholder="user1@example.com\nuser2@example.com"
                            value={bulkEmails}
                            onChange={(e) => setBulkEmails(e.target.value)}
                            rows={5}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="roles-bulk">Assign Roles</Label>
                        <Select
                            onValueChange={(value) => setSelectedRoles(value ? [value] : [])} // Simplified for single select
                            value={selectedRoles.length > 0 ? selectedRoles[0] : ""}
                        >
                            <SelectTrigger id="roles-bulk">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {orgRoles.map((role) => (
                                    <SelectItem key={role.id} value={role.name}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="message-bulk">Custom Message (Optional)</Label>
                        <Textarea
                            id="message-bulk"
                            placeholder="Welcome to our organization!"
                            value={invitationMessage}
                            onChange={(e) => setInvitationMessage(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleBulkInvite} className="w-full">
                        <Mail className="mr-2 h-4 w-4" /> Send Bulk Invitations
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pending Invitations</h3>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead>Invited By</TableHead>
                                <TableHead>Invited At</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingInvitations.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No pending invitations.
                                    </TableCell>
                                </TableRow>
                            )}
                            {pendingInvitations.map((invitation) => (
                                <TableRow key={invitation.id}>
                                    <TableCell>{invitation.email}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {invitation.roles.map((role) => (
                                                <Badge key={role} variant="secondary">
                                                    {role}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>{invitation.invited_by}</TableCell>
                                    <TableCell>{new Date(invitation.invited_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={invitation.status === "pending" ? "outline" : "default"}>
                                            {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Invitation actions">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleResendInvitation(invitation.id)}>
                                                    <RefreshCw className="mr-2 h-4 w-4" /> Resend
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleCancelInvitation(invitation.id)}>
                                                    <XCircle className="mr-2 h-4 w-4" /> Cancel
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
