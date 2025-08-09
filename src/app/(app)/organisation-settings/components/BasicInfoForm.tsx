'use client'

import type React from 'react'
import { useRef, useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react'
import type { OrganizationSettings } from '@/types/organisation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { ImageUpload } from '@/components/ui/image-upload'

interface BasicInfoFormProps {
    initialSettings: OrganizationSettings
    onDirtyChange?: (isDirty: boolean) => void
}

export interface BasicInfoFormRef {
    triggerPulse: () => void
}

export const BasicInfoForm = forwardRef<BasicInfoFormRef, BasicInfoFormProps>(({
                                                                                   initialSettings,
                                                                                   onDirtyChange,
                                                                               }, ref) => {
    const [name, setName] = useState(initialSettings.name)
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(
        initialSettings.logo_url,
    )
    const [domain, setDomain] = useState(initialSettings.domain || '')
    const [streetAddress, setStreetAddress] = useState(
        initialSettings.address.street_address,
    )
    const [suburb, setSuburb] = useState(initialSettings.address.suburb)
    const [city, setCity] = useState(initialSettings.address.city)
    const [province, setProvince] = useState(initialSettings.address.province)
    const [postalCode, setPostalCode] = useState(
        initialSettings.address.postal_code,
    )
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDirty, setIsDirty] = useState(false)
    const [internalPulse, setInternalPulse] = useState(false)
    const pulseTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Expose triggerPulse function to parent via ref
    useImperativeHandle(ref, () => ({
        triggerPulse: () => {
            if (!internalPulse) {
                // Clear any existing timeout
                if (pulseTimeoutRef.current) {
                    clearTimeout(pulseTimeoutRef.current)
                }

                setInternalPulse(true)
                pulseTimeoutRef.current = setTimeout(() => {
                    setInternalPulse(false)
                    pulseTimeoutRef.current = null
                }, 2000)
            }
        }
    }), [internalPulse])

    const [initialValues, setInitialValues] = useState({
        name: initialSettings.name,
        domain: initialSettings.domain || '',
        streetAddress: initialSettings.address.street_address,
        suburb: initialSettings.address.suburb,
        city: initialSettings.address.city,
        province: initialSettings.address.province,
        postalCode: initialSettings.address.postal_code,
        logoPreview: initialSettings.logo_url,
    })

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Check if form is dirty
    useEffect(() => {
        const isFormDirty =
            name !== initialValues.name ||
            domain !== initialValues.domain ||
            streetAddress !== initialValues.streetAddress ||
            suburb !== initialValues.suburb ||
            city !== initialValues.city ||
            province !== initialValues.province ||
            postalCode !== initialValues.postalCode ||
            logoPreview !== initialValues.logoPreview ||
            logoFile !== null

        setIsDirty(isFormDirty)
        if (onDirtyChange) {
            onDirtyChange(isFormDirty)
        }
    }, [
        name,
        domain,
        streetAddress,
        suburb,
        city,
        province,
        postalCode,
        logoPreview,
        logoFile,
        initialValues,
        onDirtyChange,
    ])

    // Handle tab change attempt - trigger pulsing instead of showing modal
    const handleBeforeUnload = useCallback(
        (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault()
                e.returnValue = ''

                // Trigger pulsing animation
                setInternalPulse(true)
                setTimeout(() => setInternalPulse(false), 2000)

                return ''
            }
        },
        [isDirty],
    )

    // Set up beforeunload event listener
    useEffect(() => {
        if (isDirty) {
            window.addEventListener('beforeunload', handleBeforeUnload)
            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload)
            }
        }
    }, [isDirty, handleBeforeUnload])

    // Reset form to initial values
    const handleCancel = () => {
        // Clear pulse timeout
        if (pulseTimeoutRef.current) {
            clearTimeout(pulseTimeoutRef.current)
            pulseTimeoutRef.current = null
        }

        setName(initialValues.name)
        setDomain(initialValues.domain)
        setStreetAddress(initialValues.streetAddress)
        setSuburb(initialValues.suburb)
        setCity(initialValues.city)
        setProvince(initialValues.province)
        setPostalCode(initialValues.postalCode)
        setLogoPreview(initialValues.logoPreview)
        setLogoFile(null)
        setInternalPulse(false)
    }

    const handleLogoChange = (file: File) => {
        setLogoFile(file)
        setLogoPreview(URL.createObjectURL(file))
    }

    const handleRemoveLogo = () => {
        setLogoFile(null)
        setLogoPreview(null)
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // In a real application, handle logo upload first (e.g., to Vercel Blob)
            // Then send the updated settings including the new logo_url
            toast({
                title: 'Saving basic information...',
                description: 'Updating organization details.',
            })
            await new Promise(resolve => setTimeout(resolve, 1500))

            const updatedSettings = {
                name,
                domain,
                address: {
                    street_address: streetAddress,
                    suburb,
                    city,
                    province,
                    postal_code: postalCode,
                },
            }
            console.log('Updated Basic Settings:', updatedSettings)
            console.log('New Logo File:', logoFile)

            // Update initial values to match current values
            setInitialValues({
                name,
                domain,
                streetAddress,
                suburb,
                city,
                province,
                postalCode,
                logoPreview: logoPreview || null,
            })

            setLogoFile(null)

            // Clear pulse timeout and state
            if (pulseTimeoutRef.current) {
                clearTimeout(pulseTimeoutRef.current)
                pulseTimeoutRef.current = null
            }
            setInternalPulse(false)

            toast({
                title: 'Success',
                description: 'Organization basic information updated.',
            })
        } catch (error) {
            console.error('Error saving settings:', error)
            toast({
                title: 'Error',
                description:
                    'Failed to update organization settings. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Organization Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                        id="domain"
                        placeholder="e.g., yourorg.com"
                        value={domain}
                        onChange={e => setDomain(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <Label>Organization Logo</Label>
                <ImageUpload
                    imagePreview={logoPreview}
                    onRemove={handleRemoveLogo}
                    onUploadClick={handleUploadClick}
                    onFileChange={handleLogoChange}
                    uploadButtonId="logo-upload"
                    className="w-full"
                    size="lg"
                    label="Upload Logo"
                />
                <input
                    ref={fileInputRef}
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                        if (e.target.files?.[0]) {
                            handleLogoChange(e.target.files[0])
                        }
                    }}
                />
            </div>

            <fieldset className="grid gap-4 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                    Address
                </legend>
                <div className="grid gap-2">
                    <Label htmlFor="street-address">Street Address</Label>
                    <Input
                        id="street-address"
                        value={streetAddress}
                        onChange={e => setStreetAddress(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="suburb">Suburb</Label>
                        <Input
                            id="suburb"
                            value={suburb}
                            onChange={e => setSuburb(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="province">Province</Label>
                        <Input
                            id="province"
                            value={province}
                            onChange={e => setProvince(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="postal-code">Postal Code</Label>
                        <Input
                            id="postal-code"
                            value={postalCode}
                            onChange={e => setPostalCode(e.target.value)}
                        />
                    </div>
                </div>
            </fieldset>

            <div className="flex gap-3">
                {isDirty && (
                    <>
                        <Button
                            type="button"
                            variant="outline"
                            className={`flex-1 transition-all duration-300 ${
                                internalPulse
                                    ? 'animate-pulse border-yellow-500 shadow-lg shadow-yellow-500/50 ring-2 ring-yellow-500/75'
                                    : ''
                            }`}
                            onClick={handleCancel}
                            disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className={`flex-1 transition-all duration-300 ${
                                internalPulse
                                    ? 'animate-pulse border-blue-500 shadow-lg shadow-blue-500/50 ring-2 ring-blue-500/75'
                                    : ''
                            }`}
                            disabled={isSubmitting || !isDirty}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </>
                )}
            </div>
            {internalPulse && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                    You have unsaved changes. Please save or cancel your changes
                    before leaving.
                </p>
            )}
        </form>
    )
})
