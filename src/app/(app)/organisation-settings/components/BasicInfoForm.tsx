"use client"

import type React from "react"

import { useRef, useState } from "react"
import type { OrganizationSettings } from "@/types/organisation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/ui/image-upload"

interface BasicInfoFormProps {
    initialSettings: OrganizationSettings
}

export function BasicInfoForm({ initialSettings }: BasicInfoFormProps) {
    const [name, setName] = useState(initialSettings.name)
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(initialSettings.logo_url)
    const [domain, setDomain] = useState(initialSettings.domain || "")
    const [streetAddress, setStreetAddress] = useState(initialSettings.address.street_address)
    const [suburb, setSuburb] = useState(initialSettings.address.suburb)
    const [city, setCity] = useState(initialSettings.address.city)
    const [province, setProvince] = useState(initialSettings.address.province)
    const [postalCode, setPostalCode] = useState(initialSettings.address.postal_code)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)

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

        // In a real application, handle logo upload first (e.g., to Vercel Blob)
        // Then send the updated settings including the new logo_url
        toast({ title: "Saving basic information...", description: "Updating organization details." })
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const updatedSettings = {
            name,
            domain,
            address: { street_address: streetAddress, suburb, city, province, postal_code: postalCode },
        }
        console.log("Updated Basic Settings:", updatedSettings)
        console.log("New Logo File:", logoFile)

        setIsSubmitting(false)
        toast({ title: "Success", description: "Organization basic information updated." })
    }

    return (
        <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Organization Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input id="domain" placeholder="e.g., yourorg.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
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
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            handleLogoChange(e.target.files[0])
                        }
                    }}
                />
            </div>

            <fieldset className="grid gap-4 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">Address</legend>
                <div className="grid gap-2">
                    <Label htmlFor="street-address">Street Address</Label>
                    <Input id="street-address" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="suburb">Suburb</Label>
                        <Input id="suburb" value={suburb} onChange={(e) => setSuburb(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="province">Province</Label>
                        <Input id="province" value={province} onChange={(e) => setProvince(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="postal-code">Postal Code</Label>
                        <Input id="postal-code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                    </div>
                </div>
            </fieldset>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    )
}
