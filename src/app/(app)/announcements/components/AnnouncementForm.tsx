"use client"

import type React from "react"

import { useState } from "react"
import type { AnnouncementCreatePayload } from "@/types/announcement"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface AnnouncementFormProps {
  orgId: number
}

export function AnnouncementForm({ orgId }: AnnouncementFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [targetAudience, setTargetAudience] = useState<AnnouncementCreatePayload["target_audience"]>("all")
  const [priority, setPriority] = useState<AnnouncementCreatePayload["priority"]>("normal")
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(undefined)
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments(Array.from(event.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!title || !content) {
      toast({
        title: "Validation Error",
        description: "Title and content are required.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    const payload: AnnouncementCreatePayload = {
      title,
      content,
      target_audience: targetAudience,
      priority,
      scheduled_at: scheduledAt ? scheduledAt.toISOString() : null,
      // attachments: attachments // In a real app, you'd upload these separately or as FormData
    }

    // Simulate API call
    toast({ title: "Creating announcement...", description: "Your announcement is being processed." })
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real application, you'd send `payload` to your API
    // and handle file uploads (e.g., to Vercel Blob storage)
    console.log("Announcement Payload:", payload)
    console.log("Attachments:", attachments)

    setTitle("")
    setContent("")
    setTargetAudience("all")
    setPriority("normal")
    setScheduledAt(undefined)
    setAttachments([])
    setIsSubmitting(false)

    toast({
      title: "Announcement Created!",
      description: "Your announcement has been successfully created.",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="e.g., Important System Update"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="Write your announcement here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          required
        />
        <p className="text-sm text-muted-foreground">
          Note: For rich text editing, integrate a library like React Quill or Tiptap.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="target-audience">Target Audience</Label>
          <Select
            value={targetAudience}
            onValueChange={(value: AnnouncementCreatePayload["target_audience"]) => setTargetAudience(value)}
          >
            <SelectTrigger id="target-audience">
              <SelectValue placeholder="Select audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="specific_roles">Specific Roles</SelectItem>
              <SelectItem value="specific_users">Specific User Groups</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="priority">Priority Level</Label>
          <Select value={priority} onValueChange={(value: AnnouncementCreatePayload["priority"]) => setPriority(value)}>
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="scheduled-at">Schedule Publication (Optional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-full justify-start text-left font-normal", !scheduledAt && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {scheduledAt ? format(scheduledAt, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={scheduledAt} onSelect={setScheduledAt} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="attachments">Attachments (Optional)</Label>
        <Input
          id="attachments"
          type="file"
          multiple
          onChange={handleFileChange}
          className="file:text-primary-foreground file:bg-primary hover:file:bg-primary/90"
        />
        {attachments.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Selected files: {attachments.map((f) => f.name).join(", ")}
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Announcement"}
      </Button>
    </form>
  )
}
