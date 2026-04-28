import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import type { MasterClassCategory, ShowProgram, WorkshopItem } from '~/data/catalog'
import type { HomeGalleryContent } from '~/data/home-gallery'
import type { HomeHeroSlide } from '~/data/home-slider'
import type { SiteSeoSettings } from '~/data/site-seo'
import catalogContentDefault from '~/data/cms/catalog-content.json'
import homeGalleryContentDefault from '~/data/cms/home-gallery.json'
import homeSliderContentDefault from '~/data/cms/home-slider.json'
import siteSeoContentDefault from '~/data/cms/site-seo.json'

type CatalogContentPayload = {
  shows: ShowProgram[]
  masterClassCategories: MasterClassCategory[]
  workshops: WorkshopItem[]
}

const cmsDir = join(process.cwd(), 'data', 'cms')
const homeSliderPath = join(cmsDir, 'home-slider.json')
const catalogContentPath = join(cmsDir, 'catalog-content.json')
const homeGalleryPath = join(cmsDir, 'home-gallery.json')
const siteSeoPath = join(cmsDir, 'site-seo.json')

const cloneJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

const readJsonFile = async <T>(target: string, fallback: T): Promise<T> => {
  try {
    const content = await readFile(target, 'utf8')
    return JSON.parse(content) as T
  }
  catch (error) {
    const err = error as NodeJS.ErrnoException

    if (err?.code === 'ENOENT') {
      return cloneJson(fallback)
    }

    throw error
  }
}

const writeJsonFile = async (target: string, value: unknown) => {
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

export const getHomeSliderContent = () =>
  readJsonFile<HomeHeroSlide[]>(homeSliderPath, homeSliderContentDefault as HomeHeroSlide[])

export const saveHomeSliderContent = (slides: HomeHeroSlide[]) =>
  writeJsonFile(homeSliderPath, slides)

export const getCatalogContent = () =>
  readJsonFile<CatalogContentPayload>(catalogContentPath, catalogContentDefault as CatalogContentPayload)

export const saveCatalogContent = (content: CatalogContentPayload) =>
  writeJsonFile(catalogContentPath, content)

export const getHomeGalleryContent = () =>
  readJsonFile<HomeGalleryContent>(homeGalleryPath, homeGalleryContentDefault as HomeGalleryContent)

export const saveHomeGalleryContent = (content: HomeGalleryContent) =>
  writeJsonFile(homeGalleryPath, content)

export const getSiteSeoContent = () =>
  readJsonFile<SiteSeoSettings>(siteSeoPath, siteSeoContentDefault as SiteSeoSettings)

export const saveSiteSeoContent = (content: SiteSeoSettings) =>
  writeJsonFile(siteSeoPath, content)

export const getAdminSummary = async () => {
  const [homeSlider, catalog, gallery, seo] = await Promise.all([
    getHomeSliderContent(),
    getCatalogContent(),
    getHomeGalleryContent(),
    getSiteSeoContent()
  ])

  return {
    slides: homeSlider.length,
    shows: catalog.shows.length,
    categories: catalog.masterClassCategories.length,
    workshops: catalog.workshops.length,
    galleryItems: gallery.items.length,
    seoSections: 7,
    siteUrl: seo.siteUrl,
    updatedAt: new Date().toISOString()
  }
}
