'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Building2, User, MapPin, Upload, X, Trash2, Plus } from 'lucide-react'
import { Tenant } from '@/types/tenant'

interface TenantModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (tenant: Pick<Tenant, 'name' | 'slug' | 'domain' | 'logo' | 'logo_preview' | 'address' | 'administrators'>) => void
  tenant?: Pick<Tenant, 'name' | 'slug' | 'domain' | 'logo' | 'logo_preview' | 'logo_url' | 'address' | 'administrators'| 'users'>
}

interface FormErrors {
  [key: string]: string | undefined
  name?: string
  slug?: string
  domain?: string
  logo?: string
  'address.street_address'?: string
  'address.suburb'?: string
  'address.city'?: string
  'address.province'?: string
  'address.postal_code'?: string
  administrators?: string
}

export function TenantModal({
  isOpen,
  onClose,
  onSave,
  tenant,
}: TenantModalProps) {
  const [formData, setFormData] = useState<Pick<Tenant, 'name' | 'slug' | 'domain' | 'logo' | 'logo_preview' | 'address' | 'administrators'> & { remove_logo: boolean }>({
    name: '',
    slug: '',
    domain: '',
    logo: null,
    logo_preview: null,
    remove_logo: false,
    address: {
      street_address: '',
      suburb: '',
      city: '',
      province: '',
      postal_code: '',
    },
    administrators: [
      {
        id: Date.now(),
        name: '',
        email: '',
        password: '',
      },
    ],
  })

  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || '',
        slug: tenant.slug || '',
        domain: tenant.domain || '',
        logo: tenant.logo || null,
        logo_preview: tenant.logo_url || tenant.logo_preview || null,
        remove_logo: false,
        address: {
          street_address: tenant.address?.street_address || '',
          suburb: tenant.address?.suburb || '',
          city: tenant.address?.city || '',
          province: tenant.address?.province || '',
          postal_code: tenant.address?.postal_code || '',
        },
        administrators: tenant.users.length > 0
          ? tenant.users.map(admin => ({
            id: admin.id,
            name: admin.name || '',
            email: admin.email || '',
            password: '',
          }))
          : [
            {
              id: Date.now(),
              name: '',
              email: '',
              password: '',
            },
          ],
      })
    } else {
      setFormData({
        name: '',
        slug: '',
        domain: '',
        logo: null,
        logo_preview: null,
        remove_logo: false,
        address: {
          street_address: '',
          suburb: '',
          city: '',
          province: '',
          postal_code: '',
        },
        administrators: [
          {
            id: Date.now(),
            name: '',
            email: '',
            password: '',
          },
        ],
      })
    }
    setErrors({})
  }, [tenant, isOpen])

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (value: string) => {
    handleInputChange('name', value)
    if (!tenant) {
      // Only auto-generate slug for new tenants
      handleInputChange('slug', generateSlug(value))
    }
  }

  const addAdministrator = () => {
    setFormData(prev => ({
      ...prev,
      administrators: [
        ...prev.administrators,
        {
          id: Date.now(),
          name: '',
          email: '',
          password: '',
        },
      ],
    }))
  }

  const removeAdministrator = (id: number) => {
    if (formData.administrators.length > 1) {
      setFormData(prev => ({
        ...prev,
        administrators: prev.administrators.filter(
          admin => admin.id !== id,
        ),
      }))
    }
  }

  const handleAdministratorChange = (
    id: number,
    field: string,
    value: string,
  ) => {
    setFormData(prev => ({
      ...prev,
      administrators: prev.administrators.map(admin =>
        admin.id === id
          ? {
            ...admin,
            [field]: value,
          }
          : admin,
      ),
    }))

    // Clear error when user starts typing
    const errorKey = `administrators.${id}.${field}`
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: undefined,
      }))
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 2048 * 1024) {
        // 2MB limit
        setErrors(prev => ({
          ...prev,
          logo: 'File size must be less than 2MB',
        }))
        return
      }

      const reader = new FileReader()
      reader.onload = e => {
        setFormData(prev => ({
          ...prev,
          logo: file,
          logo_preview: e.target?.result as string,
          remove_logo: false
        }))
      }
      reader.readAsDataURL(file)

      // Clear any existing logo error
      if (errors.logo) {
        setErrors(prev => ({ ...prev, logo: undefined }))
      }
    }
  }

  const removeLogo = () => {
    setFormData(prev => ({
      ...prev,
      logo: null,
      logo_preview: null,
      remove_logo: true
    }))
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
    if (!formData.address.street_address.trim())
      newErrors['address.street_address'] = 'Street address is required'
    if (!formData.address.suburb.trim())
      newErrors['address.suburb'] = 'Suburb is required'
    if (!formData.address.city.trim())
      newErrors['address.city'] = 'City is required'
    if (!formData.address.province.trim())
      newErrors['address.province'] = 'Province is required'
    if (!formData.address.postal_code.trim())
      newErrors['address.postal_code'] = 'Postal code is required'

    // Validate administrators (at least one required)
    if (formData.administrators.length === 0) {
      newErrors.administrators = 'At least one administrator is required'
    } else {
      formData.administrators.forEach((admin, index) => {
        if (!admin.name.trim()) {
          newErrors[`administrators.${admin.id}.name`] =
            'Administrator name is required'
        }
        if (!admin.email.trim()) {
          newErrors[`administrators.${admin.id}.email`] =
            'Administrator email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email)) {
          newErrors[`administrators.${admin.id}.email`] =
            'Invalid email format'
        }

        // Password required for new tenants
        if (!tenant && !admin.password.trim()) {
          newErrors[`administrators.${admin.id}.password`] =
            'Password is required'
        }

        // Password validation (if provided)
        if (admin.password && admin.password.length < 8) {
          newErrors[`administrators.${admin.id}.password`] =
            'Password must be at least 8 characters'
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave(formData)
    }
  }

  const isEditing = !!tenant

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {isEditing ? 'Edit Tenant' : 'Create New Tenant'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the tenant information below.'
              : 'Fill in the details to create a new tenant.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="admin">
                Administrator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Configure the basic tenant settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Tenant Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={e =>
                          handleNameChange(
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Acme Corporation"
                        className={
                          errors.name
                            ? 'border-destructive'
                            : ''
                        }
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={e =>
                          handleInputChange(
                            'slug',
                            e.target.value,
                          )
                        }
                        placeholder="e.g., acme-corp"
                        className={
                          errors.slug
                            ? 'border-destructive'
                            : ''
                        }
                      />
                      {errors.slug && (
                        <p className="text-sm text-destructive">
                          {errors.slug}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">
                      Custom Domain
                    </Label>
                    <Input
                      id="domain"
                      value={formData.domain || ''}
                      onChange={e =>
                        handleInputChange(
                          'domain',
                          e.target.value,
                        )
                      }
                      placeholder="e.g., acme.example.com"
                    />
                    <p className="text-sm text-muted-foreground">
                      Optional: Custom domain for this
                      tenant
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo</Label>
                    <div className="space-y-4">
                      {formData.logo_preview ? (
                        <div className="relative w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden">
                          <img
                            src={
                              formData.logo_preview ||
                              '/placeholder.svg'
                            }
                            alt="Logo preview"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1"
                            onClick={removeLogo}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-muted-foreground/50 transition-colors">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Upload Logo
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document
                              .getElementById(
                                'logo-upload',
                              )
                              ?.click()
                          }>
                          <Upload className="mr-2 h-4 w-4" />
                          {formData.logo_preview
                            ? 'Change Logo'
                            : 'Upload Logo'}
                        </Button>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <p className="text-sm text-muted-foreground">
                          Max file size: 2MB.
                          Supported formats: JPG, PNG,
                          GIF
                        </p>
                      </div>
                      {errors.logo && (
                        <p className="text-sm text-destructive">
                          {errors.logo}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="address" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Address Information
                  </CardTitle>
                  <CardDescription>
                    Enter the tenant's business address
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street_address">
                      Street Address *
                    </Label>
                    <Input
                      id="street_address"
                      value={
                        formData.address.street_address
                      }
                      onChange={e =>
                        handleInputChange(
                          'address.street_address',
                          e.target.value,
                        )
                      }
                      placeholder="e.g., 123 Business Street"
                      className={
                        errors['address.street_address']
                          ? 'border-destructive'
                          : ''
                      }
                    />
                    {errors['address.street_address'] && (
                      <p className="text-sm text-destructive">
                        {
                          errors[
                          'address.street_address'
                          ]
                        }
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="suburb">
                        Suburb *
                      </Label>
                      <Input
                        id="suburb"
                        value={formData.address.suburb}
                        onChange={e =>
                          handleInputChange(
                            'address.suburb',
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Downtown"
                        className={
                          errors['address.suburb']
                            ? 'border-destructive'
                            : ''
                        }
                      />
                      {errors['address.suburb'] && (
                        <p className="text-sm text-destructive">
                          {errors['address.suburb']}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.address.city}
                        onChange={e =>
                          handleInputChange(
                            'address.city',
                            e.target.value,
                          )
                        }
                        placeholder="e.g., New York"
                        className={
                          errors['address.city']
                            ? 'border-destructive'
                            : ''
                        }
                      />
                      {errors['address.city'] && (
                        <p className="text-sm text-destructive">
                          {errors['address.city']}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="province">
                        Province/State *
                      </Label>
                      <Input
                        id="province"
                        value={
                          formData.address.province
                        }
                        onChange={e =>
                          handleInputChange(
                            'address.province',
                            e.target.value,
                          )
                        }
                        placeholder="e.g., NY"
                        className={
                          errors['address.province']
                            ? 'border-destructive'
                            : ''
                        }
                      />
                      {errors['address.province'] && (
                        <p className="text-sm text-destructive">
                          {errors['address.province']}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal_code">
                        Postal Code *
                      </Label>
                      <Input
                        id="postal_code"
                        value={
                          formData.address.postal_code
                        }
                        onChange={e =>
                          handleInputChange(
                            'address.postal_code',
                            e.target.value,
                          )
                        }
                        placeholder="e.g., 10001"
                        className={
                          errors[
                            'address.postal_code'
                          ]
                            ? 'border-destructive'
                            : ''
                        }
                      />
                      {errors['address.postal_code'] && (
                        <p className="text-sm text-destructive">
                          {
                            errors[
                            'address.postal_code'
                            ]
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Administrator Details
                  </CardTitle>
                  <CardDescription>
                    Configure the tenant administrator
                    accounts (at least one required)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {formData.administrators.map(
                    (admin, index) => (
                      <div
                        key={admin.id}
                        className="space-y-4 p-4 border rounded-lg relative">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            Administrator{' '}
                            {index + 1}
                          </h4>
                          {formData.administrators
                            .length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  removeAdministrator(
                                    admin.id,
                                  )
                                }
                                className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor={`name_${admin.id}`}>
                              Administrator Name *
                            </Label>
                            <Input
                              id={`name_${admin.id}`}
                              value={admin.name}
                              onChange={e =>
                                handleAdministratorChange(
                                  admin.id,
                                  'name',
                                  e.target
                                    .value,
                                )
                              }
                              placeholder="e.g., John Doe"
                              className={
                                errors[
                                  `administrators.${admin.id}.name`
                                ]
                                  ? 'border-destructive'
                                  : ''
                              }
                            />
                            {errors[
                              `administrators.${admin.id}.name`
                            ] && (
                                <p className="text-sm text-destructive">
                                  {
                                    errors[
                                    `administrators.${admin.id}.name`
                                    ]
                                  }
                                </p>
                              )}
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor={`email_${admin.id}`}>
                              Administrator Email
                              *
                            </Label>
                            <Input
                              id={`email_${admin.id}`}
                              type="email"
                              value={admin.email}
                              onChange={e =>
                                handleAdministratorChange(
                                  admin.id,
                                  'email',
                                  e.target
                                    .value,
                                )
                              }
                              placeholder="e.g., admin@acme.com"
                              className={
                                errors[
                                  `administrators.${admin.id}.email`
                                ]
                                  ? 'border-destructive'
                                  : ''
                              }
                            />
                            {errors[
                              `administrators.${admin.id}.email`
                            ] && (
                                <p className="text-sm text-destructive">
                                  {
                                    errors[
                                    `administrators.${admin.id}.email`
                                    ]
                                  }
                                </p>
                              )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor={`password_${admin.id}`}>
                            Administrator Password{' '}
                            {!isEditing && '*'}
                          </Label>
                          <Input
                            id={`password_${admin.id}`}
                            type="password"
                            value={admin.password}
                            onChange={e =>
                              handleAdministratorChange(
                                admin.id,
                                'password',
                                e.target.value,
                              )
                            }
                            placeholder={
                              isEditing
                                ? 'Leave blank to keep current password'
                                : 'Minimum 8 characters'
                            }
                            className={
                              errors[
                                `administrators.${admin.id}.password`
                              ]
                                ? 'border-destructive'
                                : ''
                            }
                          />
                          {errors[
                            `administrators.${admin.id}.password`
                          ] && (
                              <p className="text-sm text-destructive">
                                {
                                  errors[
                                  `administrators.${admin.id}.password`
                                  ]
                                }
                              </p>
                            )}
                          {isEditing && (
                            <p className="text-sm text-muted-foreground">
                              Leave blank to keep
                              the current password
                            </p>
                          )}
                        </div>
                      </div>
                    ),
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addAdministrator}
                    className="w-full bg-transparent">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Administrator
                  </Button>

                  {errors.administrators && (
                    <p className="text-sm text-destructive">
                      {errors.administrators}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Tenant' : 'Create Tenant'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
