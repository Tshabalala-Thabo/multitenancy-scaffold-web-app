export interface Tenant {
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
