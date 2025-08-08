"use client"
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
import { PermissionMatrix } from './components/PermissionMatrix'
import { useOrganisationUser } from '@/hooks/useOrganisationUser'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/auth'
export default function OrganizationSettingsPage() {

    const { user } = useAuth()

    const {
        organisationSettings,
        isLoading,
        error,
        updateSettings,
        fetchOrganisationSettings
    } = useOrganisationUser()

    const organizationId = user?.tenant_id

    useEffect(() => {
        console.log("organisationSettings", organisationSettings)
    }, [organisationSettings])

    useEffect(() => {
        if (organizationId) {
            fetchOrganisationSettings(organizationId)
        }
    }, [organizationId, fetchOrganisationSettings])

    if (isLoading || !organisationSettings || !organizationId) {
        return <div>Loading...</div>
    }

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
                                    orgId={organizationId}
                                    initialSettings={organisationSettings}
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
                                    orgId={organizationId}
                                    initialSettings={organisationSettings}
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
                                    roles={organisationSettings.roles}
                                    allPermissions={organisationSettings.permissions}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
