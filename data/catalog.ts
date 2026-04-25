import { generatedWorkshopItems } from './workshops.generated'

export type CatalogImage = {
  id: string
  src: string
  alt: string
}

export type CatalogFact = {
  label: string
  value: string
}

export type PricePoint = {
  label: string
  value: string
  note?: string
}

export type ShowProgram = {
  id: string
  slug: string
  title: string
  kicker: string
  description: string
  lead: string
  image: string
  heroImage: string
  gallery: CatalogImage[]
  facts: CatalogFact[]
  pricing: PricePoint[]
  features: string[]
  suitableFor: string[]
}

export type MasterClassCategory = {
  id: string
  slug: string
  title: string
  count: number
  description: string
  lead: string
  image: string
}

export type WorkshopItem = {
  id: string
  slug: string
  title: string
  primaryCategorySlug: string
  categorySlugs: string[]
  audienceLabel: string
  summary: string
  description: string
  priceFrom: string
  priceNote: string
  image: string
  gallery: CatalogImage[]
  duration: string
  participants: string
  formats: string[]
  includes: string[]
  pricing: PricePoint[]
}

export type HomeCatalogTile = {
  id: string
  title: string
  subtitle: string
  href: string
  image: string
  size: 'wide' | 'tall' | 'small' | 'medium'
}

export const createShowHref = (slug: string) => `/shows/${slug}`
export const createMasterClassCategoryHref = (slug: string) => `/master-classes/${slug}`
export const createMasterClassHref = (categorySlug: string, slug: string) =>
  `/master-classes/${categorySlug}/${slug}`

