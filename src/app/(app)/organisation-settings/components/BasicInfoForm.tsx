"use client"

import type React from "react"

import { useState } from "react"
import type { OrganizationSettings } from "@/types/organisation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

interface BasicInfoFormProps {
    orgId: number
    initialSettings: OrganizationSettings
}

export function BasicInfoForm({ orgId, initialSettings }: BasicInfoFormProps) {
    const [name, setName] = useState(initialSettings.name)
    const [description, setDescription] = useState(initialSettings.description || "")
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(initialSettings.logo_url)
    const [domain, setDomain] = useState(initialSettings.domain || "")
    const [streetAddress, setStreetAddress] = useState(initialSettings.address.street_address)
    const [suburb, setSuburb] = useState(initialSettings.address.suburb)
    const [city, setCity] = useState(initialSettings.address.city)
    const [province, setProvince] = useState(initialSettings.address.province)
    const [postalCode, setPostalCode] = useState(initialSettings.address.postal_code)
    const [timezone, setTimezone] = useState(initialSettings.timezone)
    const [localization, setLocalization] = useState(initialSettings.localization)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setLogoFile(file)
            setLogoPreview(URL.createObjectURL(file))
        }
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
            description,
            domain,
            address: { street_address: streetAddress, suburb, city, province, postal_code: postalCode },
            timezone,
            localization,
            // logo_url would come from the upload response
        }
        console.log("Updated Basic Settings:", updatedSettings)
        console.log("New Logo File:", logoFile)

        setIsSubmitting(false)
        toast({ title: "Success", description: "Organization basic information updated." })
    }

    return (
        <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="logo">Organization Logo</Label>
                <div className="flex items-center gap-4">
                    {logoPreview && (
                        <Image
                            src={logoPreview || "/placeholder.svg"}
                            alt="Organization Logo"
                            width={64}
                            height={64}
                            className="rounded-full object-cover"
                        />
                    )}
                    <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="flex-1 file:text-primary-foreground file:bg-primary hover:file:bg-primary/90"
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="domain">Custom Domain</Label>
                <Input id="domain" placeholder="e.g., yourorg.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
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

            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="America/New_York">America/New_York</SelectItem>
                            <SelectItem value="Europe/London">Europe/London</SelectItem>
                            <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                            {/* Add more timezones */}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="localization">Localization</Label>
                    <Select value={localization} onValueChange={setLocalization}>
                        <SelectTrigger id="localization">
                            <SelectValue placeholder="Select localization" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en-US">English (US)</SelectItem>
                            <SelectItem value="en-GB">English (UK)</SelectItem>
                            <SelectItem value="es-ES">Spanish (Spain)</SelectItem>
                            {/* Add more localizations */}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    )
}
