export interface Tenant {
    id: number;
    name: string;
    slug: string;
    domain: string | null;
    status: 'active' | 'pending' | 'inactive';
    administrators: {
        id: number;
        admin_name: string;
        admin_email: string;
    }[];
    address: {
        street_address: string;
        suburb: string;
        city: string;
        province: string;
        postal_code: string;
    };
    logo: string | null;
    created_at: string;
    updated_at: string;
    users_count: number;
    last_activity: string;
}
