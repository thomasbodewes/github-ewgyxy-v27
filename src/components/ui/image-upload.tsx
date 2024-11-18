import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from './button'
import { Label } from './label'
import { handleImageUpload } from '@/lib/image-utils'
import { RecordImage } from '@/types'
import { useToast } from './use-toast'

interface ImageUploadProps {
  type: 'Before' | 'After'
  value?: RecordImage
  onChange: (image: RecordImage | undefined) => void
  disabled?: boolean
}

export function ImageUpload({ type, value, onChange, disabled }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      const image = await handleImageUpload(file, type)
      onChange(image)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = () => {
    onChange(undefined)
  }

  return (
    <div className="space-y-2">
      <Label>{type} Treatment</Label>
      <div className="flex items-center justify-center w-full">
        {value ? (
          <div className="relative w-full aspect-[4/3] bg-muted rounded-lg overflow-hidden">
            <img
              src={value.url}
              alt={`${type} treatment`}
              className="w-full h-full object-contain"
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                margin: 'auto',
                display: 'block'
              }}
            />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full aspect-[4/3] border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Plus className="w-8 h-8 mb-4 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG or GIF (max. 5MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={disabled || isLoading}
            />
          </label>
        )}
      </div>
    </div>
  )
}