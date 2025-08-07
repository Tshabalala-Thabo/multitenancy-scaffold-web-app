import type { OrganizationSettings } from '@/types/organisation'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BasicInfoForm } from './components/BasicInfoForm'
import { AccessControlForm } from './components/AccessControlForm'
import Header from '@/components/Header'
import { Permission, Role } from '@/types/roles-and-permissions'
import { PermissionMatrix } from './components/PermissionMatrix'

async function getOrgRoles(orgId: number): Promise<Role[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return [
        {
            id: 1,
            name: 'admin',
            description: 'Full administrative access.',
            is_custom: false,
            created_at: '',
            updated_at: '',
            permissions: [
                {
                    id: 1,
                    name: 'user:read',
                    description: 'View users',
                    category: 'Users',
                },
                {
                    id: 2,
                    name: 'user:manage',
                    description: 'Create, edit, delete users',
                    category: 'Users',
                },
                {
                    id: 3,
                    name: 'announcement:read',
                    description: 'View announcements',
                    category: 'Announcements',
                },
                {
                    id: 4,
                    name: 'announcement:manage',
                    description: 'Create, edit, delete announcements',
                    category: 'Announcements',
                },
                {
                    id: 5,
                    name: 'settings:manage',
                    description: 'Manage organization settings',
                    category: 'Settings',
                },
                {
                    id: 6,
                    name: 'role:manage',
                    description: 'Create and manage roles',
                    category: 'Roles',
                },
                {
                    id: 7,
                    name: 'analytics:view',
                    description: 'View analytics dashboard',
                    category: 'Analytics',
                },
            ],
        },
        {
            id: 2,
            name: 'editor',
            description: 'Can manage content and announcements.',
            is_custom: false,
            created_at: '',
            updated_at: '',
            permissions: [
                {
                    id: 3,
                    name: 'announcement:read',
                    description: 'View announcements',
                    category: 'Announcements',
                },
                {
                    id: 4,
                    name: 'announcement:manage',
                    description: 'Create, edit, delete announcements',
                    category: 'Announcements',
                },
            ],
        },
        {
            id: 3,
            name: 'viewer',
            description: 'Can view content.',
            is_custom: false,
            created_at: '',
            updated_at: '',
            permissions: [
                {
                    id: 3,
                    name: 'announcement:read',
                    description: 'View announcements',
                    category: 'Announcements',
                },
            ],
        },
        {
            id: 4,
            name: 'Support Agent',
            description: 'Custom role for support staff.',
            is_custom: true,
            created_at: '',
            updated_at: '',
            permissions: [
                {
                    id: 1,
                    name: 'user:read',
                    description: 'View users',
                    category: 'Users',
                },
                {
                    id: 3,
                    name: 'announcement:read',
                    description: 'View announcements',
                    category: 'Announcements',
                },
            ],
        },
    ]
}

async function getAllPermissions(): Promise<Permission[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [
        {
            id: 1,
            name: 'user:read',
            description: 'View users',
            category: 'Users',
        },
        {
            id: 2,
            name: 'user:manage',
            description: 'Create, edit, delete users',
            category: 'Users',
        },
        {
            id: 3,
            name: 'announcement:read',
            description: 'View announcements',
            category: 'Announcements',
        },
        {
            id: 4,
            name: 'announcement:manage',
            description: 'Create, edit, delete announcements',
            category: 'Announcements',
        },
        {
            id: 5,
            name: 'settings:manage',
            description: 'Manage organization settings',
            category: 'Settings',
        },
        {
            id: 6,
            name: 'role:manage',
            description: 'Create and manage roles',
            category: 'Roles',
        },
        {
            id: 7,
            name: 'analytics:view',
            description: 'View analytics dashboard',
            category: 'Analytics',
        },
        {
            id: 8,
            name: 'billing:view',
            description: 'View billing information',
            category: 'Billing',
        },
        {
            id: 9,
            name: 'billing:manage',
            description: 'Manage billing and subscriptions',
            category: 'Billing',
        },
    ]
}

async function getOrganizationSettings(
    orgId: number,
): Promise<OrganizationSettings> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
        name: 'Acme Corp',
        description: 'Leading provider of innovative solutions.',
        logo_url: '/placeholder.svg?height=64&width=64',
        domain: 'acme.com',
        address: {
            street_address: '123 Main St',
            suburb: 'Downtown',
            city: 'Metropolis',
            province: 'State',
            postal_code: '12345',
        },
        timezone: 'America/New_York',
        localization: 'en-US',
        privacy_setting: 'private',
        domain_restrictions: ['acme.com', 'partners.acme.com'],
        two_factor_auth_required: true,
        password_policy: {
            min_length: 10,
            requires_uppercase: true,
            requires_lowercase: true,
            requires_number: true,
            requires_symbol: false,
        },
        features: {
            announcements_enabled: true,
            analytics_enabled: true,
            custom_roles_enabled: true,
        },
        api_keys: [
            {
                id: 'api_key_123',
                name: 'Marketing API',
                created_at: '2024-01-01T00:00:00Z',
                last_used_at: '2025-07-29T10:00:00Z',
            },
        ],
        webhooks: [
            {
                id: 'webhook_abc',
                url: 'https://example.com/webhook',
                events: ['user.created', 'announcement.published'],
            },
        ],
        third_party_integrations: [
            { name: 'Slack', enabled: true, config: { channel: '#general' } },
        ],
    }
}

export default async function OrganizationSettingsPage({
                                                           params,
                                                       }: {
    params: { orgId: string }
}) {
    const orgId = Number.parseInt(params.orgId)
    const settings = await getOrganizationSettings(orgId)
    const roles = await getOrgRoles(orgId)
    const allPermissions = await getAllPermissions()

    return (
        <div>
            <Header title="Organization Settings" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <Tabs defaultValue="basic-info" className="space-y-2">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
                        <TabsTrigger value="access-control">Access Control</TabsTrigger>
                        <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic-info" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Manage your organization's name, logo, and contact
                                    details.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <BasicInfoForm
                                    orgId={orgId}
                                    initialSettings={settings}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="access-control" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Access Control</CardTitle>
                                <CardDescription>
                                    Configure privacy, user registration, and security
                                    policies.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AccessControlForm
                                    orgId={orgId}
                                    initialSettings={settings}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="permissions" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Permission Matrix</CardTitle>
                                <CardDescription>
                                    Visualize and manage permissions across all roles.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PermissionMatrix
                                    roles={roles}
                                    allPermissions={allPermissions}
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