// These collections are intentionally normalized and id-based, so later we can
// swap this local file with admin/API data without rewriting page components.
export const shows: ShowProgram[] = [
  {
    id: 'show-sand',
    slug: 'pesochnoe-shou',
    title: 'Песочное шоу',
    kicker: 'Премьера вечера',
    description:
      'Живые истории, признания и воспоминания, которые оживают прямо на глазах гостей.',
    lead:
      'Песочная история любви, семейный фильм вживую или трогательное признание для момента, который хочется прожить глубоко и красиво.',
    image: 'https://static.tildacdn.com/tild3538-3434-4732-a138-646139626537/photo.jpg',
    heroImage: 'https://static.tildacdn.com/tild3538-3434-4732-a138-646139626537/photo.jpg',
    gallery: [
      {
        id: 'sand-1',
        src: 'https://static.tildacdn.com/tild3538-3434-4732-a138-646139626537/photo.jpg',
        alt: 'Песочное шоу на сцене'
      },
      {
        id: 'sand-2',
        src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80',
        alt: 'Свадебный вечер для песочного шоу'
      },
      {
        id: 'sand-3',
        src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80',
        alt: 'Камерное событие с живой историей'
      }
    ],
    facts: [
      { label: 'Длительность', value: '7–15 минут' },
      { label: 'Площадка', value: 'Банкетный зал, сцена, лофт' },
      { label: 'Подача', value: 'Индивидуальный сценарий под событие' }
    ],
    pricing: [
      { label: 'Свадьба и частный праздник', value: 'от 20 000 ₽' },
      { label: 'Корпоративный формат', value: 'от 30 000 ₽' },
      { label: 'Сложный индивидуальный сценарий', value: 'от 45 000 ₽', note: 'с несколькими сюжетными блоками и расширенной подготовкой' }
    ],
    features: [
      'Разрабатываем сюжет под вашу историю, тайминг вечера и площадку.',
      'Согласовываем ключевые кадры, музыкальное настроение и драматургию.',
      'Привозим всё необходимое оборудование и встраиваемся в программу мероприятия.'
    ],
    suitableFor: ['Свадьбы', 'Юбилеи', 'Камерные семейные события', 'Корпоративы']
  },
  {
    id: 'show-light',
    slug: 'svetovoe-shou',
    title: 'Световое шоу',
    kicker: 'Свет и сцена',
    description:
      'Яркий визуальный номер для сцены, первого впечатления и кульминации мероприятия.',
    lead:
      'Световой номер работает как сильное открытие, кульминация или финальный акцент, когда нужен вау-эффект с первых секунд.',
    image: 'https://static.tildacdn.com/tild6662-6566-4135-a333-633033613439/_-___1.jpg',
    heroImage: 'https://static.tildacdn.com/tild6662-6566-4135-a333-633033613439/_-___1.jpg',
    gallery: [
      {
        id: 'light-1',
        src: 'https://static.tildacdn.com/tild6662-6566-4135-a333-633033613439/_-___1.jpg',
        alt: 'Световое шоу для сцены'
      },
      {
        id: 'light-2',
        src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1400&q=80',
        alt: 'Сценическое шоу со светом'
      },
      {
        id: 'light-3',
        src: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=80',
        alt: 'Яркое вечернее событие'
      }
    ],
    facts: [
      { label: 'Длительность', value: '5–10 минут' },
      { label: 'Площадка', value: 'Сцена, зал, открытая площадка' },
      { label: 'Эффект', value: 'Открытие, кульминация, финал' }
    ],
    pricing: [
      { label: 'Стандартный номер', value: 'от 25 000 ₽' },
      { label: 'Сценический номер для крупного события', value: 'от 40 000 ₽' },
      { label: 'Расширенная постановка', value: 'по запросу', note: 'если нужна особая музыка, тайминг и адаптация под технический райдер' }
    ],
    features: [
      'Собираем эффектное визуальное вступление или финальную точку программы.',
      'Адаптируем номер под размер сцены, тайминг ведущего и формат аудитории.',
      'Берём на себя техническую часть и заранее проверяем условия площадки.'
    ],
    suitableFor: ['Корпоративы', 'Городские события', 'Свадьбы', 'Открытия']
  },
  {
    id: 'show-portraits',
    slug: 'shou-portrety',
    title: 'Шоу-портреты',
    kicker: 'Персональный арт-формат',
    description:
      'Формат-подарок, который удивляет и превращает момент в настоящее впечатление.',
    lead:
      'Шоу-портреты отлично работают как персональный подарок, сюрприз для юбиляра, молодожёнов или ключевого гостя вечера.',
    image: 'https://static.tildacdn.com/tild6330-3331-4530-b461-303038303931/photo-output_3_1.jpeg',
    heroImage: 'https://static.tildacdn.com/tild6330-3331-4530-b461-303038303931/photo-output_3_1.jpeg',
    gallery: [
      {
        id: 'portrait-1',
        src: 'https://static.tildacdn.com/tild6330-3331-4530-b461-303038303931/photo-output_3_1.jpeg',
        alt: 'Шоу-портрет в подарок'
      },
      {
        id: 'portrait-2',
        src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80',
        alt: 'Эмоциональный момент на празднике'
      },
      {
        id: 'portrait-3',
        src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=80',
        alt: 'Гости на торжественном событии'
      }
    ],
    facts: [
      { label: 'Длительность', value: '5–12 минут' },
      { label: 'Подача', value: 'Персональный сюрприз' },
      { label: 'Подходит', value: 'Подарок, поздравление, финальный выход' }
    ],
    pricing: [
      { label: 'Персональный портрет-шоу', value: 'от 18 000 ₽' },
      { label: 'Праздничная постановка с подводкой', value: 'от 28 000 ₽' },
      { label: 'Сценарная подача с несколькими героями', value: 'по запросу' }
    ],
    features: [
      'Собираем референсы, образ и эмоциональную подачу под конкретного человека.',
      'Подсказываем, в какую точку программы лучше встроить шоу для максимального эффекта.',
      'Помогаем сделать из формата не просто подарок, а полноценный момент вечера.'
    ],
    suitableFor: ['Юбилеи', 'Свадьбы', 'Дни рождения', 'Корпоративные награждения']
  },
  {
    id: 'show-rotating',
    slug: 'krutyashchiysya-portret',
    title: 'Крутящийся портрет',
    kicker: 'Точка притяжения гостей',
    description:
      'Необычная визуальная подача, которая работает и как шоу, и как эффектная фотозона.',
    lead:
      'Крутящийся портрет добавляет динамику в пространство, собирает внимание гостей и работает как заметная визуальная точка события.',
    image: 'https://static.tildacdn.com/tild3131-3431-4664-a531-306535306234/_-___1.jpg',
    heroImage: 'https://static.tildacdn.com/tild3131-3431-4664-a531-306535306234/_-___1.jpg',
    gallery: [
      {
        id: 'spin-1',
        src: 'https://static.tildacdn.com/tild3131-3431-4664-a531-306535306234/_-___1.jpg',
        alt: 'Крутящийся портрет на событии'
      },
      {
        id: 'spin-2',
        src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80',
        alt: 'Гости на вечернем мероприятии'
      },
      {
        id: 'spin-3',
        src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=80',
        alt: 'Событие с красивой визуальной подачей'
      }
    ],
    facts: [
      { label: 'Длительность', value: 'По таймингу события' },
      { label: 'Формат', value: 'Шоу + фотозона' },
      { label: 'Сценарий', value: 'Персонализация под героя события' }
    ],
    pricing: [
      { label: 'Базовый формат', value: 'от 22 000 ₽' },
      { label: 'Свадебная и премиальная подача', value: 'от 35 000 ₽' },
      { label: 'Индивидуальная концепция', value: 'по запросу' }
    ],
    features: [
      'Работает как визуальная интрига ещё до начала главной части программы.',
      'Хорошо смотрится в welcome-зоне, на банкете и в пространстве фотосъёмки.',
      'Легко адаптируется под частный праздник, корпоратив или фестивальный формат.'
    ],
    suitableFor: ['Welcome-зоны', 'Свадьбы', 'Корпоративы', 'Праздничные открытия']
  }
]

export const showPrograms = shows

