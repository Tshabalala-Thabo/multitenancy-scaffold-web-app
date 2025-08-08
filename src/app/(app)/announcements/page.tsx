import type { Announcement } from "@//types/announcement"
import { AnnouncementForm } from "./components/AnnouncementForm"
import { AnnouncementList } from "./components/AnnouncementList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header  from '@/components/Header'
// Mock data fetching functions
async function getAnnouncements(orgId: number): Promise<Announcement[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
        {
            id: 1,
            title: "Important System Maintenance",
            content:
                "We will be performing system maintenance on August 15th from 2 AM to 4 AM UTC. Expect brief interruptions.",
            target_audience: "all",
            priority: "high",
            status: "published",
            scheduled_at: null,
            published_at: "2025-07-28T10:00:00Z",
            attachments: [],
            views: 150,
            engagement_rate: 0.85,
            created_at: "2025-07-27T09:00:00Z",
            updated_at: "2025-07-28T10:00:00Z",
        },
        {
            id: 2,
            title: "New Feature: Project Templates",
            content:
                "Exciting news! We've launched new project templates to help you get started faster. Check them out in the 'Projects' section.",
            target_audience: "specific_roles",
            target_role_ids: [2],
            priority: "normal",
            status: "published",
            scheduled_at: null,
            published_at: "2025-07-25T14:30:00Z",
            attachments: [
                {
                    id: 1,
                    file_name: "feature-guide.pdf",
                    file_url: "/placeholder.svg?height=24&width=24",
                    file_type: "application/pdf",
                    size: 120000,
                },
            ],
            views: 80,
            engagement_rate: 0.7,
            created_at: "2025-07-24T11:00:00Z",
            updated_at: "2025-07-25T14:30:00Z",
        },
        {
            id: 3,
            title: "Upcoming Holiday Schedule",
            content: "Our offices will be closed on September 2nd for the national holiday. Support will be limited.",
            target_audience: "all",
            priority: "low",
            status: "scheduled",
            scheduled_at: "2025-08-20T09:00:00Z",
            published_at: null,
            attachments: [],
            views: 0,
            engagement_rate: 0,
            created_at: "2025-07-30T16:00:00Z",
            updated_at: "2025-07-30T16:00:00Z",
        },
        {
            id: 4,
            title: "Draft: Q3 Performance Review",
            content: "Internal draft for Q3 performance review summary. Do not publish.",
            target_audience: "specific_roles",
            target_role_ids: [1], // Assuming 'admin' role ID is 1
            priority: "normal",
            status: "draft",
            scheduled_at: null,
            published_at: null,
            attachments: [],
            views: 0,
            engagement_rate: 0,
            created_at: "2025-07-29T09:00:00Z",
            updated_at: "2025-07-29T09:00:00Z",
        },
    ]
}

export default async function AnnouncementManagementPage({ params }: { params: { orgId: string } }) {
    const orgId = Number.parseInt(params.orgId)
    const announcements = await getAnnouncements(orgId)

    return (
        <div>
            <Header title="Announcements Management" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Announcements</CardTitle>
                        <CardDescription>View, edit, and track your organization's announcements.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AnnouncementList announcements={announcements} orgId={orgId} />
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}
