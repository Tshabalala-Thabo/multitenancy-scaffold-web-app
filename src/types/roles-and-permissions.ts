export interface Role {
    id: number
    name: string
    description?: string
    permissions?: Permission[]
    tenant_id?: number
    is_custom?: boolean
}

export interface Permission {
    id: number
    name: string
    description: string
    category: string
    tenant_id?: number
}
