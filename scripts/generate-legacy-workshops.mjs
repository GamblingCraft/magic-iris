import fs from 'node:fs'
import path from 'node:path'

const workspaceRoot = process.cwd()
const legacyRoot = 'C:/Users/admin/Downloads/magiciris.ru/magiciris.ru'
const outputFile = path.join(workspaceRoot, 'data', 'workshops.generated.ts')

const categoryConfigs = [
  {
    slug: 'dlya-zhenshchin',
    title: 'Для женщин',
    sourceFile: 'forwoman.html',
    formats: ['Девичники', 'Женские события', 'Камерные праздники', 'Корпоративы']
  },
  {
    slug: 'dlya-muzhchin',
    title: 'Для мужчин',
    sourceFile: 'formen.html',
    formats: ['Мужские компании', 'Корпоративы', 'Тематические вечеринки', 'Командные события']
  },
  {
    slug: 'novogodnie',
    title: 'Новогодние',
    sourceFile: 'newyer.html',
    formats: ['Новогодние корпоративы', 'Торговые центры', 'Зимние фестивали', 'Семейные праздники']
  },
  {
    slug: 'v-shkolu',
    title: 'В школу',
    sourceFile: 'school.html',
    formats: ['Школы', 'Классы', 'Лагеря', 'Детские группы']
  },
  {
    slug: 'letnie',
    title: 'Летние',
    sourceFile: 'summer.html',
    formats: ['Летние фестивали', 'Городские праздники', 'Уличные площадки', 'Семейные события']
  }
]

const primaryCategoryPriority = [
  'novogodnie',
  'v-shkolu',
  'letnie',
  'dlya-muzhchin',
  'dlya-zhenshchin'
]

const transliterationMap = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya'
}

const normalizeWhitespace = (value) => value.replace(/\s+/g, ' ').trim()

const decodeEntities = (value) =>
  value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&laquo;/gi, '«')
    .replace(/&raquo;/gi, '»')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&')

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const stripHtml = (html) =>
  normalizeWhitespace(
    decodeEntities(
      html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
    )
  )

const extractLinkedWorkshopNumbers = (html) =>
  [...new Set([...html.matchAll(/href="(\d+)\.html"/g)].map((match) => Number(match[1])))]

const extractImages = (html) => {
  const matches = [
    ...html.matchAll(/data-original=['"](?<src>https:\/\/[^'"]+)['"]/g),
    ...html.matchAll(/\ssrc=['"](?<src>https:\/\/static\.tildacdn\.com[^'"]+)['"]/g),
    ...html.matchAll(/background-image:url\(['"]?(?<src>https:\/\/[^'")]+)['"]?\)/g)
  ]

  const ignoredFragments = [
    'telegram.png',
    'vk.png',
    '_133x.png',
    'whatsapp',
    'logo',
    'favicon',
    'tildacopy_black.png'
  ]
  const unique = []

  for (const match of matches) {
    const src = match.groups?.src?.trim()

    if (!src) {
      continue
    }

    if (ignoredFragments.some((fragment) => src.toLowerCase().includes(fragment))) {
      continue
    }

    if (!/\.(jpg|jpeg|png|webp)(\?|$)/i.test(src)) {
      continue
    }

    if (!unique.includes(src)) {
      unique.push(src)
    }
  }

  return unique.slice(0, 3)
}

const sentenceBlacklist = [
  /^форматы проведения$/i,
  /^что будет на мастер-классе\??$/i,
  /^потоковый формат$/i,
  /^заказать мастер-класс$/i,
  /^заказать$/i,
  /^стоимость:/i,
  /^стоимость зависит/i,
  /^возможно изготовление деталей/i,
  /^время создания работы/i,
  /^время изготовления/i,
  /^пропускная способность/i,
  /^общее количество/i,
  /^продолжительность:/i,
  /^до \d+/i,
  /^формат подходит/i,
  /^мк\d+/i
]

const cleanWorkshopText = (text) =>
  normalizeWhitespace(
    text
      .split(/Главная\s+Для женщин/i)[0]
      .split(/Полный каталог/i)[0]
      .replace(/ФОРМАТЫ ПРОВЕДЕНИЯ/gi, '. ')
      .replace(/ЧТО БУДЕТ НА МАСТЕР-КЛАССЕ\??/gi, '. ')
      .replace(/ПОТОКОВЫЙ ФОРМАТ/gi, '. ')
      .replace(/ГРУППОВОЙ ФОРМАТ/gi, '. ')
      .replace(/ЗАКАЗАТЬ МАСТЕР-КЛАСС/gi, '. ')
      .replace(/Стоимость:/gi, '. Стоимость: ')
      .replace(/Стоимость зависит/gi, '. Стоимость зависит')
      .replace(/Возможно изготовление/gi, '. Возможно изготовление')
      .replace(/Время изготовления/gi, '. Время изготовления')
      .replace(/Время создания/gi, '. Время создания')
      .replace(/Пропускная способность/gi, '. Пропускная способность')
      .replace(/Общее количество участников/gi, '. Общее количество участников')
      .replace(/Продолжительность:/gi, '. Продолжительность: ')
      .replace(/Формат подходит/gi, '. Формат подходит')
  )

