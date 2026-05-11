import type { CatalogPagesContent } from '~/data/catalog-pages'

export const createEmptyCatalogPagesContent = (): CatalogPagesContent => ({
  shows: {
    text: {
      eyebrow: '',
      title: '',
      lead: '',
      paragraphs: ['']
    },
    faq: {
      eyebrow: 'FAQ',
      title: '',
      titleAccent: '',
      description: '',
      items: [{ question: '', answer: '' }]
    }
  },
  masterClasses: {
    text: {
      eyebrow: '',
      title: '',
      lead: '',
      paragraphs: ['']
    },
    faq: {
      eyebrow: 'FAQ',
      title: '',
      titleAccent: '',
      description: '',
      items: [{ question: '', answer: '' }]
    }
  }
})
