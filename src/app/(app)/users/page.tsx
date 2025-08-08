import type { OrgUser, PendingInvitation, OrgRole } from '@/types/user-invitation'
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

// Mock data fetching functions (replace with actual API calls)
async function getOrgUsers(orgId: number): Promise<OrgUser[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    return [
        {
            id: 1,
            name: 'Alice',
            last_name: 'Smith',
            email: 'alice@example.com',
            avatar_url: '/placeholder.svg?height=32&width=32',
            roles: ['admin', 'editor'],
            join_date: '2023-01-15',
            last_activity: '2025-07-30',
            status: 'active',
        },
        {
            id: 2,
            name: 'Bob',
            last_name: 'Johnson',
            email: 'bob@example.com',
            avatar_url: '/placeholder.svg?height=32&width=32',
            roles: ['viewer'],
            join_date: '2023-03-01',
            last_activity: '2025-07-29',
            status: 'active',
        },
        {
            id: 3,
            name: 'Charlie',
            last_name: 'Brown',
            email: 'charlie@example.com',
            avatar_url: '/placeholder.svg?height=32&width=32',
            roles: ['editor'],
            join_date: '2023-05-20',
            last_activity: '2025-07-28',
            status: 'suspended',
        },
        {
            id: 4,
            name: 'Diana',
            last_name: 'Prince',
            email: 'diana@example.com',
            avatar_url: '/placeholder.svg?height=32&width=32',
            roles: ['admin'],
            join_date: '2023-02-10',
            last_activity: '2025-07-30',
            status: 'active',
        },
    ]
}

async function getPendingInvitations(
    orgId: number,
): Promise<PendingInvitation[]> {
    // Simulate API call
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200))
    return [
        {
            id: 1,
            name: 'admin',
            description:
                'Full access to organization settings and user management.',
            is_custom: false,
            permissions: [],
            created_at: '',
            updated_at: '',
        },
        {
            id: 2,
            name: 'editor',
            description: 'Can create and manage announcements.',
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
        {
            id: 4,
            name: 'custom_role_1',
            description: 'A custom role for specific tasks.',
            is_custom: true,
            permissions: [],
            created_at: '',
            updated_at: '',
        },
    ]
}

export default async function UserManagementPage({
                                                     params,
                                                 }: {
    params: { orgId: string }
}) {
    const orgId = Number.parseInt(params.orgId)
    const users = await getOrgUsers(orgId)
    const pendingInvitations = await getPendingInvitations(orgId)
    const orgRoles = await getOrgRoles(orgId)

    return (
        <div>
            <Header title="User Management" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <Tabs defaultValue="users" className="space-y-2">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="users">Organization Users</TabsTrigger>
                        <TabsTrigger value="invitations">Invitations</TabsTrigger>
                    </TabsList>

                    <TabsContent value="users" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Organization Users</CardTitle>
                                <CardDescription>
                                    Manage users within your organization.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <UserList
                                    users={users}
                                    orgRoles={orgRoles}
                                    orgId={orgId}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="invitations" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Invite New Users</CardTitle>
                                <CardDescription>
                                    Send invitations to new members to join your
                                    organization.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <UserInvitation
                                    pendingInvitations={pendingInvitations}
                                    orgRoles={orgRoles}
                                    orgId={orgId}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
