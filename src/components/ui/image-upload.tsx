import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  imagePreview: string | null
  onRemove: () => void
  onUploadClick: () => void
  onFileChange: (file: File) => void
  uploadButtonId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const sizeMap = {
  sm: { container: 'w-24 h-24', icon: 'h-5 w-5', text: 'text-xs' },
  md: { container: 'w-32 h-32', icon: 'h-6 w-6', text: 'text-sm' },
  lg: { container: 'w-40 h-40', icon: 'h-8 w-8', text: 'text-base' },
}

export function ImageUpload({
  imagePreview,
  onRemove,
  onUploadClick,
  onFileChange,
  uploadButtonId,
  className = '',
  size = 'md',
  label = 'Upload Image',
}: ImageUploadProps) {
  const sizes = sizeMap[size]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileChange(file)
    }
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {imagePreview ? (
          <div className="relative w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden flex items-center justify-center">
            <Image
              src={imagePreview}
              alt="Image preview"
              fill
              className="object-contain p-2"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 h-6 w-6 p-0"
              onClick={onRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className={`${sizes.container} border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-muted-foreground/50 transition-colors`}>
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {label}
            </span>
          </div>
        )}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onUploadClick}
          >
            <Upload className="mr-2 h-4 w-4" />
            {imagePreview ? 'Change Image' : label}
          </Button>
          <input
            id={uploadButtonId}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  )
}
