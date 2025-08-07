// Announcement Management
export interface Announcement {
  id: number
  title: string
  content: string // Rich text content
  target_audience: "all" | "specific_roles" | "specific_users"
  target_role_ids?: number[]
  target_user_ids?: number[]
  priority: "low" | "normal" | "high" | "urgent"
  status: "draft" | "published" | "scheduled" | "archived"
  scheduled_at: string | null
  published_at: string | null
  attachments: AnnouncementAttachment[]
  views: number
  engagement_rate: number // Percentage
  created_at: string
  updated_at: string
}

export interface AnnouncementAttachment {
  id: number
  file_name: string
  file_url: string
  file_type: string
  size: number
}

export interface AnnouncementCreatePayload {
  title: string
  content: string
  target_audience: "all" | "specific_roles" | "specific_users"
  target_role_ids?: number[]
  target_user_ids?: number[]
  priority: "low" | "normal" | "high" | "urgent"
  scheduled_at?: string | null
  attachments?: File[] // For new attachments
}