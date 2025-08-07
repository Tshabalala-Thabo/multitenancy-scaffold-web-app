import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
    imagePreview: string | null
    onRemove: () => void
    onUploadClick: () => void
    className?: string
    size?: 'sm' | 'md' | 'lg'
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
    className = '',
    size = 'md',
}: ImageUploadProps) {
    const sizes = sizeMap[size]

    return (
        <div className={className}>
            {imagePreview ? (
                <div
                    className={`relative ${sizes.container} border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden flex items-center justify-center`}>
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
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={onRemove}>
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={onUploadClick}
                    className={`${sizes.container} border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-muted-foreground/50 transition-colors`}>
                    <Upload className={`${sizes.icon} text-muted-foreground`} />
                    <span className={`${sizes.text} text-muted-foreground`}>
                        Upload Image
                    </span>
                </button>
            )}
        </div>
    )
}
