import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  masterClassCategories,
  showPrograms,
  workshopItems
} from '../data/catalog.ts'

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const cmsDir = join(rootDir, 'data', 'cms')

const homeSlider = [
  {
    id: 'slide-hero-1',
    eyebrow: 'Творческая студия в Иркутске',
    title: 'Шоу и мастер-классы, созданные специально для вашего события',
    script: 'в Иркутске',
    summary:
      'Оставьте заявку и мы подберём песочное шоу, световой номер, шоу-портрет или выездной мастер-класс под формат вашего праздника.',
    buttonLabel: 'заказать шоу',
    buttonHref: 'https://wa.me/79501225413',
    image: 'images/hero.webp',
    imageAlt: 'Magic Iris event show',
    active: true
  }
]

const catalogContent = {
  shows: showPrograms,
  masterClassCategories,
  workshops: workshopItems
}

const writeJson = async (fileName, value) => {
  const target = join(cmsDir, fileName)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

await writeJson('home-slider.json', homeSlider)
await writeJson('catalog-content.json', catalogContent)

console.log('Seeded CMS JSON into data/cms')
