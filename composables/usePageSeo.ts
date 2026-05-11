import { buildAbsoluteUrl } from '~/data/site-seo'

type SeoPayload = {
  title: string
  description: string
  keywords?: string
  image?: string
  imageAlt?: string
}

export const usePageSeo = (seo: MaybeRefOrGetter<SeoPayload>) => {
  const route = useRoute()
  const resolvedSeo = computed(() => toValue(seo))
  const absoluteImage = computed(() => {
    const image = resolvedSeo.value.image?.trim()
    return image ? buildAbsoluteUrl(image) : undefined
  })

  useSeoMeta({
    title: () => resolvedSeo.value.title,
    description: () => resolvedSeo.value.description,
    keywords: () => resolvedSeo.value.keywords,
    ogTitle: () => resolvedSeo.value.title,
    ogDescription: () => resolvedSeo.value.description,
    ogUrl: () => buildAbsoluteUrl(route.path),
    ogType: 'website',
    ogImage: () => absoluteImage.value,
    ogImageUrl: () => absoluteImage.value,
    ogImageAlt: () => resolvedSeo.value.imageAlt || resolvedSeo.value.title,
    twitterTitle: () => resolvedSeo.value.title,
    twitterDescription: () => resolvedSeo.value.description,
    twitterCard: 'summary_large_image',
    twitterImage: () => absoluteImage.value,
    twitterImageAlt: () => resolvedSeo.value.imageAlt || resolvedSeo.value.title
  })

  useHead({
    link: computed(() => [
      {
        rel: 'canonical',
        href: buildAbsoluteUrl(route.path)
      }
    ])
  })
}
