export type AboutVideoItem = {
  id: string
  title: string
  videoId: string
  poster: string
}

export type AboutGalleryItem = {
  src: string
  alt: string
}

export type AboutPortrait = {
  src: string
  alt: string
}

export const aboutSeoParagraphs = [
  'Magic Iris — творческая студия в Иркутске, которая помогает организовать праздник с красивой подачей, четким таймингом и сильным эмоциональным финалом.',
  'Мы создаём шоу-программы на свадьбу, день рождения, корпоратив, юбилей, выпускной и городские события: песочное шоу, световое шоу, шоу-портреты и выездные мастер-классы.',
  'Если вам нужна организация праздника под ключ или отдельный сценический номер, подберём формат под площадку, количество гостей, бюджет и настроение вечера.'
]

export const aboutSeoTags = [
  'организация праздника',
  'шоу-программа на свадьбу',
  'день рождения',
  'корпоратив',
  'юбилей',
  'выпускной',
  'городское событие'
]

export const aboutPortrait: AboutPortrait = {
  src: 'https://static.tildacdn.com/tild3663-6330-4964-a535-323638313161/_2_-___1.jpg',
  alt: 'Художница Magic Iris за работой над песочной анимацией'
}

export const aboutVideoItems: AboutVideoItem[] = [
  {
    id: 'sand-show',
    title: 'Песочное шоу',
    videoId: 'nqqMVMssZAtV7mP6porCg5',
    poster: 'https://static.tildacdn.com/tild3730-6132-4364-a664-613439376538/_1.jpg'
  },
  {
    id: 'light-show',
    title: 'Световое шоу',
    videoId: '016uV7wzT71WAUbPV5n7HQ',
    poster: 'https://static.tildacdn.com/tild6231-6562-4735-a365-666531623531/_2.jpg'
  },
  {
    id: 'portrait-show',
    title: 'Шоу-портреты',
    videoId: 'gJwZ6zjzQ8GMQCS8VbXR2S',
    poster: 'https://static.tildacdn.com/tild3638-3434-4565-a633-383931363962/_3.jpg'
  },
  {
    id: 'spinning-portrait',
    title: 'Крутящийся портрет',
    videoId: 'bvSonFzmpz6TtPgTc4KADd',
    poster: 'https://static.tildacdn.com/tild3364-3631-4739-a662-303738313137/Group_427322100.jpg'
  }
]

export const aboutGalleryItems: AboutGalleryItem[] = [
  {
    src: 'https://static.tildacdn.com/tild6339-3136-4530-a238-396531636561/f724ad98-1f95-49dd-b.jpg',
    alt: 'Песочное шоу Magic Iris на мероприятии'
  },
  {
    src: 'https://static.tildacdn.com/tild6631-3266-4763-b339-303766626534/IMG_7551_-__.JPG',
    alt: 'Сценическая работа студии Magic Iris'
  },
  {
    src: 'https://static.tildacdn.com/tild6632-6536-4365-a430-393637316664/IMG_0458_-__.JPG',
    alt: 'Выступление Magic Iris на празднике'
  },
  {
    src: 'https://static.tildacdn.com/tild6634-6234-4738-a261-376237363965/IMG_1970_-__.JPG',
    alt: 'Оформление и шоу на площадке'
  },
  {
    src: 'https://static.tildacdn.com/tild3139-3835-4565-b536-376562343336/IMG_1971_-__.JPG',
    alt: 'Гости мероприятия и атмосфера шоу'
  },
  {
    src: 'https://static.tildacdn.com/tild3166-6262-4631-a563-663636663262/__-__.JPG',
    alt: 'Творческая студия Magic Iris в работе'
  },
  {
    src: 'https://static.tildacdn.com/tild3266-6435-4563-b332-613761316430/IMG_1973_-__.JPG',
    alt: 'Событие с шоу-программой Magic Iris'
  },
  {
    src: 'https://static.tildacdn.com/tild3062-3533-4661-b666-303737376131/IMG_4692_-___1.jpg',
    alt: 'Шоу-программа для свадьбы и праздника'
  }
]
