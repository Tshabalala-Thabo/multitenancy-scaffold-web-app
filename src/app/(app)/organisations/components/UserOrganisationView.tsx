'use client'

import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { Building2, MapPin, Users, Calendar, Plus } from 'lucide-react'
import { formatDate } from '@/utils/dateFormatter'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Organisation } from '@/types/organisation'
import Header from '@/components/Header'
import { useEffect } from 'react'

interface UserOrganisationListProps {
    organisations: Organisation[]
}

export const UserOrganisationView = ({
    organisations,
}: UserOrganisationListProps) => {
    // if (!organisation) return null
    const [selectedOrganization, setSelectedOrganization] =
        useState<Organisation | null>(null)

    const handleJoinOrganization = (orgId: number) => {
        //
    }

    const handleLeaveOrganization = (orgId: number) => {
        //
    }

    function getInitials(name?: string, lastName?: string): string {
        const firstInitial = name?.trim().charAt(0).toUpperCase() || ''
        const lastInitial = lastName?.trim().charAt(0).toUpperCase() || ''
        return firstInitial + lastInitial
    }

    const getStatusColor = (status: Organisation['status']) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 hover:bg-green-100'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
            case 'inactive':
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
        }
    }

    useEffect(() => {
        console.log('selectedOrganization', selectedOrganization)
    }, [selectedOrganization])

    return (
        <div>
            <Header title="Organisations" />
            {/* Search and Filters */}
            <div className="flex flex-1 flex-col gap-4 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Organizations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organisations.map(org => (
                        <Card
                            key={org.id}
                            className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12 rounded-lg">
                                            <AvatarImage
                                                src={org.logo_url || undefined}
                                                alt={org.name}
                                                className="rounded-lg"
                                            />
                                            <AvatarFallback className="rounded-lg">
                                                <Building2 className="h-6 w-6" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">
                                                {org.name}
                                            </CardTitle>
                                            <CardDescription>
                                                {org.domain || 'No domain'}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge className={`${getStatusColor(org.status)} whitespace-nowrap`}>{org.status || 'No status'}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col flex-1">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>
                                            {org.users.length} member(s)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span>
                                            {org.address.city},{' '}
                                            {org.address.province}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            Last active{' '}
                                            {formatDate(org.last_activity)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            console.log(
                                                'Setting selected org:',
                                                org,
                                            )
                                            setSelectedOrganization(org)
                                        }}
                                        className="flex-1">
                                        View Details
                                    </Button>
                                    <Button size="sm" variant={'outline'}>
                                        Join
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {organisations.length === 0 && (
                    <div className="text-center py-12">
                        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            No organizations found
                        </h3>
                        <p className="text-muted-foreground">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                )}
            </div>

            {/* Organization Details Modal */}
            <Dialog
                open={!!selectedOrganization}
                onOpenChange={() => setSelectedOrganization(null)}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    {selectedOrganization && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16 rounded-lg">
                                        <AvatarImage
                                            src={
                                                selectedOrganization.logo_url ||
                                                undefined
                                            }
                                            alt={selectedOrganization.name}
                                            className="rounded-lg"
                                        />
                                        <AvatarFallback className="rounded-lg">
                                            <Building2 className="h-8 w-8" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <DialogTitle className="text-2xl">
                                            {selectedOrganization.name}
                                        </DialogTitle>
                                        <DialogDescription className="text-base">
                                            {selectedOrganization.domain ||
                                                'No domain configured'}
                                        </DialogDescription>
                                        <Badge
                                            className={`${getStatusColor(selectedOrganization.status)} mt-2`}>
                                            {selectedOrganization.status ||
                                                'No status'}
                                        </Badge>
                                    </div>
                                </div>
                            </DialogHeader>

                            <Tabs defaultValue="overview" className="mt-6">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="overview">
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger value="members">
                                        Members
                                    </TabsTrigger>
                                    <TabsTrigger value="details">
                                        Details
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent
                                    value="overview"
                                    className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium">
                                                    Total Members
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">
                                                    {selectedOrganization.users
                                                        .length || 0}
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium">
                                                    Administrators
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">
                                                    {
                                                        selectedOrganization.users.filter(
                                                            user =>
                                                                user.roles.includes(
                                                                    'administrator'
                                                                ),
                                                        ).length
                                                    }
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium">
                                                    Status
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Badge
                                                    className={getStatusColor(
                                                        selectedOrganization.status,
                                                    )}>
                                                    {
                                                        selectedOrganization.status ||
                                                        'No status'
                                                    }
                                                </Badge>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Address</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-1">
                                                <p>
                                                    {
                                                        selectedOrganization
                                                            .address
                                                            .street_address
                                                    }
                                                </p>
                                                <p>
                                                    {
                                                        selectedOrganization
                                                            .address.suburb
                                                    }
                                                </p>
                                                <p>
                                                    {
                                                        selectedOrganization
                                                            .address.city
                                                    }
                                                    ,{' '}
                                                    {
                                                        selectedOrganization
                                                            .address.province
                                                    }
                                                </p>
                                                <p>
                                                    {
                                                        selectedOrganization
                                                            .address.postal_code
                                                    }
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent
                                    value="members"
                                    className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">
                                            Administrators
                                        </h3>
                                        <div className="space-y-2">
                                            {selectedOrganization.administrators?.map(
                                                admin => (
                                                    <div
                                                        key={admin.id}
                                                        className="flex items-center gap-3 p-3 border rounded-lg">
                                                        <Avatar>
                                                            <AvatarFallback>
                                                                {getInitials(
                                                                    admin.name,
                                                                    admin.last_name,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <p className="font-medium">
                                                                {admin.name}{' '}
                                                                {
                                                                    admin.last_name
                                                                }
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {admin.email}
                                                            </p>
                                                        </div>
                                                        <Badge variant="secondary">
                                                            Admin
                                                        </Badge>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">
                                            Members
                                        </h3>
                                        <div className="space-y-2">
                                            {selectedOrganization.users?.map(
                                                user => (
                                                    <div
                                                        key={user.id}
                                                        className="flex items-center gap-3 p-3 border rounded-lg">
                                                        <Avatar>
                                                            <AvatarFallback>
                                                                {getInitials(
                                                                    user.name,
                                                                    user.last_name,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <p className="font-medium">
                                                                {user.name}{' '}
                                                                {user.last_name}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            {user.roles.map(
                                                                role => (
                                                                    <Badge
                                                                        key={
                                                                            role
                                                                        }
                                                                        variant="outline"
                                                                        className="text-xs">
                                                                        {role.replace(
                                                                            '_',
                                                                            ' ',
                                                                        )}
                                                                    </Badge>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent
                                    value="details"
                                    className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>
                                                    Organization Info
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <div>
                                                    <span className="font-medium">
                                                        Domain:
                                                    </span>
                                                    <span className="ml-2 text-muted-foreground">
                                                        {selectedOrganization.domain ||
                                                            'Not configured'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">
                                                        Status:
                                                    </span>
                                                    <Badge
                                                        className={`ml-2 ${getStatusColor(selectedOrganization.status)}`}>
                                                        {
                                                            selectedOrganization.status || 'No status'
                                                        }
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Activity</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <div>
                                                    <span className="font-medium">
                                                        Created:
                                                    </span>
                                                    <span className="ml-2 text-muted-foreground">
                                                        {formatDate(
                                                            selectedOrganization.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">
                                                        Updated:
                                                    </span>
                                                    <span className="ml-2 text-muted-foreground">
                                                        {formatDate(
                                                            selectedOrganization.updated_at,
                                                        )}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">
                                                        Last Activity:
                                                    </span>
                                                    <span className="ml-2 text-muted-foreground">
                                                        {formatDate(
                                                            selectedOrganization.last_activity,
                                                        )}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setSelectedOrganization(null)
                                    }>
                                    Close
                                </Button>
                                <Button variant={'outline'}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Join Organization
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
