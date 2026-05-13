import type { CatalogPagesContent } from '~/data/catalog-pages'

const createEmptyShort = () => ({
  id: `short-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  title: '',
  videoId: '',
  poster: ''
})

export const createEmptyCatalogPagesContent = (): CatalogPagesContent => ({
  shows: {
    hero: {
      eyebrow: '',
      title: '',
      description: '',
      image: '',
      facts: [
        { label: '', value: '' },
        { label: '', value: '' },
        { label: '', value: '' }
      ],
      tags: ['', '', '', ''],
      actions: [
        { label: '', href: '/#contacts', kind: 'primary' },
        { label: '', href: '/master-classes', kind: 'ghost' }
      ]
    },
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
    hero: {
      eyebrow: '',
      title: '',
      description: '',
      image: '',
      facts: [],
      tags: [],
      actions: [
        { label: '', href: '/#contacts', kind: 'primary' },
        { label: '', href: '/shows', kind: 'ghost' }
      ]
    },
    text: {
      eyebrow: '',
      title: '',
      lead: '',
      paragraphs: ['']
    },
    shorts: {
      eyebrow: 'Shorts',
      title: '',
      description: '',
      items: [createEmptyShort(), createEmptyShort(), createEmptyShort(), createEmptyShort(), createEmptyShort()]
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
