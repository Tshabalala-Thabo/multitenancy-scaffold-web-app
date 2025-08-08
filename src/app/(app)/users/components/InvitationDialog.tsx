"use client"

import { useState } from "react"
import { Mail, ChevronDown } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu"
import { ReusableDialog, FormDialogFooter } from "../../../../components/ReusableDialog"

interface InvitationDialogProps {
  isOpen: boolean
  onClose: () => void
  orgRoles: { id: string; name: string }[]
  onInviteUser: (email: string, roles: string[], message?: string) => Promise<void>
  onBulkInvite: (emails: string[], roles: string[], message?: string) => Promise<void>
}

type InvitationType = "single" | "bulk"

export function InvitationDialog({
  isOpen,
  onClose,
  orgRoles,
  onInviteUser,
  onBulkInvite,
}: InvitationDialogProps) {
  const [invitationType, setInvitationType] = useState<InvitationType>("single")
  const [email, setEmail] = useState("")
  const [bulkEmails, setBulkEmails] = useState("")
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [invitationMessage, setInvitationMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInviteUser = async () => {
    if (!email || selectedRoles.length === 0) return
    setIsSubmitting(true)
    try {
      await onInviteUser(email, selectedRoles, invitationMessage)
      setEmail("")
      setSelectedRoles([])
      setInvitationMessage("")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBulkInvite = async () => {
    if (!bulkEmails || selectedRoles.length === 0) return

    const emails = bulkEmails
      .split(/[\n,]/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0)

    if (emails.length === 0) return

    setIsSubmitting(true)
    try {
      await onBulkInvite(emails, selectedRoles, invitationMessage)
      setBulkEmails("")
      setSelectedRoles([])
      setInvitationMessage("")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderForm = () => {
    if (invitationType === "single") {
      return (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <RoleSelect
            orgRoles={orgRoles}
            selectedRoles={selectedRoles}
            onRoleChange={setSelectedRoles}
            disabled={isSubmitting}
          />
          <MessageInput
            value={invitationMessage}
            onChange={setInvitationMessage}
            disabled={isSubmitting}
          />
          <Button
            onClick={handleInviteUser}
            className="w-full"
            disabled={!email || selectedRoles.length === 0 || isSubmitting}
          >
            <Mail className="mr-2 h-4 w-4" /> Send Invitation
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="bulk-emails">Email Addresses (one per line or comma-separated)</Label>
          <Textarea
            id="bulk-emails"
            placeholder="user1@example.com\nuser2@example.com"
            value={bulkEmails}
            onChange={(e) => setBulkEmails(e.target.value)}
            rows={5}
            disabled={isSubmitting}
          />
        </div>
        <RoleSelect
          orgRoles={orgRoles}
          selectedRoles={selectedRoles}
          onRoleChange={setSelectedRoles}
          disabled={isSubmitting}
        />
        <MessageInput
          value={invitationMessage}
          onChange={setInvitationMessage}
          disabled={isSubmitting}
        />
        <Button
          onClick={handleBulkInvite}
          className="w-full"
          disabled={!bulkEmails || selectedRoles.length === 0 || isSubmitting}
        >
          <Mail className="mr-2 h-4 w-4" /> Send Bulk Invitations
        </Button>
      </div>
    )
  }

  return (
    <ReusableDialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center justify-between">
          <span>Invite Users</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                {invitationType === "single" ? "Single User" : "Bulk Invite"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setInvitationType("single")}>
                Single User Invitation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setInvitationType("bulk")}>
                Bulk User Invitation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
      description={
        invitationType === "single"
          ? "Invite a single user to your organization"
          : "Invite multiple users at once to your organization"
      }
      className="max-w-2xl"
    >
      {renderForm()}
    </ReusableDialog>
  )
}

interface RoleSelectProps {
  orgRoles: { id: string; name: string }[]
  selectedRoles: string[]
  onRoleChange: (roles: string[]) => void
  disabled?: boolean
}

function RoleSelect({ orgRoles, selectedRoles, onRoleChange, disabled }: RoleSelectProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="roles">Assign Roles</Label>
      <Select
        onValueChange={(value) => onRoleChange(value ? [value] : [])}
        value={selectedRoles[0] || ""}
        disabled={disabled}
      >
        <SelectTrigger id="roles">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          {orgRoles.map((role) => (
            <SelectItem key={role.id} value={role.name}>
              {role.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

function MessageInput({ value, onChange, disabled }: MessageInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="message">Custom Message (Optional)</Label>
      <Textarea
        id="message"
        placeholder="Welcome to our organization!"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  )
}
