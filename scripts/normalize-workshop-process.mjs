import fs from 'node:fs'
import path from 'node:path'

const PROCESS_SIZE_TOKEN_RE = /\bA\d(?:,\s*A\d)*\b/gu
const PROCESS_BREAK_RE = /\s+(?=(?:[A-ZА-ЯЁ][a-zа-яё]|[A-ZА-ЯЁ]\s+[a-zа-яё]{2,}))/gu
const LEGACY_DO_PARTICIPANTS_RE =
  /\s+(?=(?:\u0414\u043e|\u0434\u043e)\s+\d+\s+\u0443\u0447\u0430\u0441\u0442)/gu
const LEGACY_PRICE_DEPENDS_RE =
  /\s+(?=\u0421\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c\s+\u0437\u0430\u0432\u0438\u0441\u0438\u0442)/gu
const LEGACY_CAN_BE_BRANDED_RE =
  /\s+(?=\u0412\u043e\u0437\u043c\u043e\u0436\u043d\u043e\s+\u0438\u0437\u0433\u043e\u0442\u043e\u0432\u043b\u0435\u043d\u0438\u0435)/gu

const normalizeLineSpaces = (value) =>
  value
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')

const protectProcessSizeTokens = (value) => {
  const tokens = []
  const text = value.replace(PROCESS_SIZE_TOKEN_RE, (match) => {
    const token = `__PROCESS_SIZE_TOKEN_${tokens.length}__`
    tokens.push(match)
    return token
  })

  return {
    text,
    restore(input) {
      return tokens.reduce(
        (result, tokenValue, index) =>
          result.replaceAll(`__PROCESS_SIZE_TOKEN_${index}__`, tokenValue),
        input
      )
    }
  }
}

const normalizeWorkshopProcessText = (value = '') => {
  const source = normalizeLineSpaces(value)

  if (!source) {
    return ''
  }

  const protectedText = protectProcessSizeTokens(source)
  const withBreaks = protectedText.text
    .split('\n')
    .map((line) => line.replace(PROCESS_BREAK_RE, '\n'))
    .join('\n')
    .replace(/\n{2,}/g, '\n')
    .trim()

  return protectedText.restore(withBreaks)
}

const normalizeWorkshopLegacyMultilineText = (value = '') =>
  normalizeLineSpaces(value)
    .replace(LEGACY_DO_PARTICIPANTS_RE, '\n')
    .replace(LEGACY_PRICE_DEPENDS_RE, '\n')
    .replace(LEGACY_CAN_BE_BRANDED_RE, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim()

const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const targetPath = path.resolve('data/cms/workshop-legacy-layouts.json')
const backupPath = path.resolve(`data/cms/workshop-legacy-layouts.backup-${stamp}.json`)

const source = fs.readFileSync(targetPath, 'utf8')
const payload = JSON.parse(source)

fs.writeFileSync(backupPath, source, 'utf8')

let changed = 0
let processChanged = 0
let metaChanged = 0
let priceChanged = 0
let cardDetailsChanged = 0
let cardPriceChanged = 0

for (const [id, layout] of Object.entries(payload)) {
  if (!layout || typeof layout !== 'object') {
    continue
  }

  if (typeof layout.whatProcess === 'string') {
    const normalizedProcess = normalizeWorkshopProcessText(layout.whatProcess)

    if (normalizedProcess !== layout.whatProcess) {
      payload[id].whatProcess = normalizedProcess
      changed += 1
      processChanged += 1
    }
  }

  if (typeof layout.whatMeta === 'string') {
    const normalizedMeta = normalizeWorkshopLegacyMultilineText(layout.whatMeta)

    if (normalizedMeta !== layout.whatMeta) {
      payload[id].whatMeta = normalizedMeta
      changed += 1
      metaChanged += 1
    }
  }

  if (typeof layout.whatPrice === 'string') {
    const normalizedPrice = normalizeWorkshopLegacyMultilineText(layout.whatPrice)

    if (normalizedPrice !== layout.whatPrice) {
      payload[id].whatPrice = normalizedPrice
      changed += 1
      priceChanged += 1
    }
  }

  if (Array.isArray(layout.formatCards)) {
    for (const [cardIndex, card] of layout.formatCards.entries()) {
      if (!card || typeof card !== 'object') {
        continue
      }

      if (typeof card.details === 'string') {
        const normalizedDetails = normalizeWorkshopLegacyMultilineText(card.details)

        if (normalizedDetails !== card.details) {
          payload[id].formatCards[cardIndex].details = normalizedDetails
          changed += 1
          cardDetailsChanged += 1
        }
      }

      if (typeof card.price === 'string') {
        const normalizedCardPrice = normalizeWorkshopLegacyMultilineText(card.price)

        if (normalizedCardPrice !== card.price) {
          payload[id].formatCards[cardIndex].price = normalizedCardPrice
          changed += 1
          cardPriceChanged += 1
        }
      }
    }
  }
}

fs.writeFileSync(targetPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

console.log(`Backup: ${backupPath}`)
console.log(`Updated fields: ${changed}`)
console.log(`  whatProcess: ${processChanged}`)
console.log(`  whatMeta: ${metaChanged}`)
console.log(`  whatPrice: ${priceChanged}`)
console.log(`  formatCards[].details: ${cardDetailsChanged}`)
console.log(`  formatCards[].price: ${cardPriceChanged}`)
