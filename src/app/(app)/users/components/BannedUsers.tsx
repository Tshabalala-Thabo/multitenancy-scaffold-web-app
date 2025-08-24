'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
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
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldOff, Calendar, User } from 'lucide-react'
import { formatDate } from '@/utils/dateFormatter'
import { useUserBans } from '@/hooks/useUserBans'
import { useAuth } from '@/hooks/auth'

export function BannedUsers() {
    const [unbanReason, setUnbanReason] = useState('')
    const { user } = useAuth()
    const { bans, unbanUser } = useUserBans()

    const handleUnbanUser = async (userId: number) => {
        await unbanUser(userId, unbanReason || undefined)
        setUnbanReason('')
    }

    if (bans.length === 0) {
        return (
            <div className="text-center py-8">
                <ShieldOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No banned users found</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Banned Date</TableHead>
                        <TableHead>Banned By</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bans.map(ban => (
                        <TableRow key={ban.id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">
                                            {ban.user.name} {ban.user.last_name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {ban.user.email}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                {ban.reason ? (
                                    <Badge variant="destructive" className="text-xs">
                                        {ban.reason}
                                    </Badge>
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        not specified
                                    </span>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 text-sm">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(ban.banned_at)}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="text-sm">
                                    <div className="font-medium">
                                        {ban.banned_by.name} {ban.banned_by.last_name}
                                    </div>
                                    <div className="text-muted-foreground">
                                        {ban.banned_by.email}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <ShieldOff className="h-4 w-4 mr-1" />
                                            Unban
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Unban User</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to unban {ban.user.name}{' '}
                                                {ban.user.last_name}? This will restore their access
                                                to the organisation.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <div className="space-y-2">
                                            <Label htmlFor="unban-reason">
                                                Reason for unbanning (optional)
                                            </Label>
                                            <Input
                                                id="unban-reason"
                                                placeholder="e.g., Appeal accepted, Timeout completed..."
                                                value={unbanReason}
                                                onChange={e =>
                                                    setUnbanReason(e.target.value)
                                                }
                                            />
                                        </div>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel
                                                onClick={() => setUnbanReason('')}
                                            >
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleUnbanUser(ban.user.id)}
                                            >
                                                Unban User
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
