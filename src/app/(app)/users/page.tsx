'use client'

import { useEffect, useState } from 'react'
import type { PendingInvitation, OrgRole } from '@/types/user-invitation'
import { UserList } from './components/UserList'
import { UserInvitation } from './components/UserInvitation'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Header from '@/components/Header'
import { useOrganisationUsers } from '@/hooks/useOrganisationUsers'
import { Skeleton } from '@/components/ui/skeleton'
import { BannedUsers } from './components/BannedUsers'

async function getPendingInvitations(orgId: number): Promise<PendingInvitation[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [
        {
            id: 1,
            email: 'invite1@example.com',
            roles: ['editor'],
            invited_by: 'John Doe',
            invited_at: '2025-07-25',
            status: 'pending',
        },
        {
            id: 2,
            email: 'invite2@example.com',
            roles: ['viewer'],
            invited_by: 'John Doe',
            invited_at: '2025-07-20',
            status: 'pending',
        },
    ]
}

async function getOrgRoles(orgId: number): Promise<OrgRole[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [
        {
            id: 1,
            name: 'administrator',
            description: 'Full access to organization settings and user management.',
            is_custom: false,
            permissions: [],
            created_at: '',
            updated_at: '',
        },
        {
            id: 2,
            name: 'member',
            description: 'Standard member with limited access.',
            is_custom: false,
            permissions: [],
            created_at: '',
            updated_at: '',
        },
        {
            id: 3,
            name: 'viewer',
            description: 'Can view content but not make changes.',
            is_custom: false,
            permissions: [],
            created_at: '',
            updated_at: '',
        },
    ]
}

export default function UserManagementPage({ params }: { params: { orgId: string } }) {
    const orgId = Number.parseInt(params.orgId)
    const { isLoading: usersLoading, error: usersError } = useOrganisationUsers()

    const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([])
    const [orgRoles, setOrgRoles] = useState<OrgRole[]>([])
    const [invitationsLoading, setInvitationsLoading] = useState(true)
    const [rolesLoading, setRolesLoading] = useState(true)

    useEffect(() => {
        const loadInvitations = async () => {
            try {
                const invitations = await getPendingInvitations(orgId)
                setPendingInvitations(invitations)
            } catch (error) {
                console.error('Failed to load pending invitations:', error)
            } finally {
                setInvitationsLoading(false)
            }
        }

        const loadRoles = async () => {
            try {
                const roles = await getOrgRoles(orgId)
                setOrgRoles(roles)
            } catch (error) {
                console.error('Failed to load organization roles:', error)
            } finally {
                setRolesLoading(false)
            }
        }

        loadInvitations()
        loadRoles()
    }, [orgId])

    const LoadingSkeleton = () => (
        <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
        </div>
    )

    return (
        <div>
            <Header title="User Management" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <Tabs defaultValue="users" className="space-y-2">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="users">Organization Users</TabsTrigger>
                        <TabsTrigger value="invitations">Invitations</TabsTrigger>
                        <TabsTrigger value="banned">Banned Users</TabsTrigger>
                    </TabsList>

                    <TabsContent value="users" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Organization Users</CardTitle>
                                <CardDescription>Manage users within your organization.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {usersLoading || rolesLoading ? (
                                    <LoadingSkeleton />
                                ) : usersError ? (
                                    <div className="text-center py-8 text-red-500">
                                        Error loading users: {usersError}
                                    </div>
                                ) : (
                                    <UserList orgRoles={orgRoles} />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="invitations" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Invite New Users</CardTitle>
                                <CardDescription>
                                    Send invitations to new members to join your organization.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {invitationsLoading || rolesLoading ? (
                                    <LoadingSkeleton />
                                ) : (
                                    <UserInvitation
                                        pendingInvitations={pendingInvitations}
                                        orgRoles={orgRoles}
                                        orgId={orgId}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="banned" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {/*<Shield className="h-5 w-5" />*/}
                                    Banned Users
                                </CardTitle>
                                <CardDescription>
                                    Manage user bans and review moderation actions.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <BannedUsers />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
