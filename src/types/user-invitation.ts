export interface UserInvitePayload {
    email: string
    roles: string[]
    message?: string
}

export interface PendingInvitation {
    id: number
    email: string
    roles: string[]
    invited_by: string // User name
    invited_at: string
    status: "pending" | "accepted" | "cancelled"
}
