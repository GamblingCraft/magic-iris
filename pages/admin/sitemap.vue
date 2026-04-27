<script setup lang="ts">
type SitemapPreviewEntry = {
  url: string
  path: string
  priority: string
  changefreq: string
}

type SitemapPreviewPayload = {
  siteUrl: string
  sitemapUrl: string
  entries: SitemapPreviewEntry[]
  xml: string
}

definePageMeta({
  layout: 'admin'
})

const { data, refresh } = await useFetch<SitemapPreviewPayload>('/api/admin/sitemap-preview', {
  key: 'admin-sitemap-preview'
})

const groupedCounts = computed(() => {
  const entries = data.value?.entries || []

  return [
    { label: 'Всего URL', value: entries.length },
    { label: 'Шоу', value: entries.filter((item) => item.path.startsWith('/shows/')).length },
    {
      label: 'Категории',
      value: entries.filter((item) => /^\/master-classes\/[^/]+$/u.test(item.path)).length
    },
    {
      label: 'Мастер-классы',
      value: entries.filter((item) => /^\/master-classes\/[^/]+\/[^/]+$/u.test(item.path)).length
    }
  ]
})
</script>

<template>
  <div class="admin-grid">
    <section class="admin-grid admin-grid--stats">
      <article v-for="card in groupedCounts" :key="card.label" class="admin-card admin-stat">
        <p class="admin-card__muted">{{ card.label }}</p>
        <div class="admin-stat__value">{{ card.value }}</div>
      </article>
    </section>

    <section class="admin-card">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">Генератор sitemap.xml</h3>
          <p class="admin-card__descr">
            Sitemap собирается автоматически из главной, каталога шоу, каталога мастер-классов,
            категорий и всех детальных карточек.
          </p>
        </div>
      </div>

      <div class="admin-actions">
        <a
          :href="data?.sitemapUrl || '/sitemap.xml'"
          target="_blank"
          rel="noreferrer"
          class="admin-button admin-button--accent"
        >
          Открыть sitemap.xml
        </a>
        <button type="button" class="admin-button" @click="refresh()">Обновить генерацию</button>
      </div>

      <div class="admin-note-card">
        <strong>Базовый URL</strong>
        <p>{{ data?.siteUrl }}</p>
      </div>
    </section>

    <section class="admin-card">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">Предпросмотр XML</h3>
          <p class="admin-card__descr">
            Можно быстро проверить, что sitemap отдаёт правильные URL и секции.
          </p>
        </div>
      </div>

      <div class="admin-code-preview">
        <pre>{{ data?.xml }}</pre>
      </div>
    </section>

    <section class="admin-card">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">URL в sitemap</h3>
          <p class="admin-card__descr">Список адресов, которые сейчас попадут в sitemap.xml.</p>
        </div>
      </div>

      <div class="admin-sitemap-list">
        <article v-for="entry in data?.entries" :key="entry.url" class="admin-sitemap-row">
          <div class="admin-sitemap-row__meta">
            <strong>{{ entry.path }}</strong>
            <a :href="entry.url" target="_blank" rel="noreferrer">{{ entry.url }}</a>
          </div>

          <div class="admin-sitemap-row__facts">
            <span>priority: {{ entry.priority }}</span>
            <span>changefreq: {{ entry.changefreq }}</span>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
