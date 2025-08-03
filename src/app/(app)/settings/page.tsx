"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Button } from '@/components/ui/button'
import Header from "@/components/Header"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Loader2, Users } from "lucide-react"
import { useAuth } from "@/hooks/auth"
import { useOrganisationUser } from "@/hooks/useOrganisationUser"

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
}

export default function MyOrganizations(
) {
    const { user } = useAuth()
    const userOrganisations = user?.organisations || []
    const userRoles = user?.roles || []
    const [activeOrganizationId, setActiveOrganizationId] = useState<number | null>(user?.tenant_id || null)
    const [leavingOrgId, setLeavingOrgId] = useState<number | null>(null)
    const [switchingOrgId, setSwitchingOrgId] = useState<number | null>(null)
    const { switchOrganisation } = useOrganisationUser()

    const handleLeaveOrganization = async (orgId: number) => {
        setLeavingOrgId(orgId)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log(`Simulating leaving organization ${orgId}.`)
        // In a real application, you would update the state or refetch data.
        setLeavingOrgId(null)
    }

    const handleSwitchToOrganization = async (orgId: number) => {
        setSwitchingOrgId(orgId)
        try {
            const success = await switchOrganisation(orgId)
            if (success) {
                setActiveOrganizationId(orgId)
            }
        } catch (error) {
            console.error('Failed to switch organization:', error)
        } finally {
            setSwitchingOrgId(null)
        }
    }

    return (
        <>
            <Header title="Settings" />
            <div className="flex flex-1 flex-col gap-4 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h3>My organisations</h3>
                <div className="space-y-6">
                    {userOrganisations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <Users className="h-12 w-12 mb-4" />
                            <p className="text-lg font-medium">No organizations found</p>
                            <p className="text-sm">Try adjusting your search or join a new organization.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {userOrganisations.map((org) => {
                                const role = userRoles.find((r) => r.tenant_id === org.id)
                                const isAdministrator = role?.name === "administrator"
                                const isActive = activeOrganizationId === org.id
                                const isCurrentlyLeaving = leavingOrgId === org.id
                                const isCurrentlySwitching = switchingOrgId === org.id

                                return (
                                    <Card
                                        key={org.id}
                                        className={cn(
                                            "flex flex-col md:flex-row items-start md:items-center justify-between p-4 transition-all duration-300 ease-in-out",
                                            isActive && "border-primary ring-2 ring-primary/20",
                                        )}
                                    >
                                        <CardContent className="p-0 flex-1 w-full md:w-auto flex flex-col md:flex-row items-start md:items-center gap-4">
                                            {org.logo_url ? (
                                                <Image
                                                    src={org.logo_url || "/placeholder.svg"}
                                                    alt={`${org.name} logo`}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-muted text-muted-foreground font-semibold text-lg shrink-0">
                                                    {getInitials(org.name)}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold truncate">{org.name}</h3>
                                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                                                    <span>Role: {role?.name || 'No role assigned'}</span>
                                                    {/* <Badge className={cn("text-xs px-2 py-0.5 rounded-full", statusColors[organization.status])}>
                            {organization.status.charAt(0).toUpperCase() + organization.status.slice(1)}
                        </Badge> */}
                                                </div>
                                            </div>
                                        </CardContent>

                                        <div className="flex gap-2 mt-4 md:mt-0 md:ml-4 w-full md:w-auto justify-end">
                                            <Button
                                                variant="default"
                                                onClick={() => handleSwitchToOrganization(org.id)}
                                                disabled={isActive || isCurrentlySwitching}
                                                className="flex-1 md:flex-none"
                                            >
                                                {isCurrentlySwitching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                {isActive ? "Current" : "Switch To"}
                                            </Button>

                                            {isAdministrator ? (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="outline" disabled className="flex-1 md:flex-none bg-transparent">
                                                                Leave
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Administrators cannot leave their own organization.</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" className="flex-1 md:flex-none" disabled={isCurrentlyLeaving}>
                                                            {isCurrentlyLeaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                            Leave
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will remove you from the &quot;{org.name}&quot;
                                                                organization.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleLeaveOrganization(org.id)} disabled={isCurrentlyLeaving}>
                                                                {isCurrentlyLeaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                Continue
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}



