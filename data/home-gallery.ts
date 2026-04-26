import homeGalleryContent from './cms/home-gallery.json'

export type HomeGalleryItem = {
  id: string
  src: string
  alt: string
}

export type HomeGalleryContent = {
  eyebrow: string
  title: string
  description: string
  items: HomeGalleryItem[]
}

export const homeGallery = homeGalleryContent as HomeGalleryContent
export const homeGalleryItems = homeGallery.items
