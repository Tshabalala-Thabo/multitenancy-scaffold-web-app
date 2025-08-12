'use client'

import type React from 'react'
import {
    useRef,
    useState,
    useEffect,
    useCallback,
    useImperativeHandle,
    forwardRef,
} from 'react'
import { useOrganisationUser } from '@/hooks/useOrganisationUser'
import type { OrganizationSettings } from '@/types/organisation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUpload } from '@/components/ui/image-upload'
import { BasicInfoData } from '@/hooks/useOrganisationUser'
import Alert from '@/components/Alert'

interface BasicInfoFormProps {
    initialSettings: OrganizationSettings
    onDirtyChange?: (isDirty: boolean) => void
}

export interface BasicInfoFormRef {
    triggerPulse: () => void
}

export const BasicInfoForm = forwardRef<BasicInfoFormRef, BasicInfoFormProps>(
    ({ initialSettings, onDirtyChange }, ref) => {
        const [name, setName] = useState(initialSettings.name)
        const [logoFile, setLogoFile] = useState<File | null>(null)
        const [logoPreview, setLogoPreview] = useState<string | null>(
            initialSettings.logo_url,
        )
        const [logoRemoved, setLogoRemoved] = useState(false)
        const [domain, setDomain] = useState(initialSettings.domain || '')
        const [streetAddress, setStreetAddress] = useState(
            initialSettings.address.street_address,
        )
        const [suburb, setSuburb] = useState(initialSettings.address.suburb)
        const [city, setCity] = useState(initialSettings.address.city)
        const [province, setProvince] = useState(
            initialSettings.address.province,
        )
        const [postalCode, setPostalCode] = useState(
            initialSettings.address.postal_code,
        )
        const [isSubmitting, setIsSubmitting] = useState(false)
        const [isDirty, setIsDirty] = useState(false)
        const [showWarning, setShowWarning] = useState(false)
        const [internalPulse, setInternalPulse] = useState(false)
        const pulseTimeoutRef = useRef<NodeJS.Timeout | null>(null)
        const { updateBasicInfo } = useOrganisationUser()
        const [formUpdated, setFormUpdated] = useState(false)
        const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})

        // Expose triggerPulse function to parent via ref
        useImperativeHandle(
            ref,
            () => ({
                triggerPulse: () => {
                    if (!internalPulse) {
                        // Clear any existing timeout
                        if (pulseTimeoutRef.current) {
                            clearTimeout(pulseTimeoutRef.current)
                        }

                        setInternalPulse(true)
                        setShowWarning(true)
                        pulseTimeoutRef.current = setTimeout(() => {
                            setInternalPulse(false)
                            pulseTimeoutRef.current = null
                        }, 2000)
                    }
                },
            }),
            [internalPulse],
        )

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
                logoFile !== null ||
                logoRemoved

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
            logoRemoved,
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
                    window.removeEventListener(
                        'beforeunload',
                        handleBeforeUnload,
                    )
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
            setLogoRemoved(false)
            setInternalPulse(false)
            setShowWarning(false)
        }

        const handleLogoChange = (file: File) => {
            setLogoFile(file)
            setLogoPreview(URL.createObjectURL(file))
            setLogoRemoved(false) // Reset removed flag when new file is selected
        }

        const handleRemoveLogo = () => {
            setLogoFile(null)
            setLogoPreview(null)
            setLogoRemoved(true) // Set removed flag when logo is removed
        }

        const handleUploadClick = () => {
            fileInputRef.current?.click()
        }

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault()
            setIsSubmitting(true)

            try {
                const formData = new FormData()

                formData.append('name', '')
                formData.append('domain', '')

                formData.append('address[street_address]', streetAddress)
                formData.append('address[suburb]', suburb)
                formData.append('address[city]', city)
                formData.append('address[province]', province)
                formData.append('address[postal_code]', postalCode)
                formData.append('_method', 'PUT')

                if (logoFile) {
                    formData.append('logo', logoFile)
                } else if (logoRemoved) {
                    formData.append('remove_logo', '1')
                }

                if (pulseTimeoutRef.current) {
                    clearTimeout(pulseTimeoutRef.current)
                    pulseTimeoutRef.current = null
                }

                const result: BasicInfoData = await updateBasicInfo(
                    initialSettings.id,
                    formData,
                )

                if (result) {
                    const newLogoPreview = logoFile
                        ? logoPreview
                        : logoRemoved
                          ? null
                          : logoPreview

                    setInitialValues({
                        name,
                        domain,
                        streetAddress,
                        suburb,
                        city,
                        province,
                        postalCode,
                        logoPreview: newLogoPreview,
                    })
                    setLogoFile(null)
                    setLogoRemoved(false)
                    setFormUpdated(true)
                }
            } catch (error: any) {
                // Handle field-specific validation errors
                console.error("error", error.response.data.errors)
                if (error.response?.data?.errors) {
                    const errors: { [key: string]: string } = {}
                    // Handle array of error strings
                    if (Array.isArray(error.response.data.errors)) {
                        // Map error messages to field names
                        error.response.data.errors.forEach((errorMsg: string) => {
                            // Extract field name from error message (e.g., "The domain is required.")
                            const fieldMatch = errorMsg.toLowerCase().match(/the (\w+) is required/i)
                            if (fieldMatch && fieldMatch[1]) {
                                const fieldName = fieldMatch[1]
                                errors[fieldName] = errorMsg
                            }
                        })
                    } else {
                        // Handle object format as fallback
                        Object.keys(error.response.data.errors).forEach(field => {
                            errors[field] = error.response.data.errors[field][0]
                        })
                    }
                    setFieldErrors(errors)
                }
            } finally {
                setIsSubmitting(false)
                setInternalPulse(false)
                setShowWarning(false)
            }
        }

        return (
            <form onSubmit={handleSubmit} className="grid gap-6">
                {formUpdated && (
                    <Alert
                        variant="info"
                        title=" Please note that the changes might take a few minutes to reflect."
                    />
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Organization Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={e => {
                                setName(e.target.value)
                                // Clear error when user types
                                if (fieldErrors.name) {
                                    setFieldErrors(prev => {
                                        const newErrors = { ...prev }
                                        delete newErrors.name
                                        return newErrors
                                    })
                                }
                            }}
                            className={fieldErrors.name ? 'border-red-500' : ''}
                            required
                        />
                        {fieldErrors.name && (
                            <p className="text-sm text-red-500">{fieldErrors.name}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="domain">Domain</Label>
                        <Input
                            id="domain"
                            placeholder="e.g., yourorg.com"
                            value={domain}
                            onChange={e => {
                                setDomain(e.target.value)
                                // Clear error when user types
                                if (fieldErrors.domain) {
                                    setFieldErrors(prev => {
                                        const newErrors = { ...prev }
                                        delete newErrors.domain
                                        return newErrors
                                    })
                                }
                            }}
                            className={fieldErrors.domain ? 'border-red-500' : ''}
                            required
                        />
                        {fieldErrors.domain && (
                            <p className="text-sm text-red-500">{fieldErrors.domain}</p>
                        )}
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
                            onChange={e => {
                                setStreetAddress(e.target.value)
                                if (fieldErrors.streetAddress) {
                                    setFieldErrors(prev => {
                                        const newErrors = { ...prev }
                                        delete newErrors.streetAddress
                                        return newErrors
                                    })
                                }
                            }}
                            className={fieldErrors.streetAddress ? 'border-red-500' : ''}
                            required
                        />
                        {fieldErrors.streetAddress && (
                            <p className="text-sm text-red-500">{fieldErrors.streetAddress}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="suburb">Suburb</Label>
                            <Input
                                id="suburb"
                                value={suburb}
                                onChange={e => {
                                    setSuburb(e.target.value)
                                    if (fieldErrors.suburb) {
                                        setFieldErrors(prev => {
                                            const newErrors = { ...prev }
                                            delete newErrors.suburb
                                            return newErrors
                                        })
                                    }
                                }}
                                className={fieldErrors.suburb ? 'border-red-500' : ''}
                                required
                            />
                            {fieldErrors.suburb && (
                                <p className="text-sm text-red-500">{fieldErrors.suburb}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                value={city}
                                onChange={e => {
                                    setCity(e.target.value)
                                    if (fieldErrors.city) {
                                        setFieldErrors(prev => {
                                            const newErrors = { ...prev }
                                            delete newErrors.city
                                            return newErrors
                                        })
                                    }
                                }}
                                className={fieldErrors.city ? 'border-red-500' : ''}
                                required
                            />
                            {fieldErrors.city && (
                                <p className="text-sm text-red-500">{fieldErrors.city}</p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="province">Province</Label>
                            <Input
                                id="province"
                                value={province}
                                onChange={e => {
                                    setProvince(e.target.value)
                                    if (fieldErrors.province) {
                                        setFieldErrors(prev => {
                                            const newErrors = { ...prev }
                                            delete newErrors.province
                                            return newErrors
                                        })
                                    }
                                }}
                                className={fieldErrors.province ? 'border-red-500' : ''}
                                required
                            />
                            {fieldErrors.province && (
                                <p className="text-sm text-red-500">{fieldErrors.province}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="postal-code">Postal Code</Label>
                            <Input
                                id="postal-code"
                                value={postalCode}
                                onChange={e => {
                                    setPostalCode(e.target.value)
                                    if (fieldErrors.postalCode) {
                                        setFieldErrors(prev => {
                                            const newErrors = { ...prev }
                                            delete newErrors.postalCode
                                            return newErrors
                                        })
                                    }
                                }}
                                className={fieldErrors.postalCode ? 'border-red-500' : ''}
                                required
                            />
                            {fieldErrors.postalCode && (
                                <p className="text-sm text-red-500">{fieldErrors.postalCode}</p>
                            )}
                        </div>
                    </div>
                </fieldset>

                <div className="flex justify-end gap-3">
                    {showWarning && isDirty && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                            You have unsaved changes. Please save or cancel your
                            changes before leaving.
                        </p>
                    )}
                    {isDirty && (
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className={`flex-1 transition-all duration-300 ${
                                    internalPulse
                                        ? 'animate-pulse border-blue-500 shadow-lg shadow-blue-500/50 ring-2 ring-blue-500/75'
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
                        </div>
                    )}
                </div>
            </form>
        )
    },
)
