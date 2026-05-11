import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import type { MasterClassCategory, ShowProgram, WorkshopItem } from '~/data/catalog'
import type { HomeContent } from '~/data/home-content'
import type { CatalogPagesContent } from '~/data/catalog-pages'
import type { HomeGalleryContent } from '~/data/home-gallery'
import type { ServiceLandingPage, ServicePageSlug } from '~/data/service-pages'
import type { HomeHeroSlide } from '~/data/home-slider'
import type { ShowCollectionPage, ShowCollectionSlug } from '~/data/show-collections'
import type { SiteSeoSettings } from '~/data/site-seo'
import catalogContentDefault from '~/data/cms/catalog-content.json'
import homeContentDefault from '~/data/cms/home-content.json'
import catalogPagesContentDefault from '~/data/cms/catalog-pages.json'
import homeGalleryContentDefault from '~/data/cms/home-gallery.json'
import homeSliderContentDefault from '~/data/cms/home-slider.json'
import servicePagesContentDefault from '~/data/cms/service-pages.json'
import showCollectionsContentDefault from '~/data/cms/show-collections.json'
import siteSeoContentDefault from '~/data/cms/site-seo.json'

type CatalogContentPayload = {
  masterClassesHeroImage?: string
  shows: ShowProgram[]
  masterClassCategories: MasterClassCategory[]
  workshops: WorkshopItem[]
}

const cmsDir = join(process.cwd(), 'data', 'cms')
const homeSliderPath = join(cmsDir, 'home-slider.json')
const catalogContentPath = join(cmsDir, 'catalog-content.json')
const homeContentPath = join(cmsDir, 'home-content.json')
const homeGalleryPath = join(cmsDir, 'home-gallery.json')
const catalogPagesPath = join(cmsDir, 'catalog-pages.json')
const siteSeoPath = join(cmsDir, 'site-seo.json')
const showCollectionsPath = join(cmsDir, 'show-collections.json')
const servicePagesPath = join(cmsDir, 'service-pages.json')

type ShowCollectionsPayload = Record<ShowCollectionSlug, ShowCollectionPage>
type ServicePagesPayload = Record<ServicePageSlug, ServiceLandingPage>

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

export const getHomeContent = () =>
  readJsonFile<HomeContent>(homeContentPath, homeContentDefault as HomeContent)

export const saveHomeContent = (content: HomeContent) =>
  writeJsonFile(homeContentPath, content)

export const getHomeGalleryContent = () =>
  readJsonFile<HomeGalleryContent>(homeGalleryPath, homeGalleryContentDefault as HomeGalleryContent)

export const getCatalogPagesContent = async () => {
  const [catalogPages, catalog] = await Promise.all([
    readJsonFile<CatalogPagesContent>(catalogPagesPath, catalogPagesContentDefault as CatalogPagesContent),
    getCatalogContent()
  ])

  if (!catalogPages.shows.hero.image) {
    catalogPages.shows.hero.image =
      catalog.shows[1]?.heroImage ||
      catalog.shows[0]?.heroImage ||
      catalog.shows[0]?.image ||
      ''
  }

  if (!catalogPages.masterClasses.hero.image) {
    catalogPages.masterClasses.hero.image =
      catalog.masterClassesHeroImage ||
      catalog.masterClassCategories[0]?.image ||
      catalog.workshops[0]?.image ||
      ''
  }

  return catalogPages
}

export const saveCatalogPagesContent = (content: CatalogPagesContent) =>
  writeJsonFile(catalogPagesPath, content)

export const saveHomeGalleryContent = (content: HomeGalleryContent) =>
  writeJsonFile(homeGalleryPath, content)

export const getSiteSeoContent = () =>
  readJsonFile<SiteSeoSettings>(siteSeoPath, siteSeoContentDefault as SiteSeoSettings)

export const saveSiteSeoContent = (content: SiteSeoSettings) =>
  writeJsonFile(siteSeoPath, content)

export const getShowCollectionsContent = () =>
  readJsonFile<ShowCollectionsPayload>(
    showCollectionsPath,
    showCollectionsContentDefault as ShowCollectionsPayload
  )

export const saveShowCollectionsContent = (content: ShowCollectionsPayload) =>
  writeJsonFile(showCollectionsPath, content)

export const getServicePagesContent = () =>
  readJsonFile<ServicePagesPayload>(servicePagesPath, servicePagesContentDefault as ServicePagesPayload)

export const saveServicePagesContent = (content: ServicePagesPayload) =>
  writeJsonFile(servicePagesPath, content)

export const getAdminSummary = async () => {
  const [homeSlider, catalog, homeContent, gallery, catalogPages, seo, landingPages, servicePages] = await Promise.all([
    getHomeSliderContent(),
    getCatalogContent(),
    getHomeContent(),
    getHomeGalleryContent(),
    getCatalogPagesContent(),
    getSiteSeoContent(),
    getShowCollectionsContent(),
    getServicePagesContent()
  ])

  return {
    slides: homeSlider.length,
    shows: catalog.shows.length,
    categories: catalog.masterClassCategories.length,
    workshops: catalog.workshops.length,
    homeContentSections:
      homeContent.scenario.cards.length + homeContent.shorts.items.length + homeContent.faq.items.length + homeContent.about.tags.length,
    catalogPageSections:
      catalogPages.shows.faq.items.length + catalogPages.masterClasses.faq.items.length,
    galleryItems: gallery.items.length,
    landingPages: Object.keys(landingPages).length + Object.keys(servicePages).length,
    seoSections: 7,
    siteUrl: seo.siteUrl,
    updatedAt: new Date().toISOString()
  }
}
