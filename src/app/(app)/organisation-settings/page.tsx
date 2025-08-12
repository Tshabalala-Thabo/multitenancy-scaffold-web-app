"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import Alert from '@/components/Alert'
import Header from '@/components/Header'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState, useRef } from 'react'
import { PermissionMatrix } from './components/PermissionMatrix'
import { useOrganisationUser } from '@/hooks/useOrganisationUser'
import { AccessControlForm } from './components/AccessControlForm'
import { BasicInfoForm, BasicInfoFormRef } from './components/BasicInfoForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function OrganizationSettingsPage() {
    const { user } = useAuth()
    const [isFormDirty, setIsFormDirty] = useState(false)
    const [activeTab, setActiveTab] = useState("basic-info")
    const basicInfoFormRef = useRef<BasicInfoFormRef>(null)
    const accessControlFormRef = useRef<BasicInfoFormRef>(null)

    const {
        organisationSettings,
        isLoading,
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


    if (isLoading) {
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

    if (!organisationSettings || !organizationId) {
        return (
            <div>
                <Header title="Organization Settings" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-4">
                    <div className="space-y-4">
                        <Alert
                            variant="error"
                            title="Organization Not Found"
                            description="Organization not found or you do not have permission to view this page. Please contact your administrator if you believe this is an error."
                        />
                        <div className="flex justify-end gap-2 items-center">
                            <Link href="/dashboard">
                                <Button variant="outline">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Dashboard
                                </Button>
                            </Link>
                            <Button
                                onClick={() => organizationId && fetchOrganisationSettings(organizationId)}
                            >
                                Refresh
                            </Button>
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
                            basicInfoFormRef.current?.triggerPulse()
                            accessControlFormRef.current?.triggerPulse()
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
                                    ref={accessControlFormRef}
                                    initialSettings={organisationSettings}
                                    onDirtyChange={setIsFormDirty}
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
