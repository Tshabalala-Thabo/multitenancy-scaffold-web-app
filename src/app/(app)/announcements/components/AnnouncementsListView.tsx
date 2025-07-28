import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { formatDate } from '@/utils/dateFormatter'

interface Announcement {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

interface AnnouncementsListViewProps {
    announcements: Announcement[];
}

export const AnnouncementsListView = ({ announcements, }: AnnouncementsListViewProps) => (
    <div className="flex flex-1 flex-col gap-4 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card>
            <CardHeader>
                <CardTitle>Latest Updates</CardTitle>
                <CardDescription>
                    Stay up-to-date with the latest news and announcements.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {announcements.map(announcement => (
                        <div key={announcement.id} className="p-4 border rounded-md">
                            <h3 className="font-semibold">{announcement.title}</h3>
                            <p className="text-sm text-muted-foreground">{formatDate(announcement.created_at)}</p>
                            <p className="mt-2">{announcement.content}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
)
