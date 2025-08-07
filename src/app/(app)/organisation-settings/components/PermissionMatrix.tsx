'use client'

import React, { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ChevronsUpDown, Lock } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import type { Permission, Role } from '@/types/roles-and-permissions'

type Group = 'full' | 'readwrite' | 'readonly' | 'none'

interface PermissionMatrixProps {
    roles: Role[]
    allPermissions: Permission[]
}

const IMMUTABLE_ROLE_NAMES = new Set(['member', 'administrator'])
const CRUD_ORDER = ['create', 'view', 'edit', 'delete'] as const

// If your org considers "write" to also include delete, set this to true.
const READWRITE_INCLUDES_DELETE = false

function parseName(name: string) {
    const [category, action] = name.split(':')
    return { category, action }
}

export function PermissionMatrix({
    roles: initialRoles,
    allPermissions,
}: PermissionMatrixProps) {
    const [roles, setRoles] = useState<Role[]>(
        initialRoles.map(r => ({
            ...r,
            permissions: (r.permissions || []).map(p => ({
                ...p,
                category: p.category ?? parseName(p.name).category,
            })),
        })),
    )

    console.log('roles', roles)
    console.log('allPermissions', allPermissions)

    const categories = useMemo(() => {
        const s = new Set<string>()
        for (const p of allPermissions) {
            s.add(p.category ?? parseName(p.name).category)
        }
        return Array.from(s).sort()
    }, [allPermissions])

    const byCategory = useMemo(() => {
        const map: Record<
            string,
            {
                manage?: Permission
                actions: { action: string; perm: Permission }[]
            }
        > = {}
        for (const cat of categories) map[cat] = { actions: [] }
        for (const p of allPermissions) {
            const cat = p.category ?? parseName(p.name).category
            const act = parseName(p.name).action
            const bucket = map[cat] || (map[cat] = { actions: [] })
            if (act === 'manage') bucket.manage = { ...p, category: cat }
            else
                bucket.actions.push({
                    action: act,
                    perm: { ...p, category: cat },
                })
        }
        for (const cat of Object.keys(map)) {
            map[cat].actions.sort((a, b) => {
                const ai = CRUD_ORDER.indexOf(
                    a.action as (typeof CRUD_ORDER)[number],
                )
                const bi = CRUD_ORDER.indexOf(
                    b.action as (typeof CRUD_ORDER)[number],
                )
                return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
            })
        }
        return map
    }, [allPermissions, categories])

    function isImmutable(role: Role) {
        return IMMUTABLE_ROLE_NAMES.has(role.name.toLowerCase())
    }

    function hasPerm(role: Role, permName: string) {
        return !!role.permissions?.some(p => p.name === permName)
    }

    function currentCrudSet(role: Role, category: string) {
        const { actions } = byCategory[category]
        const set = new Set<string>()
        for (const a of actions) {
            if (hasPerm(role, a.perm.name)) set.add(a.action)
        }
        return set
    }

    function getGroup(role: Role, category: string): Group {
        const group = byCategory[category]
        const hasManage = group.manage
            ? hasPerm(role, group.manage.name)
            : false
        const crud = currentCrudSet(role, category)

        const hasAllCrud = ['view', 'create', 'edit', 'delete'].every(a =>
            crud.has(a),
        )
        if (hasManage || hasAllCrud) return 'full'

        const hasView = crud.has('view')
        const hasCreateOrEdit = crud.has('create') || crud.has('edit')
        const hasDelete = crud.has('delete')

        if (
            hasView &&
            hasCreateOrEdit &&
            (!hasDelete || READWRITE_INCLUDES_DELETE)
        ) {
            // If READWRITE includes delete and delete is present, it still qualifies.
            // If it does not include delete, ensure delete is not present.
            return 'readwrite'
        }

        if (
            hasView &&
            !crud.has('create') &&
            !crud.has('edit') &&
            !crud.has('delete')
        ) {
            return 'readonly'
        }

        if (!hasView && crud.size === 0) return 'none'

        // Fallback: pick the closest bucket
        if (hasView && crud.size > 0) return 'readwrite'
        return 'none'
    }

    function applyGroup(role: Role, category: string, groupSel: Group) {
        const group = byCategory[category]
        setRoles(prev =>
            prev.map(r => {
                if (r.id !== role.id) return r
                const keep = (r.permissions || []).filter(
                    p =>
                        (p.category ?? parseName(p.name).category) !== category,
                )

                if (groupSel === 'none') {
                    return { ...r, permissions: keep }
                }

                if (groupSel === 'full') {
                    // Prefer manage when available; otherwise grant all CRUD available in this category
                    if (group.manage) {
                        return { ...r, permissions: [...keep, group.manage] }
                    } else {
                        const allCrud = group.actions.map(x => x.perm)
                        return { ...r, permissions: [...keep, ...allCrud] }
                    }
                }

                if (groupSel === 'readonly') {
                    const view = group.actions.find(
                        x => x.action === 'view',
                    )?.perm
                    return { ...r, permissions: view ? [...keep, view] : keep }
                }

                // readwrite
                const wanted = new Set<string>(['view', 'create', 'edit'])
                if (READWRITE_INCLUDES_DELETE) wanted.add('delete')
                const toAdd = group.actions
                    .filter(x => wanted.has(x.action))
                    .map(x => x.perm)
                return { ...r, permissions: [...keep, ...toAdd] }
            }),
        )
    }

    function handleSave() {
        toast({
            title: 'Saved',
            description:
                'Permission group selections applied to underlying CRUD/manage permissions (simulated).',
        })
        // In your app, persist `roles` via Server Action or route handler.
    }

    function badgeFor(group: Group) {
        switch (group) {
            case 'full':
                return {
                    label: 'Full Access',
                    className: 'bg-emerald-200 text-emerald-950',
                }
            case 'readwrite':
                return {
                    label: 'Read/Write',
                    className: 'bg-amber-200 text-amber-950',
                }
            case 'readonly':
                return {
                    label: 'Read Only',
                    className: 'bg-sky-200 text-sky-950',
                }
            default:
                return {
                    label: 'No Access',
                    className: 'bg-neutral-200 text-neutral-900',
                }
        }
    }

    function summarize(role: Role, category: string) {
        const group = byCategory[category]
        const hasOnlyManage = group.manage && group.actions.length === 0
        const groupSel = getGroup(role, category)

        if (groupSel === 'none') return 'No access'
        if (hasOnlyManage) return 'manage'
        if (groupSel === 'full') {
            const hasManage = !!group.manage
            return hasManage ? 'manage' : 'create, view, edit, delete'
        }
        if (groupSel === 'readonly') return 'view'
        if (groupSel === 'readwrite')
            return READWRITE_INCLUDES_DELETE
                ? 'view, create, edit, delete'
                : 'view, create, edit'

        return 'No access'
    }

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold">
                        Permission Groups
                    </h2>
                    <Badge variant="outline">Simplified</Badge>
                </div>
                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge
                            variant="secondary"
                            className="bg-emerald-200 text-emerald-950">
                            Full
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="bg-amber-200 text-amber-950">
                            Read/Write
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="bg-sky-200 text-sky-950">
                            Read Only
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="bg-neutral-200 text-neutral-900">
                            No Access
                        </Badge>
                    </div>
                    <Button size="sm" onClick={handleSave}>
                        Save changes
                    </Button>
                </div>
            </header>

            <div className="overflow-x-auto border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[220px]">
                                Category
                            </TableHead>
                            {roles.map(role => (
                                <TableHead
                                    key={role.id}
                                    className="text-center min-w-[220px]">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="font-medium">
                                            {role.name}
                                        </span>
                                        {isImmutable(role) ? (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs flex items-center gap-1">
                                                <Lock className="h-3 w-3" />
                                                System
                                            </Badge>
                                        ) : role.is_custom ? (
                                            <Badge
                                                variant="outline"
                                                className="text-xs">
                                                Custom
                                            </Badge>
                                        ) : null}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {categories.map(category => (
                            <TableRow key={category}>
                                <TableCell className="align-top">
                                    <div className="flex flex-col">
                                        <span className="font-medium capitalize">
                                            {category}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Set {category.replace(/_/g, ' ')}{' '}
                                            access level.
                                        </span>
                                    </div>
                                </TableCell>

                                {roles.map(role => {
                                    const immutable = isImmutable(role)
                                    const groupSel = getGroup(role, category)
                                    const badge = badgeFor(groupSel)
                                    const group = byCategory[category]
                                    const hasOnlyManage =
                                        group.manage &&
                                        group.actions.length === 0
                                    const manageAvailable = !!group.manage

                                    return (
                                        <TableCell
                                            key={`${category}:${role.id}`}
                                            className="align-top">
                                            <div
                                                className={cn(
                                                    'flex flex-col gap-1 items-center',
                                                    immutable && 'opacity-60',
                                                )}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            className={cn(
                                                                'w-full justify-center',
                                                                badge.className,
                                                            )}
                                                            disabled={immutable}
                                                            aria-label={`Set ${category} access for ${role.name}`}>
                                                            <span className="text-xs text-muted-foreground">
                                                                {badge.label}
                                                            </span>
                                                            <ChevronsUpDown
                                                                className="text-muted-foreground"
                                                                size={16}
                                                            />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="center"
                                                        className="w-60">
                                                        {/*<DropdownMenuLabel>*/}
                                                        {/*    Access Level*/}
                                                        {/*</DropdownMenuLabel>*/}

                                                        {/*<DropdownMenuSeparator />*/}

                                                        {hasOnlyManage ? (
                                                            <>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        applyGroup(
                                                                            role,
                                                                            category,
                                                                            'full',
                                                                        )
                                                                    }>
                                                                    Manage
                                                                    Access
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        applyGroup(
                                                                            role,
                                                                            category,
                                                                            'none',
                                                                        )
                                                                    }>
                                                                    No Access
                                                                </DropdownMenuItem>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        applyGroup(
                                                                            role,
                                                                            category,
                                                                            'full',
                                                                        )
                                                                    }>
                                                                    Full Access{' '}
                                                                    {manageAvailable
                                                                        ? '(manage)'
                                                                        : '(all CRUD)'}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        applyGroup(
                                                                            role,
                                                                            category,
                                                                            'readwrite',
                                                                        )
                                                                    }>
                                                                    Read/Write
                                                                    (view,
                                                                    create, edit
                                                                    {READWRITE_INCLUDES_DELETE
                                                                        ? ', delete'
                                                                        : ''}
                                                                    )
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        applyGroup(
                                                                            role,
                                                                            category,
                                                                            'readonly',
                                                                        )
                                                                    }>
                                                                    Read Only
                                                                    (view)
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        applyGroup(
                                                                            role,
                                                                            category,
                                                                            'none',
                                                                        )
                                                                    }>
                                                                    No Access
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>

                                                <span className="text-[10px] text-muted-foreground">
                                                    {summarize(role, category)}
                                                </span>
                                            </div>
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="text-xs text-muted-foreground">
                Your selection sets the underlying CRUD/manage permissions
                automatically. System roles (member, administrator) are locked.
            </div>
        </div>
    )
}
