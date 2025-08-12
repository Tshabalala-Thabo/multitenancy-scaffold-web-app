"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BasicInfoForm, BasicInfoFormRef } from './components/BasicInfoForm'
import { AccessControlForm } from './components/AccessControlForm'
import Header from '@/components/Header'
import { PermissionMatrix } from './components/PermissionMatrix'
import { useOrganisationUser } from '@/hooks/useOrganisationUser'
import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/hooks/auth'
import { Skeleton } from '@/components/ui/skeleton'

export default function OrganizationSettingsPage() {
    const { user } = useAuth()
    const [isFormDirty, setIsFormDirty] = useState(false)
    const [activeTab, setActiveTab] = useState("basic-info")
    const basicInfoFormRef = useRef<BasicInfoFormRef>(null)

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
        return (
            <div>
                <Header title="Organization Settings" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-6">
                    <div className="space-y-2">
                        <div className="flex space-x-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                        <div className="mt-6 space-y-6">
                            <Skeleton className="h-96 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Header title="Organization Settings" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <Tabs
                    value={activeTab}
                    onValueChange={(value) => {
                        if (isFormDirty) {
                            // Trigger button pulsing using the ref
                            basicInfoFormRef.current?.triggerPulse()
                            // Don't change the tab
                            return
                        } else {
                            setActiveTab(value)
                        }
                    }}
                    className="space-y-2"
                >
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
                                    ref={basicInfoFormRef}
                                    initialSettings={organisationSettings}
                                    onDirtyChange={setIsFormDirty}
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
