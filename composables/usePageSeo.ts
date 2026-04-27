import { buildAbsoluteUrl } from '~/data/site-seo'

type SeoPayload = {
  title: string
  description: string
}

export const usePageSeo = (seo: MaybeRefOrGetter<SeoPayload>) => {
  const route = useRoute()
  const resolvedSeo = computed(() => toValue(seo))

  useSeoMeta({
    title: () => resolvedSeo.value.title,
    description: () => resolvedSeo.value.description,
    ogTitle: () => resolvedSeo.value.title,
    ogDescription: () => resolvedSeo.value.description,
    twitterTitle: () => resolvedSeo.value.title,
    twitterDescription: () => resolvedSeo.value.description
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