export const masterClassCategories: MasterClassCategory[] = [
  {
    id: 'cat-women',
    slug: 'dlya-zhenshchin',
    title: 'Для женщин',
    count: 84,
    description:
      'Подборка эстетичных и творческих форматов для вечеринок, девичников и камерных событий.',
    lead:
      'Форматы с красивым результатом, неспешной атмосферой и удобной организацией для компаний, где важны эстетика и впечатление.',
    image: 'https://static.tildacdn.com/tild6132-3531-4531-b232-346130366665/37_.PNG'
  },
  {
    id: 'cat-men',
    slug: 'dlya-muzhchin',
    title: 'Для мужчин',
    count: 45,
    description:
      'Форматы с ярким результатом, вовлечением и удобной организацией для мужских компаний.',
    lead:
      'Собираем мастер-классы, где важны процесс, живое вовлечение, понятный результат и хорошая динамика для группы.',
    image: 'https://static.tildacdn.com/tild3562-6133-4533-b232-626666636233/36__.PNG'
  },
  {
    id: 'cat-new-year',
    slug: 'novogodnie',
    title: 'Новогодние',
    count: 19,
    description:
      'Сезонные мастер-классы для корпоративов, торговых центров, фестивалей и детских праздников.',
    lead:
      'Новогодние форматы для зимних событий, корпоративных активностей и праздничных зон с большим потоком гостей.',
    image: 'https://static.tildacdn.com/tild3932-3965-4330-b835-316633663038/35_.PNG'
  },
  {
    id: 'cat-school',
    slug: 'v-shkolu',
    title: 'В школу',
    count: 90,
    description:
      'Выездные форматы для классов, выпускных, лагерей и детских групп с понятной логистикой.',
    lead:
      'Практичные форматы для школ и детских групп, где важны безопасность, организованность и понятный результат для участников.',
    image: 'https://static.tildacdn.com/tild3737-3266-4235-b265-353964343266/34_.PNG'
  },
  {
    id: 'cat-summer',
    slug: 'letnie',
    title: 'Летние',
    count: 49,
    description:
      'Лёгкие и визуально яркие активности для фестивалей, городских праздников и уличных площадок.',
    lead:
      'Летние мастер-классы, которые удобно проводить на улице, в парках, на фестивалях и семейных площадках.',
    image: 'https://static.tildacdn.com/tild6137-3137-4566-b363-653038663136/33_.PNG'
  }
]

export const workshopItems: WorkshopItem[] = generatedWorkshopItems

export const featuredWorkshopFormats = workshopItems.slice(0, 6).map((workshop) => ({
  title: workshop.title,
  audience: workshop.audienceLabel,
  price: workshop.priceFrom,
  href: createMasterClassHref(workshop.primaryCategorySlug, workshop.slug)
}))

export const homeCatalogTiles: HomeCatalogTile[] = [
  {
    id: 'tile-sand',
    title: shows[0].title,
    subtitle: shows[0].kicker,
    href: createShowHref(shows[0].slug),
    image: shows[0].image,
    size: 'wide'
  },
  {
    id: 'tile-light',
    title: shows[1].title,
    subtitle: shows[1].kicker,
    href: createShowHref(shows[1].slug),
    image: shows[1].image,
    size: 'tall'
  },
  {
    id: 'tile-portraits',
    title: shows[2].title,
    subtitle: shows[2].kicker,
    href: createShowHref(shows[2].slug),
    image: shows[2].image,
    size: 'small'
  },
  {
    id: 'tile-rotating',
    title: shows[3].title,
    subtitle: shows[3].kicker,
    href: createShowHref(shows[3].slug),
    image: shows[3].image,
    size: 'small'
  },
  {
    id: 'tile-women',
    title: masterClassCategories[0].title,
    subtitle: `${masterClassCategories[0].count} форматов`,
    href: createMasterClassCategoryHref(masterClassCategories[0].slug),
    image: masterClassCategories[0].image,
    size: 'medium'
  },
  {
    id: 'tile-school',
    title: masterClassCategories[3].title,
    subtitle: `${masterClassCategories[3].count} форматов`,
    href: createMasterClassCategoryHref(masterClassCategories[3].slug),
    image: masterClassCategories[3].image,
    size: 'medium'
  },
  {
    id: 'tile-new-year',
    title: masterClassCategories[2].title,
    subtitle: `${masterClassCategories[2].count} форматов`,
    href: createMasterClassCategoryHref(masterClassCategories[2].slug),
    image: masterClassCategories[2].image,
    size: 'medium'
  }
]

export const getShowBySlug = (slug: string) => shows.find((item) => item.slug === slug)

export const getMasterClassCategoryBySlug = (slug: string) =>
  masterClassCategories.find((category) => category.slug === slug)

export const getWorkshopsByCategorySlug = (categorySlug: string) =>
  workshopItems.filter((item) => item.categorySlugs.includes(categorySlug))

export const getWorkshopBySlugs = (categorySlug: string, workshopSlug: string) =>
  workshopItems.find(
    (item) => item.slug === workshopSlug && item.categorySlugs.includes(categorySlug)
  )
