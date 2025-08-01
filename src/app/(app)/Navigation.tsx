import React, { useState, useMemo } from 'react'
import ApplicationLogo from '@/components/ApplicationLogo'
import Dropdown from '@/components/Dropdown'
import Link from 'next/link'
import NavLink from '@/components/NavLink'
import ResponsiveNavLink, {
    ResponsiveNavButton,
} from '@/components/ResponsiveNavLink'
import { DropdownButton } from '@/components/DropdownLink'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/auth'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/Button'
import { ChevronsUpDown, ChevronDown, Search, User, Settings, LogOut } from 'lucide-react'
import { User as UserType } from '@/hooks/auth'

interface NavigationProps {
    user: UserType
}

// Helper function to generate avatar initials
const generateAvatar = (name: string): string => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
}

// Helper function to get user's role for a specific tenant
const getUserRole = (user: UserType, tenantId: number): string => {
    const role = user.roles.find(role => role.tenant_id === tenantId)
    return role ? role.name : 'member'
}

const Navigation: React.FC<NavigationProps> = ({ user }) => {
    const { logout } = useAuth()
    console.log('user', user)
    const userRoles = user.roles.map(role => role.name)

    // Transform user organizations to match the dropdown format
    const organizations = useMemo(() => {
        return user.organisations.map(org => ({
            id: org.id,
            name: org.name,
            avatar: generateAvatar(org.name),
            role: getUserRole(user, org.id),
            logo_url: org.logo_url,
        }))
    }, [user])

    // Find the currently selected organization based on current_tenant_id
    const selectedOrg = useMemo(() => {
        return (
            organizations.find(org => org.id === user.tenant_id) ||
            organizations[0]
        )
    }, [organizations, user.tenant_id])

    const [open, setOpen] = useState<boolean>(false)

    const handleOrgChange = (org: (typeof organizations)[0]) => {
        // Handle organization change logic here
        // You might want to call an API to update the user's current tenant
        console.log('Switching to organization:', org)
    }

    const handleCreateOrganization = () => {
        // Handle create organization logic here
        console.log('Create new organization')
    }

    // Check if user has organizations to determine what to show on the left
    const hasOrganizations = organizations.length > 0

    return (
        <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
            {/* Primary Navigation Menu */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        {/* Logo or Organization Selector */}
                        <div className="flex-shrink-0 flex items-center">
                            {hasOrganizations ? (
                                organizations.length > 1 ? (
                                    // Dropdown when user has multiple organizations
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant='ghost'
                                                className="flex items-center space-x-2 h-12 px-3 bg-transparent hover:bg-foreground/10 transition-all duration-200">
                                                <Avatar className="w-8 h-8 rounded-none">
                                                    {selectedOrg?.logo_url ? (
                                                        <AvatarImage
                                                            src={selectedOrg.logo_url}
                                                            alt={selectedOrg.name}
                                                            className="object-contain rounded-none"
                                                        />
                                                    ) : null}
                                                    <AvatarFallback className="text-sm bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-semibold rounded-none">
                                                        {selectedOrg?.avatar}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col items-start">
                                                    <span className="font-semibold text-gray-900 text-lg leading-tight">
                                                        {selectedOrg?.name}
                                                    </span>
                                                    <span className="text-xs text-gray-500 capitalize leading-tight">
                                                        {selectedOrg?.role}
                                                    </span>
                                                </div>
                                                <ChevronsUpDown className="w-4 h-4 text-gray-600 ml-1" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="start"
                                            className="w-72 bg-white border-gray-200 shadow-xl rounded-xl p-2">
                                            <DropdownMenuLabel className="text-gray-900 font-semibold px-2 py-2">
                                                Switch Organization
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-gray-200 my-2" />
                                            <div className="space-y-1">
                                                {organizations.map(org => (
                                                    <DropdownMenuItem
                                                        key={org.id}
                                                        onClick={() =>
                                                            handleOrgChange(org)
                                                        }
                                                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 focus:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer">
                                                        <Avatar className="w-10 h-10 shadow-sm rounded-none">
                                                            {org.logo_url ? (
                                                                <AvatarImage
                                                                    src={org.logo_url}
                                                                    alt={org.name}
                                                                    className="object-contain rounded-none"
                                                                />
                                                            ) : null}
                                                            <AvatarFallback className="text-sm bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-semibold rounded-none">
                                                                {org.avatar}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-gray-900 truncate">
                                                                {org.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 capitalize">
                                                                {org.role}
                                                            </div>
                                                        </div>
                                                        {selectedOrg?.id === org.id && (
                                                            <div className="w-2 h-2 bg-blue-600 rounded-full shadow-sm" />
                                                        )}
                                                    </DropdownMenuItem>
                                                ))}
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    // Static display when user has only one organization
                                    <div className="flex items-center space-x-2 px-3 py-2">
                                        <Avatar className="w-8 h-8">
                                            {selectedOrg?.logo_url ? (
                                                <AvatarImage
                                                    src={selectedOrg.logo_url}
                                                    alt={selectedOrg.name}
                                                    className="object-cover"
                                                />
                                            ) : null}
                                            <AvatarFallback className="text-sm bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-semibold">
                                                {selectedOrg?.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col items-start">
                                            <span className="font-semibold text-gray-900 text-lg leading-tight">
                                                {selectedOrg?.name}
                                            </span>
                                            <span className="text-xs text-gray-500 capitalize leading-tight">
                                                {selectedOrg?.role}
                                            </span>
                                        </div>
                                    </div>
                                )
                            ) : (
                                // Original Logo when user has no organizations
                                <Link
                                    href="/dashboard"
                                    className="flex items-center space-x-2 group">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />
                                    <span className="hidden sm:block font-semibold text-gray-900 text-lg">
                                        Dashboard
                                    </span>
                                </Link>
                            )}
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-6">
                            <NavLink
                                href="/dashboard"
                                active={usePathname() === '/dashboard'}>
                                Dashboard
                            </NavLink>
                            <NavLink
                                href="/announcements"
                                active={usePathname() === '/announcements'}>
                                Announcements
                            </NavLink>
                            <NavLink
                                href="/organisations"
                                active={usePathname() === '/organisations'}>
                                {userRoles.includes('super_admin')
                                    ? 'Organisations'
                                    : 'Discover'}
                            </NavLink>
                        </div>
                    </div>

                    {/* Right side items */}
                    <div className="flex items-center space-x-4">
                        {/* Search Button - Hidden on mobile */}
                        <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200">
                            <Search className="w-5 h-5" />
                        </button>

                        {/* User Profile Dropdown */}
                        <div className="hidden sm:flex sm:items-center">
                            <Dropdown
                                align="right"
                                width="56"
                                trigger={
                                    <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                        <Avatar className="w-8 h-8 shadow-sm">
                                            <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 font-semibold text-sm">
                                                {user?.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="hidden lg:block text-left">
                                            <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                                                {user?.name} {user?.last_name}
                                            </div>
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-gray-500" />
                                    </button>
                                }>
                                <div className="p-2">
                                    <div className="px-3 py-2 border-b border-gray-100 mb-2">
                                        <div className="font-medium text-gray-900">
                                            {user?.name} {user?.last_name}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            {user?.email}
                                        </div>
                                    </div>
                                    <DropdownButton className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors duration-150">
                                        <User className="w-4 h-4" />
                                        <span>Profile</span>
                                    </DropdownButton>
                                    <DropdownButton className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors duration-150">
                                        <Settings className="w-4 h-4" />
                                        <span>Settings</span>
                                    </DropdownButton>
                                    <div className="border-t border-gray-100 mt-2 pt-2">
                                        <DropdownButton
                                            onClick={logout}
                                            className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-150">
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </DropdownButton>
                                    </div>
                                </div>
                            </Dropdown>
                        </div>

                        {/* Mobile Hamburger */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setOpen(open => !open)}
                                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition-all duration-200">
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    {open ? (
                                        <path
                                            className="inline-flex"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            className="inline-flex"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Responsive Navigation Menu */}
            {open && (
                <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href="/dashboard"
                            active={usePathname() === '/dashboard'}>
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="/announcements"
                            active={usePathname() === '/announcements'}>
                            Announcements
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="/organisations"
                            active={usePathname() === '/organisations'}>
                            {userRoles.includes('super_admin')
                                ? 'Organisations'
                                : 'Discover'}
                        </ResponsiveNavLink>
                    </div>

                    {/* Enhanced Responsive User Section */}
                    <div className="pt-4 pb-1 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center px-4 py-3">
                            <Avatar className="w-12 h-12 shadow-sm">
                                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-semibold">
                                    {user?.name?.charAt(0)?.toUpperCase() ||
                                        'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-3 flex-1 min-w-0">
                                <div className="font-medium text-base text-gray-800 truncate">
                                    {user?.name} {user?.last_name}
                                </div>
                                <div className="font-medium text-sm text-gray-500 truncate">
                                    {user?.email}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 px-4 space-y-1">
                            <ResponsiveNavButton>Profile</ResponsiveNavButton>
                            <ResponsiveNavButton>Settings</ResponsiveNavButton>
                            <ResponsiveNavButton onClick={logout}>
                                Logout
                            </ResponsiveNavButton>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navigation
