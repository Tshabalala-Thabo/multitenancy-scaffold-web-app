"use client"

import type React from "react"

import { useState } from "react"
import type { OrganizationSettings } from "@/types/organisation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { PlusCircle, Trash2 } from "lucide-react"

interface FeaturesIntegrationsFormProps {
    orgId: number
    initialSettings: OrganizationSettings
}

export function FeaturesIntegrationsForm({ orgId, initialSettings }: FeaturesIntegrationsFormProps) {
    const [features, setFeatures] = useState(initialSettings.features)
    const [apiKeys, setApiKeys] = useState(initialSettings.api_keys)
    const [webhooks, setWebhooks] = useState(initialSettings.webhooks)
    const [thirdPartyIntegrations, setThirdPartyIntegrations] = useState(initialSettings.third_party_integrations)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleFeatureToggle = (featureName: keyof typeof features, checked: boolean) => {
        setFeatures((prev) => ({ ...prev, [featureName]: checked }))
    }

    const handleAddApiKey = () => {
        // In a real app, this would generate a new key on the backend
        const newKey = {
            id: `api_key_${Math.random().toString(36).substring(2, 15)}`,
            name: `New API Key ${apiKeys.length + 1}`,
            created_at: new Date().toISOString(),
            last_used_at: "Never",
        }
        setApiKeys((prev) => [...prev, newKey])
        toast({
            title: "API Key Added",
            description: "A new API key has been generated. Remember to copy it now as it won't be shown again.",
        })
    }

    const handleDeleteApiKey = (id: string) => {
        setApiKeys((prev) => prev.filter((key) => key.id !== id))
        toast({ title: "API Key Deleted", description: "The API key has been removed." })
    }

    const handleAddWebhook = () => {
        setWebhooks((prev) => [
            ...prev,
            { id: `webhook_${Math.random().toString(36).substring(2, 15)}`, url: "", events: [] },
        ])
    }

    const handleWebhookChange = (index: number, field: string, value: string | string[]) => {
        const updatedWebhooks = [...webhooks]
        // @ts-ignore
        updatedWebhooks[index][field] = value
        setWebhooks(updatedWebhooks)
    }

    const handleDeleteWebhook = (id: string) => {
        setWebhooks((prev) => prev.filter((webhook) => webhook.id !== id))
        toast({ title: "Webhook Deleted", description: "The webhook has been removed." })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        toast({ title: "Saving features & integrations...", description: "Updating organization capabilities." })
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const updatedSettings = {
            features,
            api_keys: apiKeys,
            webhooks,
            third_party_integrations: thirdPartyIntegrations, // Declared variable here
        }
        console.log("Updated Features & Integrations Settings:", updatedSettings)

        setIsSubmitting(false)
        toast({ title: "Success", description: "Features and integrations settings updated." })
    }

    return (
        <form onSubmit={handleSubmit} className="grid gap-6">
            <fieldset className="grid gap-4 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">Organization Features</legend>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="announcements-enabled">Announcements System</Label>
                        <p className="text-sm text-muted-foreground">
                            Enable or disable the organization-wide announcement system.
                        </p>
                    </div>
                    <Switch
                        id="announcements-enabled"
                        checked={features.announcements_enabled}
                        onCheckedChange={(checked) => handleFeatureToggle("announcements_enabled", checked)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="analytics-enabled">Analytics Dashboard</Label>
                        <p className="text-sm text-muted-foreground">Provide administrators with insights and metrics.</p>
                    </div>
                    <Switch
                        id="analytics-enabled"
                        checked={features.analytics_enabled}
                        onCheckedChange={(checked) => handleFeatureToggle("analytics_enabled", checked)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="custom-roles-enabled">Custom Roles</Label>
                        <p className="text-sm text-muted-foreground">Allow creation of custom roles with granular permissions.</p>
                    </div>
                    <Switch
                        id="custom-roles-enabled"
                        checked={features.custom_roles_enabled}
                        onCheckedChange={(checked) => handleFeatureToggle("custom_roles_enabled", checked)}
                    />
                </div>
                {/* Add more feature toggles as needed */}
            </fieldset>

            <fieldset className="grid gap-4 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">API Keys</legend>
                {apiKeys.length === 0 && <p className="text-sm text-muted-foreground">No API keys configured.</p>}
                {apiKeys.map((key) => (
                    <div key={key.id} className="flex items-center justify-between gap-4">
                        <div className="grid gap-1 flex-1">
                            <Label>{key.name}</Label>
                            <p className="text-sm text-muted-foreground">
                                Created: {new Date(key.created_at).toLocaleDateString()} | Last Used:{" "}
                                {new Date(key.last_used_at).toLocaleDateString()}
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteApiKey(key.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete API Key</span>
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddApiKey}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Generate New API Key
                </Button>
            </fieldset>

            <fieldset className="grid gap-4 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">Webhooks</legend>
                {webhooks.length === 0 && <p className="text-sm text-muted-foreground">No webhooks configured.</p>}
                {webhooks.map((webhook, index) => (
                    <div key={webhook.id} className="grid gap-2 border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-center justify-between">
                            <Label htmlFor={`webhook-url-${index}`}>Webhook URL</Label>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteWebhook(webhook.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete Webhook</span>
                            </Button>
                        </div>
                        <Input
                            id={`webhook-url-${index}`}
                            value={webhook.url}
                            onChange={(e) => handleWebhookChange(index, "url", e.target.value)}
                            placeholder="https://your-endpoint.com/webhook"
                        />
                        <Label htmlFor={`webhook-events-${index}`}>Events to Trigger</Label>
                        <Input
                            id={`webhook-events-${index}`}
                            value={webhook.events.join(", ")}
                            onChange={(e) =>
                                handleWebhookChange(
                                    index,
                                    "events",
                                    e.target.value.split(",").map((s) => s.trim()),
                                )
                            }
                            placeholder="e.g., user.created, announcement.published"
                        />
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddWebhook}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Webhook
                </Button>
            </fieldset>

            <fieldset className="grid gap-4 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">Third-Party Integrations</legend>
                {thirdPartyIntegrations.length === 0 && (
                    <p className="text-sm text-muted-foreground">No integrations configured.</p>
                )}
                {thirdPartyIntegrations.map((integration, index) => (
                    <div key={integration.name} className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor={`integration-${index}`}>{integration.name}</Label>
                            <p className="text-sm text-muted-foreground">{integration.enabled ? "Enabled" : "Disabled"}</p>
                        </div>
                        <Switch
                            id={`integration-${index}`}
                            checked={integration.enabled}
                            onCheckedChange={(checked) => {
                                const updatedIntegrations = [...thirdPartyIntegrations]
                                updatedIntegrations[index].enabled = checked
                                setThirdPartyIntegrations(updatedIntegrations)
                            }}
                        />
                    </div>
                ))}
                {/* Add button to add new integrations if dynamic */}
            </fieldset>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    )
}
