import { RecordImage } from '@/types'

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif']
export const MAX_DIMENSIONS = { width: 1200, height: 900 } // 4:3 aspect ratio

export async function validateAndResizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error('File size should not exceed 5MB'))
      return
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      reject(new Error('Only JPG, PNG and GIF files are allowed'))
      return
    }

    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        
        // Calculate dimensions while maintaining aspect ratio
        const aspectRatio = width / height
        const targetAspectRatio = MAX_DIMENSIONS.width / MAX_DIMENSIONS.height

        if (aspectRatio > targetAspectRatio) {
          // Image is wider than target ratio
          if (width > MAX_DIMENSIONS.width) {
            width = MAX_DIMENSIONS.width
            height = width / aspectRatio
          }
        } else {
          // Image is taller than target ratio
          if (height > MAX_DIMENSIONS.height) {
            height = MAX_DIMENSIONS.height
            width = height * aspectRatio
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        
        // Use high-quality image scaling
        if (ctx) {
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)
        }

        // Convert to base64 with high quality
        const resizedImage = canvas.toDataURL(file.type, 0.9)
        resolve(resizedImage)
      }
      img.onerror = () => reject(new Error('Failed to load image'))
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export function generateImageId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export async function handleImageUpload(
  file: File,
  type: 'Before' | 'After'
): Promise<RecordImage> {
  try {
    const base64Image = await validateAndResizeImage(file)
    return {
      id: generateImageId(),
      type,
      url: base64Image,
      uploadedAt: new Date().toISOString()
    }
  } catch (error) {
    throw error
  }
}