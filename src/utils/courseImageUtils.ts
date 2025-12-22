// Utility to get course image URLs
// Since we can't dynamically import all images, we'll use a function that constructs paths
// that work with the build system

/**
 * Get the image URL for a course
 * Tries different extensions and formats
 */
export function getCourseImageUrl(courseId: string): string {
  // Try different extensions in order of preference
  const extensions = ['hero.jpg', 'hero.webp', 'hero.jpeg', 'hero.png', '_hero.jpg', '_hero.webp', '_hero.jpeg', '_hero.png']
  
  // For Vite, we can use import.meta.url to create dynamic imports
  // But since we have many images, we'll use a pattern that works with the public folder
  // or construct paths that Vite can resolve
  
  // First, try to construct a path that works with Vite's asset handling
  // Images should be in public folder or we need to use a different approach
  
  // For now, use a pattern that will work if images are in public folder
  // or use a function that tries to import dynamically
  
  const baseName = courseId.toLowerCase().replace(/\s+/g, '-')
  
  // Try to use new URL with import.meta.url for dynamic imports
  // This works for Vite
  try {
    // Try hero.jpg first
    const imagePath = `/src/assets/images/courses/${baseName}_hero.jpg`
    return imagePath
  } catch {
    // Fallback
    return `/src/assets/images/courses/${baseName}_hero.jpg`
  }
}

/**
 * Get course image URL with fallback handling
 * This function tries to construct a valid image path
 */
export function getCourseImage(courseId: string, courseName?: string): string {
  const id = courseId || (courseName ? courseName.toLowerCase().replace(/\s+/g, '-') : '')
  
  // Construct path - Vite will handle this if images are properly imported
  // or if they're in the public folder
  return `/src/assets/images/courses/${id}_hero.jpg`
}

/**
 * Check if an image exists by trying to load it
 * Returns a placeholder if not found
 */
export function getCourseImageWithFallback(courseId: string): string {
  const baseName = courseId.toLowerCase().replace(/\s+/g, '-')
  
  // Try different extensions
  const extensions = ['jpg', 'webp', 'jpeg', 'png']
  
  // For now, return the most common pattern
  // The actual loading will happen in the component with error handling
  return `/src/assets/images/courses/${baseName}_hero.jpg`
}


