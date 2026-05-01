import {
  createMasterClassCategoryHref,
  createShowHref,
  featuredWorkshopFormats as catalogFeaturedWorkshopFormats,
  masterClassCategories as catalogMasterClassCategories,
  showPrograms as catalogShowPrograms
} from './catalog'

export type NavLink = {
  label: string
  href: string
  children?: NavLink[]
}

export const topTags = [
  'Творческая студия',
  'Иркутск',
  'Свадьбы и события',
  'Выездной формат'
]

export const mainNavigation: NavLink[] = [
  { label: 'Песочное шоу', href: '/shows/pesochnoe-shou' },
  { label: 'Световое шоу', href: '/shows/svetovoe-shou' },
  { label: 'Шоу-портреты', href: '/shows/shou-portrety' },
  { label: 'Крутящийся портрет', href: '/shows/krutyashchiysya-portret' },
  { label: 'Мастер-классы', href: '/master-classes' },
  { label: 'О студии', href: '/#about' },
  { label: 'Отзывы', href: '/#reviews' },
  { label: 'Контакты', href: '/contacts' }
]

export const contactInfo = {
  phoneDisplay: '+7 (950) 122-54-13',
  phoneRaw: '+79501225413',
  telegram: 'https://t.me/iris_magic',
  whatsapp: 'https://wa.me/79501225413',
  vk: 'https://vk.com/iris_show',
  max: 'https://wa.me/79501225413'
}

export const heroHighlights = [
  'Песочное шоу',
  'Световое шоу',
  'Шоу-портреты',
  'Мастер-классы'
]

export const serviceHighlights = [
  {
    title: 'Сценарий под ваше событие',
    description:
      'Подбираем формат, длительность и визуальную подачу под площадку, гостей и настроение вечера.'
  },
  {
    title: 'Впечатление с первых секунд',
    description:
      'Создаём сильное первое впечатление через свет, историю и выразительную визуальную подачу.'
  },
  {
    title: 'Команда и техника под ключ',
    description:
      'Приезжаем с оборудованием, встраиваемся в тайминг и берём организационную часть на себя.'
  }
]

export const showPrograms = catalogShowPrograms

export const featuredWorkshopFormats = catalogFeaturedWorkshopFormats

export const masterClassCategories = catalogMasterClassCategories

export const valueKeywords = [
  'Красочно',
  'Неповторимо',
  'Ярко',
  'Эмоционально',
  'Трогательно',
  'Стильно',
  'Профессионально',
  'Эффектно',
  'Волшебно',
  'Запоминается'
]

export const valueCards = [
  {
    title: 'Ваша история',
    description:
      'Все самые важные моменты можно рассказать волшебным образом через песочную или световую анимацию.'
  },
  {
    title: 'Сервис',
    description:
      'Минимум вашего участия в организации. Достаточно отправить адрес, время или контакт ведущего.'
  },
  {
    title: 'Полный комплект',
    description:
      'Мы привозим с собой всё необходимое оборудование и адаптируемся под формат площадки.'
  },
  {
    title: 'Качество',
    description:
      'Сценарий, визуальные акценты и макеты согласовываются заранее, чтобы вы были уверены в результате.'
  }
]

export const footerColumns = [
  {
    title: 'Шоу',
    links: showPrograms.map((program) => ({
      label: program.title,
      href: createShowHref(program.slug)
    }))
  },
  {
    title: 'Мастер-классы',
    links: masterClassCategories.map((category) => ({
      label: category.title,
      href: createMasterClassCategoryHref(category.slug)
    }))
  },
  {
    title: 'Студия',
    links: [
      { label: 'О нас', href: '/#about' },
      { label: 'Отзывы', href: '/#reviews' },
      { label: 'Контакты', href: '/contacts' }
    ]
  }
]