const splitSentences = (text) =>
  text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => normalizeWhitespace(sentence))
    .filter(Boolean)

const isMostlyUppercase = (sentence) => {
  const letters = sentence.replace(/[^A-Za-zА-Яа-яЁё]/g, '')

  if (letters.length < 6) {
    return false
  }

  return letters === letters.toUpperCase()
}

const pickContentSentences = (text, title) =>
  splitSentences(
    cleanWorkshopText(
      text
      .replace(new RegExp(`^МК\\d+\\.\\s*${escapeRegExp(title)}`, 'i'), '')
      .replace(new RegExp(`^${escapeRegExp(title)}`, 'i'), '')
    )
  ).filter((sentence) => {
    if (sentence.length < 36) {
      return false
    }

    if (isMostlyUppercase(sentence)) {
      return false
    }

    return !sentenceBlacklist.some((pattern) => pattern.test(sentence))
  })

const extractTitle = (html) => {
  const rawTitle = normalizeWhitespace(decodeEntities(html.match(/<title>(.*?)<\/title>/s)?.[1] || ''))

  return rawTitle.replace(/^МК\d+\.\s*/i, '').trim()
}

const extractPriceFrom = (text) => {
  const match = text.match(
    /Стоимость:\s*(.+?)(?=(?:Стоимость зависит|Время изготовления|Пропускная способность|Общее количество|Идеально для|Создание|Формы на выбор|Декор|В результате|Уютный|ПОТОКОВЫЙ ФОРМАТ|ЗАКАЗАТЬ|Продолжительность|До \d+ участников|Формат подходит|$))/i
  )

  return normalizeWhitespace(match?.[1] || 'по запросу')
}

const extractPriceNote = (text) => {
  const match = text.match(
    /(Стоимость зависит[^.?!]*[.?!]?|Возможно изготовление[^.?!]*[.?!]?|Финальная стоимость[^.?!]*[.?!]?)/i
  )

  return normalizeWhitespace(match?.[1] || 'Стоимость зависит от формата площадки, количества гостей и сценария проведения.')
}

const extractDuration = (text, priceFrom) => {
  const patterns = [
    /Время изготовления(?: одной [^:]+)?:\s*(.+?)(?=(?:Пропускная способность|Общее количество|Идеально для|Создание|Формы на выбор|Декор|В результате|Уютный|ПОТОКОВЫЙ ФОРМАТ|ЗАКАЗАТЬ|$))/i,
    /Продолжительность:\s*(.+?)(?=(?:До \d+ участников|Формат подходит|ЗАКАЗАТЬ|$))/i,
    /Длительность:\s*(.+?)(?=(?:Количество участников|Пропускная способность|ЗАКАЗАТЬ|$))/i
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) {
      return normalizeWhitespace(match[1])
    }
  }

  const fallback = priceFrom.match(/^(.+?)\s+—\s+/)
  return normalizeWhitespace(fallback?.[1] || '1 час')
}

const extractParticipants = (text) => {
  const patterns = [
    /Пропускная способность:\s*(.+?)(?=(?:Общее количество|Идеально для|Создание|Формы на выбор|Декор|В результате|Уютный|ПОТОКОВЫЙ ФОРМАТ|ЗАКАЗАТЬ|$))/i,
    /(Общее количество участников[^.?!]*[.?!]?)/i,
    /(До \d+ участников[^.?!]*[.?!]?)/i
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) {
      return normalizeWhitespace(match[1].replace(/^[—-]\s*/, ''))
    }
  }

  return 'под формат события'
}

const slugify = (value, slugUsageMap) => {
  const base = normalizeWhitespace(
    value
      .toLowerCase()
      .split('')
      .map((char) => transliterationMap[char] ?? char)
      .join('')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  )

  const nextIndex = (slugUsageMap.get(base) || 0) + 1
  slugUsageMap.set(base, nextIndex)

  return nextIndex === 1 ? base : `${base}-${nextIndex}`
}

const formatAudienceLabel = (categorySlugs) =>
  categoryConfigs
    .filter((category) => categorySlugs.includes(category.slug))
    .map((category) => category.title)
    .join(' · ')

const buildFormats = (categorySlugs) =>
  [...new Set(categoryConfigs.flatMap((category) => (categorySlugs.includes(category.slug) ? category.formats : [])))]
    .filter(Boolean)
    .slice(0, 4)

const buildPricing = (priceFrom, priceNote) => [
  {
    label: 'Базовый формат',
    value: priceFrom
  },
  {
    label: 'Индивидуальные условия',
    value: 'по запросу',
    note: priceNote
  }
]

const buildDescription = (sentences, title, categorySlugs) => {
  if (sentences.length >= 2) {
    return `${sentences[0]} ${sentences[1]}`
  }

  if (sentences.length === 1) {
    return sentences[0]
  }

  return `${title} — выездной мастер-класс с аккуратной подачей, понятным процессом и красивым результатом для гостей. Формат удобно адаптируется под площадку, количество участников и тайминг мероприятия.`
}

