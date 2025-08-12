import { Role, Permission } from "./roles-and-permissions"

export interface Organisation {
    id: number;
    name: string;
    slug: string;
    domain: string | null;
    status: 'active' | 'pending' | 'inactive';
    administrators: {
        id: number;
        name: string;
        last_name: string;
        email: string;
        password: string;
        isExisting?: boolean
    }[];
    users: {
        id: number;
        name: string;
        last_name: string;
        email: string;
        roles: string[];
    }[];
    address: {
        street_address: string;
        suburb: string;
        city: string;
        province: string;
        postal_code: string;
    };
    logo?: File | null;
    logo_preview?: string | null;
    logo_url: string | null;
    created_at: string;
    updated_at: string;
    users_count: number;
    last_activity: string;
}


export interface OrganizationSettings {
    id: number
    name: string
    description: string | null
    logo_url: string | null
    domain: string | null
    address: {
        street_address: string
        suburb: string
        city: string
        province: string
        postal_code: string
    }
    privacy_setting: "public" | "private"
    two_factor_auth_required: boolean
    password_policy: {
        min_length: number
        requires_uppercase: boolean
        requires_lowercase: boolean
        requires_number: boolean
        requires_symbol: boolean
    }
    features: {
        announcements_enabled: boolean
        analytics_enabled: boolean
    }
    api_keys: { id: string; name: string; created_at: string; last_used_at: string }[]
    webhooks: { id: string; url: string; events: string[] }[]
    third_party_integrations: { name: string; enabled: boolean; config: Record<string, any> }[]
    roles: Role[]
    permissions: Permission[]
}
