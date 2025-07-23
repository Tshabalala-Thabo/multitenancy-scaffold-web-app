import { NextResponse } from 'next/server'
import { Tenant } from '@/types/tenant'

// Mock data for tenants
let mockTenants: Tenant[] = [
  {
    id: 1,
    name: "Acme Corporation",
    slug: "acme-corp",
    domain: "acme.example.com",
    status: "active",
    administrators: [
      {
        id: 1,
        admin_name: "John Doe",
        admin_email: "john@acme.com",
      },
      {
        id: 2,
        admin_name: "Jane Smith",
        admin_email: "jane@acme.com",
      },
    ],
    address: {
      street_address: "123 Business St",
      suburb: "Downtown",
      city: "New York",
      province: "NY",
      postal_code: "10001",
    },
    logo: null,
    created_at: "2024-01-15",
    updated_at: "2024-03-10",
    users_count: 45,
    last_activity: "2024-03-15",
  },
  {
    id: 2,
    name: "TechStart Inc",
    slug: "techstart",
    domain: "techstart.example.com",
    status: "active",
    administrators: [
      {
        id: 3,
        admin_name: "Mike Johnson",
        admin_email: "mike@techstart.com",
      },
    ],
    address: {
      street_address: "456 Innovation Ave",
      suburb: "Tech District",
      city: "San Francisco",
      province: "CA",
      postal_code: "94105",
    },
    logo: null,
    created_at: "2024-02-20",
    updated_at: "2024-03-05",
    users_count: 23,
    last_activity: "2024-03-14",
  },
  {
    id: 3,
    name: "Global Solutions",
    slug: "global-solutions",
    domain: null,
    status: "pending",
    administrators: [
      {
        id: 4,
        admin_name: "Sarah Wilson",
        admin_email: "sarah@globalsolutions.com",
      },
    ],
    address: {
      street_address: "789 Enterprise Blvd",
      suburb: "Business Park",
      city: "Chicago",
      province: "IL",
      postal_code: "60601",
    },
    logo: null,
    created_at: "2024-03-10",
    updated_at: "2024-03-10",
    users_count: 0,
    last_activity: "2024-03-10",
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const tenant = mockTenants.find(t => t.id === parseInt(params.id))
  if (tenant) {
    return NextResponse.json(tenant)
  }
  return new Response('Tenant not found', { status: 404 })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json()
  const tenantIndex = mockTenants.findIndex(t => t.id === parseInt(params.id))
  if (tenantIndex !== -1) {
    mockTenants[tenantIndex] = { ...mockTenants[tenantIndex], ...data }
    return NextResponse.json(mockTenants[tenantIndex])
  }
  return new Response('Tenant not found', { status: 404 })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const tenantIndex = mockTenants.findIndex(t => t.id === parseInt(params.id))
  if (tenantIndex !== -1) {
    mockTenants.splice(tenantIndex, 1)
    return new Response(null, { status: 204 })
  }
  return new Response('Tenant not found', { status: 404 })
}
