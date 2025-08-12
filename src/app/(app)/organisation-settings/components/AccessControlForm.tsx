'use client'

import type React from 'react'
import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react'
import { useRouter } from 'next/navigation'
import { extractValidationErrors } from '@/types/api-error'
import { useOrganisationUser } from '@/hooks/useOrganisationUser'
import type { OrganizationSettings } from '@/types/organisation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert } from '@/components/Alert'

type ValidationErrors = Record<string, string | string[]>

interface AccessControlFormProps {
    initialSettings: OrganizationSettings
    onDirtyChange?: (isDirty: boolean) => void
}

export interface AccessControlFormRef {
    triggerPulse: () => void
}

export const AccessControlForm = forwardRef<AccessControlFormRef, AccessControlFormProps>(
    ({  initialSettings, onDirtyChange }, ref) => {
        const { updateAccessControl } = useOrganisationUser()
        const [isSubmitting, setIsSubmitting] = useState(false)
        const [isDirty, setIsDirty] = useState(false)
        const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({})
        const [showWarning, setShowWarning] = useState(false)
        const [internalPulse, setInternalPulse] = useState(false)
        const pulseTimeoutRef = useRef<NodeJS.Timeout | null>(null)

        const [formData, setFormData] = useState({
            privacy_setting: initialSettings.privacy_setting,
            two_factor_auth_required: initialSettings.two_factor_auth_required,
            password_policy: {
                min_length: initialSettings.password_policy.min_length,
                requires_uppercase: initialSettings.password_policy.requires_uppercase,
                requires_lowercase: initialSettings.password_policy.requires_lowercase,
                requires_number: initialSettings.password_policy.requires_number,
                requires_symbol: initialSettings.password_policy.requires_symbol,
            },
        })

        const [initialValues, setInitialValues] = useState({
            privacy_setting: initialSettings.privacy_setting,
            two_factor_auth_required: initialSettings.two_factor_auth_required,
            password_policy: {
                min_length: initialSettings.password_policy.min_length,
                requires_uppercase: initialSettings.password_policy.requires_uppercase,
                requires_lowercase: initialSettings.password_policy.requires_lowercase,
                requires_number: initialSettings.password_policy.requires_number,
                requires_symbol: initialSettings.password_policy.requires_symbol,
            },
        })

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

        // Form validation
        const validateForm = (): boolean => {
            const errors: ValidationErrors = {}

            // Validate password minimum length
            if (formData.password_policy.min_length < 6) {
                errors['password_policy.min_length'] = 'Minimum password length must be at least 6 characters.'
            } else if (formData.password_policy.min_length > 64) {
                errors['password_policy.min_length'] = 'Maximum password length is 64 characters.'
            }

            // Validate at least one character type is required
            if (!formData.password_policy.requires_uppercase &&
                !formData.password_policy.requires_lowercase &&
                !formData.password_policy.requires_number &&
                !formData.password_policy.requires_symbol) {
                errors['password_policy'] = 'At least one character type must be required.'
            }

            setFieldErrors(errors)
            return Object.keys(errors).length === 0
        }

        const clearFieldError = (fieldName: string) => {
            setFieldErrors(prev => {
                const { [fieldName]: _, ...rest } = prev
                return rest
            })
        }

        // Update dirty state when form data changes
        useEffect(() => {
            const formIsDirty = JSON.stringify(formData) !== JSON.stringify(initialValues)
            setIsDirty(formIsDirty)
            if (onDirtyChange) {
                onDirtyChange(formIsDirty)
            }
        }, [formData, initialValues, onDirtyChange])

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
                    window.removeEventListener('beforeunload', handleBeforeUnload)
                }
            }
        }, [isDirty, handleBeforeUnload])

        const handleCancel = () => {
            if (pulseTimeoutRef.current) {
                clearTimeout(pulseTimeoutRef.current)
                pulseTimeoutRef.current = null
            }

            setFormData(initialValues)
            setInternalPulse(false)
            setShowWarning(false)
            setFieldErrors({})
        }

        const handleInputChange = (field: string, value: any) => {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }))
            clearFieldError(field)
        }

        const handlePasswordPolicyChange = (field: string, value: any) => {
            setFormData(prev => ({
                ...prev,
                password_policy: {
                    ...prev.password_policy,
                    [field]: value
                }
            }))
            clearFieldError(`password_policy.${field}`)
        }

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault()
            if (!validateForm()) {
                return
            }

            setIsSubmitting(true)

            try {
                await updateAccessControl(initialSettings.id, formData)

                // Update initial values to current values after successful save
                if (pulseTimeoutRef.current) {
                    clearTimeout(pulseTimeoutRef.current)
                    pulseTimeoutRef.current = null
                }

                setInitialValues({ ...formData })
                setIsDirty(false)

                // Show success message (handled by the hook)
            } catch (error: any) {
                if (error.response?.data?.errors) {
                    setFieldErrors(extractValidationErrors(error.response.data.errors))
                }
                // Error toast is handled by the hook
            } finally {
                setIsSubmitting(false)
                setInternalPulse(false)
                setShowWarning(false)
            }
        }

        return (
            <form onSubmit={handleSubmit} className="grid gap-6">
                {fieldErrors.general && (
                    <Alert variant="destructive" title="Error" description={fieldErrors.general as string} />
                )}

                <div className="grid gap-2">
                    <Label htmlFor="privacy_setting">Organization Privacy</Label>
                    <Select
                        id="privacy_setting"
                        value={formData.privacy_setting}
                        onValueChange={(value: 'public' | 'private') => handleInputChange('privacy_setting', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select privacy setting" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public">Public (Anyone can join)</SelectItem>
                            <SelectItem value="private">Private (Requires invitation)</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Determines how new users can join your organization.</p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="two_factor_auth_required">Require Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">All users in this organization must enable 2FA.</p>
                    </div>
                    <Switch
                        id="two_factor_auth_required"
                        checked={formData.two_factor_auth_required}
                        onCheckedChange={(checked) => handleInputChange('two_factor_auth_required', checked)}
                    />
                </div>

                <fieldset className="grid gap-4 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">Password Policy</legend>
                    <div className="grid gap-2">
                        <Label htmlFor="password_policy.min_length">Minimum Length</Label>
                        <Input
                            id="password_policy.min_length"
                            type="number"
                            value={formData.password_policy.min_length}
                            onChange={(e) => handlePasswordPolicyChange('min_length', Number.parseInt(e.target.value) || 6)}
                            min={6}
                            max={64}
                            className={fieldErrors['password_policy.min_length'] ? 'border-destructive' : ''}
                        />
                        {fieldErrors['password_policy.min_length'] && (
                            <p className="text-sm text-destructive">{fieldErrors['password_policy.min_length']}</p>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password_policy.requires_uppercase">Requires Uppercase</Label>
                        <Switch
                            id="password_policy.requires_uppercase"
                            checked={formData.password_policy.requires_uppercase}
                            onCheckedChange={(checked) => handlePasswordPolicyChange('requires_uppercase', checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password_policy.requires_lowercase">Requires Lowercase</Label>
                        <Switch
                            id="password_policy.requires_lowercase"
                            checked={formData.password_policy.requires_lowercase}
                            onCheckedChange={(checked) => handlePasswordPolicyChange('requires_lowercase', checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password_policy.requires_number">Requires Number</Label>
                        <Switch
                            id="password_policy.requires_number"
                            checked={formData.password_policy.requires_number}
                            onCheckedChange={(checked) => handlePasswordPolicyChange('requires_number', checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password_policy.requires_symbol">Requires Symbol</Label>
                        <Switch
                            id="password_policy.requires_symbol"
                            checked={formData.password_policy.requires_symbol}
                            onCheckedChange={(checked) => handlePasswordPolicyChange('requires_symbol', checked)}
                        />
                    </div>
                    {fieldErrors['password_policy'] && (
                        <p className="text-sm text-destructive">{fieldErrors['password_policy']}</p>
                    )}
                </fieldset>

                <div className="flex justify-end gap-3">
                    {showWarning && isDirty && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                            You have unsaved changes. Please save or cancel your changes before leaving.
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
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className={`flex-1 transition-all duration-300 ${
                                    internalPulse
                                        ? 'animate-pulse border-blue-500 shadow-lg shadow-blue-500/50 ring-2 ring-blue-500/75'
                                        : ''
                                }`}
                                disabled={isSubmitting || !isDirty}
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    )}
                </div>
            </form>
        )
    }
)
