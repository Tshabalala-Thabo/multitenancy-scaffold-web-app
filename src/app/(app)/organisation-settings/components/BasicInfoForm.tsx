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

interface ValidationErrors {
    [key: string]: string
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
        const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({})

        useImperativeHandle(
            ref,
            () => ({
                triggerPulse: () => {
                    if (!internalPulse) {
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

        const validateForm = (): ValidationErrors => {
            const errors: ValidationErrors = {}
            const trimmedName = name.trim()
            const trimmedDomain = domain.trim()
            const trimmedStreetAddress = streetAddress.trim()
            const trimmedSuburb = suburb.trim()
            const trimmedCity = city.trim()
            const trimmedProvince = province.trim()
            const trimmedPostalCode = postalCode.trim()

            if (!trimmedName) {
                errors.name = 'Organization name is required.'
            }

            if (!trimmedDomain) {
                errors.domain = 'Domain is required.'
            } else {
                const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.([a-zA-Z]{2,}\.)*[a-zA-Z]{2,}$/
                if (!domainRegex.test(trimmedDomain)) {
                    errors.domain = 'Please enter a valid domain (e.g., yourorganisation.com).'
                }
            }

            if (!trimmedStreetAddress) {
                errors.streetAddress = 'Street address is required.'
            }

            if (!trimmedSuburb) {
                errors.suburb = 'Suburb is required.'
            }

            if (!trimmedCity) {
                errors.city = 'City is required.'
            }

            if (!trimmedProvince) {
                errors.province = 'Province is required.'
            }

            if (!trimmedPostalCode) {
                errors.postalCode = 'Postal code is required.'
            } else {
                const postalCodeRegex = /^\d{4}$/
                if (!postalCodeRegex.test(trimmedPostalCode)) {
                    errors.postalCode = 'Please enter a valid 4-digit postal code.'
                }
            }

            return errors
        }

        const clearFieldError = (fieldName: string) => {
            if (fieldErrors[fieldName]) {
                setFieldErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors[fieldName]
                    return newErrors
                })
            }
        }

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

        const handleBeforeUnload = useCallback(
            (e: BeforeUnloadEvent) => {
                if (isDirty) {
                    e.preventDefault()
                    e.returnValue = ''

                    setInternalPulse(true)
                    setTimeout(() => setInternalPulse(false), 2000)

                    return ''
                }
            },
            [isDirty],
        )

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

        const handleCancel = () => {
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
            setFieldErrors({})
        }

        const handleLogoChange = (file: File) => {
            setLogoFile(file)
            setLogoPreview(URL.createObjectURL(file))
            setLogoRemoved(false)
        }

        const handleRemoveLogo = () => {
            setLogoFile(null)
            setLogoPreview(null)
            setLogoRemoved(true)
        }

        const handleUploadClick = () => {
            fileInputRef.current?.click()
        }

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault()

            const validationErrors = validateForm()

            if (Object.keys(validationErrors).length > 0) {
                setFieldErrors(validationErrors)
                const firstErrorField = document.getElementById(Object.keys(validationErrors)[0])
                if (firstErrorField) {
                    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    firstErrorField.focus()
                }
                return
            }

            setIsSubmitting(true)
            setFieldErrors({})

            try {
                const formData = new FormData()

                formData.append('name', name.trim())
                formData.append('domain', domain.trim())

                formData.append('address[street_address]', streetAddress.trim())
                formData.append('address[suburb]', suburb.trim())
                formData.append('address[city]', city.trim())
                formData.append('address[province]', province.trim())
                formData.append('address[postal_code]', postalCode.trim())
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
                        name: name.trim(),
                        domain: domain.trim(),
                        streetAddress: streetAddress.trim(),
                        suburb: suburb.trim(),
                        city: city.trim(),
                        province: province.trim(),
                        postalCode: postalCode.trim(),
                        logoPreview: newLogoPreview,
                    })
                    setLogoFile(null)
                    setLogoRemoved(false)
                    setFormUpdated(true)
                }
            } catch (error: any) {
                if (error.response?.data?.errors) {
                    const errors: ValidationErrors = {}
                    if (Array.isArray(error.response.data.errors)) {
                        error.response.data.errors.forEach((errorMsg: string) => {
                            const fieldMatch = errorMsg.toLowerCase().match(/the (\w+) is required/i)
                            if (fieldMatch && fieldMatch[1]) {
                                const fieldName = fieldMatch[1]
                                errors[fieldName] = errorMsg
                            }
                        })
                    } else {
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
                        <Label htmlFor="name">Organization Name *</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={e => {
                                setName(e.target.value)
                                clearFieldError('name')
                            }}
                            className={fieldErrors.name ? 'border-red-500' : ''}
                            required
                        />
                        {fieldErrors.name && (
                            <p className="text-sm text-red-500">{fieldErrors.name}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="domain">Domain *</Label>
                        <Input
                            id="domain"
                            placeholder="e.g., yourorg.com"
                            value={domain}
                            onChange={e => {
                                setDomain(e.target.value)
                                clearFieldError('domain')
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
                        <Label htmlFor="streetAddress">Street Address *</Label>
                        <Input
                            id="streetAddress"
                            value={streetAddress}
                            onChange={e => {
                                setStreetAddress(e.target.value)
                                clearFieldError('streetAddress')
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
                            <Label htmlFor="suburb">Suburb *</Label>
                            <Input
                                id="suburb"
                                value={suburb}
                                onChange={e => {
                                    setSuburb(e.target.value)
                                    clearFieldError('suburb')
                                }}
                                className={fieldErrors.suburb ? 'border-red-500' : ''}
                                required
                            />
                            {fieldErrors.suburb && (
                                <p className="text-sm text-red-500">{fieldErrors.suburb}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                                id="city"
                                value={city}
                                onChange={e => {
                                    setCity(e.target.value)
                                    clearFieldError('city')
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
                            <Label htmlFor="province">Province *</Label>
                            <Input
                                id="province"
                                value={province}
                                onChange={e => {
                                    setProvince(e.target.value)
                                    clearFieldError('province')
                                }}
                                className={fieldErrors.province ? 'border-red-500' : ''}
                                required
                            />
                            {fieldErrors.province && (
                                <p className="text-sm text-red-500">{fieldErrors.province}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="postalCode">Postal Code *</Label>
                            <Input
                                id="postalCode"
                                value={postalCode}
                                onChange={e => {
                                    setPostalCode(e.target.value)
                                    clearFieldError('postalCode')
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
