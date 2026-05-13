const HOUR_MASTER_PREFIX_PATTERN = /1\s*\u0447\u0430\u0441\s*\(1\s*\u043C\u0430\u0441\u0442\u0435\u0440\)\s*[—-]\s*/giu
const FROM_AMOUNT_PATTERN = /(?:\u043E\u0442)\s*([\d\s]+)(?=\s*(?:\u20BD|\u0440\u0443\u0431\.?))/iu
const ANY_AMOUNT_PATTERN = /([\d\s]+)(?=\s*(?:\u20BD|\u0440\u0443\u0431\.?))/iu

const normalizeSpaces = (value: string) => value.replace(/\s{2,}/g, ' ').trim()

const parseAmount = (value?: string) => {
  const amount = Number.parseInt((value || '').replace(/\s+/g, ''), 10)
  return Number.isFinite(amount) && amount > 0 ? amount : null
}

const formatAmount = (value: number) => value.toLocaleString('ru-RU').replace(/ /g, ' ')

export const formatDisplayPrice = (value?: string) => {
  if (!value) {
    return ''
  }

  const normalized = normalizeSpaces(value.replace(HOUR_MASTER_PREFIX_PATTERN, ''))
  const fromMatch = normalized.match(FROM_AMOUNT_PATTERN)
  const fromAmount = parseAmount(fromMatch?.[1])

  if (fromAmount !== null) {
    return `от ${formatAmount(fromAmount)} ₽`
  }

  const amountMatch = normalized.match(ANY_AMOUNT_PATTERN)
  const amount = parseAmount(amountMatch?.[1])

  if (amount !== null) {
    return `от ${formatAmount(amount)} ₽`
  }

  return normalized
}

export const extractPriceAmount = (value?: string) => {
  const normalized = formatDisplayPrice(value)
  const amountMatch = normalized.match(/([\d\s]+)(?=\s*\u20BD)/u)
  const amount = parseAmount(amountMatch?.[1])
  return amount !== null ? String(amount) : ''
}
