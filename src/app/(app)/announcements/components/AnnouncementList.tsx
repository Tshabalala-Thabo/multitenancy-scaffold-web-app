'use client'

import { useState } from 'react'
import type { Announcement } from '@/types/announcement'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
    MoreHorizontal,
    Eye,
    Edit,
    Copy,
    Archive,
    Trash2,
    FileText,
} from 'lucide-react'
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'

interface AnnouncementListProps {
    announcements: Announcement[]
    orgId: number
}

export function AnnouncementList({
    announcements: initialAnnouncements,
    orgId,
}: AnnouncementListProps) {
    const [announcements, setAnnouncements] = useState(initialAnnouncements)
    const [previewAnnouncement, setPreviewAnnouncement] =
        useState<Announcement | null>(null)
    const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)

    const handleEdit = (announcement: Announcement) => {
        toast({
            title: 'Edit Announcement',
            description: `Navigating to edit ${announcement.title}.`,
        })
        // In a real app, navigate to an edit page: router.push(`/dashboard/${orgId}/announcements/${announcement.id}/edit`)
    }

    const handleDuplicate = async (announcement: Announcement) => {
        toast({
            title: 'Duplicating announcement...',
            description: `Duplicating "${announcement.title}".`,
        })
        await new Promise(resolve => setTimeout(resolve, 500))
        const duplicatedAnnouncement: Announcement = {
            ...announcement,
            id: Math.floor(Math.random() * 100000), // Mock new ID
            title: `Copy of ${announcement.title}`,
            status: 'draft',
            published_at: null,
            scheduled_at: null,
            views: 0,
            engagement_rate: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        setAnnouncements(prev => [...prev, duplicatedAnnouncement])
        toast({
            title: 'Success',
            description: `"${announcement.title}" duplicated.`,
        })
    }

    const handleArchive = async (announcement: Announcement) => {
        toast({
            title: 'Archiving announcement...',
            description: `Archiving "${announcement.title}".`,
        })
        await new Promise(resolve => setTimeout(resolve, 500))
        setAnnouncements(prev =>
            prev.map(a =>
                a.id === announcement.id ? { ...a, status: 'archived' } : a,
            ),
        )
        toast({
            title: 'Success',
            description: `"${announcement.title}" archived.`,
        })
    }

    const handleDelete = async (announcementId: number) => {
        toast({
            title: 'Deleting announcement...',
            description: `Deleting announcement ID: ${announcementId}.`,
        })
        await new Promise(resolve => setTimeout(resolve, 500))
        setAnnouncements(prev => prev.filter(a => a.id !== announcementId))
        toast({
            title: 'Success',
            description: `Announcement ${announcementId} deleted.`,
        })
    }

    const handlePreview = (announcement: Announcement) => {
        setPreviewAnnouncement(announcement)
        setIsPreviewDialogOpen(true)
    }

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Audience</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Published/Scheduled</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead>Engagement</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {announcements.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="h-24 text-center text-muted-foreground">
                                    No announcements found.
                                </TableCell>
                            </TableRow>
                        )}
                        {announcements.map(announcement => (
                            <TableRow key={announcement.id}>
                                <TableCell className="font-medium">
                                    {announcement.title}
                                </TableCell>
                                <TableCell>
                                    {announcement.target_audience === 'all'
                                        ? 'All Users'
                                        : 'Specific'}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            announcement.priority === 'urgent'
                                                ? 'destructive'
                                                : announcement.priority ===
                                                    'high'
                                                  ? 'default'
                                                  : 'secondary'
                                        }>
                                        {announcement.priority
                                            .charAt(0)
                                            .toUpperCase() +
                                            announcement.priority.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            announcement.status === 'published'
                                                ? 'default'
                                                : announcement.status ===
                                                    'scheduled'
                                                  ? 'outline'
                                                  : 'secondary'
                                        }>
                                        {announcement.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            announcement.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {announcement.published_at
                                        ? format(
                                              new Date(
                                                  announcement.published_at,
                                              ),
                                              'PPP',
                                          )
                                        : announcement.scheduled_at
                                          ? `Scheduled: ${format(new Date(announcement.scheduled_at), 'PPP')}`
                                          : 'N/A'}
                                </TableCell>
                                <TableCell>{announcement.views}</TableCell>
                                <TableCell>
                                    {(
                                        announcement.engagement_rate * 100
                                    ).toFixed(1)}
                                    %
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                                aria-label="Announcement actions">
                                                <span className="sr-only">
                                                    Open menu
                                                </span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                Actions
                                            </DropdownMenuLabel>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handlePreview(announcement)
                                                }>
                                                <Eye className="mr-2 h-4 w-4" />{' '}
                                                Preview
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleEdit(announcement)
                                                }>
                                                <Edit className="mr-2 h-4 w-4" />{' '}
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleDuplicate(
                                                        announcement,
                                                    )
                                                }>
                                                <Copy className="mr-2 h-4 w-4" />{' '}
                                                Duplicate
                                            </DropdownMenuItem>
                                            {announcement.status !==
                                                'archived' && (
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleArchive(
                                                            announcement,
                                                        )
                                                    }>
                                                    <Archive className="mr-2 h-4 w-4" />{' '}
                                                    Archive
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem
                                                        onSelect={e =>
                                                            e.preventDefault()
                                                        }>
                                                        <Trash2 className="mr-2 h-4 w-4" />{' '}
                                                        Delete
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Are you absolutely
                                                            sure?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot
                                                            be undone. This will
                                                            permanently delete
                                                            the announcement "
                                                            {announcement.title}
                                                            ".
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                handleDelete(
                                                                    announcement.id,
                                                                )
                                                            }>
                                                            Continue
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Announcement Preview Dialog */}
            <Dialog
                open={isPreviewDialogOpen}
                onOpenChange={setIsPreviewDialogOpen}>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>{previewAnnouncement?.title}</DialogTitle>
                        <DialogDescription>
                            Published:{' '}
                            {previewAnnouncement?.published_at
                                ? format(
                                      new Date(
                                          previewAnnouncement.published_at,
                                      ),
                                      'PPP',
                                  )
                                : 'N/A'}{' '}
                            | Priority: {previewAnnouncement?.priority}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="prose max-w-none dark:prose-invert">
                        <p>{previewAnnouncement?.content}</p>
                        {previewAnnouncement?.attachments &&
                            previewAnnouncement.attachments.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-lg font-semibold">
                                        Attachments:
                                    </h4>
                                    <ul className="list-disc pl-5">
                                        {previewAnnouncement.attachments.map(
                                            attachment => (
                                                <li
                                                    key={attachment.id}
                                                    className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    <a
                                                        href={
                                                            attachment.file_url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="underline">
                                                        {attachment.file_name} (
                                                        {Math.round(
                                                            attachment.size /
                                                                1024,
                                                        )}{' '}
                                                        KB)
                                                    </a>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}
                        <div className="mt-4 text-sm text-muted-foreground">
                            <p>
                                Views: {previewAnnouncement?.views} |
                                Engagement:{' '}
                                {(
                                    previewAnnouncement?.engagement_rate ||
                                    0 * 100
                                ).toFixed(1)}
                                %
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