const buildIncludes = (sentences, priceNote) => {
  const picked = sentences.slice(0, 3)

  if (picked.length >= 2) {
    return picked
  }

  return [
    'Все материалы и расходники для проведения мастер-класса.',
    'Работа мастера и организация комфортной творческой зоны.',
    priceNote
  ]
}

const buildGallery = (title, images) => {
  const fallback = images[0] || 'https://static.tildacdn.com/tild3062-6134-4135-a432-623636346266/_133x.png'
  const source = images.length > 0 ? images : [fallback]

  return source.slice(0, 3).map((src, index) => ({
    id: `${index + 1}`,
    src,
    alt: `${title} — фото ${index + 1}`
  }))
}

const inferFallbackCategories = (title, text) => {
  const haystack = `${title} ${text}`.toLowerCase()
  const inferred = []

  if (/(новогод|ёлоч|елоч|рождеств|снеж|зимн)/i.test(haystack)) {
    inferred.push('novogodnie')
  }

  if (/(школ|класс|лагер|детск|выпускн)/i.test(haystack)) {
    inferred.push('v-shkolu')
  }

  if (/(летн|улич|парк|фестив|пляж)/i.test(haystack)) {
    inferred.push('letnie')
  }

  if (/(мужск|барбек|галстук|кепк|кожан|брелок)/i.test(haystack)) {
    inferred.push('dlya-muzhchin')
  }

  if (inferred.length === 0) {
    inferred.push('dlya-zhenshchin')
  }

  return [...new Set(inferred)]
}

const categoryAssignments = new Map()

for (const category of categoryConfigs) {
  const source = fs.readFileSync(path.join(legacyRoot, category.sourceFile), 'utf8')
  const linkedPages = extractLinkedWorkshopNumbers(source)

  for (const pageNumber of linkedPages) {
    const existing = categoryAssignments.get(pageNumber) ?? new Set()
    existing.add(category.slug)
    categoryAssignments.set(pageNumber, existing)
  }
}

const slugUsageMap = new Map()
const workshopFiles = fs
  .readdirSync(legacyRoot)
  .filter((fileName) => /^\d+\.html$/.test(fileName))
  .sort((left, right) => Number(left.replace('.html', '')) - Number(right.replace('.html', '')))

const generatedWorkshopItems = workshopFiles.map((fileName) => {
  const legacyNumber = Number(fileName.replace('.html', ''))
  const html = fs.readFileSync(path.join(legacyRoot, fileName), 'utf8')
  const title = extractTitle(html)
  const text = stripHtml(html)
  const categorySlugs = [...(categoryAssignments.get(legacyNumber) ?? inferFallbackCategories(title, text))]
  const primaryCategorySlug =
    primaryCategoryPriority.find((slug) => categorySlugs.includes(slug)) ?? categorySlugs[0] ?? 'dlya-zhenshchin'
  const images = extractImages(html)
  const contentSentences = pickContentSentences(text, title)
  const priceFrom = extractPriceFrom(text)
  const priceNote = extractPriceNote(text)
  const duration = extractDuration(text, priceFrom)
  const participants = extractParticipants(text)
  const gallery = buildGallery(title, images)
  const slug = slugify(title, slugUsageMap)
  const summary = contentSentences[0]
    ? contentSentences[0]
    : `${title} — выездной мастер-класс с красивым результатом и понятной механикой для гостей события.`
  const description = buildDescription(contentSentences, title, categorySlugs)
  const includes = buildIncludes(contentSentences.slice(1), priceNote)

  return {
    id: `workshop-${legacyNumber.toString().padStart(3, '0')}`,
    slug,
    title,
    primaryCategorySlug,
    categorySlugs,
    audienceLabel: formatAudienceLabel(categorySlugs),
    summary,
    description,
    priceFrom,
    priceNote,
    image: gallery[0].src,
    gallery: gallery.map((image) => ({
      ...image,
      id: `${slug}-${image.id}`
    })),
    duration,
    participants,
    formats: buildFormats(categorySlugs),
    includes,
    pricing: buildPricing(priceFrom, priceNote)
  }
})

const output = `// This file is auto-generated from legacy Tilda workshop pages.\n// Run \`node scripts/generate-legacy-workshops.mjs\` to refresh it.\n\nexport const generatedWorkshopItems = ${JSON.stringify(
  generatedWorkshopItems,
  null,
  2
)}\n`

fs.writeFileSync(outputFile, output, 'utf8')

const uncategorized = generatedWorkshopItems.filter((item) => item.categorySlugs.length === 0)
const counts = categoryConfigs.map((category) => ({
  slug: category.slug,
  count: generatedWorkshopItems.filter((item) => item.categorySlugs.includes(category.slug)).length
}))

console.log(`Generated ${generatedWorkshopItems.length} workshops -> ${path.relative(workspaceRoot, outputFile)}`)
console.log(JSON.stringify({ counts, uncategorized: uncategorized.length }, null, 2))
