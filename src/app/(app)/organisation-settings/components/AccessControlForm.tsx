"use client"

import type React from "react"

import { useState } from "react"
import type { OrganizationSettings } from "@/types/organisation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface AccessControlFormProps {
  orgId: number
  initialSettings: OrganizationSettings
}

export function AccessControlForm({ orgId, initialSettings }: AccessControlFormProps) {
  const [privacySetting, setPrivacySetting] = useState(initialSettings.privacy_setting)
  const [domainRestrictions, setDomainRestrictions] = useState(initialSettings.domain_restrictions.join(", "))
  const [twoFactorAuthRequired, setTwoFactorAuthRequired] = useState(initialSettings.two_factor_auth_required)
  const [passwordMinLength, setPasswordMinLength] = useState(initialSettings.password_policy.min_length)
  const [passwordRequiresUppercase, setPasswordRequiresUppercase] = useState(
    initialSettings.password_policy.requires_uppercase,
  )
  const [passwordRequiresLowercase, setPasswordRequiresLowercase] = useState(
    initialSettings.password_policy.requires_lowercase,
  )
  const [passwordRequiresNumber, setPasswordRequiresNumber] = useState(initialSettings.password_policy.requires_number)
  const [passwordRequiresSymbol, setPasswordRequiresSymbol] = useState(initialSettings.password_policy.requires_symbol)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    toast({ title: "Saving access control settings...", description: "Updating organization security policies." })
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const updatedSettings = {
      privacy_setting: privacySetting,
      domain_restrictions: domainRestrictions
        .split(",")
        .map((d) => d.trim())
        .filter((d) => d),
      two_factor_auth_required: twoFactorAuthRequired,
      password_policy: {
        min_length: passwordMinLength,
        requires_uppercase: passwordRequiresUppercase,
        requires_lowercase: passwordRequiresLowercase,
        requires_number: passwordRequiresNumber,
        requires_symbol: passwordRequiresSymbol,
      },
    }
    console.log("Updated Access Control Settings:", updatedSettings)

    setIsSubmitting(false)
    toast({ title: "Success", description: "Access control settings updated." })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="privacy-setting">Organization Privacy</Label>
        <Select
          value={privacySetting}
          onValueChange={(value: OrganizationSettings["privacy_setting"]) => setPrivacySetting(value)}
        >
          <SelectTrigger id="privacy-setting">
            <SelectValue placeholder="Select privacy setting" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public (Anyone can join)</SelectItem>
            <SelectItem value="private">Private (Requires invitation)</SelectItem>
            <SelectItem value="invite-only">Invite Only (Strictly by invitation)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">Determines how new users can join your organization.</p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="domain-restrictions">Domain Restrictions for User Registration</Label>
        <Input
          id="domain-restrictions"
          placeholder="e.g., example.com, another.org (comma-separated)"
          value={domainRestrictions}
          onChange={(e) => setDomainRestrictions(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Only users with emails from these domains can register or be invited. Leave empty for no restrictions.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="2fa-required">Require Two-Factor Authentication</Label>
          <p className="text-sm text-muted-foreground">All users in this organization must enable 2FA.</p>
        </div>
        <Switch id="2fa-required" checked={twoFactorAuthRequired} onCheckedChange={setTwoFactorAuthRequired} />
      </div>

      <fieldset className="grid gap-4 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">Password Policy</legend>
        <div className="grid gap-2">
          <Label htmlFor="min-length">Minimum Length</Label>
          <Input
            id="min-length"
            type="number"
            value={passwordMinLength}
            onChange={(e) => setPasswordMinLength(Number.parseInt(e.target.value))}
            min={6}
            max={64}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="uppercase">Requires Uppercase</Label>
          <Switch id="uppercase" checked={passwordRequiresUppercase} onCheckedChange={setPasswordRequiresUppercase} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="lowercase">Requires Lowercase</Label>
          <Switch id="lowercase" checked={passwordRequiresLowercase} onCheckedChange={setPasswordRequiresLowercase} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="number">Requires Number</Label>
          <Switch id="number" checked={passwordRequiresNumber} onCheckedChange={setPasswordRequiresNumber} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="symbol">Requires Symbol</Label>
          <Switch id="symbol" checked={passwordRequiresSymbol} onCheckedChange={setPasswordRequiresSymbol} />
        </div>
      </fieldset>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
